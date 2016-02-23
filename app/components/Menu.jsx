import React, { Component, PropTypes } from 'react';
import NativeListener from 'react-native-listener';

class Menu extends Component {
  render() {
    const { signOutOnClick } = this.props;
    return (
      <div ref="menu" className="mdl-layout__drawer">
        <span className="mdl-layout-title">Settings</span>
        <nav className="mdl-navigation">
          <NativeListener onClick={signOutOnClick}>
            <a className="mdl-navigation__link" href="#">
              <span className="link-description">Sign Out</span>
              <i className="material-icons">exit_to_app</i>
            </a>
          </NativeListener>
        </nav>
      </div>
    );
  }
}

Menu.propTypes = {
  signOutOnClick: PropTypes.func.isRequired,
};

export default Menu;
