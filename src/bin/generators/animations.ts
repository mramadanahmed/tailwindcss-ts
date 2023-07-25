import merge from "lodash/merge";
import defaultTheme from "tailwindcss/defaultTheme";
import { extractValues } from "../utils/extract-values";
import { GeneratorFn } from "../utils/types";

export const generateAnimations: GeneratorFn = (tailwindThemeConfig) => {
  const animation = merge(
    tailwindThemeConfig?.animation ?? defaultTheme.animation,
    tailwindThemeConfig?.extend?.animation
  );

  const classes: string[] = [];
  extractValues(["animation"], Object.entries(animation), classes);
  return classes;
};
