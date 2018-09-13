import { isBrowser } from 'Utils';

/**
 * Mapbox-gl API.
 * @type {Object}
 */
// eslint-disable-next-line global-require
export default isBrowser ? require('mapbox-gl') : {};
