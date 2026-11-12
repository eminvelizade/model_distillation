// node shot.cjs <out.png> "<query>" [--motion] [--wait ms] [--scale n]
const { chromium } = require("playwright");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
(async () => {
  const [out, query = ""] = process.argv.slice(2);
  const flag = (n) => process.argv.includes(n);
  const opt = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
  const base = process.env.HARNESS_BASE || "http://localhost:5199";
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const ctx = await browser.newContext({ deviceScaleFactor: parseFloat(opt("--scale", "1")), reducedMotion: flag("--motion") ? "no-preference" : "reduce", viewport: { width: 1400, height: 1100 } });
  const page = await ctx.newPage();
  const logs = [];
  page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") logs.push(`[${m.type()}] ${m.text()}`); });
  page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));
  await page.route("**/__harness.html*", (r) => r.fulfill({ contentType: "text/html", body: readFileSync(join(__dirname, "page.html"), "utf8") }));
  const t0 = Date.now();
  await page.goto(`${base}/__harness.html?${query}`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 300000 });
  await page.waitForTimeout(parseInt(opt("--wait", "150")));
  const el = await page.$("#wrap");
  await el.screenshot({ path: out, omitBackground: true, timeout: 240000 });
  console.log(`saved ${out} in ${Date.now() - t0} ms`);
  if (logs.length) console.log(logs.slice(0, 14).join("\n"));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
