import { devices, type Project } from "@playwright/test";

export const desktopChromeProject = (name = "desktop"): Project => ({
  name,
  use: { ...devices["Desktop Chrome"] },
});

export const mobileChromeProject = (name = "mobile"): Project => ({
  name,
  use: {
    browserName: "chromium",
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
});
