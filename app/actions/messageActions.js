import uuid from 'node-uuid';
import crypto from 'sjcl';

import { SENDER_ID, portalAPIEndpoint } from '../const';
import { authenticatedRequest, checkResponse } from './helpers';
import * as types from '../constants/ActionTypes';

const syncMessagesEndpoint = `${portalAPIEndpoint}/user/messages/sync`;
const messageHistoryEndpoint = `${portalAPIEndpoint}/user/messages/history`;

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
    const lastMessageID = getState().messages.lastMessageID;
    const credentials = getState().loginStatus.credentials;
    const encryptionKey = getState().devices.encryptionKey;
    if (lastMessageID) {
      fetch(`${syncMessagesEndpoint}/${lastMessageID}`, authenticatedRequest(credentials, 'GET'))
      .then(checkResponse)
      .then(response => dispatch(newMessages(response.messages, encryptionKey)));
    } else {
      fetch(messageHistoryEndpoint, authenticatedRequest(credentials, 'GET'))
      .then(checkResponse)
      .then(response => dispatch(newMessages(response.messages, encryptionKey)));
    }
  };
}

function getEncryptedString(bits, message) {
  const obj = JSON.parse(crypto.encrypt(bits, message));
  return JSON.stringify({
    iv: obj.iv,
    ct: obj.ct,
  });
}

export function sendMessage(message) {
  return (dispatch, getState) => {
    const { notificationKey, encryptionKey } = getState().devices;
    if (!notificationKey || !encryptionKey) {
      throw new Error('Missing notification or encryption keys.');
    }
    const mid = uuid.v4();
    const messageBody = {
      mid,
      status: 'started',
      at: Date.now() / 1000,
      to: message.to,
      body: message.body,
    };
    const bits = crypto.codec.hex.toBits(encryptionKey);
    const encryptedBody = {
      ...messageBody,
      to: getEncryptedString(bits, message.to),
      body: getEncryptedString(bits, message.body),
    };
    const data = {
      type: 'message',
      payload: JSON.stringify(encryptedBody),
    };
    const groupMessage = {
      messageId: uuid.v4(),
      destinationId: notificationKey,
      data,
    };
    dispatch(sendingMessage(messageBody));
    chrome.gcm.send(groupMessage, () => {
      if (chrome.runtime.lastError) {
        throw new Error('error sending message');
      }
      const upstreamMessage = {
        messageId: uuid.v4(),
        destinationId: `${SENDER_ID}@gcm.googleapis.com`,
        data,
      };
      chrome.gcm.send(upstreamMessage, () => {
        if (chrome.runtime.lastError) {
          throw new Error('error sending message');
        }
        dispatch(sentMessage(mid));
        Promise.resolve();
      });
    });
  };
}
