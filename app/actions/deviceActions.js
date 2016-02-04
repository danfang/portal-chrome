import { SENDER_ID, portalAPIEndpoint } from '../const';
import { authenticatedRequest, checkResponse } from './helpers';
import * as types from '../constants/ActionTypes';

const devicesEndpoint = `${portalAPIEndpoint}/user/devices`;

function registerDevice() {
  return { type: types.REGISTER_DEVICE };
}

function unregisterDevice() {
  return { type: types.UNREGISTER_DEVICE };
}

function registeredDevice(keys) {
  const { encryptionKey, notificationKey } = keys;
  return { type: types.REGISTERED_DEVICE, encryptionKey, notificationKey };
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

function sendRegistrationId(credentials, registrationId) {
  return dispatch =>
    fetch(devicesEndpoint, authenticatedRequest(credentials, 'POST', {
      name: 'Chrome OSX',
      registration_id: registrationId,
      type: 'chrome',
    }))
    .then(checkResponse)
    .then(response => dispatch(registeredDevice({
      encryptionKey: response.encryption_key,
      notificationKey: response.notification_key,
    })));
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
