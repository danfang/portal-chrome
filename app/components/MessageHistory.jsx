import React, { Component, PropTypes } from 'react';

import Message from './Message';

class MessageHistory extends Component {
  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }
  scrollToBottom() {
    this._messages.scrollTop = this._messages.scrollHeight;
  }
  render() {
    const messages = this.props.messages.map(message =>
      <Message key={message.mid} message={message} />
    );
    return <div ref={r => this._messages = r} id="message-history">{ messages }</div>;
  }
}

MessageHistory.propTypes = {
  messages: PropTypes.array.isRequired,
};

export default MessageHistory;
