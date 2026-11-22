import Link from "next/link";

import { budgetLabels, describeMonths, typeLabels, type Destination } from "@/lib/destinations";

import { TypeIcon } from "./type-icon";

export function DestinationCard({
  destination,
  headingLevel = "h3",
}: {
  destination: Destination;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;

  return (
    <article className="relative flex h-full flex-col gap-3 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-foam transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-foam px-3 py-1 text-xs font-semibold text-lagoon">
          <TypeIcon type={destination.type} className="size-4" />
          {typeLabels[destination.type]}
        </span>
        <span className="text-xs font-medium text-muted">{budgetLabels[destination.budget]}</span>
      </div>
      <Heading className="font-display text-2xl font-semibold">
        <Link href={`/destinations/${destination.slug}`} className="after:absolute after:inset-0">
          {destination.name}
        </Link>
      </Heading>
      <p className="text-sm text-muted">{destination.atoll}</p>
      <p className="flex-1">{destination.summary}</p>
      <p className="text-sm">
        <span className="font-semibold">Best time:</span> {describeMonths(destination.bestMonths)}
      </p>
    </article>
  );
}
