// Gera o hash (SHA-256) do código de acesso do app.
// Uso: npm run app:codigo -- SEUCODIGO
// Cole o resultado em config/site.config.ts > app.accessCodeHashes.
import { createHash } from "crypto";

const code = (process.argv[2] ?? "").replace(/\s+/g, "").toUpperCase();
if (!code) {
  console.error("Informe o código. Ex.: npm run app:codigo -- SEUCODIGO");
  process.exit(1);
}
console.log(`Código: ${code}`);
console.log(`Hash:   ${createHash("sha256").update(code).digest("hex")}`);
