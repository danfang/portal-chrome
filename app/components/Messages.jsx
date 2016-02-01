import React, { Component } from 'react'
import Message from './Message'

class Messages extends Component {
  render() {
    return <div id="messages">
      <h1>Messages</h1>
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
    </div>
  }
}

export default Messages
