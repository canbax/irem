import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

const isProduction = process.env.NODE_ENV === "production";

export default [
  // browser-friendly UMD build
  {
    input: "src/main.ts",
    output: {
      name: "yourLibrary",
      file: "dist/your-library.umd.js",
      format: "umd",
    },
    plugins: [
      commonjs(), // so Rollup can convert `ms` to an ES module
      typescript({ module: "esnext", tsconfig: "./tsconfig.json" }), // so Rollup can convert TypeScript to JavaScript
      isProduction && terser(),
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "src/main.ts",
    external: ["ms"],
    plugins: [
      typescript({ module: "esnext", tsconfig: "./tsconfig.json" }), // so Rollup can convert TypeScript to JavaScript
      isProduction && terser(),
    ],
    output: [
      { file: "dist/your-library.cjs.js", format: "cjs" },
      { file: "dist/your-library.esm.js", format: "es" },
    ],
  },
];
