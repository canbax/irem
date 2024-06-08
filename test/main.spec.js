"use strict";
// import {
//   getAllCities,
//   getAllCountries,
//   getAllRegionsOfCountry,
//   getDataFolderPath,
//   setDataFolderPath,
//   setDataFolderPathToDefault,
//   DEFAULT_DATA_FOLDER,
// } from "../src/main";
// import { describe, test, expect } from "vitest";
// import { supportedLanguages } from "../src/util";
// describe("allCountriesInEnglish", () => {
//   test.each([...supportedLanguages, "en", "EN", "undefined", undefined])(
//     "should get all countries alphabetically sorted in Language %s",
//     (language) => {
//       const allCountries = getAllCountries(language);
//       expect(allCountries).toHaveLength(242);
//       for (let i = 0; i < allCountries.length - 1; i++) {
//         const country1 = allCountries[i].englishName;
//         const country2 = allCountries[i + 1].englishName;
//         expect(country1.localeCompare(country2)).toBe(-1);
//       }
//       for (let i = 0; i < allCountries.length; i++) {
//         expect(allCountries[i].gps).toBeDefined();
//       }
//     },
//   );
//   test("should get all countries sorted based on GPS from Ankara", () => {
//     const allCountriesInTurkish = getAllCountries("tr", [39, 35]);
//     expect(allCountriesInTurkish[0].englishName).toBe("Turkey");
//     expect(allCountriesInTurkish[1].englishName).toBe("Cyprus");
//     expect(allCountriesInTurkish[2].englishName).toBe("Syria");
//   });
//   test("should get Turkey from all countries in Turkish", () => {
//     const allCountriesInTurkish = getAllCountries("tr");
//     const turkey = allCountriesInTurkish.find((x) => x.code == "TR");
//     expect(turkey?.code).toEqual("TR");
//     expect(turkey?.englishName).toEqual("Turkey");
//     expect(turkey?.name).toEqual("Türkiye");
//   });
//   test("should throw error if cannot read data file", () => {
//     setDataFolderPath("random path does not exist");
//     expect(() => getAllCountries("tr")).toThrowError();
//     setDataFolderPathToDefault();
//     expect(getDataFolderPath()).toBe(DEFAULT_DATA_FOLDER);
//   });
// });
