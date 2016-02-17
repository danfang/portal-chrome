import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import messages from './message_reducer';
import devices from './device_reducer';
import login from './login_reducer';

const loggerMiddleware = createLogger();

const app = combineReducers({
  login,
  devices,
  messages,
});

const configureStore = (initialState) =>
  createStore(app, initialState,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  );

export default configureStore;
