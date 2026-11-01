/**
 * Configuração da oferta e da personagem.
 * Para outra data comemorativa (Páscoa, Dia das Mães, Festa Junina) troque este arquivo,
 * os textos em /content e as imagens em /public/images. Nenhum componente precisa mudar.
 */
import { z } from "zod";
import testimonialsData from "@/content/testimonials.json";

// ───────────────────────── Schema (validado na inicialização) ─────────────────────────

const isoDate = z.string().refine((v) => !Number.isNaN(Date.parse(v)), "data ISO inválida");
const urlOrEmpty = z.union([z.string().url(), z.literal("")]);

const photoSchema = z.object({ src: z.string(), alt: z.string() });

const testimonialSchema = z.object({
  name: z.string().min(2),
  city: z.string().optional(),
  text: z.string().min(10),
  photo: z.string().optional(),
  /** Data em que a pessoa autorizou por escrito o uso do depoimento. */
  consentAt: isoDate,
  /** Onde está guardada a autorização (ex.: "e-mail de 12/12/2026"). */
  consentRef: z.string().min(3),
});

const proofStatSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(2),
  /** Fonte do número (obrigatório: nada de número inventado). */
  source: z.string().min(3),
});

const phaseSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  price: z.number().positive(),
  until: isoDate.nullable(),
});

export const siteConfigSchema = z
  .object({
    siteUrl: z.string().url(),
    brand: z.object({
      name: z.string(),
      edition: z.string(),
      editionYear: z.number().int(),
      fullName: z.string(),
      tagline: z.string(),
      supportEmail: z.string().email(),
      supportWhatsapp: z.string().regex(/^\d{12,13}$/),
      legalName: z.string(),
      cnpj: z.string(),
    }),
    chef: z.object({
      mode: z.enum(["character", "real"]),
      name: z.string(),
      nickname: z.string(),
      photoMain: photoSchema, // "Quem conduz" (vertical)
      photoSecondary: photoSchema, // polaroid
      photoHero: photoSchema, // Rô com panetone
      photosAbout: z.array(photoSchema), // extras da página /sobre
      avatarFocus: z.string(),
      caption: z.string(),
      disclosure: z.string(),
      showDisclosure: z.boolean(),
      aiGeneratedImages: z.boolean(),
    }),
    hero: z.object({ headline: z.enum(["A", "B", "C"]) }),
    product: z.object({
      recipesCount: z.number().int().positive(),
      modulesCount: z.number().int().positive(),
      deliveryFormat: z.string(),
      accessDuration: z.string(),
    }),
    pricing: z.object({
      currency: z.literal("BRL"),
      anchorPrice: z.number().positive(),
      phases: z.array(phaseSchema).min(1),
      installments: z.object({
        max: z.number().int().min(1).max(12),
        interestFreeUpTo: z.number().int().min(1),
        monthlyInterestRate: z.number().min(0),
      }),
      timezone: z.string(),
    }),
    checkout: z.object({
      /** Link do checkout externo (Kiwify, Hotmart, Eduzz…). UTMs da visita são repassados. */
      url: urlOrEmpty,
      /** Opcional: link do mesmo checkout já com o order bump. Vazio = o bump fica só no checkout. */
      urlWithBump: urlOrEmpty,
    }),
    bump: z.object({
      id: z.string(),
      name: z.string(),
      enabled: z.boolean(),
      price: z.number().positive(),
      anchorPrice: z.number().positive(),
    }),
    bonuses: z.array(z.object({ id: z.string(), referenceValue: z.number().positive().nullable() })),
    guarantee: z.object({ days: z.number().int().min(7) }),
    app: z.object({
      /** SHA-256 (hex minúsculo) dos códigos de acesso válidos. Gere com: npm run app:codigo -- SEUCODIGO */
      accessCodeHashes: z.array(z.string().regex(/^[0-9a-f]{64}$/)).min(1),
    }),
    social: z.object({ instagram: z.string(), tiktok: z.string() }),
    testimonials: z.array(testimonialSchema),
    proofStats: z.array(proofStatSchema),
  })
  .superRefine((cfg, ctx) => {
    if (cfg.chef.mode === "character" && !cfg.chef.showDisclosure) {
      ctx.addIssue({ code: "custom", message: "chef.showDisclosure é obrigatório em mode 'character'" });
    }
    const last = cfg.pricing.phases[cfg.pricing.phases.length - 1];
    if (last && last.until !== null) {
      ctx.addIssue({ code: "custom", message: "a última fase de preço precisa ter until: null" });
    }
    if (last && last.price !== cfg.pricing.anchorPrice) {
      ctx.addIssue({
        code: "custom",
        message: "o preço 'de' (anchorPrice) precisa ser o preço praticado na última fase",
      });
    }
  });

