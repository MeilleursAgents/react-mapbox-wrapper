import { deepEqual } from '.';

describe('deepEqual', () => {
    it('should work with native variable', () => {
        expect(deepEqual(1, 1), '1, 1').to.equal(true);
        expect(deepEqual(false, false), 'false, false').to.equal(true);
        expect(deepEqual('test', 'test'), "test', 'test'").to.equal(true);
        expect(deepEqual(null, null), 'null, null').to.equal(true);

        expect(deepEqual(1, 2), '1, 2').to.equal(false);
        expect(deepEqual(false, true), 'false, true').to.equal(false);
        expect(deepEqual('test', 'tset'), "'test', 'tset'").to.equal(false);
        expect(deepEqual(null, undefined), 'null, undefined').to.equal(false);
        expect(deepEqual(NaN, -Infinity), 'NaN, -Infinity').to.equal(false);
    });

    it('should work when args have different types', () => {
        expect(deepEqual(1, '1')).to.equal(false);
    });

    it('should work with NaN', () => {
        expect(deepEqual(NaN, NaN)).to.equal(true);
    });

    it('should work with Date', () => {
        expect(deepEqual(new Date(), new Date(15000000))).to.equal(false);
        expect(deepEqual(new Date(15000000), new Date(15000000))).to.equal(true);
    });

    it('should work with Array according to order', () => {
        expect(deepEqual(['a', 'b'], ['a', 'b'])).to.equal(true);
        expect(deepEqual(['a', 'b'], ['b', 'a'])).to.equal(false);
        expect(deepEqual(['a', 'b'], ['a', 'b', 'c'])).to.equal(false);
    });

    it('should work with Object according to order', () => {
        expect(
            deepEqual(
                { key: 'value', tab: ['a', 'b'], bool: false },
                { tab: ['a', 'b'], key: 'value', bool: false },
            ),
        ).to.equal(true);
        expect(
            deepEqual(
                { key: 'value', tab: ['a', 'b'], bool: false },
                { tab: ['a', 'c'], key: 'value', bool: false },
            ),
        ).to.equal(false);
        expect(
            deepEqual(
                { key: 'value', tab: ['a', 'b'], bool: false, no: undefined },
                { key: 'value', tab: ['a', 'b'], bool: false },
            ),
        ).to.equal(false);
    });
});
