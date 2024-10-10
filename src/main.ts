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
  getValidResultCount,
  readLinesFromTSV,
  TSV_DB_FILE,
} from "./util.js";

const trie = new Trie();
await trie.loadFromJson(TRIE_FILE);

/**
 * Returns a list of places based on search term in given language. if `latitude` and `longitude` is provided, the list is sorted by distance, otherwise sorted by text match.
 * If `language` undefined, results will be returned in English.
 */
export async function getPlaceSuggestionsByText(
  searchTerm: string,
  language?: SupportedLanguage,
  latitude?: number,
  longitude?: number,
  maxResultCount = 10,
): Promise<PlaceMatchWithCountry[]> {
  const results = await getAutocompleteResults(
    searchTerm,
    trie,
    getValidResultCount(maxResultCount),
  );
  sortPlaces(results, latitude, longitude);
  // enrich results with country name
  return enrichPlaceMatchesWithCountryName(results, language);
}

/**
 * Returns a list of places based on provided `latitude` and `longitude` values in given language. The list is sorted by distance.
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
