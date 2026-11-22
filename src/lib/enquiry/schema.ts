import { z } from "zod";

import { destinations } from "@/lib/destinations";

export const interestOptions = [
  { value: "snorkelling", label: "Snorkelling" },
  { value: "diving", label: "Diving" },
  { value: "surfing", label: "Surfing" },
  { value: "culture", label: "Local culture" },
  { value: "relaxing", label: "Relaxing on the beach" },
] as const;

export const budgetOptions = [
  { value: "budget", label: "Budget (guesthouses)" },
  { value: "mid-range", label: "Mid-range" },
  { value: "luxury", label: "Luxury resort" },
] as const;

const slugs = destinations.map((destination) => destination.slug) as [string, ...string[]];
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates an enquiry on the server. `today` is passed in (YYYY-MM-DD) so the rule
 * "arrival cannot be in the past" is easy to test.
 */
export function createEnquirySchema(today: string) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, "Enter your name")
      .max(80, "Name must be 80 characters or fewer"),
    email: z.string().trim().email("Enter an email address in the format name@example.com"),
    destination: z.union([z.enum(slugs), z.literal("")]).optional(),
    arrival: z
      .string()
      .regex(isoDate, "Enter your arrival date")
      .refine((value) => value >= today, "Arrival date must be today or in the future"),
    nights: z.coerce
      .number({ error: "Enter the number of nights" })
      .int("Enter a whole number of nights")
      .min(1, "Stay at least 1 night")
      .max(60, "For stays over 60 nights, mention it in your message"),
    travellers: z.coerce
      .number({ error: "Enter the number of travellers" })
      .int("Enter a whole number of travellers")
      .min(1, "At least 1 person must travel")
      .max(20, "For groups over 20, mention it in your message"),
    budget: z.enum(budgetOptions.map((option) => option.value) as [string, ...string[]], {
      error: "Choose a budget",
    }),
    interests: z
      .array(z.enum(interestOptions.map((option) => option.value) as [string, ...string[]]))
      .default([]),
    message: z.string().trim().max(1000, "Message must be 1,000 characters or fewer").default(""),
  });
}

export type Enquiry = z.infer<ReturnType<typeof createEnquirySchema>>;
export type EnquiryField = keyof Enquiry;

/** Field order, used to list errors in the same order as the form. */
export const enquiryFields: EnquiryField[] = [
  "name",
  "email",
  "destination",
  "arrival",
  "nights",
  "travellers",
  "budget",
  "interests",
  "message",
];

export type EnquiryState =
  | { status: "idle" }
  | {
      status: "error";
      errors: Partial<Record<EnquiryField, string>>;
      values: Record<string, string | string[]>;
    }
  | { status: "success"; reference: string; name: string };

export function readEnquiryForm(formData: FormData): Record<string, string | string[]> {
  const value = (key: string) => {
    const entry = formData.get(key);
    return typeof entry === "string" ? entry : "";
  };

  return {
    name: value("name"),
    email: value("email"),
    destination: value("destination"),
    arrival: value("arrival"),
    nights: value("nights"),
    travellers: value("travellers"),
    budget: value("budget"),
    interests: formData
      .getAll("interests")
      .filter((entry): entry is string => typeof entry === "string"),
    message: value("message"),
  };
}

export function validateEnquiry(
  values: Record<string, string | string[]>,
  today: string,
):
  | { success: true; data: Enquiry }
  | { success: false; errors: Partial<Record<EnquiryField, string>> } {
  const result = createEnquirySchema(today).safeParse(values);
  if (result.success) return { success: true, data: result.data };

  const errors: Partial<Record<EnquiryField, string>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as EnquiryField;
    errors[field] ??= issue.message;
  }
  return { success: false, errors };
}
