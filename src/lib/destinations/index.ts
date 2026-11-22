import { destinations } from "./data";

export { atollShapes } from "./atolls";
export { filterDestinations, hasActiveFilters, parseFilters, type Filters } from "./filters";
export * from "./types";
export { destinations };

export function getDestination(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Turns [1, 2, 3, 4, 12] into "December to April". */
export function describeMonths(months: number[]): string {
  if (months.length === 0) return "";
  if (months.length === 12) return "All year";

  const set = new Set(months);
  // Start at the first month whose previous month is not included, so ranges can wrap the year.
  const start = months.find((month) => !set.has(month === 1 ? 12 : month - 1)) ?? months[0];
  const ranges: [number, number][] = [];
  let current: [number, number] | undefined;

  for (let offset = 0; offset < 12; offset++) {
    const month = ((start - 1 + offset) % 12) + 1;
    if (set.has(month)) {
      if (current) current[1] = month;
      else current = [month, month];
    } else if (current) {
      ranges.push(current);
      current = undefined;
    }
  }
  if (current) ranges.push(current);

  return ranges
    .map(([from, to]) =>
      from === to ? monthNames[from - 1] : `${monthNames[from - 1]} to ${monthNames[to - 1]}`,
    )
    .join(", ");
}
