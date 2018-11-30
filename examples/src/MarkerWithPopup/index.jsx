import React, { Component } from 'react';
import MapboxMap, { Marker } from 'react-mapbox-wrapper';

export default class MarkerWithPopup extends Component {
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
      const popup = <div>Meaningful content on my Marker</div>;

      marker = (
        <Marker
          coordinates={coordinates}
          map={this.map}
          popup={popup}
          popupOffset={30}
        />
      );
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

MarkerWithPopup.displayName = 'MarkerWithPopup';
