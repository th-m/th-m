import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/writing",
  "/writing/vision-and-values",
  "/brand",
  "/design-system",
  "/laws",
  "/relationship-graph",
];

test.describe("mobile accessibility and reflow", () => {
  for (const width of [390, 320]) {
    test(`${width}px routes reflow without serious accessibility violations`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "mobile", "Mobile viewport contract");
      test.slow();
      await page.setViewportSize({ width, height: 844 });
      for (const route of routes) {
        await page.goto(route);
        if (route === "/relationship-graph") {
          await expect(page.locator(".graph-canvas-surface canvas")).toBeVisible({ timeout: 20_000 });
        }
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
          ),
          `${route} overflows at ${width}px`,
        ).toBe(false);
        const results = await new AxeBuilder({ page }).analyze();
        expect(
          results.violations.filter((violation) =>
            ["serious", "critical"].includes(violation.impact ?? ""),
          ),
          `${route} accessibility at ${width}px`,
        ).toEqual([]);
      }
    });
  }

  test("home graph, law filters, tools, and footer remain usable at phone width", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "Mobile viewport contract");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const nodes = page.locator(".home-graph__node");
    await expect(nodes).toHaveCount(6);
    for (const bounds of await nodes.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().toJSON()),
    )) {
      expect(bounds.left).toBeGreaterThanOrEqual(0);
      expect(bounds.right).toBeLessThanOrEqual(390);
    }

    const tools = page.locator(".site-header-tools");
    await expect(tools).toBeVisible();
    await expect(page.locator(".tool-drawer-tab")).toBeHidden();
    expect(await tools.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);

    await page.goto("/laws");
    const firstFilter = page.locator(".home-laws__pill").first();
    await expect(firstFilter).toHaveAttribute("aria-pressed", "false");
    expect(await firstFilter.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    await firstFilter.click();
    await expect(firstFilter).toHaveAttribute("aria-pressed", "true");
    expect(await firstFilter.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe("rgba(0, 0, 0, 0)");

    await page.goto("/");

    const dock = page.locator(".site-dock");
    await expect(dock).toBeVisible();
    expect(await dock.evaluate((element) => getComputedStyle(element).position)).toBe("static");

    await tools.focus();
    await tools.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(tools).toBeFocused();
  });
});
