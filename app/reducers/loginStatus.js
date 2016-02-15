import * as types from '../constants/ActionTypes';

export default function loginStatus(state = {
  loggedIn: false,
  inProgress: false,
}, action) {
  const { type, credentials } = action;
  switch (type) {
    case types.GOOGLE_LOGIN:
      return { loggedIn: false, inProgress: true };

    case types.GOOGLE_LOGIN_ERROR:
      return { loggedIn: false, inProgress: false, error: 'Failed to login to Google.' };

    case types.LOGIN_SUCCESS:
      return { loggedIn: true, inProgress: false, credentials };

    case types.SIGN_OUT:
      return { loggedIn: false, inProgress: false };

    default: return state;
  }
}
