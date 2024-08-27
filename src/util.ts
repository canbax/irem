import { Place, PlaceMatch, SupportedLanguage } from "./types.js";
import { readFile, writeFile, open, FileHandle } from "fs/promises";
import { gunzip, gzip } from "zlib";
import { promisify } from "util";
import { Trie } from "./trie.js";

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

const COUNTRY_TRANSLATIONS = await readGzippedJSON(
  "data/country-translations.json.gz",
);

/**
 * Sort places by GPS position proximity.
 * If any of `latitude` or `longitude` is not provided, sort by edit distance to the search term
 * @export
 * @template {PlaceMatch} T
 * @param {T[]} places
 * @param {?number} [latitude]
 * @param {?number} [longitude]
 */
export function sortPlaces<T extends PlaceMatch>(
  places: T[],
  latitude?: number,
  longitude?: number,
) {
  if (isDefined(latitude) && isDefined(longitude)) {
    const dist2 = (a: [number, number], b: [number, number]) => {
      return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
    };
    places.sort((a: PlaceMatch, b: PlaceMatch) => {
      const distA = dist2([latitude, longitude], [a.latitude, a.longitude]);
      const distB = dist2([latitude, longitude], [b.latitude, b.longitude]);
      return distA - distB;
    });
  } else {
    places.sort(
      (a: PlaceMatch, b: PlaceMatch) => a.editDistance - b.editDistance,
    );
  }
}

export function enrichPlaceMatchesWithCountryName<T extends Place>(
  results: T[],
  language?: SupportedLanguage,
): (T & { country: string })[] {
  const copy = results.map((item) => ({
    country: "",
    ...item,
  }));
  const lang: SupportedLanguage = language ?? "en";
  for (const c of copy) {
    c.country =
      COUNTRY_TRANSLATIONS[c.countryCode]?.[lang] ??
      COUNTRY_TRANSLATIONS[c.countryCode]?.en;
  }
  return copy;
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
    return err;
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
    return err;
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

const __PLACE_CACHE: Record<number, Place> = {};

async function readPlaceLineFromTSV(
  tsvFileHandle: FileHandle,
  indexFileHandle: FileHandle,
  lineNumber: number,
): Promise<Place> {
  if (__PLACE_CACHE[lineNumber]) return __PLACE_CACHE[lineNumber];

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
  if (!current) {
    throw new Error("cannot read place line:" + lineNumber);
  }
  const place = convertLinesToObjectArray(current, lineNumber);
  __PLACE_CACHE[lineNumber] = place;
  return place;
}

export async function readLinesFromTSV(
  tsvFilePath: string,
  lineNumbers: number[] | Set<number>,
  indexFilePath = "data/index.bin",
): Promise<Place[]> {
  const placesRead: Place[] = [];
  // Open both files
  const tsvFileHandle = await open(tsvFilePath, "r");
  const indexFileHandle = await open(indexFilePath, "r");

  for (const lineNumber of lineNumbers) {
    const place = await readPlaceLineFromTSV(
      tsvFileHandle,
      indexFileHandle,
      lineNumber,
    );
    placesRead.push(place);
  }

  // Close file handles
  await tsvFileHandle.close();
  await indexFileHandle.close();

  return placesRead;
}

export async function gridSearchByGPS(
  latitude: number,
  longitude: number,
  resultCount = 10,
): Promise<Place[]> {
  const CELL_SIZE = 0.1; // Define the grid cell size in degrees

  function getGridCell(lat: number, lon: number) {
    const latIndex = Math.floor(lat / CELL_SIZE);
    const lonIndex = Math.floor(lon / CELL_SIZE);
    return `${latIndex},${lonIndex}`;
  }

  // Calculate the Euclidean distance between two points (lat1, lon1) and (lat2, lon2)
  function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
  }

  const targetCell = getGridCell(latitude, longitude);

  const neighbors: {
    lineNumber: number;
    distance: number;
  }[] = []; // line numbers of closest settlements
  const [latIndex, lonIndex] = targetCell.split(",").map(Number);

  if (!isDefined(latIndex) || !isDefined(lonIndex)) {
    throw new Error(
      `For target cell '${targetCell}', latitude index or longitude index is undefined `,
    );
  }

  const grid = await readGzippedJSON("data/grid.json.gz");

  // Check the current cell and its neighbors
  for (let i = latIndex - 1; i <= latIndex + 1; i++) {
    for (let j = lonIndex - 1; j <= lonIndex + 1; j++) {
      const cellKey = `${i},${j}`;
      if (grid[cellKey]) {
        for (const settlement of grid[cellKey]) {
          const distance = calculateDistance(
            latitude,
            longitude,
            settlement[0],
            settlement[1],
          );
          neighbors.push({ lineNumber: settlement[2], distance });
        }
      }
    }
  }

  // Sort by distance and return the top k results
  neighbors.sort((a, b) => a.distance - b.distance);
  const topNeighbors = neighbors.slice(0, resultCount);

  return await readLinesFromTSV(
    TSV_DB_FILE,
    topNeighbors.map((x) => x.lineNumber),
  );
}

