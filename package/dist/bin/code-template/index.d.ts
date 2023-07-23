import type { TWSClasses, TWSModifiers } from "./generated-types";
export type TWSStyleSheet = {
    [key: string]: TWSClasses[] | TWSModifiers;
};
export type { TWSClasses, TWSModifiers };
export declare const twCreateStyleSheet: <T extends TWSStyleSheet>(styleSheet: T) => { [key in keyof T]: string; }, twClasses: (classes: TWSModifiers) => string, twStyle: (...classNames: ""[]) => string;
