import { describe, it, expect } from "vitest";
import { Trie } from "../src/trie";
import { unlinkSync, existsSync } from "fs";
import { TRIE_FILE } from "../src/util";

describe("Trie", () => {
  it("should write a JSON file from the TSV file and then should convert the JSON file to Trie data structure", async () => {
    if (existsSync(TRIE_FILE)) {
      unlinkSync(TRIE_FILE);
    }
    await Trie.convertDataToGzippedTrieJSON();
    expect(existsSync(TRIE_FILE)).toBe(true);

    const trie = new Trie();
    await trie.loadFromJson(TRIE_FILE);
    expect(trie.searchPrefix("Ankara")?.length).toBe(1);
  });
});
