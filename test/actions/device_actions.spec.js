import configureMockStore from 'redux-mock-store';
import fetchMock from 'fetch-mock';
import thunk from 'redux-thunk';

import { API_ENDPOINT, SENDER_ID } from '../../app/constants';
import * as actions from '../../app/actions/device_actions';
import * as types from '../../app/actions/types';

import { expectFetchMock } from '../functions';

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
    const devices = [{
      created_at: 12345,
      name: 'Nexus 6P',
      type: 'phone',
      updated_at: 12345,
    }];

    fetchMock.mock(deviceEndpoint, 'GET', { devices });

    const expectedActions = [
      { type: types.FETCHING_DEVICES },
      { type: types.FETCHED_DEVICES, devices },
    ];

    const expectedCalls = (ex) => {
      expectFetchMock(fetchMock, deviceEndpoint, credentials);
      fetchMock.calls().unmatched.length.should.equal(0);
      done(ex);
    };

    const store = mockStore({ login: { credentials } }, expectedActions, expectedCalls);
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

    const expectedCalls = () => {
      unregisterStub.calledOnce.should.be.true;

      registerStub.calledOnce.should.be.true;
      registerStub.calledWith([SENDER_ID]);

      onRegisterStub.calledOnce.should.be.true;
      done();
    };

    onRegisterStub.withArgs(registrationId).returns(expectedCalls);
    const store = mockStore({ login: { credentials } }, expectedActions);
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
    const store = mockStore({ login: {} }, expectedActions, done);
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
      name: 'Chrome Application',
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

    const onRegisterStub = sinon.stub();

    const expectedCalls = () => {
      expectFetchMock(fetchMock, deviceEndpoint, credentials, newDevice);
      fetchMock.calls().unmatched.length.should.equal(0);
      done();
    };

    onRegisterStub.returns(expectedCalls);
    const store = mockStore({ login: { credentials } }, expectedActions);
    store.dispatch(actions.registerDevice(registrationId, onRegisterStub));
  });
});
