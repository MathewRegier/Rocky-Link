// queue.js
import Bull from 'bull';
import { classifyPhoneNumber } from './phoneClassifier.js';
import { updateContactCustomField, getContactIdByPhoneNumber } from './api/GHL.js';

const phoneClassificationQueue = new Bull('phone-classification', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null, // Disable the limit on retries
  },
  settings: {
    retries: 5, // Number of retries before the job is considered failed
    backoff: {
      type: 'exponential',
      delay: 1000, // Initial delay of 1 second
    },
  },
});

// Set concurrency to process multiple jobs in parallel
phoneClassificationQueue.process(1, async (job) => { // Increase concurrency to 5
  const { phoneNumber, config } = job.data;
  try {
    const classificationResult = classifyPhoneNumber(phoneNumber);
    const clientId = await getContactIdByPhoneNumber(phoneNumber, config.apiKey);

    if (!clientId) {
      throw new Error('Contact not found for provided phone number');
    }

    const fields = {
      type: classificationResult.type,
      provider: classificationResult.provider,
      location: classificationResult.location,
      province: classificationResult.province,
      distance: classificationResult.distance,
      phoneDetermination: classificationResult.phoneDetermination,
    };

    for (const [fieldKey, fieldValue] of Object.entries(fields)) {
      const fieldId = config.customFieldId[fieldKey];
      if (fieldId) {
        await updateContactCustomField(clientId, fieldId, fieldValue, config.apiKey);
      }
    }
  } catch (error) {
    console.error('Error processing phone classification:', error);
    throw error;
  }
});

export { phoneClassificationQueue };
