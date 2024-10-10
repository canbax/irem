import { describe, it, expect } from "vitest";
import { getNearbyPlaces, getPlaceSuggestionsByText } from "../src/main";
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
