import * as types from '../constants/ActionTypes';

const initialState = {
  // Progress state
  registered: false,
  registerInProgress: false,
  fetchingDevices: false,

  // Credentials
  notificationKey: null,
  encryptionKey: null,

  // User devices
  device: null,
  linkedDevices: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SIGNED_OUT:
      return initialState;

    case types.UNREGISTER_DEVICE:
      return {
        ...state,
        registered: false,
        registerInProgress: true,
        device: null,
        linkedDevices: state.linkedDevices.filter(device =>
          device.device_id !== state.device.device_id
        ),
      };

    case types.REGISTER_DEVICE:
      return {
        ...state,
        registered: false,
        registerInProgress: true,
      };

    case types.REGISTERED_DEVICE:
      const { device, notificationKey, encryptionKey } = action;
      return {
        ...state,
        registered: true,
        registerInProgress: false,
        device,
        notificationKey,
        encryptionKey,
        linkedDevices: [...state.linkedDevices, device],
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
        linkedDevices: action.devices,
      };

    default: return state;
  }
};
