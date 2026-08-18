import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("authors the seeded weather graph and exports it offline", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await expect(page.getByRole("heading", { name: "Proposition graphs" })).toBeVisible();
  await expect(page.locator(".react-flow__node-proposition")).toHaveCount(6);
  await expect(page.locator(".react-flow__node-relationship")).toHaveCount(6);
  await expect(page.getByText("It feels warm and muggy outside", { exact: true })).toBeVisible();
  await expect(page.getByText("Sunset exposes beauty in glowing Kolob", { exact: true })).toBeVisible();
  await expect(page.getByText(/Ambivalent Iris bends above Kolob/)).toBeVisible();

  await page.getByText("Humidity is 24%", { exact: true }).dblclick();
  const inlineEditor = page.getByLabel("Edit statement");
  await inlineEditor.fill("Humidity is twenty-four percent");
  await inlineEditor.press("ControlOrMeta+Enter");
  await expect(page.locator(".graph-proposition-statement", { hasText: "Humidity is twenty-four percent" })).toBeVisible();

  await page.getByRole("button", { name: "Directional" }).click();
  await expect(page.getByRole("button", { name: "Directional" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Balanced", { exact: true })).toBeVisible({ timeout: 20_000 });

  await page.getByText("Heat gathers beneath the jacket", { exact: true }).click();
  await expect(page.getByLabel("Arrow direction for He is wet from sweat, but not from rain.")).toHaveValue("node");

  await page.locator(".graph-proposition-statement", { hasText: "Temperature is 85°F" }).click();
  await page
    .locator(".graph-proposition-statement", { hasText: "Humidity is twenty-four percent" })
    .click({ modifiers: ["ControlOrMeta"] });
  const relationButton = page.getByRole("button", { name: /Relationship \(2\)/ });
  await expect(relationButton).toBeEnabled();
  await relationButton.click();
  await expect(page.locator(".react-flow__node-relationship")).toHaveCount(7);

  await page.getByText("Export", { exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Graph SVG" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).not.toBeNull();
  const svg = await readFile(path as string, "utf8");
  expect(svg).toContain("data:font/woff2;base64,");
  expect(svg).toContain('aria-labelledby="title description"');
  expect(svg).toContain("Sunset exposes beauty in glowing Kolob");

  expect(errors).toEqual([]);
});

test("has no serious or critical accessibility violations", async ({ page }) => {
  await expect(page.locator(".react-flow__node").first()).toBeVisible();
  const results = await new AxeBuilder({ page })
    .exclude(".react-flow__minimap")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  const severe = results.violations.filter(({ impact }) => impact === "serious" || impact === "critical");
  expect(severe).toEqual([]);
});
