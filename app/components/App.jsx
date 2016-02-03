import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { signOut } from '../actions/loginActions'
import { register, fetchDevices } from '../actions/deviceActions'
import Threads from './Threads'
import Messages from './Messages'
import Header from './Header'
import Menu from './Menu'

class App extends Component {
  componentDidMount() {
    const { dispatch, registered } = this.props
    if (!registered) {
      dispatch(register())
    }
    dispatch(fetchDevices())
    componentHandler.upgradeAllRegistered()
  }
  render() {
    const { dispatch, isLinkedToPhone } = this.props
    return <div id="app" refs="app" className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
      <Header { ...this.props } />
      <Menu { ...this.props } signOutOnClick={() => dispatch(signOut())} />
      <main className="mdl-layout__content">
        <div className="page-content">
          <div className="mdl-grid">
            <Threads />
            <Messages isDisabled={ !isLinkedToPhone }/>
          </div>
        </div>
      </main>
    </div>
  }
}

App.PropTypes = {
  registered: PropTypes.bool.isRequired,
  registerInProgress: PropTypes.bool.isRequired,
  fetchingDevices: PropTypes.bool.isRequired,
  linkedDevices: PropTypes.array.isRequired,
  isLinkedToPhone: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
}

function linkedPhoneExists(devices) {
  return devices.find((device) => {
    return device.type == 'phone'
  }) !== undefined
}

function mapStateToProps(state) {
  const { devices } = state;
  return {
    registered: devices.registered,
    registerInProgress: devices.registerInProgress,
    fetchingDevices: devices.fetchingDevices,
    linkedDevices: devices.linkedDevices,
    isLinkedToPhone: linkedPhoneExists(devices.linkedDevices)
  }
}
export default connect(mapStateToProps)(App);
