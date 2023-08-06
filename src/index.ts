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
  callback: (options: {
    [key: string]: boolean;
  }) => TWSStyleObjectItemWithRules<TClasses, TModifiers, TScreens>;
};

export type TWSConditionalRules<
  TClasses extends string,
  TModifiers extends string,
  TScreens extends string,
> = {
  rules?: {
    test: boolean;
    value: TWSStyleObjectItem<TClasses, TModifiers, TScreens>;
  }[];
};

export type TWSStyleObjectItemWithRules<
  TClasses extends string,
  TModifiers extends string,
  TScreens extends string,
> = TWSStyleObjectItem<TClasses, TModifiers, TScreens> &
  TWSConditionalRules<TClasses, TModifiers, TScreens> & {
    variants?: Record<
      string,
      TWSConditionalRules<TClasses, TModifiers, TScreens> &
        TWSStyleObjectItem<TClasses, TModifiers, TScreens>
    >;
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
  private twClasses = (
    classes: TWSStyleObjectItem<TClasses, TModifiers, TScreens>
  ) => {
    if (Array.isArray(classes)) return classes;

    const result: TClasses[] = Object.keys(classes)
      .filter((key) => key !== "variants" && key !== "rules")
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

  private twClassesArrayToString = (classes: TClasses[]) =>
    uniq(classes).sort().join(" ");

  private twCalculateClasses = (
    item: TWSStyleObject<TClasses, TModifiers, TScreens>
  ) => {
    let result: Record<string, TClasses[]> | TClasses[] = {};

    const defaultClasses = this.twClasses(item);
    const variants = item["variants"];
    if (typeof variants !== "undefined") {
      const variantsClasses: Record<string, TClasses[]> = {};
      Object.keys(variants).forEach((a) => {
        variantsClasses[a] = [
          ...defaultClasses,
          ...this.twClasses(
            variants[a] as TWSStyleObject<TClasses, TModifiers, TScreens>
          ),
        ];
      });
      result = variantsClasses;
    } else {
      result = defaultClasses;
    }

    return result;
  };

  twStyleSheet: TWSStyleSheet<TClasses, TModifiers, TScreens> = (
    styleSheet
  ) => {
    const result: ReturnType<TWSStyleSheet<TClasses, TModifiers, TScreens>> =
      {};

    Object.keys(styleSheet).forEach((key) => {
      if (typeof styleSheet[key]["type"] === "undefined") {
        const classesList = this.twCalculateClasses(
          styleSheet[key] as TWSStyleObject<TClasses, TModifiers, TScreens>
        );

        if (Array.isArray(classesList)) {
          (result as any)[key] = this.twClassesArrayToString(classesList);
        } else {
          const variantsObject = {};
          Object.keys(classesList).forEach(
            (variant) =>
              ((variantsObject as any)[variant] = this.twClassesArrayToString(
                classesList[variant]
              ))
          );
          (result as any)[key] = variantsObject;
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
          const defaultClasses = this.twCalculateClasses(
            result as TWSStyleObject<TClasses, TModifiers, TScreens>
          );
          const defaultRulesClasses = (result.rules ?? [])
            .map((a) => {
              if (typeof a.test !== "boolean") {
                throw new Error(
                  `tws conditional rules test property should be boolean value. At ${JSON.stringify(
                    a
                  )}`
                );
              }
              return a;
            })
            .filter((a) => a.test)
            .flatMap((a) =>
              this.twClasses(
                a.value as TWSStyleObject<TClasses, TModifiers, TScreens>
              )
            );

          if (typeof result.variants !== "undefined") {
            Object.keys(result.variants).forEach((key) => {
              returnVal[key] = (result.variants?.[key].rules ?? [])
                .map((a) => {
                  if (typeof a.test !== "boolean") {
                    throw new Error(
                      `tws conditional rules test property should be boolean value. At ${JSON.stringify(
                        a
                      )}`
                    );
                  }
                  return a;
                })
                .filter((a: any) => a.test)
                .flatMap((a: any) => {
                  const classes = this.twClasses(
                    a.value as TWSStyleObject<TClasses, TModifiers, TScreens>
                  );
                  return [
                    ...classes,
                    ...defaultRulesClasses,
                    ...(defaultClasses as any)[key],
                  ];
                });

              returnVal[key] = this.twClassesArrayToString(returnVal[key]);
            });
          } else {
            returnVal = this.twClassesArrayToString([
              ...(defaultClasses as TClasses[]),
              ...defaultRulesClasses,
            ]);
          }

          return returnVal;
        };

        (result as any)[key] = defaultClasses;
      }
    });

    return result as any;
  };
}
