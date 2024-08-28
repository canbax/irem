# irem

![Build](https://github.com/canbax/irem/actions/workflows/test.yml/badge.svg) | ![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat)

Search for any city in any language in Earth.

## Usage

### Use [npm](https://www.npmjs.com/package/irem)

Run command `npm i irem`

### import ESM module

`import { getAllCountries, getAllRegionsOfCountry, getAllCities } from 'irem';`

## TypeScript Types

### `SupportedLanguage`

A type representing supported languages. This can be one of the predefined language codes or any string.

- **Possible values:**
  - `"ar"` - Arabic
  - `"az"` - Azerbaijani
  - `"de"` - German
  - `"es"` - Spanish
  - `"en"` - English
  - `"fa"` - Persian
  - `"fr"` - French
  - `"id"` - Indonesian
  - `"it"` - Italian
  - `"kk"` - Kazakh
  - `"ko"` - Korean
  - `"ky"` - Kyrgyz
  - `"ms"` - Malay
  - `"ru"` - Russian
  - `"tr"` - Turkish
  - `"zh"` - Chinese

### `SimpleCountry`

An interface that extends `SimplePlace` to include a country code.

- **Properties:**
  - `code`: `CountryCode` - The code of the country.
  - Inherits all properties from `SimplePlace`.

### `SimplePlace`

A type representing a place with an English name, a localized name, and GPS coordinates.

- **Properties:**
  - `englishName`: `string` - The English name of the place.
  - `name`: `string` - The localized name of the place.
  - `gps`: `[number, number]` - The GPS coordinates `[latitude, longitude]` of the place.

## API functions

### `getAllCountries`

Returns a list of countries in the specified language. If `language` is not provided, the results will be in English. The list is sorted by distance from `baseLocation`, or alphabetically if `baseLocation` is not provided.

- **Parameters:**

  - `language` (optional): `SupportedLanguage` - The language code for the returned country names.
  - `baseLocation` (optional): `[number, number]` - The base GPS coordinates `[latitude, longitude]` to sort the countries by distance.

- **Returns:** `SimpleCountry[]` - An array of countries.

### `getAllRegionsOfCountry`

Returns a list of regions, states, or cities within a specified country in the given language. If `language` is not provided, the results will be in English. The list is sorted by distance from `baseLocation`, or alphabetically if `baseLocation` is not provided.

- **Parameters:**

  - `countryCode`: `CountryCode` - The country code for which to get the regions.
  - `language` (optional): `SupportedLanguage` - The language code for the returned region names.
  - `baseLocation` (optional): `[number, number]` - The base GPS coordinates `[latitude, longitude]` to sort the regions by distance.

- **Returns:** `SimplePlace[]` - An array of regions, states, or cities.

### `getAllCities`

Returns a list of cities or districts within a specified region in a given country and language. If `language` is not provided, the results will be in English. The list is sorted by distance from `baseLocation`, or alphabetically if `baseLocation` is not provided.

- **Parameters:**

  - `countryCode`: `CountryCode` - The country code for which to get the cities.
  - `regionNameInEnglish`: `string` - The English name of the region for which to get the cities.
  - `language` (optional): `SupportedLanguage` - The language code for the returned city names.
  - `baseLocation` (optional): `[number, number]` - The base GPS coordinates `[latitude, longitude]` to sort the cities by distance.

- **Returns:** `SimplePlace[]` - An array of cities or districts.

### `setDataFolderPath`

Sets the path for the data files. The default folder path is `./data/`.

- **Parameters:**
  - `folderPath`: `string` - The new folder path for the data files.

### `setDataFolderPathToDefault`

Resets the folder path to the default value: `./data/`.

### `getDataFolderPath`

Returns the current folder path for the data files. If no custom path is set, it returns the default path `./data/`.

- **Returns:** `string` - The current data folder path.
