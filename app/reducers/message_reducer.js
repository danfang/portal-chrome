import { NEW_MESSAGE_INDEX } from '../constants';
import { decrypt } from '../util/encryption';
import * as types from '../actions/types';

const initialState = {
  threads: [],
  currentThreadIndex: NEW_MESSAGE_INDEX,
  lastMessage: null,
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

    case types.STATUS_RECEIVED:
      return updateStatus(state, action.status);

    case types.MESSAGES_RECEIVED:
      return receiveMessages(state, action.messages, action.encryptionKey);

    case types.SENDING_MESSAGE:
      return receiveMessages(state, [action.message]);

    default: return state;
  }
};

export function receiveMessages(state, messages, encryptionKey) {
  if (messages.length === 0) {
    return state;
  }
  // Make a mutable copy of the old thread state
  const threads = JSON.parse(JSON.stringify(state.threads));

  let lastMessage = state.lastMessage || { at: 0 };

  messages.forEach((m) => {
    const message = m;

    // Decrypt the message, if necessary
    if (encryptionKey) {
      message.to = decrypt(encryptionKey, message.to);
      message.body = decrypt(encryptionKey, message.body);
    }

    // Insert the message into the correct thread
    insertMessageIntoThreads(threads, message);

    // Update properties based on the latest message
    if (message.at > lastMessage.at) {
      lastMessage = message;
    }
  });

  // Threads sorted with newest messages first
  sortThreads(threads);

  return {
    currentThreadIndex: 0,
    threads,
    lastMessage,
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

export function updateStatus(state, status) {
  let lastMessage = state.lastMessage || { at: 0 };

  const threads = JSON.parse(JSON.stringify(state.threads));

  const index = threads.findIndex(thread => {
    let found = false;
    const messages = thread.messages;
    for (let i = messages.length - 1; !found && i >= 0; i--) {
      const message = messages[i];
      if (message.mid === status.mid) {
        message.status = status.status;
        message.at = status.at;
        found = true;
        if (message.at > lastMessage.at) {
          lastMessage = message;
        }
      }
    }
    return found;
  });

  if (index === -1) return state;

  // Move the thread at index to the front of threads
  threads.unshift(...threads.splice(index, 1));

  return {
    currentThreadIndex: 0,
    threads,
    lastMessage,
  };
}
