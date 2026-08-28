import { defineConfig } from "vitest/config";
import { readFileSync } from "node:fs";
import * as path from "node:path";

export default defineConfig({
  test: {
    globals: true,
    pool: "forks",
    fileParallelism: false,
    reporters: ["default"],
    include: ["test/**/*.test.ts"],
    execArgv: ["--env-file=.env"],
  },
});
