import React, { Component } from 'react'
import Message from './Message'

class Messages extends Component {
  render() {
    return <div id="messages" className="mdl-cell mdl-cell--8-col">
      <h1>Messages</h1>
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <input type="text">Type a message</input>
    </div>
  }
}

export default Messages
