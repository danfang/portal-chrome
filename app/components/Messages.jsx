import React, { Component, PropTypes } from 'react';
import NativeListener from 'react-native-listener';
import { connect } from 'react-redux';

import { DEBUG_MODE, NEW_MESSAGE_INDEX } from '../constants';
import { sendMessage } from '../actions/message_actions';

import MessageHistory from './MessageHistory';
import Snackbar from './Snackbar';

const messageInputDisabledText = 'Unable to send messages. Please link a valid phone.';
const messageInputText = 'Your message here...';
const messageToText = 'Enter a name or phone number...';

class Messages extends Component {
  constructor(props) {
    super(props);
    this.onKeyUp = this.onKeyUp.bind(this);
  }
  componentDidMount() {
    componentHandler.upgradeAllRegistered();
  }
  componentDidUpdate() {
    componentHandler.upgradeAllRegistered();
  }
  onKeyUp(e) {
    if (e.code === 'Enter') {
      const { newMessage, currentThread, dispatch } = this.props;
      const to = newMessage ? this._messageTo.value : currentThread.contact;
      if (!to) {
        this.alert('Please enter a contact to send to.');
        this._messageTo.focus();
      } else if (!this._messageInput.value) {
        this.alert('Please enter a message.');
        this._messageInput.focus();
      } else {
        dispatch(sendMessage({ to, body: this._messageInput.value }));
        this._messageInput.value = '';
      }
    }
  }
  alert(message) {
    this._alerts.MaterialSnackbar.showSnackbar({ message, timeout: 2000 });
  }
  render() {
    const { newMessage, isDisabled, currentThread } = this.props;
    const messages = newMessage ? [] : currentThread.messages;

    const messageToInput = newMessage ? (
      <div id="message-to-container" className="mdl-textfield mdl-js-textfield">
        <NativeListener onKeyUp={this.onKeyUp}>
          <input id="message-to" className="mdl-textfield__input"
            ref={r => this._messageTo = r}
            type="text"
          />
        </NativeListener>
        <label className="mdl-textfield__label" htmlFor="message-to">{ messageToText }</label>
      </div>
    ) : '';

    const messageBodyInput = (
      <div id="message-input-container" className="mdl-textfield mdl-js-textfield">
        <NativeListener onKeyUp={this.onKeyUp}>
          <input id="message-input" ref={r => this._messageInput = r}
            className="mdl-textfield__input" type="text"
            disabled={isDisabled && !DEBUG_MODE}
          />
        </NativeListener>
        <label className="mdl-textfield__label" htmlFor="message-input">
          { isDisabled ? messageInputDisabledText : messageInputText }
        </label>
      </div>
    );

    return (
      <div id="messages">
        <div id="messages-header"><p>Messages</p></div>
        <Snackbar ref={r => this._alerts = r} />
        { messageToInput }
        <MessageHistory messages={messages}/>
        { messageBodyInput }
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
    contact: PropTypes.string.isRequired,
  }),
  dispatch: PropTypes.func.isRequired,
};

function hasLinkedPhone(devices) {
  return devices.find(device => device && device.type === 'phone') !== undefined;
}

function mapStateToProps(state) {
  const { currentThreadIndex, threads } = state.messages;
  const isDisabled = !hasLinkedPhone(state.devices.linkedDevices);
  if (currentThreadIndex === NEW_MESSAGE_INDEX) {
    return { newMessage: true, isDisabled };
  }
  return {
    newMessage: false,
    currentThread: threads[currentThreadIndex],
    isDisabled,
  };
}

export default connect(mapStateToProps)(Messages);
