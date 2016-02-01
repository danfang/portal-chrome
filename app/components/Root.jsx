import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { initialize, googleSignIn, signOut } from '../actions/loginActions'
import App from './App'

class Root extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(initialize());
  }
  signInOnClick() {
    const { dispatch } = this.props;
    dispatch(googleSignIn())
  }
  render() {
    const { dispatch, loggedIn, loginInProgress, loginError } = this.props;
    if (!loggedIn) {
      return <div id="login">
        <h1>Login to Portal</h1>
        <button onClick={(e) => this.signInOnClick(e)}>Sign in with Google</button>
        { loginInProgress && <span>Logging in...</span> }
        { loginError && <span>Error{loginError}</span>}
      </div>
    }
    return <App />
  }
}

Root.propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    loginInProgress: PropTypes.bool.isRequired,
    loginError: PropTypes.string,
    dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { loginStatus, appStatus } = state;
  return {
    loggedIn: loginStatus.loggedIn,
    loginInProgress: loginStatus.inProgress,
    loginError: loginStatus.error
  }
}

export default connect(mapStateToProps)(Root);
