import React, { Component } from 'react';
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/prism-light';
import jsx from 'react-syntax-highlighter/languages/prism/jsx';
import prism from 'react-syntax-highlighter/styles/prism/prism';
import SimpleMap from './SimpleMap';
import MapWithMarker from './MapWithMarker';
import MarkerWithPopup from './MarkerWithPopup';
import CustomMarkerOnOver from './CustomMarkerOnOver';
import MapWithCircle from './MapWithCircle';
import AllInOne from './AllInOne';
import Places from 'places.js';
import './App.css';

/**
 * Public access token retrieved from https://github.com/mapbox/mapbox-gl-supported/blob/gh-pages/diagnostics.html.
 * @type {String}
 */
global.ACCESS_TOKEN =
  'pk.eyJ1IjoibHVjYXN3b2oiLCJhIjoiY2l5Nmg4cWU1MDA0ejMzcDJtNHJmZzJkcyJ9.WhcEdTYQH6sSw2pm0RSP9Q';

registerLanguage('jsx', jsx);

/**
 * App Component.
 */
export default class App extends Component {
  /**
   * Creates an instance of App.
   * @param {Object} props Component props
   */
  constructor(props) {
    super(props);

    this.state = {
      coordinates: {
        lat: 48.872198,
        lng: 2.3366308
      }
    };
  }

  /**
   * React lifecycle.
   */
  componentDidMount() {
    const placesAutocomplete = Places({
      container: document.querySelector('#address-input')
    });

    placesAutocomplete.on('change', e => this.setState({coordinates: e.suggestion.latlng}));
  }
  
  /**
   * React lifecycle.
   */
  render() {
    const { coordinates } = this.state;

    return (
      <div>
        <header className="header">
          <h1>react-mapbox-wrapper</h1>
          <a
            href="https://github.com/MeilleursAgents/react-mapbox-wrapper"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img
              style={{ position: 'absolute', top: 0, right: 0, border: 0 }}
              src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
              alt="Fork me on GitHub"
            />
          </a>
        </header>

        <a
          className="link"
          href="https://github.com/MeilleursAgents/react-mapbox-wrapper#usage"
          target="_blank"
          rel="noreferrer noopener"
        >
          Documentation
        </a>
        <a
          className="link margin-left"
          href="https://github.com/MeilleursAgents/react-mapbox-wrapper/tree/master/examples/src"
          target="_blank"
          rel="noreferrer noopener"
        >
          Examples sources
        </a>

        <div className="ap-input-wrapper">
          <input type="search" id="address-input" placeholder="Search a place" />
        </div>

        <div className="content">
          <h2>SimpleMap with fixed size</h2>
          <div className="example">
            <SimpleMap  className="map-container" coordinates={coordinates} />
            <SyntaxHighlighter className="code" language="jsx" style={prism}>
              {`import React from 'react';
  import MapboxMap from 'react-mapbox-wrapper';

  export default function SimpleMap({coordinates}) {
    return (
      <div style={{ height: 400, width: 400 }}>
        <MapboxMap
          accessToken={global.ACCESS_TOKEN}
          coordinates={coordinates}
        />
      </div>
    );
  }

  SimpleMap.displayName = 'SimpleMap';`}
            </SyntaxHighlighter>
          </div>
        </div>

        <div className="content">
          <h2>Marker</h2>
          <div className="example">
            <MapWithMarker coordinates={coordinates} />
            <SyntaxHighlighter className="code" language="jsx" style={prism}>
              {`import React, { Component } from 'react';
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

  MapWithMarker.displayName = 'MapWithMarker';`}
            </SyntaxHighlighter>
          </div>
        </div>

        <div className="content">
          <h2>Marker with Popup on Click</h2>
          <div className="example">
            <MarkerWithPopup coordinates={coordinates} />
            <SyntaxHighlighter className="code" language="jsx" style={prism}>
              {`import React, { Component } from 'react';
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

  MarkerWithPopup.displayName = 'MarkerWithPopup';`}
            </SyntaxHighlighter>
          </div>
        </div>

        <div className="content">
          <h2>Custom Marker with Popup on Over</h2>
          <div className="example">
            <CustomMarkerOnOver coordinates={coordinates} />
            <SyntaxHighlighter className="code" language="jsx" style={prism}>
              {`import React, { Component } from 'react';
  import MapboxMap, { Marker } from 'react-mapbox-wrapper';

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
      const { coordinates } = this.props;

      if (this.map) {
        const popup = <div>http://localhost</div>;

        marker = (
          <Marker
            coordinates={coordinates}
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
          coordinates={coordinates}
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
          <h2>Circle</h2>
          <div className="example">
            <MapWithCircle coordinates={coordinates} />
            <SyntaxHighlighter className="code" language="jsx" style={prism}>
              {`import React, { Component } from 'react';
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
          coordinates={{lat: 40.7590403, lng: -74.0392709}}
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
          coordinates={{lat: 40.7590403, lng: -74.0392709}}
          className="map-container"
          onLoad={this.onMapLoad}
        >
          {circle}
        </MapboxMap>
      );
    }
  }

  MapWithCircle.displayName = 'MapWithCircle';`}
            </SyntaxHighlighter>
          </div>
        </div>

        <div className="content">
          <h2>Radius, Marker, Popup and fitBounds</h2>
          <div className="example">
            <AllInOne coordinates={coordinates} />
            <SyntaxHighlighter className="code" language="jsx" style={prism}>
              {`import React, { Component } from 'react';
  import MapboxMap, { Marker, Circle, Helpers } from 'react-mapbox-wrapper';

  const SENTIER_COORDINATES = { lat: 48.868526, lng: 2.3434886 };
  const RADIUS_COORDINATES = { lat: 48.870362, lng: 2.3400597 };

  export default class AllInOne extends Component {
    constructor(props) {
      super(props);

      this.onMapLoad = this.onMapLoad.bind(this);
    }

    onMapLoad(map) {
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

  AllInOne.displayName = 'AllInOne';`}
            </SyntaxHighlighter>
          </div>
        </div>

        <footer className="footer">
          Made with{' '}
          <span role="img" aria-label="love">
            ❤️
          </span>{' '}
          by{' '}
          <a href="https://www.meilleursagents.com" target="_blank" rel="noreferrer noopener">
            MeilleursAgents
          </a>
        </footer>
      </div>
    );
  }
}
