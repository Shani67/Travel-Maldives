import { expect, test } from "@playwright/test";

test("filters destinations and keeps the filters in the URL", async ({ page }) => {
  await page.goto("/destinations");
  await expect(page.getByRole("heading", { name: "9 destinations" })).toBeVisible();

  await page.getByLabel("Trip type").selectOption("local-island");
  await page.getByLabel("Budget up to").selectOption("1");
  await page.getByRole("button", { name: "Show results" }).click();

  await expect(page).toHaveURL(/type=local-island/);
  await expect(page).toHaveURL(/budget=1/);
  await expect(
    page.getByRole("heading", { name: "3 destinations match your filters" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Maafushi" })).toBeVisible();

  await page.getByRole("link", { name: "Clear filters" }).click();
  await expect(page.getByRole("heading", { name: "9 destinations" })).toBeVisible();
});

test("searching for manta rays finds Baa Atoll", async ({ page }) => {
  await page.goto("/destinations");
  await page.getByRole("searchbox", { name: "Search" }).fill("manta");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "1 destination match your filters" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Baa Atoll and Hanifaru Bay" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Baa Atoll and Hanifaru Bay" }),
  ).toBeVisible();
  await expect(page.getByText("June to November")).toBeVisible();
});

test("shows a helpful empty state", async ({ page }) => {
  await page.goto("/destinations?type=resort&budget=1");
  await expect(page.getByText("Nothing matches those filters.")).toBeVisible();
});

test("ignores invalid filter values in the URL", async ({ page }) => {
  await page.goto("/destinations?type=spaceship&month=99");
  await expect(page.getByRole("heading", { name: "9 destinations" })).toBeVisible();
});

test("unknown destinations return 404", async ({ page }) => {
  const response = await page.goto("/destinations/atlantis");
  expect(response?.status()).toBe(404);
});

test("SEO essentials are present", async ({ page, request }) => {
  await page.goto("/destinations/fuvahmulah");
  await expect(page).toHaveTitle("Fuvahmulah | Travel Maldives");
  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(jsonLd.some((text) => text.includes('"@type":"TouristDestination"'))).toBe(true);
  expect(await (await request.get("/sitemap.xml")).text()).toContain("/destinations/fuvahmulah");
});
