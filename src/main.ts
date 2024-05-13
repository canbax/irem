import {
  CountryCode,
  CountryData,
  SimpleCountry,
  SimplePlace,
  SupportedLanguage,
} from "./types";
import { readFileSync } from "fs";
import { isSupportedNonEnglishLanguage, sortPlaces } from "./util";

/** return a list of countries in given language. The list is sorted by distance from `baseLocation`
 * if `language` undefined, results will be returned in English. If `baseLocation` is undefined, the returned list will be sorted alphabetically
 * @param {?SupportedLanguage} [language]
 * @param {?[number, number]} [baseLocation]
 * @returns {SimpleCountry[]}
 */
export function getAllCountries(
  language?: SupportedLanguage,
  baseLocation?: [number, number],
): SimpleCountry[] {
  const data = readJSON(language);

  const countries: SimpleCountry[] = [];
  for (const code in data) {
    countries.push({
      code: code,
      englishName: data[code].n,
      name: data[code].t,
      gps: data[code].g,
    });
  }
  return sortPlaces(baseLocation, countries);
}

/**
 * return a list of regions/states/cities in given language. The list is sorted by distance from `baseLocation`
 * if `language` undefined, results will be returned in English. If `baseLocation` is undefined, the returned list will be sorted alphabetically
 * @param {CountryCode} countryCode
 * @param {?SupportedLanguage} [language]
 * @param {?[number, number]} [baseLocation]
 * @returns {SimplePlace[]}
 */
export function getAllRegionsOfCountry(
  countryCode: CountryCode,
  language?: SupportedLanguage,
  baseLocation?: [number, number],
): SimplePlace[] {
  const data = readJSON(language);
  const regions: SimplePlace[] = [];
  for (const regionNameInEnglish in data[countryCode][">"]) {
    regions.push({
      englishName: regionNameInEnglish,
      name: data[countryCode][">"][regionNameInEnglish].t,
      gps: data[countryCode][">"][regionNameInEnglish].g,
    });
  }
  return sortPlaces(baseLocation, regions);
}

/**
* return a list of regions/cities/districts in given language. The list is sorted by distance from `baseLocation`
 * if `language` undefined, results will be returned in English. If `baseLocation` is undefined, the returned list will be sorted alphabetically

 * @param {CountryCode} countryCode
 * @param {string} regionNameInEnglish
 * @param {?SupportedLanguage} [language]
 * @param {?[number, number]} [baseLocation]
 * @returns {SimplePlace[]}
 */
export function getAllCities(
  countryCode: CountryCode,
  regionNameInEnglish: string,
  language?: SupportedLanguage,
  baseLocation?: [number, number],
): SimplePlace[] {
  const data = readJSON(language);

  const cities: SimplePlace[] = [];
  for (const cityName in data[countryCode][">"][regionNameInEnglish][">"]) {
    cities.push({
      englishName: cityName,
      name: data[countryCode][">"][regionNameInEnglish][">"][cityName].t,
      gps: data[countryCode][">"][regionNameInEnglish].g,
    });
  }
  return sortPlaces(baseLocation, cities);
}

function readJSON(
  language?: SupportedLanguage,
  nonEnglishDataPath: string = "./data/",
  englishDataPath: string = "./data/",
): Record<CountryCode, CountryData> {
  const fileToRead = isSupportedNonEnglishLanguage(language)
    ? `${nonEnglishDataPath}GPS-data-${language}.json`
    : `${englishDataPath}GPS-data.json`;
  const data: Record<CountryCode, CountryData> = JSON.parse(
    readFileSync(fileToRead, "utf-8"),
  );
  return data;
}
