import { SupportedLanguage } from "./types.js";

/** E.g. `getAllCities("TR", "Ankara", "tr")`.
 * Returns a list of regions/cities/districts in given language. The list is sorted by distance from `baseLocation`
 * if `language` undefined, results will be returned in English. If `baseLocation` is undefined, the returned list will be sorted alphabetically
 * @param {string} searchTerm
 * @param {?SupportedLanguage} [language]
 * @param {?[number, number]} [baseLocation]
 */
export function searchCities(
  searchTerm: string,
  language?: SupportedLanguage,
  baseLocation?: [number, number],
) {
  return "" + searchTerm + language + baseLocation;
  // const data = readJSON(language);
  // const cities: SimplePlace[] = [];
  // for (const cityName in data[countryCode][">"][regionNameInEnglish][">"]) {
  //   cities.push({
  //     englishName: cityName,
  //     name: data[countryCode][">"][regionNameInEnglish][">"][cityName].t,
  //     gps: data[countryCode][">"][regionNameInEnglish].g,
  //   });
  // }
  // return sortPlaces(baseLocation, cities);
}
