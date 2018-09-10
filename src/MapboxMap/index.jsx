import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isBrowser, isFunction } from 'Utils';

/**
 * Mapbox-gl API.
 * @type {Object}
 */
// eslint-disable-next-line global-require
export const mapboxgl = isBrowser ? require('mapbox-gl') : {};

/**
 * Debounce timeout on zoom change.
 * @type {Number}
 */
export const DEBOUNCE_TIMEOUT = 300;

/**
 * Default style for map.
 * @type {String}
 */
export const DEFAULT_STYLE = 'mapbox://styles/mapbox/streets-v10';

/**
 * MapboxMap Component.
 * cf. https://www.mapbox.com/mapbox-gl-js/api/
 */
export default class MapboxMap extends Component {
    /**
     * Creates an instance of MapboxMap.
     * @param {Object} props Component props
     */
    constructor(props) {
        super(props);

        mapboxgl.accessToken = this.props.accessToken;

        /**
         * Store Mapbox map instance
         * @type {mapboxgl.Map}
         */
        this.map = null;

        this.onChange = this.onChange.bind(this);
        this.onZoomEnd = this.onZoomEnd.bind(this);
        this.setContainer = this.setContainer.bind(this);
    }

    /**
     * React lifecycle.
     * @param {Object} nextProps Next props
     */
    componentWillReceiveProps({ coordinates, zoom, minZoom, maxZoom, style }) {
        if (!this.map) {
            return;
        }

        const currentCenter = this.props.coordinates;
        if (currentCenter.lat !== coordinates.lat || currentCenter.lng !== coordinates.lng) {
            this.map.setCenter([coordinates.lng, coordinates.lat]);
        }

        if (this.props.zoom !== zoom) {
            this.map.setZoom(zoom);
        }

        if (this.props.minZoom !== minZoom) {
            this.map.setMinZoom(minZoom);
        }

        if (this.props.maxZoom !== maxZoom) {
            this.map.setMaxZoom(maxZoom);
        }

        if (this.props.style !== style) {
            this.map.setStyle(style);
        }
    }

    /**
     * React lifecycle.
     */
    componentWillUnmount() {
        if (this.map) {
            this.map.remove();
        }
    }

    /**
     * Call callback when changing data on map.
     * @param  {Object} viewport New viewport
     */
    onChange() {
        const { onChange } = this.props;
        if (isFunction(onChange)) {
            const { lng, lat } = this.map.getCenter();
            onChange({
                zoom: this.map.getZoom(),
                coordinates: { lng, lat },
            });
        }
    };

    /**
     * Call callback on zoom end after a small debounce.
     */
    onZoomEnd(e) {
        clearTimeout(this.zoomendTimeout);

        /**
         * Zoomend debounce timeout.
         * @type  {Object}
         */
        this.zoomendTimeout = setTimeout(() => {
            this.onChange();

            const { onZoomEnd } = this.props;
            if (isFunction(onZoomEnd)) {
                onZoomEnd(e);
            }
        }, DEBOUNCE_TIMEOUT);
    };

    /**
     * Initialize map's container from ref.
     * @param  {DOMElement} container Map's container ref
     */
    setContainer(container) {
        if (!container) {
            return;
        }

        const {
            coordinates,
            zoom,
            minZoom,
            maxZoom,
            style,
            interactive,
            attributionControl,
            onLoad,
            withNavigation,
            withCompass,
            withFullscreen,
        } = this.props;

        /**
         * Underlying map.
         * @type {mapboxgl}
         */
        this.map = new mapboxgl.Map({
            container,
            minZoom,
            maxZoom,
            style,
            center: new mapboxgl.LngLat(coordinates.lng, coordinates.lat),
            zoom,
            attributionControl,
            interactive,
        });

        if (withNavigation) {
            this.map.addControl(
                new mapboxgl.NavigationControl({ showCompass: withCompass }),
                'bottom-right',
            );
        }

        if (withFullscreen) {
            this.map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
        }

        this.map.on('load', () => {
            if (isFunction(onLoad)) {
                onLoad(this.map);
            }
        });

        const { onChange, onZoomStart, onZoomEnd, onClick } = this.props;

        if (isFunction(onChange)) {
            this.map.on('moveend', this.onChange);
        }

        if (isFunction(onZoomStart)) {
            this.map.on('zoomstart', onZoomStart);
        }
        if (isFunction(onChange) || isFunction(onZoomEnd)) {
            this.map.on('zoomend', this.onZoomEnd);
        }

        if (isFunction(onClick)) {
            this.map.on('click', onClick);
        }
    };

    /**
     * React lifecycle.
     */
    render() {
        if (!mapboxgl.supported() && isFunction(this.props.renderNotSupported)) {
            return this.props.renderNotSupported();
        }

        return (
            <div className={this.props.className || ''}>
                <div ref={this.setContainer} style={{ width: '100%', height: '100%' }} />
                {this.props.children}
            </div>
        );
    }
}

MapboxMap.propTypes = {
    accessToken: PropTypes.string,
    attributionControl: PropTypes.bool,
    coordinates: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
    }).isRequired,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    className: PropTypes.string,
    interactive: PropTypes.bool,
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    onLoad: PropTypes.func,
    onZoomEnd: PropTypes.func,
    onZoomStart: PropTypes.func,
    renderNotSupported: PropTypes.func,
    style: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
    withCompass: PropTypes.bool,
    withFullscreen: PropTypes.bool,
    withNavigation: PropTypes.bool,
    zoom: PropTypes.number.isRequired,
};

MapboxMap.defaultProps = {
    accessToken: '',
    attributionControl: true,
    children: null,
    className: '',
    interactive: true,
    maxZoom: undefined,
    minZoom: undefined,
    onChange: undefined,
    onClick: undefined,
    onLoad: undefined,
    onZoomEnd: undefined,
    onZoomStart: undefined,
    style: DEFAULT_STYLE,
    withCompass: false,
    withFullscreen: false,
    withNavigation: false,
    renderNotSupported: () => (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                background:
                    'repeating-linear-gradient(45deg, aliceblue, aliceblue 10px, white 10px, white 20px)',
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    padding: 10,
                    borderRadius: 4,
                    fontWeight: 'bold',
                    fontSize: 24,
                }}
            >
                Your browser does not support Mapbox GL
            </div>
        </div>
    ),
};
