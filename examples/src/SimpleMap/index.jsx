import React from 'react';
import MapboxMap from 'react-mapbox-wrapper';

export default function SimpleMap() {
  return (
    <div style={{ height: 400, width: 400 }}>
      <MapboxMap
        accessToken={global.ACCESS_TOKEN}
        coordinates={global.DEFAULT_COORDINATES}
      />
    </div>
  );
}

SimpleMap.displayName = 'SimpleMap';
