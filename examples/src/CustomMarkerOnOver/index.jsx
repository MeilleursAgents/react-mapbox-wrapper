import React, { Component } from 'react';
import { MapboxMap, Marker } from 'react-mapbox-wrapper';

export default class CustomMarker extends Component {
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
      const popup = <div>http://localhost</div>;

      marker = (
        <Marker
          coordinates={global.DEFAULT_COORDINATES}
          map={this.map}
          popup={popup}
          popupOnOver
          popupOffset={20}
        >
          <span role="img" aria-label="Emoji Marker" style={{ fontSize: '30px' }}>
            🏢
          </span>
        </Marker>
      );
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

CustomMarker.displayName = 'CustomMarker';
