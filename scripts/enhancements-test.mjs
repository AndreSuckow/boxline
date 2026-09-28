import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(process.env.SITE_URL || "http://127.0.0.1:3000", {
  waitUntil: "networkidle",
});
await expect(page.locator(".company-banner, #produtos")).toHaveCount(0);
await page.locator("#correios").scrollIntoViewIfNeeded();
await expect(page.locator(".postal-card")).toHaveCount(4);
await page.screenshot({ path: "test-results/postal.png" });
await page.evaluate(() => {
  window.__postalUrls = [];
  window.open = (url) => {
    window.__postalUrls.push(String(url));
    return null;
  };
});
const sizes = [
  "22 × 14 × 4",
  "18 × 11,5 × 5",
  "22,5 × 19 × 6",
  "17 × 12,5 × 7,5",
];
for (let i = 0; i < 4; i++) {
  const card = page.locator(".postal-card").nth(i);
  const input = card.locator("input");
  const button = card.getByRole("button", { name: "Orçar esta medida" });
  await button.click();
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await input.fill("0");
  await button.click();
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await input.fill("abc");
  await expect(input).toHaveValue("0");
  await input.fill("1.5");
  await expect(input).toHaveValue("0");
  await input.fill(String(100 + i));
  await button.click();
  await expect(
    card.getByRole("link", { name: /Continuar no WhatsApp/ }),
  ).toHaveCount(0);
  const url = await page.evaluate(() => window.__postalUrls.at(-1));
  const message = new URL(url).searchParams.get("text");
  expect(message).toContain("Modelo 0" + [2, 4, 1, 3][i]);
  expect(message).toContain(sizes[i] + " cm");
  expect(message).toContain(100 + i + " unidades");
}
expect(await page.evaluate(() => window.__postalUrls.length)).toBe(4);
await page.screenshot({ path: "test-results/postal-quantity-desktop.png" });
await page.setViewportSize({ width: 390, height: 1000 });
await page.locator("#correios").scrollIntoViewIfNeeded();
await page.screenshot({ path: "test-results/postal-quantity-mobile.png" });
await page.setViewportSize({ width: 1440, height: 1000 });
await page.locator("#orcamento").scrollIntoViewIfNeeded();
await expect(page.locator(".dimension-ready canvas")).toBeVisible();
await page.locator("#height").focus();
await expect(page.locator(".dimension-tabs button").last()).toHaveAttribute(
  "aria-pressed",
  "true",
);
await expect(page.locator(".dimension-explanation")).toContainText("Altura:");
await page.locator("#length").fill("45");
await expect(page.locator('[data-axis="length"]')).toContainText("45 cm");
await expect(page.locator(".dimension-scene")).toHaveAttribute(
  "aria-label",
  /comprimento 45/,
);
await page.screenshot({ path: "test-results/dimensions.png" });
const violations = (
  await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze()
).violations;
expect(violations).toEqual([]);
await page.setViewportSize({ width: 390, height: 844 });
await page.locator(".dimension-guide").scrollIntoViewIfNeeded();
await page.screenshot({ path: "test-results/dimensions-mobile.png" });
expect(
  await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
).toBe(true);
await page.setViewportSize({ width: 320, height: 740 });
await page.evaluate(
  () =>
    new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    ),
);
expect(
  await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
).toBe(true);
expect(errors).toEqual([]);
await browser.close();
console.log(
  "PASS: removed sections, four postal sizes, quote handoff, live 3D dimensions, focus, accessibility and mobile.",
);
