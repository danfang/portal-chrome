import * as types from '../constants/ActionTypes';

const initialState = {
  registered: false,
  registerInProgress: false,
  device: null,
  notificationKey: null,
  encryptionKey: null,
  fetchingDevices: false,
  linkedDevices: [],
};

export default (state = initialState, action) => {
  const { type } = action;
  switch (type) {
    case types.SIGN_OUT:
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
      const { devices } = action;
      return {
        ...state,
        fetchingDevices: false,
        linkedDevices: devices,
      };

    default:
      return state;
  }
};
