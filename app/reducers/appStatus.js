import { LOGIN_SUCCESS, RESTORE_STORE } from '../actions/loginActions';

export default function appStatus(state = {}, action) {
  switch (action.type) {
  case LOGIN_SUCCESS:
    return { credentials: action.credentials };
  case RESTORE_STORE:
    return action.store;
  default:
    return state;
  }
}
