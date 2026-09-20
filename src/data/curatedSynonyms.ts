import { SynonymResponse } from '../types';

/**
 * Dicionário curated offline/instantâneo de alta performance para a Competência 1 do ENEM.
 * Resposta com 0ms de latência para os vocábulos e termos mais frequentes da redação.
 */
export const CURATED_OFFLINE_SYNONYMS: Record<string, SynonymResponse> = {
  coisa: {
    baseWord: "coisa",
    grammaticalClass: "Substantivo comum (hiperônimo vago)",
    avoidReasonC1: "O termo 'coisa' é excessivamente genérico e coloquial, empobrecendo a precisão lexical exigida na Competência 1.",
    c1GrammarTip: "Substitua por termos específicos que categorizem a realidade: fenômeno, conjuntura, entrave, prerrogativa ou matiz.",
    relatedExpressions: ["aspecto estrutural", "matiz sociocultural", "contingência fática", "prerrogativa cidadã"],
    synonyms: [
      {
        word: "contingência",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Refere-se a circunstâncias, ocorrências ou situações imprevisíveis ou que demandam enfrentamento fático.",
        exampleSentence: "Essa contingência histórica perpetua o abismo entre o texto constitucional e o cotidiano das camadas vulneráveis.",
        grammaticalNotes: "Substantivo feminino; combina com 'social', 'histórica', 'urgente'."
      },
      {
        word: "prerrogativa",
        formalityLevel: "Técnico / Jurídico / Filosófico",
        contextExplanation: "Use quando 'coisa' expressar direitos, garantias, poderes ou benefícios assegurados pela lei.",
        exampleSentence: "O acesso à cidadania plena não constitui privilégio, mas uma prerrogativa inalienável de todo indivíduo.",
        grammaticalNotes: "Substantivo feminino; rege preposição 'de'."
      },
      {
        word: "entrave",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Ideal para quando 'coisa' se refere a um obstáculo, barreira ou impedimento social.",
        exampleSentence: "Tal entrave burocrático inviabiliza a célere implementação das políticas públicas de amparo.",
        grammaticalNotes: "Substantivo masculino; antônimo de fomento ou facilitação."
      },
      {
        word: "fenômeno",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Empregado para caracterizar manifestações sociais, culturais ou comportamentais complexas.",
        exampleSentence: "Esse fenômeno sociológico decorre da naturalização histórica da desigualdade no território brasileiro.",
        grammaticalNotes: "Proparoxítona; acento circunflexo obrigatório."
      },
      {
        word: "preceito",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Utilizado quando se refere a normas, princípios, doutrinas ou mandamentos morais e legais.",
        exampleSentence: "A omissão estatal afronta o preceito fundamental da dignidade da pessoa humana.",
        grammaticalNotes: "Substantivo masculino; combina com 'constitucional', 'ético', 'jurídico'."
      }
    ],
    isAiGenerated: false
  },
  problema: {
    baseWord: "problema",
    grammaticalClass: "Substantivo masculino",
    avoidReasonC1: "A repetição de 'problema' empobrece o vocabulário e demonstra limitação estilística na C1.",
    c1GrammarTip: "Alterne sinônimos de acordo com a gravidade: use 'revés' ou 'percalço' para impasses menores, e 'chaga' ou 'calamidade' para denúncias contundentes.",
    relatedExpressions: ["chaga social", "revés estrutural", "calamidade pública", "impasse contemporâneo"],
    synonyms: [
      {
        word: "chaga social",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Confere forte juízo de valor argumentativo para problemas graves de exclusão, preconceito ou abandono.",
        exampleSentence: "Para mitigar essa chaga social, faz-se imperiosa a mobilização dos órgãos estatais competentes.",
        grammaticalNotes: "Expressão nominal substantiva com teor crítico explícito."
      },
      {
        word: "revés",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Designa um infortúnio, adversidade ou retrocesso que afeta o desenvolvimento coletivo.",
        exampleSentence: "A persistência desse revés denota a apatia das instituições responsáveis pela fiscalização.",
        grammaticalNotes: "Oxítona terminada em 'es' (acento agudo obrigatório); plural: reveses."
      },
      {
        word: "óbice",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Excelente substituto para barreira, obstáculo ou impedimento formal na argumentação.",
        exampleSentence: "Desse modo, a carência de letramento digital configura um grave óbice à inclusão produtiva dos jovens.",
        grammaticalNotes: "Proparoxítona; acento agudo na primeira sílaba."
      },
      {
        word: "imbróglio",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Refere-se a uma situação complexa, embaraçosa ou de difícil resolução institucional.",
        exampleSentence: "A superação desse imbróglio requer uma reformulação estrutural nos planos orçamentários da União.",
        grammaticalNotes: "Substantivo masculino com sonoridade sofisticada."
      },
      {
        word: "inércia",
        formalityLevel: "Técnico / Jurídico / Filosófico",
        contextExplanation: "Use quando o problema decorrer da falta de ação ou morosidade estatal e coletiva.",
        exampleSentence: "A inércia governamental catalisa a vulnerabilidade das populações historicamente marginalizadas.",
        grammaticalNotes: "Paroxítona terminada em ditongo crescente; acento agudo no 'é'."
      }
    ],
    isAiGenerated: false
  },
  fazer: {
    baseWord: "fazer",
    grammaticalClass: "Verbo transitivo direto / pronominal",
    avoidReasonC1: "O verbo 'fazer' tem baixa expressividade e alta ocorrência comum. Verbos de ação assertiva enriquecem a tese e a C5.",
    c1GrammarTip: "Na proposta de intervenção, evite 'fazer projetos'. Prefira 'implementar diretrizes', 'viabilizar programas' ou 'instituir mecanismos'.",
    relatedExpressions: ["engendrar esforços", "efetivar medidas", "viabilizar diretrizes", "fomentar práticas"],
    synonyms: [
      {
        word: "implementar",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Ideal para ações governamentais, políticas públicas e intervenções na Competência 5.",
        exampleSentence: "Cabe ao Ministério da Educação implementar núcleos interdisciplinares de conscientização ética.",
        grammaticalNotes: "Verbo transitivo direto (não rege preposição 'em': implementar algo)."
      },
      {
        word: "engendrar",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Significa conceber, arquitetar, criar ou dar origem a uma transformação consistente.",
        exampleSentence: "É imprescindível engendrar novos mecanismos de fiscalização para coibir a impunidade.",
        grammaticalNotes: "Verbo regular de 1ª conjugação; transitivo direto."
      },
      {
        word: "efetivar",
        formalityLevel: "Técnico / Jurídico / Filosófico",
        contextExplanation: "Significa transformar garantias teóricas em realidade fática e palpável.",
        exampleSentence: "Torna-se urgente efetivar os direitos preconizados pela Carta Magna de 1988.",
        grammaticalNotes: "Transitivo direto; perfeito para vincular à Constituição Cidadã."
      },
      {
        word: "viabilizar",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Indica tornar possível, fornecer condições e recursos para que uma política se concretize.",
        exampleSentence: "O Estado deve viabilizar investimentos prioritários na formação continuada do corpo docente.",
        grammaticalNotes: "Transitivo direto; grafado com 'z'."
      },
      {
        word: "fomentar",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Significa incentivar, estimular, promover o desenvolvimento de uma cultura ou debate.",
        exampleSentence: "As mídias televisivas e digitais devem fomentar campanhas de valorização da diversidade cultural.",
        grammaticalNotes: "Transitivo direto; muito valorizado na Competência 3 e 5."
      }
    ],
    isAiGenerated: false
  },
  ajudar: {
    baseWord: "ajudar",
    grammaticalClass: "Verbo transitivo direto e indireto",
    avoidReasonC1: "O verbo 'ajudar' evoca caridade ou assistencialismo simples, em vez de garantias constitucionais e deveres de Estado.",
    c1GrammarTip: "Atenção à regência: 'auxiliar a', 'contribuir para', 'propiciar a', 'mitigar o'. Evite 'ajuda as pessoas a entenderem', prefira 'propicia o discernimento da população'.",
    relatedExpressions: ["amparar os vulneráveis", "mitigar os efeitos", "potencializar o alcance", "subsidiar as ações"],
    synonyms: [
      {
        word: "mitigar",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Significa atenuar, suavizar, diminuir a intensidade de um problema ou sofrimento social.",
        exampleSentence: "Tal medida tem por finalidade precípua mitigar a vulnerabilidade das famílias periféricas.",
        grammaticalNotes: "Transitivo direto (mitigar os danos / mitigar as disparidades)."
      },
      {
        word: "amparar",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Indica proteção, acolhimento legal e institucional com base na dignidade humana.",
        exampleSentence: "É dever do poder público amparar os grupos que se encontram à margem do desenvolvimento socioeconômico.",
        grammaticalNotes: "Transitivo direto."
      },
      {
        word: "propiciar",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Indica criar condições favoráveis, proporcionar ou ensejar benefícios coletivos.",
        exampleSentence: "A ampliação das redes de assistência propicia a inserção digna desses cidadãos no mercado de trabalho.",
        grammaticalNotes: "Transitivo direto e indireto (propiciar algo a alguém)."
      },
      {
        word: "subsidiar",
        formalityLevel: "Técnico / Jurídico / Filosófico",
        contextExplanation: "Significa conceder suporte financeiro, técnico ou informativo para sustentar uma iniciativa pública.",
        exampleSentence: "A União deve subsidiar pesquisas acadêmicas voltadas ao desenvolvimento sustentável regional.",
        grammaticalNotes: "Pronúncia com som de /ss/ (sub-si-di-ar), nunca com som de /z/."
      }
    ],
    isAiGenerated: false
  },
  muito: {
    baseWord: "muito",
    grammaticalClass: "Advérbio de intensidade / Pronome indefinido",
    avoidReasonC1: "O uso repetido de 'muito' ou 'muitos' soa coloquial e impreciso. Advérbios eruditos denotam rigor estilístico.",
    c1GrammarTip: "Substitua 'muito grave' por 'alarmante' ou 'lancinante', e 'muitas pessoas' por 'parcela substancial da população' ou 'inúmeros cidadãos'.",
    relatedExpressions: ["expressiva parcela", "notável contingente", "de forma substancial", "em grau alarmante"],
    synonyms: [
      {
        word: "substancialmente",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Indica intensidade sólida, profunda e com impacto relevante.",
        exampleSentence: "O quadro de desigualdade agravou-se substancialmente nas últimas décadas.",
        grammaticalNotes: "Advérbio de modo/intensidade terminado em -mente."
      },
      {
        word: "expressivo(a)",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Substitui 'muito(a)' quando qualifica números, parcelas ou contingentes populacionais.",
        exampleSentence: "Uma expressiva parcela da sociedade civil permanece desprovida de informações básicas sobre o tema.",
        grammaticalNotes: "Adjetivo flexível em gênero e número (expressivo / expressivos)."
      },
      {
        word: "paulatinamente",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Use para processos que aumentam ou ocorrem em ritmo contínuo e gradativo.",
        exampleSentence: "A apatia coletiva corrói paulatinamente os laços de solidariedade democrática.",
        grammaticalNotes: "Advérbio elegante para enriquecer a progressão temática."
      },
      {
        word: "sobejamente",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Significa excessivamente, de modo mais que comprovado ou em abundância.",
        exampleSentence: "A ineficácia das sanções vigentes resta sobejamente demonstrada pelos dados estatísticos.",
        grammaticalNotes: "Advérbio de alto padrão estilístico."
      }
    ],
    isAiGenerated: false
  },
  mostrar: {
    baseWord: "mostrar",
    grammaticalClass: "Verbo transitivo direto",
    avoidReasonC1: "O verbo 'mostrar' é excessivamente corriqueiro. Verbos analíticos elevam a credibilidade da argumentação.",
    c1GrammarTip: "Empregue 'evidencia', 'denota', 'atesta' ou 'descortina' ao articular dados estatísticos, filósofos ou repertórios legitimados.",
    relatedExpressions: ["descortinar a realidade", "atestar a gravidade", "elucidar a questão", "denotar a omissão"],
    synonyms: [
      {
        word: "evidenciar",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Torna evidente, comprova de maneira clara e incontestável.",
        exampleSentence: "Os dados do IBGE evidenciam o descompasso entre a norma jurídica e a realidade fática.",
        grammaticalNotes: "Transitivo direto; combina com 'a urgência', 'o abismo', 'a disparidade'."
      },
      {
        word: "descortinar",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Significa desvelar, trazer à luz o que estava oculto ou invisibilizado.",
        exampleSentence: "A análise sociológica descortina as raízes históricas que sustentam a marginalização contemporânea.",
        grammaticalNotes: "Metáfora culta de alto impacto na Competência 1 e 3."
      },
      {
        word: "denotar",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Significa indicar como sinal, ser indício de, expressar significado subjacente.",
        exampleSentence: "A carência de investimentos públicos denota a falta de prioridade conferida aos direitos sociais.",
        grammaticalNotes: "Transitivo direto."
      },
      {
        word: "atestar",
        formalityLevel: "Técnico / Jurídico / Filosófico",
        contextExplanation: "Significa dar fé, certificar, comprovar com autoridade e peso documental.",
        exampleSentence: "Relatórios internacionais atestam a gravidade da poluição hídrica nos centros urbanos.",
        grammaticalNotes: "Transitivo direto."
      },
      {
        word: "elucidar",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Significa esclarecer, tornar inteligível ou explicar detalhadamente.",
        exampleSentence: "O pensamento do filósofo busca elucidar a dinâmica de alienação que acomete a coletividade.",
        grammaticalNotes: "Transitivo direto."
      }
    ],
    isAiGenerated: false
  },
  ruim: {
    baseWord: "ruim",
    grammaticalClass: "Adjetivo",
    avoidReasonC1: "'Ruim' é uma palavra de oralidade coloquial que empobrece a densidade argumentativa.",
    c1GrammarTip: "Use adjetivos qualificadores com juízo de valor contundente: 'deletério', 'funesto', 'pernicioso', 'nefasto' ou 'deplorável'.",
    relatedExpressions: ["efeito deletério", "cenário deplorável", "desfecho funesto", "impacto pernicioso"],
    synonyms: [
      {
        word: "deletério",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Aquilo que causa destruição, degradação moral ou danos graves à coletividade.",
        exampleSentence: "A desinformação propaga efeitos deletérios sobre a adesão da população às campanhas de vacinação.",
        grammaticalNotes: "Proparoxítona; acento agudo no 'é'."
      },
      {
        word: "pernicioso",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Algo extremamente prejudicial, nocivo, insidioso que atua de forma danosa e silenciosa.",
        exampleSentence: "A manutenção desse modelo predatório acarreta consequências perniciosas para os ecossistemas.",
        grammaticalNotes: "Adjetivo flexível (pernicioso / perniciosa)."
      },
      {
        word: "deplorável",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Que merece lástima, indignação, repúdio ou denúncia contundente.",
        exampleSentence: "Encontra-se em estado deplorável a infraestrutura de acolhimento às pessoas em situação de rua.",
        grammaticalNotes: "Paroxítona terminada em 'l'; acento agudo no 'á'."
      },
      {
        word: "nefasto",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Trágico, desastroso, que traz desgraça ou prejuízo irreparável ao desenvolvimento social.",
        exampleSentence: "Tal negligência produz um impacto nefasto sobre o futuro educacional das novas gerações.",
        grammaticalNotes: "Adjetivo de alta carga valorativa na Competência 3."
      }
    ],
    isAiGenerated: false
  },
  importante: {
    baseWord: "importante",
    grammaticalClass: "Adjetivo",
    avoidReasonC1: "O adjetivo 'importante' é clichê e pouco expressivo em dissertações argumentativas de alto nível.",
    c1GrammarTip: "Prefira termos que especifiquem a indispensabilidade: 'imprescindível', 'primordial', 'precípuo', 'fulcral' ou 'preponderante'.",
    relatedExpressions: ["papel preponderante", "elemento fulcral", "finalidade precípua", "condição sine qua non"],
    synonyms: [
      {
        word: "imprescindível",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Aquilo de que não se pode prescindir; absolutamente obrigatório e indispensável.",
        exampleSentence: "A cooperação entre o Estado e a sociedade civil é imprescindível para romper o ciclo da violência.",
        grammaticalNotes: "Paroxítona terminada em 'l'; grafado com 'sc' e 'nd'."
      },
      {
        word: "precípuo(a)",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Principal, essencial, que está em primeiro lugar na ordem de relevância.",
        exampleSentence: "A garantia da dignidade humana constitui o objetivo precípuo do Estado Democrático de Direito.",
        grammaticalNotes: "Proparoxítona; acento agudo no 'í'."
      },
      {
        word: "fulcral",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Central, basilar, ponto em torno do qual toda a estrutura gravita.",
        exampleSentence: "A valorização do corpo docente representa a questão fulcral para a reforma do ensino público.",
        grammaticalNotes: "Adjetivo uniforme (o ponto fulcral / a questão fulcral)."
      },
      {
        word: "primordial",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Que existe desde o princípio, fundamental, prioritário e estruturante.",
        exampleSentence: "Desempenha papel primordial a democratização do acesso aos bens culturais no país.",
        grammaticalNotes: "Adjetivo uniforme de registro formal."
      }
    ],
    isAiGenerated: false
  },
  mudar: {
    baseWord: "mudar",
    grammaticalClass: "Verbo transitivo direto e intransitivo",
    avoidReasonC1: "O verbo 'mudar' é excessivamente genérico e não expressa a profundidade de transformação exigida no ENEM.",
    c1GrammarTip: "Use verbos que indiquem o sentido exato: 'transfigurar' (mudança profunda), 'subverter' (romper ordem injusta), 'remodelar' ou 'reestruturar'.",
    relatedExpressions: ["reestruturar o panorama", "subverter a lógica", "transfigurar a realidade", "ressignificar práticas"],
    synonyms: [
      {
        word: "reestruturar",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Dar nova estrutura, reorganizar planos orçamentários, leis ou matrizes curriculares.",
        exampleSentence: "Torna-se imperativo reestruturar a rede de atenção básica para acolher as famílias vulneráveis.",
        grammaticalNotes: "Transitivo direto; não exige preposição."
      },
      {
        word: "subverter",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Romper ou transformar radicalmente uma ordem histórica excludente ou injusta.",
        exampleSentence: "É preciso subverter a lógica patriarcal que relega a mulher à invisibilidade do cuidado doméstico.",
        grammaticalNotes: "Transitivo direto; confere expressivo juízo crítico."
      },
      {
        word: "transfigurar",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Modificar a feição, conferir nova forma ou elevar a dignidade de um cenário degradado.",
        exampleSentence: "Políticas educacionais inclusivas detêm o condão de transfigurar a realidade periférica.",
        grammaticalNotes: "Transitivo direto."
      },
      {
        word: "ressignificar",
        formalityLevel: "Técnico / Jurídico / Filosófico",
        contextExplanation: "Atribuir novo significado cultural ou desconstruir estigmas enraizados.",
        exampleSentence: "Faz-se premente ressignificar o debate em torno das doenças mentais na esfera pública.",
        grammaticalNotes: "Transitivo direto; grafado com 'ss'."
      }
    ],
    isAiGenerated: false
  },
  sociedade: {
    baseWord: "sociedade",
    grammaticalClass: "Substantivo feminino",
    avoidReasonC1: "O vocábulo 'sociedade' é repetido inúmeras vezes na introdução e nos desenvolvimentos, tornando o texto monótono.",
    c1GrammarTip: "Especifique a dimensão social de acordo com a tese: 'tecido social', 'corpo coletivo', 'esfera pública' ou 'cidadania'.",
    relatedExpressions: ["tecido social", "corpo cívico", "esfera pública", "coletividade"],
    synonyms: [
      {
        word: "tecido social",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Excelente metáfora sociológica que designa a teia de relações, vínculos e solidariedade entre os cidadãos.",
        exampleSentence: "A desigualdade extrema esgarça o tecido social e fragiliza os consensos democráticos fundamentais.",
        grammaticalNotes: "Expressão nominal feminina singular."
      },
      {
        word: "coletividade",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Enfatiza a totalidade dos cidadãos e a responsabilidade mútua na vida comunitária.",
        exampleSentence: "Compete à coletividade fiscalizar ativamente a destinação das verbas voltadas ao saneamento.",
        grammaticalNotes: "Substantivo feminino."
      },
      {
        word: "corpo cívico",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Refere-se ao conjunto de cidadãos conscientes de seus direitos e deveres políticos.",
        exampleSentence: "O letramento científico fortalece o corpo cívico contra a disseminação de fraudes virtuais.",
        grammaticalNotes: "Expressão nominal masculina."
      },
      {
        word: "esfera pública",
        formalityLevel: "Técnico / Jurídico / Filosófico",
        contextExplanation: "Conceito filosófico (Habermas) para o espaço de debate, deliberação e formação de opinião coletiva.",
        exampleSentence: "A ampliação do debate na esfera pública é a via basilar para o combate ao etarismo.",
        grammaticalNotes: "Locução nominal feminina."
      }
    ],
    isAiGenerated: false
  },
  grande: {
    baseWord: "grande",
    grammaticalClass: "Adjetivo",
    avoidReasonC1: "'Grande' é vago e pouco rigoroso. O ENEM valoriza adjetivos de alta densidade semântica.",
    c1GrammarTip: "Defina a dimensão do fenômeno: se for tamanho de problema, use 'vultoso', 'alarmante' ou 'abissal'; se for prestígio, use 'notório' ou 'eminente'.",
    relatedExpressions: ["abissal disparidade", "vultoso contingente", "notória relevância", "dimensão colossal"],
    synonyms: [
      {
        word: "abissal",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Indica algo profundo como um abismo; perfeito para desigualdades, distâncias ou contrastes sociais.",
        exampleSentence: "Persiste um contraste abissal entre o investimento nos grandes centros e as áreas interioranas.",
        grammaticalNotes: "Adjetivo uniforme (o fosso abissal / a desigualdade abissal)."
      },
      {
        word: "vultoso(a)",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Apropriado para volumes financeiros, quantias orçamentárias, dados e contingentes expressivos.",
        exampleSentence: "Embora demande recursos vultosos, a preservação ambiental gera dividendos civilizatórios inestimáveis.",
        grammaticalNotes: "Não confunda com 'vultuoso' (que significa com rosto congestionado/inchado)."
      },
      {
        word: "expressivo(a)",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Que possui significado e relevância inequívoca.",
        exampleSentence: "Constata-se uma expressiva elevação no índice de evasão escolar no ensino médio.",
        grammaticalNotes: "Adjetivo flexível em gênero e número."
      },
      {
        word: "alarmante",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Use quando a grandeza do número provocar sobressalto, preocupação ou clamor por intervenção.",
        exampleSentence: "Apresenta dimensões alarmantes a persistência da violência contra as mulheres no país.",
        grammaticalNotes: "Adjetivo uniforme de forte teor argumentativo."
      }
    ],
    isAiGenerated: false
  },
  governo: {
    baseWord: "governo",
    grammaticalClass: "Substantivo masculino",
    avoidReasonC1: "Usar apenas 'o governo' é genérico na Competência 5 e 1. A banca exige detalhamento institucional.",
    c1GrammarTip: "Na C5, desdobre o governo: 'Poder Executivo Federal', 'Ministério da Cidadania', 'Poder Público' ou 'Estado Democrático de Direito'.",
    relatedExpressions: ["Poder Público", "Estado Democrático de Direito", "Executivo Federal", "máquina estatal"],
    synonyms: [
      {
        word: "Poder Público",
        formalityLevel: "Técnico / Jurídico / Filosófico",
        contextExplanation: "Designa o conjunto dos órgãos estatais incumbidos da tutela e salvaguarda do bem comum.",
        exampleSentence: "Incumbe ao Poder Público garantir os meios orçamentários para a efetivação das diretrizes educacionais.",
        grammaticalNotes: "Grafado com iniciais maiúsculas quando se refere à autoridade estatal soberana."
      },
      {
        word: "Estado",
        formalityLevel: "Técnico / Jurídico / Filosófico",
        contextExplanation: "Conceito político e jurídico institucional da nação soberana.",
        exampleSentence: "O Estado brasileiro deve honrar o pacto federativo estabelecido pela Carta Magna de 1988.",
        grammaticalNotes: "Grafado com 'E' maiúsculo para Estado soberano / político (com minúscula para estado federativo/condição)."
      },
      {
        word: "Poder Executivo",
        formalityLevel: "Técnico / Jurídico / Filosófico",
        contextExplanation: "Órgão específico do governo responsável pela administração direta e execução das políticas públicas.",
        exampleSentence: "Cabe ao Poder Executivo regulamentar as diretrizes de fiscalização das plataformas digitais.",
        grammaticalNotes: "Grafado com maiúsculas para o poder da República."
      },
      {
        word: "administração pública",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Aparelho estatal técnico e de gestão que coordena os serviços prestados à cidadania.",
        exampleSentence: "A administração pública deve pautar suas decisões pelo princípio da transparência e eficiência.",
        grammaticalNotes: "Expressão nominal feminina."
      }
    ],
    isAiGenerated: false
  },
  ter: {
    baseWord: "ter",
    grammaticalClass: "Verbo",
    avoidReasonC1: "O verbo 'ter' é frequentemente utilizado de forma coloquial no lugar de 'haver' ou 'existir' ('na sociedade tem muitos problemas').",
    c1GrammarTip: "ERRO CRÍTICO NA C1: Nunca use 'tem' no sentido de existir. Escreva 'há problemas' (sempre no singular) ou 'existem problemas'. Para posse de qualidades, prefira 'ostentar', 'deter', 'possuir' ou 'consubstanciar'.",
    relatedExpressions: ["deter a prerrogativa", "ostentar relevância", "consubstanciar garantias", "apresentar desdobramentos"],
    synonyms: [
      {
        word: "haver",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "No sentido de existir ou ocorrer na sociedade.",
        exampleSentence: "Há profundas contradições entre a garantia do Artigo 5º e a realidade dos presídios brasileiros.",
        grammaticalNotes: "VERBO IMPESSOAL: sempre no singular no sentido de existir (NUNCA diga 'haviam problemas')."
      },
      {
        word: "deter",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "No sentido de possuir direitos, prerrogativas, poder ou competência institucional.",
        exampleSentence: "O Ministério da Saúde detém a prerrogativa institucional de coordenar as campanhas de imunização.",
        grammaticalNotes: "Conjugação irregular: ele detém (com acento agudo) / eles detêm (com circunflexo)."
      },
      {
        word: "consubstanciar",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Significa concretizar, dar substância real ou materializar algo.",
        exampleSentence: "O investimento continuado em ciência consubstancia o compromisso do país com a soberania.",
        grammaticalNotes: "Transitivo direto."
      },
      {
        word: "apresentar",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Substitui 'tem' para características, cenários e diagnósticos.",
        exampleSentence: "O território nacional apresenta notável diversidade cultural e regional.",
        grammaticalNotes: "Transitivo direto."
      }
    ],
    isAiGenerated: false
  },
  "hoje em dia": {
    baseWord: "hoje em dia",
    grammaticalClass: "Locução adverbial de tempo",
    avoidReasonC1: "A locução 'hoje em dia' é considerada marca clássica de oralidade e informalidade na redação do ENEM.",
    c1GrammarTip: "Substitua sempre por marcadores temporais cultos e dissertativos: 'no cenário contemporâneo', 'na hodiernidade', 'na atual conjuntura' ou 'na pós-modernidade'.",
    relatedExpressions: ["na hodiernidade", "no cenário contemporâneo", "na atual conjuntura", "no contexto vigente"],
    synonyms: [
      {
        word: "na hodiernidade",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Expressão erudita de altíssimo prestígio estilístico para indicar a época atual.",
        exampleSentence: "Na hodiernidade, a proliferação de notícias fraudulentas compromete a integridade do processo eleitoral.",
        grammaticalNotes: "Locução adverbial de tempo deslocada: exige vírgula obrigatória."
      },
      {
        word: "no cenário contemporâneo",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Locução dissertativa elegante e universalmente aceita pelos avaliadores do INEP.",
        exampleSentence: "No cenário contemporâneo, a solidariedade comunitária foi substituída pelo individualismo mercadológico.",
        grammaticalNotes: "Exige vírgula após a expressão quando situada no início do período."
      },
      {
        word: "na conjuntura vigente",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Enfatiza a dinâmica política, econômica e social do tempo presente.",
        exampleSentence: "Na conjuntura vigente, a garantia de segurança alimentar figura como dever inadiável do Estado.",
        grammaticalNotes: "Vírgula obrigatória pelo adjunto adverbial antecipado."
      },
      {
        word: "na contemporaneidade",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Denota a era contemporânea com precisão histórico-sociológica.",
        exampleSentence: "A contemporaneidade assiste ao paradoxo entre hiperconectividade e solidão patológica.",
        grammaticalNotes: "Substantivo feminino; sem crase aqui (na = em + a)."
      }
    ],
    isAiGenerated: false
  },
  ver: {
    baseWord: "ver",
    grammaticalClass: "Verbo transitivo direto",
    avoidReasonC1: "Expressões como 'dá pra ver', 'podemos ver' ou 'a gente vê' contêm oralidade e pessoalidade (1ª pessoa).",
    c1GrammarTip: "Use construções impessoais na voz passiva sintética: 'constata-se', 'observa-se', 'infere-se' ou 'vislumbra-se'.",
    relatedExpressions: ["constata-se que", "vislumbra-se a urgência", "infere-se desse cenário", "depreende-se da análise"],
    synonyms: [
      {
        word: "constatar",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Indica verificar com base em fatos e evidências objetivas.",
        exampleSentence: "Constata-se a perpetuação de barreiras atitudinais contra as pessoas com deficiência.",
        grammaticalNotes: "Uso impessoal com partícula apassivadora: 'Constata-se' (singular) / 'Constatam-se falhas' (plural)."
      },
      {
        word: "vislumbrar",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Significa enxergar ao longe, antever ou entrever possibilidades e horizontes.",
        exampleSentence: "Vislumbra-se, portanto, a urgência de uma reformulação nas diretrizes curriculares nacionais.",
        grammaticalNotes: "Transitivo direto; verbo de elevado padrão dissertativo."
      },
      {
        word: "depreender",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Significa deduzir logicamente a partir da análise dos fatos e premissas expostas.",
        exampleSentence: "Depreende-se da teoria de Zygmunt Bauman que as relações humanas perderam sua solidez original.",
        grammaticalNotes: "Rege preposição 'de' (depreender algo de algo)."
      },
      {
        word: "inferir",
        formalityLevel: "Técnico / Jurídico / Filosófico",
        contextExplanation: "Tirar conclusão com base no raciocínio argumentativo.",
        exampleSentence: "Infere-se que a negligência familiar acentua o isolamento dos indivíduos idosos.",
        grammaticalNotes: "Transitivo direto e indireto."
      }
    ],
    isAiGenerated: false
  },
  bom: {
    baseWord: "bom",
    grammaticalClass: "Adjetivo",
    avoidReasonC1: "'Bom' é vago e pueril para uma dissertação argumentativa do ENEM.",
    c1GrammarTip: "Substitua por qualificadores precisos: 'profícuo', 'proveitoso', 'benéfico', 'esplêndido' ou 'salutar'.",
    relatedExpressions: ["desfecho profícuo", "iniciativa salutar", "efeito benfazejo", "prática salutar"],
    synonyms: [
      {
        word: "profícuo(a)",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Que produz bons frutos, resultados vantajosos e rendosos para a sociedade.",
        exampleSentence: "O diálogo intersetorial constitui uma via profícua para a consolidação de políticas públicas duradouras.",
        grammaticalNotes: "Proparoxítona; acento agudo no 'í'."
      },
      {
        word: "salutar",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Que faz bem à saúde, à moral ou à ordem democrática.",
        exampleSentence: "A fiscalização popular sobre os gastos públicos representa uma prática salutar à democracia.",
        grammaticalNotes: "Adjetivo uniforme (iniciativa salutar / hábito salutar)."
      },
      {
        word: "benfazejo(a)",
        formalityLevel: "Erudito / Alto Padrão",
        contextExplanation: "Que traz benefícios materiais, morais ou espirituais a outrem.",
        exampleSentence: "Tais incentivos fiscais exercem papel benfazejo na dinamização da economia comunitária.",
        grammaticalNotes: "Grafado com 'z'."
      },
      {
        word: "proveitoso(a)",
        formalityLevel: "Formal Dissertativo",
        contextExplanation: "Que gera proveito, utilidade e avanço civilizatório concreto.",
        exampleSentence: "A inclusão de temas de educação financeira no currículo escolar revela-se altamente proveitosa.",
        grammaticalNotes: "Adjetivo regular flexível."
      }
    ],
    isAiGenerated: false
  }
};
