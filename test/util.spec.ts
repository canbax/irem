import { describe, it, expect } from "vitest";
import { normalizeString, readLineFromTSV } from "../src/util";

describe("util functions", () => {
  describe("normalizeString", () => {
    it("should convert Turkish characters to English mappings", () => {
      expect(normalizeString("şŞÖöĞğİIÜüÇç")).toBe("ssooggiiuucc");
    });

    it("should not convert Chinese characters 黄河西路街道", () => {
      expect(normalizeString("黄河西路街道")).toBe("黄河西路街道");
    });
  });

  describe("readLineFromTSV", async () => {
    it.each([
      { lineNumber: 1, expectedName: "!Kheis Local Municipality" },
      { lineNumber: 347651, expectedName: "천리마구역" },
      { lineNumber: 322442, expectedName: "İstanbul" },
      { lineNumber: 322444, expectedName: "İyidere" },
    ])(
      "should read $expectedName from line number: $lineNumber",
      async ({ lineNumber, expectedName }) => {
        const lineAsString = await readLineFromTSV("data/db.tsv", lineNumber);
        expect(lineAsString).toBeDefined();
        if (lineAsString) {
          const [name, , , , ,] = lineAsString?.split("\t");
          expect(name).toBe(expectedName);
        }
      },
    );
  });
});
