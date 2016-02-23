import React, { Component, PropTypes } from 'react';
import NativeListener from 'react-native-listener';
import moment from 'moment';

import { NEW_MESSAGE_INDEX } from '../constants';

const maxMessagePreviewLength = 45;

function getListClassName(selected) {
  const selectedClass = selected ? ' is-selected' : '';
  return `thread mdl-list__item mdl-list__item--two-line ${selectedClass}`;
}

class Thread extends Component {
  constructor(props) {
    super(props);
    const { index, threadOnClicked } = props;
    this.onClick = () => threadOnClicked(index);
  }
  render() {
    const { index, selected, thread } = this.props;
    let time = 'Now';
    let to = 'New Message';
    let messagePreview = '';
    if (index !== NEW_MESSAGE_INDEX) {
      const lastMessage = thread.messages[thread.messages.length - 1];
      to = thread.contact;
      time = moment(lastMessage.at * 1000).fromNow();
      messagePreview = lastMessage.body.substring(0, maxMessagePreviewLength).trim();
    }
    return (
      <NativeListener onClick={this.onClick}>
        <li className={getListClassName(selected)}>
          <span className="mdl-list__item-primary-content">
            <i className="material-icons mdl-list__item-icon">person</i>
            <div>
              <span className="mdl-list__item-text">{ to }</span>
              <span className="mdl-list__item-sub-title">{ messagePreview }</span>
            </div>
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
  index: PropTypes.number.isRequired,
  threadOnClicked: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  thread: PropTypes.shape({
    contact: PropTypes.object.isRequired,
    messages: PropTypes.array.isRequired,
    messageInput: PropTypes.string,
  }),
};

export default Thread;
