import React, { Component, PropTypes } from 'react';
import NativeListener from 'react-native-listener';
import DeviceList from './DeviceList';

export default class Header extends Component {
  componentDidUpdate() {
    componentHandler.upgradeAllRegistered();
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
    const { linkedDevices, isLinkedToPhone } = this.props;
    const { statusDescription, statusIcon } = this.getStatusElements();
    const noPhoneLinked = isLinkedToPhone ? '' : (
      <a id="alert-no-phone" className="mdl-navigation__link" href="#">
        <i className="material-icons">phonelink_erase</i>
        <div className="mdl-tooltip mdl-tooltip--large" htmlFor="alert-no-phone">
          No phone linked. Unable to send text messages.
        </div>
      </a>
    );
    return (
      <header id="app-header" className="mdl-layout__header">
      <div className="mdl-layout__header-row">
        <span className="mdl-layout-title">Portal Messaging</span>
        <div className="mdl-layout-spacer"></div>
        <nav className="mdl-navigation">
          { noPhoneLinked }
          <a id="alert-registration-status" className="mdl-navigation__link" href="#">
            <div className="mdl-tooltip mdl-tooltip--large" htmlFor="alert-registration-status">
              { statusDescription }
            </div>
            { statusIcon }
          </a>
          <NativeListener onClick={this.props.flushData}>
            <a id="clear-messages" className="mdl-navigation__link" href="#">
              <div className="mdl-tooltip mdl-tooltip--large" htmlFor="clear-messages">
                Clear all messages
              </div>
              <i className="material-icons">clear</i>
            </a>
          </NativeListener>
          <DeviceList linkedDevices={linkedDevices} />
        </nav>
      </div>
      </header>
    );
  }
}

Header.propTypes = {
  flushData: PropTypes.func,
  linkedDevices: PropTypes.array.isRequired,
  isLinkedToPhone: PropTypes.bool.isRequired,
  registered: PropTypes.bool.isRequired,
  registerInProgress: PropTypes.bool.isRequired,
};
