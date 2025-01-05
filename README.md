# irem

![Build](https://github.com/canbax/irem/actions/workflows/test.yml/badge.svg) | ![Statements](https://img.shields.io/badge/statements-92.37%25-brightgreen.svg?style=flat)

Search for any city in any language in Earth.

## Usage

Works only in nodejs environment. Stores data in the folder named `data` in TSV file format or gzipped format or in binary format.

### Use [npm](https://www.npmjs.com/package/irem)

Run command `npm i irem`

### import ESM module

`import { getPlaceSuggestionsByText, getNearbyPlaces, getPlaceById } from 'irem';`

## Documentation

### function getPlaceSuggestionsByText

Returns a list of places based on search term in given language. if latitude and longitude is provided, the list is sorted by distance, otherwise sorted by text match. countryCode is a two letters string represents a country such as TR or US. If it's provided, results from the country will have precedence. maxResultCount is the size of returned array length. It should be in [0,100] range If language is undefined, results will be returned in English.

```
async function getPlaceSuggestionsByText(
  searchTerm: string,
  language?: SupportedLanguage,
  latitude?: number,
  longitude?: number,
  maxResultCount = 10,
  countryCode: CountryCode | "" = "",
): Promise<PlaceMatchWithCountry[]>
```

### function getNearbyPlaces

Returns a list of places based on provided `latitude` and `longitude` values in given language. The list is sorted by distance.
`maxResultCount` is the size of returned array length. It should be in [0,100] range

```
async function getNearbyPlaces(
  latitude: number,
  longitude: number,
  language?: SupportedLanguage,
  maxResultCount = 10,
): Promise<PlaceWithCountry[]>
```

### function getPlaceById

Returns a `PlaceWithCountry` object from provided id. Id must exist in `db.tsv` file

```
async function getPlaceById(placeId: number, language?: SupportedLanguage)
```
