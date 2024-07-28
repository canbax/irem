import { describe, it, expect } from "vitest";
import { normalizeString, readLinesFromTSV, TSV_DB_FILE } from "../src/util";

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
    it("should read lines [1, 347651, 322442, 322444] correctly", async () => {
      const linesRead = await readLinesFromTSV(
        TSV_DB_FILE,
        [1, 347651, 322442, 322444],
      );
      expect(linesRead.length).toBe(4);
      const names: string[] = [];
      for (const line of linesRead) {
        const [name, , , , ,] = line?.split("\t");
        names.push(name);
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
});
