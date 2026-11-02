// Exporta os criativos de /criativos em PNG (2x, como os de referência: 2160 px de largura).
// Uso: com `npm run dev` rodando, `node scripts/export-criativos.mjs` → pasta criativos/
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const BASE = process.env.BASE ?? "http://localhost:3000/criativos";
const OUT = resolve("criativos");
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find(existsSync);
if (!CHROME) throw new Error("Chrome não encontrado");

const SIZES = { story: [1080, 1920], feed: [1080, 1350], square: [1080, 1080] };
const jobs = [];
for (const c of ["solado", "tudo", "preco", "renda", "ceia"])
  for (const f of Object.keys(SIZES)) jobs.push({ name: `${c}-${f}`, q: `c=${c}&f=${f}`, size: SIZES[f] });
for (const f of Object.keys(SIZES))
  jobs.push({ name: `preco-${f}-57`, q: `c=preco&f=${f}&p=57`, size: SIZES[f] });
jobs.push({ name: "solado-feed-claro", q: "c=solado&f=feed&tone=light", size: SIZES.feed });
jobs.push({ name: "preco-feed-claro", q: "c=preco&f=feed&tone=light", size: SIZES.feed });
jobs.push({ name: "carrossel-quadrado-inteiro", q: "carrossel=square", size: [3240, 1080] });
jobs.push({ name: "carrossel-feed-inteiro", q: "carrossel=feed", size: [3240, 1350] });

const only = process.argv[2];
mkdirSync(OUT, { recursive: true });
for (const j of jobs) {
  if (only && !j.name.includes(only)) continue;
  const file = resolve(OUT, `${j.name}.png`);
  execFileSync(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=2",
      `--window-size=${j.size[0]},${j.size[1]}`,
      "--virtual-time-budget=15000",
      `--screenshot=${file}`,
      `${BASE}?${j.q}`,
    ],
    { stdio: "ignore" },
  );
  console.log("ok", j.name);
}
