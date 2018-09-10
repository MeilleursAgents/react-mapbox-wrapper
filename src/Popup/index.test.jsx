import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { mapboxgl } from 'MapboxMap';
import Popup from './';

function defaultProps() {
    return {};
}

describe('<Popup />', () => {
    beforeEach(() => {
        /* eslint-disable no-undef */
        mapboxgl.Popup = class PopupMock {
            setLngLat = sinon.spy();
            addTo = sinon.spy();
            remove = sinon.spy();
            setDOMContent = sinon.spy();
        };
        /* eslint-enable no-undef */
    });

    afterEach(() => {
        delete mapboxgl.Popup;
    });

    it('should set popup coordinates if provided', () => {
        const props = defaultProps();
        props.coordinates = { lat: 10, lng: 10 };
        const wrapper = mount(<Popup {...props} />);

        expect(wrapper.instance().popup.setLngLat.calledWith({ lat: 10, lng: 10 })).to.equal(true);
    });

    it('should add popup to map if provided', () => {
        const props = defaultProps();
        props.map = {};
        const wrapper = mount(<Popup {...props} />);

        expect(wrapper.instance().popup.addTo.called).to.equal(true);
    });

    it('should remove popup on unmount', () => {
        const props = defaultProps();
        const wrapper = mount(<Popup {...props} />);
        wrapper.instance().componentWillUnmount();

        expect(wrapper.instance().popup.remove.called).to.equal(true);
    });

    it('should do nothing if nothing change', () => {
        const props = defaultProps();
        const wrapper = mount(<Popup {...props} />);

        wrapper.instance().popup.setLngLat.resetHistory();

        wrapper.setProps();

        expect(wrapper.instance().popup.setLngLat.called).to.equal(false);
    });

    it('should update lat coordinates on change', () => {
        const props = defaultProps();
        props.coordinates = { lat: 10, lng: 10 };
        const wrapper = mount(<Popup {...props} />);

        wrapper.setProps({
            coordinates: {
                ...props.coordinates,
                lat: 0,
            },
        });

        expect(
            wrapper.instance().popup.setLngLat.calledWith({ lng: props.coordinates.lng, lat: 0 }),
        ).to.equal(true);
    });

    it('should update lng coordinates on change', () => {
        const props = defaultProps();
        props.coordinates = { lat: 10, lng: 10 };
        const wrapper = mount(<Popup {...props} />);

        wrapper.setProps({
            coordinates: {
                ...props.coordinates,
                lng: 0,
            },
        });

        expect(
            wrapper.instance().popup.setLngLat.calledWith({ lat: props.coordinates.lat, lng: 0 }),
        ).to.equal(true);
    });
});
