import { THREAD_SELECTED } from '../actions/messageActions'

let initialState = {
  threads: [],
  currentThread: -1,
  // threads:
  // [{
  //    contact: {},
  //    phoneNumber: ''
  //    messages: [] // sorted
  //  }]
  //
  //
  //
  //
  //
}

export default function messages(state = initialState, action) {
  switch (action.type) {
  case THREAD_SELECTED:
    return Object.assign({}, state, {
      currentThread: action.index
    })
  default:
    return state
  }
}
