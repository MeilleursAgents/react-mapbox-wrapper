import React from 'react';
import PropTypes from 'prop-types';
import MapboxMap from 'react-mapbox-wrapper';

/**
 * MapControlPosition Functional Component.
 */
export default function MapWithNavigationControlsPosition({coordinates}) {
    return (
        <MapboxMap
          accessToken={global.ACCESS_TOKEN}
          coordinates={coordinates}
          className="map-container"
          fullscreenControlPosition="top-left"
          navigationControlPosition="top-right"
          withCompass
          withZoom
          withFullscreen
        />
    );
};

MapWithNavigationControlsPosition.displayName = 'MapWithNavigationControlsPosition';
