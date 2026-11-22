import { expect, test } from "@playwright/test";

function futureDate(daysAhead: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().slice(0, 10);
}

test("shows an error summary, keeps answers and focuses the summary", async ({ page }) => {
  await page.goto("/plan");
  await page.getByLabel("Email address").fill("not-an-email");
  await page.getByRole("button", { name: "Send enquiry" }).click();

  const summary = page.getByRole("alert").filter({ hasText: "problems with your enquiry" });
  await expect(summary).toBeFocused();
  await expect(summary.getByRole("link")).toHaveCount(4);
  await expect(page.getByLabel("Email address")).toHaveValue("not-an-email");
  await expect(page.getByLabel("Email address")).toHaveAttribute("aria-invalid", "true");

  // Error links move focus to the field.
  await summary.getByRole("link", { name: "Enter your name" }).click();
  await expect(page.getByLabel("Your name")).toBeFocused();
});

test("sends an enquiry from a destination page", async ({ page }) => {
  await page.goto("/destinations/thoddoo");
  await page.getByRole("link", { name: "Plan a trip to Thoddoo" }).click();
  await expect(page.getByLabel(/Destination/)).toHaveValue("thoddoo");

  await page.getByLabel("Your name").fill("Ayesha");
  await page.getByLabel("Email address").fill("ayesha@example.com");
  await page.getByLabel("Arrival date").fill(futureDate(30));
  await page.getByLabel("Budget (guesthouses)").check();
  await page.getByLabel("Snorkelling").check();
  await page.getByRole("button", { name: "Send enquiry" }).click();

  await expect(page.getByRole("heading", { name: "Thank you, Ayesha!" })).toBeFocused();
  await expect(page.getByTestId("enquiry-reference")).toHaveText(/^TM-[0-9A-F]{6}$/);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the form still validates and submits", async ({ page }) => {
    await page.goto("/plan");
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByText("There are 4 problems with your enquiry")).toBeVisible();

    await page.getByLabel("Your name").fill("Ayesha");
    await page.getByLabel("Email address").fill("ayesha@example.com");
    await page.getByLabel("Arrival date").fill(futureDate(30));
    await page.getByLabel("Mid-range").check();
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByTestId("enquiry-reference")).toBeVisible();
  });
});
