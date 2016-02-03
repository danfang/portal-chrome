import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import loginStatus from './reducers/loginStatus';
import devices from './reducers/devices';
import messages from './reducers/messages';

const loggerMiddleware = createLogger();

const appReducer = combineReducers({
  loginStatus,
  devices,
  messages,
});

export default function configureStore(initialState) {
  return createStore(
    appReducer,
    initialState,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  );
}
