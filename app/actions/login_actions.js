import {
  API_ENDPOINT,
  GOOGLE_OAUTH_SCOPES,
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_REDIRECT,
} from '../constants';

import { authenticatedRequest, checkResponse } from '../util/request';
import * as types from './types';

const loginEndpoint = `${API_ENDPOINT}/login/google`;
const signoutEndpoint = `${API_ENDPOINT}/user/signout`;

const clientId = encodeURIComponent(GOOGLE_OAUTH_CLIENT_ID);
const scopes = encodeURIComponent(GOOGLE_OAUTH_SCOPES.join(' '));
const redirectUri = encodeURIComponent(GOOGLE_OAUTH_REDIRECT);

const url = 'https://accounts.google.com/o/oauth2/auth' +
       '?client_id=' + clientId +
       '&prompt=select_account' +
       '&response_type=id_token' +
       '&access_type=offline' +
       '&redirect_uri=' + redirectUri +
       '&scope=' + scopes;

export function googleSignIn(chrome = chrome, onsignin = authenticateUser) {
  return dispatch => {
    dispatch(initiateGoogleLogin());
    chrome.identity.launchWebAuthFlow({ url, interactive: true }, redirect => {
      if (chrome.runtime.lastError) return dispatch(googleLoginError());

      const idToken = redirect.split('#', 2)[1].split('=')[1];
      dispatch(onsignin(idToken));
    });
  };
}

export function authenticateUser(idToken) {
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

export function signOut() {
  return (dispatch, getState) => {
    const state = getState();
    const { device } = state.devices;
    const { credentials } = state.login;

    dispatch(signedOut());

    fetch(signoutEndpoint, authenticatedRequest(credentials, 'POST', {
      device_id: device ? device.device_id : '0',
    }))
    .then(checkResponse);
  };
}

function initiateGoogleLogin() {
  return { type: types.GOOGLE_LOGIN };
}

function googleLoginError() {
  return { type: types.GOOGLE_LOGIN_ERROR };
}

function successfulLogin(credentials) {
  return { type: types.LOGIN_SUCCESS, credentials };
}

function signedOut() {
  return { type: types.SIGNED_OUT };
}
