import merge from "lodash/merge";
import defaultColors from "tailwindcss/colors";
import { extractValues } from "../utils/extract-values";
import { GeneratorFn } from "../utils/types";

export const generateColors: GeneratorFn = (tailwindConfig) => {
  const colors = merge(
    tailwindConfig?.colors ?? defaultColors,
    tailwindConfig?.extend?.colors
  );

  const classes: string[] = [];
  ["text", "bg"].forEach((prefix) => {
    extractValues([prefix], Object.entries(colors), classes);
  });
  return classes;
};
