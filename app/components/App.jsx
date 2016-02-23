import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { registerGcm, fetchDevices } from '../actions/device_actions';
import { syncMessages, listenGcm } from '../actions/message_actions';

import Messages from './Messages';
import Threads from './Threads';
import Header from './Header';
import Menu from './Menu';

export class App extends Component {
  componentDidMount() {
    const { dispatch, registered } = this.props;
    if (!registered) {
      dispatch(registerGcm());
    } else {
      dispatch(syncMessages());
    }
    dispatch(fetchDevices());
    dispatch(listenGcm());
  }
  render() {
    return (
      <div id="app" className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <Header />
        <Menu />
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
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return { registered: state.devices.registered };
}

export default connect(mapStateToProps)(App);
