type TWSStyle<
  TClasses extends string,
  TModifiers extends string,
  TScreen extends string = "",
> = TScreen extends ""
  ?
      | TClasses[]
      | {
          [key in "default" | TModifiers]?: key extends "default"
            ? TClasses[]
            : `${key}:${TClasses}`[];
        }
  :
      | `${TScreen}:${TClasses}`[]
      | {
          [key in "default" | TModifiers]?: key extends "default"
            ? `${TScreen}:${TClasses}`[]
            : `${TScreen}:${key}:${TClasses}`[];
        };

type TWSScreens<
  TClasses extends string,
  TModifiers extends string,
  TScreens extends string,
> = {
  [key in TScreens]?: TWSStyle<TClasses, TModifiers, key>;
};

type TWSStyleObjectItem<
  TClasses extends string,
  TModifiers extends string,
  TScreens extends string,
> = TWSScreens<TClasses, TModifiers, TScreens> | TWSStyle<TClasses, TModifiers>;

type TWSStyleObjectItemVariants<
  TClasses extends string,
  TModifiers extends string,
  TScreens extends string,
> = {
  variants?: Record<string, TWSStyleObjectItem<TClasses, TModifiers, TScreens>>;
};

type TWSStyleObject<
  TClasses extends string,
  TModifiers extends string,
  TScreens extends string,
> = TWSStyleObjectItem<TClasses, TModifiers, TScreens> &
  TWSStyleObjectItemVariants<TClasses, TModifiers, TScreens>;

export type TWSConditional<
  TClasses extends string,
  TModifiers extends string,
  TScreens extends string,
> = {
  type: "callback";
  callbackParameters: { [key: string]: "" };
  callback: (options: { [key: string]: boolean }) => {
    variants?: Record<
      string,
      {
        test: boolean;
        value: TWSStyleObjectItem<TClasses, TModifiers, TScreens>;
      }[]
    >;
    default: {
      test: boolean;
      value: TWSStyleObjectItem<TClasses, TModifiers, TScreens>;
    }[];
  };
};

export type TWSStyleSheetItem<
  TClasses extends string,
  TModifiers extends string,
  TScreens extends string,
> =
  | ({
      type?: undefined;
      callbackParameters?: undefined;
      callback?: undefined;
    } & TWSStyleObject<TClasses, TModifiers, TScreens>)
  | TWSConditional<TClasses, TModifiers, TScreens>;

export type TWSConditionalCheck<
  TClasses extends string,
  TModifiers extends string,
  TScreens extends string,
  T,
> = T extends TWSConditional<TClasses, TModifiers, TScreens>
  ? ReturnType<T["callback"]> extends { variants: any }
    ? {
        [aKey in keyof ReturnType<T["callback"]>["variants"]]: (options: {
          [key in keyof T["callbackParameters"]]: boolean;
        }) => string;
      }
    : (options: {
        [key in keyof T["callbackParameters"]]: boolean;
      }) => string
  : T;

export type TWSStyleSheet<
  TClasses extends string,
  TModifiers extends string,
  TScreens extends string,
> = <
  TStyleSheet extends {
    [key: string]: TWSStyleSheetItem<TClasses, TModifiers, TScreens>;
  },
>(
  styleSheet: TStyleSheet
) => {
  [key in keyof TStyleSheet]: TStyleSheet[key] extends TWSStyleObjectItemVariants<
    TClasses,
    TModifiers,
    TScreens
  >
    ? { [aKey in keyof TStyleSheet[key]["variants"]]: string }
    : TStyleSheet[key] extends TWSConditional<TClasses, TModifiers, TScreens>
    ? TWSConditionalCheck<TClasses, TModifiers, TScreens, TStyleSheet[key]>
    : string;
};

export class TWSFactory<
  TClasses extends string,
  TModifiers extends string,
  TScreens extends string,
> {
  twStyle = (...classNames: TClasses[]) => {
    if (typeof classNames === "string") return classNames;
    else return classNames.join(" ");
  };

  twClasses = (classes: TModifiers) => {
    return (
      Object.keys(classes)
        // .map((key) => {
        //   return classes[key as keyof TModifiers].join(" ");
        // })
        .join(" ")
    );
  };

  twStyleSheet: TWSStyleSheet<TClasses, TModifiers, TScreens> = (
    styleSheet
  ) => {
    const result: { [key in keyof typeof styleSheet]: string } = {} as any;

    // Object.keys(styleSheet).forEach((key) => {
    //   if (typeof styleSheet[key] === "string") return styleSheet[key];
    //   if (Array.isArray(styleSheet[key])) {
    //     result[key] = this.twStyle(...(styleSheet[key] as TClasses[]));
    //   } else if (typeof styleSheet[key] === "function") {
    //     return (options: Record<string, boolean>) =>
    //       this.twClasses(styleSheet[key] as Record<string, boolean> (options));
    //   } else {
    //     result[key as keyof typeof styleSheet] = this.twClasses(
    //       styleSheet[key] as TModifiers
    //     );
    //   }
    // });

    return result as any;
  };
}
