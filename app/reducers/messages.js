import Immutable from 'immutable'

import { THREAD_SELECTED, SENDING_MESSAGE, SENT_MESSAGE } from '../actions/messageActions'

let initialState = {
  threads: [{
    contact: {
      name: 'New Message',
      id: 0
    },
    phoneNumber: '',
    messages: [],
    messageInput: ''
  }],
  currentThread: 0,
  lastMessageID: null,
}

export default function messages(state = initialState, action) {
  const { threads, currentThread } = state
  switch (action.type) {
  case THREAD_SELECTED:
    return Object.assign({}, state, {
      currentThread: action.index
    })
  case SENDING_MESSAGE:
    const { message } = action
    let index = threads.findIndex((thread) => {
      return thread.phoneNumber == message.to ||
             thread.contact.id == message.to
    })
    let newThreads = Immutable.fromJS(threads).asMutable()
    if (index == -1) {
      newThreads = newThreads.push({
        contact: {
          id: 0
        },
        phoneNumber: message.to,
        messages: [message],
        messageInput: ''
      })
    } else {
      let oldThread = threads[index]
      let newMessages = Immutable.fromJS(oldThread.messages).asMutable()
      newThreads = newThreads.set(index, Object.assign({}, oldThread, {
        messages: newMessages.push(message).toJS(),
        lastMessageID: message.mid,
        messageInput: ''
      }))
    }
    return Object.assign({}, state, {
      threads: newThreads.toJS(),
      currentThread: index
    })
  default:
    return state
  }
}
