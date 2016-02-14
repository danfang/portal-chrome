import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { signOut } from '../actions/loginActions';

import { register, fetchDevices } from '../actions/deviceActions';
import { syncMessages } from '../actions/messageActions';
import Threads from './Threads';
import Messages from './Messages';
import Header from './Header';
import Menu from './Menu';

class App extends Component {
  constructor() {
    super();
    this.signOut = this.signOut.bind(this);
  }
  componentDidMount() {
    const { dispatch, registered } = this.props;
    if (!registered) {
      dispatch(register());
    } else {
      dispatch(syncMessages());
    }
    dispatch(fetchDevices());
    componentHandler.upgradeAllRegistered();
  }
  signOut() {
    const { dispatch } = this.props;
    dispatch(signOut());
  }
  render() {
    const { isLinkedToPhone } = this.props;
    return (
      <div id="app" refs="app" className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <Header { ...this.props } />
        <Menu { ...this.props } signOutOnClick={this.signOut} />
        <main className="mdl-layout__content">
          <div className="page-content">
            <div className="mdl-grid">
              <Threads />
              <Messages isDisabled={ !isLinkedToPhone }/>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

App.propTypes = {
  registered: PropTypes.bool.isRequired,
  registerInProgress: PropTypes.bool.isRequired,
  fetchingDevices: PropTypes.bool.isRequired,
  linkedDevices: PropTypes.array.isRequired,
  isLinkedToPhone: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

function linkedPhoneExists(devices) {
  return devices.find(device => device && device.type === 'phone') !== undefined;
}

function mapStateToProps(state) {
  const { devices } = state;
  return {
    registered: devices.registered,
    registerInProgress: devices.registerInProgress,
    fetchingDevices: devices.fetchingDevices,
    linkedDevices: devices.linkedDevices,
    isLinkedToPhone: linkedPhoneExists(devices.linkedDevices),
  };
}
export default connect(mapStateToProps)(App);
