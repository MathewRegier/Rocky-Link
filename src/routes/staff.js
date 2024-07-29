// staff.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Staff from '../models/staff.js';
import Company from '../models/company.js';
import mongoose from 'mongoose';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register staff
router.post('/register', authenticateToken, async (req, res) => {
    try {
        const { name, email, password, permissions } = req.body;
        const companyId = req.user.companyId; // Extract companyId from the token
        console.log('Company ID from token:', companyId); // Debug log

        const validCompanyId = new mongoose.Types.ObjectId(companyId);

        // Optionally check if the company exists
        const company = await Company.findById(validCompanyId);
        if (!company) {
            return res.status(400).send({ message: 'Invalid company ID' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const staff = new Staff({ companyId: validCompanyId, name, email, password: hashedPassword, permissions });
        await staff.save();
        res.status(201).send({ message: 'Staff registered successfully' });
    } catch (error) {
        console.error('Error during staff registration:', error); // Debug log
        res.status(400).send(error);
    }
});

// Staff login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const staff = await Staff.findOne({ email });
        if (!staff || !await bcrypt.compare(password, staff.password)) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: staff._id, companyId: staff.companyId, userType: 'staff', permissions: staff.permissions }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({ token });
    } catch (error) {
        res.status(400).send(error);
    }
});

export default router;
