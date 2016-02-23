import React, { Component, PropTypes } from 'react';
import moment from 'moment';

function getStatusIcon(status) {
  switch (status) {
    case 'started':
      return 'autorenew';
    case 'sent':
      return 'done';
    case 'delivered':
      return 'check_circle';
    default:
      return '';
  }
}

class Message extends Component {
  render() {
    const { message } = this.props;
    const statusIcon = getStatusIcon(message.status);
    return (
      <div id={message.mid} className="message mdl-card mdl-shadow--2dp">
        <div className="mdl-card__supporting-text">
          { message.body }
        </div>
        <div className="date mdl-card__actions mdl-card--border">
          { moment(message.at * 1000).calendar() }
          <i className="material-icons">{ statusIcon }</i>
        </div>
      </div>
    );
  }
}

Message.propTypes = {
  message: PropTypes.object.isRequired,
};

export default Message;
