import React, { Component } from 'react';

class Snackbar extends Component {
  alert(message) {
    this._snackbar.MaterialSnackbar.showSnackbar({ message, timeout: 2000 });
  }
  render() {
    return (
      <div ref={r => this._snackbar = r} className="mdl-js-snackbar mdl-snackbar">
        <div className="mdl-snackbar__text"></div>
        <button className="mdl-snackbar__action" type="button"></button>
      </div>
    );
  }
}

export default Snackbar;
