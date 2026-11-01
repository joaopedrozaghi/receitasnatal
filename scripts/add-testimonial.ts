/**
 * Cadastra um depoimento REAL (com autorização por escrito) em content/testimonials.json.
 *
 * Uso:
 *   npm run testimonial:add -- --name "Ana Souza" --city "Lavras/MG" \
 *     --text "Fiz o panetone clássico e a família amou!" \
 *     --consentAt 2026-12-12 --consentRef "autorização por e-mail de 12/12/2026" \
 *     [--photo /images/depoimentos/ana.jpg]
 *
 * Regras: nunca invente depoimentos e nunca atribua depoimentos à personagem (Chef Rô).
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  city: z.string().optional(),
  text: z.string().min(10),
  photo: z.string().optional(),
  consentAt: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "data inválida"),
  consentRef: z.string().min(3),
});

function args(): Record<string, string> {
  const out: Record<string, string> = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (key?.startsWith("--")) out[key.slice(2)] = argv[i + 1] ?? "";
  }
  return out;
}

const parsed = schema.safeParse(args());
if (!parsed.success) {
  console.error(
    "Dados inválidos:\n" + parsed.error.issues.map((i) => `- ${i.path.join(".")}: ${i.message}`).join("\n"),
  );
  console.error(
    '\nExemplo: npm run testimonial:add -- --name "Ana" --text "..." --consentAt 2026-12-12 --consentRef "e-mail"',
  );
  process.exit(1);
}
// bloqueia "Chef Rô", "Rô", "chef ro"… (com ou sem acento)
const normalizedName = parsed.data.name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
if (/(^|[^a-z])(chef\s*)?ro([^a-z]|$)/.test(normalizedName)) {
  console.error("Depoimentos não podem ser atribuídos à personagem.");
  process.exit(1);
}

const file = path.join(process.cwd(), "content", "testimonials.json");
const list = JSON.parse(readFileSync(file, "utf8")) as unknown[];
list.push(parsed.data);
writeFileSync(file, JSON.stringify(list, null, 2) + "\n", "utf8");
console.log(`Depoimento de ${parsed.data.name} cadastrado. Total: ${list.length}.`);
