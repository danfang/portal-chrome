import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectThread } from '../actions/message_actions';
import { NEW_MESSAGE_INDEX } from '../constants';

import Thread from './Thread';

const THREAD_REFRESH_INTERVAL = 30000;

class Threads extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    this.threadOnClicked = (index) => dispatch(selectThread(index));
  }
  componentDidMount() {
    setInterval(() => this.forceUpdate(), THREAD_REFRESH_INTERVAL);
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
        <div id="threads-header"><p>Conversations</p></div>
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
