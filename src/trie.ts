import {
  normalizeString,
  readGzippedJSON,
  TRIE_FILE,
  TSV_DB_FILE,
  uniteSets,
  writeGzippedJSON,
} from "./util.js";
import { readFileSync } from "fs";

interface EncodedTrieNode {
  c?: Record<string, EncodedTrieNode>;
  l?: number[];
}
export class Trie {
  root: EncodedTrieNode;

  createNode(): EncodedTrieNode {
    return { c: {}, l: [] };
  }

  constructor() {
    this.root = this.createNode(); // Initialize the root node
  }

  insert(word: string, lineNumber: number, isNormalize = false) {
    let w = word + "";
    if (isNormalize) {
      w = normalizeString(word);
    } else {
      w = word.trim().toLowerCase();
    }

    if (w.length < 1) return;
    let current = this.root;

    for (let i = 0; i < w.length; i++) {
      const char = w[i] as string;
      if (!current.c) {
        current.c = {};
      }
      if (!current.c[char]) {
        current.c[char] = this.createNode();
      }
      current = current.c[char] as EncodedTrieNode;
    }

    if (!current.l?.includes(lineNumber)) {
      current.l?.push(lineNumber);
    }
  }

  findPrefix(query: string) {
    // Initialize the currentNode pointer with the root node
    let currentNode = this.root;

    // Iterate across the length of the string
    for (let c of query) {
      // Check if the node exist for the current character in the Trie.
      if (!currentNode?.c?.[c]) {
        // Given word as a prefix does not exist in Trie
        return null;
      }

      // Move the currentNode pointer to the already existing node for current character.
      currentNode = currentNode.c[c] as EncodedTrieNode;
    }

    // Prefix exist in the Trie
    return currentNode;
  }

  findLastNodeMatch(query: string) {
    // Initialize the currentNode pointer with the root node
    let currentNode = this.root;

    let i = 0;
    // Iterate across the length of the string
    for (i = 0; i < query.length; i++) {
      const c = query[i] as string;
      // Check if the node exist for the current character in the Trie.
      if (!currentNode?.c?.[c]) {
        // Given word as a prefix does not exist in Trie
        return { currentNode, i };
      }

      // Move the currentNode pointer to the already existing node for current character.
      currentNode = currentNode.c[c] as EncodedTrieNode;
    }

    // Prefix exist in the Trie
    return { currentNode, i };
  }

  autocomplete(query: string, maxResultCount = 10): Set<number> {
    const resultSet = new Set<number>();

    const { i, currentNode } = this.findLastNodeMatch(query.trim());
    const normalizedQuery = normalizeString(query);
    const { i: i2, currentNode: c2 } = this.findLastNodeMatch(normalizedQuery);
    if (i2 > i) {
      this.collectLineNumbersWithBFS(c2, resultSet, maxResultCount);
    } else {
      this.collectLineNumbersWithBFS(currentNode, resultSet, maxResultCount);
    }

    return resultSet;
  }

  /**
   * collects line numbers in `resultSet`
   *
   * @param {TrieNode} currentNode
   * @param {Set<number>} resultSet
   * @param {number} [maxResultCount=10]
   */
  collectLineNumbersWithBFS(
    currentNode: EncodedTrieNode,
    resultSet: Set<number>,
    maxResultCount: number = 10,
  ): void {
    if (resultSet.size > maxResultCount) return;
    uniteSets(resultSet, currentNode?.l ?? []);

    for (const childNode of Object.values(currentNode?.c ?? {})) {
      this.collectLineNumbersWithBFS(childNode, resultSet, maxResultCount);
    }
  }

  searchPrefix(query: string): number[] | null {
    const searchTerm = query.trim().toLowerCase();
    if (searchTerm.length < 1) return null;
    const rawSearched = this.findPrefix(searchTerm);
    if (rawSearched) return Array.from(rawSearched?.l ?? []);
    const normalizedSearch = this.findPrefix(normalizeString(searchTerm));
    if (normalizedSearch) return Array.from(normalizedSearch?.l ?? []);
    return null;
  }

  /**
   * built Trie data structure from gzipped JSON serialization
   *
   * @async
   * @param {string} filePath
   * @returns {*}
   */
  async loadFromJson(filePath: string): Promise<void> {
    this.root = await readGzippedJSON(filePath);
  }

  static buildTrieFromTSV(tsvFilePath: string): Trie {
    const trie = new Trie();
    const fileContent = readFileSync(tsvFilePath, "utf-8");
    const lines = fileContent.split("\n");

    lines.forEach((line, index) => {
      if (index === 0 || line.trim() === "") return; // skip header line
      const [name, , , , , alternative_names] = line.split("\t");

      // Insert original name
      if (name) {
        trie.insert(name, index);
        trie.insert(name, index, true);
      }

      // Insert alternative names
      if (alternative_names) {
        const altNames = alternative_names.split(/[,;]/);
        altNames.forEach((altName) => {
          trie.insert(altName, index);
          trie.insert(altName, index, true);
        });
      }
    });

    return trie;
  }

  static trieToJson(trie: Trie) {
    function nodeToJson(node: EncodedTrieNode) {
      const result: EncodedTrieNode = {};
      if ((node?.l?.length ?? 0) > 0) {
        result.l = Array.from(node?.l ?? []);
      }
      if (Object.keys(node?.c ?? {}).length > 0) {
        result.c = {};
        for (const [char, childNode] of Object.entries(node?.c ?? {})) {
          result.c[char] = nodeToJson(childNode);
        }
      }
      return result;
    }
    return nodeToJson(trie.root);
  }

  static async convertDataToGzippedTrieJSON() {
    const trie = Trie.buildTrieFromTSV(TSV_DB_FILE);
    await writeGzippedJSON(TRIE_FILE, Trie.trieToJson(trie));
  }
}
