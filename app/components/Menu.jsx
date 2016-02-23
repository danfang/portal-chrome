import React, { Component, PropTypes } from 'react';
import NativeListener from 'react-native-listener';
import { connect } from 'react-redux';

import { signOut } from '../actions/login_actions';

class Menu extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    this.signOut = () => dispatch(signOut());
  }
  render() {
    return (
      <div ref="menu" className="mdl-layout__drawer">
        <span className="mdl-layout-title">Settings</span>
        <nav className="mdl-navigation">
          <NativeListener onClick={this.signOut}>
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
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Menu);
