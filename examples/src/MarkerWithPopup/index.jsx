import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
                    popupAnchor="bottom"
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

MarkerWithPopup.propTypes = {
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
