/* eslint-env es6, mocha */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import { portalAPIEndpoint } from '../../app/const';
import { fetchDevices } from '../../app/actions/deviceActions';
import * as types from '../../app/constants/ActionTypes';

const mockStore = configureMockStore([thunk]);
const loginStatusWithCredentials = {
  credentials: {
    userToken: 'token',
    userID: 'id',
  },
};

describe('fetch devices', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches FETCHING_DEVICES, then FETCHED_DEVICES on success', (done) => {
    const returnedDevices = [{
      created_at: 12345,
      name: 'Nexus 6P',
      type: 'phone',
      updated_at: 12345,
    }];
    nock(portalAPIEndpoint)
      .get('/user/devices')
      .reply(200, {
        devices: returnedDevices,
      });

    const expectedActions = [
      { type: types.FETCHING_DEVICES },
      { type: types.FETCHED_DEVICES, devices: returnedDevices },
    ];

    const store = mockStore({ loginStatus: loginStatusWithCredentials },
      expectedActions, done);

    store.dispatch(fetchDevices());
  });
});
