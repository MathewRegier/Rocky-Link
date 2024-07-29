// callSequence.js
import fetch from 'node-fetch';

export async function makeCall(phoneNumber) {
    const options = {
        method: 'POST',
        headers: {
            authorization: 'sk-fnlzfa3rcs3cxogsihxozfo1e041nzbmbvkpwcinxbkztq9f0pmsfjta1oi9qnv469',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phone_number: phoneNumber,
            pathway_id: "2221f1b8-1a72-4bab-b026-496228cc872a",
            voice: "Alexa",
            answered_by_enabled: true,
            wait_for_greeting: true,
            from: "+12267735114",
            record: true,
            max_duration: 4,
            model: "turbo",
            voicemail_action: 'leave_message',
            voicemail_message: "Hi, This is Jessica from U-R-Approved, I was just calling to see if you were interested in vehciles at the moment. Please call me back if you are so I can connect you to a sales rep."
        })
    };

    return fetch('https://api.bland.ai/v1/calls', options)
        .then(response => response.json())
        .then(json => {
            console.log('Call initiated for:', phoneNumber);
            return json;
        })
        .catch(err => {
            console.error('Error making call to:', phoneNumber, err);
        });
}
