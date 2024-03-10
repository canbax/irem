import { SupportedLanguage } from "./types";

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
