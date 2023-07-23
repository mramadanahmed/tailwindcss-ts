type TWSBaseModifiers = {
    [key: string]: string[];
} & {
    default: string[];
};
export type TWSBaseStyleSheet<TClasses extends string, TModifiers extends TWSBaseModifiers> = {
    [key: string]: TClasses[] | TModifiers;
};
export declare class TWSFactory<TClasses extends string, TModifiers extends TWSBaseModifiers, TStyleSheet extends TWSBaseStyleSheet<TClasses, TModifiers>> {
    twStyle: (...classNames: TClasses[]) => string;
    twClasses: (classes: TModifiers) => string;
    twCreateStyleSheet: <T extends TStyleSheet>(styleSheet: T) => { [key in keyof T]: string; };
}
export {};
