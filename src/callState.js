// callState.js
let isWaitingForWebhook = false;

export function setWaitingForWebhook(state) {
    isWaitingForWebhook = state;
}

export function getWaitingForWebhook() {
    return isWaitingForWebhook;
}
