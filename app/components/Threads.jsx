import React, { Component } from 'react'
import Thread from './Thread'

class Threads extends Component {
  render() {
    return <div id="threads">
      <div id="threads-header">
        <p>Conversations</p>
      </div>
      <ul id="threads-body" className="mdl-list">
        <Thread />
        <Thread />
        <Thread />
        <Thread />
        <Thread />
        <Thread />
        <Thread />
        <Thread />
        <Thread />
        <Thread />
        <Thread />
        <Thread />
        <Thread />
      </ul>
    </div>
  }
}

export default Threads
