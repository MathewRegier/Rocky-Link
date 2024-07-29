import express from 'express';
import { loadCalls, initiateNextCall, isCallQueueEmpty } from '../callManager.js';  // Ensure these functions are implemented

const callRouter = express.Router();

let callInterval;

callRouter.post('/initiate-calls', async (req, res) => {
    const { filePath } = req.body;
    if (!filePath) {
        return res.status(400).json({ success: false, message: 'File path is required.' });
    }

    try {
        await loadCalls(filePath);  // Load calls from CSV and prepare them for processing

        clearInterval(callInterval);  // Clear existing interval if any
        callInterval = setInterval(async () => {
            if (isCallQueueEmpty()) {  // Check if there are no more calls left
                clearInterval(callInterval);
                console.log("All calls have been initiated.");
                return;
            }
            await initiateNextCall();  // Initiate the next call
        }, 1000);  // Calls initiated every 1 second

        res.status(200).json({ success: true, message: 'Calls initiation started.' });
    } catch (error) {
        clearInterval(callInterval);
        console.error("Error initiating calls:", error);
        res.status(500).json({ success: false, message: 'Failed to start call initiation.', error: error.toString() });
    }
});

callRouter.post('/call-completed', (req, res) => {
    res.status(200).json({ message: "Received call completion notice." });
});

// Export the router
export default callRouter;
