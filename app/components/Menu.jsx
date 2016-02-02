import React, { Component, PropTypes } from 'react'
import NativeListener from 'react-native-listener';

export default class Menu extends Component {
  render() {
    const { signOutOnClick } = this.props
    return (
      <div ref="menu" className="mdl-layout__drawer">
        <span className="mdl-layout-title">Settings</span>
        <nav className="mdl-navigation">
          <a className="mdl-navigation__link" href="#">Registration Status</a>
          <NativeListener onClick={signOutOnClick}>
            <a className="mdl-navigation__link" href="#">Sign Out
              <i className="material-icons">exit to app</i>
            </a>
          </NativeListener>
        </nav>
      </div>
    )
  }
}

Menu.propTypes = {
  signOutOnClick: PropTypes.func.isRequired
}
