import store from './store'

L.Markers = (L.Layer ? L.Layer : L.Class).extend({
  initialize: function(options) {
    L.setOptions(this, options)
  },

  init: function() {
    this.canvas = L.DomUtil.create(
      'canvas',
      'leaflet-canvas-icon-layer leaflet-layer'
    )

    const props = L.DomUtil.testProp([
      'transformOrigin',
      'WebkitTransformOrigin',
      'msTransformOrigin'
    ])

    this.canvas.style[props] = '50% 50%'

    const { x, y } = this._map.getSize()

    this.canvas.width = x
    this.canvas.height = y

    this._context = this.canvas.getContext('2d')

    const isAnimated = this._map.options.zoomAnimation && L.Browser.any3d

    L.DomUtil.addClass(
      this.canvas,
      `leaflet-zoom-${isAnimated ? 'animated' : 'hide'}`
    )
  },

  attachLayer: function(map) {
    map.addLayer(this)

    return this
  },

  /**
   * @param {Array} markers
   */
  attachMarkers: function(markers) {
    this.options.isDebug && console.info('ATTACH_MARKERS')

    store.positions.clear()
    store.coordinates.clear()

    const coordinates = []
    const positions = []

    markers.forEach(marker => {
      const [lat, lng] = marker.props.position
      const coordinate = { lat, lng }
      const isDisplaying = this._map.getBounds().contains(coordinate)

      const position = this._map
        ? this._map.latLngToContainerPoint(coordinate)
        : L.point(0, 0)

      const [width, height] = marker.props.icon.options.iconSize

      const x = width / 2
      const y = height / 2

      const data = {
        positions: {
          minX: position.x - x,
          minY: position.y - y,
          maxX: position.x + x,
          maxY: position.y + y,
          data: marker
        },
        coordinates: {
          minX: coordinate.lng,
          minY: coordinate.lat,
          maxX: coordinate.lng,
          maxY: coordinate.lat,
          data: marker
        }
      }

      isDisplaying && this.drawMarker(marker, position)

      positions.push(data.positions)
      coordinates.push(data.coordinates)
    })

    store.positions.load(positions)
    store.coordinates.load(coordinates)
  },

  onAdd: function(map) {
    this.options.isDebug && console.info('LAYER_ADDED')

    this._map = map

    !this.canvas && this.init()

    this.options.pane
      ? this.getPane().appendChild(this.canvas)
      : map._panes.overlayPane.appendChild(this.canvas)

    map.on('moveend', this.reset, this)
    map.on('click', this.onClick, this)
    map.on('zoomstart', this.clear, this)
    map.on('mousemove', this.onMouseMove, this)

    this.reset()
  },

  clear: function() {
    this._context &&
      this._context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  },

  onMouseMove: function(event) {
    L.DomUtil.removeClass(this.canvas, 'leaflet-interactive')
    for (var markerId in this._markers) {
      var marker = this._markers[markerId]
      var point = this._map.latLngToContainerPoint(
        this._markers[markerId].getLatLng()
      )

      if (this._hit(marker, point, event)) {
        L.DomUtil.addClass(this.canvas, 'leaflet-interactive')
        break
      }
    }
  },

  onRemove: function(map) {
    this.options.isDebug && console.info('ON_REMOVE')

    this.options.pane
      ? this.getPane().removeChild(this.canvas)
      : map.getPanes().overlayPane.removeChild(this.canvas)

    map.off('moveend', this.reset, this)
    map.off('click', this.onClick, this)
    map.off('zoomstart', this.clear, this)
    map.off('mousemove', this.onMouseMove, this)

    store.coordinates.clear()
    store.positions.clear()
  },

  drawMarker: function(marker, position) {
    if (!this.drawables) this.drawables = {}

    const icon =
      marker.props.icon.options.html || marker.props.icon.options.iconUrl
    const isHtml = !!marker.props.icon.options.html

    if (!this.drawables[icon]) {
      const drawable = new Image()

      const svg64 = btoa(icon)
      const b64Start = 'data:image/svg+xml;base64,'

      drawable.src = isHtml ? b64Start + svg64 : icon

      return (drawable.onload = () => {
        this.drawables[icon] = drawable
        this.draw(marker, position, drawable)
      })
    }

    this.draw(marker, position, this.drawables[icon])
  },

  draw: function(marker, position, image) {
    this._context.drawImage(
      image,
      position.x - marker.props.icon.options.iconSize[0] / 2,
      position.y - marker.props.icon.options.iconSize[0] / 2,
      marker.props.icon.options.iconSize[0],
      marker.props.icon.options.iconSize[1]
    )
  },

  reset: function() {
    this.options.isDebug && console.info('RESET')

    const topLeft = this._map.containerPointToLayerPoint([0, 0])

    L.DomUtil.setPosition(this.canvas, topLeft)

    const { x, y } = this._map.getSize()

    this.canvas.width = x
    this.canvas.height = y

    this.redraw()
  },

  redraw: function(clear) {
    this.options.isDebug && console.info('REDRAW')

    if (!this._map) {
      return
    }

    clear &&
      this._context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    if (!store.positions.all()) {
      return
    }

    const redraw = this._redrawredraw

    if (redraw) {
      const { x, y } = redraw.getSize()
      this._ctx.beginPath()
      this._ctx.rect(redraw.min.x, redraw.min.y, x, y)
      this._ctx.clip()
    }

    const redrawers = []

    //If we are 10% individual inserts\removals, reconstruct lookup for efficiency
    // if (self._latlngMarkers.dirty / self._latlngMarkers.total >= 0.1) {
    //   self._latlngMarkers.all().forEach(function(e) {
    //     tmp.push(e);
    //   });
    //   self._latlngMarkers.clear();
    //   self._latlngMarkers.load(tmp);
    //   self._latlngMarkers.dirty = 0;
    //   tmp = [];
    // }
    const bounds = this._map.getBounds()

    /**
     * @description Only re-draw what we are showing on the map.
     */
    store.coordinates
      .search({
        minX: bounds.getWest(),
        minY: bounds.getSouth(),
        maxX: bounds.getEast(),
        maxY: bounds.getNorth()
      })
      .forEach(({ data }) => {
        const [lat, lng] = data.props.position
        const coordinate = { lat, lng }

        const position = this._map.latLngToContainerPoint(coordinate)

        const iconSize = data.props.icon.options.iconSize
        const x = iconSize[0] / 2
        const y = iconSize[1] / 2

        redrawers.push({
          minX: position.x - x,
          minY: position.y - y,
          maxX: position.x + x,
          maxY: position.y + y,
          data
        })

        this.drawMarker(data, position)
      })

    store.positions.clear().load(redrawers)
  },

  onClick: function(event) {
    const position = this._map.latLngToContainerPoint(event.latlng)

    store.positions
      .search({
        minX: position.x,
        minY: position.y,
        maxX: position.x,
        maxY: position.y
      })
      .forEach(({ data }) => data.props.onClick())
  }
})

L.markers = function(options) {
  return new L.Markers(options)
}
