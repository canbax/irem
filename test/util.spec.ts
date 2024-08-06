import { describe, it, expect } from "vitest";
import {
  getAutocompleteResults,
  normalizeString,
  readLinesFromTSV,
  TRIE_FILE,
  TSV_DB_FILE,
} from "../src/util";
import { Trie } from "../src/trie";
import { PlaceMatch } from "../src/types";

describe("util functions", () => {
  describe("normalizeString", () => {
    it("should convert Turkish characters to English mappings", () => {
      expect(normalizeString("şŞÖöĞğİIÜüÇç")).toBe("ssooggiiuucc");
    });

    it("should not convert Chinese characters 黄河西路街道", () => {
      expect(normalizeString("黄河西路街道")).toBe("黄河西路街道");
    });
  });

  describe("readLinesFromTSV", async () => {
    it("should read lines array [1, 347651, 322442, 322444] correctly", async () => {
      const linesRead = await readLinesFromTSV(
        TSV_DB_FILE,
        [1, 347651, 322442, 322444],
      );
      expect(linesRead.length).toBe(4);
      const names: string[] = [];
      for (const line of linesRead) {
        names.push(line.name);
      }
      expect(names).toStrictEqual([
        "!Kheis Local Municipality",
        "천리마구역",
        "İstanbul",
        "İyidere",
      ]);
    });

    it("should read lines Set<number> [1, 347651, 322442, 322444] correctly ", async () => {
      const linesRead = await readLinesFromTSV(
        TSV_DB_FILE,
        new Set<number>([1, 347651, 322442, 322444]),
      );
      expect(linesRead.length).toBe(4);
      const names: string[] = [];
      for (const line of linesRead) {
        names.push(line.name);
      }
      expect(names).toStrictEqual([
        "!Kheis Local Municipality",
        "천리마구역",
        "İstanbul",
        "İyidere",
      ]);
    });

    it("should 100 lines in maximum 50 ms", async () => {
      function createArray(n: number) {
        return Array.from({ length: n }, (v, k) => k + 1);
      }
      const t1 = new Date().getTime();
      await readLinesFromTSV(TSV_DB_FILE, createArray(100));
      const deltaTime = new Date().getTime() - t1;
      expect(deltaTime).toBeLessThan(50);
    });
  });

  describe("getAutocompleteResults", async () => {
    const trie = new Trie();
    await trie.loadFromJson(TRIE_FILE);

    function expectAnkara(match: PlaceMatch) {
      expect(match.name).toBe("Ankara");
      expect(match.stateName).toBe("Ankara");
      expect(match.countryCode).toBe("tr");
      expect(match.isMatchingAlternativeName).toBe(false);
      expect(match.matchingString).toBe("Ankara");
    }

    function expectIstanbul(
      match: PlaceMatch,
      matchingString: string,
      isAlternativeName = true,
    ) {
      expect(match.name).toBe("İstanbul");
      expect(match.stateName).toBe("İstanbul");
      expect(match.countryCode).toBe("tr");
      expect(match.isMatchingAlternativeName).toBe(isAlternativeName);
      expect(match.matchingString).toBe(matchingString);
    }

    it("should get autocomplete results for an exact match", async () => {
      const bestResult = (await getAutocompleteResults("Ankara", trie))[0];
      expectAnkara(bestResult);
    });

    it("should get autocomplete results for a partial match", async () => {
      const results = await getAutocompleteResults("anka", trie);
      expectAnkara(results[2]);
      expect(results.length).toBeGreaterThan(5);
    });

    it("should get an autocomplete result for an alternative name match", async () => {
      const results = await getAutocompleteResults("Ыстанбұл", trie);
      expectIstanbul(results[0], "Ыстанбұл");
      expect(results.length).toBe(1);
    });

    it("should get empty results if empty string", async () => {
      const results = await getAutocompleteResults(" ", trie);
      expect(results).toHaveLength(0);
    });
  });
});
