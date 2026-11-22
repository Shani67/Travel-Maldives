import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/destinations",
  "/destinations?type=dive-site",
  "/destinations/baa-atoll",
  "/plan",
];

for (const path of pages) {
  test(`${path} has no WCAG 2.2 AA violations`, async ({ page }) => {
    await page.goto(path);
    await page.locator("main").waitFor();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(
      results.violations.map(({ id, help, nodes }) => ({ id, help, count: nodes.length })),
    ).toEqual([]);
  });
}

test("the form error state has no WCAG 2.2 AA violations", async ({ page }) => {
  await page.goto("/plan");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("heading", { name: /problems with your enquiry/ })).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .analyze();
  expect(results.violations.map(({ id }) => id)).toEqual([]);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("hero video does not autoplay and can be started", async ({ page }) => {
    await page.goto("/");
    const video = page.locator("video");
    await expect(page.getByRole("button", { name: "Play video" })).toBeVisible();
    expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  });
});
