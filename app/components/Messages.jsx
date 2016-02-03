import React, { Component } from 'react'
import { connect } from 'react-redux'
import NativeListener from 'react-native-listener'

import Message from './Message'
import { sendMessage } from '../actions/messageActions'
import { DEBUG_MODE } from '../const'

class Messages extends Component {
  componentDidMount() {
    componentHandler.upgradeAllRegistered()
  }
  componentDidUpdate() {
    componentHandler.upgradeAllRegistered()
  }
  onKeyUp(e) {
    if (e.code === 'Enter') {
      const { newMessage, currentThread } = this.props
      let to = newMessage ? this._messageTo.value : (currentThread.contact.name || currentThread.phoneNumber)
      if (!to) {
        this._alerts.MaterialSnackbar.showSnackbar({
          message: 'Please enter a contact to send to.',
          timeout: 2000
        })
        this._messageTo.focus()
      } else if (!this._messageInput.value) {
        this._alerts.MaterialSnackbar.showSnackbar({
          message: 'Please enter a message.',
          timeout: 2000
        })
      } else {
        const { dispatch } = this.props
        dispatch(sendMessage({
          to: to,
          body: this._messageInput.value
        }))
        this._messageInput.value = ''
        this._messageHistory.scrollTop = this._messageHistory.scrollHeight
      }
    }
  }
  render() {
    const { newMessage, currentThread, isDisabled } = this.props
    const { messages, messageInput } = currentThread
    let messageElements = messages.map((message) => {
      return <Message key={message.mid} message={message} />
    })
    let toField = ''
    if (newMessage) {
      toField = (
        <div id="message-to-container" className="mdl-textfield mdl-js-textfield">
          <input id="message-to" className="mdl-textfield__input"
            ref={r => this._messageTo = r}
            type="text"/>
          <label className="mdl-textfield__label" htmlFor="message-to">Enter a name or phone number...</label>
        </div>
      )
    }
    let messageInputElement = (
      <input id="message-input" ref={r => this._messageInput = r}
        className="mdl-textfield__input" type="text" defaultValue={messageInput}>
      </input>
    )
    if (isDisabled && !DEBUG_MODE) {
      messageInputElement = (
        <input id="message-input" ref={r => this._messageInput = r}
         className="mdl-textfield__input" type="text" defaultValue={messageInput} disabled>
        </input>
      )
    }
    return <div id="messages">
      <div id="messages-header">
        <p>Messages</p>
      </div>
      <div ref={r => this._alerts = r} className="mdl-js-snackbar mdl-snackbar">
        <div className="mdl-snackbar__text"></div>
        <button className="mdl-snackbar__action" type="button"></button>
      </div>
      <div ref={r => this._messageHistory = r} id="message-history">
        {messageElements}
      </div>
      { toField }
      <div id="message-input-container" className="mdl-textfield mdl-js-textfield">
        <NativeListener onKeyUp={(e) => this.onKeyUp(e)}>
          { messageInputElement }
        </NativeListener>
        <label className="mdl-textfield__label" htmlFor="message-input">
          { isDisabled ? 'Unable to send messages. Please link a valid phone.' : 'Your message here...' }
        </label>
      </div>
    </div>
  }
}

function mapStateToProps(state) {
    const { currentThread, threads } = state.messages
    return {
      newMessage: currentThread == 0,
      currentThread: threads[currentThread]
    }
}

export default connect(mapStateToProps)(Messages)
