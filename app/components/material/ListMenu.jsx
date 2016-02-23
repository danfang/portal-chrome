import React, { Component, PropTypes } from 'react';

class Menu extends Component {
  render() {
    return (
      <ul
        { ...this.props }
        className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"
        htmlFor={this.props.for}
      >
        {this.props.children}
      </ul>
    );
  }
}

Menu.propTypes = {
  for: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Menu;
