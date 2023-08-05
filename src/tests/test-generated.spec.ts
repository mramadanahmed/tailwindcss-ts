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
        default: "class1",
        sc1: ["sc1:class1", "sc1:class2"],
        variants: {
          primary: {
            sc2: {
              default: "sc2:class3",
            },
            mod1: "mod1:class1",
          },
          secondary: ["class3"],
        },
      },
    });

    const primaryTitle = styleSheet.title["primary"];
    const secondaryTitle = styleSheet.title["secondary"];

    expect(primaryTitle).toBe(
      "class1 sc1:class1 sc1:class2 sc2:class3 mod1:class1"
    );

    expect(secondaryTitle).toBe("class1 sc1:class1 sc1:class2 class3");
  });

  // it("variant values call back to return successfully", () => {
  //   const subtitle = result.subtitle({ disabled: true });

  //   expect(subtitle).toBe("class3");
  // });
});

//
// const x4 = result.subtitle2["secondary"]({ disabled: true, active: true });
// const x5 = result.subtitle2["primary"]({ disabled: true, active: true });

// const result = twStyleSheet({
//   h0: ["class1", "class2", "class3"],
//   h1: ["class1", "class2"],
//   title: {
//     default: ["class1"],
//     mod1: ["mod1:class1"],
//     variants: {
//       primary: ["class2"],
//       secondary: ["class3"],
//     },
//   },
//   title2: {
//     sc1: ["sc1:class1"],
//     sc2: ["sc2:class2"],
//   },
//   title3: {
//     default: ["class1"],
//     sc1: {
//       default: ["sc1:class2"],
//       mod1: ["sc1:mod1:class2"],
//     },
//   },
//   subtitle: {
//     type: "callback",
//     callbackParameters: { disabled: "" },
//     callback({ disabled }) {
//       return {
//         default: [
//           {
//             test: disabled,
//             value: ["class1"],
//           },
//         ],
//       };
//     },
//   },
//   subtitle2: {
//     type: "callback",
//     callbackParameters: { disabled: "", active: "" },
//     callback: ({ disabled, active }) => {
//       return {
//         default: [{ test: active, value: ["class2"] }],
//         variants: {
//           primary: [{ test: active, value: ["class2"] }],
//           secondary: [
//             {
//               test: disabled,
//               value: {
//                 default: ["class3"],
//               },
//             },
//           ],
//         },
//       };
//     },
//   },
// });
