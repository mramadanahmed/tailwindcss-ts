type TWSBaseModifiers = { [key: string]: string[] } & {
  default: string[];
};

export type TWSBaseStyleSheet<
  TClasses extends string,
  TModifiers extends TWSBaseModifiers,
> = {
  [key: string]: TClasses[] | TModifiers;
};

export class TWSFactory<
  TClasses extends string,
  TModifiers extends TWSBaseModifiers,
  TStyleSheet extends TWSBaseStyleSheet<TClasses, TModifiers>,
> {
  twStyle = (...classNames: TClasses[]) => {
    if (typeof classNames === "string") return classNames;
    else return classNames.join(" ");
  };

  twClasses = (classes: TModifiers) => {
    return Object.keys(classes)
      .map((key) => {
        return classes[key as keyof TModifiers].join(" ");
      })
      .join(" ");
  };

  twCreateStyleSheet = <T extends TStyleSheet>(styleSheet: T) => {
    const result: { [key in keyof T]: string } = {} as any;
    Object.keys(styleSheet).forEach((key) => {
      if (Array.isArray(styleSheet[key])) {
        result[key as keyof T] = this.twStyle(
          ...(styleSheet[key] as TClasses[])
        );
      } else {
        result[key as keyof T] = this.twClasses(styleSheet[key] as TModifiers);
      }
    });

    return result;
  };
}
