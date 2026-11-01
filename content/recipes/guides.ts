/** Guia SOS e bônus do app. */

export interface SosItem {
  id: string;
  problem: string;
  causes: string[];
  fix: string[];
  prevent: string;
}

export const sos: { title: string; items: SosItem[] }[] = [
  {
    title: "Panetone e massas fermentadas",
    items: [
      {
        id: "nao-cresceu",
        problem: "A massa não cresceu",
        causes: [
          "Fermento vencido ou morto por líquido quente demais",
          "Ambiente frio",
          "Muito sal ou açúcar em contato direto com o fermento",
        ],
        fix: [
          "Teste o fermento: 1 colher de chá em água morna com açúcar deve espumar em 10 minutos.",
          "Leve a massa para dentro do forno desligado com uma vasilha de água quente ao lado.",
          "Se em 3 horas nada mudar, refaça a esponja com fermento novo e incorpore à massa.",
        ],
        prevent: "Líquido morno é o que você aguenta encostar no pulso (cerca de 37 °C).",
      },
      {
        id: "pesado",
        problem: "Panetone pesado e denso",
        causes: ["Pouca sova (sem ponto de véu)", "Fermentação curta", "Excesso de farinha"],
        fix: [
          "Use o pedaço que sobrou para pudim de panetone (receita no app).",
          "Na próxima, sove até o ponto de véu e espere a massa realmente dobrar.",
        ],
        prevent: "Guie-se pelo volume, não pelo relógio.",
      },
      {
        id: "afundou",
        problem: "Afundou depois de assar",
        causes: ["Fermentou demais na forma", "Esfriou de pé", "Tirou do forno antes do tempo"],
        fix: ["Cubra com ganache ou chocolate: o topo fica bonito de novo."],
        prevent: "Leve ao forno quando a massa estiver a 1 dedo da borda e esfrie de cabeça para baixo.",
      },
      {
        id: "seco",
        problem: "Ficou seco",
        causes: ["Forno alto demais ou tempo demais", "Panetone pequeno com tempo de panetone grande"],
        fix: ["Pincele uma calda rala de açúcar com laranja e embale: ele recupera umidade em 1 dia."],
        prevent: "Use o palito: saiu limpo, tire do forno.",
      },
      {
        id: "frutas-no-fundo",
        problem: "As frutas foram para o fundo",
        causes: ["Frutas úmidas", "Massa mole demais"],
        fix: ["Sirva de cabeça para baixo: ninguém percebe."],
        prevent: "Envolva as frutas em farinha antes de incorporar.",
      },
      {
        id: "queimou-por-cima",
        problem: "Topo escuro e miolo cru",
        causes: ["Forno muito quente", "Grade alta demais"],
        fix: ["Cubra o topo com papel-alumínio e continue assando."],
        prevent: "Asse na grade do meio, a 170 °C.",
      },
    ],
  },
  {
    title: "Docinhos",
    items: [
      {
        id: "brigadeiro-mole",
        problem: "Brigadeiro mole, não dá para enrolar",
        causes: ["Saiu do fogo antes do ponto"],
        fix: [
          "Volte à panela e cozinhe mais 3 a 5 minutos.",
          "Ou sirva de colher em potinhos (vira brigadeiro de colher).",
        ],
        prevent: "Ponto: desgrudou do fundo por 3 segundos ao inclinar a panela.",
      },
      {
        id: "brigadeiro-duro",
        problem: "Brigadeiro duro ou açucarado",
        causes: ["Passou do ponto", "Fogo alto"],
        fix: ["Volte ao fogo com 2 colheres de creme de leite e mexa até amolecer."],
        prevent: "Fogo baixo do início ao fim.",
      },
      {
        id: "ganache-talhou",
        problem: "Ganache talhou (ficou oleosa)",
        causes: ["Creme quente demais", "Mexeu forte demais", "Ácido (maracujá) colocado de uma vez"],
        fix: ["Junte 1 colher de creme de leite frio e misture do centro para fora até voltar o brilho."],
        prevent: "Junte líquidos ácidos aos poucos.",
      },
    ],
  },
  {
    title: "Salgados",
    items: [
      {
        id: "coxinha-abriu",
        problem: "Coxinha abriu na fritura",
        causes: ["Massa pouco sovada", "Recheio quente ou úmido", "Óleo frio"],
        fix: ["Congele as que ainda não fritou por 30 minutos antes de fritar."],
        prevent: "Sove a massa morna até ficar lisa e use recheio frio.",
      },
      {
        id: "encharcado",
        problem: "Salgado encharcado de óleo",
        causes: ["Óleo abaixo de 160 °C", "Muitas unidades de uma vez"],
        fix: ["Escorra em papel e leve ao forno quente por 5 minutos."],
        prevent: "Frite poucos por vez a 170 °C.",
      },
    ],
  },
  {
    title: "Biscoitos",
    items: [
      {
        id: "espalhou",
        problem: "Biscoito espalhou e perdeu o formato",
        causes: ["Manteiga muito mole", "Massa batida demais", "Massa quente"],
        fix: ["Recorte com o cortador logo que sair do forno, ainda quente."],
        prevent: "Gele a massa já aberta por 30 minutos antes de cortar.",
      },
      {
        id: "glace-escorreu",
        problem: "Glacê escorreu ou não secou",
        causes: ["Glacê ralo demais", "Ambiente úmido"],
        fix: ["Junte açúcar de confeiteiro até o ponto de 10 segundos."],
        prevent: "Contorne com glacê firme antes de preencher.",
      },
    ],
  },
];

