import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { register, fetchDevices } from '../actions/devices';
import { syncMessages } from '../actions/messages';
import { signOut } from '../actions/login';

import Threads from './Threads';
import Messages from './Messages';
import Header from './Header';
import Menu from './Menu';

class App extends Component {
  constructor() {
    super();
    this.signOut = this.signOut.bind(this);
    this.flushData = this.flushData.bind(this);
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
  flushData() {
    const { dispatch } = this.props;
    dispatch({ type: 'FLUSH_DATA' });
  }
  signOut() {
    const { dispatch } = this.props;
    dispatch(signOut());
  }
  render() {
    return (
      <div id="app" refs="app" className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <Header { ...this.props } flushData={this.flushData} />
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

function mapStateToProps(state) {
  const { devices } = state;
  return {
    registered: devices.registered,
    registerInProgress: devices.registerInProgress,
    fetchingDevices: devices.fetchingDevices,
    linkedDevices: devices.linkedDevices,
  };
}
export default connect(mapStateToProps)(App);
