# O que falta fornecer ou validar antes de publicar

## 1. Bloqueia a publicação

- [ ] **Link do checkout** → `config/site.config.ts > checkout.url` (Kiwify/Hotmart/Eduzz). Sem ele, os botões só rolam até a oferta.
- [ ] **Dados da empresa** → `brand.legalName`, `brand.cnpj`, `brand.supportEmail`, `brand.supportWhatsapp` (hoje são placeholders e aparecem no rodapé, na garantia, no FAQ e nas páginas legais).
- [ ] **Domínio** → `siteUrl` (SEO, sitemap, Open Graph).
- [ ] **Revisão jurídica** de `/termos`, `/privacidade` e `/politica-de-reembolso` (`content/legal.ptBR.ts`). O aviso de revisão fica no topo das páginas até você removê-lo (`legalWarning`).
- [ ] **Datas e preços das fases** → `pricing.phases` (hoje: R$ 37 até 15/11, R$ 57 até 10/12, depois R$ 97). O preço "de" (R$ 97) precisa ser praticado de fato.
- [ ] **Parcelas** → `pricing.installments` igual à configuração da plataforma.

## 2. Roseli (pessoa real) — precisa ser verdade

A página apresenta a Roseli como pessoa real, sem aviso de personagem. Então:

- [ ] **Fotos**: precisam ser da Roseli, com autorização de uso de imagem por escrito. As fotos `Replace_person_in_image…` parecem ter o rosto trocado por IA; se o rosto não for o dela, não use como se fosse.
- [ ] **História**: a avó, o panetone "tijolo", o caderninho (seção da Roseli em `copy.ptBR.ts > chef` e capítulos de `/sobre` em `content/story.ptBR.ts`). Ajuste o que não for real.
- [ ] **"Dólmã"/cozinha profissional**: nenhuma credencial é citada. Só adicione credenciais comprováveis em `story.real.credentials`.

## 3. Itens `// CONFIRMAR` (dependem do app, que ainda será construído)

Tudo o que a página promete precisa existir no app no dia da venda.

| Onde | O que confirmar |
| --- | --- |
| `site.config.ts > product.recipesCount` | número real de receitas (hoje "mais de 100") |
| `site.config.ts > product.accessDuration` | tempo de acesso (hoje "vitalício") |
| `copy.ptBR.ts > marquee` | as receitas da faixa rolante |
| `copy.ptBR.ts > menu.items` | as 8 categorias e os exemplos de cada uma |
| `copy.ptBR.ts > app.features` | modo cozinha, timer, porções ajustáveis, lista de compras, Guia SOS, favoritos/busca |
| `copy.ptBR.ts > app.steps` + FAQ "Como funciona o app?" | acesso por e-mail, web app instalável na tela inicial |
| `copy.ptBR.ts > offer.items` | o que está incluído |
| `copy.ptBR.ts > offer.bump.body` | conteúdo do bump: 10 receitas premium + Planilha de Custos e Precificação |
| `copy.ptBR.ts > bonus.items` | os 3 bônus (Guia de Substituições com versão sem lactose) |
| `copy.ptBR.ts > faq` | equipamentos ("lista completa no app"), categorias |
| `copy.ptBR.ts > phones` | telas de EXEMPLO do iPhone (ingredientes, passos e valores da calculadora são ilustrativos; a calculadora já diz "Valores de exemplo") |

## 4. Fotos

| Foto | Situação | Arquivo |
| --- | --- | --- |
| Roseli de dólmã (retrato) | ✅ seção "Prazer, eu sou a Roseli", /sobre e avatar | `public/images/ro-retrato.jpg` |
| Roseli com panetone | ✅ topo da página e recorte nas telas do iPhone | `public/images/ro-panetone.jpg` |
| Roseli mexendo a panela | ✅ foto redonda na seção da Roseli | `public/images/ro-panela.jpg` |
| Roseli cozinhando (outro ângulo) | ✅ "Agora imagine outra cena" e /sobre | `public/images/ro-cozinha.jpg` |
| Extras | não usadas: `ro-varanda.jpg`, `ro-preparo.jpg` | `public/images/` |
| Fotos reais das receitas (docinhos, salgados, ceia) | ⬜ ideal para trocar nas telas do iPhone quando o app existir | — |
| Prints reais do app | ⬜ quando o app estiver pronto, substitua as telas de exemplo (`components/phone/Screens.tsx`) | — |

## 5. Opcional

- [ ] `checkout.urlWithBump` — link do checkout já com o order bump (mostra a caixinha na oferta).
- [ ] Pixels: `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID` (+ evento Purchase na plataforma).
- [ ] `bonuses[].referenceValue` — só com valor real praticado.
- [ ] Depoimentos reais (`npm run testimonial:add`) e `proofStats` com fonte.
- [ ] Bio curta para redes: `content/story.ptBR.ts > shortBio`.
