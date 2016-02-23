import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { DEBUG_MODE, NEW_MESSAGE_INDEX } from '../constants';
import { sendMessage } from '../actions/message_actions';

import MessageHistory from './MessageHistory';
import Snackbar from './material/Snackbar';
import TextField from './material/TextField';

const messageInputDisabledText = 'Unable to send messages. Please link a valid phone.';
const messageInputEnabledText = 'Your message here...';

class Messages extends Component {
  constructor(props) {
    super(props);
    this.onKeyUp = this.onKeyUp.bind(this);
  }
  componentDidUpdate() {
    componentHandler.upgradeAllRegistered();
  }
  onKeyUp(e) {
    if (e.code === 'Enter') {
      const { newMessage, currentThread, dispatch } = this.props;
      const to = newMessage ? this._messageTo.getInput().value : currentThread.contact;
      if (!to) {
        this._snackbar.alert('Please enter a contact to send to.');
        this._messageTo.focus();
        return;
      }
      const input = this._messageBody.getInput();
      if (!input.value) {
        this._snackbar.alert('Please enter a message.');
        this._messageBody.focus();
        return;
      }
      dispatch(sendMessage({ to, body: input.value }));
      input.value = '';
    }
  }
  render() {
    const { newMessage, disabled, currentThread } = this.props;
    const messages = newMessage ? [] : currentThread.messages;
    const messageInputText = disabled ? messageInputDisabledText : messageInputEnabledText;
    return (
      <div id="messages">
        <div id="messages-header"><p>Messages</p></div>
        <Snackbar ref={r => this._snackbar = r} />
        { newMessage ? (
          <TextField
            ref={r => this._messageTo = r}
            id="message-to-container"
            inputId="message-to"
            onKeyUp={this.onKeyUp}
            disabled={disabled && !DEBUG_MODE}
            label="Enter a name or phone number..."
          />
        ) : '' }
        <MessageHistory messages={messages}/>
        <TextField
          ref={r => this._messageBody = r}
          id="message-input-container"
          inputId="message-input"
          onKeyUp={this.onKeyUp}
          disabled={disabled && !DEBUG_MODE}
          label={messageInputText}
        />
      </div>
    );
  }
}

Messages.propTypes = {
  newMessage: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  currentThread: PropTypes.shape({
    messages: PropTypes.array.isRequired,
    messageInput: PropTypes.string.isRequired,
    contact: PropTypes.string.isRequired,
  }),
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const { currentThreadIndex, threads } = state.messages;

  const disabled = state.devices.linkedDevices.find(device =>
    device && device.type === 'phone'
  ) === undefined;

  if (currentThreadIndex === NEW_MESSAGE_INDEX) {
    return {
      newMessage: true,
      disabled,
    };
  }
  return {
    currentThread: threads[currentThreadIndex],
    newMessage: false,
    disabled,
  };
}

export default connect(mapStateToProps)(Messages);
