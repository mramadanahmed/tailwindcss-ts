export type GeneratorFn = (
  tailwindThemeConfig: import("tailwindcss").Config["theme"]
) => string[];
