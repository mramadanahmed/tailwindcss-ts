export type TWSStyle<
  TClasses extends string,
  TModifiers extends string,
  TScreen extends string = "",
> = TScreen extends ""
  ?
      | TClasses
      | TClasses[]
      | {
          [key in "default" | TModifiers]?: key extends "default"
            ? TClasses | TClasses[]
            : `${key}:${TClasses}` | `${key}:${TClasses}`[];
        }
  :
      | `${TScreen}:${TClasses}`
      | `${TScreen}:${TClasses}`[]
      | {
          [key in "default" | TModifiers]?: key extends "default"
            ? `${TScreen}:${TClasses}` | `${TScreen}:${TClasses}`[]
            :
                | `${TScreen}:${key}:${TClasses}`
                | `${TScreen}:${key}:${TClasses}`[];
        };

export type TWSStyleScreens<
  TClasses extends string,
  TModifiers extends string,
  TScreens extends string,
> = {
  [TScreen in TScreens]?: TWSStyle<TClasses, TModifiers, TScreen>;
};

export type TWSStyleObjectItem<
  TClasses extends string,
  TModifiers extends string,
  TScreens extends string,
> = Exclude<
  TWSStyleScreens<TClasses, TModifiers, TScreens> &
    TWSStyle<TClasses, TModifiers>,
  string
>;

export type TWSStyleObjectItemVariants<
  TClasses extends string,
  TModifiers extends string,
  TScreens extends string,
> = {
  variants?: Record<
    string,
    TClasses | TWSStyleObjectItem<TClasses, TModifiers, TScreens>
  >;
};

export type TWSStyleObject<
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

  twClasses = (classes: TWSStyleObject<TClasses, TModifiers, TScreens>) => {
    return Object.keys(classes)
      .filter((key) => key !== "variants")
      .map((key) => {
        const classesValue = classes[key as keyof typeof classes];
        if (typeof classesValue === "string") return classesValue;
        else if (Array.isArray(classesValue)) return classesValue.join(" ");
        else {
          const classesObj: string = this.twClasses(
            classesValue as TWSStyleObject<TClasses, TModifiers, TScreens>
          );

          return classesObj;
        }
      })
      .join(" ");
  };

  twStyleSheet: TWSStyleSheet<TClasses, TModifiers, TScreens> = (
    styleSheet
  ) => {
    const result: ReturnType<TWSStyleSheet<TClasses, TModifiers, TScreens>> =
      {} as any;

    Object.keys(styleSheet).forEach((key) => {
      if (typeof styleSheet[key] === "string") return styleSheet[key];
      if (Array.isArray(styleSheet[key])) {
        (result as any)[key] = this.twStyle(...(styleSheet[key] as TClasses[]));
      } else if (typeof styleSheet[key]["type"] === "undefined") {
        const defaultClasses = this.twClasses(
          styleSheet[key] as TWSStyleObject<TClasses, TModifiers, TScreens>
        );
        const variants = (
          styleSheet[key] as TWSStyleObjectItemVariants<
            TClasses,
            TModifiers,
            TScreens
          >
        )["variants"];
        if (typeof variants !== "undefined") {
          const variantsClasses = {} as any;
          Object.keys(variants).forEach((a) => {
            if (typeof variants[a] === "string")
              variantsClasses[a] = [defaultClasses, variants[a]].join(" ");
            else if (Array.isArray(variants[a]))
              variantsClasses[a] = [
                defaultClasses,
                this.twStyle(...(variants[a] as TClasses[])),
              ].join(" ");
            else {
              variantsClasses[a] = [
                defaultClasses,
                this.twClasses(
                  variants[a] as TWSStyleObject<TClasses, TModifiers, TScreens>
                ),
              ].join(" ");
            }
          });
          (result as any)[key] = variantsClasses;
        } else (result as any)[key] = defaultClasses;
      } else {
        // result[key as keyof typeof styleSheet] = this.twClasses(
        //   styleSheet[key] as TModifiers
        // );
      }
    });

    return result as any;
  };
}
