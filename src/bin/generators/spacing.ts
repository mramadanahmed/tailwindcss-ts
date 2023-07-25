import merge from "lodash/merge";
import defaultTheme from "tailwindcss/defaultTheme";
import { extractValues } from "../utils/extract-values";
import { GeneratorFn } from "../utils/types";

export const generateSpacing: GeneratorFn = (tailwindThemeConfig) => {
  const spacing = merge(
    tailwindThemeConfig?.spacing ?? defaultTheme.spacing,
    tailwindThemeConfig?.extend?.spacing
  );

  const classes: string[] = [];
  [
    "p",
    "px",
    "py",
    "pr",
    "pl",
    "ps",
    "pe",
    "pt",
    "pb",
    "m",
    "mx",
    "my",
    "mr",
    "ml",
    "ms",
    "me",
    "mt",
    "mb",
    "space-x",
    "space-y",
  ].forEach((prefix) => {
    extractValues([prefix], Object.entries(spacing), classes);
    extractValues([`-${prefix}`], Object.entries(spacing), classes);
  });
  return classes;
};
