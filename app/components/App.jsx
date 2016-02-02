import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { signOut } from '../actions/loginActions'
import { register } from '../actions/deviceActions'
import Threads from './Threads'
import Messages from './Messages'
import Header from './Header'
import Menu from './Menu'

class App extends Component {
  componentDidMount() {
    componentHandler.upgradeDom()
  }
  render() {
    const { dispatch } = this.props
    return <div id="app" refs="app" className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
      <Header { ...this.props } signOutOnClick={() => dispatch(signOut())} />
      <Menu { ...this.props } signOutOnClick={() => dispatch(signOut())} />
      <main className="mdl-layout__content">
        <div className="page-content">
          <div className="mdl-grid">
            <Threads />
            <Messages />
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
