import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { googleSignIn, signOut } from '../actions/loginActions'
import App from './App'
import NativeListener from 'react-native-listener';

class Root extends Component {
  componentDidMount() {
    componentHandler.upgradeDom()
  }
  render() {
    const { dispatch, loginStatus } = this.props;
    const { loggedIn, inProgress, error } = loginStatus;
    if (!loggedIn) {
      return <div id="login">
        <h1>Portal</h1>
        <NativeListener onClick={(e) => dispatch(googleSignIn())}>
          <div className="btn-sign-in"></div>
        </NativeListener>
        { inProgress && <span>Logging in...</span> }
        { error && <span>Error: {error}</span>}
      </div>
    }
    return <App />
  }
}

Root.propTypes = {
  loginStatus: PropTypes.shape({
    loggedIn: PropTypes.bool.isRequired,
    inProgress: PropTypes.bool.isRequired,
    error: PropTypes.string,
    credentials: PropTypes.shape({
      userToken: PropTypes.string,
      userID: PropTypes.string
    })
  }),
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { loginStatus } = state;
  return { loginStatus: loginStatus }
}

export default connect(mapStateToProps)(Root);
