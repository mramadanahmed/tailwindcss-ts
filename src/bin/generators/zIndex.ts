import merge from "lodash/merge";
import defaultTheme from "tailwindcss/defaultTheme";
import { extractValues } from "../utils/extract-values";
import { GeneratorFn } from "../utils/types";

export const generateZIndex: GeneratorFn = (tailwindThemeConfig) => {
  const zIndex = merge(
    tailwindThemeConfig?.zIndex ?? defaultTheme.zIndex,
    tailwindThemeConfig?.extend?.zIndex
  );

  const classes: string[] = [];
  const firstLevel: Record<string, string> = {};
  Object.keys(zIndex).forEach((key) => {
    firstLevel[key] = "";
  });
  extractValues(["z"], Object.entries(firstLevel), classes);

  return classes;
};
