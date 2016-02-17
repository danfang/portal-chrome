import { NEW_MESSAGE_INDEX } from '../constants/AppConstants';
import { decrypt } from '../util/encryption';
import * as types from '../constants/ActionTypes';

const initialState = {
  threads: [],
  currentThreadIndex: NEW_MESSAGE_INDEX,
  lastMessageID: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SIGNED_OUT:
      return initialState;

    case types.FLUSH_DATA:
      return initialState;

    case types.THREAD_SELECTED:
      return {
        ...state,
        currentThreadIndex: action.index,
      };

    case types.MESSAGE_RECEIVED:
      return receiveMessages(state, [action.message], action.encryptionKey);

    case types.MESSAGES_RECEIVED:
      return receiveMessages(state, action.messages, action.encryptionKey);

    case types.SENDING_MESSAGE:
      return receiveMessages(state, [action.message]);

    default: return state;
  }
};

function receiveMessages(state, messages, encryptionKey) {
  if (messages.length === 0) {
    return state;
  }
  // Make a mutable copy of the old thread state
  const newThreads = JSON.parse(JSON.stringify(state.threads));

  let lastMessageTime = 0;
  let lastMessageID;

  messages.forEach((m) => {
    const message = m;

    // Decrypt the message, if necessary
    if (encryptionKey) {
      message.to = decrypt(encryptionKey, message.to);
      message.body = decrypt(encryptionKey, message.body);
    }

    // Insert the message into the correct thread
    insertMessageIntoThreads(newThreads, message);

    // Update properties based on the latest message
    if (message.at > lastMessageTime) {
      lastMessageTime = message.at;
      lastMessageID = message.mid;
    }
  });

  // Threads sorted with newest messages first
  sortThreads(newThreads);

  return {
    threads: newThreads,
    currentThreadIndex: 0,
    lastMessageID,
  };
}

export function insertMessageIntoThreads(threads, message) {
  // Find the thread to insert the new message into
  const index = threads.findIndex(thread => thread.contact === message.to);

  // Either create a new thread, or add the message to an existing thread
  if (index === -1) {
    threads.push({
      contact: message.to,
      messages: [message],
      messageInput: '',
    });
    return;
  }

  // Add message to existing message thread
  const allMessages = threads[index].messages;
  sortedInsertMessage(allMessages, message);
}

export function sortedInsertMessage(messages, newMessage) {
  let discard = false;
  let insertIndex = 0;

  // Find the index to insert the new message into
  for (let i = messages.length - 1; i >= 0; i--) {
    const curMessage = messages[i];

    // Found place to insert
    if (curMessage.at <= newMessage.at) {
      // This is a duplicate of an existing message, so discard it.
      discard = curMessage.mid === newMessage.mid;
      insertIndex = i + 1;
      break;
    }
  }
  // Insert the message in its proper chronological order
  if (!discard) messages.splice(insertIndex, 0, newMessage);
}

export function sortThreads(threads) {
  threads.sort((a, b) => {
    const msgA = a.messages;
    const msgB = b.messages;
    return msgA[msgA.length - 1].at > msgB[msgB.length - 1].at ? -1 : 1;
  });
}
