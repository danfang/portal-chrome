import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'

class App extends Component {
  signOutOnClick() {
    const { dispatch } = this.props;
    dispatch(signOut());
  }
  render() {
    return <div>
      <h1>Welcome to Portal.</h1>
      <button onClick={(e) => this.signOutOnClick(e)}>Sign Out</button>
    </div>
  }
}

App.PropTypes = {
  dispatch: PropTypes.func.isRequired
}

export default connect()(App);
