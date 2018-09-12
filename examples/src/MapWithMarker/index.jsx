import React, { Component } from 'react';
import { MapboxMap, Marker } from 'react-mapbox-wrapper';

export default class MapWithMarker extends Component {
  constructor(props) {
    super(props);

    this.onMapLoad = this.onMapLoad.bind(this);
  }

  onMapLoad(map) {
    this.map = map;
    this.forceUpdate();
  }

  render() {
    let marker;
    if (this.map) {
      marker = <Marker coordinates={global.DEFAULT_COORDINATES} map={this.map} />;
    }

    return (
      <MapboxMap
        accessToken={global.ACCESS_TOKEN}
        coordinates={global.DEFAULT_COORDINATES}
        zoom={15}
        className="map-container"
        onLoad={this.onMapLoad}
      >
        {marker}
      </MapboxMap>
    );
  }
}

MapWithMarker.displayName = 'MapWithMarker';
