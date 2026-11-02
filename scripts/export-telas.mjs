// Fotografa as telas do app (/criativos/tela) em PNG para virar textura do iPhone 3D.
// Uso: com `npm run dev` rodando, `node scripts/export-telas.mjs` → public/criativos/telas/
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = resolve("public/criativos/telas");
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find(existsSync);

mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 180000 });
try {
  for (const s of ["home", "recipe", "cook", "pricing"]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 460, height: 960, deviceScaleFactor: 3 });
    await page.goto(`${BASE}/criativos/tela?s=${s}`, { waitUntil: "networkidle0", timeout: 180000 });
    await page.evaluate(async () => {
      document.querySelectorAll("img").forEach((i) => (i.loading = "eager"));
      await Promise.all(
        [...document.images].map((i) => (i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r)))),
      );
      await document.fonts.ready;
    });
    const el = await page.$("[data-screen]");
    // sem cantos arredondados: o display 3D já tem o recorte
    await page.evaluate((e) => (e.style.borderRadius = "0"), el);
    await el.screenshot({ path: resolve(OUT, `${s}.png`) });
    await page.close();
    console.log("ok", s);
  }
} finally {
  await browser.close();
}
