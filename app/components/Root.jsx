import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import NativeListener from 'react-native-listener';

import { googleSignIn } from '../actions/loginActions';
import App from './App';

class Root extends Component {
  componentDidMount() {
    componentHandler.upgradeAllRegistered();
  }
  componentDidUpdate() {
    componentHandler.upgradeAllRegistered();
  }
  render() {
    const { dispatch, loginStatus } = this.props;
    const { loggedIn, inProgress, error } = loginStatus;
    let statusIcon = '';
    if (inProgress) {
      statusIcon = <div className="mdl-spinner mdl-js-spinner is-active"></div>;
    } else if (error) {
      statusIcon = <i className="material-icons md-48">error_outline</i>;
    }
    if (!loggedIn) {
      return (
        <div id="login">
          <h1>Portal Messaging</h1>
          <NativeListener onClick={dispatch(googleSignIn())}>
            <div className="btn-sign-in"></div>
          </NativeListener>
          <div id="login-status">
            { error && <span className="link-description">{error}</span> }
            { statusIcon }
          </div>
        </div>
      );
    }
    return <App />;
  }
}

Root.propTypes = {
  loginStatus: PropTypes.shape({
    loggedIn: PropTypes.bool.isRequired,
    inProgress: PropTypes.bool.isRequired,
    error: PropTypes.string,
    credentials: PropTypes.shape({
      userToken: PropTypes.string,
      userID: PropTypes.string,
    }),
  }),
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const { loginStatus } = state;
  return { loginStatus };
}

export default connect(mapStateToProps)(Root);
