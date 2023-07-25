import merge from "lodash/merge";
import defaultTheme from "tailwindcss/defaultTheme";
import { extractValues } from "../utils/extract-values";
import { GeneratorFn } from "../utils/types";

export const generateTopLeftBottomRight: GeneratorFn = (
  tailwindThemeConfig
) => {
  const spacing = merge(
    tailwindThemeConfig?.spacing ?? defaultTheme.spacing,
    tailwindThemeConfig?.extend?.spacing
  );

  const inset = merge(
    tailwindThemeConfig?.inset ??
      (defaultTheme.inset as any)({ theme: () => spacing }),
    tailwindThemeConfig?.extend?.inset
  );

  const classes: string[] = [];
  [
    "inset",
    "inset-x",
    "inset-y",
    "start",
    "end",
    "top",
    "right",
    "bottom",
    "left",
  ].forEach((prefix) => {
    extractValues([prefix], Object.entries(inset), classes);
    extractValues(
      [`-${prefix}`],
      Object.entries(inset).filter((s) => !["auto", "full"].includes(s[0])),
      classes
    );
  });
  return classes;
};
