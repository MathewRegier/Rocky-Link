// app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // Import the path module
import { fileURLToPath } from 'url'; // Ensure correct import from 'url'
import { connectLoyaltyDB, connectLeadsDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import callRouter from './routes/callRoutes.js';
import contactRouter from './routes/contactRoutes.js';
import webhookRouter from './routes/webhookRoutes.js';
import leadRouter from './routes/leadRoutes.js'; // This will include your lead routes
import { getCustomFields, getWorkflows, addContactToWorkflow } from './api//GHL.js'; // Ensure this path is correct based on your project structure
import companyRouter from './routes/company.js';
import staffRouter from './routes/staff.js';
import customerRouter from './routes/customer.js';
import rewardRouter from './routes/reward.js';
import customerPointsRouter from './routes/customer_points.js';
import './queue.js'; // Import the queue to initialize processing

dotenv.config();

// Define __dirname using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
    try {
        await connectLeadsDB();
        await connectLoyaltyDB();
        console.log('Database connections established successfully.');

        const app = express();
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // Serve static files from the "public" directory
        app.use(express.static(path.join(__dirname, 'public')));

        // Route usages
        app.use(callRouter);
        app.use('/api/contacts', contactRouter);
        app.use(webhookRouter);
        app.use('/api', leadRouter); // This includes '/api/leads'
        app.use('/api/companies', companyRouter);
        app.use('/api/staff', staffRouter);
        app.use('/api/customers', customerRouter);
        app.use('/api/rewards', rewardRouter);
        app.use('/api/customer-points', customerPointsRouter);

        // New route to fetch custom fields
        app.get('/api/custom-fields', async (req, res) => {
            try {
                const apiKey = process.env.GOHIGHLEVEL_API_N4E1;
                const customFields = await getCustomFields(apiKey);
                if (customFields && customFields.customFields) {
                    res.status(200).json(customFields.customFields);
                } else {
                    res.status(404).json({ error: 'No custom fields found' });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // New route to fetch workflows
        app.get('/api/workflows', async (req, res) => {
            try {
                const apiKey = process.env.GOHIGHLEVEL_API_KEY;
                const workflows = await getWorkflows(apiKey);
                console.log('Fetched workflows:', workflows); // Add this line for debugging
                if (workflows && workflows.workflows.length > 0) {
                    res.status(200).json(workflows.workflows);
                } else {
                    res.status(404).json({ error: 'No workflows found' });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // New route to add a contact to a workflow
        app.post('/api/add-contact-to-workflow', async (req, res) => {
            try {
                const { contactId, workflowId, eventStartTime } = req.body;
                const apiKey = process.env.GOHIGHLEVEL_API_KEY;
                const response = await addContactToWorkflow(contactId, workflowId, eventStartTime, apiKey);
                res.status(200).json(response);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        app.use(errorHandler); // Error handling middleware at the end

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server due to database connection issues:', error);
    }
}

startServer();
