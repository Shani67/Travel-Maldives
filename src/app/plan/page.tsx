import type { Metadata } from "next";

import { EnquiryForm } from "@/components/enquiry/enquiry-form";
import { todayInMaldives } from "@/lib/dates";
import { destinations, getDestination } from "@/lib/destinations";

export const metadata: Metadata = {
  title: "Plan a trip",
  description: "Tell us your dates, budget and interests and we'll suggest the right islands.",
  alternates: { canonical: "/plan" },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function PlanPage({ searchParams }: Props) {
  const { destination } = await searchParams;
  const preselected =
    typeof destination === "string" ? getDestination(destination)?.slug : undefined;

  return (
    <div className="container-page max-w-3xl space-y-8 py-12">
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-semibold">Plan a trip</h1>
        <p className="text-muted">
          Tell us a little about your trip. All fields are required unless marked optional.
        </p>
      </header>
      <EnquiryForm
        destinations={destinations.map(({ slug, name }) => ({ slug, name }))}
        defaultDestination={preselected}
        minDate={todayInMaldives()}
      />
    </div>
  );
}
