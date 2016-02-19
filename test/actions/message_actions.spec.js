import configureMockStore from 'redux-mock-store';
import fetchMock from 'fetch-mock';
import thunk from 'redux-thunk';

import * as actions from '../../app/actions/message_actions';
import { API_ENDPOINT } from '../../app/constants';
import * as types from '../../app/actions/types';

import { expectFetchMock } from '../functions';

const syncMessagesEndpoint = `${API_ENDPOINT}/user/messages/sync`;
const messageHistoryEndpoint = `${API_ENDPOINT}/user/messages/history`;

const mockStore = configureMockStore([thunk]);

const credentials = {
  userToken: 'token',
  userID: 'id',
};

// Creates a GCM message from a Portal message
function makeGcmMessage(type, message) {
  return {
    to: 'notification_key',
    data: {
      type,
      payload: JSON.stringify(message),
    },
  };
}

// Creates a chrome.gcm object that immediately yields the given gcmMessage
function mockGcm(gcmMessage) {
  return {
    onMessage: {
      addListener: sinon.stub().yields(gcmMessage),
    },
  };
}

describe('action listenGcm', () => {
  it('should dispatch the correct actions for a new message received', (done) => {
    const message = {
      mid: 'mid',
      to: 'to',
      at: 130023451,
      body: 'body',
      status: 'started',
    };

    const encryptionKey = 'key';
    const gcmMessage = makeGcmMessage('message', message);
    const gcm = mockGcm(gcmMessage);

    const expectedActions = [
      { type: types.LISTENING_MESSAGES },
      { type: types.MESSAGE_RECEIVED, message, encryptionKey },
    ];

    const store = mockStore({ devices: { encryptionKey } }, expectedActions, done);
    store.dispatch(actions.listenGcm(gcm));
  });

  it('should dispatch the correct actions for a status message received', (done) => {
    const status = {
      mid: 'mid',
      status: 'sent',
      at: 130023451,
    };

    const gcmMessage = makeGcmMessage('status', status);
    const gcm = mockGcm(gcmMessage);

    const expectedActions = [
      { type: types.LISTENING_MESSAGES },
      { type: types.STATUS_RECEIVED, status },
    ];

    const store = mockStore({}, expectedActions, done);
    store.dispatch(actions.listenGcm(gcm));
  });
});

describe('action syncMessages', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('should make an API call to GET message history if no messages received', (done) => {
    const encryptionKey = 'key';
    const state = {
      login: { credentials },
      devices: { encryptionKey },
      messages: {},
    };

    const messages = [{ mid: 'mid1' }, { mid: 'mid2' }, { mid: 'mid3' }];
    fetchMock.mock(messageHistoryEndpoint, 'GET', { messages });

    const expectedAction = {
      type: types.MESSAGES_RECEIVED,
      messages,
      encryptionKey,
    };

    const expectedCalls = (ex) => {
      expectFetchMock(fetchMock, messageHistoryEndpoint, credentials);
      fetchMock.calls().unmatched.length.should.equal(0);
      done(ex);
    };

    const store = mockStore(state, expectedAction, expectedCalls);
    store.dispatch(actions.syncMessages());
  });

  it('should make an API call to GET sync messages with the last seen message', (done) => {
    const lastMessage = { mid: 'last_mid' };
    const encryptionKey = 'key';
    const state = {
      login: { credentials },
      devices: { encryptionKey },
      messages: { lastMessage },
    };

    const endpoint = `${syncMessagesEndpoint}/last_mid`;
    const messages = [{ mid: 'mid1' }, { mid: 'mid2' }, { mid: 'mid3' }];
    fetchMock.mock(endpoint, 'GET', { messages });

    const expectedAction = {
      type: types.MESSAGES_RECEIVED,
      messages,
      encryptionKey,
    };

    const expectedCalls = (ex) => {
      expectFetchMock(fetchMock, endpoint, credentials);
      fetchMock.calls().unmatched.length.should.equal(0);
      done(ex);
    };

    const store = mockStore(state, expectedAction, expectedCalls);
    store.dispatch(actions.syncMessages());
  });
});
