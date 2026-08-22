import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("authors the seeded factory topology and exports its portable JSON", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await expect(page.getByLabel("Choose a topology")).toHaveValue("factory-layer-topology");
  await expect(page.getByLabel("Topology name")).toHaveValue("Factory layer topology");

  const layers = page.locator(".topology-layer-card");
  await expect(layers).toHaveCount(5);
  await expect(layers.nth(0).locator("input[aria-label='Layer 1 name']")).toHaveValue("Apps");
  await expect(layers.nth(4).locator("input[aria-label='Layer 5 name']")).toHaveValue("Platform");

  // The factory seed ships ten "may depend on" links.
  await expect(page.locator(".topology-links-list .topology-link-row")).toHaveCount(10);

  // Author a new layer and a node inside it.
  await page.getByRole("button", { name: "Add layer" }).click();
  await expect(page.locator(".topology-layer-card")).toHaveCount(6);
  await page.locator("input[aria-label='Layer 6 name']").fill("Delivery");
  await page.getByRole("button", { name: "+ node in Delivery" }).click();
  await expect(page.locator(".topology-node-list li")).toHaveCount(6);

  // Export the portable JSON and confirm it carries the authored content.
  await page.getByText("Export", { exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Portable JSON (for gen)" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).not.toBeNull();
  const json = JSON.parse(await readFile(path as string, "utf8"));
  expect(json.layers.map((layer: { name: string }) => layer.name)).toContain("Delivery");
  expect(json.nodes).toHaveLength(6);

  expect(errors).toEqual([]);
});

test("has no serious or critical accessibility violations", async ({ page }) => {
  await expect(page.locator(".topology-layer-card").first()).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  const severe = results.violations.filter(({ impact }) => impact === "serious" || impact === "critical");
  expect(severe).toEqual([]);
});
