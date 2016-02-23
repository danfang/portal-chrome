import React, { Component, PropTypes } from 'react';

class Button extends Component {
  render() {
    return (
      <div {...this.props} className="mdl-button mdl-js-button">
        {this.props.children}
      </div>
    );
  }
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Button;
