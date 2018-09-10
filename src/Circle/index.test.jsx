import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import Circle from 'Circle';
import { getLayerId } from 'Helpers';

describe('<Circle />', () => {
    function defaultProps() {
        return {
            id: '8000',
            radius: 1000,
            coordinates: {
                lat: 20,
                lng: 20,
            },
            map: {
                getSource: sinon.spy(),
                addSource: sinon.spy(),
                removeSource: sinon.spy(),
                getLayer: sinon.spy(),
                addLayer: sinon.spy(),
                removeLayer: sinon.spy(),
                setPaintProperty: sinon.spy(),
                on: sinon.spy(),
            },
            paint: {
                'fill-color': '#001122',
            },
        };
    }

    it('should add layer if not present', () => {
        const props = defaultProps();
        mount(<Circle {...props} />);

        expect(props.map.addSource.called).to.equal(true);
        expect(props.map.addLayer.called).to.equal(true);
    });

    it('should do nothing if nothing change', () => {
        const props = defaultProps();
        const wrapper = mount(<Circle {...props} />);

        props.map.getSource.resetHistory();
        wrapper.setProps({});

        expect(props.map.getSource.called).to.equal(false);
    });

    it('should update layer on paint change', () => {
        const props = defaultProps();
        const wrapper = mount(<Circle {...props} />);

        const setData = sinon.spy();
        wrapper.setProps({
            ...props,
            paint: {
                'fill-color': '#FFFFFF',
            },
            map: {
                ...props.map,
                getSource: sinon.fake.returns({ setData }),
            },
        });

        expect(props.map.setPaintProperty.called).to.equal(true);
    });

    it('should update layer on radius change', () => {
        const props = defaultProps();
        const wrapper = mount(<Circle {...props} />);

        const setData = sinon.spy();
        wrapper.setProps({
            ...props,
            radius: 8000,
            map: {
                ...props.map,
                getSource: sinon.fake.returns({ setData }),
            },
        });

        expect(props.map.setPaintProperty.called).to.equal(true);
    });

    it('should update layer on lat coordinates change', () => {
        const props = defaultProps();
        const wrapper = mount(<Circle {...props} />);

        const setData = sinon.spy();
        wrapper.setProps({
            ...props,
            coordinates: {
                ...props.coordinates,
                lat: 10,
            },
            map: {
                ...props.map,
                getSource: sinon.fake.returns({ setData }),
            },
        });

        expect(setData.called).to.equal(true);
    });

    it('should update layer on lng coordinates change', () => {
        const props = defaultProps();
        const wrapper = mount(<Circle {...props} />);

        const setData = sinon.spy();
        wrapper.setProps({
            ...props,
            coordinates: {
                ...props.coordinates,
                lng: 10,
            },
            map: {
                ...props.map,
                getSource: sinon.fake.returns({ setData }),
            },
        });

        expect(setData.called).to.equal(true);
    });

    it('should remove source and layer if radius is zero', () => {
        const props = defaultProps();
        props.map.getLayer = sinon.fake.returns({});
        props.map.getSource = sinon.fake.returns({
            setData: () => null,
        });

        const wrapper = mount(<Circle {...props} />);
        wrapper.setProps({ radius: 0 });

        expect(props.map.removeLayer.called).to.equal(true);
        expect(props.map.removeSource.called).to.equal(true);
    });

    it('should remove source and layer on unmount', () => {
        const props = defaultProps();
        props.map.getSource = sinon.fake.returns({
            setData: () => null,
        });
        props.map.getLayer = sinon.fake.returns(true);

        const wrapper = mount(<Circle {...props} />);

        wrapper.unmount();

        expect(props.map.removeLayer.called).to.equal(true);
        expect(props.map.removeSource.called).to.equal(true);
    });

    it('should call given onClick', () => {
        const onClick = sinon.spy();
        const props = defaultProps();
        mount(<Circle {...props} onClick={onClick} />);

        expect(props.map.on.calledWith('click', getLayerId(props.id), onClick)).to.equal(true);
    });
});
