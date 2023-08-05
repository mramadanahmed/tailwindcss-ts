import { TWSFactory } from "../index";

type TWSClasses = "class1" | "class2" | "class3";
type TWSModifiers = "mod1" | "mod2";
type TWSScreens = "sc1" | "sc2";

export type TWSStyleSheet = {
  [key: string]: TWSClasses[] | TWSModifiers;
};

const twsInstance = new TWSFactory<TWSClasses, TWSModifiers, TWSScreens>();

export const { twStyleSheet } = twsInstance;

describe("test-generated-tailwind", () => {
  it("simple array classes test", () => {
    const styleSheet = twStyleSheet({
      title: ["class1", "class2", "class3"],
    });
    const result = styleSheet.title;
    expect(result).toBe("class1 class2 class3");
  });

  it("simple default style object test", () => {
    const styleSheet = twStyleSheet({
      title: {
        default: ["class1"],
        mod1: ["mod1:class2"],
      },
    });
    const result = styleSheet.title;
    expect(result).toBe("class1 mod1:class2");
  });

  it("variant values to be exist", () => {
    const styleSheet = twStyleSheet({
      title: {
        default: ["class1"],
        sc1: ["sc1:class1", "sc1:class2"],
        variants: {
          primary: {
            sc2: {
              default: ["sc2:class3"],
            },
            mod1: ["mod1:class1"],
          },
          secondary: ["class3", "class2"],
          third: ["class3"],
        },
      },
    });

    const primaryTitle = styleSheet.title["primary"];
    const secondaryTitle = styleSheet.title["secondary"];
    const thirdTitle = styleSheet.title["third"];

    expect(primaryTitle).toBe(
      "class1 mod1:class1 sc1:class1 sc1:class2 sc2:class3"
    );

    expect(secondaryTitle).toBe("class1 class2 class3 sc1:class1 sc1:class2");
    expect(thirdTitle).toBe("class1 class3 sc1:class1 sc1:class2");
  });

  it("call back to return successfully", () => {
    const styleSheet = twStyleSheet({
      subtitle: {
        type: "callback",
        callbackParameters: { disabled: "" },
        callback: ({ disabled }) => {
          return {
            default: [
              { test: disabled, value: ["class1"] },
              { test: !disabled, value: ["class2"] },
            ],
          };
        },
      },
    });

    expect(styleSheet.subtitle({ disabled: true })).toBe("class1");
    expect(styleSheet.subtitle({ disabled: false })).toBe("class2");
  });

  it("variant values call back to return successfully", () => {
    const styleSheet = twStyleSheet({
      subtitle: {
        type: "callback",
        callbackParameters: { disabled: "" },
        callback: ({ disabled }) => {
          return {
            default: [{ test: disabled, value: ["class1"] }],
            variants: {
              primary: [
                { test: disabled, value: ["class2"] },
                { test: !disabled, value: ["class3"] },
              ],
              secondary: [{ test: disabled, value: ["class3"] }],
            },
          };
        },
      },
    });

    expect(styleSheet.subtitle({ disabled: true })["primary"]).toBe(
      "class1 class2"
    );
    expect(styleSheet.subtitle({ disabled: false })["primary"]).toBe("class3");
    expect(styleSheet.subtitle({ disabled: true })["secondary"]).toBe(
      "class1 class3"
    );
    expect(styleSheet.subtitle({ disabled: false })["secondary"]).toBe("");
  });
});
