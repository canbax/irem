/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    fileParallelism: false,
    coverage: {
      exclude: [
        "*.config.js",
        "*.config.ts",
        "src/types.ts",
        "test",
        "dist",
        "*.spec.ts",
        "**/*.spec.ts",
      ],
      reporter: ["json-summary"],
    },
  },
});
