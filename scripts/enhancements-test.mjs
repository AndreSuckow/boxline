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
await expect(page.locator(".company-list").first().locator("li")).toHaveCount(
  6,
);
await expect(
  page.getByRole("button", { name: /Pausar faixa|Continuar faixa/ }),
).toHaveCount(0);
await page.locator("#correios").scrollIntoViewIfNeeded();
await expect(page.locator(".postal-card")).toHaveCount(4);
await page.screenshot({ path: "test-results/postal.png" });
await page.getByRole("button", { name: "Orçar esta medida" }).nth(2).click();
await expect(page.locator("#length")).toHaveValue("30");
await expect(page.locator("#width")).toHaveValue("20");
await expect(page.locator("#height")).toHaveValue("15");
await expect(page.locator("#product")).toHaveValue("Caixas para Correios");
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
expect(
  await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
).toBe(true);
expect(errors).toEqual([]);
await browser.close();
console.log(
  "PASS: companies, continuous carousel, four postal sizes, quote handoff, live 3D dimensions, focus, accessibility and mobile.",
);
