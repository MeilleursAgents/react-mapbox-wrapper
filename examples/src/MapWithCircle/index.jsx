import React, { Component } from 'react';
import MapboxMap, { Circle } from 'react-mapbox-wrapper';

export default class MapWithCircle extends Component {
  constructor(props) {
    super(props);

    this.onMapLoad = this.onMapLoad.bind(this);
  }

  onMapLoad(map) {
    this.map = map;
    this.forceUpdate();
  }

  render() {
    let circle;
    const { coordinates } = this.props;

    if(this.map) {
        circle = <Circle
        key="radius"
        id="radius"
        coordinates={coordinates}
        map={this.map}
        radius={330}
        unit="feet"
        paint={{
          'fill-color': '#0074e4',
          'fill-opacity': 0.33,
        }}
      />
    }

    return (
      <MapboxMap
        accessToken={global.ACCESS_TOKEN}
        coordinates={coordinates}
        className="map-container"
        onLoad={this.onMapLoad}
      >
        {circle}
      </MapboxMap>
    );
  }
}

MapWithCircle.displayName = 'MapWithCircle';
