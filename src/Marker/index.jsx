import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'Utils';
import Popup from 'Popup';
import mapboxgl from 'Lib';
import { DEBOUNCE_TIMEOUT } from 'MapboxMap';

/**
 * Marker rendered on map.
 */
export default class Marker extends Component {
    /**
     * Creates an instance of Marker.
     * @param {Object} props Component props
     */
    constructor(props) {
        super(props);

        /**
         * Timer for mouseover/out debouncing
         * @type {Number}
         * @private
         */
        this.overTimeout = 0;

        /**
         * Instance of the marker
         * @type {Mapbox.Marker}
         * @private
         */
        this.marker = null;

        /**
         * Instance of the popup
         * @type {Mapbox.Popup}
         * @private
         */
        this.popup = null;

        this.onMarkerOver = this.onMarkerOver.bind(this);
        this.onMarkerOut = this.onMarkerOut.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.initMarker = this.initMarker.bind(this);
        this.initPopup = this.initPopup.bind(this);
        this.clearDebounce = this.clearDebounce.bind(this);
        this.moveToTop = this.moveToTop.bind(this);

        /**
         * Props for rendered marker (custom or default)
         * @type {Object}
         */
        this.markerProps = {
            ref: this.initMarker,
            'data-marker': '',
        };
    }

    /**
     * React lifecycle.
     * @param {Object} prevProps Previous props
     */
    componentDidUpdate(prevProps) {
        if (!this.marker) {
            return;
        }

        const { coordinates: prevCoord } = prevProps;
        const { coordinates } = this.props;

        if (coordinates.lat !== prevCoord.lat || coordinates.lng !== prevCoord.lng) {
            this.marker.setLngLat(coordinates);
        }
    }

    /**
     * React lifecycle.
     */
    componentWillUnmount() {
        if (!this.marker) {
            return;
        }

        this.clearDebounce();
        this.marker.remove();
    }

    /**
     * Mouse over on a marker : display popup
     * @param {Event} e
     */
    onMarkerOver(e) {
        this.clearDebounce();

        const { popupOnOver, onMouseOver } = this.props;

        if (popupOnOver && this.popup && !this.popup.isOpen()) {
            this.marker.togglePopup();
        }

        if (isFunction(onMouseOver)) {
            onMouseOver(e);
        }
    }

    /**
     * Mouse over on a marker : hide popup
     * @param {Event} e
     * @use setTimeout for debouncing
     */
    onMarkerOut(e) {
        this.clearDebounce();

        this.overTimeout = setTimeout(() => {
            const { popupOnOver, onMouseOut } = this.props;

            if (popupOnOver && this.popup && this.popup.isOpen()) {
                this.marker.togglePopup();
            }

            if (isFunction(onMouseOut)) {
                onMouseOut(e);
            }
        }, DEBOUNCE_TIMEOUT);
    }

    /**
     * Call dragend if function is passed from props
     */
    onDragEnd() {
        const { onDragEnd } = this.props;

        if (isFunction(onDragEnd)) {
            onDragEnd(this.marker.getLngLat());
        }
    }

    /**
     * Attach to the dom
     * @param {Element} element Dom element of the marker
     */
    initMarker(element) {
        if (!element) {
            return;
        }

        const { coordinates, map, draggable, onDragEnd, getRef, children, ...rest } = this.props;

        this.marker = new mapboxgl.Marker({
            element: children ? element : null,
            draggable,
            ...rest,
        });

        this.marker.setLngLat(coordinates);
        this.marker.addTo(map);

        if (this.popup) {
            this.marker.setPopup(this.popup);
        }

        if (draggable && isFunction(onDragEnd)) {
            this.marker.on('dragend', this.onDragEnd);
        }

        if (isFunction(getRef)) {
            getRef(this);
        }
    }

    /**
     * Display a Popup from a marker
     * @param {Object} ref React ref element of the marker
     */
    initPopup(ref) {
        if (!ref) {
            return;
        }

        this.popup = ref.getMapboxPopup();

        if (this.marker) {
            this.marker.setPopup(this.popup);
        }
    }

    /**
     * Clear mouseover timeout
     */
    clearDebounce() {
        clearTimeout(this.overTimeout);
    }

    /**
     * Place marker at the top of layers
     */
    moveToTop() {
        if (this.marker) {
            this.marker.remove();
            // eslint-disable-next-line react/destructuring-assignment
            this.marker.addTo(this.props.map);
        }
    }

    /**
     * React lifecycle.
     */
    render() {
        const { children, popup, popupOffset, popupCloseButton } = this.props;

        let marker;
        let wrapperProps;
        if (children) {
            marker = (
                <div
                    key="marker"
                    onMouseOver={this.onMarkerOver}
                    onFocus={this.onMarkerOver}
                    onMouseOut={this.onMarkerOut}
                    onBlur={this.onMarkerOut}
                    {...this.markerProps}
                >
                    {children}
                </div>
            );
        } else {
            wrapperProps = this.markerProps;
        }

        return (
            <span {...wrapperProps}>
                {marker}
                {popup && (
                    <Popup
                        key="popup"
                        ref={this.initPopup}
                        onMouseOver={this.clearDebounce}
                        onFocus={this.clearDebounce}
                        onMouseOut={this.onMarkerOut}
                        onBlur={this.onMarkerOut}
                        closeButton={popupCloseButton}
                        offset={popupOffset}
                    >
                        {popup}
                    </Popup>
                )}
            </span>
        );
    }
}

Marker.propTypes = {
    coordinates: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
    }).isRequired,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    draggable: PropTypes.bool,
    getRef: PropTypes.func,
    map: PropTypes.shape({}).isRequired,
    onDragEnd: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    popup: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    popupCloseButton: PropTypes.bool,
    popupOffset: PropTypes.number,
    popupOnOver: PropTypes.bool,
};

Marker.defaultProps = {
    children: null,
    draggable: false,
    getRef: undefined,
    onDragEnd: undefined,
    onMouseOut: undefined,
    onMouseOver: undefined,
    popup: undefined,
    popupCloseButton: false,
    popupOffset: undefined,
    popupOnOver: false,
};
