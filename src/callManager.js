// callManager.js
import fs from 'fs';
import csv from 'csv-parser';
import { makeCall } from './callSequence.js';

let callQueue = [];

function loadCalls(filePath) {
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            callQueue.push(row.phone);
        })
        .on('end', () => {
            console.log('CSV file has been processed.');
            startCallingProcess(); // This can be called to automatically start the calling process
        })
        .on('error', (error) => {
            console.error('Error loading CSV:', error);
        });
}

function startCallingProcess() {
    const callInterval = setInterval(() => {
        if (callQueue.length === 0) {
            clearInterval(callInterval);
            console.log('No more calls to initiate.');
        } else {
            initiateNextCall();
        }
    }, 1000); // Calls initiated every 1 second
}

function initiateNextCall() {
    if (callQueue.length > 0) {
        const phoneNumber = callQueue.shift();
        console.log('Initiating call to:', phoneNumber);
        makeCall(phoneNumber)
            .then(response => {
                console.log('Call response:', response);
            })
            .catch(error => {
                console.error('Failed to make call:', error);
            });
    }
}

function isCallQueueEmpty() {
    return callQueue.length === 0;
}

export { loadCalls, initiateNextCall, startCallingProcess, isCallQueueEmpty };
