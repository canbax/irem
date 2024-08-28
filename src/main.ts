import { Trie } from "./trie.js";
import {
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
} from "./util.js";

const trie = new Trie();
await trie.loadFromJson(TRIE_FILE);

/**
 * Returns a list of places based on search term in given language. if `latitude` and `longitude` is provided, the list is sorted by distance, otherwise sorted by text match.
 * If `language` undefined, results will be returned in English.
 * @export
 * @async
 * @param {string} searchTerm
 * @param {?SupportedLanguage} [language]
 * @param {?number} [latitude]
 * @param {?number} [longitude]
 * @returns {Promise<PlaceMatchWithCountry[]>}
 */
export async function getPlaceSuggestionsByText(
  searchTerm: string,
  language?: SupportedLanguage,
  latitude?: number,
  longitude?: number,
): Promise<PlaceMatchWithCountry[]> {
  const results = await getAutocompleteResults(searchTerm, trie);
  sortPlaces(results, latitude, longitude);
  // enrich results with country name
  return enrichPlaceMatchesWithCountryName(results, language);
}

/**
 * Returns a list of places based on provided `latitude` and `longitude` values in given language. The list is sorted by distance.
 *
 * @export
 * @async
 * @param {number} latitude
 * @param {number} longitude
 * @param {?SupportedLanguage} [language]
 * @returns {Promise<PlaceWithCountry[]>}
 */
export async function getNearbyPlaces(
  latitude: number,
  longitude: number,
  language?: SupportedLanguage,
): Promise<PlaceWithCountry[]> {
  const results = await gridSearchByGPS(latitude, longitude);
  return enrichPlaceMatchesWithCountryName(results, language);
}
