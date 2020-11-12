type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

declare type InitInput$1 = InitInput;
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
declare function init(init?: InitInput$1 | Promise<InitInput$1>): Promise<void>;
/**
 * Generate a WOFF font from TTF or OTF font.
 *
 * @param ttf - The font to convert as Uint8Array
 * @returns - The WOFF font as Uint8Array
 */
declare function ttf2woff(ttf: Uint8Array): Promise<Uint8Array>;

export { InitInput$1 as InitInput, init, ttf2woff };
