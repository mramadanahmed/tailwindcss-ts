import fs from "fs";
import path from "path";

const distFolder = "./dist";
const filesToKeep = [
  "bin/code-template/generated-types.ts",
  "bin/code-template/index.ts",
  "bin/generate.cjs",
  "bin/generate.d.ts",
  "index.d.ts",
  "index.js",
].map((file) => path.resolve(distFolder, file));
const dirs = [];

const cleanDir = (dir) => {
  const allFiles = fs.readdirSync(dir, {
    withFileTypes: true,
  });

  allFiles.forEach((file) => {
    const filePath = path.resolve(dir, file.name);
    if (file.isDirectory()) {
      dirs.push(filePath);
      cleanDir(filePath);
    } else {
      if (!filesToKeep.includes(filePath)) {
        fs.rmSync(filePath);
      }
    }
  });
};

cleanDir(distFolder);
dirs
  .sort()
  .reverse()
  .forEach((dir) => {
    if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0)
      fs.rmSync(dir, {
        recursive: true,
      });
  });
