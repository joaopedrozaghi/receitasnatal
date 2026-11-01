# Receitinhas da Rô · Página de vendas

Página de vendas do **Especial de Natal**, com a **Roseli (a Rô)**. O produto é um **web app** de receitas
(panetones, docinhos, salgados, ceia, sobremesas, biscoitos), que será construído à parte; a página mostra
mockups de iPhone com telas de exemplo do app (`components/phone/`).
Next.js (App Router) + TypeScript estrito + Tailwind CSS. A compra acontece num **checkout externo**
(Kiwify, Hotmart, Eduzz…) — a página leva a pessoa até lá, repassando as UTMs da visita.

## Rodar no computador

Requisitos: Node.js 20 ou mais novo.

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

| Comando | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` / `npm start` | build e servidor de produção |
| `npm run lint` | ESLint (zero avisos) |
| `npm test` | testes (Vitest) |
| `npm run format` | Prettier |
| `npm run testimonial:add -- …` | cadastra um depoimento real (ver abaixo) |

## Onde editar cada coisa

| O quê | Arquivo |
| --- | --- |
| Preços, fases, datas, link do checkout, bump, garantia, dados da empresa | `config/site.config.ts` |
| Todos os textos da página (inclusive o conteúdo das telas do iPhone em `phones`) | `content/copy.ptBR.ts` |
| História da Rô (página /sobre), frases-assinatura, bio curta | `content/story.ptBR.ts` |
| Termos, privacidade, reembolso | `content/legal.ptBR.ts` |
| Depoimentos reais | `content/testimonials.json` (via script) |
| Fotos | `public/images/` |

Nenhum texto, preço ou link fica dentro dos componentes. A config é validada com Zod ao iniciar:
se algo estiver incoerente (ex.: preço "de" diferente do preço praticado na última fase), o build falha
com a mensagem do problema.

### Preço por fase e contagem regressiva

Em `pricing.phases`, cada fase tem `price` e `until` (data/hora com fuso). A última fase precisa ter
`until: null` e o mesmo valor de `anchorPrice` (o preço "de" só é exibido se for praticado de fato).
A contagem regressiva vai até o `until` da fase atual e, quando zera, a página passa sozinha para a
próxima fase (sem recarregar e sem reiniciar o relógio). Na última fase a barra de topo some.

Para testar outras datas em desenvolvimento: `http://localhost:3000/?simularData=2026-11-20T10:00:00-03:00`
(não funciona em produção).

### Checkout externo e order bump

- `checkout.url`: link do checkout da plataforma. UTMs, `fbclid`, `ttclid`, `src` e `sck` da visita
  são acrescentados automaticamente.
- `checkout.urlWithBump` (opcional): link do mesmo checkout já com o bump. Se preenchido, a seção de
  oferta mostra a caixinha "SIM, QUERO ADICIONAR!" (desmarcada por padrão), que troca o link.
  Se ficar vazio, configure o order bump dentro da própria plataforma (Kiwify/Hotmart/Eduzz têm essa função).
- Parcelas exibidas: ajuste `pricing.installments` para ficar igual à configuração da plataforma.

### Trocar a headline

`hero.headline` em `site.config.ts`: `"A"`, `"B"` ou `"C"` (textos em `copy.ptBR.ts > hero.headlines`).
Para teste A/B de verdade, use o recurso de testes da plataforma de anúncios com duas URLs, ou
duplique a página.

## A Roseli (a Rô)

O site apresenta a **Roseli** como pessoa real (`chef.mode = "real"` em `site.config.ts`).
Por isso, tudo o que aparece sobre ela precisa ser **verdadeiro**:

- a história (seção "Prazer, eu sou a Roseli" em `copy.ptBR.ts > chef` e os capítulos de `/sobre` em `content/story.ptBR.ts`);
- as fotos (precisam ser dela, com autorização de uso de imagem por escrito);
- credenciais: só entram em `story.real.credentials` se forem comprováveis (ex.: cursos feitos). Vazio = não aparece.

Se um dia a marca usar uma personagem fictícia, volte para `chef.mode = "character"`: o site passa a
mostrar a divulgação obrigatória ("personagem criada pela marca…") na legenda, no rodapé e no FAQ.

### Trocar as fotos

Substitua os arquivos em `public/images/` mantendo os nomes, ou aponte novos caminhos em
`chef.photoMain`, `chef.photoSecondary`, `chef.photoHero` e `chef.photosAbout`.
O avatar redondo é um recorte de `photoMain` (ajuste o enquadramento em `chef.avatarFocus`).
As fotos aparecem em formato de arco (retrato 4:5) e a secundária em círculo. O Next.js otimiza
(WebP/AVIF) automaticamente. As telas do iPhone usam um recorte da foto do panetone (`photoHero`).

### Visual

Tema "Confeitaria de Natal": marfim, verde-pinheiro, dourado e vermelho-cereja (só nos botões de compra).
Cores em `tailwind.config.ts`; fontes em `app/fonts.ts` (DM Serif Display, Bricolage Grotesque e Caveat
para a assinatura).

## Nova edição (Páscoa, Dia das Mães, Festa Junina)

