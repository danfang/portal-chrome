import * as types from '../actions/deviceActions';
import { SIGN_OUT } from '../actions/loginActions';

const initialState = {
  registered: false,
  registerInProgress: false,
  notificationKey: null,
  encryptionKey: null,
  fetchingDevices: false,
  linkedDevices: [],
};

export default (state = initialState, action) => {
  const { type, notificationKey, encryptionKey, devices } = action;
  switch (type) {
    case SIGN_OUT:
      return initialState;
    case types.UNREGISTER_DEVICE:
      return {
        ...state,
        registered: false,
        registerInProgress: true,
      };
    case types.REGISTER_DEVICE:
      return {
        ...state,
        registered: false,
        registerInProgress: true,
      };
    case types.REGISTERED_DEVICE:
      return {
        ...state,
        registered: true,
        registerInProgress: false,
        notificationKey,
        encryptionKey,
      };
    case types.FETCHING_DEVICES:
      return {
        ...state,
        fetchingDevices: true,
      };
    case types.FETCHED_DEVICES:
      return {
        ...state,
        fetchingDevices: false,
        linkedDevices: devices,
      };
    default:
      return state;
  }
};
