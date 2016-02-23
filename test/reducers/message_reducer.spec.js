import reducer, {
  insertMessageIntoThreads,
} from '../../app/reducers/message_reducer';

import * as types from '../../app/actions/types';

describe('message_reducer', () => {
  const initialState = {
    threads: [],
    currentThreadIndex: -1,
    lastMessage: null,
  };

  const emptyAction = { type: 'none' };

  it('should return the initial state given no state', () => {
    reducer(undefined, emptyAction).should.deep.equal(initialState);
  });

  it('should return the current state on no action', () => {
    reducer({}, emptyAction).should.deep.equal({});
    reducer(initialState, emptyAction).should.deep.equal(initialState);
  });

  it('should return the initial state on signing out', () => {
    reducer({}, { type: types.SIGNED_OUT }).should.deep.equal(initialState);
  });

  it('should return the initial state on clearing messages', () => {
    reducer({}, { type: types.CLEAR_MESSAGES }).should.deep.equal(initialState);
  });
});

const m1 = { mid: 'm1', at: 3000, to: 'me', body: 'body', status: 'started' };
const m2 = { mid: 'm2', at: 4000, to: 'me', body: 'body', status: 'started' };
const m3 = { mid: 'm3', at: 5000, to: 'me', body: 'body', status: 'started' };

describe('message_reducer helpers', () => {
  describe('insertMessageIntoThreads', () => {
    it('should insert a new message chronologically into a thread array', () => {
      const threads = [{
        contact: 'me',
        messages: [m1, m3],
      }];
      insertMessageIntoThreads(threads, m2);
      threads[0].messages.should.deep.equal([m1, m2, m3]);
    });
  });
});

describe('message_reducer: MESSAGE_RECEIVED with no existing messages', () => {
  it('should return the correct state', () => {
    const beforeState = {
      threads: [],
      currentThreadIndex: -1,
      lastMessage: null,
    };
    const action = {
      type: types.MESSAGE_RECEIVED,
      message: m1,
    };
    const afterState = {
      threads: [{
        contact: 'me',
        messages: [m1],
        messageInput: '',
      }],
      currentThreadIndex: 0,
      lastMessage: m1,
    };
    reducer(beforeState, action).should.deep.equal(afterState);
  });

  it('should return the correct state with existing messages in the same thread', () => {
    const beforeState = {
      threads: [{
        contact: 'me',
        messages: [m1, m2],
        messageInput: 'an_input',
      }],
      currentThreadIndex: -1,
      lastMessage: m2,
    };
    const action = {
      type: types.MESSAGE_RECEIVED,
      message: m3,
    };
    const afterState = {
      threads: [{
        contact: 'me',
        messages: [m1, m2, m3],
        messageInput: 'an_input',
      }],
      currentThreadIndex: 0,
      lastMessage: m3,
    };
    reducer(beforeState, action).should.deep.equal(afterState);
  });

  it('should return the correct state with existing messages in chronological order', () => {
    const beforeState = {
      threads: [{
        contact: 'me',
        messages: [m1, m3],
        messageInput: 'an_input',
      }],
      currentThreadIndex: -1,
      lastMessage: m3,
    };
    const action = {
      type: types.MESSAGE_RECEIVED,
      message: m2,
    };
    const afterState = {
      threads: [{
        contact: 'me',
        messages: [m1, m2, m3],
        messageInput: 'an_input',
      }],
      currentThreadIndex: 0,
      lastMessage: m3,
    };
    reducer(beforeState, action).should.deep.equal(afterState);
  });
});
//
// describe('message_reducer: MESSAGES_RECEIVED', () => {
//   it('should return the correct state', (done) => {
//     done();
//   });
// });
//
// describe('message_reducer: STATUS_RECEIVED', () => {
//   it('should return the correct state', (done) => {
//     done();
//   });
// });
//
// describe('message_reducer: SENDING_MESSAGE', () => {
//   it('should return the correct state', (done) => {
//     done();
//   });
// });
