import { portalAPIEndpoint } from '../const';
import { checkResponse } from './helpers';

// Action constants
export const GOOGLE_LOGIN = 'GOOGLE_LOGIN';
export const GOOGLE_LOGIN_ERROR = 'GOOGLE_LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const SIGN_OUT = 'SIGN_OUT';
export const RESTORE_LOGIN_STATUS = 'RESTORE_LOGIN_STATUS';
export const MISSING_CREDENTIALS = 'MISSING_CREDENTIALS';

// Login endpoint
const loginEndpoint = `${portalAPIEndpoint}/login/google`;

// Manifest constants
const manifest = chrome.runtime.getManifest();
const clientId = encodeURIComponent(manifest.oauth2.client_id);
const scopes = encodeURIComponent(manifest.oauth2.scopes.join(' '));
const redirectUri = encodeURIComponent(`https://${chrome.runtime.id}.chromiumapp.org`);

const url = 'https://accounts.google.com/o/oauth2/auth' +
            '?client_id=' + clientId +
            '&prompt=select_account' +
            '&response_type=id_token' +
            '&access_type=offline' +
            '&redirect_uri=' + redirectUri +
            '&scope=' + scopes;

function initiateGoogleLogin() {
  return { type: GOOGLE_LOGIN };
}

function googleLoginError() {
  return { type: GOOGLE_LOGIN_ERROR };
}

function successfulLogin(credentials) {
  return { type: LOGIN_SUCCESS, credentials };
}

function authenticateUser(idToken) {
  return dispatch =>
    fetch(loginEndpoint, {
      method: 'post',
      body: JSON.stringify({ id_token: idToken }),
    })
    .then(checkResponse)
    .then(response => dispatch(successfulLogin({
      userToken: response.user_token,
      userID: response.user_id,
    })));
}

export function googleSignIn() {
  return dispatch => {
    dispatch(initiateGoogleLogin());
    chrome.identity.launchWebAuthFlow({ url, interactive: true }, redirect => {
      if (chrome.runtime.lastError) {
        dispatch(googleLoginError());
        Promise.resolve();
        return;
      }
      const idToken = redirect.split('#', 2)[1].split('=')[1];
      dispatch(authenticateUser(idToken));
      Promise.resolve();
    });
  };
}

export function signOut() {
  return { type: SIGN_OUT };
}
