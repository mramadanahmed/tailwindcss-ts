export const extractValues = (
  preKeys: string[],
  configValue: ReturnType<typeof Object.entries>,
  allClasses: string[]
) => {
  configValue.forEach(([key, value]: any) => {
    if (typeof value === "string") {
      allClasses.push(`${preKeys.join("-")}-${key}`);
    } else {
      extractValues([...preKeys, key], Object.entries(value), allClasses);
    }
  });
};
