import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import NativeListener from 'react-native-listener';

import { DEBUG_MODE, NEW_MESSAGE_INDEX } from '../const';
import MessageList from './MessageList';
import { sendMessage } from '../actions/messages';

class Messages extends Component {
  constructor() {
    super();
    this.onKeyUp = this.onKeyUp.bind(this);
  }
  componentDidMount() {
    componentHandler.upgradeAllRegistered();
    this.scrollToBottom();
  }
  componentDidUpdate() {
    componentHandler.upgradeAllRegistered();
    this.scrollToBottom();
  }
  onKeyUp(e) {
    if (e.code === 'Enter') {
      const { newMessage, currentThread } = this.props;
      const to = newMessage ? this._messageTo.value :
          (currentThread.contact.name || currentThread.phoneNumber);
      if (!to) {
        this._alerts.MaterialSnackbar.showSnackbar({
          message: 'Please enter a contact to send to.',
          timeout: 2000,
        });
        this._messageTo.focus();
      } else if (!this._messageInput.value) {
        this._alerts.MaterialSnackbar.showSnackbar({
          message: 'Please enter a message.',
          timeout: 2000,
        });
      } else {
        const { dispatch } = this.props;
        dispatch(sendMessage({ to, body: this._messageInput.value }));
        this._messageInput.value = '';
        this.scrollToBottom();
      }
    }
  }
  scrollToBottom() {
    this._messageHistory.scrollTop = this._messageHistory.scrollHeight;
  }
  render() {
    const { newMessage, isDisabled } = this.props;
    let toField = '';
    if (newMessage) {
      toField = (
        <div id="message-to-container" className="mdl-textfield mdl-js-textfield">
          <input id="message-to" className="mdl-textfield__input"
            ref={r => this._messageTo = r}
            type="text"
          />
          <label className="mdl-textfield__label" htmlFor="message-to">
            Enter a name or phone number...
          </label>
        </div>
      );
    }
    let messages = [];
    let messageInputValue = '';
    if (this.props.currentThread) {
      const { messageInput } = this.props.currentThread;
      messages = this.props.currentThread.messages;
      messageInputValue = messageInput;
    }
    const messageInputElement = (
      <input id="message-input" ref={r => this._messageInput = r}
        className="mdl-textfield__input" type="text" defaultValue={messageInputValue}
        disabled={isDisabled && !DEBUG_MODE}
      />
    );
    return (
      <div id="messages">
        <div id="messages-header">
          <p>Messages</p>
        </div>
        <div ref={r => this._alerts = r} className="mdl-js-snackbar mdl-snackbar">
          <div className="mdl-snackbar__text"></div>
          <button className="mdl-snackbar__action" type="button"></button>
        </div>
        <div ref={r => this._messageHistory = r} id="message-history">
          <MessageList messages={messages} />
        </div>
        { toField }
        <div id="message-input-container" className="mdl-textfield mdl-js-textfield">
          <NativeListener onKeyUp={this.onKeyUp}>
            { messageInputElement }
          </NativeListener>
          <label className="mdl-textfield__label" htmlFor="message-input">
            { isDisabled ? 'Unable to send messages. Please link a valid phone.' :
                           'Your message here...' }
          </label>
        </div>
      </div>
    );
  }
}

Messages.propTypes = {
  newMessage: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  currentThread: PropTypes.shape({
    messages: PropTypes.array.isRequired,
    messageInput: PropTypes.string.isRequired,
    contact: PropTypes.object,
    phoneNumber: PropTypes.string,
  }),
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const { currentThreadIndex, threads } = state.messages;
  if (currentThreadIndex === NEW_MESSAGE_INDEX) {
    return { newMessage: true };
  }
  return {
    newMessage: false,
    currentThread: threads[currentThreadIndex],
  };
}

export default connect(mapStateToProps)(Messages);
