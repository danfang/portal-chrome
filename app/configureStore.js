import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import loginStatus from './reducers/loginStatus'
import appStatus from './reducers/appStatus'

const loggerMiddleware = createLogger()

const appReducer = combineReducers({
  loginStatus,
  appStatus
})

export default function configureStore(initialState) {
  return createStore(
    appReducer,
    initialState,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  )
}
