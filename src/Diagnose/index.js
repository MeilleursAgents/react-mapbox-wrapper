import mapboxgl from 'Lib';
import { isBrowser } from 'Utils';

// inspired by https://github.com/mapbox/mapbox-gl-supported/blob/gh-pages/diagnostics.html

function isArraySupported() {
    return (
        Array.prototype &&
        Array.prototype.every &&
        Array.prototype.filter &&
        Array.prototype.forEach &&
        Array.prototype.indexOf &&
        Array.prototype.lastIndexOf &&
        Array.prototype.map &&
        Array.prototype.some &&
        Array.prototype.reduce &&
        Array.prototype.reduceRight &&
        Array.isArray
    );
}

function isFunctionSupported() {
    return Function.prototype && Function.prototype.bind;
}

function isObjectSupported() {
    return (
        Object.keys &&
        Object.create &&
        Object.getPrototypeOf &&
        Object.getOwnPropertyNames &&
        Object.isSealed &&
        Object.isFrozen &&
        Object.isExtensible &&
        Object.getOwnPropertyDescriptor &&
        Object.defineProperty &&
        Object.defineProperties &&
        Object.seal &&
        Object.freeze &&
        Object.preventExtensions
    );
}

function isJSONSupported() {
    return 'JSON' in window && 'parse' in JSON && 'stringify' in JSON;
}

function isWorkerSupported() {
    if (!('Worker' in window && 'Blob' in window && 'URL' in window)) {
        return false;
    }

    const blob = new Blob([''], { type: 'text/javascript' });
    const workerURL = URL.createObjectURL(blob);
    let supported;
    let worker;

    try {
        worker = new Worker(workerURL);
        supported = true;
    } catch (e) {
        supported = false;
    }

    if (worker) {
        worker.terminate();
    }
    URL.revokeObjectURL(workerURL);

    return supported;
}

// IE11 only supports `Uint8ClampedArray` as of version
// [KB2929437](https://support.microsoft.com/en-us/kb/2929437)
function isUint8ClampedArraySupported() {
    return 'Uint8ClampedArray' in window;
}

// https://github.com/mapbox/mapbox-gl-supported/issues/19
function isArrayBufferSupported() {
    return ArrayBuffer.isView;
}

const webGLContextAttributes = {
    antialias: false,
    alpha: true,
    stencil: true,
    depth: true,
};

function isWebGLSupported(failIfMajorPerformanceCaveat) {
    const canvas = document.createElement('canvas');
    const attributes = Object.create(webGLContextAttributes);
    attributes.failIfMajorPerformanceCaveat = failIfMajorPerformanceCaveat;

    if (canvas.probablySupportsContext) {
        return (
            canvas.probablySupportsContext('webgl', attributes) ||
            canvas.probablySupportsContext('experimental-webgl', attributes)
        );
    }

    if (canvas.supportsContext) {
        return (
            canvas.supportsContext('webgl', attributes) ||
            canvas.supportsContext('experimental-webgl', attributes)
        );
    }

    return (
        canvas.getContext('webgl', attributes) ||
        canvas.getContext('experimental-webgl', attributes)
    );
}

const isWebGLSupportedCache = {};
function isWebGLSupportedCached(failIfMajorPerformanceCaveat) {
    if (isWebGLSupportedCache[failIfMajorPerformanceCaveat] === undefined) {
        isWebGLSupportedCache[failIfMajorPerformanceCaveat] = isWebGLSupported(
            failIfMajorPerformanceCaveat,
        );
    }

    return isWebGLSupportedCache[failIfMajorPerformanceCaveat];
}

/**
 * Create a map in a Promise to handle error properly.
 * @return {Promise} A promise that indicates success or fail of creation.
 */
export function createMap() {
    return new Promise(resolve => {
        const body = document.querySelector('body');
        const container = document.createElement('div');

        try {
            container.id = 'diagnose_map';
            body.appendChild(container);

            const map = new mapboxgl.Map({
                container: 'diagnose_map',
                style: 'mapbox://styles/mapbox/streets-v9',
                zoom: 1,
            });
            map.on('error', event => resolve(event.error.toString()));
            map.on('load', () => resolve('ok'));
        } catch (e) {
            resolve(e.stack || e.tostring);
        } finally {
            body.removeChild(container);
        }
    });
}

/**
 * Perform mapbox test
 * @param  {String}  detectionMethod              Detection method
 * @param  {String}  contextType                  Context type
 * @param  {Boolean} failIfMajorPerformanceCaveat Fail on performance
 * @return {Object}                               Result output
 */
function performanceTest(detectionMethod, contextType, failIfMajorPerformanceCaveat) {
    const attributes = Object.create(mapboxgl.supported.webGLContextAttributes);
    attributes.failIfMajorPerformanceCaveat = failIfMajorPerformanceCaveat;
    const canvas = document.createElement('canvas');

    if (canvas[detectionMethod]) {
        const result = canvas[detectionMethod](contextType, attributes);
        return {
            result,
            error: result && result.getError && result.getError(),
        };
    }

    return {
        result: false,
        error: 'detection method unavailable',
    };
}

export function performanceTests() {
    return {
        probablySupportsContext_webgl_true: performanceTest(
            'probablySupportsContext',
            'webgl',
            true,
        ),
        probablySupportsContext_webgl_false: performanceTest(
            'probablySupportsContext',
            'webgl',
            false,
        ),
        probablySupportsContext_experimental_true: performanceTest(
            'probablySupportsContext',
            'experimental-webgl',
            true,
        ),
        probablySupportsContext_experimental_false: performanceTest(
            'probablySupportsContext',
            'experimental-webgl',
            false,
        ),
        supportsContext_webgl_true: performanceTest('supportsContext', 'webgl', true),
        supportsContext_webgl_false: performanceTest('supportsContext', 'webgl', false),
        supportsContext_experimental_true: performanceTest(
            'supportsContext',
            'experimental-webgl',
            true,
        ),
        supportsContext_experimental_false: performanceTest(
            'supportsContext',
            'experimental-webgl',
            false,
        ),
        getContext_webgl_true: performanceTest('getContext', 'webgl', true),
        getContext_webgl_false: performanceTest('getContext', 'webgl', false),
        getContext_experimental_true: performanceTest('getContext', 'experimental-webgl', true),
        getContext_experimental_false: performanceTest('getContext', 'experimental-webgl', false),
    };
}

function isSupported(options) {
    return {
        isBrowser: isBrowser(),
        isArraySupported: isArraySupported(),
        isFunctionSupported: isFunctionSupported(),
        isObjectSupported: isObjectSupported(),
        isJSONSupported: isJSONSupported(),
        isWorkerSupported: isWorkerSupported(),
        isUint8ClampedArraySupported: isUint8ClampedArraySupported(),
        isArrayBufferSupported: isArrayBufferSupported(),
        isWebGLSupportedCached: isWebGLSupportedCached(
            options && options.failIfMajorPerformanceCaveat,
        ),
    };
}

function fullDiagnostic() {
    return createMap().then(result => ({
        supported: mapboxgl.supported(),
        isSupported: isSupported(),
        createMap: result,
        performance: performanceTests(),
        navigator: {
            appCodeName: navigator.appCodeName,
            appVersion: navigator.appVersion,
            doNotTrack: navigator.doNotTrack,
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            webdriver: navigator.webdriver,
            language: navigator.language,
        },
    }));
}

export default {
    createMap,
    performanceTests,
    isSupported,
    fullDiagnostic,
};
