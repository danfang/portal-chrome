import uuid from 'node-uuid';

import * as types from '../constants/ActionTypes';
import { SENDER_ID, API_ENDPOINT } from '../constants/AppConstants';
import { authenticatedRequest, checkResponse } from '../util/request';
import { encrypt } from '../util/encryption';

const syncMessagesEndpoint = `${API_ENDPOINT}/user/messages/sync`;
const messageHistoryEndpoint = `${API_ENDPOINT}/user/messages/history`;
const gcmUpstream = `${SENDER_ID}@gcm.googleapis.com`;

function sendingMessage(message) {
  return { type: types.SENDING_MESSAGE, message };
}

function sentMessage(mid) {
  return { type: types.SENT_MESSAGE, mid };
}

function newMessages(messages, encryptionKey) {
  return { type: types.MESSAGES_RECEIVED, messages, encryptionKey };
}

export function selectThread(index) {
  return { type: types.THREAD_SELECTED, index };
}

export function syncMessages() {
  return (dispatch, getState) => {
    const state = getState();
    const lastMessageID = state.messages.lastMessageID;
    const credentials = state.loginStatus.credentials;
    const encryptionKey = state.devices.encryptionKey;
    // If we have a latest message, sync messages
    if (lastMessageID) {
      fetch(`${syncMessagesEndpoint}/${lastMessageID}`, authenticatedRequest(credentials, 'GET'))
      .then(checkResponse)
      .then(response => dispatch(newMessages(response.messages, encryptionKey)));
      return;
    }
    // Otherwise, fetch message history
    fetch(messageHistoryEndpoint, authenticatedRequest(credentials, 'GET'))
    .then(checkResponse)
    .then(response => dispatch(newMessages(response.messages, encryptionKey)));
  };
}

function makeMessage(to, body) {
  return {
    mid: uuid.v4(),
    status: 'started',
    at: parseInt(Date.now() / 1000, 10),
    to,
    body,
  };
}

function encryptedPayload(encryptionKey, message) {
  return {
    ...message,
    to: encrypt(encryptionKey, message.to),
    body: encrypt(encryptionKey, message.body),
  };
}

function gcmMessage(to, data) {
  return {
    messageId: uuid.v4(),
    destinationId: to,
    data,
  };
}

export function sendMessage(input) {
  return (dispatch, getState) => {
    const { notificationKey, encryptionKey } = getState().devices;
    const message = makeMessage(input.to, input.body);
    const payload = encryptedPayload(encryptionKey, message);
    const data = {
      type: 'message',
      payload: JSON.stringify(payload),
    };
    const groupMessage = gcmMessage(notificationKey, data);
    dispatch(sendingMessage(message));

    // Send to other devices via GCM
    chrome.gcm.send(groupMessage, () => {
      const upstreamMessage = gcmMessage(gcmUpstream, data);

      // Send to GCM server upstream
      chrome.gcm.send(upstreamMessage, () => {
        dispatch(sentMessage(message.mid));
        Promise.resolve();
      });
    });
  };
}
