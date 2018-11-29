import { Component } from 'react';
import PropTypes from 'prop-types';
import { deepEqual } from 'Utils';
import { coordinatesAreEqual, drawGeoJSON, removeGeoJSON, getCircleData, UNITS } from 'Helpers';

/**
 * Update radius GeoJSON layer.
 * @param {Object} map         MapboxMap
 * @param {String} id          Identifier
 * @param {Object} coordinates Coordinates
 * @param {Number} radius      Radius of circle in meters
 * @param {Object} paint       Paint options
 * @param {Function} onClick   onClick callback
 */
function updateRadiusLayer(map, id, coordinates, radius, unit, paint, onClick) {
    if (!map) {
        return;
    }

    if (!radius) {
        removeGeoJSON(map, id);
    } else {
        drawGeoJSON(map, id, getCircleData(coordinates, radius, unit), paint, onClick);
    }
}

/**
 * Circle Component.
 */
export default class Circle extends Component {
    /**
     * React lifecycle.
     */
    componentWillMount() {
        const { map, id, coordinates, radius, unit, paint, onClick } = this.props;

        updateRadiusLayer(map, id, coordinates, radius, unit, paint, onClick);
    }

    /**
     * React lifecycle.
     * @param {Object} prevProps Previous props
     */
    componentDidUpdate(prevProps) {
        const { id, map, coordinates, radius, unit, paint, onClick } = this.props;
        const { coordinates: prevCoord, radius: prevRadius, paint: prevPaint } = prevProps;

        if (
            !coordinatesAreEqual(coordinates, prevCoord) ||
            radius !== prevRadius ||
            !deepEqual(paint, prevPaint)
        ) {
            updateRadiusLayer(map, id, coordinates, radius, unit, paint, onClick);
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
    unit: PropTypes.oneOf(UNITS),
};

Circle.defaultProps = {
    onClick: undefined,
    paint: {},
    unit: UNITS[0],
};