export const substitutions: { from: string; to: string; note?: string }[] = [
  {
    from: "Leite (em massas)",
    to: "Bebida vegetal sem açúcar, mesma quantidade",
    note: "Versão sem lactose",
  },
  {
    from: "Manteiga",
    to: "Margarina com 80% de lipídios ou manteiga sem lactose",
    note: "Evite margarina light: tem água demais",
  },
  { from: "Creme de leite", to: "Creme de leite sem lactose ou creme vegetal de coco" },
  {
    from: "Leite condensado (395 g)",
    to: "Leite condensado sem lactose ou caseiro: 1 xícara de leite em pó + 1/2 de açúcar + 1/2 de água quente batidos",
  },
  {
    from: "Fermento biológico fresco (30 g)",
    to: "Fermento biológico seco (10 g)",
    note: "Proporção 3 para 1",
  },
  { from: "Frutas cristalizadas", to: "Uvas-passas, damasco, cranberry ou gotas de chocolate" },
  { from: "Essência de panetone", to: "Raspas de 1 laranja + 1 limão + 1 colher de chá de baunilha" },
  { from: "Ovo (em biscoitos)", to: "1 colher de sopa de linhaça moída + 3 de água (descanse 10 min)" },
  { from: "Chocolate meio amargo", to: "Chocolate ao leite (fica mais doce: reduza o açúcar da receita)" },
  { from: "Requeijão cremoso", to: "Cream cheese ou ricota amassada com um pouco de leite" },
  { from: "Bacalhau", to: "Peixe branco firme (merluza, pescada) com um pouco mais de sal" },
  { from: "Pernil", to: "Lombo suíno ou paleta (ajuste o tempo pelo peso)" },
];

export interface ChecklistItem {
  id: string;
  label: string;
}

export const cronograma: { title: string; items: ChecklistItem[] }[] = [
  {
    title: "3 dias antes (dia 21)",
    items: [
      { id: "c1", label: "Definir o cardápio e quantas pessoas vêm" },
      { id: "c2", label: "Gerar a lista de compras no app e fazer o mercado" },
      { id: "c3", label: "Descongelar a ave ou o pernil na geladeira" },
      { id: "c4", label: "Fazer biscoitos e bolo de frutas (duram vários dias)" },
    ],
  },
  {
    title: "2 dias antes (dia 22)",
    items: [
      { id: "c5", label: "Assar os panetones (ficam melhores de um dia para o outro)" },
      { id: "c6", label: "Fazer os docinhos e guardar em potes fechados" },
      { id: "c7", label: "Dessalgar o bacalhau (se for usar)" },
    ],
  },
  {
    title: "1 dia antes (dia 23)",
    items: [
      { id: "c8", label: "Marinar o pernil ou temperar a ave" },
      { id: "c9", label: "Fazer pavê, pudim e sobremesas geladas" },
      { id: "c10", label: "Cozinhar e desfiar o frango do salpicão" },
      { id: "c11", label: "Separar travessas, toalha e decoração da mesa" },
    ],
  },
  {
    title: "Dia 24, manhã",
    items: [
      { id: "c12", label: "Montar o salpicão e a maionese (sem a batata palha)" },
      { id: "c13", label: "Preparar a farofa e deixar o arroz picado" },
      { id: "c14", label: "Colocar o pernil ou a ave no forno no horário certo" },
    ],
  },
  {
    title: "Dia 24, 2 horas antes",
    items: [
      { id: "c15", label: "Cozinhar o arroz e aquecer os acompanhamentos" },
      { id: "c16", label: "Montar a tábua de frios" },
      { id: "c17", label: "Fritar rabanadas ou deixar as de forno prontas para assar" },
      { id: "c18", label: "Tirar as sobremesas da geladeira 15 minutos antes" },
    ],
  },
];

export const packaging: { title: string; text: string }[] = [
  {
    title: "Panetone de 500 g",
    text: "Saco de polipropileno (celofane) com fecho de arame dourado, fita de cetim e etiqueta com sabor e validade (7 dias para frutas, 5 para recheados).",
  },
  {
    title: "Mini panetones",
    text: "Saquinho celofane individual + caixinha de papel kraft para 4 unidades. Ótimo para empresas e lembrancinhas.",
  },
  {
    title: "Docinhos",
    text: "Forminhas de papel nº 4, caixas de 4, 6 ou 12 unidades com berço. Guarde em local fresco e entregue em até 3 dias.",
  },
  {
    title: "Biscoitos decorados",
    text: "Saquinho individual selado (o glacê precisa estar totalmente seco, 8 horas). Pote de vidro para biscoitos simples.",
  },
  {
    title: "Cesta de Natal",
    text: "Base de caixa de madeira ou kraft, palha de papel no fundo, itens maiores atrás e menores na frente, cartão escrito à mão.",
  },
  {
    title: "Etiqueta",
    text: "Nome do produto, ingredientes principais, data de fabricação, validade, alérgenos (contém glúten, leite, ovos, castanhas) e seu contato.",
  },
];
