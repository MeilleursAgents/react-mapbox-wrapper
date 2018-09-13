import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import mapboxgl from 'Lib';
import { DEBOUNCE_TIMEOUT } from 'MapboxMap';
import Marker from './';

function defaultProps() {
    return {
        coordinates: {
            lat: 10,
            lng: 10,
        },
        map: {},
    };
}

describe('<Marker />', () => {
    let clock;

    before(() => {
        clock = sinon.useFakeTimers();
    });

    after(() => {
        clock.restore();
    });

    beforeEach(() => {
        /* eslint-disable no-undef */
        mapboxgl.Marker = class MarkerMock {
            setLngLat = sinon.spy();
            addTo = sinon.spy();
            setPopup = sinon.spy();
            togglePopup = sinon.spy();
            remove = sinon.spy();
            on = sinon.spy();
            getLngLat = sinon.spy();
        };

        mapboxgl.Popup = class PopupMock {
            setLngLat = sinon.spy();
            addTo = sinon.spy();
            remove = sinon.spy();
            isOpen = sinon.spy();
            setDOMContent = sinon.spy();
        };
        /* eslint-enable no-undef */
    });

    afterEach(() => {
        delete mapboxgl.Marker;
        delete mapboxgl.Popup;
    });

    it('should set marker coordinates', () => {
        const props = defaultProps();
        const wrapper = mount(<Marker {...props} />);
        expect(wrapper.instance().marker.setLngLat.calledWith({ lat: 10, lng: 10 })).to.equal(
            true,
        );
    });

    it('should add marker to map', () => {
        const props = defaultProps();
        const wrapper = mount(<Marker {...props} />);
        expect(wrapper.instance().marker.addTo.called).to.equal(true);
    });

    it('should remove marker on unmount', () => {
        const props = defaultProps();
        const wrapper = mount(<Marker {...props} />);

        wrapper.instance().componentWillUnmount();
        expect(wrapper.instance().marker.remove.called).to.equal(true);
    });

    it('should do nothing if nothing change', () => {
        const props = defaultProps();
        const wrapper = mount(<Marker {...props} />);
        wrapper.instance().marker.setLngLat.resetHistory();

        wrapper.setProps();

        expect(wrapper.instance().marker.setLngLat.called).to.equal(false);
    });

    it('should update lat coordinates on change', () => {
        const props = defaultProps();
        const wrapper = mount(<Marker {...props} />);

        wrapper.setProps({
            coordinates: {
                ...props.coordinates,
                lat: 0,
            },
        });

        expect(
            wrapper.instance().marker.setLngLat.calledWith({ lng: props.coordinates.lng, lat: 0 }),
        ).to.equal(true);
    });

    it('should update lng coordinates on change', () => {
        const props = defaultProps();
        const wrapper = mount(<Marker {...props} />);

        wrapper.setProps({
            coordinates: {
                ...props.coordinates,
                lng: 0,
            },
        });

        expect(
            wrapper.instance().marker.setLngLat.calledWith({ lat: props.coordinates.lat, lng: 0 }),
        ).to.equal(true);
    });

    it('should add popup if provided', () => {
        const props = defaultProps();
        props.popup = <span>Hello World!</span>;

        const wrapper = mount(<Marker {...props} />);
        expect(wrapper.find('Popup').length).to.equal(1);
    });

    it('should toggle popup on over if asked', () => {
        const props = defaultProps();
        props.popup = <span>Hello World!</span>;

        const wrapper = mount(<Marker {...props} popupOnOver>Content</Marker>);
        wrapper.instance().popup.isOpen = sinon.fake.returns(false);
        wrapper.find('[data-marker]').simulate('mouseOver');

        expect(wrapper.instance().marker.togglePopup.called).to.equal(true);
    });

    it('should call given callback on over', () => {
        const props = defaultProps();
        props.popup = <span>Hello World!</span>;
        const onMouseOver = sinon.spy();

        const wrapper = mount(<Marker {...props} popupOnOver onMouseOver={onMouseOver}>Content</Marker>);
        wrapper.instance().popup.isOpen = sinon.fake.returns(false);
        wrapper.find('[data-marker]').simulate('mouseOver');

        expect(onMouseOver.called).to.equal(true);
    });

    it('should toggle popup on out if asked', () => {
        const props = defaultProps();
        props.popup = <span>Hello World!</span>;

        const wrapper = mount(<Marker {...props} popupOnOver>Content</Marker>);
        wrapper.instance().popup.isOpen = sinon.fake.returns(true);
        wrapper.find('[data-marker]').simulate('mouseOut');

        clock.tick(DEBOUNCE_TIMEOUT);

        expect(wrapper.instance().marker.togglePopup.called).to.equal(true);
    });

    it('should call given callback on out', () => {
        const props = defaultProps();
        props.popup = <span>Hello World!</span>;
        const onMouseOut = sinon.spy();

        const wrapper = mount(<Marker {...props} popupOnOver onMouseOut={onMouseOut}>Content</Marker>);
        wrapper.instance().popup.isOpen = sinon.fake.returns(false);
        wrapper.find('[data-marker]').simulate('mouseOut');

        clock.tick(DEBOUNCE_TIMEOUT);

        expect(onMouseOut.called).to.equal(true);
    });

    it('should call given callback on dragend', () => {
        const props = defaultProps();
        const onDragEnd = sinon.spy();

        const wrapper = mount(<Marker {...props} draggable onDragEnd={onDragEnd} />);
        wrapper.instance().marker.getLngLat = sinon.fake.returns(props.coordinates);
        wrapper.instance().onDragEnd();

        expect(onDragEnd.calledWith(props.coordinates)).to.equal(true);
    });

    it('should remove and add marker for moving to top', () => {
        const props = defaultProps();

        const wrapper = mount(<Marker {...props} />);
        wrapper.instance().moveToTop();

        expect(wrapper.instance().marker.remove.called).to.equal(true);
        expect(wrapper.instance().marker.addTo.called).to.equal(true);
    });
});
