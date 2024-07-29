import express from 'express';
import { handleRegularWebhook, handleWebhookWithPhone, handlePhoneClassificationWebhook, handleImpoundWebhook, handleSendPromotionWebhook, handleIncomingMessage, handleSendFollowupWebhook   } from '../webhook/webhookHandler.js';
import { webhookConfigs } from '../webhook/webhookConfig.js';
import { sendSMS } from '../api/semySMS.js';

const router = express.Router();

router.post('/webhook/send-promotion1', handleSendPromotionWebhook);
router.post('/webhook/send-promotion2', handleSendPromotionWebhook);
router.post('/webhook/send-promotion3', handleSendPromotionWebhook);
router.post('/webhook/incoming-message', handleIncomingMessage);
router.post('/webhook/send-followup1', handleSendFollowupWebhook);
router.post('/webhook/send-followup2', handleSendFollowupWebhook);
router.post('/webhook/send-followup3', handleSendFollowupWebhook);
router.post('/webhook/phone-classification', (req, res) => handlePhoneClassificationWebhook(req, res, webhookConfigs.webhook1));
router.post('/webhook/add-tag', (req, res) => handleAddTagWebhook(req, res, webhookConfigs.addTagWebhook));

router.post('/webhook/call-completed', (req, res) => {
    if (req.body.status === 'completed') {
        setWaitingForWebhook(false); // Reset the flag
        initiateNextCall(); // Initiate the next call
        res.status(200).json({ message: "Next call will be initiated." });
    } else {
        res.status(400).json({ error: "Call not completed. No further action taken." });
    }
});

router.post('/webhook/appointments', async (req, res) => {
    const { appointmentDate, appointmentTime, details, appointmentPhone, appointmentName } = req.body;
    const message = `Appointment Info:\n Name: ${appointmentName}\n Date: ${appointmentDate}\n Time: ${appointmentTime}\n Details: ${details}`;

    console.log("Received Appointment Data:");
    console.log("Name:", appointmentName);
    console.log("Phone Number:", appointmentPhone);
    console.log("Date:", appointmentDate);
    console.log("Time:", appointmentTime);
    console.log("Details:", details);

    try {
        const results = await Promise.all([
            sendSMS(+12269611073, message)  // Using sendSMS directly
        ]);
        res.status(200).json({ message: 'Appointment data logged and SMS sent successfully', smsResults: results });
    } catch (error) {
        console.error(`Failed to send SMS:`, error);
        res.status(500).json({ message: 'Failed to send SMS', details: error.toString() });
    }
});

// Dynamic webhook handler based on type
router.post('/webhook/:type', async (req, res) => {
    const type = req.params.type;
    //console.log(`Received webhook of type: ${type}`);
    //console.log(`Request headers: ${JSON.stringify(req.headers, null, 2)}`);
    //console.log(`Request body: ${JSON.stringify(req.body, null, 2)}`);
    
    const config = webhookConfigs[type];

    if (!config) {
        console.error(`Webhook configuration not found for type: ${type}`);
        return res.status(404).json({ error: 'Webhook configuration not found' });
    }

    try {
        await config.handle(req, res, config);
    } catch (error) {
        console.error(`Error processing webhook for type ${type}:`, error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
// Other webhook related routes...
// New route for impound webhook
router.post('/webhook/impound', (req, res) => handleImpoundWebhook(req, res, webhookConfigs.impoundWebhook));

export default router;
