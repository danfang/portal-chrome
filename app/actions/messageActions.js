import uuid from 'node-uuid';
import crypto from 'sjcl';

import { SENDER_ID } from '../const';

export const THREAD_SELECTED = 'THREAD_SELECTED';
export const SENDING_MESSAGE = 'SENDING_MESSAGE';
export const SENT_MESSAGE = 'SENT_MESSAGE';

function sendingMessage(message) {
  return { type: SENDING_MESSAGE, message };
}

function sentMessage(mid) {
  return { type: SENT_MESSAGE, mid };
}

export function selectThread(index) {
  return { type: THREAD_SELECTED, index };
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
      at: Date.now(),
      to: message.to,
      body: message.body,
    };
    const bits = crypto.codec.hex.toBits(encryptionKey);
    const encryptedBody = {
      ...messageBody,
      to: JSON.parse(crypto.encrypt(bits, message.to)).ct,
      body: JSON.parse(crypto.encrypt(bits, message.body)).ct,
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
