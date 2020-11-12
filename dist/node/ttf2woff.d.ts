/// <reference types="node" />

/** Only a stub to make API compatible with Browser. */
declare function init(): Promise<void>;
/**
 * Generate a WOFF font from TTF or OTF font.
 *
 * @param ttf - The font to convert as Buffer
 * @returns - The WOFF font as Buffer
 */
declare function ttf2woff(ttf: Buffer | Uint8Array): Promise<Buffer>;

export { init, ttf2woff };
