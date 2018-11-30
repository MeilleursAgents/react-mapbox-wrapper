import React, { Component } from 'react';
import MapboxMap, { Marker } from 'react-mapbox-wrapper';

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
    const { coordinates } = this.props;

    if (this.map) {
      marker = <Marker coordinates={coordinates} map={this.map} />;
    }

    return (
      <MapboxMap
        accessToken={global.ACCESS_TOKEN}
        coordinates={coordinates}
        className="map-container"
        onLoad={this.onMapLoad}
      >
        {marker}
      </MapboxMap>
    );
  }
}

MapWithMarker.displayName = 'MapWithMarker';
