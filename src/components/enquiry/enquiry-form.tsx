"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";

import { submitEnquiry } from "@/app/plan/actions";
import type { Destination } from "@/lib/destinations";
import {
  budgetOptions,
  enquiryFields,
  interestOptions,
  type EnquiryField,
  type EnquiryState,
} from "@/lib/enquiry/schema";

const fieldLabels: Record<EnquiryField, string> = {
  name: "Your name",
  email: "Email address",
  destination: "Destination",
  arrival: "Arrival date",
  nights: "Number of nights",
  travellers: "Number of travellers",
  budget: "Budget",
  interests: "Interests",
  message: "Anything else we should know?",
};

// Checkbox and radio groups are focused through their first option.
const focusTarget: Partial<Record<EnquiryField, string>> = {
  budget: `budget-${budgetOptions[0].value}`,
  interests: `interests-${interestOptions[0].value}`,
};

type Props = {
  destinations: Pick<Destination, "slug" | "name">[];
  defaultDestination?: string;
  minDate: string;
};

export function EnquiryForm({ destinations, defaultDestination, minDate }: Props) {
  const [state, formAction, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, {
    status: "idle",
  });
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the result so keyboard and screen reader users know what happened.
  useEffect(() => {
    if (state.status === "error") summaryRef.current?.focus();
    if (state.status === "success") successRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div className="space-y-4 rounded-3xl bg-white p-8 ring-1 ring-foam">
        <h2 ref={successRef} tabIndex={-1} className="font-display text-3xl font-semibold">
          Thank you{state.name ? `, ${state.name}` : ""}!
        </h2>
        <p>
          Your enquiry reference is{" "}
          <strong data-testid="enquiry-reference">{state.reference}</strong>.
        </p>
        <p className="text-sm text-muted">
          This is a portfolio demo: your details were checked on the server but not stored or sent.
        </p>
        <Link href="/destinations" className="btn-secondary">
          Keep exploring
        </Link>
      </div>
    );
  }

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : {};
  const text = (field: EnquiryField, fallback = "") =>
    typeof values[field] === "string" ? (values[field] as string) : fallback;
  const chosen = (field: EnquiryField) =>
    Array.isArray(values[field]) ? (values[field] as string[]) : [];
  const errorProps = (field: EnquiryField) =>
    errors[field] ? { "aria-invalid": true, "aria-describedby": `${field}-error` } : {};
  const errorText = (field: EnquiryField) =>
    errors[field] ? (
      <p id={`${field}-error`} className="text-sm font-medium text-coral">
        <span className="sr-only">Error: </span>
        {errors[field]}
      </p>
    ) : null;

  const errorList = enquiryFields.filter((field) => errors[field]);
  // Re-mount the form after each submission so defaultValue reflects the returned values.
  const formKey = state.status === "error" ? JSON.stringify(values) : "initial";

  return (
    <form key={formKey} action={formAction} noValidate className="space-y-8">
      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="error-summary-heading"
          className="space-y-2 rounded-2xl border-2 border-coral bg-white p-5"
        >
          <h2 id="error-summary-heading" className="font-semibold">
            There {errorList.length === 1 ? "is a problem" : `are ${errorList.length} problems`}{" "}
            with your enquiry
          </h2>
          <ul className="list-inside list-disc space-y-1">
            {errorList.map((field) => (
              <li key={field}>
                <a href={`#${focusTarget[field] ?? field}`} className="text-coral underline">
                  {errors[field]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="name" className="font-semibold">
            {fieldLabels.name}
          </label>
          {errorText("name")}
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            defaultValue={text("name")}
            className="field"
            {...errorProps("name")}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className="font-semibold">
            {fieldLabels.email}
          </label>
          {errorText("email")}
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={text("email")}
            className="field"
            {...errorProps("email")}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="destination" className="font-semibold">
            {fieldLabels.destination} <span className="font-normal text-muted">(optional)</span>
          </label>
          {errorText("destination")}
          <select
            id="destination"
            name="destination"
            defaultValue={text("destination", defaultDestination ?? "")}
            className="field"
            {...errorProps("destination")}
          >
            <option value="">Not sure yet, help me choose</option>
            {destinations.map((destination) => (
              <option key={destination.slug} value={destination.slug}>
                {destination.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="arrival" className="font-semibold">
            {fieldLabels.arrival}
          </label>
          {errorText("arrival")}
          <input
            id="arrival"
            name="arrival"
            type="date"
            min={minDate}
            required
            defaultValue={text("arrival")}
            className="field"
            {...errorProps("arrival")}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="nights" className="font-semibold">
            {fieldLabels.nights}
          </label>
          {errorText("nights")}
          <input
            id="nights"
            name="nights"
            type="number"
            inputMode="numeric"
            min={1}
            max={60}
            required
            defaultValue={text("nights", "7")}
            className="field"
            {...errorProps("nights")}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="travellers" className="font-semibold">
            {fieldLabels.travellers}
          </label>
          {errorText("travellers")}
          <input
            id="travellers"
            name="travellers"
            type="number"
            inputMode="numeric"
            min={1}
            max={20}
            required
            defaultValue={text("travellers", "2")}
            className="field"
            {...errorProps("travellers")}
          />
        </div>
      </div>

      <fieldset
        className="space-y-3"
        {...(errors.budget ? { "aria-describedby": "budget-error" } : {})}
      >
        <legend className="font-semibold">{fieldLabels.budget}</legend>
        {errorText("budget")}
        <div className="flex flex-wrap gap-3">
          {budgetOptions.map((option) => (
            <label
              key={option.value}
              htmlFor={`budget-${option.value}`}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-foam has-checked:ring-2 has-checked:ring-lagoon"
            >
              <input
                id={`budget-${option.value}`}
                type="radio"
                name="budget"
                value={option.value}
                defaultChecked={text("budget") === option.value}
                className="size-4 accent-lagoon"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset
        className="space-y-3"
        {...(errors.interests ? { "aria-describedby": "interests-error" } : {})}
      >
        <legend className="font-semibold">
          {fieldLabels.interests} <span className="font-normal text-muted">(optional)</span>
        </legend>
        {errorText("interests")}
        <div className="flex flex-wrap gap-3">
          {interestOptions.map((option) => (
            <label
              key={option.value}
              htmlFor={`interests-${option.value}`}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-foam has-checked:ring-2 has-checked:ring-lagoon"
            >
              <input
                id={`interests-${option.value}`}
                type="checkbox"
                name="interests"
                value={option.value}
                defaultChecked={chosen("interests").includes(option.value)}
                className="size-4 accent-lagoon"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1">
        <label htmlFor="message" className="font-semibold">
          {fieldLabels.message} <span className="font-normal text-muted">(optional)</span>
        </label>
        {errorText("message")}
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={1000}
          defaultValue={text("message")}
          className="field h-auto py-2"
          {...errorProps("message")}
        />
      </div>

      {/* Honeypot for spam bots, hidden from people and assistive technology. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
