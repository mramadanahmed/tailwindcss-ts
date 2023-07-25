import merge from "lodash/merge";
import defaultTheme from "tailwindcss/defaultTheme";
import { extractValues } from "../utils/extract-values";
import { GeneratorFn } from "../utils/types";

export const generateObjectPosition: GeneratorFn = (tailwindThemeConfig) => {
  const positions = merge(
    tailwindThemeConfig?.objectPosition ?? defaultTheme.objectPosition,
    tailwindThemeConfig?.extend?.objectPosition
  );

  const classes: string[] = [];
  const firstLevel: Record<string, string> = {};
  Object.keys(positions).forEach((key) => {
    firstLevel[key] = "";
  });
  extractValues(["object"], Object.entries(firstLevel), classes);

  return classes;
};
