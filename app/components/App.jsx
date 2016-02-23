import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { registerGcm, fetchDevices } from '../actions/device_actions';
import { syncMessages, listenGcm, clearMessages } from '../actions/message_actions';
import { signOut } from '../actions/login_actions';

import Messages from './Messages';
import Threads from './Threads';
import Header from './Header';
import Menu from './Menu';

export class App extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    this.signOut = () => dispatch(signOut());
    this.clearMessages = () => dispatch(clearMessages());
  }
  componentDidMount() {
    const { dispatch, registered } = this.props;
    if (!registered) {
      dispatch(registerGcm());
    } else {
      dispatch(syncMessages());
    }
    dispatch(fetchDevices());
    dispatch(listenGcm());
    componentHandler.upgradeAllRegistered();
  }
  render() {
    return (
      <div id="app" refs="app" className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <Header { ...this.props } clearMessagesOnClick={this.clearMessages} />
        <Menu { ...this.props } signOutOnClick={this.signOut} />
        <main className="mdl-layout__content">
          <div className="page-content">
            <div className="mdl-grid">
              <Threads />
              <Messages />
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
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { devices } = state;
  return {
    registered: devices.registered,
    registerInProgress: devices.registerInProgress,
    fetchingDevices: devices.fetchingDevices,
    linkedDevices: devices.linkedDevices,
  };
};

export default connect(mapStateToProps)(App);
