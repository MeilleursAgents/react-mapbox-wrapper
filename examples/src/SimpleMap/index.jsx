import React from 'react';
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

SimpleMap.displayName = 'SimpleMap';