1. `site.config.ts`: `brand.edition`, `brand.editionYear`, `brand.fullName`, fases de preço, link do checkout, bump.
2. `content/copy.ptBR.ts`: textos da edição (a estrutura é a mesma).
3. `content/story.ptBR.ts`: capítulo "Por que eu fiz o Especial de …".
4. `public/images/`: fotos da edição. A Rô (Roseli) continua a mesma.

## Depoimentos

Só depoimentos reais, com autorização por escrito. A seção fica escondida enquanto a lista estiver vazia.

```bash
npm run testimonial:add -- --name "Ana Souza" --city "Lavras/MG" --text "Fiz o panetone e a família amou!" --consentAt 2026-12-12 --consentRef "autorização por e-mail de 12/12/2026"
```

Números de prova (`proofStats`) também ficam escondidos até você preencher dados reais com a fonte.

## Pixels e cookies (LGPD)

Crie um arquivo `.env.local` (ou configure na Vercel) a partir de `.env.example`:

```
NEXT_PUBLIC_SITE_URL="https://www.seudominio.com.br"
NEXT_PUBLIC_META_PIXEL_ID="..."
NEXT_PUBLIC_GA4_ID="G-..."
NEXT_PUBLIC_TIKTOK_PIXEL_ID="..."
```

Os pixels **só carregam depois do aceite** no banner de cookies (medição → GA4; marketing → Meta e
TikTok). Eventos enviados: `PageView`, `ViewContent`, `InitiateCheckout` (clique em qualquer botão de
compra) e `OrderBumpSelected`, cada um com `event_id` único. O evento `Purchase` deve ser configurado
na plataforma de checkout (Kiwify/Hotmart/Eduzz) com o mesmo pixel — de preferência com a
Conversions API da própria plataforma.

## Deploy na Vercel

1. Suba o projeto para um repositório no GitHub.
2. Na Vercel: **Add New → Project**, importe o repositório (as configurações padrão do Next.js servem).
3. Em **Settings → Environment Variables**, adicione as variáveis do `.env.example`.
4. Conecte o domínio e atualize `siteUrl` em `site.config.ts` (ou `NEXT_PUBLIC_SITE_URL`).

A página é estática e é regenerada a cada minuto; o preço da fase também é recalculado no navegador.

## App de receitas (área de membros em `/app`)

O produto é um web app dentro deste mesmo projeto: `https://SEU-DOMINIO/app`. Funciona como o app do
protocolo creatina: **um login e uma senha padrão, iguais para todas as compradoras**, sem banco de dados.

**O que tem:** 102 receitas em 7 categorias (`content/recipes/`), busca por nome ou ingrediente, porções
ajustáveis, lista de compras que soma itens repetidos, favoritos, modo cozinha (tela acesa, um passo por
vez, timer com alarme e o "por quê" de cada etapa), "continuar de onde parou", Guia SOS, calculadora de
preço, os 3 bônus e instalação na tela inicial.

**Onde ficam os dados da cliente:** favoritos, lista de compras e progresso ficam salvos no próprio
aparelho (no navegador). Não há nada na nuvem; se ela trocar de celular, começa a lista do zero.

### Configurar (uma vez)

1. Na Vercel: *Settings → Environment Variables* → crie `APP_LOGIN` e `APP_PASSWORD` com o login e a
   senha que você quer entregar. **Não coloque a senha no código**: este repositório é público.
2. *Deployments → Redeploy*.
3. Na plataforma de checkout (Kiwify, Hotmart, Eduzz…), coloque na mensagem/e-mail de entrega:
   o link `https://SEU-DOMINIO/app`, o login e a senha.

A senha é conferida no servidor (não aparece no código do site), a sessão fica num cookie assinado por 90
dias e há limite de tentativas. **Trocar a senha** (ex.: na próxima edição, ou se ela vazar) desloga todo
mundo; avise as compradoras atuais da senha nova.

### Testar no computador

Crie um `.env.local` com `APP_LOGIN` e `APP_PASSWORD` e rode `npm run dev`. Sem esse arquivo, em
desenvolvimento o login de teste é `natal` / `panetone`.

### Editar receitas

Cada categoria é um arquivo em `content/recipes/` (formato comentado em `lib/app/recipe-model.ts`).
Guia SOS, substituições, cronograma e embalagens ficam em `content/recipes/guides.ts`.

## Testes

`npm test` cobre: fase atual por data (incluindo a virada exata), total com bump, parcelas, contagem
regressiva, preço "de" só com desconto real, UTMs no link do checkout, validação da config e a
renderização da seção da Roseli e da divulgação por `chef.mode`.

## Estrutura

```
app/            páginas (/, /sobre, /termos, /privacidade, /politica-de-reembolso), SEO, ícone, OG
components/     sections/ (blocos da página), phone/ (iPhone + telas do app), chef/, offer/ (relógio e CTAs), tracking/, ui/, decor/
config/         site.config.ts
content/        copy.ptBR.ts, story.ptBR.ts, legal.ptBR.ts, testimonials.json
lib/            preço, fases, contagem, UTMs, consentimento, eventos
scripts/        add-testimonial.ts
tests/          Vitest
```
