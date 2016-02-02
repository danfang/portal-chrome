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
  componentDidMount() {
    componentHandler.upgradeDom();
  }
  signOutOnClick() {
    const { dispatch } = this.props
    dispatch(signOut());
  }
  render() {
    const { dispatch, registered, registerInProgress, fetchingDevices, linkedDevices } = this.props
    let statusButton = <i className="material-icons">circle check</i>;
    if (!registered) {
      statusButton = registerInProgress ?
      <i className="material-icons">sync</i> : <i className="material-icons">error outline</i>
    }
    return <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
      <header className="mdl-layout__header">
        <div className="mdl-layout__header-row">
          <span className="mdl-layout-title">Portal Messaging</span>
          <div className="mdl-layout-spacer"></div>
          <nav className="mdl-navigation mdl-layout--large-screen-only">
            <a className="mdl-navigation__link" href="">
              { statusButton }
            </a>
            <a className="mdl-navigation__link" href="">
              Sign Out
              <i className="material-icons" onClick={(e) => this.signOutOnClick(e)}>exit to app</i>
            </a>
          </nav>
        </div>
      </header>
      <div className="mdl-layout__drawer">
        <span className="mdl-layout-title">Settings</span>
        <nav className="mdl-navigation">
          <a className="mdl-navigation__link" href="">
            Registration Status
            { statusButton }
          </a>
          <a className="mdl-navigation__link" href="">
            Sign Out
            <i className="material-icons" onClick={(e) => this.signOutOnClick(e)}>exit to app</i>
          </a>
        </nav>
      </div>
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
