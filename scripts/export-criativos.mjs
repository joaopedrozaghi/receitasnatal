// Exporta os criativos de /criativos em PNG (2x, como os de referência: 2160 px de largura).
// Uso: com `npm run dev` rodando, `node scripts/export-criativos.mjs` → pasta criativos/verde e criativos/branco
// Carrosséis saem inteiros (-inteiro.png); corte em 3 slides com: python scripts/cortar-carrossel.py
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const BASE = process.env.BASE ?? "http://localhost:3000/criativos";
const OUT = resolve("criativos");
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find(existsSync);
if (!CHROME) throw new Error("Chrome não encontrado");

const SIZES = { story: [1080, 1920], feed: [1080, 1350], square: [1080, 1080] };
const CONCEPTS = ["solado", "tudo", "preco", "renda", "ceia", "rose", "roseOferta", "roseCaderno"];
const TONES = { verde: "dark", branco: "white" };
const jobs = [];
for (const [toneName, tone] of Object.entries(TONES)) {
  for (const c of CONCEPTS)
    for (const f of Object.keys(SIZES))
      jobs.push({ name: `${toneName}/${c}-${f}`, q: `c=${c}&f=${f}&tone=${tone}`, size: SIZES[f] });
  jobs.push({
    name: `${toneName}/carrossel-quadrado`,
    q: `carrossel=square&tone=${tone}`,
    size: [3240, 1080],
    split: 3,
  });
  jobs.push({
    name: `${toneName}/carrossel-feed`,
    q: `carrossel=feed&tone=${tone}`,
    size: [3240, 1350],
    split: 3,
  });
}

const only = process.argv[2];
mkdirSync(OUT, { recursive: true });
for (const j of jobs) {
  if (only && !j.name.includes(only)) continue;
  const file = resolve(OUT, `${j.name}${j.split ? "-inteiro" : ""}.png`);
  mkdirSync(dirname(file), { recursive: true });
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
