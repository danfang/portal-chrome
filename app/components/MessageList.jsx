import React, { PropTypes, Component } from 'react';

import Message from './Message';

class MessageList extends Component {
  render() {
    const { messages } = this.props;
    const messageElements = messages.map((message) =>
      <Message key={message.mid} message={message} />
    );
    return <div id="message-list">{ messageElements }</div>;
  }
}

MessageList.propTypes = {
  messages: PropTypes.array.isRequired,
};

export default MessageList;
