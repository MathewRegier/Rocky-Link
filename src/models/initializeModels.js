import mongoose from 'mongoose';
import { connectLeadsDB } from '../config/db.js'; // Adjust this import path to where your db.js file is located
import createLeadModel from '../models/leadModel.js'; // Adjust this import path to where your leadModel.js file is located

// This function initializes all models and returns them
async function initializeModels() {
    try {
        const dbConnection = await connectLeadsDB(); // Establish the database connection
        const Lead = createLeadModel(dbConnection); // Create the Lead model
        console.log("Models have been initialized successfully.");
        return { Lead }; // Return an object containing all initialized models
    } catch (error) {
        console.error("Error initializing models:", error);
        throw new Error('Failed to initialize models due to database connection issues.');
    }
}

export default initializeModels;
