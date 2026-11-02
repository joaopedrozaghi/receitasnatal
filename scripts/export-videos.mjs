// Grava os vídeos de /criativos/video em MP4 (30 fps), quadro a quadro.
// Uso: com `npm run dev` rodando, `node scripts/export-videos.mjs [filtro]` → criativos/videos/
// Precisa do ffmpeg instalado (winget install Gyan.FFmpeg).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE ?? "http://localhost:3000/criativos/video";
const OUT = resolve("criativos/videos");
const FPS = 30;
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find(existsSync);

const SIZES = { story: [1080, 1920], feed: [1080, 1350], square: [1080, 1080] };
const DURATION = { app: 12000, texto: 10500, rose: 12500 };
const NAMES = { story: "9x16", feed: "4x5", square: "1x1" };

const only = process.argv[2];
mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});
try {
  for (const v of Object.keys(DURATION))
    for (const f of Object.keys(SIZES)) {
      const name = `${v}-${NAMES[f]}`;
      if (only && !name.includes(only)) continue;
      const [w, h] = SIZES[f];
      const page = await browser.newPage();
      await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
      await page.goto(`${BASE}?v=${v}&f=${f}`, { waitUntil: "networkidle0", timeout: 120000 });
      await page.evaluate(() => window.__ready());
      const dir = resolve(OUT, `.frames-${name}`);
      rmSync(dir, { recursive: true, force: true });
      mkdirSync(dir, { recursive: true });
      const total = Math.round((DURATION[v] / 1000) * FPS);
      for (let i = 0; i < total; i++) {
        await page.evaluate(
          (ms) =>
            new Promise((r) => (window.__setT(ms), requestAnimationFrame(() => requestAnimationFrame(r)))),
          (i * 1000) / FPS,
        );
        await page.screenshot({
          path: resolve(dir, `${String(i).padStart(4, "0")}.jpg`),
          type: "jpeg",
          quality: 92,
        });
      }
      await page.close();
      execFileSync("ffmpeg", [
        "-v",
        "error",
        "-y",
        "-framerate",
        String(FPS),
        "-i",
        resolve(dir, "%04d.jpg"),
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-crf",
        "18",
        "-preset",
        "slow",
        "-movflags",
        "+faststart",
        resolve(OUT, `${name}.mp4`),
      ]);
      rmSync(dir, { recursive: true, force: true });
      console.log("ok", name);
    }
} finally {
  await browser.close();
}
