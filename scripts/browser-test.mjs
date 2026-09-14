import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("test-results", { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.route("https://wa.me/**", (route) =>
  route.fulfill({ body: "WhatsApp test intercepted" }),
);
await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
await expect(page.getByRole("heading", { level: 1 })).toContainText(
  "Proteção começa",
);
await expect(page.locator(".hero-art canvas")).toBeVisible();
await page.screenshot({ path: "test-results/desktop.png", fullPage: true });
await page.getByRole("button", { name: "Orçar este modelo" }).nth(1).click();
await expect(page.locator("#product")).toHaveValue("Transporte");
await expect(page.locator("#length")).toHaveValue("40");
await page.locator("#length").fill("0");
await page
  .locator("form")
  .getByRole("button", { name: "Solicitar orçamento" })
  .click();
await expect(page.locator("#length")).toBeFocused();
await expect(page.locator("#length")).toHaveAttribute("aria-invalid", "true");
await expect(page.locator("#length-error")).toContainText("0,1");
await page.locator("#length").fill("16");
await page.locator("#width").fill("12");
await page.locator("#height").fill("7");
await page.locator("#quantity").fill("3000");
await page.locator("#purpose").fill("Cosméticos de até 2 kg");
await page.locator("#product").selectOption("E-commerce");
await page.evaluate(() => {
  window.__opened = "";
  window.open = (url) => {
    window.__opened = String(url);
    return null;
  };
});
await page
  .locator("form")
  .getByRole("button", { name: "Solicitar orçamento" })
  .click();
const url = await page.evaluate(() => window.__opened);
expect(new URL(url).hostname).toBe("wa.me");
const message = new URL(url).searchParams.get("text");
expect(message).toContain("16 × 12 × 7 cm");
expect(message).toContain("3.000 unidades");
expect(message).toContain("Cosméticos");
await expect(
  page.getByRole("link", { name: "Continuar no WhatsApp" }),
).toHaveAttribute("href", url);
await page.getByRole("button", { name: "Como funciona a entrega?" }).click();
await expect(page.locator("#faq-3")).toBeVisible();
await page.locator("#product").focus();
await page.keyboard.press("ArrowDown");
await page.keyboard.press("Enter");
const desktopA11y = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
  .analyze();
await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
await expect(page.getByRole("button", { name: "Abrir menu" })).toBeVisible();
await page.getByRole("button", { name: "Abrir menu" }).click();
await expect(page.locator("#navigation")).toBeVisible();
await page.keyboard.press("Escape");
await expect(page.getByRole("button", { name: "Abrir menu" })).toBeFocused();
await expect(page.locator("#navigation")).not.toBeVisible();
await expect
  .poll(
    async () =>
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
  )
  .toBe(true);
await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
const mobileA11y = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
  .analyze();
await page.setViewportSize({ width: 320, height: 740 });
await expect
  .poll(
    async () =>
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
  )
  .toBe(true);
await page.emulateMedia({ reducedMotion: "no-preference" });
await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
await page.locator("#engenharia").scrollIntoViewIfNeeded();
await expect(page.locator(".exploded-art canvas")).toBeVisible();
await page.waitForTimeout(1000);
await page.screenshot({ path: "test-results/layers.png" });
const response = await page.goto("http://127.0.0.1:3000/pagina-inexistente", {
  timeout: 60000,
  waitUntil: "domcontentloaded",
});
expect(response.status()).toBe(404);
await expect(
  page.getByRole("link", { name: "Voltar ao início" }),
).toBeVisible();
await writeFile(
  "test-results/a11y.json",
  JSON.stringify(
    { desktop: desktopA11y.violations, mobile: mobileA11y.violations, errors },
    null,
    2,
  ),
);
await browser.close();
expect(errors).toEqual([]);
expect(desktopA11y.violations).toEqual([]);
expect(mobileA11y.violations).toEqual([]);
console.log(
  "PASS: desktop/mobile, WebGL, reduced motion, menu keyboard, catalog, validation, WhatsApp payload, FAQ, 404, axe accessibility.",
);
