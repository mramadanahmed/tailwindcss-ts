import {
  TWSStyle,
  TWSStyleScreens,
  TWSStyleObjectItem,
  TWSStyleObjectItemVariants,
} from "../index";

type TWSClasses = "class1" | "class2" | "class3";
type TWSModifiers = "mod1" | "mod2";
type TWSScreens = "sc1" | "sc2";

describe("types-test", () => {
  it("test TWSStyle with default", () => {
    const x: TWSStyle<TWSClasses, TWSModifiers | "default", ""> = {
      default: ["class1"],
      mod1: ["mod1:class1", "mod1:class2"],
    };

    expect(x).toEqual({
      default: ["class1"],
      mod1: ["mod1:class1"],
    });
  });

  it("test TWSStyle without default", () => {
    const x: TWSStyle<TWSClasses, TWSModifiers, ""> = {
      mod1: ["mod1:class1", "mod1:class2"],
      mod2: ["mod2:class1"],
    };

    expect(x).toEqual({
      default: ["class1"],
      mod1: ["mod1:class1"],
    });
  });

  it("test TWSStyleScreens", () => {
    const x: TWSStyleScreens<TWSClasses, TWSModifiers, TWSScreens> = {
      sc1: ["sc1:class1", "sc1:class2"],
      sc2: {
        default: ["sc2:class1"],
        mod2: ["sc2:mod2:class1"],
        mod1: ["sc2:mod1:class1", "sc2:mod1:class1"],
      },
    };

    expect(x).toEqual({
      sc1: ["sc1:class1"],
      sc2: { default: ["sc2:class1"], mod1: ["sc2:mod1:class1"] },
    });
  });

  it("test TWSStyleObjectItem", () => {
    const x: TWSStyleObjectItem<TWSClasses, TWSModifiers, TWSScreens> = {
      default: ["class1", "class1", "class3"],
      mod1: ["mod1:class1"],
      mod2: ["mod2:class1"],
      sc1: ["sc1:class1"],
      sc2: {
        default: ["sc2:class1"],
        mod1: ["sc2:mod1:class1"],
      },
    };

    expect(x).toEqual({
      default: ["class1", "class1", "class3"],
      mod1: ["mod1:class1"],
      mod2: ["mod2:class1"],
    });
  });

  it("test TWSStyleObjectItemVariants", () => {
    const x: TWSStyleObjectItemVariants<TWSClasses, TWSScreens, TWSModifiers> =
      {
        variants: {
          test: {
            sc1: ["sc1:class1"],
          },
        },
      };

    expect(x).toEqual({
      variants: {
        test: {
          mod1: ["mod1:class1"],
          mod2: ["mod2:class1"],
          sc1: "sc1:class1",
          sc2: {
            mod1: ["sc2:mod1:class1"],
            mod2: ["sc2:mod2:class1"],
          },
        },
      },
    });
  });
});
