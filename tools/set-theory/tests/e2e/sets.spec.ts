import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const desktopOnly = (projectName: string) =>
  test.skip(projectName !== "sets-desktop", "This workflow is covered at the full desktop layout.");

const mobileOnly = (projectName: string) =>
  test.skip(projectName !== "sets-mobile", "This workflow specifically covers the drawer layout.");

async function waitForCompiledAtlas(page: Page) {
  await expect(page.getByRole("application", { name: "TypeScript set atlas" })).toBeVisible({ timeout: 30_000 });
  await expect(page.locator(".set-region").first()).toBeVisible();
  await expect(page.locator(".set-analysis-status")).toContainText("Compiler current");
}

async function replacePastedSource(page: Page, source: string) {
  const editor = page.getByLabel("Pasted TypeScript source");
  await editor.click();
  await editor.press("ControlOrMeta+A");
  await editor.fill(source);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("compiles pasted TypeScript, updates the atlas, and preserves the last valid result", async ({ page }, testInfo) => {
  desktopOnly(testInfo.project.name);
  await waitForCompiledAtlas(page);

  await expect(page.getByRole("heading", { name: "TypeScript sets" })).toBeVisible();
  await expect(page.getByText("Stop", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Signal", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Everything", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Nothing", { exact: true }).first()).toBeVisible();

  await replacePastedSource(page, `type Alpha = "shared" | "alpha";
type Beta = "shared" | "beta";
type Whole = Alpha | Beta;
type Empty = never;
`);

  const alphaRegion = page.locator(".set-region", { hasText: "Alpha" }).first();
  await expect(alphaRegion).toBeVisible({ timeout: 30_000 });
  await expect(page.locator(".set-region", { hasText: "Whole" }).first()).toBeVisible();
  await expect(page.locator(".set-analysis-status")).toContainText("Compiler current");

  await replacePastedSource(page, "type Alpha = ;");
  const staleBanner = page.getByRole("button", {
    name: "The source has errors. The canvas is preserving the last valid atlas.",
  });
  await expect(staleBanner).toBeVisible({ timeout: 30_000 });
  await expect(alphaRegion).toBeVisible();

  await staleBanner.click();
  await expect(page.getByRole("button", { name: /Issues [1-9]/ })).toHaveClass(/is-active/);
  await expect(page.locator(".set-diagnostics article.is-error").first()).toBeVisible();
});

test("persists library changes and opens type relationships in the inspector", async ({ page }, testInfo) => {
  desktopOnly(testInfo.project.name);
  await waitForCompiledAtlas(page);

  const title = page.getByLabel("CURRENT ATLAS");
  await title.fill("Stored relationships");
  await expect(page.locator(".set-document-list").getByText("Stored relationships", { exact: true })).toBeVisible();
  await page.reload();
  await waitForCompiledAtlas(page);
  await expect(page.getByLabel("CURRENT ATLAS")).toHaveValue("Stored relationships");

  await page.getByRole("button", { name: "Types", exact: true }).click();
  const stopType = page.locator(".set-type-groups button", { hasText: "Stop" }).first();
  await expect(stopType).toBeVisible();
  await stopType.click();
  await expect(page.getByRole("heading", { name: "Stop", exact: true })).toBeVisible();
  await expect(page.locator(".set-type-card code")).toContainText("red");
  await expect(page.locator(".set-relation-list article").first()).toBeVisible();

  await page.getByRole("button", { name: "Atlases", exact: true }).click();
  const documents = page.locator(".set-document-list > button");
  await expect(documents).toHaveCount(1);
  await page.getByRole("button", { name: "New atlas" }).click();
  await expect(page.getByLabel("CURRENT ATLAS")).toHaveValue("Untitled set atlas");
  await expect(documents).toHaveCount(2);
  await page.getByRole("button", { name: "Duplicate" }).click();
  await expect(page.getByLabel("CURRENT ATLAS")).toHaveValue("Untitled set atlas copy");
  await expect(documents).toHaveCount(3);

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(documents).toHaveCount(2);
});

test("uses accessible library and inspector drawers on mobile", async ({ page }, testInfo) => {
  mobileOnly(testInfo.project.name);
  await waitForCompiledAtlas(page);

  const libraryShell = page.locator(".set-panel-shell--library");
  await page.getByRole("button", { name: "Library", exact: true }).click();
  await expect(libraryShell).toHaveClass(/is-open/);
  await expect(libraryShell.getByRole("heading", { name: "TypeScript sets" })).toBeVisible();
  await libraryShell.getByRole("button", { name: "Close" }).click();
  await expect(libraryShell).not.toHaveClass(/is-open/);

  const inspectorShell = page.locator(".set-panel-shell--inspector");
  await page.getByRole("button", { name: "Inspector", exact: true }).click();
  await expect(inspectorShell).toHaveClass(/is-open/);
  await expect(inspectorShell.getByRole("heading", { name: "TypeScript source" })).toBeVisible();
  await expect(inspectorShell.getByRole("button", { name: "Paste" })).toHaveClass(/is-active/);
  await inspectorShell.getByRole("button", { name: "Close" }).click();
  await expect(inspectorShell).not.toHaveClass(/is-open/);
});

test("has no serious or critical accessibility violations", async ({ page }) => {
  await waitForCompiledAtlas(page);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  const severe = results.violations.filter(({ impact }) => impact === "serious" || impact === "critical");
  expect(severe).toEqual([]);
});
