import React, { Component } from 'react'
import Message from './Message'

class Messages extends Component {
  render() {
    let messages = [0,1,2,3,4,5,6,7,8,9,10,11,12,13].map((message) => {
      return <Message key={message} />
    })
    return <div id="messages">
      <div id="messages-header">
        <p>Messages</p>
      </div>
      <div id="message-history">
        {messages}
      </div>
      <div id="message-input-container" className="mdl-textfield mdl-js-textfield">
        <input className="mdl-textfield__input" type="text" id="message-input" />
        <label className="mdl-textfield__label" hrmlFor="message-input">Your message here...</label>
      </div>
    </div>
  }
}

export default Messages
