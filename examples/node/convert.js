const path = require("path");
const fs = require("fs").promises;
const ttf2woff = require("../../dist/node/ttf2woff");

main();

async function main() {
    const args = process.argv.slice(2);
    const [file] = args;

    console.time("full");

    console.time("read file");
    const content = await fs.readFile(file);
    console.timeEnd("read file");

    console.time("generate woff");
    const woff = await ttf2woff.ttf2woff(content);
    console.timeEnd("generate woff");

    console.time("write file");
    const dest = path.basename(file).replace(/(otf|ttf)$/, "woff");
    await fs.writeFile(dest, Buffer.from(woff));
    console.timeEnd("write file");

    console.timeEnd("full");

    console.log(`source length: ${filesize(content.length)}`);
    console.log(`dest length:   ${filesize(woff.length)}`);
    console.log(`ratio:         ${woff.length / content.length * 100}%`);
}

function filesize(size) {
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + " " + ["B", "kB", "MB", "GB", "TB"][i];
}
