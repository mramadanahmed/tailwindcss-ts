import merge from "lodash/merge";
import defaultTheme from "tailwindcss/defaultTheme";
import { extractValues } from "../utils/extract-values";
import { GeneratorFn } from "../utils/types";

export const generateFontFamily: GeneratorFn = (tailwindThemeConfig) => {
  const fontFamily = merge(
    tailwindThemeConfig?.fontFamily ?? defaultTheme.fontFamily,
    tailwindThemeConfig?.fontFamily
  );

  const classes: string[] = [];
  const firstLevel: Record<string, string> = {};
  Object.keys(fontFamily).forEach((key) => {
    firstLevel[key] = "";
  });
  extractValues(["text"], Object.entries(firstLevel), classes);

  return classes;
};
