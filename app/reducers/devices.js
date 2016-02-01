import * as types from '../actions/deviceActions'
import { SIGN_OUT } from '../actions/loginActions'

let initialState = {
  registered: false,
  registerInProgress: false,
  notificationKey: null,
  encryptionKey: null,
  fetchingDevices: false,
  linkedDevices: []
}

export default function(state = initialState, action) {
  const { type, notificationKey, encryptionKey, devices } = action;
  switch (type) {
  case SIGN_OUT: {
    return initialState
  }
  case types.UNREGISTER_DEVICE:
    return Object.assign({}, state, {
      registered: false,
      registerInProgress: true
    });
  case types.REGISTER_DEVICE:
    return Object.assign({}, state, {
      registered: false,
      registerInProgress: true
    });
  case types.REGISTERED_DEVICE:
    return Object.assign({}, state, {
      registered: true,
      registerInProgress: false,
      notificationKey,
      encryptionKey
    });
  case types.FETCHING_DEVICES:
    return Object.assign({}, state, {
      fetchingDevices: true
    });
  case types.FETCHED_DEVICES:
    return Object.assign({}, state, {
      fetchingDevices: false,
      linkedDevices: devices
    });
  default:
    return state;
  }
}
