import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import { drawGeoJSON, removeGeoJSON, getLayerId, convertRadiusUnit } from './';

chai.use(sinonChai);

describe('drawGeoJSON', () => {
    it('should do nothing if no map', () => {
        expect(drawGeoJSON()).to.equal(undefined);
    });

    it('should do nothing if no id', () => {
        expect(drawGeoJSON({})).to.equal(undefined);
    });

    it('should do nothing if no data', () => {
        expect(drawGeoJSON({}, 8000)).to.equal(undefined);
    });

    it('should add source and layer if not present', () => {
        const map = {
            getSource: sinon.fake.returns(undefined),
            addSource: sinon.spy(),
            addLayer: sinon.spy(),
        };

        drawGeoJSON(map, 8000, {});
        expect(map.getSource.called).to.equal(true);
        expect(map.addSource.called).to.equal(true);
        expect(map.addLayer.called).to.equal(true);
    });

    it('should add event handler if onClick provided', () => {
        const map = {
            getSource: sinon.fake.returns(undefined),
            addSource: sinon.spy(),
            addLayer: sinon.spy(),
            on: sinon.spy(),
        };

        const onClick = () => null;

        drawGeoJSON(map, 8000, {}, {}, onClick);
        expect(map.on.calledWith('click', getLayerId(8000), onClick)).to.equal(true);
        expect(map.on.callCount).to.equal(3);
    });

    it('should update data and paint if already present', () => {
        const source = {
            setData: sinon.spy(),
        };

        const map = {
            getSource: sinon.fake.returns(source),
            addSource: sinon.spy(),
            addLayer: sinon.spy(),
            setPaintProperty: sinon.spy(),
            on: sinon.spy(),
        };

        drawGeoJSON(map, 8000, {}, { 'fill-color': 'blue' });
        expect(source.setData.called).to.equal(true);
        expect(map.setPaintProperty.called).to.equal(true);
    });
});

describe('removeGeoJSON', () => {
    it('should do nothing if no map', () => {
        expect(removeGeoJSON()).to.equal(undefined);
    });

    it('should do nothing if no id', () => {
        expect(removeGeoJSON({})).to.equal(undefined);
    });

    it('should do nothing if no source and layer', () => {
        const map = {
            getLayer: sinon.spy(),
            removeLayer: sinon.spy(),
            getSource: sinon.spy(),
            removeSource: sinon.spy(),
        };

        removeGeoJSON(map, 8000);
        expect(map.getLayer.called).to.equal(true);
        expect(map.removeLayer.called).to.equal(false);
        expect(map.getSource.called).to.equal(true);
        expect(map.removeSource.called).to.equal(false);
    });

    it('should remove layer and source', () => {
        const map = {
            getLayer: sinon.fake.returns({}),
            removeLayer: sinon.spy(),
            getSource: sinon.fake.returns({}),
            removeSource: sinon.spy(),
        };

        removeGeoJSON(map, 8000);
        expect(map.getLayer.called).to.equal(true);
        expect(map.removeLayer.called).to.equal(true);
        expect(map.getSource.called).to.equal(true);
        expect(map.removeSource.called).to.equal(true);
    });
});

describe('convertRadiusUnit', () => {
    beforeEach(() => {
        sinon.spy(console, 'error');
        sinon.spy(console, 'warn');
    });

    afterEach(() => {
        global.console.error.restore();
        global.console.warn.restore();
    });

    it('should display error "The radius given is not a number" when no radius is given', () => {
        convertRadiusUnit();
        expect(global.console.error.called).to.equal(true);
    });

    it('should display error "The radius given is not a number" when the radius given isNaN', () => {
        convertRadiusUnit('NotANumber');
        expect(global.console.error.called).to.equal(true);
    });

    it('should convert radius 15 with a bad unit to 15 km and display warn', () => {
        expect(convertRadiusUnit(15, 'notValidUnit')).to.deep.equal({
            radius: 15,
            unit: 'kilometers',
        });
        expect(global.console.warn.called).to.equal(true);
    });

    it('should convert radius 15 with no unit to 15 km', () => {
        expect(convertRadiusUnit(15)).to.deep.equal({ radius: 15, unit: 'kilometers' });
    });

    it('should convert radius "15" in string with no unit to 15 km', () => {
        expect(convertRadiusUnit('15')).to.deep.equal({ radius: 15, unit: 'kilometers' });
    });

    it('should convert radius 15 with unit kilometers to 15 km', () => {
        expect(convertRadiusUnit(15, 'kilometers')).to.deep.equal({
            radius: 15,
            unit: 'kilometers',
        });
    });

    it('should convert radius 15 with unit meters to 0.015 km', () => {
        expect(convertRadiusUnit(15, 'meters')).to.deep.equal({
            radius: 0.015,
            unit: 'kilometers',
        });
    });

    it('should convert radius 5280 with unit foot to 1 miles', () => {
        expect(convertRadiusUnit(5280, 'feet')).to.deep.equal({ radius: 1, unit: 'miles' });
    });

    it('should convert radius 15 with unit miles to 15 miles', () => {
        expect(convertRadiusUnit(15, 'miles')).to.deep.equal({ radius: 15, unit: 'miles' });
    });
});
