// assistantFunctions.js
import axios from 'axios';

const webhookUrl = process.env.WEBHOOK_URL || 'https://96962d5a9110.ngrok.app:3000/webhook/check-inventory';

/**
 * Function to check inventory of a specific item using the inventory webhook.
 * @param {string} itemName - The name of the item to check.
 * @returns {Promise<object>} - The inventory details of the item.
 */
export async function checkInventory(itemName) {
    if (!itemName) {
        throw new Error('Item name is required to check inventory.');
    }

    try {
        const response = await axios.post(webhookUrl, { item_name: itemName }, {
            headers: { 'Content-Type': 'application/json' }
        });

        return response.data;
    } catch (error) {
        console.error('Error checking inventory:', error.response ? error.response.data : error.message);
        throw new Error('Failed to check inventory. Please try again later.');
    }
}

/**
 * Function to handle the inventory check request from the ChatGPT assistant.
 * @param {string} itemName - The name of the item to check.
 * @returns {Promise<string>} - The response message from the assistant.
 */
export async function handleInventoryRequest(itemName) {
    try {
        const inventoryData = await checkInventory(itemName);

        if (inventoryData.quantity > 0) {
            const locationDetails = inventoryData.location_details.map(loc => `${loc.name}: ${loc.quantity}`).join(', ');
            return `${inventoryData.item_name} is in stock with a total quantity of ${inventoryData.quantity} at the following locations: ${locationDetails}.`;
        } else {
            return `${inventoryData.item_name} is not in stock.`;
        }
    } catch (error) {
        return `Error checking inventory: ${error.message}`;
    }
}
