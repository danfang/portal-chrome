import Immutable from 'immutable';

import { NEW_MESSAGE_INDEX } from '../const';
import { THREAD_SELECTED, SENDING_MESSAGE } from '../actions/messageActions';

const initialState = {
  threads: [],
  currentThreadIndex: NEW_MESSAGE_INDEX,
  lastMessageID: null,
};

export default (state = initialState, action) => {
  const { threads } = state;
  switch (action.type) {
    case THREAD_SELECTED:
      return {
        ...state,
        currentThreadIndex: action.index,
      };
    case SENDING_MESSAGE:
      const { message } = action;
      const index = threads.findIndex(thread =>
        thread.phoneNumber === message.to || thread.contact.id === message.to
      );
      let newThreads = Immutable.fromJS(threads).asMutable();
      let newIndex = index;
      if (index === NEW_MESSAGE_INDEX) {
        newThreads = newThreads.push({
          contact: {},
          phoneNumber: message.to,
          messages: [message],
          messageInput: '',
        });
        newIndex = newThreads.length - 1;
      } else {
        const oldThread = threads[index];
        const newMessages = Immutable.fromJS(oldThread.messages).asMutable();
        newThreads = newThreads.set(index, {
          ...oldThread,
          messages: newMessages.push(message).toJS(),
          lastMessageID: message.mid,
          messageInput: '',
        });
      }
      return {
        ...state,
        threads: newThreads.toJS(),
        currentThreadIndex: newIndex,
      };
    default: return state;
  }
};
