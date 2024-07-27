import {
  normalizeString,
  readGzippedJSON,
  TRIE_FILE,
  TSV_DB_FILE,
  writeGzippedJSON,
} from "./util.js";
import { readFileSync, writeFileSync } from "fs";

interface EncodedTrieNode {
  c?: Record<string, EncodedTrieNode>;
  l?: number[];
}
class TrieNode {
  children: Record<string, TrieNode>;
  lineNumbers: Set<number>;

  constructor() {
    this.children = {};
    this.lineNumbers = new Set();
  }
}

export class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode(); // Initialize the root node
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
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
    }

    current.lineNumbers.add(lineNumber);
  }

  findPrefix(query: string) {
    // Initialize the currentNode pointer with the root node
    let currentNode = this.root;

    // Iterate across the length of the string
    for (let c of query) {
      // Check if the node exist for the current character in the Trie.
      if (!currentNode.children[c]) {
        // Given word as a prefix does not exist in Trie
        return null;
      }

      // Move the currentNode pointer to the already existing node for current character.
      currentNode = currentNode.children[c];
    }

    // Prefix exist in the Trie
    return currentNode;
  }

  searchPrefix(query: string): number[] | null {
    const searchTerm = query.trim().toLowerCase();
    if (searchTerm.length < 1) return null;
    const rawSearched = this.findPrefix(searchTerm);
    if (rawSearched) return Array.from(rawSearched.lineNumbers);
    const normalizedSearch = this.findPrefix(normalizeString(searchTerm));
    if (normalizedSearch) return Array.from(normalizedSearch.lineNumbers);
    return null;
  }

  async loadFromJson(filePath: string) {
    const trieJSON = await readGzippedJSON(filePath);
    this.root = this.buildTrieFromJson(trieJSON);
  }

  buildTrieFromJson(encodedNode: EncodedTrieNode) {
    const node = new TrieNode();
    if (encodedNode.l) {
      node.lineNumbers = new Set(encodedNode.l);
    }
    if (encodedNode.c) {
      for (const [char, childJson] of Object.entries(encodedNode.c)) {
        node.children[char] = this.buildTrieFromJson(childJson);
      }
    }
    return node;
  }

  static buildTrieFromTSV(tsvFilePath: string): Trie {
    const trie = new Trie();
    const fileContent = readFileSync(tsvFilePath, "utf-8");
    const lines = fileContent.split("\n");

    lines.forEach((line, index) => {
      if (line.trim() === "") return;
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
    function nodeToJson(node: TrieNode) {
      const result: EncodedTrieNode = {};
      if (node.lineNumbers.size > 0) {
        result.l = Array.from(node.lineNumbers);
      }
      if (Object.keys(node.children).length > 0) {
        result.c = {};
        for (const [char, childNode] of Object.entries(node.children)) {
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
