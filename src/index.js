import React from 'react'
import { MapLayer, withLeaflet } from 'react-leaflet'
import PropTypes from 'prop-types'

import { markers } from './core'

import { isEquals } from './utils'

class Markers extends MapLayer {
  constructor(props) {
    super(props)

    this.leafletElement = L.markers(props)
    this.leafletElement
      .attachLayer(props.leaflet.map)
      .attachMarkers(props.markers)
  }

  componentDidMount() {
    super.componentDidMount()
    this.leafletElement.reset()
  }

  createLeafletElement(props) {
    return L.markers(props)
  }

  updateLeafletElement(fromProps, toProps) {
    !isEquals(fromProps.markers, toProps.markers) &&
      this.leafletElement.attachMarkers(toProps.markers)
  }
}

Markers.propTypes = {
  markers: PropTypes.array.isRequired,
  isDebug: PropTypes.bool.isRequired,
  options: PropTypes.shape({})
}

Markers.defaultProps = {
  isDebug: false,
  options: {}
}

export default withLeaflet(Markers)
