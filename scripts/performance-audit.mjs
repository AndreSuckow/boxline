import lighthouse from "lighthouse";
import desktop from "lighthouse/core/config/desktop-config.js";
import { launch } from "chrome-launcher";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
const url = process.env.SITE_URL || "https://andresuckow.github.io/boxline/";
const label = process.env.AUDIT_LABEL || "baseline";
await mkdir("test-results/performance", { recursive: true });
for (const mode of ["mobile", "desktop"]) {
  const profile = resolve(
    "test-results/performance/profiles/" +
      label +
      "-" +
      mode +
      "-" +
      Date.now(),
  );
  await mkdir(profile, { recursive: true });
  const chrome = await launch({
    userDataDir: profile,
    chromePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    chromeFlags: ["--headless=new"],
  });
  try {
    const result = await lighthouse(
      url,
      {
        port: chrome.port,
        logLevel: "error",
        output: ["json", "html"],
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
      },
      mode === "desktop" ? desktop : undefined,
    );
    await writeFile(
      "test-results/performance/" + label + "-" + mode + ".json",
      result.report[0],
    );
    await writeFile(
      "test-results/performance/" + label + "-" + mode + ".html",
      result.report[1],
    );
    const { lhr } = result;
    if (lhr.runtimeError) throw new Error(lhr.runtimeError.message);
    const metrics = Object.fromEntries(
      [
        "first-contentful-paint",
        "largest-contentful-paint",
        "total-blocking-time",
        "cumulative-layout-shift",
        "speed-index",
      ].map((id) => [id, lhr.audits[id].numericValue]),
    );
    console.log(
      JSON.stringify({
        label,
        mode,
        scores: Object.fromEntries(
          Object.entries(lhr.categories).map(([id, c]) => [
            id,
            Math.round(c.score * 100),
          ]),
        ),
        metrics,
      }),
    );
  } finally {
    await chrome.kill();
  }
}
