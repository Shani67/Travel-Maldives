"use server";

import { randomBytes } from "node:crypto";

import { todayInMaldives } from "@/lib/dates";
import { readEnquiryForm, validateEnquiry, type EnquiryState } from "@/lib/enquiry/schema";

export async function submitEnquiry(
  _previous: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  // Honeypot: real people never see or fill this field, simple bots usually do.
  if (formData.get("website")) {
    return { status: "success", reference: "TM-000000", name: "" };
  }

  const values = readEnquiryForm(formData);
  const result = validateEnquiry(values, todayInMaldives());

  if (!result.success) {
    return { status: "error", errors: result.errors, values };
  }

  // This is a portfolio demo, so nothing is stored or emailed. A real build would send the
  // enquiry to a CRM or email service here.
  const reference = `TM-${randomBytes(3).toString("hex").toUpperCase()}`;
  return { status: "success", reference, name: result.data.name };
}
