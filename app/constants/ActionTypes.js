// TODO: Use Flux Standard Architecture to get rid of error types

// Device Registration
export const UNREGISTER_DEVICE = 'UNREGISTER_DEVICE';
export const REGISTER_DEVICE = 'REGISTER_DEVICE';
export const REGISTERED_DEVICE = 'REGISTERED_DEVICE';
export const REGISTRATION_ERROR = 'REGISTRATION_ERROR';

// Device fetching
export const FETCHING_DEVICES = 'FETCHING_DEVICES';
export const FETCHED_DEVICES = 'FETCHED_DEVICES';

// Login actions
export const GOOGLE_LOGIN = 'GOOGLE_LOGIN';
export const GOOGLE_LOGIN_ERROR = 'GOOGLE_LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const SIGN_OUT = 'SIGN_OUT';
export const RESTORE_LOGIN_STATUS = 'RESTORE_LOGIN_STATUS';

// Credential errors
export const MISSING_CREDENTIALS = 'MISSING_CREDENTIALS';

// Threads and messages
export const THREAD_SELECTED = 'THREAD_SELECTED';
export const SENDING_MESSAGE = 'SENDING_MESSAGE';
export const SENT_MESSAGE = 'SENT_MESSAGE';
