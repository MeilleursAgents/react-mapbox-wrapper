import React, { Component } from 'react';
import SyntaxHighlighter, { registerLanguage } from "react-syntax-highlighter/prism-light";
import jsx from 'react-syntax-highlighter/languages/prism/jsx';
import prism from 'react-syntax-highlighter/styles/prism/prism';
import SimpleMap from './SimpleMap';
import MapWithMarker from './MapWithMarker';
import MarkerWithPopup from './MarkerWithPopup';
import CustomMarkerOnOver from './CustomMarkerOnOver';
import AllInOne from './AllInOne';
import './App.css';

/**
 * Public access token retrieved from https://github.com/mapbox/mapbox-gl-supported/blob/gh-pages/diagnostics.html.
 * @type {String}
 */
global.ACCESS_TOKEN =
  'pk.eyJ1IjoibHVjYXN3b2oiLCJhIjoiY2l5Nmg4cWU1MDA0ejMzcDJtNHJmZzJkcyJ9.WhcEdTYQH6sSw2pm0RSP9Q';

registerLanguage('jsx', jsx);

/**
 * Default coordinates for example (in Paris)
 * @type {Object}
 */
global.DEFAULT_COORDINATES = { lat: 48.872198, lng: 2.3366308 };

export default class App extends Component {
  render() {
    return (
      <div>
        <header className="header">
          <h1>react-mapbox-wrapper</h1>
        </header>

        <a
          className="link"
          href="https://github.com/MeilleursAgents/react-mapbox-wrapper"
          target="_blank"
          rel="noreferrer noopener"
        >
          Documentation
        </a>

        <div className="content">
          <h2>SimpleMap</h2>
          <div className="example">
            <SimpleMap />
            <SyntaxHighlighter className="code" language="jsx" style={prism}>
              {`import React from 'react';
import { MapboxMap } from 'react-mapbox-wrapper';

export default function SimpleMap() {
  return (
    <MapboxMap
      accessToken={global.ACCESS_TOKEN}
      coordinates={global.DEFAULT_COORDINATES}
      zoom={15}
      className="map-container"
    />
  );
}

SimpleMap.displayName = 'SimpleMap';`}
            </SyntaxHighlighter>
          </div>
        </div>

        <div className="content">
          <h2>Marker</h2>
          <div className="example">
            <MapWithMarker />
            <SyntaxHighlighter className="code" language="jsx" style={prism}>
              {`import React, { Component } from 'react';
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

MapWithMarker.displayName = 'MapWithMarker';`}
            </SyntaxHighlighter>
          </div>
        </div>

        <div className="content">
          <h2>Marker with Popup on Click</h2>
          <div className="example">
            <MarkerWithPopup />
            <SyntaxHighlighter className="code" language="jsx" style={prism}>
              {`import React, { Component } from 'react';
import { MapboxMap, Marker } from 'react-mapbox-wrapper';

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
    if (this.map) {
      const popup = <div>Meaningful content on my Marker</div>;

      marker = (
        <Marker
          coordinates={global.DEFAULT_COORDINATES}
          map={this.map}
          popup={popup}
          popupOffset={30}
        />
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

MarkerWithPopup.displayName = 'MarkerWithPopup';`}
            </SyntaxHighlighter>
          </div>
        </div>

        <div className="content">
          <h2>Custom Marker with Popup on Over</h2>
          <div className="example">
            <CustomMarkerOnOver />
            <SyntaxHighlighter className="code" language="jsx" style={prism}>
              {`import React, { Component } from 'react';
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

CustomMarker.displayName = 'CustomMarker';`}
            </SyntaxHighlighter>
          </div>
        </div>

        <div className="content">
          <h2>Radius, Marker, Popup and fitBounds</h2>
          <div className="example">
            <AllInOne />
            <SyntaxHighlighter className="code" language="jsx" style={prism}>
              {`import React, { Component } from 'react';
import { MapboxMap, Marker, Circle, Helpers } from 'react-mapbox-wrapper';

const SENTIER_COORDINATES = { lat: 48.868526, lng: 2.3434886 };
const RADIUS_COORDINATES = { lat: 48.870362, lng: 2.3400597 };

const bounds = Helpers.newBounds();
bounds.extend(Helpers.newBound(global.DEFAULT_COORDINATES));
bounds.extend(Helpers.newBound(SENTIER_COORDINATES));

export default class AllInOne extends Component {
  constructor(props) {
    super(props);

    this.onMapLoad = this.onMapLoad.bind(this);
  }

  onMapLoad(map) {
    this.map = map;
    this.forceUpdate();

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
          coordinates={global.DEFAULT_COORDINATES}
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
        coordinates={global.DEFAULT_COORDINATES}
        zoom={15}
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

AllInOne.displayName = 'AllInOne';`}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    );
  }
}
