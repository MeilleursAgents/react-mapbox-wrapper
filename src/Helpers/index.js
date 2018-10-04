import circle from '@turf/circle';
import { isFunction } from 'Utils';
import mapboxgl from 'Lib';

/**
 * Number of points to draw a circle.
 * @type {Number}
 */
const CIRCLE_POINTS_CONFIG = 64;

/**
 * Array of possible units
 * @type {Array}
 */
export const UNITS = ['kilometers', 'meters', 'miles', 'feet'];

/**
 * Convert the radius into the unit given
 * @param {Number} radius unit
 * @param {String} unit to convert to if necessary
 */
export function convertRadiusUnit(radius, unit = 'kilometers') {
    let convertedRadius = Number(radius);
    let convertedUnit = unit;

    if (isNaN(radius)) {
        global.console.error('The radius given is not a number');
    }

    if (UNITS.indexOf(unit) === -1) {
        convertedUnit = 'kilometers';
        global.console.warn(`The unit is not supported, the fallback "${convertedUnit}" is used`);
    }

    if (unit === 'meters') {
        convertedRadius = radius / 1000;
        convertedUnit = 'kilometers';
    } else if (unit === 'feet') {
        convertedRadius = radius / 5280;
        convertedUnit = 'miles';
    }

    return { radius: convertedRadius, unit: convertedUnit };
}

/**
 * Get circle points.
 * @param  {Object} coordinates Center coordinates
 * @param  {Number} radius      Radius
 * @param  {String} unit        Unit of the radius
 * @return {Object}             GeoJSON data
 */
export function getCircleData(coordinates, radius, unit) {
    const convertedRadiusUnit = convertRadiusUnit(radius, unit);
    return circle([coordinates.lng, coordinates.lat], convertedRadiusUnit.radius, {
        steps: CIRCLE_POINTS_CONFIG,
        units: convertedRadiusUnit.unit,
    });
}

/**
 * Get layer identifier from source identifier.
 * @param  {String} id Source's identifier
 * @return {String} Layer's identifier
 */
export function getLayerId(id) {
    return `${id}_layer`;
}

/**
 * Check if coordinates are equal.
 * @param  {Object} a First coordinates
 * @param  {Object} b Second coordinates
 * @return {Boolean}  True if they are equal, false otherwise
 */
export function coordinatesAreEqual(a, b) {
    return a.lat === b.lat && a.lng === b.lng;
}

/**
 * Return new empty bounds according to underlying map library.
 * @param  {Object} sw South West Bound.
 * @param  {Object} ne North East Bound.
 * @return {Object} Bounds
 */
export function newBounds(sw, ne) {
    return new mapboxgl.LngLatBounds(sw, ne);
}

/**
 * Create new bound according to the underlying library.
 * @param  {Object} coordinates Coordinates of bound.
 * @return {BoundObject} Bound object matching the underlying map library
 */
export function newBound(coordinates) {
    return [coordinates.lng, coordinates.lat];
}

/**
 * Draw GeoJSON on map.
 * @param {Object}   map     MapBox map
 * @param {String}   id      Identifier of layer
 * @param {Object}   data    Layer data
 * @param {Object}   paint   Paint option of polygon
 * @param {Function} onClick Add on click to the layer
 */
export function drawGeoJSON(map, id, data, paint = {}, onClick) {
    if (!id || !map || !data) {
        return;
    }

    const layerId = getLayerId(id);
    const source = map.getSource(id);

    if (source) {
        source.setData(data);
        Object.keys(paint).forEach(property =>
            map.setPaintProperty(layerId, property, paint[property]),
        );
    } else {
        map.addSource(id, {
            type: 'geojson',
            data,
        });

        map.addLayer({
            id: layerId,
            type: 'fill',
            source: id,
            layout: {},
            paint,
        });

        if (isFunction(onClick)) {
            map.on('click', layerId, onClick);

            /* eslint-disable no-param-reassign */
            map.on('mouseenter', layerId, () => {
                map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', layerId, () => {
                map.getCanvas().style.cursor = '';
            });
            /* eslint-enable no-param-reassign */
        }
    }
}

/**
 * Remove GeoJSON from map.
 * @param {Object} map MapBox map
 * @param {String} id  Identifier of layer
 */
export function removeGeoJSON(map, id) {
    if (!id || !map) {
        return;
    }

    const layerId = getLayerId(id);
    try {
        const layer = map.getLayer(layerId);
        if (layer) {
            map.removeLayer(layerId);
        }
    } catch (e) {
        global.console.warn(
            `Error while removing GeoJSON layer with id ${layerId}. It's sometimes due to an already removed map`,
            e,
        );
    }

    try {
        const source = map.getSource(id);
        if (source) {
            map.removeSource(id);
        }
    } catch (e) {
        global.console.warn(
            `Error while removing GeoJSON soruce with id ${id}. It's sometimes due to an already removed map`,
            e,
        );
    }
}

export default {
    convertRadiusUnit,
    coordinatesAreEqual,
    drawGeoJSON,
    getCircleData,
    getLayerId,
    newBound,
    newBounds,
    removeGeoJSON,
};
