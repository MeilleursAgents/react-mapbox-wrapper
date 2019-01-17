import React, { Component } from 'react';
import MapboxMap, { Marker } from 'react-mapbox-wrapper';

export default class MapWithMovingMarker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coordinates: props.coordinates,
    };

    this.onMapLoad = this.onMapLoad.bind(this);
  }

  /**
   * React lifecycle.
   */
  componentDidMount() {
    setInterval(() => {
      const { lat, lng } = this.props.coordinates;

      this.setState({
        coordinates: {
          lat: lat + 0.001 * Math.random(),
          lng: lng + 0.001 * Math.random(),
        },
      });
    }, 1000);
  }

  onMapLoad(map) {
    this.map = map;
    this.forceUpdate();
  }

  render() {
    let marker;
    const { coordinates } = this.props;

    if (this.map) {
      marker = <Marker coordinates={this.state.coordinates} map={this.map} />;
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

MapWithMovingMarker.displayName = 'MapWithMovingMarker';
