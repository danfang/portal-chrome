import { GOOGLE_LOGIN, GOOGLE_LOGIN_ERROR, LOGIN_SUCCESS, SIGN_OUT } from '../actions/loginActions';

export default function loginStatus(state = {
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
