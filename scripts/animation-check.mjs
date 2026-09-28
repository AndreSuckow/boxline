import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
  const result = await page.locator(".precision h2").evaluate(
    (el) =>
      new Promise((resolve) => {
        const letters = [...el.querySelectorAll("[data-letter]")];
        const times = [];
        const observer = new MutationObserver((records) => {
          for (const record of records) {
            const index = letters.indexOf(record.target);
            if (record.target.style.visibility !== "hidden")
              times[index] = performance.now();
          }
          if (times[letters.length - 1]) {
            observer.disconnect();
            resolve(times);
          }
        });
        observer.observe(el, {
          subtree: true,
          attributes: true,
          attributeFilter: ["style"],
        });
        window.scrollTo({
          top: scrollY + el.getBoundingClientRect().top - 150,
          behavior: "instant",
        });
      }),
  );
  console.log("pause ms", result[21] - result[20]);
  expect(result[21] - result[20]).toBeGreaterThanOrEqual(990);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#engenharia").scrollIntoViewIfNeeded();
  await expect(page.locator(".exploded-art .is-ready")).toBeVisible({
    timeout: 60000,
  });
  await page.evaluate(() => {
    const r = document.querySelector(".engineering-scroll");
    const g = document.querySelector(".engineering-grid");
    window.scrollTo({
      top:
        scrollY +
        r.getBoundingClientRect().top -
        90 +
        (r.offsetHeight - g.clientHeight) * 0.99,
      behavior: "instant",
    });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "test-results/fixed-shadow-mobile.png" });
  console.log("PASS typing pause and mobile screenshot");
} finally {
  await browser.close();
}
