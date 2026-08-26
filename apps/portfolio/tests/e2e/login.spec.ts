import { expect, test } from "@playwright/test";

test("loads Supabase only after visiting the private login route", async ({ page }) => {
  const requestedUrls: string[] = [];
  page.on("request", (request) => requestedUrls.push(request.url()));

  for (const route of ["/", "/writing", "/brand"]) {
    await page.goto(route);
    await expect(page.locator("body")).toBeVisible();
  }

  expect(requestedUrls.some((url) => /login\.lazy-[^/]+\.js(?:\?|$)/.test(url))).toBe(false);
  expect(requestedUrls.some((url) => /\.supabase\.co(?:\/|$)/.test(url))).toBe(false);

  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Owner login" })).toBeVisible();
  expect(requestedUrls.some((url) => /login\.lazy-[^/]+\.js(?:\?|$)/.test(url))).toBe(true);
});
