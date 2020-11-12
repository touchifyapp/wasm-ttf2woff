# wasm-ttf2woff
[![NPM version](https://img.shields.io/npm/v/wasm-ttf2woff.svg)](https://npmjs.org/package/wasm-ttf2woff)
[![Unit Tests](https://github.com/touchifyapp/wasm-ttf2woff/workflows/Unit%20Tests/badge.svg)](https://github.com/touchifyapp/wasm-ttf2woff/actions?query=workflow%3A%22Unit+Tests%22)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](http://opensource.org/licenses/MIT)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

`wasm-ttf2woff` is an utility that converts TTF/OTF fonts to WOFF format.

It is build using WebAssembly so it can run natively in Node.js or in directly in the browser.
It can be very usefull for any webfont generation tools.

WebAssembly also allows code to run much faster that pure javascript implementation.

## Installation

```bash
$ npm install wasm-ttf2woff
```

## Usage

### Node.JS

```typescript
import { ttf2woff } from "wasm-ttf2woff";
import { promises as fs } from "fs";

async function convert(file: string): Promise<Buffer> {
    // Read the font
    const content = await fs.readFile(file);

    // Convert the font to WOFF
    const woff = await ttf2woff(content);

    // Transform result to Node.JS Buffer
    return Buffer.from(woff);
}
```

### Browser

```typescript
import { init, ttf2woff } from "wasm-ttf2woff";

async function convert(blob: Blob): Promise<Blob> {
    // Transforms the Blob to ArrayBuffer
    const buffer = await blob.arrayBuffer();
    
    // Transforms the ArrayBuffer to Uint8Array
    const content = new Uint8Array(buffer);

    // Initialize wasm
    await init("path/to/ttf2woff.wasm");

    // Convert the font to WOFF
    const woff = await ttf2woff(content);

    // Creates a new Blob from the result
    return new Blob([woff], { type: "font/woff" });
}
```

Note 1: If you do not call `init()` before running `ttf2woff`, the WASM will be loaded assuming that `ttf2woff.wasm` is in the same directory as the current running page.

Note 2: The `init()` function could be called with:
 - `string`: the path to the WASM.
 - `URL`: the parsed URL to the WASM.
 - `Request`: a `fetch` preconfigured Request to the WASM.
 - `Response`: a `fetch` Response which contains the WASM.
 - `ArrayBuffer`: an ArrayBuffer which contains the WASM.
 - `WebAssembly.Module`: the WASM compiled and instantiated. 

## Contributing

You are very welcome to contribute to the project. Here are the instructions to build and run the project from source.

### Prerequistes

- [X] [Node.JS](https://nodejs.org/en/download/) 12+
- [X] [Rust](https://www.rust-lang.org/tools/install) 1.47+
- [X] [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

### Steps

```bash
# Clone the project
git clone https://github.com/touchifyapp/wasm-ttf2woff

# Move to the project dir
cd ttf2woff

# Install dependencies
npm ci

# Build the source wasm
npm run build:rust
```

### Common tasks

```bash
# Build the full project
npm run build

# Run unit tests (needs python)
npm test
```

## License

This project is under [MIT](./LICENSE) License. See the LICENSE file for the full license text.
