import React, { Component, PropTypes } from 'react'
import NativeListener from 'react-native-listener';

export default class Header extends Component {
  render() {
    const { signOutOnClick } = this.props
    return (
      <header className="mdl-layout__header">
      <div className="mdl-layout__header-row">
        <span className="mdl-layout-title">Portal Messaging</span>
        <div className="mdl-layout-spacer"></div>
        <nav className="mdl-navigation">
          <a className="mdl-navigation__link" href="#">Registration Status</a>
          <NativeListener onClick={signOutOnClick}>
            <a className="mdl-navigation__link"  href="#">Sign Out
              <i className="material-icons"></i>
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
