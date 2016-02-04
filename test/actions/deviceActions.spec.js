/* eslint-env es6, mocha */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';

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
    fetchMock.restore();
  });
  it('dispatches FETCHING_DEVICES, then FETCHED_DEVICES on success', (done) => {
    const returnedDevices = [{
      created_at: 12345,
      name: 'Nexus 6P',
      type: 'phone',
      updated_at: 12345,
    }];

    fetchMock.mock(`${portalAPIEndpoint}/user/devices`, 'GET', {
      devices: returnedDevices,
    });

    const expectedActions = [
      { type: types.FETCHING_DEVICES },
      { type: types.FETCHED_DEVICES, devices: returnedDevices },
    ];

    done();
    
    const store = mockStore({ loginStatus: loginStatusWithCredentials }, expectedActions, () => {
      expect(fetchMock.calls().unmatched().length).to.equal(0);
      fetch.restore();
      done();
    });

    store.dispatch(fetchDevices());
  });
});
