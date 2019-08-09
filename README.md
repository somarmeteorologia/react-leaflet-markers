# React Leaflet Markers
> :pushpin: Provide a HOC to render markers with canvas instead DOM nodes with better performance. 

## How use

First, install the dependencie

```sh
yarn add @somarmeteorologia/react-leaflet-markers
```

See above a simple example

```js
import { Map, Marker } from 'react-leaflet'
import Markers from '@somarmeteorologia/react-leaflet-markers'

const defaultIcon = L.divIcon({
  html: renderToString(<Icon />),
  iconSize: [24, 41],
  iconAnchor: [12, 41],
})

<Map>
  <Markers isDebug={true} markers={
    markers.map(marker => (
      <Marker
        key={marker.key}
        icon={defaultIcon}
        position={[marker.latitude, marker.longitude]}
        properties={marker}
      />
    )
  } />
</Map>
```

The following attributes are required inside `properties` object from `Marker` component.

```js
{
  key: String|Number,
  latitude: Number,
  longitude: Number
}
```

The following attributes are required inside `icon` object from `Marker` component, between `html` or `iconUrl`, one of the two are required.

```js
{
  html: String,
  iconUrl: String,
  iconSize: Array[Number],
  iconArchor: Array[Number]
}
```

[See demo](https://react-leaflet-markers.surge.sh)

## Roadmap

- tests
- performance improvements
- optional attributes from icon and properties

## License

[MIT © Somar Meteorologia](https://github.com/somarmeteorologia/react-leaflet-markers/blob/master/LICENSE.md)
