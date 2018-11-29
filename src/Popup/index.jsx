import { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import mapboxgl from 'Lib';
import { coordinatesAreEqual } from 'Helpers';

/**
 * Popup Component.
 */
export default class Popup extends Component {
    /**
     * Creates an instance of Popup.
     * @param {Object} props Component props
     */
    constructor(props) {
        super(props);

        /**
         * Dom element of the popup container
         * @type {Element}
         * @private
         */
        this.container = null;

        /**
         * Instance of the popup
         * @type {Mapbox.Popup}
         * @private
         */
        this.popup = null;

        const {
            onMouseOver,
            onMouseOut,
            closeButton,
            closeOnClick,
            offset,
            className,
            coordinates,
            map,
        } = this.props;

        this.container = document.createElement('div');
        this.container.addEventListener('mouseover', onMouseOver);
        this.container.addEventListener('mouseout', onMouseOut);

        this.popup = new mapboxgl.Popup({ closeButton, closeOnClick, offset, className });
        this.popup.setDOMContent(this.container);

        if (coordinates) {
            this.popup.setLngLat(coordinates);
        }

        if (map) {
            this.popup.addTo(map);
        }

        this.getMapboxPopup = this.getMapboxPopup.bind(this);
    }

    /**
     * React lifecycle.
     * @param {Object} prevProps Previous props
     */
    componentDidUpdate(prevProps) {
        const { coordinates: prevCoord } = prevProps;
        const { coordinates } = this.props;

        if (!coordinatesAreEqual(prevCoord || {}, coordinates || {})) {
            this.popup.setLngLat(coordinates);
        }
    }

    /**
     * React lifecycle.
     */
    componentWillUnmount() {
        this.popup.remove();
    }

    /**
     * Accessor of underlying Mapbox Popup
     * @return {Element}
     */
    getMapboxPopup() {
        return this.popup;
    }

    /**
     * React lifecycle.
     */
    render() {
        // eslint-disable-next-line react/destructuring-assignment
        return ReactDOM.createPortal(this.props.children, this.container);
    }
}

Popup.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    className: PropTypes.string,
    closeButton: PropTypes.bool,
    closeOnClick: PropTypes.bool,
    coordinates: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
    }),
    map: PropTypes.shape({}),
    offset: PropTypes.number,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
};

Popup.defaultProps = {
    children: null,
    className: '',
    closeButton: true,
    closeOnClick: true,
    coordinates: undefined,
    map: undefined,
    offset: undefined,
    onMouseOut: undefined,
    onMouseOver: undefined,
};
