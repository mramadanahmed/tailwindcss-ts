import merge from "lodash/merge";
import defaultTheme from "tailwindcss/defaultTheme";
import { extractValues } from "../utils/extract-values";
import { GeneratorFn } from "../utils/types";

export const generateDropShadow: GeneratorFn = (tailwindThemeConfig) => {
  const dropShadow = merge(
    tailwindThemeConfig?.dropShadow ?? defaultTheme.dropShadow,
    tailwindThemeConfig?.extend?.dropShadow
  );

  const classes: string[] = [];
  const firstLevel: Record<string, string> = {};
  Object.keys(dropShadow).forEach((key) => {
    firstLevel[key] = "";
  });
  extractValues(["drop-shadow"], Object.entries(firstLevel), classes);
  return classes;
};
