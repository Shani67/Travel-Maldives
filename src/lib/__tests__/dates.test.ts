import { describe, expect, it } from "vitest";

import { todayInMaldives } from "../dates";

describe("todayInMaldives", () => {
  it("uses Maldives time, five hours ahead of UTC", () => {
    expect(todayInMaldives(new Date("2026-11-22T18:59:00Z"))).toBe("2026-11-22");
    expect(todayInMaldives(new Date("2026-11-22T19:00:00Z"))).toBe("2026-11-23");
  });
});
