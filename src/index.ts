import uniq from "lodash/uniq";

export type TWSStyle<
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
> = TWSStyleScreens<TClasses, TModifiers, TScreens> &
  TWSStyle<TClasses, TModifiers>;

export type TWSStyleObjectItemVariants<
  TClasses extends string,
  TModifiers extends string,
  TScreens extends string,
> = {
  variants?: Record<string, TWSStyleObjectItem<TClasses, TModifiers, TScreens>>;
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
    ? (options: {
        [key in keyof T["callbackParameters"]]: boolean;
      }) => { [aKey in keyof ReturnType<T["callback"]>["variants"]]: string }
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
  twClasses = (classes: TWSStyleObjectItem<TClasses, TModifiers, TScreens>) => {
    if (Array.isArray(classes)) return classes;

    const result: TClasses[] = Object.keys(classes)
      .filter((key) => key !== "variants")
      .flatMap((key) => {
        const classesValue = classes[key as keyof typeof classes];
        if (!classesValue) return [];
        if (Array.isArray(classesValue)) return classesValue as TClasses[];
        else {
          return this.twClasses(classesValue);
        }
      });

    return result;
  };

  twClassesArrayToString = (classes: TClasses[]) =>
    uniq(classes).sort().join(" ");

  twStyleSheet: TWSStyleSheet<TClasses, TModifiers, TScreens> = (
    styleSheet
  ) => {
    const result: ReturnType<TWSStyleSheet<TClasses, TModifiers, TScreens>> =
      {};

    Object.keys(styleSheet).forEach((key) => {
      if (typeof styleSheet[key]["type"] === "undefined") {
        const defaultClasses = this.twClasses(
          styleSheet[key] as TWSStyleObjectItem<TClasses, TModifiers, TScreens>
        );
        const variants = (
          styleSheet[key] as TWSStyleObjectItemVariants<
            TClasses,
            TModifiers,
            TScreens
          >
        )["variants"];
        if (typeof variants !== "undefined") {
          const variantsClasses: Record<string, string> = {};
          Object.keys(variants).forEach((a) => {
            variantsClasses[a] = this.twClassesArrayToString([
              ...defaultClasses,
              ...this.twClasses(
                variants[a] as TWSStyleObject<TClasses, TModifiers, TScreens>
              ),
            ]);
          });
          (result as any)[key] = variantsClasses;
        } else {
          (result as any)[key] = this.twClassesArrayToString(defaultClasses);
        }
      } else {
        const conditionalKey = styleSheet[key] as TWSConditional<
          TClasses,
          TModifiers,
          TScreens
        >;
        const defaultClasses = (options: any) => {
          let returnVal = {} as any;
          const result = conditionalKey["callback"](options);
          const defaultClasses = result.default
            .filter((a) => a.test)
            .flatMap((a) =>
              this.twClasses(
                a.value as TWSStyleObject<TClasses, TModifiers, TScreens>
              )
            );

          if (typeof result.variants !== "undefined") {
            Object.keys(result.variants).forEach((key) => {
              returnVal[key] = result.variants?.[key]
                .filter((a: any) => a.test)
                .flatMap((a: any) => {
                  return this.twClasses(
                    a.value as TWSStyleObject<TClasses, TModifiers, TScreens>
                  );
                });

              returnVal[key] = this.twClassesArrayToString([
                ...defaultClasses,
                ...returnVal[key],
              ]);
            });
          } else {
            returnVal = this.twClassesArrayToString(defaultClasses);
          }

          return returnVal;
        };

        (result as any)[key] = defaultClasses;
      }
    });

    return result as any;
  };
}
