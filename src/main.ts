import {
  CountryCode,
  CountryData,
  SimpleCountry,
  SimplePlace,
  SupportedLanguage,
} from "./types";
import { readFileSync } from "fs";
import { isSupportedNonEnglishLanguage } from "./util";

export async function getAllCountries(
  language?: SupportedLanguage,
): Promise<SimpleCountry[]> {
  const t1 = new Date().getTime();
  const data = await readJSON(language);
  const t2 = new Date().getTime();
  console.log((t2 - t1) / 1000, " seconds passed ");

  const countries: SimpleCountry[] = [];
  for (const code in data) {
    countries.push({
      code: code,
      englishName: data[code].n,
      name: data[code].t,
    });
  }
  console.log("typeof ", typeof countries);
  return countries;
}

export async function getAllRegionsOfCountry(
  countryCode: CountryCode,
  language?: SupportedLanguage,
): Promise<SimplePlace[]> {
  const data = await readJSON(language);
  const regions: SimplePlace[] = [];
  for (const regionNameInEnglish in data[countryCode][">"]) {
    regions.push({
      englishName: regionNameInEnglish,
      name: data[countryCode][">"][regionNameInEnglish].t,
    });
  }
  return regions;
}

// export async function getAllCities(
//   countryCode: CountryCode,
//   language?: SupportedLanguage,
// ): SimplePlace[] {
//   const data = await readJSON(language);

//   const regions: SimplePlace[] = [];
//   for (const regionNameInEnglish in data[countryCode][">"]) {
//     regions.push({
//       englishName: regionNameInEnglish,
//       name: data[countryCode][">"][regionNameInEnglish].t,
//     });
//   }
//   return regions;
// }

async function readJSON(
  language?: SupportedLanguage,
  nonEnglishDataPath: string = "./src/data/",
  englishDataPath: string = "",
): Promise<Record<CountryCode, CountryData>> {
  const fileToRead = isSupportedNonEnglishLanguage(language)
    ? `${nonEnglishDataPath}GPS-data-${language}.json`
    : `${englishDataPath}GPS-data.json`;
  const data: Record<CountryCode, CountryData> = JSON.parse(
    readFileSync(fileToRead, "utf-8"),
  );
  return data;
}
