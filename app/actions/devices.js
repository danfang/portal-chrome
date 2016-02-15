import { SENDER_ID, portalAPIEndpoint } from '../const';
import { authenticatedRequest, checkResponse } from '../util/request';
import { syncMessages } from './messages';
import * as types from '../constants/ActionTypes';

const devicesEndpoint = `${portalAPIEndpoint}/user/devices`;

function registerDevice() {
  return { type: types.REGISTER_DEVICE };
}

function unregisterDevice() {
  return { type: types.UNREGISTER_DEVICE };
}

function registeredDevice(device, encryptionKey, notificationKey) {
  return { type: types.REGISTERED_DEVICE, device, encryptionKey, notificationKey };
}

function registrationError(error) {
  return { type: types.REGISTRATION_ERROR, error };
}

function fetchingDevices() {
  return { type: types.FETCHING_DEVICES };
}

function fetchedDevices(devices) {
  return { type: types.FETCHED_DEVICES, devices };
}

function listeningMessages() {
  return { type: types.LISTENING_MESSAGES };
}

function messageReceived(data) {
  return { type: types.MESSAGE_RECEIVED, data };
}

function listenGCM() {
  return dispatch => {
    dispatch(listeningMessages());
    chrome.gcm.onMessage.addListener((message) => {
      console.log(message);
      dispatch(messageReceived(message.data));
    });
  };
}

function sendRegistrationId(credentials, registrationId) {
  return dispatch => {
    const newDevice = {
      name: 'Chrome OSX',
      registration_id: registrationId,
      type: 'chrome',
    };
    fetch(devicesEndpoint, authenticatedRequest(credentials, 'POST', newDevice))
    .then(checkResponse)
    .then(response => {
      dispatch(registeredDevice({
        ...newDevice,
        device_id: response.device_id,
      }, response.encryption_key, response.notification_key));
      dispatch(listenGCM());
      dispatch(syncMessages());
    });
  };
}

export function register() {
  return (dispatch, getState) => {
    const credentials = getState().loginStatus.credentials;
    if (!credentials) {
      dispatch(registrationError('Missing credentials'));
      Promise.resolve();
      return;
    }
    dispatch(unregisterDevice());
    chrome.gcm.unregister(() => {
      dispatch(registerDevice());
      chrome.gcm.register([SENDER_ID], (registrationId) => {
        if (chrome.runtime.lastError) {
          dispatch(registrationError('Error registering GCM Device'));
          Promise.resolve();
          return;
        }
        dispatch(sendRegistrationId(credentials, registrationId));
      });
    });
  };
}

export function fetchDevices() {
  return (dispatch, getState) => {
    const credentials = getState().loginStatus.credentials;
    if (!credentials) {
      dispatch(registrationError('Missing credentials'));
      Promise.resolve();
      return;
    }
    dispatch(fetchingDevices());
    fetch(devicesEndpoint, authenticatedRequest(credentials, 'GET'))
    .then(checkResponse)
    .then(response => dispatch(fetchedDevices(response.devices)));
  };
}
