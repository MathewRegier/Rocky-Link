import { getLead } from '../models/leadModel.js';
import axios from 'axios';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import multer from 'multer';

// Setup for file uploads
const upload = multer({ dest: 'uploads/' });

export const addLead = async (req, res) => {
    console.log("Received body:", req.body);  // Debugging line to view incoming data
    const Lead = await getLead();
    const { firstName, lastName, phone, email, campaign, portal, notes } = req.body;

    try {
        let lead = await Lead.findOne({ email, phone });
        if (lead) {
            lead.set({ firstName, lastName, phone, email, campaign, portal, notes });
            await lead.save();
            await sendToGoogleSheets(lead);
            return res.status(200).json({ message: "Lead updated successfully!", lead });
        }

        lead = new Lead({ firstName, lastName, phone, email, campaign, portal, notes });
        await lead.save();
        await sendToGoogleSheets(lead);
        return res.status(201).json({ message: "Lead added successfully!", lead });
    } catch (error) {
        console.error('Error adding/updating lead:', error);
        res.status(500).json({ message: "Error in lead operation: " + error.message });
    }
};

export const getLeads = async (req, res) => {
    const Lead = await getLead();  // Obtain the Lead model
    const pageSize = 50;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';

    const regex = new RegExp(search, 'i');  // 'i' for case insensitive
    const query = search ? {
        $or: [
            { firstName: { $regex: regex } },
            { lastName: { $regex: regex } }
        ]
    } : {};

    try {
        const count = await Lead.countDocuments(query);
        const leads = await Lead.find(query)
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .exec();

        res.json({
            leads,
            page,
            pages: Math.ceil(count / pageSize),
        });
    } catch (error) {
        console.error('Failed to retrieve leads:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const bulkAddLeads = async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    try {
        const filePath = req.file.path;
        const fileContent = fs.readFileSync(filePath);
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true
        });
        console.log(records); // Log to check the output structure
        const Lead = await getLead();
        await Lead.insertMany(records);
        fs.unlinkSync(filePath); // Clean up file after import
        res.status(201).send({ message: 'Bulk leads added successfully', count: records.length });
    } catch (error) {
        console.error('Error processing bulk CSV upload:', error);
        res.status(500).json({ error: 'Failed to process CSV file', message: error.message });
    }
};

async function sendToGoogleSheets(lead) {
    const googleSheetsUrl = 'https://script.google.com/macros/s/AKfycby3AMnd0kP5UkcI5QMHuDWIpMl1XJWSGEZ7MKy8--YXJ_JxuD1R4t1OjHJY7ZxwDw4A/exec';
    try {
        const response = await axios.post(googleSheetsUrl, lead.toJSON(), {
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.status !== 200) {
            throw new Error('Failed to send data to Google Sheets');
        }
    } catch (error) {
        console.error('Failed to send data to Google Sheets:', error);
    }
}
