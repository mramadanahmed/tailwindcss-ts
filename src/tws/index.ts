import { TWSFactory } from "tailwindcss-ts";
import type { TWSClasses, TWSModifiers, TWSScreens } from "./generated-types";

export type TWSStyleSheet = {
  [key: string]: TWSClasses[] | TWSModifiers;
};
export type { TWSClasses, TWSModifiers };

const twsInstance = new TWSFactory<TWSClasses, TWSModifiers, TWSScreens>();

export const { twStyleSheet } = twsInstance;
