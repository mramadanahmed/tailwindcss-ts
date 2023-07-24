import { GeneratorFn } from "../utils/types";

export const generatePosition: GeneratorFn = (_) => {
  return ["static", "fixed", "absolute", "relative", "sticky"];
};
