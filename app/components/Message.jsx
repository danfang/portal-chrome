import React, { Component } from 'react'

class Message extends Component {
  render() {
    const { message } = this.props
    return <div className="message demo-card-square mdl-card mdl-shadow--2dp">
      <div className="mdl-card__supporting-text">
        { message.body }
      </div>
    </div>
  }
}

export default Message
