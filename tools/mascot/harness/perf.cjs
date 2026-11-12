// node perf.cjs "<kinds>" <css size> <scale>: average time to draw one frame of each mascot (software GL here: compare, don't read as absolute)
const { chromium } = require("playwright");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
(async () => {
  const [kinds = "bloom", size = "64", scale = "2", looks = "[]", extra = ""] = process.argv.slice(2);
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const ctx = await browser.newContext({ deviceScaleFactor: parseFloat(scale), reducedMotion: "reduce", viewport: { width: 1400, height: 1100 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("[pageerror]", e.message));
  await page.route("**/__harness.html*", (r) => r.fulfill({ contentType: "text/html", body: readFileSync(join(__dirname, "page.html"), "utf8") }));
  await page.goto(`${process.env.HARNESS_BASE || "http://localhost:5199"}/__harness.html?${kinds ? `kinds=${kinds}&` : ""}size=${size}&looks=${encodeURIComponent(looks)}${extra ? "&" + extra : ""}`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 300000 });
  const res = await page.evaluate(async (names) => {
    const out = {};
    for (let k = 0; k < window.__views.length; k++) {
      const v = window.__views[k];
      const one = () => { v.update(0.033); v.draw(); v.ctx.getImageData(v.w >> 1, v.h >> 1, 1, 1); };   // (reading a pixel back makes the draw finish)
      for (let i = 0; i < 3; i++) one();
      const t0 = performance.now();
      const n = 12;
      for (let i = 0; i < n; i++) one();
      out[names[k]] = +((performance.now() - t0) / n).toFixed(1);
    }
    return out;
  }, kinds.split(",").filter(Boolean).concat(JSON.parse(looks).map((l) => `${l.material || "plush"}:${l.shape}+${l.extra}`)));
  console.log(`size ${size} css px x${scale}:`, JSON.stringify(res), "ms per frame");
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
