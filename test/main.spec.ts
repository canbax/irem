import { describe, it, expect } from "vitest";
import { searchPlaces } from "../src/main";
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
    const results = await searchPlaces("Ankara", "tr");
    expectAnkara(results[0]);
  });
});
