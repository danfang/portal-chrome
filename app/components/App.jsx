import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { signOut } from '../actions/loginActions'
import { register } from '../actions/deviceActions'
import Threads from './Threads'
import Messages from './Messages'

class App extends Component {
  componentDidMount() {
    const { dispatch, registered } = this.props
    if (!registered) {
      dispatch(register())
    }
  }
  signOutOnClick() {
    const { dispatch } = this.props
    dispatch(signOut());
  }
  render() {
    const { dispatch, registered, registerInProgress, fetchingDevices, linkedDevices } = this.props
    return <div id="app">
      <div id="header">
        <h1>Portal</h1>
        <span>{ registered ? 'O' : (registerInProgress ? '+' : 'X')  }</span>
        <button onClick={(e) => this.signOutOnClick(e)}>Sign Out</button>
      </div>
      <Threads />
      <Messages />
      <input type="text">Type a message</input>
    </div>
  }
}

App.PropTypes = {
  registered: PropTypes.bool.isRequired,
  registerInProgress: PropTypes.bool.isRequired,
  fetchingDevices: PropTypes.bool.isRequired,
  linkedDevices: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { devices } = state;
  return {
    registered: devices.registered,
    registerInProgress: devices.registerInProgress,
    fetchingDevices: devices.fetchingDevices,
    linkedDevices: devices.linkedDevices
  }
}
export default connect(mapStateToProps)(App);
