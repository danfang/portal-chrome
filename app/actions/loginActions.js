import { portalAPIEndpoint } from '../const';

// Action constants
export const GOOGLE_LOGIN = 'GOOGLE_LOGIN';
export const GOOGLE_LOGIN_ERROR = 'GOOGLE_LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const SIGN_OUT = 'SIGN_OUT';
export const RESTORE_STORE = 'RESTORE_STORE';

// Login endpoint
const loginEndpoint = portalAPIEndpoint + 'login/google';

// Manifest constants
const manifest = chrome.runtime.getManifest();
const clientId = encodeURIComponent(manifest.oauth2.client_id);
const scopes = encodeURIComponent(manifest.oauth2.scopes.join(' '));
const redirectUri = encodeURIComponent('https://' + chrome.runtime.id + '.chromiumapp.org');

const url = 'https://accounts.google.com/o/oauth2/auth' +
            '?client_id=' + clientId +
            '&prompt=select_account' +
            '&response_type=id_token' +
            '&access_type=offline' +
            '&redirect_uri=' + redirectUri +
            '&scope=' + scopes;

export function initialize() {
  return (dispatch) => {
      chrome.storage.local.get(['store'], (result) => {
        if (!result.store) {
          dispatch(googleSignIn());
          Promise.resolve();
          return;
        }
        dispatch(restoreStore(result.store));
        if (!result.store.appStatus.credentials) {
          dispatch(googleSignIn());
        }
        Promise.resolve();
      })
  }
}

export function googleSignIn() {
  return (dispatch) => {
    dispatch(initiateGoogleLogin());

    chrome.identity.launchWebAuthFlow({ url: url, interactive: true }, function(redirect) {
      if (chrome.runtime.lastError) {
        dispatch(googleLoginError());
        Promise.resolve();
      }
      let idToken = redirect.split('#', 2)[1].split('=')[1];
      dispatch(authenticateUser(idToken));
      Promise.resolve();
    });
  }
}

function authenticateUser(idToken) {
  return (dispatch) => {
    return fetch(loginEndpoint, {
      method: 'post',
      body: JSON.stringify({
        id_token: idToken
      })
    })
    .then(checkResponse)
    .then(response => response.json())
    .then(json => dispatch(successfulLogin({
      userToken: json.user_token,
      userID: json.user_id
    })));
  }
}

function checkResponse(response) {
  if (response.status >= 400) {
    var error = response.statusText;
    error.body = response.json();
    throw error;
  }
  return response;
}

function initiateGoogleLogin() {
  return { type: GOOGLE_LOGIN };
}

function googleLoginError() {
  return { type: GOOGLE_LOGIN_ERROR };
}

function successfulLogin(credentials) {
  return { type: LOGIN_SUCCESS, credentials }
}

function restoreStore(store = {}) {
  return { type: RESTORE_STORE, store: store };
}

export function signOut() {
  return { type: SIGN_OUT };
}
