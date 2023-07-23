import { TWSFactory } from "tailwindcss-ts";
import type { TWSClasses, TWSModifiers } from "./generated-types";

export type TWSStyleSheet = {
  [key: string]: TWSClasses[] | TWSModifiers;
};
export type { TWSClasses, TWSModifiers };

const twsInstance = new TWSFactory<TWSClasses, TWSModifiers, TWSStyleSheet>();

export const { twCreateStyleSheet, twClasses, twStyle } = twsInstance;
