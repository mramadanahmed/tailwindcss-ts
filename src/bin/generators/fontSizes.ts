import merge from "lodash/merge";
import defaultTheme from "tailwindcss/defaultTheme";
import { extractValues } from "../utils/extract-values";
import { GeneratorFn } from "../utils/types";

export const generateFontSize: GeneratorFn = (tailwindThemeConfig) => {
  const fontSizes = merge(
    tailwindThemeConfig?.fontSize ?? defaultTheme.fontSize,
    tailwindThemeConfig?.fontSize
  );

  const classes: string[] = [];
  const firstLevel: Record<string, string> = {};
  Object.keys(fontSizes).forEach((key) => {
    firstLevel[key] = "";
  });
  extractValues(["text"], Object.entries(firstLevel), classes);

  return classes;
};
