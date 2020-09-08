import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { coordinatesAreEqual, LngLatLike } from 'Helpers';
import { isFunction } from 'Utils';
import mapboxgl from 'Lib';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';

const navigationMethods = ['jumpTo', 'easeTo', 'flyTo'];

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

        const { accessToken } = this.props;
        mapboxgl.accessToken = accessToken;

        /**
         * Store Mapbox map instance
         * @type {mapboxgl.Map}
         * @private
         */
        this.map = null;

        /**
         * Zoom end event debounce timeout.
         * @type {Number}
         * @private
         */
        this.zoomendTimeout = null;

        this.onChange = this.onChange.bind(this);
        this.onZoomEnd = this.onZoomEnd.bind(this);
        this.initMap = this.initMap.bind(this);
        this.addControls = this.addControls.bind(this);
        this.addEvents = this.addEvents.bind(this);
    }

    /**
     * React lifecycle.
     * @param {Object} prevProps Previous props
     */
    componentDidUpdate(prevProps) {
        if (!this.map) {
            return;
        }

        const { coordinates, zoom, minZoom, maxZoom, mapboxStyle, navigationType } = this.props;
        const {
            coordinates: prevCenter,
            zoom: prevZoom,
            minZoom: prevMinZoom,
            maxZoom: prevMaxZoom,
            mapboxStyle: prevMapboxStyle,
        } = prevProps;

        if (!coordinatesAreEqual(coordinates, prevCenter)) {
            const mapNavigationType = navigationType?.type || 'jumpTo';

            if (navigationMethods.indexOf(mapNavigationType) >= 0) {
                // Méthode valide
                const navigationDetails = { center: [coordinates.lng, coordinates.lat] };

                if (mapNavigationType === 'flyTo') {
                    navigationDetails.curve = navigationType?.options?.curve || 1.42;
                    navigationDetails.speed = navigationType?.options?.speed || 1.2;
                }
                this.map[mapNavigationType](navigationDetails);
            }
        }

        if (zoom !== prevZoom) {
            this.map.setZoom(zoom);
        }

        if (minZoom !== prevMinZoom) {
            this.map.setMinZoom(minZoom);
        }

        if (maxZoom !== prevMaxZoom) {
            this.map.setMaxZoom(maxZoom);
        }

        if (mapboxStyle !== prevMapboxStyle) {
            this.map.setStyle(mapboxStyle);
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
    }

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
    }

    /**
     * Initialize map's container from ref.
     * @param  {DOMElement} container Map's container ref
     */
    initMap(container) {
        if (!container) {
            return;
        }

        const { coordinates, onLoad, mapboxStyle, ...mapOptions } = this.props;

        this.map = new mapboxgl.Map({
            container,
            center: new mapboxgl.LngLat(coordinates.lng, coordinates.lat),
            style: mapboxStyle,
            ...mapOptions,
        });

        this.map.on('load', () => {
            if (isFunction(onLoad)) {
                onLoad(this.map);
            }
        });

        this.addControls();
        this.addEvents();
    }

    /**
     * Add controls to map according to component's props.
     */
    addControls() {
        const {
            fullscreenControlPosition,
            navigationControlPosition,
            withZoom,
            withCompass,
            withFullscreen,
        } = this.props;

        if (withZoom || withCompass) {
            this.map.addControl(
                new mapboxgl.NavigationControl({ showCompass: withCompass, showZoom: withZoom }),
                navigationControlPosition,
            );
        }

        if (withFullscreen) {
            this.map.addControl(new mapboxgl.FullscreenControl(), fullscreenControlPosition);
        }
    }

    /**
     * Add events handling to map according to component's props callback.
     */
    addEvents() {
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
    }

    /**
     * React lifecycle.
     */
    render() {
        const { renderNotSupported, className, children } = this.props;

        if (!mapboxgl.supported() && isFunction(renderNotSupported)) {
            return renderNotSupported(className);
        }

        return (
            <div
                className={className || ''}
                ref={this.initMap}
                style={{ height: '100%', width: '100%' }}
            >
                {children}
            </div>
        );
    }
}

MapboxMap.propTypes = {
    accessToken: PropTypes.string,
    coordinates: LngLatLike.isRequired,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    className: PropTypes.string,
    fullscreenControlPosition: PropTypes.string,
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
    navigationControlPosition: PropTypes.string,
    navigationType: PropTypes.shape({
        type: PropTypes.oneOf(navigationMethods),
        options: PropTypes.shape({ speed: PropTypes.number, curve: PropTypes.number }),
    }),
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    onLoad: PropTypes.func,
    onZoomEnd: PropTypes.func,
    onZoomStart: PropTypes.func,
    renderNotSupported: PropTypes.func,
    mapboxStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
    withCompass: PropTypes.bool,
    withFullscreen: PropTypes.bool,
    withZoom: PropTypes.bool,
    zoom: PropTypes.number,
};

MapboxMap.defaultProps = {
    accessToken: '',
    children: null,
    className: '',
    fullscreenControlPosition: 'top-right',
    maxZoom: undefined,
    minZoom: undefined,
    navigationControlPosition: 'bottom-right',
    onChange: undefined,
    onClick: undefined,
    onLoad: undefined,
    onZoomEnd: undefined,
    onZoomStart: undefined,
    mapboxStyle: DEFAULT_STYLE,
    navigationType: { type: 'jumpTo' },
    withCompass: false,
    withFullscreen: false,
    withZoom: false,
    zoom: 15,
    renderNotSupported: className => (
        <div
            className={className || ''}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
