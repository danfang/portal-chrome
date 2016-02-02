import React, { Component, PropTypes } from 'react'
import NativeListener from 'react-native-listener';

export default class Header extends Component {
  componentDidUpdate() {
    componentHandler.upgradeDom()
  }
  render() {
    const { signOutOnClick, registered, registerInProgress } = this.props
    let statusIcon = null;
    let statusDescription = null;
    if (registered) {
      statusDescription = <span className="link-description">Connected</span>
      statusIcon = <i className="material-icons">check_circle</i>
    } else if (registerInProgress) {
      statusDescription = <span className="link-description">Connecting...</span>
      statusIcon = <div className="mdl-spinner mdl-js-spinner is-active"></div>
    } else {
      statusDescription = <span className="link-description">Not connected</span>
      statusIcon = <i className="material-icons">error_outline</i>
    }
    return (
      <header className="mdl-layout__header">
      <div className="mdl-layout__header-row">
        <span className="mdl-layout-title">Portal Messaging</span>
        <div className="mdl-layout-spacer"></div>
        <nav className="mdl-navigation">
          <a className="mdl-navigation__link" href="#">
            {statusDescription}
            {statusIcon}
          </a>
          <NativeListener onClick={signOutOnClick}>
            <a className="mdl-navigation__link" href="#">
              <span className="link-description">Sign Out</span>
              <i className="material-icons">exit_to_app</i>
            </a>
          </NativeListener>
        </nav>
      </div>
      </header>
    )
  }
}

Header.propTypes = {
  signOutOnClick: PropTypes.func.isRequired
}
