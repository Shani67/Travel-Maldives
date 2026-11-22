import type { Metadata } from "next";
import Link from "next/link";

import { DestinationCard } from "@/components/destination/destination-card";
import { MaldivesMap } from "@/components/maldives-map";
import {
  budgetLabels,
  destinations,
  destinationTypes,
  filterDestinations,
  hasActiveFilters,
  monthNames,
  parseFilters,
  typeLabels,
} from "@/lib/destinations";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Search Maldives islands, atolls and dive sites by type, budget and best month to visit.",
  alternates: { canonical: "/destinations" },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function DestinationsPage({ searchParams }: Props) {
  const filters = parseFilters(await searchParams);
  const results = filterDestinations(destinations, filters);
  const filtered = hasActiveFilters(filters);

  return (
    <div className="container-page space-y-10 py-12">
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-semibold">Destinations</h1>
        <p className="max-w-prose text-muted">
          Filter by the kind of trip you want. The search works without JavaScript, and every filter
          is in the URL, so you can share your results.
        </p>
      </header>

      {/* A plain GET form: progressive enhancement and shareable URLs for free. */}
      <form
        method="get"
        action="/destinations"
        role="search"
        aria-label="Filter destinations"
        className="grid gap-4 rounded-3xl bg-white p-6 ring-1 ring-foam sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]"
      >
        <div className="space-y-1">
          <label htmlFor="q" className="text-sm font-semibold">
            Search
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={filters.q}
            placeholder="Manta rays, surfing, Malé…"
            maxLength={60}
            className="field"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="type" className="text-sm font-semibold">
            Trip type
          </label>
          <select id="type" name="type" defaultValue={filters.type ?? ""} className="field">
            <option value="">Any type</option>
            {destinationTypes.map((type) => (
              <option key={type} value={type}>
                {typeLabels[type]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="budget" className="text-sm font-semibold">
            Budget up to
          </label>
          <select id="budget" name="budget" defaultValue={filters.budget ?? ""} className="field">
            <option value="">Any budget</option>
            {([1, 2, 3] as const).map((budget) => (
              <option key={budget} value={budget}>
                {budgetLabels[budget]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="month" className="text-sm font-semibold">
            Travelling in
          </label>
          <select id="month" name="month" defaultValue={filters.month ?? ""} className="field">
            <option value="">Any month</option>
            {monthNames.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-3">
          <button type="submit" className="btn-primary h-11">
            Show results
          </button>
        </div>
      </form>

      <div className="grid gap-10 lg:grid-cols-[1fr_auto]">
        <section aria-labelledby="results-heading" className="space-y-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="results-heading" className="font-display text-2xl font-semibold">
              {results.length === 1 ? "1 destination" : `${results.length} destinations`}
              {filtered ? " match your filters" : ""}
            </h2>
            {filtered && (
              <Link href="/destinations" className="text-sm font-semibold text-lagoon underline">
                Clear filters
              </Link>
            )}
          </div>
          {results.length === 0 ? (
            <p className="rounded-3xl bg-white p-8 ring-1 ring-foam">
              Nothing matches those filters. Try another month or a higher budget, or{" "}
              <Link href="/destinations" className="font-semibold text-lagoon underline">
                see every destination
              </Link>
              .
            </p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2">
              {results.map((destination) => (
                <li key={destination.slug}>
                  <DestinationCard destination={destination} />
                </li>
              ))}
            </ul>
          )}
        </section>
        <aside className="hidden lg:block">
          <MaldivesMap destinations={results} className="sticky top-6 h-[36rem] w-auto" />
        </aside>
      </div>
    </div>
  );
}
