import { equals } from "./equals";
import { describe, expect, test } from "@jest/globals";

describe("equals", () => {
  test("returns true when a and b are equal", () => {
    expect(equals(1)(1)).toBe(true);
  });

  test("returns false when a and b are not equal", () => {
    expect(equals(1)(2)).toBe(false);
  });
});
