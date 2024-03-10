# irem

Multi-lingual country, region, city, and GPS data of whole world in hierarchical structure.

## Usage

### Use [npm](https://www.npmjs.com/package/irem)

Run command `npm i irem`

### import ESM module

`import { yourLibFunction } from 'irem';`

### import CommonJS module

```
const lib = require("irem");
console.log(lib.yourLibFunction(1, 2);
```

### import UMD module

Add `<script src="https://unpkg.com/irem/dist/irem.umd.js"></script>` to your HTML file.

Then you can call API functions like `lib.yourLibFunction(1, 2)`

## Development

- `npm run build` to generate production build distribution files.
- `npm run dev` to generate build files as you develop
- `npm run test` to run unit tests

## API

### `function yourLibFunction(a: number, b: number): number`

- returns sum of 2 numbers
