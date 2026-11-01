/**
 * Textos-base das páginas legais. ATENÇÃO: revise com um advogado antes de publicar.
 * Variáveis {{ }} vêm de site.config.ts.
 */
export interface LegalDoc {
  title: string;
  description: string;
  updatedAt: string;
  sections: { heading: string; paragraphs: string[] }[];
}

export const legalWarning =
  "Texto-base em revisão. Este conteúdo deve ser revisado por um advogado antes da publicação.";

export const terms: LegalDoc = {
  title: "Termos de uso",
  description: "Condições de uso do site e do produto digital {{brandName}} · {{edition}}.",
  updatedAt: "01/11/2026",
  sections: [
    {
      heading: "1. Quem somos",
      paragraphs: [
        'Este site e o produto {{brandName}} · {{edition}} são oferecidos por {{legalName}}, CNPJ {{cnpj}} ("nós"). Contato: {{supportEmail}}.',
        "As receitas e o conteúdo são apresentados por Roseli Monteiro (a Rô), rosto das Receitinhas da Rô.",
      ],
    },
    {
      heading: "2. O produto",
      paragraphs: [
        "O {{edition}} é um produto 100% digital, entregue como web app (aplicativo acessado pelo navegador). Não há envio físico.",
        "O acesso é liberado após a confirmação do pagamento, pelos canais informados no momento da compra, e tem duração {{accessDuration}}, enquanto o produto for comercializado.",
      ],
    },
    {
      heading: "3. Compra e pagamento",
      paragraphs: [
        "A compra é processada por uma plataforma de pagamentos parceira, que recebe os seus dados de pagamento diretamente. Nós não armazenamos dados de cartão.",
        "O preço exibido é o vigente no momento da compra. Ofertas por tempo limitado têm data e hora de término informadas na página.",
      ],
    },
    {
      heading: "4. Licença de uso",
      paragraphs: [
        "Você recebe uma licença pessoal e intransferível para acessar o material. É proibido copiar, compartilhar, revender ou distribuir o material (PDF, acessos ou partes dele).",
        "Os panetones, doces e pratos que você preparar com as receitas são seus: você pode presenteá-los ou vendê-los livremente.",
      ],
    },
    {
      heading: "5. Resultados",
      paragraphs: [
        "Os resultados variam de pessoa para pessoa e dependem de dedicação, ingredientes, equipamentos e condições locais. Não prometemos ganhos financeiros: eventuais vendas dependem do seu esforço, divulgação, região e da qualidade do que você produz.",
      ],
    },
    {
      heading: "6. Garantia e arrependimento",
      paragraphs: [
        "Você tem {{guaranteeDays}} dias, contados da compra, para pedir o reembolso integral, conforme o art. 49 do Código de Defesa do Consumidor. Veja a Política de Reembolso.",
      ],
    },
    {
      heading: "7. Alterações e foro",
      paragraphs: [
        "Podemos atualizar estes termos; a versão vigente fica sempre nesta página. Fica eleito o foro do domicílio do consumidor.",
      ],
    },
  ],
};

export const privacy: LegalDoc = {
  title: "Política de privacidade",
  description: "Como tratamos seus dados pessoais, de acordo com a LGPD (Lei 13.709/2018).",
  updatedAt: "01/11/2026",
  sections: [
    {
      heading: "1. Controlador",
      paragraphs: [
        "{{legalName}}, CNPJ {{cnpj}}, é a controladora dos dados tratados neste site. Contato do encarregado (DPO): {{supportEmail}}.",
      ],
    },
    {
      heading: "2. Quais dados tratamos",
      paragraphs: [
        "Navegação: páginas visitadas, dispositivo, parâmetros de campanha (UTMs) e, somente com o seu consentimento, cookies de medição (Google Analytics) e de marketing (Meta e TikTok).",
        "Compra: nome, e-mail, telefone, CPF (quando exigido) e dados de pagamento são coletados pela plataforma de pagamentos parceira, que atua conforme a própria política de privacidade. Recebemos dela os dados necessários para liberar o acesso e prestar suporte.",
      ],
    },
    {
      heading: "3. Para que usamos",
      paragraphs: [
        "Para entregar o produto, prestar suporte, cumprir obrigações legais e fiscais, medir o desempenho da página e, com o seu consentimento, exibir anúncios mais relevantes.",
      ],
    },
    {
      heading: "4. Bases legais",
      paragraphs: [
        "Execução de contrato (entrega do produto e suporte), cumprimento de obrigação legal, legítimo interesse (segurança e prevenção a fraudes) e consentimento (cookies não essenciais e comunicações de marketing).",
      ],
    },
    {
      heading: "5. Cookies",
      paragraphs: [
        'Cookies essenciais mantêm o site funcionando e guardam a sua escolha de cookies. Cookies de medição e marketing só são ativados se você aceitar no banner. Você pode mudar a escolha a qualquer momento em "Gerenciar cookies", no rodapé.',
      ],
    },
    {
      heading: "6. Compartilhamento",
      paragraphs: [
        "Compartilhamos dados apenas com fornecedores necessários à operação (plataforma de pagamentos, hospedagem, e-mail e, com consentimento, plataformas de anúncios e medição). Não vendemos dados pessoais.",
      ],
    },
    {
      heading: "7. Seus direitos",
      paragraphs: [
        "Você pode pedir confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação dos dados tratados com consentimento, informação sobre compartilhamentos e revogação do consentimento, pelo e-mail {{supportEmail}}.",
      ],
    },
    {
      heading: "8. Retenção e segurança",
      paragraphs: [
        "Guardamos os dados pelo tempo necessário às finalidades acima e aos prazos legais. Adotamos medidas técnicas e administrativas para proteger os dados.",
      ],
    },
  ],
};

export const refund: LegalDoc = {
  title: "Política de reembolso",
  description: "Garantia de {{guaranteeDays}} dias e direito de arrependimento (CDC, art. 49).",
  updatedAt: "01/11/2026",
  sections: [
    {
      heading: "1. Garantia de {{guaranteeDays}} dias",
      paragraphs: [
        "Se em até {{guaranteeDays}} dias contados da compra você sentir que o produto não era o que esperava, devolvemos 100% do valor pago. Sem perguntas e sem burocracia.",
      ],
    },
    {
      heading: "2. Como pedir",
      paragraphs: [
        "Envie um e-mail para {{supportEmail}} com o e-mail usado na compra, ou solicite diretamente pela plataforma de pagamentos onde a compra foi feita.",
      ],
    },
    {
      heading: "3. Como o valor é devolvido",
      paragraphs: [
        "Pix e boleto: devolução na conta indicada por você. Cartão de crédito: estorno na fatura, conforme os prazos da operadora do cartão (pode aparecer em até duas faturas).",
        "Após o reembolso, o acesso ao material é encerrado.",
      ],
    },
  ],
};
