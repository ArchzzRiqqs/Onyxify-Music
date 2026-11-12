import { describe, expect, it } from "vitest";

import { parseLrc } from "./parse-lrc";

describe("parseLrc", () => {
  it("expands duplicate timestamps and applies the offset", () => {
    expect(parseLrc("[offset:-500]\n[00:01.00][00:02.50]Halo")).toEqual([
      { timeMs: 500, text: "Halo" },
      { timeMs: 2000, text: "Halo" },
    ]);
  });

  it("skips malformed lines without throwing", () => {
    expect(parseLrc("[00:99.00]rusak\nini bukan lirik\n[00:03]Valid")).toEqual([
      { timeMs: 3000, text: "Valid" },
    ]);
  });
});
