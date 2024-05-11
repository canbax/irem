import {
  CountryCode,
  CountryData,
  SimpleCountry,
  SimplePlace,
  SupportedLanguage,
} from "./types";
import { readFileSync } from "fs";
import { isSupportedNonEnglishLanguage, sortPlaces } from "./util";

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
