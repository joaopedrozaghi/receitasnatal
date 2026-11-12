/**
 * Copy da página. Variáveis entre {{ }} vêm de site.config.ts (ver lib/offer.ts).
 * *texto* = destaque em itálico · **texto** = negrito · ~~texto~~ = riscado.
 * Itens marcados com // CONFIRMAR dependem do que o app terá de fato (ver ASSETS_TODO.md).
 */
export const copy = {
  meta: {
    title: "Especial de Natal {{year}} da Rô: panetones, docinhos, salgados e ceia num app passo a passo",
    description:
      "Mais de {{recipesCount}} receitas de Natal com a Roseli Monteiro: panetones, chocotones, docinhos, salgados de festa e ceia completa, num app com medidas em gramas, timer e Guia SOS. Garantia de {{guaranteeDays}} dias.",
  },

  topBar: {
    withAnchor: "🎄 {{phaseLabel}}: de R$ {{anchor}} por R$ {{price}} · o preço sobe em",
    withoutAnchor: "🎄 {{phaseLabel}}: R$ {{price}} · termina em",
  },

  hero: {
    pill: "Com a Roseli Monteiro, a Rô",
    eyebrow: "{{edition}} {{year}}",
    headlines: {
      A: "Panetone fofinho, docinhos e salgados de festa: *o Natal inteiro* na palma da sua mão.",
      B: "Pare de pagar caro por panetone seco. *Faça o seu* em casa, do jeito certo.",
      C: "A ceia que todo mundo elogia, *sem passar o dia* inteiro na cozinha.",
    },
    sub: "Mais de {{recipesCount}} receitas de panetones, chocotones, docinhos, salgados e ceia completa num app passo a passo pensado para quem nunca fez: medidas em gramas, timer em cada etapa e um Guia SOS para quando a massa não colabora.", // CONFIRMAR
    cta: "VER AS RECEITAS",
    priceLineWithAnchor: "De R$ {{anchor}} por **R$ {{price}}** · pagamento único",
    priceLineWithoutAnchor: "**R$ {{price}}** · pagamento único",
    trust: ["Acesso imediato", "Funciona no celular, sem baixar nada", "{{guaranteeDays}} dias de garantia"],
    floatingCard: { title: "Panetone Clássico", meta: "Passo 4 de 8 · timer 12:00" },
  },

  marquee: [
    "Panetone clássico",
    "Chocotone",
    "Panetone trufado",
    "Brigadeiro gourmet",
    "Beijinho",
    "Coxinha cremosa",
    "Empadinha",
    "Enroladinho",
    "Pernil natalino",
    "Farofa de frutas",
    "Rabanada",
    "Pavê",
    "Biscoito decorado",
    "Pão de mel",
    "Rosca doce",
  ], // CONFIRMAR: só receitas que estarão no app

  pain: {
    kicker: "Seja sincera(o)",
    title: "Todo fim de ano é *a mesma história*, né?",
    paragraphs: [
      "Dezembro chega, a lista de compras explode e o panetone de mercado custa uma fortuna. E ainda vem seco, doce demais ou com aquele gosto de essência.",
      "Você já tentou fazer em casa. A massa não cresceu, ficou pesada, densa. Aí desistiu e voltou para o de caixinha.",
      "Os docinhos? Ou empelotam, ou não dão ponto. Os salgados? Abrem na fritura. E a ceia vira uma maratona que começa às 7 da manhã e termina com você exausta(o) na hora da foto.",
      "E tem aquela vontade de vender um panetone aqui, uma caixinha de doces ali, mas sem saber quanto cobrar sem ter prejuízo.",
    ],
    turn: "Não é falta de talento. É falta de um passo a passo que explique *o que ninguém explica*.",
  },

  gallery: {
    kicker: "Direto do forno",
    title: "Receitas que *enchem os olhos* (e a mesa).",
    sub: "São mais de {{recipesCount}} receitas num app que abre no seu celular: panetones e chocotones, docinhos, salgados e a ceia completa. Cada uma com as medidas em gramas, um timer em cada etapa e o porquê de cada passo, para dar certo já na primeira vez.",
    cta: "QUERO MEU ESPECIAL DE NATAL",
    // CONFIRMAR: fotos com direito de uso; receitas que estarão no app
    items: [
      {
        src: "/images/receitas/panetones-trufados.jpg",
        alt: "Panetones trufados decorados com chocolate, morangos e castanhas",
        caption: "Panetones trufados",
      },
      {
        src: "/images/receitas/mesa-ceia.jpg",
        alt: "Mesa de ceia de Natal com pernil, aves assadas, panetone e tábua de frios",
        caption: "Ceia completa",
      },
      {
        src: "/images/receitas/mesa-docinhos.jpg",
        alt: "Mesa de festa com bandejas de docinhos, brigadeiros e bombons",
        caption: "Docinhos de festa",
      },
      {
        src: "/images/receitas/coxinhas.jpg",
        alt: "Coxinhas douradas em volta de uma tigela de molho",
        caption: "Salgados de festa",
      },
      {
        src: "/images/receitas/biscoitos-arvore.jpg",
        alt: "Biscoitos em formato de árvore de Natal decorados com glacê",
        caption: "Árvores de biscoito",
      },
    ],
  },

  menu: {
    kicker: "O cardápio completo",
    title: "Tudo o que vai para a mesa de Natal. *E para a vitrine também.*",
    sub: "{{modulesCount}} categorias, mais de {{recipesCount}} receitas e cada uma com medidas em gramas, tempos, temperaturas e o porquê de cada etapa.",
    // CONFIRMAR: categorias e exemplos precisam existir no app
    items: [
      {
        icon: "panettone",
        title: "Panetones e chocotones",
        photo: "/images/receitas/panetones-trufados.jpg",
        examples: "Clássico de frutas, chocotone, trufado, recheado de doce de leite, versão de travessa.",
        tag: "O carro-chefe",
      },
      {
        icon: "truffle",
        title: "Docinhos de festa",
        photo: "/images/receitas/mesa-docinhos.jpg",
        examples: "Brigadeiro gourmet, beijinho, bicho-de-pé, trufas, camafeu, docinho de nozes.",
      },
      {
        icon: "savory",
        title: "Salgados de festa",
        photo: "/images/receitas/salgados-festa.jpg",
        examples: "Coxinha cremosa, risoles, empadinha que desmancha, enroladinho, esfiha.",
      },
      {
        icon: "roast",
        title: "Ceia completa",
        photo: "/images/receitas/mesa-ceia.jpg",
        examples: "Pernil, ave assada, arroz natalino, farofa de frutas, salpicão e acompanhamentos.",
      },
      {
        icon: "dessert",
        title: "Sobremesas natalinas",
        photo: "/images/receitas/pudim.jpg",
        examples: "Rabanada sequinha, pavê, torta holandesa, pudim, mousse de maracujá.",
      },
      {
        icon: "wreath",
        title: "Pães, roscas e bolos",
        photo: "/images/receitas/paes.jpg",
        examples: "Rosca doce, pão de mel, bolo de frutas, pão de nozes para a ceia.",
      },
      {
        icon: "cookie",
        title: "Biscoitos decorados",
        photo: "/images/receitas/biscoitos-papai-noel.jpg",
        examples: "Amanteigados, biscoitos de gengibre e pão de mel decorado para presentear.",
      },
      {
        icon: "gift",
        title: "Presentes e vendas",
        examples: "Embalagens, cestas, etiquetas e como calcular o preço de cada item.",
      },
    ],
    cta: "QUERO O CARDÁPIO COMPLETO",
  },

  app: {
    kicker: "Por dentro do app",
    title: "Não é um PDF esquecido no celular. *É um app que cozinha com você.*",
    sub: "Abra no navegador, adicione à tela inicial e pronto: funciona como um aplicativo, sem baixar nada na loja.",
    // CONFIRMAR: o app precisa ter estes recursos
    features: [
      {
        icon: "flame",
        title: "Modo cozinha",
        text: "Tela sempre acesa e passo a passo em letras grandes, para seguir com a mão na massa.",
      },
      {
        icon: "clock",
        title: "Timer em cada etapa",
        text: "Fermentação, descanso, forno: o app conta o tempo por você.",
      },
      {
        icon: "scale",
        title: "Porções que se ajustam",
        text: "Quer fazer 2 ou 10 panetones? As medidas em gramas se recalculam sozinhas.",
      },
      {
        icon: "list",
        title: "Lista de compras",
        text: "Escolha as receitas e o app monta a lista do mercado.",
      },
      {
        icon: "sos",
        title: "Guia SOS",
        text: "Massa não cresceu? Ressecou? Afundou? Diagnóstico e solução na hora.",
      },
      {
        icon: "heart",
        title: "Favoritos e busca",
        text: "Encontre por nome ou ingrediente e salve as receitas da sua ceia.",
      },
    ],
    steps: [
      { title: "Compre", text: "O acesso chega no seu e-mail logo após a confirmação do pagamento." },
      { title: "Abra no celular", text: "Entre pelo link e adicione o app à tela inicial em 2 toques." },
      { title: "Cozinhe junto", text: "Escolha a receita e siga o passo a passo com timer." },
    ],
  },

  // Conteúdo de EXEMPLO das telas do iPhone (ilustrativo do app)
  phones: {
    home: {
      label: "Especial de Natal",
      question: "O que vamos fazer hoje?",
      featuredTag: "Destaque",
      featuredTitle: "Panetones trufados",
      featuredCta: "Ver receitas",
      categoriesTitle: "Categorias",
      categories: [
        { name: "Panetones", photo: "/images/receitas/panetones-trufados.jpg", focus: "30% 70%" },
        { name: "Salgados", photo: "/images/receitas/coxinhas.jpg", focus: "50% 55%" },
        { name: "Biscoitos", photo: "/images/receitas/biscoitos-papai-noel.jpg", focus: "50% 60%" },
        { name: "Ceia", photo: "/images/receitas/mesa-ceia.jpg", focus: "40% 30%" },
      ],
      continueTitle: "Continuar de onde parou",
      continueRecipe: "Biscoitos decorados",
      continueMeta: "Passo 3 de 6",
      continuePhoto: "/images/receitas/biscoitos-arvore.jpg",
      nav: ["Início", "Buscar", "Lista", "Favoritos"],
    },
    recipe: {
      photo: "/images/receitas/panetones-trufados.jpg",
      tag: "Panetones",
      title: "Panetone Trufado",
      meta: ["Rende 2", "Médio", "24 h"],
      servingsLabel: "Rendimento",
      servings: "2 de 500 g",
      ingredientsTitle: "Ingredientes",
      ingredients: [
        ["Farinha de trigo", "500 g"],
        ["Açúcar", "150 g"],
        ["Manteiga sem sal", "150 g"],
        ["Gemas", "120 g"],
        ["Gotas de chocolate", "200 g"],
        ["Ganache de chocolate", "300 g"],
      ],
      start: "Começar no modo cozinha",
    },
    cook: {
      badge: "Modo cozinha",
      step: "Passo 4 de 8",
      instruction: "Sove até a massa ficar lisa, elástica e soltar das mãos.",
      timer: "12:00",
      timerLabel: "Iniciar timer",
      whyTitle: "Por quê?",
      why: "O ponto de véu mostra que o glúten está formado. É ele que deixa o miolo fofinho.",
      next: "Próximo passo",
    },
    pricing: {
      title: "Calculadora de preço",
      item: "Panetone trufado 500 g",
      photo: "/images/receitas/panetones-trufados.jpg",
      rows: [
        ["Ingredientes", "R$ 14,80"],
        ["Embalagem", "R$ 3,50"],
        ["Gás e energia", "R$ 1,70"],
      ],
      costLabel: "Custo por unidade",
      cost: "R$ 20,00",
      marginLabel: "Margem desejada",
      margin: "100%",
      priceLabel: "Preço sugerido",
      price: "R$ 40,00",
      note: "Valores de exemplo",
    },
  },

  desire: {
    kicker: "Feche os olhos um segundo",
    title: "Agora imagine *outra cena*.",
    paragraphs: [
      "A casa cheirando a manteiga, laranja e baunilha. A mesa posta, os docinhos em forminhas douradas, a bandeja de salgados ainda quentinha.",
      "Alguém prova o primeiro pedaço do seu panetone, fecha os olhos e pergunta: *'Foi você que fez?'*",
      "E você, de avental, sorrindo, sabendo que não foi sorte. Foi método.",
    ],
    cta: "QUERO ESSA CENA NA MINHA CASA",
  },

  chef: {
    kicker: "Quem está do outro lado da receita",
    title: "Prazer, eu sou a Roseli Monteiro. *Mas pode me chamar de Rô.*",
    // CONFIRMAR: a história precisa ser verdadeira (Roseli é pessoa real)
    p1: "Meu amor pelo Natal nasceu na cozinha da minha avó, entre cheiro de laranja, canela e manteiga derretida. O primeiro panetone que fiz sozinha? Saiu duro como um tijolo. Eu ri, chorei e anotei tudo num caderninho.",
    p2: "Daquele caderninho nasceram as Receitinhas da Rô. Minha regra é simples: nada de receita sem explicação. Quando você entende por que a massa precisa descansar, ela deixa de ser um mistério e vira rotina.",
    beliefs: [
      { title: "Tudo em gramas", text: "Nada de achismo nem “xícara mais ou menos”." },
      { title: "Cada passo com o porquê", text: "Você entende e para de decorar." },
      { title: "Receita boa é a que você repete", text: "Simples de fazer, linda de servir." },
    ],
    signature: "Roseli Monteiro",
    signatureRole: "a Rô das Receitinhas",
    cta: "QUERO COZINHAR COM A RÔ",
    storyLink: "Conheça a minha história",
  },

  bonus: {
    kicker: "Presentes para você",
    title: "E ainda leva *3 bônus* de Natal",
    referenceLabel: "Valor de referência: R$ {{value}}",
    items: [
      {
        id: "cronograma",
        tag: "Bônus 1",
        photo: "/images/receitas/mesa-ceia.jpg",
        title: "Cronograma da Ceia em 72 horas",
        text: "O que comprar, o que adiantar e o que deixar para o dia. Checklist para chegar na noite do dia 24 sem correria.",
      },
      {
        id: "substituicoes",
        tag: "Bônus 2",
        photo: "/images/receitas/paes.jpg",
        title: "Guia de Substituições",
        text: "Faltou um ingrediente? Precisa de versão sem lactose? Trocas práticas para não travar no meio da receita.", // CONFIRMAR
      },
      {
        id: "embalagem",
        tag: "Bônus 3",
        photo: "/images/embalagens/presentes.jpg",
        title: "Guia de Embalagem e Apresentação",
        text: "Embalagens, etiquetas e montagem de cestas para presentear lindo ou vender bem.",
      },
    ],
  },

  income: {
    kicker: "Do forno ao WhatsApp",
    title: "No fim do ano, panetone vende. *E docinho também.*",
    text: "Nesta época cresce a procura por panetones artesanais, caixinhas de doces e cestas de presente. No Especial de Natal você aprende a calcular o custo, definir o preço e apresentar seu produto para vender a vizinhos, colegas e amigos, começando pequeno, do seu fogão.",
    cards: ["Calcule antes de gastar", "Defina o preço sem prejuízo", "Embale para encantar"],
    disclaimerLabel: "Aviso:",
    disclaimer:
      "Não prometemos ganhos. Os resultados dependem do seu esforço, divulgação, região e da qualidade do que você produz.",
  },

  audience: {
    forTitle: "É para você se…",
    forItems: [
      "quer impressionar a família na ceia sem passar o dia estressada(o)",
      "nunca fez massa fermentada e tem medo de errar",
      "quer docinhos e salgados de festa com cara de confeitaria",
      "quer presentear com algo feito à mão",
      "quer começar a vender no fim do ano, com preço certo",
    ],
    notTitle: "Não é para você se…",
    notItems: [
      "procura dinheiro fácil sem trabalho (não existe promessa de ganho aqui)",
      "não gosta de cozinhar",
      "espera aulas ao vivo ou acompanhamento individual (é um app de receitas)",
    ],
  },

  testimonials: {
    kicker: "Quem já fez",
    title: "O que dizem as alunas e alunos",
  },

  offer: {
    kicker: "Oferta especial",
    title: "Tudo o que você leva *hoje*",
    items: [
      "App Especial de Natal com mais de {{recipesCount}} receitas", // CONFIRMAR
      "Panetones, docinhos, salgados, ceia, sobremesas e biscoitos",
      "Modo cozinha, timer, porções ajustáveis e lista de compras", // CONFIRMAR
      "Guia SOS do panetone",
      "3 bônus: cronograma da ceia, substituições e embalagens",
      "Acesso {{accessDuration}} no celular, tablet e computador", // CONFIRMAR
      "Garantia incondicional de {{guaranteeDays}} dias",
    ],
    from: "De",
    by: "por apenas",
    installmentsLine: "ou {{count}}x de {{amount}} no cartão",
    methods: "Pix, cartão ou boleto · pagamento único",
    cta: "SIM, QUERO MEU ESPECIAL DE NATAL",
    micro: "🔒 Compra segura · Acesso imediato · Garantia de {{guaranteeDays}} dias",
    bump: {
      checkbox: "SIM, QUERO ADICIONAR!",
      title: "Leve também os {{bumpName}} por apenas R$ {{bumpPrice}}",
      body: "10 receitas premium de panetone + a **Planilha de Custos e Precificação**, que calcula quanto você gasta e por quanto vender cada panetone sem ter prejuízo.", // CONFIRMAR conteúdo
      price: "De ~~R$ {{bumpAnchor}}~~ por **R$ {{bumpPrice}}** · só neste pedido",
    },
    fullTag: "Plano completo",
    basic: {
      kicker: "Opção econômica",
      title: "Só os panetones",
      lead: "Para quem quer focar só no panetone deste Natal.",
      includes: [
        "{{basicRecipes}} receitas de panetone e chocotone",
        "Passo a passo com medidas em gramas",
        "Acesso imediato no celular",
        "Garantia de {{guaranteeDays}} dias",
      ],
      excludes: ["Ceia, docinhos, salgados e sobremesas", "Guia SOS do panetone", "Os 3 bônus"],
      price: "pagamento único",
      cta: "QUERO SÓ OS PANETONES",
      upsell: "Por mais **R$ {{diff}}** você leva o app completo, com mais de {{recipesCount}} receitas.",
      upsellLink: "Ver o plano completo",
    },
  },

  guarantee: {
    title: "Risco zero: *{{guaranteeDays}} dias* para testar.",
    text: "Entre no app, olhe as receitas, faça um panetone. Se em até {{guaranteeDays}} dias você sentir que não era o que esperava, mande uma mensagem para {{supportEmail}} e devolvemos 100% do valor. Sem perguntas e sem burocracia. O risco é todo nosso.",
    seal: "Garantia de {{guaranteeDays}} dias",
    sealUnit: "DIAS",
  },

  faq: {
    kicker: "Dúvidas",
    title: "Perguntas *frequentes*",
    items: [
      {
        q: "Nunca fiz panetone. Consigo?",
        a: "Consegue. O Especial de Natal foi pensado para iniciantes: medidas em gramas, tempos, temperaturas e o que observar em cada etapa. Se algo sair do esperado, o Guia SOS mostra como corrigir.",
      },
      {
        q: "Como funciona o app? Preciso baixar alguma coisa?",
        a: "É um web app: você abre pelo navegador do celular, tablet ou computador e pode adicionar à tela inicial para usar como um aplicativo. Não precisa baixar nada na loja.", // CONFIRMAR
      },
      {
        q: "Como recebo o acesso?",
        a: "Logo após a confirmação do pagamento, o acesso chega no seu e-mail. No Pix, a confirmação costuma ser em segundos. No boleto, até 3 dias úteis.",
      },
      {
        q: "Tem só panetone?",
        a: "Não. Além de panetones e chocotones, tem docinhos de festa, salgados, ceia completa, sobremesas, pães, roscas e biscoitos decorados.", // CONFIRMAR
      },
      {
        q: "Preciso de equipamentos especiais?",
        a: "Para a maioria das receitas, basta forno, balança e batedeira (ou disposição para sovar). Para o panetone, indicamos formas de papel próprias, que custam pouco. A lista completa está no app.", // CONFIRMAR
      },
      {
        q: "Posso vender o que eu preparar?",
        a: "Pode. Os panetones, doces e salgados que você fizer são seus para presentear ou vender. Só não é permitido copiar, compartilhar ou revender o acesso ao app.",
      },
      {
        q: "Dá para ganhar dinheiro com isso?",
        a: "Muita gente vende panetone e doces no fim do ano, e o app mostra como calcular custo, definir preço e apresentar o produto. Mas não prometemos resultado financeiro: ele depende do seu esforço, da sua divulgação, da sua região e da qualidade do que você produz.",
      },
      {
        q: "E se eu não gostar?",
        a: "Você tem {{guaranteeDays}} dias de garantia. Peça o reembolso por {{supportEmail}} e devolvemos 100% do valor.",
      },
      { q: "Quais formas de pagamento?", a: "Pix, cartão de crédito (parcelado) e boleto." },
      { q: "Por quanto tempo tenho acesso?", a: "Acesso {{accessDuration}}." }, // CONFIRMAR
      {
        q: "Comprei e não recebi. E agora?",
        a: "Escreva para {{supportEmail}} ou chame no WhatsApp. Respondemos em até 1 dia útil.",
      },
    ],
    // somente em chef.mode "character"
    characterItem: {
      q: "A Chef Rô é uma pessoa real?",
      a: "A Rô é a personagem que conduz as Receitinhas da Rô. Ela dá voz e rosto à marca {{legalName}}.",
    },
  },

  finalCta: {
    title: "Daqui a pouco é *24 de dezembro*.",
    text: "A mesa vai estar posta de qualquer jeito. A única pergunta é: o panetone vai ser o de caixinha de novo, ou o seu?",
    cta: "QUERO FAZER MEU NATAL COM A RÔ",
    micro: "Acesso imediato · {{guaranteeDays}} dias de garantia · Pix, cartão ou boleto",
  },

  footer: {
    disclaimer:
      "Os resultados variam de pessoa para pessoa e dependem de dedicação, ingredientes, equipamentos e condições locais. Este produto é digital; não há envio físico.",
    links: {
      about: "A história da Rô",
      terms: "Termos de uso",
      privacy: "Política de privacidade",
      refund: "Política de reembolso",
      contact: "Contato",
    },
    company: "{{legalName}} · CNPJ {{cnpj}}",
  },

  stickyCta: "Quero o Especial de Natal · R$ {{price}}",
} as const;

export type Copy = typeof copy;
