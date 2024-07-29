import { handleRegularWebhook, handleWebhookWithPhone, handleAnalyzeConversationWebhook, handlePhoneClassificationWebhook, handleImpoundWebhook, handleAddTagWebhook, handleSendPromotionWebhook, handleIncomingMessage, handleSendFollowupWebhook } from './webhookHandler.js';

export const webhookConfigs = {
    webhook1: { handle: handleRegularWebhook, endpoint: '/webhook', assistantId: 'asst_NzXT7fX7N0MuDCQl9FouWIy4', customFieldId: 'Bd8Bi2q4QFKXeDNMakdr', apiKey: process.env.GOHIGHLEVEL_API_KEY },
    webhook2: { handle: handleRegularWebhook, endpoint: '/webhook-with-phone', assistantId: 'asst_NzXT7fX7N0MuDCQl9FouWIy4', customFieldId: 'Bd8Bi2q4QFKXeDNMakdr', apiKey: process.env.GOHIGHLEVEL_API_KEY },
    webhook3: { handle: handleRegularWebhook, endpoint: '/webhook', assistantId: 'asst_dpac4vwgwaqIKsghlSqqMtA9', customFieldId: 'OUF9YuOOaiOWUOQHLWVv', apiKey: process.env.GOHIGHLEVEL_API_KEYVF },
    webhook4: { handle: handleRegularWebhook, endpoint: '/webhook-with-phone', assistantId: 'asst_NzXT7fX7N0MuDCQl9FouWIy4', customFieldId: 'Bd8Bi2q4QFKXeDNMakdr', apiKey: process.env.GOHIGHLEVEL_API_KEY },
    webhook5: { handle: handleRegularWebhook, endpoint: '/webhook', assistantId: 'asst_yESXKDSB56FwdbEE5buZNllf', customFieldId: 'Bd8Bi2q4QFKXeDNMakdr', apiKey: process.env.GOHIGHLEVEL_API_KEY },
    webhookn4e1webchat: { handle: handleRegularWebhook, endpoint: '/webhook', assistantId: 'asst_DDQ5KIDB318kLyL1eZsypsCO', customFieldId: 'nCZBt2EF31JAlJu4chJA', apiKey: process.env.GOHIGHLEVEL_API_N4E1 },
    analyzeConversation: { handle: handleAnalyzeConversationWebhook, endpoint: '/webhook/analyze-conversation', assistantId: 'asst_yESXKDSB56FwdbEE5buZNllf', customFieldId: 'Bd8Bi2q4QFKXeDNMakdr', apiKey: process.env.GOHIGHLEVEL_API_KEY },
    phoneFiltering: { 
      handle: handlePhoneClassificationWebhook, 
      endpoint: '/webhook/phone-filtering', 
      customFieldId: {
        type: 'ypu5bflb2ye4qSYsQ4WT', // Replace with actual custom field ID for type
        provider: 'WqSPrUYk4NmykOQXvey7', // Replace with actual custom field ID for provider
        location: 'c1tfJTXngKgemw2H0qTW', // Replace with actual custom field ID for location
        province: 'crnNxWoMgtCSQe6d7N7E', // Replace with actual custom field ID for province
        distance: 'YRptifL1bF8ngGa4ECKo', // Replace with actual custom field ID for distance
        phoneDetermination: 'hTQQom1UDIAX5cwdn7Hd' // Replace with actual custom field ID for phoneDetermination
      }, 
      apiKey: process.env.GOHIGHLEVEL_API_KEY
    },
    addTagWebhook: { 
        handle: handleAddTagWebhook, 
        endpoint: '/webhook/add-tag', 
        apiKey: process.env.GOHIGHLEVEL_API_KEY
    },
    impoundWebhook: { handle: handleImpoundWebhook, endpoint: '/webhook/impound', apiKey: process.env.GOHIGHLEVEL_API_KEY }, // New configuration
    'send-promotion1': { handle: handleSendPromotionWebhook, endpoint: '/webhook/send-promotion1', promotionType: 'promotion1', semysmsDeviceId: '344094', semysmsApiKey: process.env.SEMYSMS_USER_TOKEN, apiKey: process.env.GOHIGHLEVEL_API_KEY },
    'send-promotion2': { handle: handleSendPromotionWebhook, endpoint: '/webhook/send-promotion2', promotionType: 'promotion1', semysmsDeviceId: '341566', semysmsApiKey: process.env.SEMYSMS_USER_TOKEN, apiKey: process.env.GOHIGHLEVEL_API_KEY },
    'send-promotion3': { handle: handleSendPromotionWebhook, endpoint: '/webhook/send-promotion3', promotionType: 'promotion1', semysmsDeviceId: '343790', semysmsApiKey: process.env.SEMYSMS_USER_TOKEN2, apiKey: process.env.GOHIGHLEVEL_API_KEY },
    incomingMessage: { handle: handleIncomingMessage, endpoint: '/webhook/incoming-message', assistantId: 'asst_specificAssistantID', customFieldId: 'Bd8Bi2q4QFKXeDNMakdr', apiKey: process.env.GOHIGHLEVEL_API_KEY },
    'send-followup1': { handle: handleSendFollowupWebhook, endpoint: '/webhook/send-followup1', semysmsDeviceId: '344094', semysmsApiKey: process.env.SEMYSMS_USER_TOKEN, apiKey: process.env.GOHIGHLEVEL_API_KEY },
    'send-followup2': { handle: handleSendFollowupWebhook, endpoint: '/webhook/send-followup2', semysmsDeviceId: '341566', semysmsApiKey: process.env.SEMYSMS_USER_TOKEN, apiKey: process.env.GOHIGHLEVEL_API_KEY },
    'send-followup3': { handle: handleSendFollowupWebhook, endpoint: '/webhook/send-followup3', semysmsDeviceId: '343790', semysmsApiKey: process.env.SEMYSMS_USER_TOKEN2, apiKey: process.env.GOHIGHLEVEL_API_KEY }
};
