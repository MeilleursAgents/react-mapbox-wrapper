import React from 'react';
import PropTypes from 'prop-types';
import MapboxMap from 'react-mapbox-wrapper';

/**
 * SimpleMap Functional Component.
 */
export default function SimpleMap({ coordinates }) {
    return (
        <div style={{ height: 400, width: 400 }}>
            <MapboxMap accessToken={global.ACCESS_TOKEN} coordinates={coordinates} />
        </div>
    );
}

SimpleMap.displayName = 'SimpleMap';

SimpleMap.propTypes = {
    coordinates: PropTypes.oneOfType([
        PropTypes.shape({
            lat: PropTypes.number.isRequired,
            lng: PropTypes.number.isRequired,
        }),
        PropTypes.shape({
            lat: PropTypes.number.isRequired,
            lon: PropTypes.number.isRequired,
        }),
        PropTypes.arrayOf(PropTypes.number.isRequired),
    ]).isRequired,
};
