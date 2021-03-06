import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import mapboxgl from 'Lib';
import MapboxMap from './index';

function defaultProps() {
    return {
        coordinates: {
            lat: 20,
            lng: 20,
        },
        zoom: 15,
    };
}

describe('<MapboxMap />', () => {
    let clock;

    before(() => {
        clock = sinon.useFakeTimers();
    });

    after(() => {
        clock.restore();
    });

    beforeEach(() => {
        /* eslint-disable no-undef */
        mapboxgl.Map = class MapMock {
            on = sinon.spy();

            addControl = sinon.spy();

            addLayer = sinon.spy();

            easeTo = sinon.spy();

            flyTo = sinon.spy();

            getCenter = sinon.fake.returns({ lat: 20, lng: 20 });

            jumpTo = sinon.spy();

            setCenter = sinon.spy();

            getZoom = sinon.fake.returns(15);

            setZoom = sinon.spy();

            setMinZoom = sinon.spy();

            setMaxZoom = sinon.spy();

            setStyle = sinon.spy();

            remove = sinon.spy();
        };

        mapboxgl.LngLat = class LngLatMock {};
        mapboxgl.NavigationControl = class NavigationControlMock {};
        mapboxgl.FullscreenControl = class FullscreenControlMock {};

        mapboxgl.supported = sinon.fake.returns(true);
        /* eslint-enable no-undef */
    });

    afterEach(() => {
        delete mapboxgl.Map;
        delete mapboxgl.LngLat;
        delete mapboxgl.NavigationControl;
        delete mapboxgl.FullscreenControl;
        delete mapboxgl.supported;
    });

    it('should render a message when not compatible', () => {
        const props = defaultProps();
        mapboxgl.supported = sinon.fake.returns(false);

        const wrapper = shallow(<MapboxMap {...props} />);
        expect(wrapper.type()).to.equal('div');
        expect(
            wrapper.findWhere(e => e.text() === 'Your browser does not support Mapbox GL').length >=
                1,
        ).to.equal(true);
    });

    it('should always render as a div', () => {
        const props = defaultProps();
        const wrapper = shallow(<MapboxMap {...props} />);
        expect(wrapper.type()).to.equal('div');
    });

    it('should init map on mount', () => {
        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} />);

        expect(wrapper.instance().map.on.called).to.equal(true);
    });

    it('should register events for propagating underlying behavior', () => {
        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} />);

        expect(wrapper.instance().map.on.callCount).to.equal(1);
    });

    it('should add control if compass is asked', () => {
        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} withCompass />);

        expect(wrapper.instance().map.addControl.called).to.equal(true);
    });

    it('should add control if zoom is asked', () => {
        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} withZoom />);

        expect(wrapper.instance().map.addControl.called).to.equal(true);
    });

    it('should add control with navigation control position if asked', () => {
        const props = defaultProps();
        const wrapper = mount(
            <MapboxMap {...props} withCompass withZoom navigationControlPosition="top-right" />,
        );

        expect(
            wrapper
                .instance()
                .map.addControl.calledWith(
                    new mapboxgl.NavigationControl({ showCompass: true, showZoom: true }),
                    'top-right',
                ),
        ).to.equal(true);
    });

    it('should add control if fullscreen is asked', () => {
        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} withFullscreen />);

        expect(wrapper.instance().map.addControl.called).to.equal(true);
    });

    it('should add control with fullscreen control position if asked', () => {
        const props = defaultProps();
        const wrapper = mount(
            <MapboxMap {...props} withFullscreen fullscreenControlPosition="top-right" />,
        );

        expect(
            wrapper
                .instance()
                .map.addControl.calledWith(new mapboxgl.FullscreenControl(), 'top-right'),
        ).to.equal(true);
    });

    it('should call given onChange', () => {
        const onLoad = sinon.spy();

        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} onLoad={onLoad} />);

        // Simulate moveend call from mapbox
        const callback = wrapper
            .instance()
            .map.on.getCalls()
            .find(call => call.args[0] === 'load');
        callback.args[1]();

        expect(onLoad.called).to.equal(true);
    });

    it('should call given onChange', () => {
        const onChange = sinon.spy();

        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} onChange={onChange} />);

        // Simulate moveend call from mapbox
        const callback = wrapper.instance().map.on.getCalls()
            .find(call => call.args[0] === 'moveend');
        callback.args[1]();

        expect(
            onChange.calledWith(
                {
                    zoom: wrapper.instance().map.getZoom(),
                    coordinates: wrapper.instance().map.getCenter(),
                },
                wrapper.instance().map,
            ),
        ).to.equal(true);
    });

    it('should call given onZoomStart', () => {
        const onZoomStart = sinon.spy();

        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} onZoomStart={onZoomStart} />);

        // Simulate zoomstart call from mapbox
        const callback = wrapper
            .instance()
            .map.on.getCalls()
            .find(call => call.args[0] === 'zoomstart');
        callback.args[1]();

        expect(onZoomStart.called).to.equal(true);
    });

    it('should call given zoomend', () => {
        const onZoomEnd = sinon.spy();

        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} onZoomEnd={onZoomEnd} />);

        // Simulate zoomstart call from mapbox
        const callback = wrapper
            .instance()
            .map.on.getCalls()
            .find(call => call.args[0] === 'zoomend');
        callback.args[1]();

        clock.tick(1000);

        expect(
            onZoomEnd.calledWith(
                undefined,
                wrapper.instance().map,
            ),
        ).to.equal(true);
    });

    it('should call given click', () => {
        const onClick = sinon.spy();

        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} onClick={onClick} />);

        // Simulate zoomstart call from mapbox
        const callback = wrapper
            .instance()
            .map.on.getCalls()
            .find(call => call.args[0] === 'click');
        callback.args[1]();

        expect(onClick.called).to.equal(true);
    });

    it('should not update if no change', () => {
        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} minZoom={5} maxZoom={20} />);

        wrapper.setProps({
            ...props.coordinates,
            minZoom: 5,
            maxZoom: 20,
        });

        expect(wrapper.instance().map.setCenter.called).to.equal(false);
        expect(wrapper.instance().map.setZoom.called).to.equal(false);
        expect(wrapper.instance().map.setMinZoom.called).to.equal(false);
        expect(wrapper.instance().map.setMaxZoom.called).to.equal(false);
        expect(wrapper.instance().map.setStyle.called).to.equal(false);
    });

    it('should update lat on change', () => {
        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} />);

        wrapper.setProps({
            coordinates: {
                ...props.coordinates,
                lat: 0,
            },
        });

        expect(
            wrapper.instance().map.jumpTo.calledWith({ center: [props.coordinates.lng, 0] }),
        ).to.equal(true);
    });

    it('should update lng on change', () => {
        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} />);

        wrapper.setProps({
            coordinates: {
                ...props.coordinates,
                lng: 0,
            },
        });

        expect(
            wrapper.instance().map.jumpTo.calledWith({ center: [0, props.coordinates.lat] }),
        ).to.equal(true);
    });

    it('should jump to new coordinates', () => {
        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} />);

        wrapper.setProps({
            coordinates: {
                ...props.coordinates,
                lng: 0,
            },
            navigationType: { type: 'jumpTo' },
        });

        expect(
            wrapper.instance().map.jumpTo.calledWith({ center: [0, props.coordinates.lat] }),
        ).to.equal(true);
    });

    it('should ease to new coordinates', () => {
        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} />);

        wrapper.setProps({
            coordinates: {
                ...props.coordinates,
                lng: 0,
            },
            navigationType: { type: 'easeTo' },
        });

        expect(
            wrapper.instance().map.easeTo.calledWith({ center: [0, props.coordinates.lat] }),
        ).to.equal(true);
    });

    it('should fly to new coordinates', () => {
        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} />);

        wrapper.setProps({
            coordinates: {
                ...props.coordinates,
                lng: 0,
            },
            navigationType: { type: 'flyTo' },
        });

        expect(
            wrapper.instance().map.flyTo.calledWith({
                center: [0, props.coordinates.lat],
                curve: 1.42,
                speed: 1.2,
            }),
        ).to.equal(true);
    });

    it('should fly to new coordinates with customized curve and speed', () => {
        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} />);

        wrapper.setProps({
            coordinates: {
                ...props.coordinates,
                lng: 0,
            },
            navigationType: { type: 'flyTo', options: { curve: 2, speed: 2 } },
        });

        expect(
            wrapper
                .instance()
                .map.flyTo.calledWith({ center: [0, props.coordinates.lat], curve: 2, speed: 2 }),
        ).to.equal(true);
    });

    it('should update zoom on change', () => {
        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} />);

        wrapper.setProps({
            zoom: 5,
        });

        expect(wrapper.instance().map.setZoom.calledWith(5)).to.equal(true);
    });

    it('should update minZoom on change', () => {
        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} />);

        wrapper.setProps({
            minZoom: 5,
        });

        expect(wrapper.instance().map.setMinZoom.calledWith(5)).to.equal(true);
    });

    it('should update maxZoom on change', () => {
        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} />);

        wrapper.setProps({
            maxZoom: 20,
        });

        expect(wrapper.instance().map.setMaxZoom.calledWith(20)).to.equal(true);
    });

    it('should update style on change', () => {
        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} />);

        wrapper.setProps({
            mapboxStyle: 'test',
        });

        expect(wrapper.instance().map.setStyle.calledWith('test')).to.equal(true);
    });

    it('should remove from DOM on unmount', () => {
        const props = defaultProps();
        const wrapper = mount(<MapboxMap {...props} />);
        const instance = wrapper.instance();
        wrapper.unmount();

        expect(instance.map.remove.called).to.equal(true);
    });
});
