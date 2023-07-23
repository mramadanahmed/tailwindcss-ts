import fs from "fs";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import shebang from "rollup-plugin-preserve-shebang";

// const packageJson = fs.readFileSync("./package.json").toJSON();

/**
 * @type {import('rollup').RollupOptions[]}
 */
const config = [
  {
    input: "./src/bin/generate.ts",
    output: {
      file: "dist/bin/generate.cjs",
      sourcemap: false,
      format: "commonjs",
    },
    plugins: [
      (() => {
        if (fs.existsSync("./dist")) {
          fs.rmSync("./dist", { recursive: true });
        }
        fs.mkdirSync("./dist");
      })(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
      shebang(),
      (() => {
        fs.cpSync("./src/bin/code-template", "./dist/bin/code-template", {
          recursive: true,
        });
      })(),
    ],
  },
  {
    input: ["./src/index.ts"],
    output: {
      file: "dist/index.js",
      sourcemap: false,
      format: "esm",
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
      }),
    ],
  },
];

export default config;
