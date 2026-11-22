import { describe, expect, it } from "vitest";

import { describeMonths, destinations, filterDestinations, parseFilters } from "..";

describe("parseFilters", () => {
  it("reads valid filters from search params", () => {
    expect(parseFilters({ q: " sharks ", type: "dive-site", budget: "2", month: "3" })).toEqual({
      q: "sharks",
      type: "dive-site",
      budget: 2,
      month: 3,
    });
  });

  it("drops invalid values instead of failing", () => {
    expect(parseFilters({ type: "spaceship", budget: "9", month: "abc", q: "" })).toEqual({
      q: undefined,
      type: undefined,
      budget: undefined,
      month: undefined,
    });
  });

  it("uses the first value when a param is repeated", () => {
    expect(parseFilters({ type: ["resort", "city"] }).type).toBe("resort");
  });
});

describe("filterDestinations", () => {
  it("returns everything, sorted by name, with no filters", () => {
    const result = filterDestinations(destinations, {});
    expect(result).toHaveLength(destinations.length);
    expect(result.map((d) => d.name)).toEqual(
      [...result.map((d) => d.name)].sort((a, b) => a.localeCompare(b)),
    );
  });

  it("filters by type and maximum budget", () => {
    const result = filterDestinations(destinations, { type: "local-island", budget: 1 });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((d) => d.type === "local-island" && d.budget === 1)).toBe(true);
  });

  it("filters by best month", () => {
    const result = filterDestinations(destinations, { month: 8 });
    expect(result.map((d) => d.slug)).toContain("baa-atoll");
    expect(result.map((d) => d.slug)).not.toContain("maafushi");
  });

  it("searches names, atolls and highlights, ignoring case and accents", () => {
    expect(filterDestinations(destinations, { q: "MANTA" }).map((d) => d.slug)).toEqual([
      "baa-atoll",
    ]);
    expect(filterDestinations(destinations, { q: "male" }).map((d) => d.slug)).toContain("male");
  });
});

describe("describeMonths", () => {
  it("describes ranges that wrap around the new year", () => {
    expect(describeMonths([1, 2, 3, 4, 12])).toBe("December to April");
  });

  it("describes separate ranges and full years", () => {
    expect(describeMonths([1, 2, 3, 4, 10, 11, 12])).toBe("October to April");
    expect(describeMonths([3, 7])).toBe("March, July");
    expect(describeMonths([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])).toBe("All year");
  });
});

describe("destination data", () => {
  it("has unique slugs and valid months and coordinates", () => {
    expect(new Set(destinations.map((d) => d.slug)).size).toBe(destinations.length);
    for (const destination of destinations) {
      expect(destination.bestMonths.every((m) => m >= 1 && m <= 12)).toBe(true);
      expect(destination.coordinates.lat).toBeGreaterThan(-1);
      expect(destination.coordinates.lat).toBeLessThan(7.5);
    }
  });
});
