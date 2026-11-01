/**
 * História da Roseli (a Rô). Hoje o site usa chef.mode = "real": a história e as fotos
 * precisam ser VERDADEIRAS. Revise cada capítulo com a Roseli antes de publicar (CONFIRMAR).
 * Histórico: o modo "character" existia para uma personagem de marca.
 * - mode "character": história de marca (personagem declarada). NUNCA adicionar credenciais
 *   verificáveis (escolas, diplomas, restaurantes, anos de experiência, prêmios, imprensa, nº de alunos).
 * - mode "real": preencha `real` com dados REAIS e COMPROVÁVEIS da pessoa autorizada por contrato.
 */
export interface StoryChapter {
  id: string;
  title: string;
  paragraphs: string[];
  /** Lista numerada opcional (capítulo 5). */
  beliefs?: { title: string; text: string }[];
}

export const story = {
  meta: {
    title: "A história da Rô",
    description:
      "Da cozinha da avó ao caderninho de receitas: conheça a história da Roseli, a Rô das Receitinhas.",
  },
  eyebrow: "A história da Rô",
  title: "Massa boa não tem pressa. Mas tem método.",
  intro:
    "Uma história de cozinha de interior, de panetone que virou tijolo e de um caderninho cheio de descobertas.",

  character: {
    chapters: [
      {
        id: "vo-nena",
        title: "Capítulo 1 · A cozinha da vó Nena",
        paragraphs: [
          "Em toda casa de interior existe uma cozinha que vira o centro do mundo no fim do ano. A da minha vó Nena era assim. Em dezembro, o cheiro de laranja, canela e manteiga tomava a casa inteira, e eu ficava na ponta dos pés, espiando a massa crescer debaixo de um pano. Ela repetia sempre a mesma frase: *'Massa boa não tem pressa, Rô.'* Eu nem entendia direito. Só sabia que ali dentro morava uma mágica.",
        ],
      },
      {
        id: "tijolo",
        title: "Capítulo 2 · O panetone que virou tijolo",
        paragraphs: [
          "Anos depois, resolvi fazer meu primeiro panetone sozinha. Segui a receita à risca, ou achei que sim. Saiu duro, pesado, um verdadeiro tijolo de frutas. Fiquei com vontade de desistir e voltar para o de caixinha. Mas a voz da vó apareceu na minha cabeça: *pressa não combina com massa*.",
        ],
      },
      {
        id: "caderninho",
        title: "Capítulo 3 · O caderninho",
        paragraphs: [
          // CONFIRMAR (se a frase de "receitas testadas" não for verdadeira, suavizar)
          "Comecei a anotar tudo: o calor da cozinha, quanto tempo a massa descansou, como ela ficava ao toque. Foram páginas e páginas de erros e pequenas descobertas. Aquele caderninho virou o meu maior professor, e foi dele que nasceram as Receitinhas da Rô.",
        ],
      },
      {
        id: "mesa-cheia",
        title: "Capítulo 4 · A mesa cheia",
        paragraphs: [
          "Quando o panetone finalmente saiu fofinho e perfumado, a família inteira repetiu. Depois vieram os pedidos: *'Rô, faz um para mim?'* Foi aí que entendi que receita boa não é a mais difícil: é a que você consegue repetir.",
        ],
      },
      {
        id: "acredito",
        title: "Capítulo 5 · No que eu acredito",
        paragraphs: [],
        beliefs: [
          { title: "Medida em gramas, sem achismo.", text: "Cozinha de verdade precisa de precisão." },
          {
            title: "Cada passo vem com o porquê.",
            text: "Quando você entende, deixa de decorar e passa a dominar.",
          },
          { title: "Receita boa é a que você repete.", text: "Simples de fazer, linda de servir." },
        ],
      },
      {
        id: "por-que",
        title: "Capítulo 6 · Por que eu fiz o Especial de Natal",
        paragraphs: [
          "Porque eu conheço o frio na barriga de quem entra na cozinha em dezembro com medo de errar. Juntei aqui o que eu gostaria de ter tido no meu primeiro panetone: o passo a passo, o Guia SOS para os tropeços e a ceia inteira organizada. Para você chegar no dia 24 de avental, com o coração tranquilo.",
        ],
      },
    ] satisfies StoryChapter[],
    closing: "Vem cozinhar o Natal comigo?",
  },

  /** Frases-assinatura (banners, hero secundário, e-mails e stories). */
  signatures: [
    "Massa boa não tem pressa. Mas tem método.",
    "Receita boa é a que você repete.",
    "Na minha cozinha, nada de achismo: tudo em gramas.",
    "Errar faz parte. Por isso existe o Guia SOS.",
    "Natal bom é Natal com cheiro de casa.",
  ],

  /** Bio curta para Instagram, TikTok e WhatsApp Business. */
  shortBio:
    "Roseli, a Rô 🎄 Receitinhas da Rô: panetones, docinhos, salgados e ceia em passo a passo, para quem nunca fez. 👇 Especial de Natal",

  /**
   * Somente para chef.mode = "real". Preencha com dados REAIS e COMPROVÁVEIS.
   * Enquanto estiver vazio, o modo "real" usa os textos neutros da página.
   */
  real: {
    title: "Massa boa não tem pressa. Mas tem método.",
    paragraphs: [] as string[],
    /** Credenciais REAIS e comprováveis (ex.: cursos feitos). Vazio = não aparece. */
    credentials: [] as string[],
    /** CONFIRMAR: capítulos revisados pela Roseli (hoje reaproveitam a história de marca). */
    chapters: [] as StoryChapter[],
  },
};

story.real.chapters = story.character.chapters;
