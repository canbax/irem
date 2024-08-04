import { Trie } from "./trie.js";
import { SupportedLanguage } from "./types.js";
import { getAutocompleteResults, sortPlaces, TRIE_FILE } from "./util.js";

const trie = new Trie();
await trie.loadFromJson(TRIE_FILE);

/** Returns a list of places in given language. if `latitude` and `longitude` is provided, the list is sorted by distance, otherwise text matching.
 * If `language` undefined, results will be returned in English.
 * @param {string} searchTerm
 * @param {?SupportedLanguage} [language]
 * @param {?[number, number]} [baseLocation]
 */
export async function searchPlaces(
  searchTerm: string,
  language?: SupportedLanguage,
  latitude?: number,
  longitude?: number,
) {
  const results = await getAutocompleteResults(searchTerm, trie);
  sortPlaces(results, latitude, longitude);
  // enrich results with country name
  return results;

  // return "" + searchTerm + language + baseLocation;
}
