import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
  //   ignores: ["docs/*", "dist/*", "node_modules/*"],
  files: ["**/*.js", "**/*.ts", "**/*.cjs", "**/*.mjs"],
  extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
});
