import uuid from 'node-uuid';

import { authenticatedRequest, checkResponse } from '../util/request';
import { SENDER_ID, API_ENDPOINT } from '../constants';
import { encrypt } from '../util/encryption';
import * as types from './types';

const syncMessagesEndpoint = `${API_ENDPOINT}/user/messages/sync`;
const messageHistoryEndpoint = `${API_ENDPOINT}/user/messages/history`;
const gcmUpstream = `${SENDER_ID}@gcm.googleapis.com`;

export function listenGcm(gcm = chrome.gcm) {
  return dispatch => {
    dispatch(listeningMessages());
    gcm.onMessage.addListener(message => {
      const data = message.data;
      const payload = JSON.parse(data.payload);
      switch (data.type) {
        case 'message':
          dispatch(messageReceived(payload));
          break;
        case 'status':
          dispatch(statusReceived(payload));
          break;
        default: break;
      }
    });
  };
}

export function syncMessages() {
  return (dispatch, getState) => {
    const state = getState();
    const lastMessage = state.messages.lastMessage;
    const credentials = state.login.credentials;
    const encryptionKey = state.devices.encryptionKey;

    // If we have a latest message, sync messages
    if (lastMessage) {
      return fetch(`${syncMessagesEndpoint}/${lastMessage.mid}`,
        authenticatedRequest(credentials, 'GET'))
        .then(checkResponse)
        .then(response => dispatch(newMessages(response.messages, encryptionKey)));
    }
    // Otherwise, fetch message history
    return fetch(messageHistoryEndpoint, authenticatedRequest(credentials, 'GET'))
      .then(checkResponse)
      .then(response => dispatch(newMessages(response.messages, encryptionKey)));
  };
}

export function sendMessage(input, gcm = chrome.gcm) {
  return (dispatch, getState) => {
    const { notificationKey, encryptionKey } = getState().devices;
    const message = makeMessage(input.to, input.body);
    const payload = encryptedPayload(encryptionKey, message);
    const data = {
      type: 'message',
      payload: JSON.stringify(payload),
    };

    dispatch(sendingMessage(message));

    // Send to other devices via GCM
    gcm.send(gcmMessage(notificationKey, data), () => {
      // Send to GCM server upstream
      gcm.send(gcmMessage(gcmUpstream, data), () => {
        dispatch(sentMessage(message.mid));
      });
    });
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

function listeningMessages() {
  return { type: types.LISTENING_MESSAGES };
}

function messageReceived(message) {
  return { type: types.MESSAGE_RECEIVED, message };
}

function statusReceived(status) {
  return { type: types.STATUS_RECEIVED, status };
}

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
