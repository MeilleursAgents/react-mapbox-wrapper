/**
 * Check if two items are deeply equals.
 * @param  {any} o1 First item
 * @param  {any} o2 Second item
 * @return {bool} True is they are deeply equal, false otherwise
 */
export function deepEqual(o1, o2) {
    if (o1 === o2) {
        return true;
    }

    if (typeof o1 !== typeof o2) {
        return false;
    }

    const typeO1 = typeof o1;
    const typeO2 = typeof o2;

    if (typeO1 !== typeO2) {
        return false;
    }

    if ((o1 === null && o2 !== null) || (o1 !== null && o2 === null)) {
        return false;
    }

    if (typeO1 === 'number' && Number.isNaN(o1) && Number.isNaN(o2)) {
        return true;
    }

    if (
        typeO1 === 'undefined' ||
        typeO1 === 'string' ||
        typeO1 === 'number' ||
        typeO1 === 'boolean'
    ) {
        return false;
    }

    if (o1 instanceof Date && o2 instanceof Date) {
        return o1.getTime() === o2.getTime();
    }

    if (Array.isArray(o1)) {
        if (o1.length !== o2.length) {
            return false;
        }

        for (let i = 0, size = o1.length; i < size; i += 1) {
            if (!deepEqual(o1[i], o2[i])) {
                return false;
            }
        }
    }

    const o1Keys = Object.keys(o1).sort();
    const o2Keys = Object.keys(o2).sort();

    if (o1Keys.join(',') !== o2Keys.join(',')) {
        return false;
    }

    for (let i = 0, size = o1Keys.length; i < size; i += 1) {
        const key = o1Keys[i];
        if (!deepEqual(o1[key], o2[key])) {
            return false;
        }
    }

    return true;
}

/**
 * Determine wether or not given parameter is a function.
 * @param  {Any} fn   A possible function
 * @return {Boolean}  True if function, false otherwise
 */
export function isFunction(fn) {
    return fn instanceof Function;
}

/**
 * Checking if we are in a browser or not.
 * @type {Boolean}
 */
export function isBrowser() {
    return !(Object.prototype.toString.call(global.process) === '[object process]');
}

export default {
    deepEqual,
    isFunction,
    isBrowser,
};
