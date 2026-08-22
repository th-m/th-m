import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open tool drawer" }).click();
  await page.getByRole("button", { name: "Set atlas" }).click();
  await expect(page.getByRole("heading", { name: "Set atlas" })).toBeVisible();
});

test("explores a curated TypeScript set atlas from the tool drawer", async ({ page }) => {
  const explorer = page.getByLabel("Set atlas explorer");
  await expect(explorer).toBeVisible();
  const figure = page.getByRole("figure", { name: "Traffic light" });
  await expect(figure).toBeVisible();
  await expect(figure.locator("svg")).toBeVisible();

  await page.getByLabel("Choose a TypeScript snippet").selectOption({ label: "TypeScript is set theory" });
  await expect(page.getByRole("figure", { name: "TypeScript is set theory" })).toBeVisible();

  const region = page.locator(".set-region").first();
  await region.focus();
  await region.press("Enter");
  await expect(page.locator(".set-figure__detail h3").first()).toBeVisible();
});

test("has no serious or critical accessibility violations in the set atlas tool", async ({
  page,
}) => {
  await expect(page.locator(".set-figure svg")).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  const violations = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );
  expect(violations).toEqual([]);
});
