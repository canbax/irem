import { SimplePlace, SupportedLanguage } from "./types.js";
import { readFile, writeFile, open } from "fs/promises";
import { gunzip, gzip } from "zlib";
import { promisify } from "util";

export const supportedLanguages: SupportedLanguage[] = [
  "ar",
  "az",
  "de",
  "es",
  "en",
  "fa",
  "fr",
  "id",
  "it",
  "kk",
  "ko",
  "ky",
  "ms",
  "ru",
  "tr",
  "zh",
] as const;

export function isSupportedLanguage(language?: SupportedLanguage) {
  if (!language) return false;
  return supportedLanguages.includes(language.toLowerCase());
}

export const TRIE_FILE = "data/trie.gz";
export const TSV_DB_FILE = "data/db.tsv";

/**
 * sorts places according to distance from baseLocation or sorts alphabetically
 * @template {SimplePlace} T
 * @param {([number, number] | undefined)} baseLocation
 * @param {T[]} places
 * @returns sorted list of places
 */
export function sortPlaces<T extends SimplePlace>(
  baseLocation: [number, number] | undefined,
  places: T[],
) {
  if (!baseLocation) {
    return places.sort((a, b) => a.englishName.localeCompare(b.englishName));
  }
  const dist2 = (a: [number, number], b: [number, number]) => {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
  };
  return places.sort((a: SimplePlace, b: SimplePlace) => {
    const distA = dist2(baseLocation, a.gps);
    const distB = dist2(baseLocation, b.gps);
    return distA - distB;
  });
}

export function normalizeString(str: string) {
  return str
    .normalize("NFD")
    .trim()
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[àáâãäåāăąǻά]/g, "a")
    .replace(/[æ]/g, "ae")
    .replace(/[ḃβ]/g, "b")
    .replace(/[çćĉċč]/g, "c")
    .replace(/[ďđδ]/g, "d")
    .replace(/[èéêëēĕėęěέε]/g, "e")
    .replace(/[ḟƒ]/g, "f")
    .replace(/[ĝğġģγ]/g, "g")
    .replace(/[ĥħ]/g, "h")
    .replace(/[ìíîïīĭįıἰ]/g, "i")
    .replace(/[ĵ]/g, "j")
    .replace(/[ķ]/g, "k")
    .replace(/[ĺļľŀłλ]/g, "l")
    .replace(/[ṁμ]/g, "m")
    .replace(/[ñńņňŉνη]/g, "n")
    .replace(/[òóôõöōŏőǿοό]/g, "o")
    .replace(/[œ]/g, "oe")
    .replace(/[ṗφπ]/g, "p")
    .replace(/[ŕŗř]/g, "r")
    .replace(/[śŝşšșψ]/g, "s")
    .replace(/[ţťŧțτ]/g, "t")
    .replace(/[ùúûüũūŭůűųΰυ]/g, "u")
    .replace(/[ṽ]/g, "v")
    .replace(/[ŵẁẃẅω]/g, "w")
    .replace(/[ẋξχ]/g, "x")
    .replace(/[ýÿŷỳ]/g, "y")
    .replace(/[źżžζ]/g, "z")
    .replace(/[þ]/g, "th")
    .replace(/[ð]/g, "dh")
    .replace(/[ß]/g, "ss")
    .replace(/[ñ]/g, "n")
    .replace(/[ø]/g, "o")
    .replace(/æ/g, "ae")
    .replace(/œ/g, "oe");
}

export async function readGzippedFile(filePath: string) {
  try {
    // Promisify the gunzip function
    const gunzipAsync = promisify(gunzip);

    // Read the gzipped file
    const buffer = await readFile(filePath);

    // Decompress the gzipped buffer
    const decompressedBuffer = await gunzipAsync(buffer);

    // Convert the buffer to a string
    return decompressedBuffer.toString("utf8");
  } catch (err) {
    console.error("Error:", err);
  }
}

export async function readGzippedJSON(filePath: string) {
  try {
    // Promisify the gunzip function
    const gunzipAsync = promisify(gunzip);

    // Read the gzipped file
    const buffer = await readFile(filePath);

    // Decompress the gzipped buffer
    const decompressedBuffer = await gunzipAsync(buffer);

    // Convert the buffer to a string
    const jsonString = decompressedBuffer.toString("utf8");

    // Parse the JSON string
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Error:", err);
  }
}

export async function writeGzippedJSON(
  filePath: string,
  jsonObject: Record<string, any>,
) {
  try {
    // Promisify the gzip function
    const gzipAsync = promisify(gzip);
    // Convert the object to a JSON string
    const jsonString = JSON.stringify(jsonObject);

    // Compress the JSON string
    const compressedBuffer = await gzipAsync(jsonString);

    // Write the compressed buffer to a file
    await writeFile(filePath, compressedBuffer);
  } catch (err) {
    console.error("Error:", err);
  }
}

export async function readLinesFromTSV(
  tsvFilePath: string,
  lineNumbers: number[],
  indexFilePath = "data/index.bin",
): Promise<string[]> {
  const linesRead: string[] = [];
  // Open both files
  const tsvFileHandle = await open(tsvFilePath, "r");
  const indexFileHandle = await open(indexFilePath, "r");

  for (const lineNumber of lineNumbers) {
    // Read the offset from the index file
    const buffer = Buffer.alloc(8);
    await indexFileHandle.read(buffer, 0, 8, lineNumber * 8);
    const offset = buffer.readBigInt64LE();

    // Read the line from the TSV file
    const lineBuffer = Buffer.alloc(1024); // Assume max line length of 1024 bytes
    const { bytesRead } = await tsvFileHandle.read(
      lineBuffer,
      0,
      1024,
      Number(offset),
    );
    const current = lineBuffer.toString("utf8", 0, bytesRead).split("\n")[0];
    if (current) linesRead.push(current);
  }

  // Close file handles
  await tsvFileHandle.close();
  await indexFileHandle.close();

  return linesRead;
}

/**
 * add all elements of `setB` to `setA`
 *
 * @export
 * @template T
 * @param {Set<T>} setA
 * @param {Set<T>} setB
 */
export function uniteSets<T>(setA: Set<T>, setB: Set<T>) {
  for (const elem of setB) {
    setA.add(elem);
  }
}
