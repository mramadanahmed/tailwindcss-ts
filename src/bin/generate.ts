#! /usr/bin/env node

import { Config as TailwindCssConfig } from "tailwindcss";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import prettier from "prettier";
import { rollup } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { generateColors } from "./generators/colors";
import { generateSpacing } from "./generators/spacing";
import { generateScreens } from "./generators/screens";
import { GeneratorFn } from "./utils/types";
import { generateFontSize } from "./generators/fontSizes";
import { generateBoxShadow } from "./generators/boxShadow";
import { generateDropShadow } from "./generators/dropShadow";
import { generateFontWeight } from "./generators/fontWeight";
import { generateFontFamily } from "./generators/fontFamily";
import { generateObjectPosition } from "./generators/objectPosition";
import { generateStandards } from "./generators/standards";
import { twModifiers } from "./utils/modifiers";
import { generateAnimations } from "./generators/animations";
import { generateAspectRatio } from "./generators/aspectRatio";
import { generateColumns } from "./generators/columns";
import { generateTopLeftBottomRight } from "./generators/topLeftBottomRight";
import { generateZIndex } from "./generators/zIndex";

export type TWSConfig = {
  tailwindConfig?: string;
  outputSrc?: string;
  tempDir?: string;
  customClasses?: string[];
};

const rcFile = "./tws.json";
const config: TWSConfig = fs.existsSync(rcFile)
  ? JSON.parse(fs.readFileSync(rcFile).toString())
  : {};

const generatePath = config.outputSrc ?? "./src/tws";
const tempDir = config.tempDir ?? "./tws-temp";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let filePath = config.tailwindConfig
  ? path.resolve(process.cwd(), config.tailwindConfig)
  : "";
let jsFileExist = config.tailwindConfig ? fs.existsSync(filePath) : false;
if (!jsFileExist) filePath = path.resolve(process.cwd(), "tailwind.config.js");
jsFileExist = fs.existsSync(filePath);
if (!jsFileExist) filePath = path.resolve(process.cwd(), "tailwind.config.cjs");
jsFileExist = fs.existsSync(filePath);

if (!jsFileExist) console.warn("tailwind.config.(cjs|js) not found");
else console.info(`found : ${filePath}`);

const generateTWS = async () => {
  let jsModule: { default?: TailwindCssConfig } = {};

  if (jsFileExist) {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, {
        recursive: true,
        force: true,
      });
    }
    fs.mkdirSync(tempDir);
    console.info("temp folder created", tempDir);

    const bundleFile = await rollup({
      input: filePath,
      output: {
        format: "esm",
      },
      plugins: [resolve(), commonjs()],
    });

    const output = path.resolve(tempDir, "tailwind-config.cjs");
    await bundleFile.write({
      file: output,
    });

    jsModule = await import(output);
  }

  const js = jsModule.default;

  const generators: GeneratorFn[] = [
    generateColors,
    generateSpacing,
    generateFontSize,
    generateBoxShadow,
    generateDropShadow,
    generateFontWeight,
    generateFontFamily,
    generateObjectPosition,
    generateStandards,
    generateAnimations,
    generateAspectRatio,
    generateColumns,
    generateTopLeftBottomRight,
    generateZIndex,
  ];

  if (fs.existsSync(generatePath))
    fs.rmSync(generatePath, {
      recursive: true,
    });

  fs.mkdirSync(generatePath);

  const getModifiers = (() => {
    const screens = generateScreens(js?.theme);

    return [...twModifiers, ...screens].map(
      (m) => `"${m}"?: \`${m}:$\{TWSClasses\}\`[];`
    );
  })();

  const twsClasses: string[] = [];

  generators.map((generator) => {
    const classes = generator(js?.theme).map((className) => `"${className}"`);
    classes.forEach((className) => {
      twsClasses.push(className);
    });
  });

  const importClasses = twsClasses.filter((a) => a.charAt(1) === "!").sort();
  const minusSpacingClasses = twsClasses
    .filter((a) => a.charAt(1) === "-")
    .sort();
  const remaining = twsClasses
    .filter((a) => a.charAt(1) !== "!" && a.charAt(1) !== "-")
    .sort();

  const TWSTypes = [
    remaining.length === 0 ? undefined : remaining.join("|"),
    importClasses.length === 0 ? undefined : importClasses.join("|"),
    minusSpacingClasses.length === 0
      ? undefined
      : minusSpacingClasses.join("|"),
  ]
    .filter((a) => !!a)
    .join("|");

  const generatedTypes = [
    `type TWSTypes = ${TWSTypes};`,
    `type TWSPreprocess = "" | "!" ;`,
    `type TWSCustomTypes = ${(
      config.customClasses?.map((c) => `"${c}"`) ?? ["never"]
    ).join("|")}`,
    `export type TWSClasses = \`\${TWSPreprocess}\${
    | TWSTypes
    | TWSCustomTypes}\`;`,
    `export type TWSModifiers = {
      default: TWSClasses[];
      ${getModifiers.join("\n")}
    };`,
    `export type TWSStyleSheet = {
      [key: string]: TWSClasses[] | TWSModifiers;
    };`,
  ].join("\n\n");

  fs.writeFileSync(
    path.resolve(generatePath, "generated-types.ts"),
    await prettier.format(generatedTypes, { parser: "typescript" })
  );

  fs.writeFileSync(
    path.resolve(generatePath, "index.ts"),
    fs.readFileSync(path.resolve(__dirname, "./code-template/index.ts"))
  );

  fs.rmSync(tempDir, {
    recursive: true,
    force: true,
  });

  console.log(`Done! 🙌 \nStart using it at '${generatePath}`);
};

generateTWS();
