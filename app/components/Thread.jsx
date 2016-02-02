import React, { Component } from 'react'

class Thread extends Component {
  render() {
    return (
      <li className="mdl-list__item mdl-list__item--two-line">
        <span className="mdl-list__item-primary-content">
          <i className="material-icons mdl-list__item-icon">person</i>
          <span className="mdl-list__item-text">Bryan Cranston</span>
          <span className="mdl-list__item-sub-title">Hey let's cook.</span>
        </span>
        <span className="mdl-list__item-secondary-content">
          <span className="mdl-list__item-secondary-info">Friend</span>
          <a className="mdl-list__item-secondary-action" href="#">
            <i className="material-icons">star</i>
          </a>
        </span>
      </li>
    )
  }
}

export default Thread
