import React, { Component, PropTypes } from 'react';
import NativeListener from 'react-native-listener';
import { connect } from 'react-redux';

import { clearMessages } from '../actions/message_actions';

import MaterialHeader from './material/Header';
import DeviceList from './DeviceList';

class Header extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    this.clearMessages = () => dispatch(clearMessages());
  }
  getStatusElements() {
    const { registered, registerInProgress } = this.props;
    if (registered) {
      return {
        statusDescription: 'Your device is registered!',
        statusIcon: <i className="material-icons">check_circle</i>,
      };
    } else if (registerInProgress) {
      return {
        statusDescription: 'Currently registering your device...',
        statusIcon: <div className="mdl-spinner mdl-js-spinner is-active"></div>,
      };
    }
    return {
      statusDescription: 'Unable to register device. Please try again.',
      statusIcon: <i className="material-icons">error_outline</i>,
    };
  }
  render() {
    const { linkedDevices } = this.props;
    const { statusDescription, statusIcon } = this.getStatusElements();

    const isLinkedToPhone = linkedDevices.find(device =>
      device && device.type === 'phone'
    ) !== undefined;

    const noPhoneLinked = isLinkedToPhone ? '' : (
      <a id="alert-no-phone" className="mdl-navigation__link" href="#">
        <i className="material-icons">phonelink_erase</i>
        <div className="mdl-tooltip mdl-tooltip--large" htmlFor="alert-no-phone">
          No phone linked. Unable to send text messages.
        </div>
      </a>
    );
    return (
      <MaterialHeader id="app-header" title={'Portal Messaging'}>
        { noPhoneLinked }
        <a id="alert-registration-status" className="mdl-navigation__link" href="#">
          <div className="mdl-tooltip mdl-tooltip--large" htmlFor="alert-registration-status">
            { statusDescription }
          </div>
          { statusIcon }
        </a>
        <NativeListener onClick={this.clearMessages}>
          <a id="clear-messages" className="mdl-navigation__link" href="#">
            <div className="mdl-tooltip mdl-tooltip--large" htmlFor="clear-messages">
              Clear all messages
            </div>
            <i className="material-icons">clear</i>
          </a>
        </NativeListener>
        <DeviceList linkedDevices={linkedDevices} />
      </MaterialHeader>
    );
  }
}

Header.propTypes = {
  linkedDevices: PropTypes.array.isRequired,
  registered: PropTypes.bool.isRequired,
  registerInProgress: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { devices } = state;
  return {
    linkedDevices: devices.linkedDevices,
    registered: devices.registered,
    registerInProgress: devices.registerInProgress,
  };
};

export default connect(mapStateToProps)(Header);
