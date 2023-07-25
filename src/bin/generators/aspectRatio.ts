import merge from "lodash/merge";
import defaultTheme from "tailwindcss/defaultTheme";
import { extractValues } from "../utils/extract-values";
import { GeneratorFn } from "../utils/types";

export const generateAspectRatio: GeneratorFn = (tailwindThemeConfig) => {
  const aspectRatio = merge(
    tailwindThemeConfig?.aspectRatio ?? defaultTheme.aspectRatio,
    tailwindThemeConfig?.extend?.aspectRatio
  );

  const classes: string[] = [];
  extractValues(["aspect"], Object.entries(aspectRatio), classes);
  return classes;
};
