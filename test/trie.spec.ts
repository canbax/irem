import { describe, it, expect } from "vitest";
import { Trie } from "../src/trie";
import { unlinkSync, existsSync } from "fs";

describe("Trie", () => {
  it("should write a JSON file from the TSV file and then should convert the JSON file to Trie data structure", async () => {
    const trieJsonFile = "data/trie.gzip";
    if (existsSync(trieJsonFile)) {
      unlinkSync(trieJsonFile);
    }
    await Trie.convertDataToGzippedTrieJSON();
    expect(existsSync(trieJsonFile)).toBe(true);

    const trie = new Trie();
    await trie.loadFromJson("data/trie.gzip");
    expect(trie.searchPrefix("Ankara")?.length).toBe(1);
  });
});
