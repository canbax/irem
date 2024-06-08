/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    coverage: {
      exclude: ["*.config.js", "src/types.ts"],
      reporter: ["json-summary"],
    },
  },
});
