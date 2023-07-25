import merge from "lodash/merge";
import defaultTheme from "tailwindcss/defaultTheme";
import { extractValues } from "../utils/extract-values";
import { GeneratorFn } from "../utils/types";

export const generateBoxShadow: GeneratorFn = (tailwindThemeConfig) => {
  const boxShadow = merge(
    tailwindThemeConfig?.boxShadow ?? defaultTheme.boxShadow,
    tailwindThemeConfig?.extend?.boxShadow
  );

  const classes: string[] = [];
  const firstLevel: Record<string, string> = {};
  Object.keys(boxShadow).forEach((key) => {
    firstLevel[key] = "";
  });
  extractValues(["shadow"], Object.entries(firstLevel), classes);
  return classes;
};
