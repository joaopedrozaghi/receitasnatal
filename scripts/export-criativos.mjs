// Exporta os criativos de /criativos em PNG (2x: 2160 px de largura), com o iPhone 3D.
// Antes: `npm run dev` e `node scripts/export-telas.mjs` (telas do app que vão no iPhone).
// Uso: `node scripts/export-criativos.mjs [filtro]` → criativos/<tom>/<conceito>-<formato>.png
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE ?? "http://localhost:3000/criativos";
const OUT = resolve("criativos");
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find(existsSync);

const SIZES = { story: [1080, 1920], feed: [1080, 1350], square: [1080, 1080] };
const CONCEPTS = ["solado", "tudo", "preco", "renda", "cozinha", "rose", "roseOferta", "panetone"];
const TONES = ["noite", "branco", "creme", "menta"];

const only = process.argv[2];
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  protocolTimeout: 300000,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars"],
});
try {
  const page = await browser.newPage();
  for (const tone of TONES)
    for (const c of CONCEPTS)
      for (const [f, [w, h]] of Object.entries(SIZES)) {
        const name = `${tone}/${c}-${f}`;
        if (only && !name.includes(only)) continue;
        await page.setViewport({ width: w, height: h, deviceScaleFactor: 2 });
        await page.goto(`${BASE}?c=${c}&f=${f}&tone=${tone}`, { waitUntil: "networkidle0", timeout: 180000 });
        await page.waitForFunction(
          () => window.__phonesPending === 0 || window.__phonesPending === undefined,
          {
            timeout: 180000,
          },
        );
        await page.evaluate(() => document.fonts.ready);
        const file = resolve(OUT, `${name}.png`);
        mkdirSync(dirname(file), { recursive: true });
        await page.screenshot({ path: file, clip: { x: 0, y: 0, width: w, height: h } });
        console.log("ok", name);
      }
} finally {
  await browser.close();
}
