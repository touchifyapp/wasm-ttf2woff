import * as bindings from "../build/browser/wasm_ttf2woff";

export type InitInput = bindings.InitInput;

let memory: { buffer: ArrayBuffer };

/**
 * Initialize the WASM with custom options.
 * 
 * `init` could be:
 *  - `string`: the path to the WASM.
 *  - `URL`: the parsed URL to the WASM.
 *  - `Request`: a `fetch` preconfigured Request to the WASM.
 *  - `Response`: a `fetch` Response which contains the WASM.
 *  - `ArrayBuffer`: a Buffer which contains the WASM.
 *  - `WebAssembly.Module`: the WASM compiled and instantiated. 
 * 
 * Note: If this method is not called before `ttf2woff`, it will be called with default options.
 * 
 * @param init - The initialization options
 * @returns - A Promise
 */
export function init(init?: InitInput | Promise<InitInput>): Promise<void> {
    return bindings.default(init)
        .then(mod => { memory = mod.memory; });
}

/**
 * Generate a WOFF font from TTF or OTF font.
 * 
 * @param ttf - The font to convert as Uint8Array
 * @returns - The WOFF font as Uint8Array
 */
export function ttf2woff(ttf: Uint8Array): Promise<Uint8Array> {
    if (!memory) {
        return init().then(() => ttf2woff(ttf));
    }

    return new Promise(resolve => {
        const stream = bindings.generate_woff(ttf);
        resolve(new Uint8Array(memory.buffer, stream.offset(), stream.size()));

        stream.free();
    });
}
