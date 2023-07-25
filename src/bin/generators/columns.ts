import merge from "lodash/merge";
import defaultTheme from "tailwindcss/defaultTheme";
import { extractValues } from "../utils/extract-values";
import { GeneratorFn } from "../utils/types";

export const generateColumns: GeneratorFn = (tailwindThemeConfig) => {
  const columns = merge(
    tailwindThemeConfig?.columns ?? defaultTheme.columns,
    tailwindThemeConfig?.extend?.columns
  );

  const classes: string[] = [];
  extractValues(["columns"], Object.entries(columns), classes);
  return classes;
};
