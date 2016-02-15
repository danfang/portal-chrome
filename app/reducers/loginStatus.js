import * as types from '../constants/ActionTypes';

const initialState = {
  loggedIn: false,
  inProgress: false,
};

export default function loginStatus(state = initialState, action) {
  switch (action.type) {
    case types.GOOGLE_LOGIN:
      return { loggedIn: false, inProgress: true };

    case types.GOOGLE_LOGIN_ERROR:
      return { loggedIn: false, inProgress: false, error: 'Failed to login to Google.' };

    case types.LOGIN_SUCCESS:
      return { loggedIn: true, inProgress: false, credentials: action.credentials };

    case types.SIGNED_OUT:
      return { loggedIn: false, inProgress: false };

    default: return state;
  }
}
