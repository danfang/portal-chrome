import React, { Component, PropTypes } from 'react';
import NativeListener from 'react-native-listener';

function getListClassName(selected) {
  const selectedClass = selected ? ' is-selected' : '';
  return `thread mdl-list__item mdl-list__item--two-line ${selectedClass}`;
}

export default class Thread extends Component {
  render() {
    const { threadOnClicked, selected, thread } = this.props;
    let time = 'Now';
    if (thread.messages.length > 0) {
      time = new Date(thread.messages[thread.messages.length - 1].at).toLocaleString();
    }
    return (
      <NativeListener onClick={threadOnClicked}>
        <li className={getListClassName(selected)}>
          <span className="mdl-list__item-primary-content">
            <i className="material-icons mdl-list__item-icon">person</i>
            <span className="mdl-list__item-text">{thread.contact.name || thread.phoneNumber}</span>
          </span>
          <span className="mdl-list__item-secondary-content">
            <span className="mdl-list__item-secondary-info">{ time }</span>
          </span>
        </li>
      </NativeListener>
    );
  }
}

Thread.propTypes = {
  threadOnClicked: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  thread: PropTypes.shape.isRequired,
};
