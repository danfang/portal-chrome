import React, { Component } from 'react'
import NativeListener from 'react-native-listener'

export default class Thread extends Component {
  render() {
    const { threadOnClicked, selected, thread } = this.props
    console.log(thread)
    return (
      <NativeListener onClick={threadOnClicked}>
        <li className={getListClassName(selected)}>
          <span className="mdl-list__item-primary-content">
            <i className="material-icons mdl-list__item-icon">person</i>
            <span className="mdl-list__item-text">{thread.contact.name || thread.phoneNumber}</span>
          </span>
          <span className="mdl-list__item-secondary-content">
            <span className="mdl-list__item-secondary-info">Jan 3</span>
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
