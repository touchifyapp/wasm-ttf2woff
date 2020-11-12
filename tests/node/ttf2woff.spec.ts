import * as path from "path";
import { spawn } from "child_process";
import { promises as fs } from "fs";

import * as cheerio from "cheerio";

import { ttf2woff } from "../../dist/node/ttf2woff";
import { resolve } from "dns";

const SOURCE = path.join(__dirname, "..", "assets", "Montserrat Bold.ttf");
const DEST = SOURCE.replace(".ttf", ".woff");
const REPORT = SOURCE.replace(".ttf", "_validate.html");

describe("ttf2woff", () => {

    afterEach(async () => {
        await fs.unlink(DEST).catch();
        await fs.unlink(REPORT).catch();
    });

    test("should generate a valid woff font", async () => {
        const content = await fs.readFile(SOURCE);

        const woff = await ttf2woff(content);

        await fs.writeFile(DEST, Buffer.from(woff));

        await runWoffValidtor(DEST);

        const report = await fs.readFile(REPORT, "utf-8");
        const $ = cheerio.load(report);

        expect($(".testReportWarning > .testReportResultCount").text()).toBe("0");
        expect($(".testReportError > .testReportResultCount").text()).toBe("0");
    });

});

function runWoffValidtor(file: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const cp = spawn("python2", [path.join(__dirname, "..", "validator", "validator.py"), file]);

        cp.on("error", reject);
        cp.on("exit", (code) => {
            code === 0 ?
                resolve() :
                reject(new Error(`python validator exited with code ${code}`));
        });
    });
}
