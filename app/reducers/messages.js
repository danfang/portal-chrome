import Immutable from 'immutable';

import { THREAD_SELECTED, SENDING_MESSAGE } from '../actions/messageActions';

const initialState = {
  threads: [],
  currentThread: -1,
  lastMessageID: null,
};

export default (state = initialState, action) => {
  const { threads } = state;
  switch (action.type) {
    case THREAD_SELECTED:
      return {
        ...state,
        currentThread: action.index,
      };
    case SENDING_MESSAGE:
      const { message } = action;
      const index = threads.findIndex(thread =>
        thread.phoneNumber === message.to || thread.contact.id === message.to
      );
      let newThreads = Immutable.fromJS(threads).asMutable();
      if (index === -1) {
        newThreads = newThreads.push({
          contact: {},
          phoneNumber: message.to,
          messages: [message],
          messageInput: '',
        });
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
        currentThread: index,
      };
    default: return state;
  }
};
