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

describe('fetch devices', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('dispatches the correct actions and makes an API call to GET devices', (done) => {
    const returnedDevices = [{
      created_at: 12345,
      name: 'Nexus 6P',
      type: 'phone',
      updated_at: 12345,
    }];

    fetchMock.mock(`${API_ENDPOINT}/user/devices`, 'GET', {
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

describe('register device with GCM', () => {
  it('should unregister the device, register the device, then call onregister', (done) => {
    const registrationId = '12345';

    const unregisterStub = sinon.stub()
      .callsArg(0);

    const registerStub = sinon.stub()
      .callsArgWith(1, registrationId);

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

describe('register device with Portal API', () => {
  const endpoint = `${API_ENDPOINT}/user/devices`;

  afterEach(() => {
    fetchMock.restore();
  });

  it('should dispatch an error on missing credentials', (done) => {
    fetchMock.mock(endpoint, 'POST', should.fail);
    const expectedActions = [{ type: types.REGISTRATION_ERROR, error: 'missing credentials' }];
    const store = mockStore({ loginStatus: {} }, expectedActions, done);
    store.dispatch(actions.registerDevice('registrationId'));
  });

  it('should dispatch the correct actions and send a POST request', (done) => {
    const deviceId = '35';
    const notificationKey = '123';
    const encryptionKey = '456';

    fetchMock.mock(endpoint, 'POST', {
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
      fetchMock.called(endpoint).should.be.true;

      const options = fetchMock.lastOptions(endpoint);

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
