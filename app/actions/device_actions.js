import { SENDER_ID, API_ENDPOINT } from '../constants';
import { authenticatedRequest, checkResponse } from '../util/request';
import { syncMessages } from './message_actions';
import * as types from './types';

const devicesEndpoint = `${API_ENDPOINT}/user/devices`;

export function fetchDevices() {
  return (dispatch, getState) => {
    const credentials = getState().login.credentials;
    if (!credentials) {
      dispatch(registrationError('missing credentials'));
      return;
    }
    dispatch(fetchingDevices());
    fetch(devicesEndpoint, authenticatedRequest(credentials, 'GET'))
      .then(checkResponse)
      .then(response => dispatch(fetchedDevices(response.devices)))
      .catch(ex => dispatch(registrationError(ex)));
  };
}

export function registerGcm(gcm = chrome.gcm, onregister = registerDevice) {
  return (dispatch) => {
    dispatch(unregisteringDevice());

    gcm.unregister(() => {
      dispatch(registeringDevice());

      gcm.register([SENDER_ID], (registrationId) => {
        dispatch(onregister(registrationId));
      });
    });
  };
}

export function registerDevice(registrationId, onregister = listenAndSync) {
  return (dispatch, getState) => {
    const credentials = getState().login.credentials;
    if (!credentials) {
      dispatch(registrationError('missing credentials'));
      return;
    }
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
        dispatch(onregister());
      })
      .catch(ex => dispatch(registrationError(ex)));
  };
}

export function listenAndSync() {
  return dispatch => {
    dispatch(listenGcm());
    dispatch(syncMessages());
  };
}

export function listenGcm(gcm = chrome.gcm) {
  return dispatch => {
    dispatch(listeningMessages());
    gcm.onMessage.addListener((message) =>
      dispatch(messageReceived(message.data)
    ));
  };
}

function registeringDevice() {
  return { type: types.REGISTER_DEVICE };
}

function unregisteringDevice() {
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
