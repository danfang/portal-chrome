import React, { Component, PropTypes } from 'react';

export default class LinkedDevice extends Component {
  componentDidMount() {
    componentHandler.upgradeAllRegistered();
  }
  render() {
    const { device } = this.props;
    let deviceType = null;
    switch (device.type) {
      case 'chrome':
        deviceType = 'web';
        break;
      case 'phone':
        deviceType = 'smartphone';
        break;
      case 'desktop':
        deviceType = 'computer';
        break;
      default:
        deviceType = 'devices_other';
    }
    return (
      <li className="linked-device mdl-list__item">
        <span className="mdl-list__item-primary-content">
          <i className="material-icons mdl-list__item-icon">{deviceType}</i>
          { device.name }
        </span>
      </li>
    );
  }
}

LinkedDevice.propTypes = {
  device: PropTypes.shape({
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    updated_at: PropTypes.number.isRequired,
    created_at: PropTypes.number.isRequired,
  }),
};
