import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { NEW_MESSAGE_INDEX } from '../constants/AppConstants';
import { selectThread } from '../actions/messages';
import Thread from './Thread';

class Threads extends Component {
  constructor() {
    super();
    this.threadOnClicked = this.threadOnClicked.bind(this);
  }
  threadOnClicked(index) {
    const { dispatch } = this.props;
    dispatch(selectThread(index));
  }
  render() {
    const { currentThreadIndex, threads } = this.props;
    const threadElements = threads.map((thread, index) =>
      <Thread
        key={index}
        index={index}
        threadOnClicked={this.threadOnClicked}
        selected={index === currentThreadIndex}
        thread={thread}
      />
    );
    return (
      <div id="threads">
        <div id="threads-header">
          <p>Conversations</p>
        </div>
        <ul id="threads-body" className="mdl-list">
          <Thread
            key={NEW_MESSAGE_INDEX}
            index={NEW_MESSAGE_INDEX}
            selected={currentThreadIndex === NEW_MESSAGE_INDEX}
            threadOnClicked={this.threadOnClicked}
          />
          { threadElements }
        </ul>
      </div>
    );
  }
}

Threads.propTypes = {
  currentThreadIndex: PropTypes.number.isRequired,
  threads: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const { messages } = state;
  return {
    currentThreadIndex: messages.currentThreadIndex,
    threads: messages.threads,
  };
}

export default connect(mapStateToProps)(Threads);
