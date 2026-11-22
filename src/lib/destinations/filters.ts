import { z } from "zod";

import { destinationTypes, type Destination } from "./types";

const optional = <T extends z.ZodType>(schema: T) => schema.optional().catch(undefined);

/**
 * Filters come from the URL, so anyone can type anything into them. Invalid values are
 * dropped rather than throwing, and the page shows unfiltered results for that field.
 */
export const filtersSchema = z.object({
  q: optional(z.string().trim().max(60)),
  type: optional(z.enum(destinationTypes)),
  budget: optional(z.coerce.number().int().min(1).max(3)),
  month: optional(z.coerce.number().int().min(1).max(12)),
});

export type Filters = z.infer<typeof filtersSchema>;

type SearchParams = Record<string, string | string[] | undefined>;

export function parseFilters(searchParams: SearchParams): Filters {
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value || undefined;

  return filtersSchema.parse({
    q: first(searchParams.q),
    type: first(searchParams.type),
    budget: first(searchParams.budget),
    month: first(searchParams.month),
  });
}

const normalise = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function filterDestinations(list: Destination[], filters: Filters): Destination[] {
  const query = filters.q ? normalise(filters.q) : undefined;

  return list
    .filter((destination) => {
      if (filters.type && destination.type !== filters.type) return false;
      if (filters.budget && destination.budget > filters.budget) return false;
      if (filters.month && !destination.bestMonths.includes(filters.month)) return false;
      if (query) {
        const haystack = normalise(
          [
            destination.name,
            destination.atoll,
            destination.summary,
            ...destination.highlights,
          ].join(" "),
        );
        if (!haystack.includes(query)) return false;
      }
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function hasActiveFilters(filters: Filters): boolean {
  return Object.values(filters).some((value) => value !== undefined);
}
