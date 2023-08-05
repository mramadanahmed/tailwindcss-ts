const { pathsToModuleNameMapper } = require("ts-jest");

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["src"],
  modulePaths: ["."],
  moduleNameMapper: pathsToModuleNameMapper({
    "tailwindcss-ts": ["./index.ts"],
  }),
};
