import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

test.beforeEach(async ({ page }) => {
  await page.goto("/relationship-graph");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("mounts the full editor from the seeded library and exports a graph SVG", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await expect(page.getByText("Opening the graph editor…").first()).toBeVisible();
  await expect(page.locator(".react-flow__node-proposition")).toHaveCount(6);
  await expect(page.locator(".react-flow__node-relationship")).toHaveCount(6);
  await expect(page.getByRole("button", { name: "+ Proposition" })).toBeVisible();

  await page.getByRole("button", { name: "+ Proposition" }).click();
  await expect(page.locator(".react-flow__node-proposition")).toHaveCount(7);

  await page.getByText("Export", { exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Graph SVG" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).not.toBeNull();
  const svg = await readFile(path as string, "utf8");
  expect(svg).toContain("data:font/woff2;base64,");
  expect(svg).toContain('aria-labelledby="title description"');

  expect(errors).toEqual([]);
});

test("explores the weather graph from the tool drawer", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open tool drawer" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.getByRole("button", { name: "Relationship graph" }).click();
  await expect(page.getByRole("heading", { name: "Relationship graph" })).toBeVisible();

  const canvas = page.locator(".graph-explorer__canvas");
  await expect(canvas).toBeVisible();
  await expect(canvas.locator(".react-flow__node-proposition")).toHaveCount(6);
  await expect(page.getByText(/^Balanced/)).toBeVisible({ timeout: 20_000 });

  await canvas.locator(".graph-proposition-statement", { hasText: "Temperature is 85°F" }).click();
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
  await expect(page.locator(".react-flow__node-proposition")).toHaveCount(6);
  const results = await new AxeBuilder({ page }).analyze();
  const violations = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );
  expect(violations).toEqual([]);
});
