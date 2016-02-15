import crypto from 'sjcl';

import { NEW_MESSAGE_INDEX } from '../const';
import { decrypt } from '../util/encryption';
import * as types from '../constants/ActionTypes';

const initialState = {
  threads: [],
  currentThreadIndex: NEW_MESSAGE_INDEX,
  lastMessageID: null,
};

function receiveMessages(state, messages, encryptionKey) {
  if (messages.length === 0) {
    return state;
  }
  const { threads } = state;
  let decryptBits;
  if (encryptionKey) {
    decryptBits = crypto.codec.hex.toBits(encryptionKey);
  }
  // Make a mutable copy of the old thread state
  const newThreads = JSON.parse(JSON.stringify(threads));
  let lastMessageTime = 0;
  let lastMessageID;
  let lastMessageIndex = -1;
  messages.forEach((m) => {
    const message = m;
    if (encryptionKey) {
      message.to = decrypt(decryptBits, message.to);
      message.body = decrypt(decryptBits, message.body);
    }
    // Find the thread to insert the new message into
    const index = newThreads.findIndex(thread =>
      thread.phoneNumber === message.to || thread.contact.id === message.to
    );
    if (index === -1) {
      // Message belongs to a new thread
      newThreads.push({
        contact: {},
        phoneNumber: message.to,
        messages: [message],
        messageInput: '',
      });
    } else {
      // Message belongs to an old thread at 'index'
      const newThread = newThreads[index];
      let discard = false;
      let messageIndex = 0;
      // Find the index to insert the new message into
      for (let i = newThread.messages.length - 1; i >= 0; i--) {
        const curMessage = newThread.messages[i];
        // Found place to insert
        if (curMessage.at <= message.at) {
          // This is a duplicate of an existing message, so discard it.
          discard = curMessage.mid === message.mid;
          messageIndex = i + 1;
          i = -1;
        }
      }
      // Insert the message in its proper chronological order
      if (!discard) newThread.messages.splice(messageIndex, 0, message);
    }
    // Update properties based on the latest message
    if (message.at > lastMessageTime) {
      lastMessageTime = message.at;
      lastMessageID = message.mid;
      lastMessageIndex = index === -1 ? newThreads.length - 1 : index;
    }
  });
  return {
    threads: newThreads,
    currentThreadIndex: lastMessageIndex,
    lastMessageID,
  };
}

export default (state = initialState, action) => {
  const { message, messages, encryptionKey } = action;
  switch (action.type) {
    case types.FLUSH_DATA:
      return initialState;

    case types.THREAD_SELECTED:
      return {
        ...state,
        currentThreadIndex: action.index,
      };

    case types.MESSAGE_RECEIVED:
      return receiveMessages(state, [message], encryptionKey);

    case types.MESSAGES_RECEIVED:
      return receiveMessages(state, messages, encryptionKey);

    case types.SENDING_MESSAGE:
      return receiveMessages(state, [message]);

    default: return state;
  }
};
