import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(process.env.SITE_URL || "http://127.0.0.1:3000", {
  waitUntil: "networkidle",
});
await page.locator("#orcamento").scrollIntoViewIfNeeded();
await page.locator("#purpose").fill("Cosméticos");
await page
  .getByRole("button", { name: "Adicionar outro tipo de caixa" })
  .click();
await expect(page.locator("#length")).toBeFocused();
await page.locator("#length").fill("40");
await page.locator("#width").fill("30");
await page.locator("#height").fill("20");
await page.locator("#quantity").fill("500");
await page.locator("#purpose").fill("Livros");
await page
  .getByRole("button", { name: "Adicionar outro tipo de caixa" })
  .click();
await page.locator("#length").fill("25");
await page.locator("#width").fill("20");
await page.locator("#height").fill("15");
await page.locator("#quantity").fill("300");
await page.locator("#purpose").fill("Roupas");
await page.locator(".quote-item-list button").first().click();
await expect(page.locator("#purpose")).toHaveValue("Cosméticos");
await page.locator("#width").fill("0");
await page.locator(".quote-item-list button").last().click();
await page.evaluate(() => {
  window.open = (url) => {
    window.__url = String(url);
    return null;
  };
});
await page.locator("form button[type=submit]").click();
await expect(page.locator("#width")).toBeFocused();
await expect(page.locator("#width")).toHaveAttribute("aria-invalid", "true");
await page.locator("#width").fill("12");
await page.locator("form button[type=submit]").click();
let message = await page.evaluate(() =>
  new URL(window.__url).searchParams.get("text"),
);
expect(message).toContain("TIPO 1");
expect(message).toContain("TIPO 2");
expect(message).toContain("TIPO 3");
expect(message).toContain("Cosméticos");
expect(message).toContain("40 × 30 × 20 cm");
expect(message).toContain("500 unidades");
expect(message).toContain("Roupas");
await page.locator(".quote-item-list button").nth(1).click();
await page.getByRole("button", { name: "Remover este tipo" }).click();
await expect(page.locator(".quote-item-list button")).toHaveCount(2);
await expect(
  page.getByRole("link", { name: "Continuar no WhatsApp" }),
).toHaveCount(0);
await page.locator("form button[type=submit]").click();
message = await page.evaluate(() =>
  new URL(window.__url).searchParams.get("text"),
);
expect(message).not.toContain("Livros");
expect(message).toContain("Roupas");
await page.screenshot({ path: "test-results/multi-quote.png" });
expect(
  (
    await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze()
  ).violations,
).toEqual([]);
await page.setViewportSize({ width: 390, height: 844 });
await page.locator(".quote-items").scrollIntoViewIfNeeded();
await page.screenshot({ path: "test-results/multi-quote-mobile.png" });
expect(
  await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
).toBe(true);
await page.setViewportSize({ width: 1440, height: 1100 });
await page.emulateMedia({ reducedMotion: "no-preference" });
await page.locator(".company-banner").scrollIntoViewIfNeeded();
await page.mouse.move(1, 1);
await page.waitForTimeout(750);
const rate = () =>
  page
    .locator(".company-track")
    .evaluate((el) => el.getAnimations()[0].playbackRate);
expect(await rate()).toBeCloseTo(1);
await page.locator(".company-marquee").hover();
await page.waitForTimeout(750);
expect(await rate()).toBeCloseTo(0.25);
const t = await page
  .locator(".company-track")
  .evaluate((el) => el.getAnimations()[0].currentTime);
await page.waitForTimeout(300);
expect(
  await page
    .locator(".company-track")
    .evaluate((el) => el.getAnimations()[0].currentTime),
).toBeGreaterThan(t);
await page.mouse.move(1, 1);
await page.waitForTimeout(750);
expect(await rate()).toBeCloseTo(1);
await page.locator("#correios").scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);
const mask = await page
  .locator(".correios-print")
  .first()
  .evaluate((el) => getComputedStyle(el).maskImage);
const logo = await page.request.get(mask.match(/url\(["']?(.*?)["']?\)/)[1]);
expect(logo.ok()).toBe(true);
expect(await logo.text()).toContain("<svg");
await page.screenshot({ path: "test-results/correios-logo.png" });
expect(errors).toEqual([]);
await browser.close();
console.log(
  "PASS: 3 types, preserved values, validation across items, combined WhatsApp, removal, mobile, axe, continuous hover slowdown and Correios asset.",
);
