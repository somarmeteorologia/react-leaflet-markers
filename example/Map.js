import React from 'react'
import { Map as Mapeable, TileLayer } from 'react-leaflet'
import styled from 'styled-components'

const Container = styled(Mapeable)`
  max-width: 800px;
  width: 100%;
  height: 30vh;
`

export default function Map({ children }) {
  return (
    <Container
      center={{
        lat: -24.725261017477113,
        lng: -51.1831060051918
      }}
      zoom={9}
      onControl
      zoomControl
      scrollWheelZoom
      dragging
      trackResize
    >
      <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />

      {children}
    </Container>
  )
}