export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type ProofStat = z.infer<typeof proofStatSchema>;
export type PricePhase = z.infer<typeof phaseSchema>;

// ───────────────────────────────── Valores ─────────────────────────────────

export const rawConfig = {
  siteUrl: "https://www.seudominio.com.br", // placeholder: domínio final (usado no SEO)

  brand: {
    name: "Receitinhas da Rô",
    edition: "Especial de Natal", // troca a cada data comemorativa
    editionYear: 2026,
    fullName: "Receitinhas da Rô · Especial de Natal",
    tagline: "Ceia farta, panetone de padaria e, se você quiser, uma renda extra no fim do ano.",
    supportEmail: "contato@seudominio.com.br", // placeholder
    supportWhatsapp: "5535999999999", // placeholder
    legalName: "SUA RAZÃO SOCIAL", // placeholder
    cnpj: "00.000.000/0001-00", // placeholder
  },

  chef: {
    mode: "real", // "real" = Roseli, pessoa real (história e fotos precisam ser verdadeiras)
    name: "Roseli Monteiro",
    nickname: "Rô",
    photoMain: {
      src: "/images/ro-retrato.jpg",
      alt: "Roseli Monteiro, a Rô, sorrindo de dólmã branco e braços cruzados em uma cozinha clara com plantas",
    },
    photoSecondary: {
      src: "/images/ro-panela.jpg",
      alt: "Roseli Monteiro mexendo uma panela vermelha no fogão com colher de pau",
    },
    photoHero: {
      src: "/images/ro-panetone.jpg",
      alt: "Roseli Monteiro sorrindo e mostrando um panetone caseiro recém-assado",
    },
    photosAbout: [
      {
        src: "/images/ro-cozinha.jpg",
        alt: "Roseli Monteiro cozinhando, sorridente, em uma cozinha com plantas",
      },
    ],
    avatarFocus: "50% 20%", // enquadramento do rosto no avatar redondo (sobre photoMain)
    caption: "Roseli Monteiro, a Rô das Receitinhas.",
    disclosure: "",
    showDisclosure: false,
    aiGeneratedImages: false,
  },

  hero: { headline: "A" }, // variantes de H1: A (padrão), B ou C — textos em content/copy.ptBR.ts

  product: {
    recipesCount: 100, // CONFIRMAR: número real de receitas no app (aparece como "mais de 100")
    modulesCount: 8, // categorias do cardápio
    deliveryFormat: "Web app", // abre no navegador, sem baixar nada na loja
    accessDuration: "vitalício", // CONFIRMAR
  },

  // Preço por fase. A contagem vai até o `until` da fase atual e avança sozinha.
  pricing: {
    currency: "BRL",
    anchorPrice: 97,
    phases: [
      { id: "lancamento", label: "Oferta de lançamento", price: 37, until: "2026-11-15T23:59:00-03:00" },
      { id: "natal", label: "Oferta de Natal", price: 57, until: "2026-12-10T23:59:00-03:00" },
      { id: "cheio", label: "Preço cheio", price: 97, until: null },
    ],
    installments: { max: 3, interestFreeUpTo: 3, monthlyInterestRate: 0 }, // igual ao configurado na plataforma
    timezone: "America/Sao_Paulo",
  },

  checkout: {
    url: "", // PREENCHER: link do checkout (Kiwify/Hotmart/Eduzz)
    urlWithBump: "", // opcional
  },

  bump: {
    id: "panetones-gourmet-da-ro",
    name: "Panetones Gourmet da Rô",
    enabled: true,
    price: 19.9,
    anchorPrice: 59.9,
  },

  // Valor de referência só aparece se você preencher um valor real (praticado).
  bonuses: [
    { id: "cronograma", referenceValue: null },
    { id: "substituicoes", referenceValue: null },
    { id: "embalagem", referenceValue: null },
  ],

  guarantee: { days: 7 }, // CDC art. 49

  // App em /app: a cliente cria a conta com o CÓDIGO DE ACESSO que você manda no e-mail da compra
  // (o mesmo para todas). Aqui fica só o hash do código. Código inicial: NATAL2026 (troque!).
  app: {
    accessCodeHashes: ["aa0ddc6392b4994611cc3577efb16de223bbc52948f78427ac64734505d774b0"],
  },

  social: { instagram: "", tiktok: "" },
  testimonials: testimonialsData, // vazio = seção escondida (cadastre com npm run testimonial:add)
  proofStats: [], // vazio = faixa de números escondida
} satisfies z.input<typeof siteConfigSchema>;

export function parseConfig(input: unknown): SiteConfig {
  const parsed = siteConfigSchema.safeParse(input);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `- ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`site.config.ts inválido:\n${issues}`);
  }
  return parsed.data;
}

export const siteConfig: SiteConfig = parseConfig(rawConfig);
