import React, { Component, PropTypes } from 'react';

class Header extends Component {
  render() {
    return (
      <header { ...this.props } className="mdl-layout__header">
        <div className="mdl-layout__header-row">
          <span className="mdl-layout-title">{ this.props.title }</span>
          <div className="mdl-layout-spacer"></div>
          <nav className="mdl-navigation">
            { this.props.children }
          </nav>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};

export default Header;