export function convertLinesToObjectArray(
  line: string,
  lineNumber: number,
): Place {
  const [name, countryCode, stateName, latitude, longitude, alternativeNames] =
    line.split("\t");
  return {
    id: lineNumber,
    name: name ?? "",
    countryCode: countryCode ?? "",
    stateName: stateName ?? "",
    latitude: Number(latitude),
    longitude: Number(longitude),
    alternativeNames: alternativeNames?.split(/[,;]/) ?? [],
  };
}

export async function getAutocompleteResults(searchTerm: string, trie: Trie) {
  if (!searchTerm.trim() || !trie) return [];
  const { resultSet, query } = trie.autocomplete(searchTerm);
  const places = await readLinesFromTSV(TSV_DB_FILE, resultSet);
  const placeMatches = findMatchingPlaces(query, places);
  placeMatches.sort((a, b) => {
    return a.editDistance - b.editDistance;
  });
  return placeMatches;
}

function findMatchingPlaces(query: string, places: Place[]): PlaceMatch[] {
  const r: PlaceMatch[] = [];
  for (const place of places) {
    const distanceToName = editDist(query, place.name);
    const distToAlternative = place.alternativeNames
      .map((x) => ({
        name: x,
        dist: editDist(query, x),
      }))
      .reduce((min, current) => (current.dist < min.dist ? current : min));
    const matchingString =
      distanceToName > distToAlternative.dist
        ? distToAlternative.name
        : place.name;
    r.push({
      ...place,
      isMatchingAlternativeName: distanceToName > distToAlternative.dist,
      editDistance: Math.min(distanceToName, distToAlternative.dist),
      matchingString,
    });
  }

  return r;
}

export function isDefined<T>(a: T | undefined | null): a is NonNullable<T> {
  return a !== undefined && a !== null;
}

/**
 * add all elements of `setB` to `setA`. So it mutates `setA`
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

export function editDist(s1: string, s2: string): number {
  const l1: number = s1.length + 1;
  const l2: number = s2.length + 1;

  const table: number[][] = Array(l2)
    .fill(null)
    .map((_, j) =>
      Array(l1)
        .fill(null)
        .map((_, i) => (j === 0 ? i : i === 0 ? j : 0)),
    );

  for (let i = 1; i < l1; i++) {
    for (let j = 1; j < l2; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        // @ts-ignore: Object is possibly 'undefined'
        table[j][i] = table[j - 1]?.[i - 1] as number;
      } else {
        // @ts-ignore: Object is possibly 'undefined'
        table[j][i] = // @ts-ignore: Object is possibly 'undefined'
          1 + Math.min(table[j][i - 1], table[j - 1][i], table[j - 1][i - 1]);
      }
    }
  }

  // @ts-ignore: Object is possibly 'undefined'
  return table[l2 - 1][l1 - 1];
}
