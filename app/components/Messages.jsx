import React, { Component } from 'react'
import Message from './Message'

class Messages extends Component {
  render() {
    return <div id="messages">
      <div id="messages-header">
        <p>Messages</p>
      </div>
      <div id="message-history">
        <Message />
        <Message />
        <Message />
        <Message />
      </div>
      <div id="message-input-container" className="mdl-textfield mdl-js-textfield">
        <input className="mdl-textfield__input" type="text" id="message-input" />
        <label className="mdl-textfield__label" for="message-input">Your message here...</label>
      </div>
    </div>
  }
}

export default Messages
