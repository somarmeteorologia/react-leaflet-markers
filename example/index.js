import React, { useState, useEffect } from 'react'
import { renderToString } from 'react-dom/server'
import { render } from 'react-dom'
import styled, { createGlobalStyle } from 'styled-components'
import { Marker as Markeable } from 'react-leaflet'
import v4 from 'uuid/v4'

import Map from './Map'
import Marker from './Marker'

import Markers from '../src/index'

const defaultIcon = L.divIcon({
  html: renderToString(<Marker />),
  iconSize: [15, 15],
  className: 'icon'
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

  .button {
    margin-top: 60px;
    margin-bottom: 20px;
  }
`

const Example = () => {
  const [messages, setMessages] = useState([])
  const [withLibrary, setWithLibrary] = useState(true)
  const [withoutLibrary, setWithoutLibrary] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages(messages => {
        const [first, rest] = messages
        const result = messages.length > 2 ? [rest] : messages

        return [...result]
      })

      for (var i = 0; i < 3; i++) {
        let marker = {
          latitude: -24.5578 + Math.random() * 1.8,
          longitude: -51.0087 + Math.random() * 3.6
        }

        setMessages(messages => [...messages, marker])
      }
    }, 2000)

    return () => clearInterval(interval)
  })

  const markers = () => {
    return messages.map(item => {
      return (
        <Markeable
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
        <button className="button" onClick={() => setWithLibrary(!withLibrary)}>
          toggle with react-leaflet-markers
        </button>

        <Map>
          {withLibrary && (
            <Markers isDebug={true} dataKey="properties" markers={markers()} />
          )}
        </Map>

        <button
          className="button"
          onClick={() => setWithoutLibrary(!withoutLibrary)}
        >
          toggle without react-leaflet-markers
        </button>

        <Map>{withoutLibrary && markers()}</Map>
      </Container>
    </>
  )
}

render(<Example />, document.getElementById('app'))
