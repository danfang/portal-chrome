import { portalAPIEndpoint } from '../const';
import { checkResponse } from './helpers';
import * as types from '../constants/ActionTypes';

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
  return { type: types.GOOGLE_LOGIN };
}

function googleLoginError() {
  return { type: types.GOOGLE_LOGIN_ERROR };
}

function successfulLogin(credentials) {
  return { type: types.LOGIN_SUCCESS, credentials };
}

export function signOut() {
  return { type: types.SIGN_OUT };
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
