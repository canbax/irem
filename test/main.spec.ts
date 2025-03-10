import { describe, it, expect } from "vitest";
import {
  getNearbyPlaces,
  getPlaceSuggestionsByText,
  getPlaceById,
} from "../src/main";
import { PlaceMatchWithCountry } from "../src/types";

describe("search places", () => {
  function expectAnkara(match: PlaceMatchWithCountry) {
    expect(match.name).toBe("Ankara");
    expect(match.stateName).toBe("Ankara");
    expect(match.countryCode).toBe("tr");
    expect(match.isMatchingAlternativeName).toBe(false);
    expect(match.matchingString).toBe("Ankara");
    expect(match.country).toBe("Türkiye");
  }
  it("should return a list of matches for a valid search", async () => {
    const results = await getPlaceSuggestionsByText("Ankara", "tr");
    expectAnkara(results[0]);
  });

  it("should return a list of matches for a valid search without GPS", async () => {
    const results = await getPlaceSuggestionsByText(
      "Çankırı",
      undefined,
      undefined,
      undefined,
    );
    expect(results[0].matchingString).toBe("Çankırı");
  });

  it("should return a list of matches for a valid search with GPS", async () => {
    const results = await getPlaceSuggestionsByText(
      "keç",
      undefined,
      39.9671296,
      32.6467584,
    );
    expect(results[0].matchingString).toBe("Keçiören");
    expect(results[1].matchingString).toBe("Keçiborlu");
  });

  it("should prioritize 'TR' results 'cuz 'TR' country code is passed", async () => {
    const results = await getPlaceSuggestionsByText(
      "Ke",
      "tr",
      undefined,
      undefined,
      undefined,
      "tr",
    );
    expect(results.length).toBeGreaterThan(9);
    for (const r of results) {
      expect(r.countryCode).toEqual("tr");
    }
  });
});

describe("list places based on approximation to GPS", () => {
  it("should return the settlement as the first result for an exact match", async () => {
    const lat = 38.93925;
    const lon = 33.5386;
    const results = await getNearbyPlaces(lat, lon);
    expect(results[0].latitude).toBe(lat);
    expect(results[0].longitude).toBe(lon);
    expect(results[0].name).toBe("Şereflikoçhisar");
  });

  it("should return empty list if there is no any settlement around the coordinates", async () => {
    const results = await getNearbyPlaces(0, 0);
    expect(results).toHaveLength(0);
  });
});

describe("get a place by id (id is the line number in TSV file)", () => {
  it("should get a place", async () => {
    const resultEN = await getPlaceById(100);
    expect(resultEN).toEqual({
      country: "Afghanistan",
      id: 100,
      name: "Cool urhajo",
      countryCode: "af",
      stateName: "Bamyan",
      latitude: 34.26545,
      longitude: 67.34516,
      alternativeNames: [""],
    });
    const resultTR = await getPlaceById(100, "TR");
    expect(resultTR?.country).toEqual("Afganistan");

    const resultFirst = await getPlaceById(1, "TR");
    const resultLast = await getPlaceById(350903, "TR");
    expect(resultFirst?.country).toEqual("Andorra");
    expect(resultLast?.country).toEqual("Zimbabve");
  });

  it("should not get a place", async () => {
    expect(await getPlaceById(350904)).toBeUndefined();
    expect(await getPlaceById(0)).toBeUndefined();
    expect(await getPlaceById(-1)).toBeUndefined();
  });
});
