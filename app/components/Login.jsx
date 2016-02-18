import React, { PropTypes, Component } from 'react';
import NativeListener from 'react-native-listener';
import { connect } from 'react-redux';

import { googleSignIn } from '../actions/login_actions';

function getStatusIcon(inProgress, error) {
  if (inProgress) {
    return <div className="mdl-spinner mdl-js-spinner is-active"></div>;
  }
  return error ? <i className="material-icons md-48">error_outline</i> : '';
}

export class Login extends Component {
  constructor() {
    super();
    this.signIn = this.signIn.bind(this);
  }
  componentDidMount() {
    componentHandler.upgradeAllRegistered();
  }
  componentDidUpdate() {
    componentHandler.upgradeAllRegistered();
  }
  signIn() {
    const { dispatch } = this.props;
    dispatch(googleSignIn());
  }
  render() {
    const { inProgress, error } = this.props;
    const statusIcon = getStatusIcon(inProgress, error);
    return (
      <div id="login">
        <h1>Portal Messaging</h1>
        <NativeListener onClick={this.signIn}>
          <div className="btn-sign-in"></div>
        </NativeListener>
        <div id="login-status">
          { error && <span className="link-description">{error}</span> }
          { statusIcon }
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  inProgress: PropTypes.bool.isRequired,
  error: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const { inProgress, credentials, error } = state.login;
  return { inProgress, error, credentials };
}

export default connect(mapStateToProps)(Login);
