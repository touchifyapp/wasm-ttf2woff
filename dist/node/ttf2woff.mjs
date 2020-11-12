function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var wasm_ttf2woff = createCommonjsModule(function (module) {
let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* @param {Uint8Array} ttf
* @returns {ByteStream}
*/
module.exports.generate_woff = function(ttf) {
    var ptr0 = passArray8ToWasm0(ttf, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.generate_woff(ptr0, len0);
    return ByteStream.__wrap(ret);
};

class ByteStream {

    static __wrap(ptr) {
        const obj = Object.create(ByteStream.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_bytestream_free(ptr);
    }
    /**
    * @returns {number}
    */
    offset() {
        var ret = wasm.bytestream_offset(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    size() {
        var ret = wasm.bytestream_size(this.ptr);
        return ret >>> 0;
    }
}
module.exports.ByteStream = ByteStream;

module.exports.__wbindgen_string_new = function(arg0, arg1) {
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

module.exports.__wbindgen_rethrow = function(arg0) {
    throw takeObject(arg0);
};

const path = require('path').join(__dirname, 'ttf2woff.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;
});

/** Only a stub to make API compatible with Browser. */
function init() {
    return Promise.resolve();
}
/**
 * Generate a WOFF font from TTF or OTF font.
 *
 * @param ttf - The font to convert as Buffer
 * @returns - The WOFF font as Buffer
 */
function ttf2woff(ttf) {
    return new Promise(resolve => {
        const stream = wasm_ttf2woff.generate_woff(ttf);
        const woff = new Uint8Array(wasm_ttf2woff.__wasm.memory.buffer, stream.offset(), stream.size());
        resolve(Buffer.from(woff));
        stream.free();
    });
}

export { init, ttf2woff };
