import React, { Component, PropTypes } from 'react'
import LinkedDevice from './LinkedDevice'

export default class DeviceList extends Component {
  render() {
    const { linkedDevices } = this.props
    let deviceElements = linkedDevices.map((device) => {
      return <LinkedDevice key={device.created_at} device={device} />
    })
    return (
      <div>
        <div id="device-list-menu" className="mdl-button mdl-js-button">
          <span style={{color: 'white'}} className="link-description">My Devices</span>
          <i style={{color: 'white'}} className="material-icons">devices</i>
        </div>
        <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" htmlFor="device-list-menu">
          {deviceElements}
        </ul>
      </div>
    )
  }
}

DeviceList.propTypes = {
  linkedDevices: PropTypes.array.isRequired
}