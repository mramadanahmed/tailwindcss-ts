#! /usr/bin/env node
'use strict';

var defaultTheme = require('tailwindcss/defaultTheme');
var defaultColors = require('tailwindcss/colors');
var merge = require('lodash/merge');
var fs = require('fs');
var path = require('path');
var url = require('url');
var prettier = require('prettier');
var rollup = require('rollup');
var resolve = require('@rollup/plugin-node-resolve');
var commonjs = require('@rollup/plugin-commonjs');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var _a, _b;
const rcFile = "./tws.json";
const config = fs.existsSync(rcFile)
    ? JSON.parse(fs.readFileSync(rcFile).toString())
    : {};
const generatePath = (_a = config.outputSrc) !== null && _a !== void 0 ? _a : "./src/tws";
const tempDir = (_b = config.tempDir) !== null && _b !== void 0 ? _b : "./tws-temp";
const __filename$1 = url.fileURLToPath((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (document.currentScript && document.currentScript.src || new URL('generate.js', document.baseURI).href)));
const __dirname$1 = path.dirname(__filename$1);
let filePath = config.tailwindConfig
    ? path.resolve(process.cwd(), config.tailwindConfig)
    : "";
let jsFileExist = config.tailwindConfig ? fs.existsSync(filePath) : false;
if (!jsFileExist)
    filePath = path.resolve(process.cwd(), "tailwind.config.js");
jsFileExist = fs.existsSync(filePath);
if (!jsFileExist)
    filePath = path.resolve(process.cwd(), "tailwind.config.cjs");
jsFileExist = fs.existsSync(filePath);
if (!jsFileExist)
    console.warn("tailwind.config.(cjs|js) not found");
else
    console.info(`found : ${filePath}`);
const generateTWS = () => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f;
    let jsModule = {};
    if (jsFileExist) {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, {
                recursive: true,
                force: true,
            });
        }
        fs.mkdirSync(tempDir);
        console.info("temp folder created", tempDir);
        const bundleFile = yield rollup.rollup({
            input: filePath,
            output: {
                format: "esm",
            },
            plugins: [resolve(), commonjs()],
        });
        yield bundleFile.write({
            dir: tempDir,
        });
        var fileName = path.basename(filePath);
        jsModule = yield import(path.resolve(tempDir, fileName));
    }
    const js = jsModule.default;
    console.log("loaded", js === null || js === void 0 ? void 0 : js.theme);
    const extendedTheme = (_d = (_c = js === null || js === void 0 ? void 0 : js.theme) === null || _c === void 0 ? void 0 : _c.extend) !== null && _d !== void 0 ? _d : {};
    const extractValues = (preKeys, configValue, allClasses) => {
        configValue.forEach(([key, value]) => {
            if (typeof value === "string") {
                allClasses.push(`${preKeys.join("-")}-${key}`);
            }
            else {
                extractValues([...preKeys, key], Object.entries(value), allClasses);
            }
        });
    };
    const generateColors = (prefix) => {
        var _a, _b;
        const colors = merge((_b = (_a = js === null || js === void 0 ? void 0 : js.theme) === null || _a === void 0 ? void 0 : _a.colors) !== null && _b !== void 0 ? _b : defaultColors, extendedTheme.colors);
        const classes = [];
        extractValues([prefix], Object.entries(colors), classes);
        return classes.map((c) => `"${c}"`).join("|");
    };
    const generatePadding = (prefix) => {
        var _a, _b;
        const spacing = merge((_b = (_a = js === null || js === void 0 ? void 0 : js.theme) === null || _a === void 0 ? void 0 : _a.spacing) !== null && _b !== void 0 ? _b : defaultTheme.spacing, extendedTheme.spacing);
        const classes = [];
        extractValues([prefix], Object.entries(spacing), classes);
        return classes.map((c) => `"${c}"`).join("|");
    };
    const textColors = generateColors("text");
    const bgColors = generateColors("bg");
    const padding = ["p", "px", "py", "pr", "pl", "ps", "pe", "pt", "pb"]
        .map((prefix) => generatePadding(prefix))
        .join("|");
    const margin = ["m", "mx", "my", "mr", "ml", "ms", "me", "mt", "mb"]
        .map((prefix) => generatePadding(prefix))
        .join("|");
    const spaceInBetween = ["space-x", "space-y"]
        .map((prefix) => generatePadding(prefix))
        .join("|");
    if (fs.existsSync(generatePath))
        fs.rmSync(generatePath, {
            recursive: true,
        });
    fs.mkdirSync(generatePath);
    const getModifiers = (() => {
        var _a, _b;
        const screens = merge((_b = (_a = js === null || js === void 0 ? void 0 : js.theme) === null || _a === void 0 ? void 0 : _a.screens) !== null && _b !== void 0 ? _b : defaultTheme.screens, extendedTheme.screens);
        return [
            "hover",
            "focus",
            "active",
            "before",
            "after",
            "placeholder",
            "selection",
            "print",
            "dark",
            ...Object.keys(screens),
        ].map((m) => `"${m}"?: \`${m}:$\{TWSClasses\}\`[];`);
    })();
    const generatedTypes = [
        `type TWSSpacesNegative = "" | "-";`,
        `type TWSTextTypes = ${textColors};`,
        `type TWSBgColors = ${bgColors};`,
        `type TWSPadding = ${padding};`,
        `type TWSMargin = ${margin};`,
        `type TWSSpaceInBetween = ${spaceInBetween};`,
        `type TWSPreprocess = "" | "!" ;`,
        `type TWSCustomTypes = ${((_f = (_e = config.customClasses) === null || _e === void 0 ? void 0 : _e.map((c) => `"${c}"`)) !== null && _f !== void 0 ? _f : ["never"]).join("|")}`,
        `export type TWSClasses = \`\${TWSPreprocess}\${
    | TWSTextTypes
    | TWSBgColors
    | \`\${TWSSpacesNegative}\${TWSPadding}\`
    | \`\${TWSSpacesNegative}\${TWSMargin}\`
    | TWSSpaceInBetween
    | TWSCustomTypes}\`;`,
        `export type TWSModifiers = {
      default: TWSClasses[];
      ${getModifiers.join("\n")}
    };`,
        `export type TWSStyleSheet = {
      [key: string]: TWSClasses[] | TWSModifiers;
    };`,
    ].join("\n\n");
    fs.writeFileSync(path.resolve(generatePath, "generated-types.ts"), yield prettier.format(generatedTypes, { parser: "typescript" }));
    fs.writeFileSync(path.resolve(generatePath, "index.ts"), fs.readFileSync(path.resolve(__dirname$1, "./code-template/index.ts")));
    fs.rmSync(tempDir, {
        recursive: true,
        force: true,
    });
    console.log("Done!");
});
generateTWS();
