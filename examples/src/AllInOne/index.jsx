import React, { Component } from 'react';
import MapboxMap, { Marker, Circle, Helpers } from 'react-mapbox-wrapper';

const SENTIER_COORDINATES = { lat: 48.868526, lng: 2.3434886 };
const RADIUS_COORDINATES = { lat: 48.870362, lng: 2.3400597 };

export default class AllInOne extends Component {
  constructor(props) {
    super(props);

    this.onMapLoad = this.onMapLoad.bind(this);
  }

  onMapLoad(map, coordinates) {
    this.map = map;
    this.forceUpdate();

    const bounds = Helpers.newBounds();
    bounds.extend(Helpers.newBound({lat: 48.872198, lng: 2.3366308}));
    bounds.extend(Helpers.newBound(SENTIER_COORDINATES));

    this.map.jumpTo(this.map.cameraForBounds(bounds, { padding: 120 }));
  }

  render() {
    let markers;
    if (this.map) {
      const popupHaussmann = <div>Happy to be here</div>;
      const popupSentier = <div>Old home</div>;

      markers = [
        <Marker
          key="haussmann"
          coordinates={{lat: 48.872198, lng: 2.3366308}}
          map={this.map}
          popup={popupHaussmann}
          popupOnOver
          popupOffset={20}
        >
          <span role="img" aria-label="Emoji Marker" style={{ fontSize: '30px' }}>
            🏢
          </span>
        </Marker>,
        <Marker
          key="sentier"
          coordinates={SENTIER_COORDINATES}
          map={this.map}
          popup={popupSentier}
          popupOnOver
          popupOffset={20}
        >
          <span role="img" aria-label="Emoji Marker" style={{ fontSize: '30px' }}>
            🏠
          </span>
        </Marker>,
        <Circle
          key="radius"
          id="radius"
          coordinates={RADIUS_COORDINATES}
          map={this.map}
          radius={500}
          unit="meters"
          paint={{
            'fill-color': '#0074e4',
            'fill-opacity': 0.33,
          }}
        />,
      ];
    }

    return (
      <MapboxMap
        accessToken={global.ACCESS_TOKEN}
        coordinates={{lat: 48.872198, lng: 2.3366308}}
        className="map-container"
        onLoad={this.onMapLoad}
        withCompass
        withZoom
        withFullscreen
      >
        {markers}
      </MapboxMap>
    );
  }
}

AllInOne.displayName = 'AllInOne';
