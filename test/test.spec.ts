import { yourLibFunction } from "../src/main";
import { describe, test, expect } from "vitest";

describe("Unit tests", () => {
  test("should add 2 and 5", async () => {
    expect(yourLibFunction(2, 5)).toEqual(7);
  });
});
