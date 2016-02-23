import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import App from './App';
import Login from './Login';

export class Root extends Component {
  componentDidMount() {
    componentHandler.upgradeAllRegistered();
  }
  componentDidUpdate() {
    componentHandler.upgradeAllRegistered();
  }
  render() {
    return this.props.loggedIn ? <App /> : <Login />;
  }
}

Root.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return { loggedIn: state.login.loggedIn };
}

export default connect(mapStateToProps)(Root);
