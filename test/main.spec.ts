import {
  getAllCities,
  getAllCountries,
  getAllRegionsOfCountry,
} from "../src/main";
import { describe, test, expect } from "vitest";
import { supportedNonEnglishLanguages } from "../src/util";

describe("allCountriesInEnglish", () => {
  test.each([...supportedNonEnglishLanguages, "en", "EN", "undefined"])(
    "should get all countries alphabetically sorted in Language %s",
    (language) => {
      const allCountries = getAllCountries(language);
      expect(allCountries).toHaveLength(242);
      for (let i = 0; i < allCountries.length - 1; i++) {
        const country1 = allCountries[i].englishName;
        const country2 = allCountries[i + 1].englishName;
        expect(country1.localeCompare(country2)).toBe(-1);
      }
      for (let i = 0; i < allCountries.length; i++) {
        expect(allCountries[i].gps).toBeDefined();
      }
    },
  );

  test("should get all countries sorted based on GPS from Ankara", () => {
    const allCountriesInTurkish = getAllCountries("tr", [39, 35]);
    expect(allCountriesInTurkish[0].englishName).toBe("Turkey");
    expect(allCountriesInTurkish[1].englishName).toBe("Cyprus");
    expect(allCountriesInTurkish[2].englishName).toBe("Syria");
  });

  test("should get Turkey from all countries in Turkish", () => {
    const allCountriesInTurkish = getAllCountries("tr");
    const turkey = allCountriesInTurkish.find((x) => x.code == "TR");
    expect(turkey?.code).toEqual("TR");
    expect(turkey?.englishName).toEqual("Turkey");
    expect(turkey?.name).toEqual("Türkiye");
  });
});

describe("getAllRegionsOfCountry", () => {
  test("should get 81 regions (cities) in Turkey", () => {
    const allRegionsInTurkey = getAllRegionsOfCountry("TR", "tr");
    expect(allRegionsInTurkey.length).toBe(81);
    for (let i = 0; i < allRegionsInTurkey.length - 1; i++) {
      const country1 = allRegionsInTurkey[i].englishName;
      const country2 = allRegionsInTurkey[i + 1].englishName;
      expect(country1.localeCompare(country2)).toBe(-1);
    }
    for (let i = 0; i < allRegionsInTurkey.length; i++) {
      expect(allRegionsInTurkey[i].gps).toBeDefined();
    }
  });

  test("should get all regions in Turkey sorted based on GPS from Istanbul", () => {
    const allRegionsInTurkey = getAllRegionsOfCountry("TR", "tr", [41, 29]);
    expect(allRegionsInTurkey[0].englishName).toBe("İstanbul");
    expect(allRegionsInTurkey[1].englishName).toBe("Yalova");
    expect(allRegionsInTurkey[2].englishName).toBe("Kocaeli");
  });

  test("should get Kocaeli and İstanbul cities in Turkey", () => {
    const allRegionsInTurkey = getAllRegionsOfCountry("TR", "tr");

    const istanbul = allRegionsInTurkey.find(
      (x) => x.englishName === "İstanbul",
    );
    const kocaeli = allRegionsInTurkey.find((x) => x.englishName === "Kocaeli");
    expect(istanbul?.englishName).toEqual("İstanbul");
    expect(kocaeli?.englishName).toEqual("Kocaeli");
  });
});

describe("getAllCities", () => {
  test("should get cities (districts) in Ankara in Turkey", () => {
    const allPlacesInAnkara = getAllCities("TR", "Ankara", "tr");
    expect(allPlacesInAnkara.length).toBe(26);

    for (let i = 0; i < allPlacesInAnkara.length - 1; i++) {
      const place1 = allPlacesInAnkara[i].englishName;
      const place2 = allPlacesInAnkara[i + 1].englishName;
      expect(place1.localeCompare(place2)).toBe(-1);
    }
    for (let i = 0; i < allPlacesInAnkara.length; i++) {
      expect(allPlacesInAnkara[i].gps).toBeDefined();
    }
  });

  test("should get cities (districts) in Ankara in Turkey sorted based on GPS from Akyurt", () => {
    const allPlacesInAnkara = getAllCities(
      "TR",
      "Ankara",
      "tr",
      [40.132194, 33.086998],
    );
    expect(allPlacesInAnkara[0].englishName).toBe("Akyurt");
    expect(allPlacesInAnkara[1].englishName).toBe("Altındağ");
    expect(allPlacesInAnkara[2].englishName).toBe("Ayaş");
  });
});
