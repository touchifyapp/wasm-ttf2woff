(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ttf2woff = {}));
}(this, (function (exports) { 'use strict';

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
    function generate_woff(ttf) {
        var ptr0 = passArray8ToWasm0(ttf, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.generate_woff(ptr0, len0);
        return ByteStream.__wrap(ret);
    }

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

    async function load(module, imports) {
        if (typeof Response === 'function' && module instanceof Response) {

            if (typeof WebAssembly.instantiateStreaming === 'function') {
                try {
                    return await WebAssembly.instantiateStreaming(module, imports);

                } catch (e) {
                    if (module.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                    } else {
                        throw e;
                    }
                }
            }

            const bytes = await module.arrayBuffer();
            return await WebAssembly.instantiate(bytes, imports);

        } else {

            const instance = await WebAssembly.instantiate(module, imports);

            if (instance instanceof WebAssembly.Instance) {
                return { instance, module };

            } else {
                return instance;
            }
        }
    }

    async function init(input) {
        if (typeof input === 'undefined') {
            input = "ttf2woff.wasm";
        }
        const imports = {};
        imports.wbg = {};
        imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
            var ret = getStringFromWasm0(arg0, arg1);
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_throw = function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        };
        imports.wbg.__wbindgen_rethrow = function(arg0) {
            throw takeObject(arg0);
        };

        if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
            input = fetch(input);
        }

        const { instance, module } = await load(await input, imports);

        wasm = instance.exports;
        init.__wbindgen_wasm_module = module;

        return wasm;
    }

    var memory;
    /**
     * Initialize the WASM with custom options.
     *
     * `init` could be:
     *  - `string`: the path to the WASM.
     *  - `URL`: the parsed URL to the WASM.
     *  - `Request`: a preconfigured Request to the WASM (for `fetch`).
     *  - `Response`: a `fetch` Response wich contains the WASM.
     *  - `ArrayBuffer`: a Buffer which contains the WASM.
     *  - `WebAssembly.Module`: the WASM compiled and instantiated.
     *
     * Note: If this method is not called before `ttf2woff`, it will be called with default options.
     *
     * @param init - The initialization options
     * @returns - A Promise
     */
    function init$1(init$1) {
        return init(init$1)
            .then(function (mod) { memory = mod.memory; });
    }
    /**
     * Generate a WOFF font from TTF or OTF font.
     *
     * @param ttf - The font to convert as Uint8Array
     * @returns - The WOFF font as Uint8Array
     */
    function ttf2woff(ttf) {
        if (!memory) {
            return init$1().then(function () { return ttf2woff(ttf); });
        }
        return new Promise(function (resolve) {
            var stream = generate_woff(ttf);
            resolve(new Uint8Array(memory.buffer, stream.offset(), stream.size()));
            stream.free();
        });
    }

    exports.init = init$1;
    exports.ttf2woff = ttf2woff;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
