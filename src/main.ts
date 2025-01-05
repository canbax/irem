import { Trie } from "./trie.js";
import {
  CountryCode,
  PlaceMatchWithCountry,
  PlaceWithCountry,
  SupportedLanguage,
} from "./types.js";
import {
  gridSearchByGPS,
  enrichPlaceMatchesWithCountryName,
  getAutocompleteResults,
  sortPlaces,
  TRIE_FILE,
  getValidResultCount,
  readLinesFromTSV,
  TSV_DB_FILE,
} from "./util.js";

const trie = new Trie();
await trie.loadFromJson(TRIE_FILE);

/**
 * Returns a list of places based on search term in given language. if `latitude` and `longitude` is provided, the list is sorted by distance, otherwise sorted by text match.
 * `countryCode` is a two letters string represents a country such as `TR` or `US`. If it's provided, results from the country will have precedence.
 * `maxResultCount` is the size of returned array length. It should be in [0,100] range
 * If `language` is undefined, results will be returned in English.
 * @export
 * @async
 * @param {string} searchTerm
 * @param {?SupportedLanguage} [language]
 * @param {?number} [latitude]
 * @param {?number} [longitude]
 * @param {number} [maxResultCount=10]
 * @param {(CountryCode | "")} [countryCode=""]
 * @returns {Promise<PlaceMatchWithCountry[]>}
 */
export async function getPlaceSuggestionsByText(
  searchTerm: string,
  language?: SupportedLanguage,
  latitude?: number,
  longitude?: number,
  maxResultCount = 10,
  countryCode: CountryCode | "" = "",
): Promise<PlaceMatchWithCountry[]> {
  const results = await getAutocompleteResults(searchTerm, trie, 1000);
  sortPlaces(results, latitude, longitude, countryCode);
  const returnCount = getValidResultCount(maxResultCount);
  const cappedResults = results.slice(0, returnCount);
  // enrich results with country name
  return enrichPlaceMatchesWithCountryName(cappedResults, language);
}

/**
 * * Returns a list of places based on provided `latitude` and `longitude` values in given language. The list is sorted by distance.
 * `maxResultCount` is the size of returned array length. It should be in [0,100] range
 * @export
 * @async
 * @param {number} latitude
 * @param {number} longitude
 * @param {?SupportedLanguage} [language]
 * @param {number} [maxResultCount=10]
 * @returns {Promise<PlaceWithCountry[]>}
 */
export async function getNearbyPlaces(
  latitude: number,
  longitude: number,
  language?: SupportedLanguage,
  maxResultCount = 10,
): Promise<PlaceWithCountry[]> {
  const results = await gridSearchByGPS(
    latitude,
    longitude,
    getValidResultCount(maxResultCount),
  );
  return enrichPlaceMatchesWithCountryName(results, language);
}

/**
 * Returns a `PlaceWithCountry` object from provided id. Id must exist in `db.tsv` file
 *
 * @async
 * @param {number} placeId
 * @param {?SupportedLanguage} [language]
 * @returns {unknown}
 */
export async function getPlaceById(
  placeId: number,
  language?: SupportedLanguage,
) {
  const results = await readLinesFromTSV(TSV_DB_FILE, [placeId]);
  const enriched = enrichPlaceMatchesWithCountryName(results, language);
  if (enriched.length !== 1) {
    return undefined;
  }
  return enriched[0];
}
