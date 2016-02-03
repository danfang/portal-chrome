import React, { Component } from 'react'
import { connect } from 'react-redux'

import { selectThread } from '../actions/messageActions'
import Thread from './Thread'

class Threads extends Component {
  threadOnClicked(index) {
    const { dispatch } = this.props
    dispatch(selectThread(index))
  }
  render() {
    // TODO: Add FeedbackThread
    const { currentThread, threads } = this.props
    const threadElements = threads.map((thread, index) => {
      return (
        <Thread
          key={index}
          threadOnClicked={(e) => this.threadOnClicked(index)}
          selected={index == currentThread}
          thread={thread}>
        </Thread>
      )
    })
    return <div id="threads">
      <div id="threads-header">
        <p>Conversations</p>
      </div>
      <ul id="threads-body" className="mdl-list">
        { threadElements }
      </ul>
    </div>
  }
}

function mapStateToProps(state) {
    const { messages } = state
    return {
      currentThread: messages.currentThread,
      threads: messages.threads
    }
}

export default connect(mapStateToProps)(Threads)
