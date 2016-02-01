import React, { Component } from 'react'
import Thread from './Thread'

class Threads extends Component {
  render() {
    return <div id="threads">
      <h1>Conversations</h1>
      <Thread />
      <Thread />
      <Thread />
      <Thread />
      <Thread />
    </div>
  }
}

export default Threads
