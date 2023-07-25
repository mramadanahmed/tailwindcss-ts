import merge from "lodash/merge";
import defaultTheme from "tailwindcss/defaultTheme";
import { extractValues } from "../utils/extract-values";
import { GeneratorFn } from "../utils/types";

export const generateFontWeight: GeneratorFn = (tailwindThemeConfig) => {
  const fontWeight = merge(
    tailwindThemeConfig?.fontWeight ?? defaultTheme.fontWeight,
    tailwindThemeConfig?.extend?.fontWeight
  );

  const classes: string[] = [];
  const firstLevel: Record<string, string> = {};
  Object.keys(fontWeight).forEach((key) => {
    firstLevel[key] = "";
  });
  extractValues(["text"], Object.entries(firstLevel), classes);

  return classes;
};
