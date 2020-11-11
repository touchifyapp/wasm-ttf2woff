import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import cleanup from "rollup-plugin-cleanup";
import dts from "rollup-plugin-dts";

import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
];

export default [{
    input: "lib/ttf2woff.node.ts",
    external: [...external, "path", "fs"],
    output: [
        { file: pkg.main, format: "cjs" },
        { file: pkg.module, format: "es" }
    ],
    plugins: [
        fixWasmPack(),
        typescript({ target: "es6" }),
        commonjs({ ignore: ["path", "fs"] }),
        cleanup({ comments: "jsdoc", maxEmptyLines: 1 })
    ],
}, {
    input: "lib/ttf2woff.browser.ts",
    external,
    output: [
        { file: pkg.browser.replace(".min", ""), format: "umd", name: "ttf2woff" },
        { file: pkg.browser, format: "umd", name: "ttf2woff", plugins: [terser({format: { comments: false } })] },
    ],
    plugins: [
        fixWasmPack(),
        typescript({ target: "es5" }),
        cleanup({ comments: "jsdoc", maxEmptyLines: 1 })
    ],
}, {
    input: "lib/ttf2woff.browser.ts",
    output: [{ file: pkg.types, format: "es" }],
    plugins: [dts()],
}, {
    input: "lib/ttf2woff.node.ts",
    output: [{ file: pkg.types.replace("/browser", "/node"), format: "es" }],
    plugins: [dts()],
}];

import { promises as fs } from "fs";

function fixWasmPack() {
    return {
        name: "fix-wasm-pack",

        transform(code, id) {
            if (id.endsWith("node/wasm_ttf2woff.js")) {
                code = code.replace("wasm_ttf2woff_bg.wasm", "ttf2woff.wasm");
                code = code.replace("const { TextDecoder } = require(String.raw`util`);", "");
                return code;
            }
            
            if (id.endsWith("browser/wasm_ttf2woff.js")) {
                code = code.replace("import.meta.url.replace(/\\.js$/, '_bg.wasm')", JSON.stringify("ttf2woff.wasm"));
                return code;
            }
        },

        async writeBundle(outputOptions) {
            if (outputOptions.file === "dist/node/ttf2woff.js") {
                await fs.copyFile(__dirname + "/build/node/wasm_ttf2woff_bg.wasm", __dirname + "/dist/node/ttf2woff.wasm");
            }

            if (outputOptions.file === "dist/browser/ttf2woff.js") {
                await fs.copyFile(__dirname + "/build/browser/wasm_ttf2woff_bg.wasm", __dirname + "/dist/browser/ttf2woff.wasm");
            }
        }
    };
}
