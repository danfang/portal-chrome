import React, { Component, PropTypes } from 'react';

import LinkedDevice from './LinkedDevice';
import ListMenu from './material/ListMenu';
import Button from './material/Button';

class DeviceList extends Component {
  render() {
    const { linkedDevices } = this.props;
    const deviceElements = linkedDevices.map(device =>
      device ? <LinkedDevice key={device.created_at} device={device} /> : ''
    );
    return (
      <div>
        <Button id="device-list-menu">
          <span style={{ color: 'white' }} className="link-description">My Devices</span>
          <i style={{ color: 'white' }} className="material-icons">devices</i>
        </Button>
        <ListMenu for={'device-list-menu'}>
          { deviceElements }
        </ListMenu>
      </div>
    );
  }
}

DeviceList.propTypes = {
  linkedDevices: PropTypes.array.isRequired,
};

export default DeviceList;
