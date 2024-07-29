import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { sendSMS } from '../api/semySMS.js';
import { MongoClient } from 'mongodb';
import { fetchConversation, analyzeConversation, createThreadIfNotExist, handleUserMessage } from '../api/chatGPT.js';
import { getContactIdByPhoneNumber, updateContactCustomField, addContactToWorkflow, addTagToContact} from '../api/GHL.js';
import { phoneClassificationQueue } from '../queue.js';
import { handleInventoryRequest } from '../assistantFunctions.js';
import { LoyaltyUser } from '../config/db.js';
import { webhookConfigs } from './webhookConfig.js'; // Ensure this line is included
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the MongoClient with a connection pool
const client = new MongoClient(process.env.MONGODB_URI, {
    minPoolSize: 5,
    maxPoolSize: 20
});

// Immediately connect to MongoDB
async function initializeClient() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

// Initialize MongoDB connection when the server starts
initializeClient();

// Function to get the MongoDB database object
function getDatabase() {
    return client.db("Cluster0"); // Adjust the database name as per your setup
}

// Handle webhook requests using client ID
export async function handleRegularWebhook(req, res, config) {
    const userMessage = req.body.steps.trigger.event.body.message.body;
    const clientId = req.body.steps.trigger.event.body.contact_id;

    console.log("MongoDB URI:", process.env.MONGODB_URI);

    if (!userMessage || !clientId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const database = getDatabase();
        const threads = database.collection("threads");
        const threadId = await createThreadIfNotExist(clientId, process.env.CHATGPT_API_KEY, threads);

        // Process the message through the queue system and update GoHighLevel
        handleUserMessage(threadId, userMessage, process.env.CHATGPT_API_KEY, config.assistantId, async (response) => {
            await updateContactCustomField(clientId, config.customFieldId, response, config.apiKey);
            res.status(200).json({ success: true, message: "Message processed successfully." });
        });
    } catch (error) {
        console.error(`Error processing webhook for client ID ${clientId}:`, error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

// Handle webhook requests using phone number
export async function handleWebhookWithPhone(req, res, config) {
    const phoneNumber = req.body.steps.trigger.event.body.contact_phone;

    if (!phoneNumber) {
        return res.status(400).json({ error: 'Missing phone number' });
    }

    try {
        const database = getDatabase();
        const threads = database.collection("threads");
        const clientId = await getContactIdByPhoneNumber(phoneNumber, config.apiKey);

        if (!clientId) {
            return res.status(404).json({ error: 'Contact not found for provided phone number' });
        }

        const threadId = await createThreadIfNotExist(clientId, process.env.CHATGPT_API_KEY, threads);
        const userMessage = "Initiating contact";
        
        handleUserMessage(threadId, userMessage, process.env.CHATGPT_API_KEY, config.assistantId, async (response) => {
            await updateContactCustomField(clientId, config.customFieldId, response, config.apiKey);
            res.status(200).json({ success: true, message: "Initiation process completed successfully." });
        });
    } catch (error) {
        console.error(`Error processing webhook for phone number ${phoneNumber}:`, error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

// Handle webhook requests to analyze conversation for interest
export async function handleAnalyzeConversationWebhook(req, res, config) {
    try {
        console.log('Incoming request body:', JSON.stringify(req.body, null, 2));
        
        const clientId = req.body.steps?.trigger?.event?.body?.contact_id;
        const contactPhone = req.body.steps?.trigger?.event?.body?.contact_phone;
        
        if (!clientId) {
            return res.status(400).json({ error: 'Missing client ID' });
        }

        if (!contactPhone) {
            return res.status(400).json({ error: 'Missing contact phone' });
        }

        console.log(`Processing webhook for client ID: ${clientId}, phone: ${contactPhone}`);
        
        const database = getDatabase();
        const threads = database.collection("threads");
        const threadId = await createThreadIfNotExist(clientId, process.env.CHATGPT_API_KEY, threads);
        
        console.log(`Thread ID for client ID ${clientId}: ${threadId}`);

        const conversation = await fetchConversation(threadId, process.env.CHATGPT_API_KEY);
        
        // Instead of logging the entire conversation, log a summary or key points
        console.log(`Fetched ${conversation.length} messages for thread ID ${threadId}`);

        const analysisResult = await analyzeConversation(conversation, process.env.CHATGPT_API_KEY);
        
        const { interestLevel, summary } = analysisResult;

        console.log(`Interest result for client ID ${clientId}: ${interestLevel}`);
        console.log(`Conversation summary: ${summary}`);

        // Send the result to the specified webhook URL
        const webhookUrl = 'https://backend.leadconnectorhq.com/hooks/FSqwVRonzQXHJ7OdwbIX/webhook-trigger/a7a22016-e02b-49bc-b5ea-28d4084f6891';
        const webhookData = {
            clientId,
            contactPhone,
            interestLevel,
            summary
        };

        await axios.post(webhookUrl, webhookData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(`Webhook sent to ${webhookUrl} with data: ${JSON.stringify(webhookData, null, 2)}`);

        res.status(200).json({ success: true, interestLevel, summary });
    } catch (error) {
        console.error('Error processing analyze conversation webhook:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

// New handler for phone classification webhook
export async function handlePhoneClassificationWebhook(req, res, config) {
    const phoneNumber = req.body.phone;
  
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Missing phone number' });
    }
  
    try {
      await phoneClassificationQueue.add({ phoneNumber, config });
      res.status(200).json({ success: true, message: 'Phone number added to classification queue.' });
    } catch (error) {
      console.error('Error adding phone number to classification queue:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

// New handler for impound webhook
export async function handleImpoundWebhook(req, res, config) {
    const phoneNumber = req.body.phoneNumber;
    const workflowId = '8b2e2fcd-3694-4c2e-8067-c58aecd23230'; // Expect workflowId from the request body
    const eventStartTime = req.body.timestamp; // Expect eventStartTime from the request body

    // Log the incoming request body
    console.log('Incoming webhook request body:', req.body);

    if (!phoneNumber || !workflowId || !eventStartTime) {
        return res.status(400).json({ error: 'Missing phone number, workflow ID, or event start time' });
    }

    try {
        const clientId = await getContactIdByPhoneNumber(phoneNumber, config.apiKey);

        if (!clientId) {
            return res.status(404).json({ error: 'Contact not found for provided phone number' });
        }

        await addContactToWorkflow(clientId, workflowId, eventStartTime, config.apiKey);

        res.status(200).json({ success: true, message: "Contact added to workflow successfully." });
    } catch (error) {
        console.error(`Error processing impound webhook for phone number ${phoneNumber}:`, error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

export async function handleAddTagWebhook(req, res, config) {
  const { tag, phoneNumber } = req.body;

  if (!tag || !phoneNumber) {
    return res.status(400).json({ error: 'Missing tag or phone number' });
  }

  try {
    const contactId = await getContactIdByPhoneNumber(phoneNumber, config.apiKey);

    if (!contactId) {
      return res.status(404).json({ error: 'Contact not found for provided phone number' });
    }

    const response = await addTagToContact(contactId, tag, config.apiKey);

    // Log the response
    console.log("Tag added to contact:", response);

    res.status(200).json({ success: true, message: "Tag added to contact successfully.", data: response });
  } catch (error) {
    console.error(`Error processing add tag webhook for phone number ${phoneNumber}:`, error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

// Function to pick a random promotion
function pickRandomPromotion(filePath) {
    const promotions = fs.readFileSync(filePath, 'utf-8').split('\n');
    const randomIndex = Math.floor(Math.random() * promotions.length);
    return promotions[randomIndex];
}

// Function to send SMS using SEMYSMS API
async function sendSMSWithApiKey(phone, message, deviceId, token) {
    const url = 'https://semysms.net/api/3/sms.php';
    const data = new URLSearchParams({
        phone,
        msg: message,
        device: deviceId,
        token, // Use token instead of key
    }).toString();

    console.log(`Sending SMS with token: ${token}`);
    console.log(`Request URL: ${url}`);
    console.log(`Request Data: ${data}`);

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        console.log(`Response Data: ${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.error(`Error sending SMS: ${error.message}`);
        console.error(`Request URL: ${url}`);
        console.error(`Request Data: ${data}`);
        console.error(`Response Data: ${error.response ? JSON.stringify(error.response.data) : 'No response data'}`);
        throw error;
    }
}

// Handle webhook for sending promotion
export async function handleSendPromotionWebhook(req, res) {
    const phoneNumber = req.body.phone;
    const routePath = req.route.path.replace('/webhook/', '');
    const configKey = routePath;
    const config = webhookConfigs[configKey];

    console.log(`Route Path: ${routePath}`);
    console.log(`Config Key: ${configKey}`);
    console.log(`Config: ${JSON.stringify(config)}`);

    if (!config) {
        return res.status(400).json({ error: 'Invalid webhook configuration' });
    }

    const promotionType = config.promotionType || 'promotion1';
    const promotionsFilePath = path.join(__dirname, `../${promotionType}.txt`);

    if (!phoneNumber) {
        return res.status(400).json({ error: 'Missing phone number' });
    }

    try {
        const promotion = pickRandomPromotion(promotionsFilePath);
        const response = await sendSMSWithApiKey(phoneNumber, promotion, config.semysmsDeviceId, config.semysmsApiKey);

        res.status(200).json({ success: true, message: 'Promotion sent successfully', response });
    } catch (error) {
        console.error('Error sending promotion', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

// Handle webhook for sending followup
export async function handleSendFollowupWebhook(req, res) {
    const phoneNumber = req.body.phone;
    const routePath = req.route.path.replace('/webhook/', '');
    const configKey = routePath;
    const config = webhookConfigs[configKey];

    console.log(`Route Path: ${routePath}`);
    console.log(`Config Key: ${configKey}`);
    console.log(`Config: ${JSON.stringify(config)}`);

    if (!config) {
        return res.status(400).json({ error: 'Invalid webhook configuration' });
    }

    const followupsFilePath = path.join(__dirname, '../followups.txt');

    if (!phoneNumber) {
        return res.status(400).json({ error: 'Missing phone number' });
    }

    try {
        const followup = pickRandomPromotion(followupsFilePath);
        const response = await sendSMSWithApiKey(phoneNumber, followup, config.semysmsDeviceId, config.semysmsApiKey);

        res.status(200).json({ success: true, message: 'Followup sent successfully', response });
    } catch (error) {
        console.error('Error sending followup', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

// Handle webhook for incoming message
export async function handleIncomingMessage(req, res) {
    const phoneNumber = req.body.phone;
    const userMessage = req.body.message;
    const config = webhookConfigs.incomingMessage;

    if (!phoneNumber || !userMessage) {
        return res.status(400).json({ error: 'Missing phone number or message' });
    }

    try {
        const clientId = await getContactIdByPhoneNumber(phoneNumber, config.apiKey);

        if (!clientId) {
            return res.status(404).json({ error: 'Contact not found for provided phone number' });
        }

        const threadId = await createThreadIfNotExist(clientId, process.env.CHATGPT_API_KEY);

        handleUserMessage(threadId, userMessage, process.env.CHATGPT_API_KEY, config.assistantId, async (responseMessage) => {
            await updateContactCustomField(clientId, config.customFieldId, responseMessage, config.apiKey);
            await sendSMS(phoneNumber, responseMessage, process.env.SEMYSMS_DEVICE_ID);
            res.status(200).json({ success: true, message: "Response sent successfully." });
        });
    } catch (error) {
        console.error('Error handling incoming message', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}