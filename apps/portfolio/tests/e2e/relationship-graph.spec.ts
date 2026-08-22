import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/relationship-graph");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("mounts the full editor from the seeded library and exports a canvas PNG", async ({
  page,
}) => {
  test.slow();
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await expect(page.getByText("Opening the graph editor…").first()).toBeVisible();
  await expect(page.locator(".graph-canvas-surface canvas")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole("button", { name: /^Edit / })).toHaveCount(12);
  await expect(page.getByRole("button", { name: "+ Proposition" })).toBeVisible();

  await page.getByRole("button", { name: "+ Proposition" }).click();
  await expect(page.getByRole("button", { name: /^Edit / })).toHaveCount(13);

  await page.getByText("Export", { exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Canvas PNG" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.png$/);

  expect(errors).toEqual([]);
});

test("explores the weather graph from the tool drawer", async ({ page }) => {
  test.slow();
  await page.goto("/");
  await page.getByRole("button", { name: "Open tool drawer" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.getByRole("button", { name: "Relationship graph" }).click();
  await expect(page.getByRole("heading", { name: "Relationship graph" })).toBeVisible();

  const canvas = page.locator(".graph-explorer__canvas");
  await expect(canvas).toBeVisible();
  await expect(canvas.locator("canvas")).toBeVisible({ timeout: 20_000 });
  await expect(canvas.getByRole("button", { name: /^Select / })).toHaveCount(12);

  await canvas.getByRole("button", { name: "Select Temperature is 85°F" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Temperature is 85°F" })).toBeVisible();
  await expect(
    page.locator(".graph-explorer__detail").getByText("It feels warm and muggy outside", { exact: true }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Clear" }).click();
  await expect(page.getByRole("heading", { name: "Temperature is 85°F" })).not.toBeVisible();
});

test("has no serious or critical accessibility violations on the graph route", async ({
  page,
}) => {
  await expect(page.getByRole("button", { name: /^Edit / })).toHaveCount(12);
  const results = await new AxeBuilder({ page }).analyze();
  const violations = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );
  expect(violations).toEqual([]);
});
