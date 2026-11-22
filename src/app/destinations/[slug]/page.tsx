import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DestinationCard } from "@/components/destination/destination-card";
import { TypeIcon } from "@/components/destination/type-icon";
import { MaldivesMap } from "@/components/maldives-map";
import { JsonLd } from "@/components/seo/json-ld";
import {
  budgetLabels,
  describeMonths,
  destinations,
  getDestination,
  typeLabels,
} from "@/lib/destinations";
import { breadcrumbSchema, destinationSchema } from "@/lib/structured-data";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const destination = getDestination((await params).slug);
  if (!destination) return {};

  return {
    title: destination.name,
    description: destination.summary,
    alternates: { canonical: `/destinations/${destination.slug}` },
  };
}

export default async function DestinationPage({ params }: Props) {
  const destination = getDestination((await params).slug);
  if (!destination) notFound();

  const related = destinations
    .filter((d) => d.slug !== destination.slug && d.type === destination.type)
    .slice(0, 2);

  return (
    <div className="container-page py-12">
      <JsonLd data={destinationSchema(destination)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Destinations", path: "/destinations" },
          { name: destination.name, path: `/destinations/${destination.slug}` },
        ])}
      />
      <nav aria-label="Breadcrumb" className="mb-8 text-sm">
        <ol className="flex flex-wrap gap-2 text-muted">
          <li>
            <Link href="/destinations" className="underline hover:text-lagoon">
              Destinations
            </Link>
          </li>
          <li aria-current="page">
            <span aria-hidden="true">/ </span>
            {destination.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[1fr_auto]">
        <article className="space-y-8">
          <header className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-foam px-3 py-1 text-sm font-semibold text-lagoon">
              <TypeIcon type={destination.type} className="size-4" />
              {typeLabels[destination.type]}
            </p>
            <h1 className="font-display text-4xl font-semibold sm:text-5xl">{destination.name}</h1>
            <p className="text-lg text-muted">{destination.summary}</p>
          </header>

          <dl className="grid gap-4 rounded-3xl bg-white p-6 ring-1 ring-foam sm:grid-cols-3">
            <div>
              <dt className="text-sm text-muted">Atoll</dt>
              <dd className="font-semibold">{destination.atoll}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Best time to visit</dt>
              <dd className="font-semibold">{describeMonths(destination.bestMonths)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Budget</dt>
              <dd className="font-semibold">{budgetLabels[destination.budget]}</dd>
            </div>
          </dl>

          <div className="max-w-prose space-y-4">
            {destination.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <section aria-labelledby="highlights-heading" className="space-y-3">
            <h2 id="highlights-heading" className="font-display text-2xl font-semibold">
              Highlights
            </h2>
            <ul className="list-inside list-disc space-y-1">
              {destination.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="getting-there-heading" className="space-y-3">
            <h2 id="getting-there-heading" className="font-display text-2xl font-semibold">
              Getting there
            </h2>
            <p className="max-w-prose">{destination.gettingThere}</p>
          </section>

          <Link href={`/plan?destination=${destination.slug}`} className="btn-primary">
            Plan a trip to {destination.name}
          </Link>
        </article>

        <figure className="space-y-3">
          <MaldivesMap
            destinations={destinations}
            highlight={destination.slug}
            className="mx-auto h-[28rem] w-auto lg:h-[36rem]"
          />
          <figcaption className="mx-auto max-w-48 text-center text-sm text-muted">
            <span className="font-semibold text-coral">{destination.name}</span> is marked in coral.
            Schematic map, not to scale.
          </figcaption>
        </figure>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-16 space-y-6">
          <h2 id="related-heading" className="font-display text-2xl font-semibold">
            Similar places
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2">
            {related.map((item) => (
              <li key={item.slug}>
                <DestinationCard destination={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
