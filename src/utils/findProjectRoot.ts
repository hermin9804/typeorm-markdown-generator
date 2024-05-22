// src/utils/findProjectRoot.ts
import { promises as fs } from "fs";
import * as path from "path";

export const findProjectRoot = async (): Promise<string | undefined> => {
  let currentDir = process.cwd();

  while (true) {
    const pkgPath = path.join(currentDir, "package.json");

    try {
      await fs.access(pkgPath);
      return currentDir;
    } catch (err) {
      const parentDir = path.dirname(currentDir);

      if (parentDir === currentDir) {
        // Reached the root directory
        return undefined;
      }

      currentDir = parentDir;
    }
  }
};

export default findProjectRoot;
