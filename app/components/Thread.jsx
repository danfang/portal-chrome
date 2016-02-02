import React, { Component } from 'react'
import NativeListener from 'react-native-listener'

export class Thread extends Component {
  render() {
    const { threadOnClicked, selected } = this.props
    return (
      <NativeListener onClick={threadOnClicked}>
        <li className={getListClassName(selected)}>
          <span className="mdl-list__item-primary-content">
            <i className="material-icons mdl-list__item-icon">person</i>
            <span className="mdl-list__item-text">Bryan Cranston</span>
          </span>
          <span className="mdl-list__item-secondary-content">
            <span className="mdl-list__item-secondary-info">Friend</span>
            <a className="mdl-list__item-secondary-action" href="#">
              <i className="material-icons">star</i>
            </a>
          </span>
        </li>
      </NativeListener>
    )
  }
}

export class NewMessageThread extends Component {
  render() {
    const { threadOnClicked, selected } = this.props
    return (
      <NativeListener onClick={threadOnClicked}>
        <li className={getListClassName(selected)}>
          <span className="mdl-list__item-primary-content">
            <i className="material-icons mdl-list__item-icon">person</i>
            <span className="mdl-list__item-text">New Message</span>
          </span>
        </li>
      </NativeListener>
    )
  }
}

function getListClassName(selected) {
  let listClassName = 'thread mdl-list__item mdl-list__item--two-line'
  listClassName += selected ? ' is-selected' : ''
  return listClassName
}
