import uuid from 'node-uuid';
import crypto from 'sjcl';

import { SENDER_ID, portalAPIEndpoint } from '../const';
import { encrypt } from '../util/encryption';
import { authenticatedRequest, checkResponse } from '../util/request';
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
      at: parseInt(Date.now() / 1000, 10),
      to: message.to,
      body: message.body,
    };
    const bits = crypto.codec.hex.toBits(encryptionKey);
    const encryptedBody = {
      ...messageBody,
      to: encrypt(bits, message.to),
      body: encrypt(bits, message.body),
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
