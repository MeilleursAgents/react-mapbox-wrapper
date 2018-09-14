import { Component } from 'react';
import PropTypes from 'prop-types';
import { deepEqual } from 'Utils';
import { coordinatesAreEqual, drawGeoJSON, removeGeoJSON, getCircleData } from 'Helpers';

/**
 * Update radius GeoJSON layer.
 * @param {Object} map         MapboxMap
 * @param {String} id          Identifier
 * @param {Object} coordinates Coordinates
 * @param {Number} radius      Radius of circle in meters
 * @param {Object} paint       Paint options
 * @param {Function} onClick   onClick callback
 */
function updateRadiusLayer(map, id, coordinates, radius, paint, onClick) {
    if (!map) {
        return;
    }

    if (!radius) {
        removeGeoJSON(map, id);
    } else {
        drawGeoJSON(map, id, getCircleData(coordinates, radius), paint, onClick);
    }
};

/**
 * Circle Component.
 */
export default class Circle extends Component {
    /**
     * React lifecycle.
     */
    componentWillMount() {
        const { map, id, coordinates, radius, paint, onClick } = this.props;

        updateRadiusLayer(map, id, coordinates, radius, paint, onClick);
    }

    /**
     * React lifecycle.
     * @param {Object} nextProps Next props
     */
    componentWillReceiveProps({ id, map, coordinates, radius, paint, onClick }) {
        const currentCoord = this.props.coordinates;

        if (!coordinatesAreEqual(currentCoord, coordinates) ||
            this.props.radius !== radius ||
            !deepEqual(this.props.paint, paint)
        ) {
            updateRadiusLayer(map, id, coordinates, radius, paint, onClick);
        }
    }

    /**
     * React lifecycle.
     */
    componentWillUnmount() {
        const { id, map } = this.props;

        removeGeoJSON(map, id);
    }

    /**
     * React lifecycle.
     */
    render() {
        return null;
    }
}

Circle.propTypes = {
    coordinates: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
    }).isRequired,
    id: PropTypes.string.isRequired,
    map: PropTypes.shape({}).isRequired,
    onClick: PropTypes.func,
    paint: PropTypes.shape({}),
    radius: PropTypes.number.isRequired,
};

Circle.defaultProps = {
    onClick: undefined,
    paint: {},
};

