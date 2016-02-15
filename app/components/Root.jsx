import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import App from './App';
import Login from './Login';

class Root extends Component {
  render() {
    return this.props.loggedIn ? <App /> : <Login />;
  }
}

Root.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return { loggedIn: state.loginStatus.loggedIn };
}

export default connect(mapStateToProps)(Root);
