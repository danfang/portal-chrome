import { combineReducers } from 'redux';
import { GOOGLE_LOGIN, GOOGLE_LOGIN_ERROR, LOGIN_SUCCESS, SIGN_OUT } from './actions';

function loginStatus(state = {
  loggedIn: false,
  inProgress: false,
}, action) {
  switch(action.type) {
  case GOOGLE_LOGIN:
    return { loggedIn: false, inProgress: true };
  case GOOGLE_LOGIN_ERROR:
    return { loggedIn: false, inProgress: false, error: GOOGLE_LOGIN_ERROR };
  case LOGIN_SUCCESS:
    return { loggedIn: true, inProgress: false };
  case SIGN_OUT:
    return { loggedIn: false, inProgress: false };
  default:
    return state;
  }
}

function appStatus(state = {}, action) {
  switch (action.type) {
  case LOGIN_SUCCESS:
    return { credentials: action.credentials };
  case 'RESTORE_STORE':
    return action.store;
  default:
    return state;
  }
}

const appReducer = combineReducers({
  loginStatus,
  appStatus
});

export default appReducer;
