import merge from "lodash/merge";
import defaultTheme from "tailwindcss/defaultTheme";
import { GeneratorFn } from "../utils/types";

export const generateScreens: GeneratorFn = (tailwindThemeConfig) => {
  const screens = Object.keys(
    merge(
      tailwindThemeConfig?.screens ?? defaultTheme.screens,
      tailwindThemeConfig?.extend?.screens
    )
  );

  return [...screens, ...screens.map((s) => `max-${s}`)];
};
