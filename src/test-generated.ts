import { twStyleSheet } from "./tws";

// test
const result = twStyleSheet({
  h0: ["!-bottom-0"], // ["!-bottom-36"],
  h1: ["text-red-100"],
  title: {
    default: ["text-3xl", "text-3xl"],
    focus: ["focus:!-bottom-0"],
    variants: {
      primary: ["p-10", "!-ml-36", "!-bottom-11"],
      secondary: ["p-12"],
    },
  },
  title2: {
    "2xl": ["2xl:!-bottom-1"],
    md: ["md:p-1"],
    xl: ["xl:text-2xl", "xl:!-bottom-0"],
  },
  title3: {
    default: ["!-bottom-0"],
    xl: {
      default: ["xl:text-amber-100"],
      focus: ["xl:focus:p-1.5"],
    },
  },
  subtitle: {
    type: "callback",
    callbackParameters: { disabled: "" },
    callback({ disabled }) {
      return {
        default: [
          {
            test: disabled,
            value: ["!-bottom-1", "!-bottom-1", "!-bottom-1/3"],
          },
        ],
      };
    },
  },
  subtitle2: {
    type: "callback",
    callbackParameters: { disabled: "", active: "" },
    callback: ({ disabled, active }) => {
      return {
        default: [{ test: active, value: ["!-bottom-1"] }],
        variants: {
          primary: [{ test: active, value: ["!-bottom-1.5"] }],
          secondary: [
            {
              test: disabled,
              value: {
                default: ["text-2xl"],
              },
            },
          ],
        },
      };
    },
  },
});

const x1 = result.h0;
const x2 = result.title["secondary"];
const x3 = result.title["primary"];
const x33 = result.subtitle({ disabled: true });
const x4 = result.subtitle2["secondary"]({ disabled: true, active: true });
const x5 = result.subtitle2["primary"]({ disabled: true, active: true });

console.log("test", {
  x1,
});
