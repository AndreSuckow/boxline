import { chromium } from "@playwright/test";
const b = await chromium.launch();
const p = await b.newPage({
  viewport: { width: 320, height: 844 },
  reducedMotion: "reduce",
});
await p.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
console.log(
  await p.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
    elements: [...document.querySelectorAll("body *")]
      .map((el) => ({
        tag: el.tagName,
        cls: el.className,
        r: el.getBoundingClientRect().right,
        width: el.getBoundingClientRect().width,
      }))
      .filter((x) => x.r > document.documentElement.clientWidth + 1),
  })),
);
await p.screenshot({ path: "test-results/mobile-debug.png", fullPage: true });
await b.close();
