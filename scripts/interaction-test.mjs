import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(process.env.SITE_URL || "http://127.0.0.1:3000", {
  waitUntil: "networkidle",
});
await page.locator(".hero-scene-loader").hover({ position: { x: 40, y: 40 } });
await expect(page.locator(".hero-art .is-ready")).toBeVisible();
const hero = page.locator(".hero-art canvas");
const initial = await hero.screenshot();
const bounds = await hero.boundingBox();
await page.mouse.move(
  bounds.x + bounds.width * 0.3,
  bounds.y + bounds.height * 0.4,
);
await page.mouse.move(
  bounds.x + bounds.width * 0.8,
  bounds.y + bounds.height * 0.7,
  { steps: 20 },
);
await page.waitForTimeout(500);
expect((await hero.screenshot()).equals(initial)).toBe(false);
await page.locator(".hero-art .box-scene").focus();
await page.keyboard.press("ArrowUp");
await page.keyboard.press("ArrowRight");
await page.screenshot({ path: "test-results/rotation.png" });
const grid = page.locator(".engineering-grid");
async function scrollToProgress(p) {
  await page.evaluate((progress) => {
    const region = document.querySelector(".engineering-scroll");
    const grid = document.querySelector(".engineering-grid");
    window.scrollTo({
      top:
        region.getBoundingClientRect().top +
        window.scrollY -
        90 +
        progress * (region.offsetHeight - grid.offsetHeight),
      behavior: "instant",
    });
  }, p);
  await page.waitForTimeout(350);
}
await scrollToProgress(0);
await expect(grid).toHaveAttribute("data-stage", "assembled");
await expect(page.locator(".layer-descriptions")).toBeHidden();
await page.screenshot({ path: "test-results/layers-assembled.png" });
await scrollToProgress(0.5);
await expect(grid).toHaveAttribute("data-stage", "separating");
await expect(page.locator(".layer-descriptions")).toBeHidden();
await page.screenshot({ path: "test-results/layers-separating.png" });
await scrollToProgress(0.95);
await expect(grid).toHaveAttribute("data-stage", "explained");
await expect(page.locator(".layer-descriptions")).toBeVisible();
const imageBounds = await page.locator(".exploded-art").boundingBox();
const textBounds = await page.locator(".layer-descriptions").boundingBox();
expect(textBounds.x).toBeGreaterThanOrEqual(imageBounds.x + imageBounds.width);
await page.screenshot({ path: "test-results/layers-explained.png" });
await scrollToProgress(0);
await expect(page.locator(".layer-descriptions")).toBeHidden();
await expect(
  page.locator(".footer a").filter({ hasText: "(41) 99820-6552" }),
).toHaveAttribute("href", /wa.me\/5541998206552/);
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
const touchPage = await mobile.newPage();
await touchPage.goto(process.env.SITE_URL || "http://127.0.0.1:3000", {
  waitUntil: "networkidle",
});
await touchPage
  .locator(".hero-scene-loader")
  .tap({ position: { x: 40, y: 40 } });
await expect(touchPage.locator(".hero-art .is-ready")).toBeVisible();
const touchHero = touchPage.locator(".hero-art canvas");
const beforeTouch = await touchHero.screenshot();
const touchBounds = await touchHero.boundingBox();
const cdp = await mobile.newCDPSession(touchPage);
await cdp.send("Input.dispatchTouchEvent", {
  type: "touchStart",
  touchPoints: [
    {
      x: touchBounds.x + touchBounds.width * 0.3,
      y: touchBounds.y + touchBounds.height * 0.4,
    },
  ],
});
for (let i = 1; i <= 10; i++) {
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [
      {
        x: touchBounds.x + touchBounds.width * (0.3 + i * 0.04),
        y: touchBounds.y + touchBounds.height * (0.4 + i * 0.015),
      },
    ],
  });
}
await cdp.send("Input.dispatchTouchEvent", {
  type: "touchEnd",
  touchPoints: [],
});
await touchPage.waitForTimeout(500);
expect((await touchHero.screenshot()).equals(beforeTouch)).toBe(false);
await touchPage.evaluate(() => {
  const region = document.querySelector(".engineering-scroll");
  const grid = document.querySelector(".engineering-grid");
  window.scrollTo({
    top:
      region.getBoundingClientRect().top +
      window.scrollY -
      90 +
      0.95 * (region.offsetHeight - grid.offsetHeight),
    behavior: "instant",
  });
});
await touchPage.waitForTimeout(400);
await expect(touchPage.locator(".layer-descriptions")).toBeVisible();
await touchPage.screenshot({ path: "test-results/layers-mobile.png" });
expect(
  await touchPage.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth,
  ),
).toBe(true);
await browser.close();
console.log(
  "PASS: mouse, keyboard, actual touch drag, scroll phases and reverse, desktop split, mobile, commercial WhatsApp.",
);
