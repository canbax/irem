import { SimplePlace, SupportedLanguage } from "./types";

export const supportedNonEnglishLanguages: SupportedLanguage[] = [
  "ar",
  "az",
  "de",
  "es",
  "fa",
  "fr",
  "id",
  "it",
  "kk",
  "ko",
  "ky",
  "ms",
  "ru",
  "tr",
  "zh",
] as const;

export function isSupportedNonEnglishLanguage(language?: SupportedLanguage) {
  if (!language) return false;
  return supportedNonEnglishLanguages.includes(language.toLowerCase());
}

export function sortPlacesByDistance<T extends SimplePlace>(
  baseLocation: [number, number],
  places: T[],
) {
  const dist2 = (a: [number, number], b: [number, number]) => {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
  };
  return places.sort((a: SimplePlace, b: SimplePlace) => {
    const distA = dist2(baseLocation, a.gps);
    const distB = dist2(baseLocation, b.gps);
    return distA - distB;
  });
}

/**
 * sorts places according to distance from baseLocation or sorts alphabetically
 * @template {SimplePlace} T
 * @param {([number, number] | undefined)} baseLocation
 * @param {T[]} places
 * @returns sorted list of places
 */
export function sortPlaces<T extends SimplePlace>(
  baseLocation: [number, number] | undefined,
  places: T[],
) {
  if (!baseLocation) {
    return places.sort((a, b) => a.englishName.localeCompare(b.englishName));
  }
  const dist2 = (a: [number, number], b: [number, number]) => {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
  };
  return places.sort((a: SimplePlace, b: SimplePlace) => {
    const distA = dist2(baseLocation, a.gps);
    const distB = dist2(baseLocation, b.gps);
    return distA - distB;
  });
}
