import React, { useState, useEffect } from 'react'
import { render } from 'react-dom'
import styled, { createGlobalStyle } from 'styled-components'
import { Map as Mapeable, TileLayer, Marker } from 'react-leaflet'
import v4 from 'uuid/v4'

import Markers from '../src/index'

const defaultIcon = L.icon({
  html: `<svg width="26" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.0675 45.8586L15.1749 39.1509C14.9814 38.8176 15.2219 38.4 15.6073 38.4H23.3926C23.778 38.4 24.0185 38.8176 23.8251 39.1509L19.9324 45.8586C19.7397 46.1907 19.2602 46.1907 19.0675 45.8586Z"
        fill="red"
        stroke="red"
      />
      <circle
        cx="20"
        cy="20"
        r="18.5"
        fill="white"
        stroke="red"
        strokeWidth="3"
      />
    </svg>`,
  iconSize: [24, 41],
  iconAnchor: [12, 41]
})

const Global = createGlobalStyle`
  * {
    font-family: 'Lato', sans-serif;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
`

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
`

const Map = styled(Mapeable)`
  margin-top: 50px;
  max-width: 800px;
  width: 100%;
  height: 50vh;
`

const Example = () => {
  const [messages, setMessages] = useState([])
  const [is, setIs] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('MARKERS ', messages.length)

      const markers = []

      for (var i = 0; i < 20; i++) {
        let marker = {
          latitude: -24.5578 + Math.random() * 1.8,
          longitude: -51.0087 + Math.random() * 3.6
        }

        markers.push(marker)
      }

      setMessages(messages => [...messages, ...markers])
    }, 2000)

    return () => clearInterval(interval)
  })

  const markers = () => {
    return messages.map(item => {
      return (
        <Marker
          onClick={() => console.log(item)}
          key={v4()}
          position={[item.latitude, item.longitude]}
          icon={defaultIcon}
          properties={{ ...item, key: v4() }}
        />
      )
    })
  }

  return (
    <>
      <Global />

      <Container>
        <button onClick={() => setIs(!is)}>toggle</button>

        <Map
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

          {is && (
            <Markers isDebug={true} dataKey="properties" markers={markers()} />
          )}
        </Map>
      </Container>
    </>
  )
}

render(<Example />, document.getElementById('app'))
