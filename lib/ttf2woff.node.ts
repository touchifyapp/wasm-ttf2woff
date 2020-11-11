import * as bindings from "../build/node/wasm_ttf2woff";

/** Only a stub to make API compatible with Browser. */
export function init(): Promise<void> {
    return Promise.resolve();
}

/**
 * Generate a WOFF font from TTF or OTF font.
 * 
 * @param ttf - The font to convert as Buffer
 * @returns - The WOFF font as Buffer
 */
export function ttf2woff(ttf: Buffer | Uint8Array): Promise<Buffer> {
    return new Promise(resolve => {
        const stream = bindings.generate_woff(ttf);
        const woff = new Uint8Array((bindings as any).__wasm.memory.buffer, stream.offset(), stream.size());

        resolve(Buffer.from(woff));

        stream.free();
    });
}
