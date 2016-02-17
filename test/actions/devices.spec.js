import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';

import { API_ENDPOINT, SENDER_ID } from '../../app/constants/AppConstants';
import * as actions from '../../app/actions/devices';
import * as types from '../../app/constants/ActionTypes';

const mockStore = configureMockStore([thunk]);

const credentials = {
  userToken: 'token',
  userID: 'id',
};

const deviceEndpoint = `${API_ENDPOINT}/user/devices`;

describe('action fetchDevices', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('should dispatch the correct actions and make an API call to GET devices', (done) => {
    const returnedDevices = [{
      created_at: 12345,
      name: 'Nexus 6P',
      type: 'phone',
      updated_at: 12345,
    }];

    fetchMock.mock(deviceEndpoint, 'GET', {
      devices: returnedDevices,
    });

    const expectedActions = [
      { type: types.FETCHING_DEVICES },
      { type: types.FETCHED_DEVICES, devices: returnedDevices },
    ];

    const store = mockStore({ loginStatus: { credentials } }, expectedActions, done);
    store.dispatch(actions.fetchDevices());
  });
});

describe('action registerGcm', () => {
  it('should re-register the device, then call its onregister method', (done) => {
    const registrationId = '12345';

    const unregisterStub = sinon.stub().callsArg(0);
    const registerStub = sinon.stub().callsArgWith(1, registrationId);

    const mockGcm = {
      register: registerStub,
      unregister: unregisterStub,
    };

    const expectedActions = [
      { type: types.UNREGISTER_DEVICE },
      { type: types.REGISTER_DEVICE },
    ];

    const onRegisterStub = sinon.stub();

    const onFinish = () => {
      unregisterStub.calledOnce.should.be.true;

      registerStub.calledOnce.should.be.true;
      registerStub.calledWith([SENDER_ID]);

      onRegisterStub.calledOnce.should.be.true;
      onRegisterStub.calledWith(registrationId);
      done();
    };

    onRegisterStub.withArgs(registrationId).returns(onFinish);

    const store = mockStore({ loginStatus: { credentials } }, expectedActions);
    store.dispatch(actions.registerGcm(mockGcm, onRegisterStub));
  });
});

describe('action registerDevice', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('should dispatch an error on missing credentials', (done) => {
    fetchMock.mock(deviceEndpoint, 'POST', should.fail);
    const expectedActions = [{ type: types.REGISTRATION_ERROR, error: 'missing credentials' }];
    const store = mockStore({ loginStatus: {} }, expectedActions, done);
    store.dispatch(actions.registerDevice('registrationId'));
  });

  it('should dispatch the correct actions and make an API call to POST devices', (done) => {
    const deviceId = '35';
    const notificationKey = '123';
    const encryptionKey = '456';

    fetchMock.mock(deviceEndpoint, 'POST', {
      device_id: deviceId,
      notification_key: notificationKey,
      encryption_key: encryptionKey,
    });

    const registrationId = '12345';

    const newDevice = {
      registration_id: registrationId,
      name: 'Chrome OSX',
      type: 'chrome',
    };

    const expectedActions = [
      {
        type: types.REGISTERED_DEVICE,
        device: { ...newDevice, device_id: deviceId },
        notificationKey,
        encryptionKey,
      },
    ];

    const onRegisterStub = sinon.stub().returns(() => {
      fetchMock.called(deviceEndpoint).should.be.true;

      const options = fetchMock.lastOptions(deviceEndpoint);

      // Check headers
      options.headers['X-USER-ID'].should.equal(credentials.userID);
      options.headers['X-USER-TOKEN'].should.equal(credentials.userToken);

      // Check body
      JSON.parse(options.body).should.deep.equal(newDevice);

      // Check unmatched calls
      fetchMock.calls().unmatched.length.should.equal(0);
      done();
    });

    const store = mockStore({ loginStatus: { credentials } }, expectedActions);

    store.dispatch(actions.registerDevice(registrationId, onRegisterStub));
  });
});

describe('action listenGcm', () => {
  it('should dispatch the correct actions and add a message listener', (done) => {
    const message = {
      to: 'notification_key',
      priority: 'high',
      data: {
        type: 'message',
        payload: JSON.stringify({
          mid: 'mid',
          to: 'to',
          at: 130023451,
          body: 'body',
        }),
      },
    };

    // GCM message listener that immediately invokes a message callback
    const mockGcm = {
      onMessage: {
        addListener: sinon.stub().yields([message]),
      },
    };

    const expectedActions = [
      { type: types.LISTENING_MESSAGES },
      { type: types.MESSAGE_RECEIVED, data: message.data },
    ];

    const store = mockStore({}, expectedActions, () => done());

    store.dispatch(actions.listenGcm(mockGcm));
  });
});
