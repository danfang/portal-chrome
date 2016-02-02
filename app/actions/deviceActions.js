import { MISSING_CREDENTIALS } from './loginActions'
import { SENDER_ID, portalAPIEndpoint } from '../const'
import { authenticatedRequest, checkResponse } from './helpers'

export const UNREGISTER_DEVICE = 'UNREGISTER_DEVICE'
export const REGISTER_DEVICE = 'REGISTER_DEVICE'
export const REGISTERED_DEVICE = 'REGISTERED_DEVICE'
export const FETCHING_DEVICES = 'FETCHING_DEVICES'
export const FETCHED_DEVICES = 'FETCHED_DEVICES'
export const REGISTRATION_ERROR = 'REGISTRATION_ERROR'

const devicesEndpoint = portalAPIEndpoint + 'user/devices'

export function register() {
  return (dispatch, getState) => {
    let credentials = getState().loginStatus.credentials
    if (!credentials) {
      dispatch(registrationError('missing credentials'))
      Promise.resolve()
      return
    }
    dispatch(unregisterDevice())
    chrome.gcm.unregister(function() {
      dispatch(registerDevice())
      chrome.gcm.register([SENDER_ID], (registrationId) => {
        if (chrome.runtime.lastError) {
          dispatch(registrationError("Error registering GCM Device"))
          Promise.resolve()
          return;
        }
        dispatch(sendRegistrationId(credentials, registrationId))
      });
    })
  }
}

export function fetchDevices() {
  return (dispatch, getState) => {
    let credentials = getState().loginStatus.credentials
    if (!credentials) {
      dispatch(registrationError('missing credentials'))
      Promise.resolve()
      return
    }
    dispatch(fetchingDevices())
    return fetch(devicesEndpoint, authenticatedRequest(credentials, 'GET'))
    .then(checkResponse)
    .then(response => dispatch(fetchedDevices(response.devices)))
  }
}

function sendRegistrationId(credentials, registrationId) {
  return (dispatch) => {
    return fetch(devicesEndpoint, authenticatedRequest(credentials, 'POST', {
      'name': 'Chrome OSX',
      'registration_id': registrationId,
      'type': 'chrome'
    }))
    .then(checkResponse)
    .then(response => dispatch(registeredDevice({
      encryptionKey: response.encryption_key,
      notificationKey: response.notification_key
    })))
  }
}

function registerDevice() {
  return { type: REGISTER_DEVICE }
}

function unregisterDevice() {
  return { type: UNREGISTER_DEVICE }
}

function registeredDevice(keys) {
  const { encryptionKey, notificationKey } = keys
  return { type: REGISTERED_DEVICE, encryptionKey, notificationKey }
}

function registrationError(error) {
  return { type: REGISTRATION_ERROR, error: error }
}

function fetchingDevices() {
  return { type: FETCHING_DEVICES }
}

function fetchedDevices(devices) {
  return { type: FETCHED_DEVICES, devices }
}
