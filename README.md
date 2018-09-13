# react-mapbox-wrapper

[![Build Status](https://travis-ci.org/MeilleursAgents/react-mapbox-wrapper.svg?branch=master)](https://travis-ci.org/MeilleursAgents/react-mapbox-wrapper)
[![npm version](https://badge.fury.io/js/react-mapbox-wrapper.svg)](https://badge.fury.io/js/react-mapbox-wrapper)

React wrapper for [mapboxgl-js API](https://www.mapbox.com/mapbox-gl-js/api/).

Made with ❤️ by [MeilleursAgents](https://www.meilleursagents.com)

![](sample.png)

## Usage

```js
import React from 'react';
import MapboxMap from 'react-mapbox-wrapper';

export default function SimpleMap() {
  return (
    <div style={{ height: 400, width: 400 }}>
      <MapboxMap
        accessToken="<your acess token here>"
        coordinates={{ lat: 48.872198, lng: 2.3366308 }}
      />
    </div>
  );
}

SimpleMap.displayName = 'SimpleMap';
```

See [examples](examples/src/) folder for more example.

## API

### MapboxMap

React Component that render a Mapbox Map. Extra props are directly passed to the [Map constructor](https://www.mapbox.com/mapbox-gl-js/api/#map). Following props are handled by wrapper for updating or handling behavior in the React philosophy.

Wrapper is CSS flex-ready for *width* but you **have to set a height** for having visible Mapbox.

| Props | Type | Default | Description |
| -- | -- | -- | -- |
| accessToken | String | required | Mapbox Access Token ([find it here](https://www.mapbox.com/account/access-tokens)) |
| coordinates | Object | required | Coordinates of the map center <br /> In the form `{ lng: 3.4, lat: 1.2 }` |
| className | string | `''` | `className` added to map's wrapper. Your should provide a height in order to render the map (default at 0) |
| children | Node | `null` | Rendered children, typically a [Marker](#Marker) and/or [Circle](#Circle) |
| minZoom | number | `undefined` | The minimum zoom level of the map (0-24). |
| maxZoom | number | `undefined` | The maximum zoom level of the map (0-24). |
| zoom | number | `15` | The viewport zoom |
| onChange | func | `undefined` | Callback function called on every viewport change (`moveend`, `zoomend`) <br /><br /> Callback receive param with the following shape <br /> `{ zoom: 15, coordinates: { lng: 3.4, lat: 1.2 } }` |
| onClick | func | `undefined` | Callback function called on [map's click](https://www.mapbox.com/mapbox-gl-js/api/#map.event:click) |
| onLoad | func | `undefined` | Callback function called on [map's load](https://www.mapbox.com/mapbox-gl-js/api/#map.event:load) with current Mapbox instance param |
| onZoomStart | func | `undefined` | Callback function called on [map's zoomstart](https://www.mapbox.com/mapbox-gl-js/api/#map.event:zoomstart) |
| onZoomEnd | func | `undefined` | Callback function called on [map's zoomend](https://www.mapbox.com/mapbox-gl-js/api/#map.event:zoomend) with a debounce of 300ms in order to avoid too many `render()` call |
| renderNotSupported | func | *Simple message* | Callback function called when [browser does not support mapbox-gl](https://www.mapbox.com/mapbox-gl-js/api/#supported) |
| style | String | | [Mapbox style layer](https://www.mapbox.com/mapbox-gl-js/style-spec/) |
| withCompass | bool | `false` | Show compass [Navigation Control](https://www.mapbox.com/mapbox-gl-js/api/#navigationcontrol) |
| withFullscreen | bool | `false` | Show [Fullscreen Control](https://www.mapbox.com/mapbox-gl-js/api/#fullscreencontrol) |
| withZoom | bool | `false` | Show zoom [Navigation Control](https://www.mapbox.com/mapbox-gl-js/api/#navigationcontrol) |

### Marker

React Component that render a Marker. Extra props are directly passed to the [Marker constructor](https://www.mapbox.com/mapbox-gl-js/api/#marker)

| Props | Type | Default | Description |
| -- | -- | -- | -- |
| map | Object | required | Mapbox Map where marker will be added (can be obtained with MapboxMap#onLoad props fn) |
| coordinates | Object | required | Coordinates of the marker <br /> In the form `{ lng: 3.4, lat: 1.2 }` |
| children | Node | `null` | Marker HTML DOM, default marker will be used if not provided |
| getRef | func |  | Callback function called with marker's ref (useful for calling `#moveToTop()` function) |
| draggable | bool | `false` | Allow user to drag'n'drop Marker |
| onDragEnd | func |  | Callback function called on [marker's dragend](https://www.mapbox.com/mapbox-gl-js/api/#marker.event:dragend) |
| popup | Node |  | Popup attached to the marker, displayed on click to marker |
| popupOffset | number |  | [Popup offset param](https://www.mapbox.com/mapbox-gl-js/api/#popup) |
| popupCloseButton | bool | `false` | [Popup closeButton param](https://www.mapbox.com/mapbox-gl-js/api/#popup) |
| popupOnOver | bool | `false` | Trigger popup show on mouse over (only available if **children** are provided, default marker cannot be bind) |
| onMouseOver | func |  | Callback function called on marker or popup mouseOver |
| onMouseOut | func |  | Callback function called on marker or popup mouseOut |

### Circle

React Component that render a Circle. Extra props are directly passed to the [Marker constructor](https://www.mapbox.com/mapbox-gl-js/api/#marker)

| Props | Type | Default | Description |
| -- | -- | -- | -- |
| map | Object | required | Mapbox Map where marker will be added (can be obtained with MapboxMap#onLoad props fn) |
| coordinates | Object | required | Coordinates of the marker <br /> In the form `{ lng: 3.4, lat: 1.2 }` |
| id | string | required | Identifier of circle, used to name the underlying layer |
| radius | number | required | Radius of circle, in kilometers |
| onClick | func | | Callback function called on circle's click |
| paint | Object | | [Paint option of the layer](https://www.mapbox.com/mapbox-gl-js/style-spec#layer-paint) |

## Development

You can use [`npm link`](https://docs.npmjs.com/cli/link) while developping new features on this repo for use in targeted repository.

```bash
npm link /path/to/react-mapbox-wrapper
```