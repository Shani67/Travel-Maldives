import { describe, expect, it } from "vitest";

import { readEnquiryForm, validateEnquiry } from "../schema";

const today = "2026-11-22";

const valid = {
  name: "Ayesha Perera",
  email: "ayesha@example.com",
  destination: "maafushi",
  arrival: "2026-12-20",
  nights: "7",
  travellers: "2",
  budget: "budget",
  interests: ["snorkelling", "culture"],
  message: "Our first trip to the Maldives.",
};

describe("validateEnquiry", () => {
  it("accepts a complete enquiry and converts numbers", () => {
    const result = validateEnquiry(valid, today);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.nights).toBe(7);
      expect(result.data.travellers).toBe(2);
    }
  });

  it("returns one readable message per invalid field", () => {
    const result = validateEnquiry(
      { ...valid, name: " ", email: "not-an-email", nights: "0", budget: "" },
      today,
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toEqual({
        name: "Enter your name",
        email: "Enter an email address in the format name@example.com",
        nights: "Stay at least 1 night",
        budget: "Choose a budget",
      });
    }
  });

  it("rejects arrival dates in the past but allows today", () => {
    expect(validateEnquiry({ ...valid, arrival: "2026-11-21" }, today).success).toBe(false);
    expect(validateEnquiry({ ...valid, arrival: today }, today).success).toBe(true);
  });

  it("rejects unknown destinations and interests from tampered requests", () => {
    expect(validateEnquiry({ ...valid, destination: "atlantis" }, today).success).toBe(false);
    expect(validateEnquiry({ ...valid, interests: ["hacking"] }, today).success).toBe(false);
  });

  it("allows an enquiry without a chosen destination", () => {
    expect(validateEnquiry({ ...valid, destination: "" }, today).success).toBe(true);
  });
});

describe("readEnquiryForm", () => {
  it("reads repeated checkbox values and ignores files", () => {
    const formData = new FormData();
    formData.append("name", "Ayesha");
    formData.append("interests", "diving");
    formData.append("interests", "surfing");
    formData.append("email", new Blob(["x"]));

    expect(readEnquiryForm(formData)).toMatchObject({
      name: "Ayesha",
      email: "",
      interests: ["diving", "surfing"],
    });
  });
});
