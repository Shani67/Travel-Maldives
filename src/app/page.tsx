import Link from "next/link";

import { DestinationCard } from "@/components/destination/destination-card";
import { HeroVideo } from "@/components/hero-video";
import { MaldivesMap } from "@/components/maldives-map";
import { destinations, getDestination, typeLabels, destinationTypes } from "@/lib/destinations";

const featuredSlugs = ["maafushi", "baa-atoll", "fuvahmulah"];

export default function HomePage() {
  const featured = featuredSlugs.map((slug) => getDestination(slug)!);

  return (
    <>
      <section className="relative isolate flex min-h-[70vh] items-end overflow-hidden bg-ocean">
        <HeroVideo />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ocean/90 via-ocean/40 to-transparent"
          aria-hidden="true"
        />
        <div className="relative container-page space-y-6 pt-32 pb-20 text-white">
          <p className="text-sm font-semibold tracking-widest uppercase">
            1,192 islands. 26 atolls.
          </p>
          <h1 className="max-w-2xl font-display text-4xl leading-tight font-semibold sm:text-6xl">
            Find the Maldives that fits your trip
          </h1>
          <p className="max-w-xl text-lg text-white/90">
            Compare local islands, resort atolls and dive sites by budget and season, then send us
            your trip idea.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/destinations" className="btn-primary">
              Explore destinations
            </Link>
            <Link href="/plan" className="btn-secondary">
              Plan a trip
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="featured-heading" className="container-page py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 id="featured-heading" className="font-display text-3xl font-semibold">
            Three ways to see the Maldives
          </h2>
          <Link href="/destinations" className="text-sm font-semibold text-lagoon underline">
            All destinations
          </Link>
        </div>
        <ul className="grid gap-6 md:grid-cols-3">
          {featured.map((destination) => (
            <li key={destination.slug}>
              <DestinationCard destination={destination} />
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="types-heading"
        className="container-page grid items-start gap-10 py-16 md:grid-cols-[1fr_auto]"
      >
        <div className="space-y-6">
          <h2 id="types-heading" className="font-display text-3xl font-semibold">
            From the capital to the equator
          </h2>
          <p className="max-w-prose text-muted">
            The Maldives stretches nearly 900 kilometres from north to south. Choose what kind of
            trip you want and we&apos;ll show you where to go.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {destinationTypes.map((type) => (
              <li key={type}>
                <Link
                  href={`/destinations?type=${type}`}
                  className="block rounded-2xl bg-white p-4 font-semibold ring-1 ring-foam hover:ring-lagoon"
                >
                  {typeLabels[type]}
                  <span className="block text-sm font-normal text-muted">
                    {destinations.filter((d) => d.type === type).length} places
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <MaldivesMap destinations={destinations} className="mx-auto h-[28rem] w-auto" />
      </section>
    </>
  );
}
