#! /usr/bin/env node

import defaultTheme from "tailwindcss/defaultTheme";
import defaultColors from "tailwindcss/colors";
import { Config as TailwindCssConfig } from "tailwindcss";
import merge from "lodash/merge";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import prettier from "prettier";
import { rollup } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

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

  const extendedTheme = js?.theme?.extend ?? {};

  const extractValues = (
    preKeys: string[],
    configValue: ReturnType<typeof Object.entries>,
    allClasses: string[]
  ) => {
    configValue.forEach(([key, value]: any) => {
      if (typeof value === "string") {
        allClasses.push(`${preKeys.join("-")}-${key}`);
      } else {
        extractValues([...preKeys, key], Object.entries(value), allClasses);
      }
    });
  };

  const generateColors = (prefix: "text" | "bg") => {
    const colors = merge(
      js?.theme?.colors ?? defaultColors,
      extendedTheme.colors
    );

    const classes: any = [];
    extractValues([prefix], Object.entries(colors), classes);
    return classes.map((c: any) => `"${c}"`).join("|");
  };

  const generatePadding = (prefix: string) => {
    const spacing = merge(
      js?.theme?.spacing ?? defaultTheme.spacing,
      extendedTheme.spacing
    );

    const classes: any = [];
    extractValues([prefix], Object.entries(spacing), classes);
    return classes.map((c: any) => `"${c}"`).join("|");
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
    const screens = merge(
      js?.theme?.screens ?? defaultTheme.screens,
      extendedTheme.screens
    );

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
    `type TWSCustomTypes = ${(
      config.customClasses?.map((c) => `"${c}"`) ?? ["never"]
    ).join("|")}`,
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
