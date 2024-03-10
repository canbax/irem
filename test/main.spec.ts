import { getAllCountries, getAllRegionsOfCountry } from "../src/main";
import { describe, test, expect } from "vitest";
import { supportedNonEnglishLanguages } from "../src/util";

describe("allCountriesInEnglish", () => {
  test.each([...supportedNonEnglishLanguages, "en", "EN", "undefined"])(
    "should get all countries in Language %s",
    async (language) => {
      const allCountries = await getAllCountries(language);
      expect(allCountries).toHaveLength(242);
    },
  );

  test("should get Turkey from all countries in Turkish", async () => {
    const allCountriesInTurkish = await getAllCountries("tr");
    const turkey = allCountriesInTurkish.find((x) => x.code == "TR");
    expect(turkey).toEqual({
      code: "TR",
      englishName: "Turkey",
      name: "Türkiye",
    });
  });
});

describe("getAllRegionsOfCountry", () => {
  test("should get 81 regions (cities) in Turkey", async () => {
    const allRegionsInTurkey = await getAllRegionsOfCountry("TR", "tr");
    expect(allRegionsInTurkey.length).toBe(81);
  });

  test("should get Kocaeli and İstanbul cities in Turkey", async () => {
    const allRegionsInTurkey = await getAllRegionsOfCountry("TR", "tr");

    const istanbul = allRegionsInTurkey.find(
      (x) => x.englishName === "İstanbul",
    );
    const kocaeli = allRegionsInTurkey.find((x) => x.englishName === "Kocaeli");
    expect(istanbul).toEqual({ englishName: "İstanbul", name: "" });
    expect(kocaeli).toEqual({ englishName: "Kocaeli", name: "" });
  });
});
