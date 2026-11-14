/**
 * Base de Dados Oficial: Cartilha do Participante INEP / MEC (Edição Atualizada 2024 / 2025)
 * "A Redação no ENEM - Matriz de Referência Oficial, Critérios de Correção e Amostras Nota 1000"
 * 
 * Fonte canônica: Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (INEP)
 * Módulos de Treinamento de Corretores Oficiais da Redação do ENEM
 */

export interface CartilhaCompetencyLevel {
  level: number;
  score: number;
  officialDescriptor: string;
  evaluatorGuidance: string;
  tolerancesAndLimits: string;
  examplesOrEvidence: string[];
}

export interface CartilhaCompetencyRule {
  competency: number;
  name: string;
  shortTitle: string;
  officialDefinition: string;
  evaluatorFocus: string;
  maximumScore: 200;
  weightInTotal: 20; // 20%
  zeroTolerances: string[];
  levels: Record<0 | 1 | 2 | 3 | 4 | 5, CartilhaCompetencyLevel>;
  pedagogicalGoldenRules: string[];
}

export interface CartilhaZeroSituation {
  code: string;
  title: string;
  description: string;
  legalBasis: string;
  inepModuleRule: string;
}

export interface CartilhaScoreProfile {
  tier: 'Abaixo de 700' | 'Faixa 800 (Regular)' | 'Faixa 880-920 (Bom)' | 'Faixa 940-960 (Excelente)' | 'Faixa 1000 (Perfeição)';
  scoreRange: [number, number];
  officialProfileName: string;
  typicalCharacteristics: string[];
  keyBottleNecks: string[];
  cartilhaPrescriptionToNextTier: string;
  representativeSamplesFromCartilha: string[];
}

export const CARTILHA_METADATA = {
  edition: 'Cartilha Oficial do Participante - A Redação no ENEM 2025/2026',
  governingBody: 'INEP - Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira',
  ministry: 'MEC - Ministério da Educação',
  version: '2025-2026-V.Oficial',
  totalCompetencies: 5,
  maxTotalScore: 1000,
  passingScoreReference: 700,
  excellenceReference: 900,
  perfectionReference: 1000,
  discrepancyThresholdBetweenEvaluators: 80, // >80 pts por competência ou >100 pts no total aciona 3º avaliador
};

export const CARTILHA_ZERO_SITUATIONS: CartilhaZeroSituation[] = [
  {
    code: 'ZERO_FUGA_TEMA',
    title: 'Fuga Total ao Tema',
    description: 'O texto não aborda o assunto geral nem as palavras-chave centrais propostas pela banca examinadora.',
    legalBasis: 'Item 14.4 do Edital ENEM e Módulo 1 da Cartilha do Corretor INEP.',
    inepModuleRule: 'Se o participante não tangenciar sequer o assunto mais amplo, a redação é zerada sumariamente por ambos os avaliadores.',
  },
  {
    code: 'ZERO_NAO_DISSERTATIVO',
    title: 'Não Atendimento ao Tipo Textual',
    description: 'Texto predominantemente narrativo, poético, epistolar (carta), injuntivo ou sem defesa de um ponto de vista com argumentos.',
    legalBasis: 'Matriz de Referência da Competência 2 e Tipologia Dissertativo-Argumentativa.',
    inepModuleRule: 'A ausência de tese e de estrutura argumentativa com introdução, desenvolvimento e proposta desqualifica a tipologia exigida.',
  },
  {
    code: 'ZERO_EXTENSAO_INSUFICIENTE',
    title: 'Extensão de até 7 Linhas',
    description: 'Redações com até 7 linhas manuscritas na folha oficial de redação são desconsideradas e recebem nota zero.',
    legalBasis: 'Regra estrita de extensão mínima da folha de respostas.',
    inepModuleRule: 'Linhas com cópia literal dos textos motivadores são sumariamente descontadas na contagem de linhas efetivas.',
  },
  {
    code: 'ZERO_COPIA_INTEGRAL',
    title: 'Cópia dos Textos Motivadores',
    description: 'Texto composto integralmente por trechos copiados da proposta ou da prova objetiva sem produção autoral mínima.',
    legalBasis: 'Critério de Autoria da Competência 2.',
    inepModuleRule: 'Se descontadas as linhas copiadas restarem menos de 8 linhas autorais, a nota é compulsoriamente zero.',
  },
  {
    code: 'ZERO_PARTE_DESCONECTADA',
    title: 'Parte Deliberadamente Desconectada',
    description: 'Inserção voluntária de mensagens, orações, receitas de miojo, hinos, recados aos corretores, desenhos ou sinais gráficos fora do contexto.',
    legalBasis: 'Critério de anulação por quebra de seriedade do exame (Módulo 2 do INEP).',
    inepModuleRule: 'Identificação de zombaria ou qualquer tentativa de anulação deliberada anula a prova integralmente.',
  },
  {
    code: 'ZERO_LINGUA_ESTRANGEIRA',
    title: 'Redação em Língua Estrangeira',
    description: 'Texto redigido integralmente em outro idioma que não a Língua Portuguesa oficial.',
    legalBasis: 'Constituição Federal e Edital do ENEM.',
    inepModuleRule: 'Apenas termos pontuais em língua estrangeira são permitidos quando justificados por contexto ou repertório sociocultural.',
  },
  {
    code: 'ZERO_FOLHA_EM_BRANCO',
    title: 'Folha de Redação em Branco',
    description: 'Folha oficial entregue sem texto na área de resposta, mesmo que haja rascunho preenchido.',
    legalBasis: 'Regulamento de preenchimento de instrumentos de avaliação do INEP.',
    inepModuleRule: 'O rascunho não é corrigido pela banca sob nenhuma hipótese legal.',
  },
];

export const CARTILHA_COMPETENCIES: Record<1 | 2 | 3 | 4 | 5, CartilhaCompetencyRule> = {
  1: {
    competency: 1,
    name: 'Domínio da Norma Padrão da Língua Escrita',
    shortTitle: 'Norma Padrão & Sintaxe',
    officialDefinition: 'Demonstrar domínio da modalidade escrita formal da língua portuguesa.',
    evaluatorFocus: 'Avalia a estrutura sintática (orações completas, complexidade de períodos) e o controle estrito de desvios gramaticais, ortográficos e de registro culto.',
    maximumScore: 200,
    weightInTotal: 20,
    zeroTolerances: [
      'Uso vulgar de gírias e oralidade grosseira incompatível com a norma',
      'Desconhecimento total da pontuação e da concordância básica',
      'Estruturas sintáticas ininteligíveis',
    ],
    levels: {
      0: {
        level: 0,
        score: 0,
        officialDescriptor: 'Demonstra desconhecimento da modalidade escrita formal da língua portuguesa.',
        evaluatorGuidance: 'Texto com erros generalizados que impedem a compreensão e desvios em quase todas as palavras.',
        tolerancesAndLimits: '0 desvios tolerados para notas superiores.',
        examplesOrEvidence: ['Texto ininteligível ou desprovido de regras básicas de escrita.'],
      },
      1: {
        level: 1,
        score: 40,
        officialDescriptor: 'Demonstra domínio precário da modalidade escrita formal da língua portuguesa, com diversificados e frequentes desvios gramaticais, de escolha de registro e de convenções da escrita.',
        evaluatorGuidance: 'Frequência alarmante de desvios e estrutura sintática deficitária com muitos períodos incompletos.',
        tolerancesAndLimits: 'Mais de 10 desvios e múltiplas falhas estruturais graves.',
        examplesOrEvidence: ['Erros constantes de concordância verbal, acentuação e pontuação caótica.'],
      },
      2: {
        level: 2,
        score: 80,
        officialDescriptor: 'Demonstra domínio insuficiente da modalidade escrita formal da língua portuguesa, com muitos desvios gramaticais, de escolha de registro e de convenções da escrita.',
        evaluatorGuidance: 'Desvios recorrentes que chamam atenção constante do leitor e prejudicam a fluidez formal.',
        tolerancesAndLimits: 'Entre 6 e 10 desvios gramaticais e de convenção.',
        examplesOrEvidence: ['Problemas recorrentes de crase, regência e pontuação entre sujeito e predicado.'],
      },
      3: {
        level: 3,
        score: 120,
        officialDescriptor: 'Demonstra domínio mediano da modalidade escrita formal da língua portuguesa e da estrutura sintática, com alguns desvios gramaticais e de convenções da escrita.',
        evaluatorGuidance: 'Estrutura sintática regular, períodos medianos com 4 a 6 desvios pontuais não recorrentes.',
        tolerancesAndLimits: 'Até 5 desvios gramaticais e no máximo 1 falha sintática leve.',
        examplesOrEvidence: ['Uso esporádico de informalidade, falhas leves de paralelismo e pontuação facultativa.'],
      },
      4: {
        level: 4,
        score: 160,
        officialDescriptor: 'Demonstra bom domínio da modalidade escrita formal da língua portuguesa e da estrutura sintática, com poucos desvios gramaticais e de convenções da escrita.',
        evaluatorGuidance: 'Bom domínio formal, com até 3 desvios pontuais leves e no máximo 1 falha sintática, OU texto sem erros ortográficos porém com períodos pouco complexos ou marcas de oralidade/clichês vagos/imprecisão vocabular (ex.: "no dia a dia", "por causa de", "tomar medidas", "acaba gerando", "coisas").',
        tolerancesAndLimits: 'Ausência isolada de erros ortográficos não garante 200 pts; oralidade ou imprecisão vocabular limitam a 160 pts.',
        examplesOrEvidence: ['Texto compreensível sem desvios gráficos graves, mas com expressões coloquiais ou períodos simples repetitivos.'],
      },
      5: {
        level: 5,
        score: 200,
        officialDescriptor: 'Demonstra excelente domínio da modalidade escrita formal da língua portuguesa e de estrutura sintática, sendo desvios gramaticais ou de convenções da escrita aceitos somente como excepcionalidade e quando não forem recorrentes.',
        evaluatorGuidance: 'Reservado a textos com períodos complexos bem articulados (subordinação clara, intercalações precisas) e vocabulário formal preciso, sem marcas de oralidade nem clichês vagos. Admite-se no máximo 2 desvios leves isolados não recorrentes e 0 falhas estruturais sintáticas.',
        tolerancesAndLimits: 'Máximo 2 desvios isolados não recorrentes, 0 falhas sintáticas e rigor formal lexical completo.',
        examplesOrEvidence: ['Períodos complexos bem articulados, vocabulário formal preciso, ausência de oralidade e de "o mesmo" anafórico.'],
      },
    },
    pedagogicalGoldenRules: [
      'Evite o "o mesmo" como pronome anafórico (use "este", "esse", "o qual" ou elipse).',
      'Nunca separe sujeito de verbo por vírgula nem verbo de complemento direto.',
      'Período complexo não é período infinito: use ponto final a cada 2 ou 3 orações articuladas com conectivos.',
      'Cuidado com o truncamento: nunca inicie períodos com orações subordinadas ou gerúndios isolados da oração principal.',
    ],
  },

  2: {
    competency: 2,
    name: 'Compreensão da Proposta Temática & Repertório Sociocultural',
    shortTitle: 'Tema & Repertório',
    officialDefinition: 'Compreender a proposta de redação e aplicar conceitos das várias áreas do conhecimento para desenvolver o tema, dentro dos limites estruturais do texto dissertativo-argumentativo em prosa.',
    evaluatorFocus: 'Avalia a abordagem integral da frase temática (todas as palavras-chave), o atendimento à tipologia dissertativa (introdução, D1, D2, conclusão) e o uso de repertório sociocultural LEGITIMADO, PERTINENTE e PRODUTIVO.',
    maximumScore: 200,
    weightInTotal: 20,
    zeroTolerances: [
      'Tangenciamento compulsório que desconsidera a frase-guia',
      'Uso de repertório ilegítimo ou totalmente fantasioso',
      'Texto com feição narrativa ou descritiva',
    ],
    levels: {
      0: {
        level: 0,
        score: 0,
        officialDescriptor: 'Fuga ao tema ou não atendimento à estrutura dissertativo-argumentativa.',
        evaluatorGuidance: 'Redação que trata de outro assunto ou adota estrutura diferente de prosa dissertativa.',
        tolerancesAndLimits: 'Critério eliminatório do exame.',
        examplesOrEvidence: ['Poema, narrativa em primeira pessoa desprovida de argumentação ou tema completamente diferente.'],
      },
      1: {
        level: 1,
        score: 40,
        officialDescriptor: 'Apresenta o assunto, tangenciando o tema, ou demonstra domínio precário do texto dissertativo-argumentativo, com traços constantes de outros tipos textuais.',
        evaluatorGuidance: 'Tangenciamento do tema (fala do assunto geral, mas ignora o recorte específico) ou predomínio de trechos narrativos/descritivos.',
        tolerancesAndLimits: 'Nota padrão para tangenciamento segundo a Cartilha do Corretor INEP.',
        examplesOrEvidence: ['Abordar "cinema" sem discutir a "democratização do acesso" no Brasil.'],
      },
      2: {
        level: 2,
        score: 80,
        officialDescriptor: 'Desenvolve o tema recorrendo à cópia de trechos dos textos motivadores ou apresenta domínio insuficiente do texto dissertativo-argumentativo, não articulando partes essenciais.',
        evaluatorGuidance: 'Argumentação excessivamente baseada em paráfrases ou cópias diretas dos dados fornecidos na prova.',
        tolerancesAndLimits: 'Repertório limitado estritamente à coletânea da proposta.',
        examplesOrEvidence: ['Uso exclusivo de estatísticas dos infográficos da prova sem reflexão própria.'],
      },
      3: {
        level: 3,
        score: 120,
        officialDescriptor: 'Desenvolve o tema por meio de argumentação previsível e apresenta domínio mediano do texto dissertativo-argumentativo, com repertório sociocultural baseado estritamente nos textos motivadores ou desprovido de legitimidade formal.',
        evaluatorGuidance: 'Repertório legítimo mas sem pertinência clara, ou repertório do senso comum sem área do saber comprovada.',
        tolerancesAndLimits: 'Não atinge 160 nem 200 sem repertório legitimado de fora da prova.',
        examplesOrEvidence: ['Mencionar notícias genéricas ("ouvi dizer na TV") ou reflexões sem lastro acadêmico/cultural.'],
      },
      4: {
        level: 4,
        score: 160,
        officialDescriptor: 'Desenvolve o tema por meio de argumentação consistente e apresenta bom domínio do texto dissertativo-argumentativo, com repertório sociocultural legitimado e pertinente ao tema, mas sem uso produtivo nos desenvolvimentos.',
        evaluatorGuidance: 'Repertório legitimado presente APENAS na introdução (ex.: citar a CF/88 na introdução sem mobilizar repertório externo em D1 nem em D2), ou repertório em D1/D2 pouco articulado à tese. Nomes de ministérios, leis ou órgãos citados apenas como agentes na Conclusão NÃO contam como repertório.',
        tolerancesAndLimits: 'Teto máximo de 160 pts quando não há repertório sociocultural produtivo na argumentação (D1 e/ou D2).',
        examplesOrEvidence: ['Citar a Constituição Federal na introdução e desenvolver D1 e D2 apenas com senso comum ou citar ministérios só na conclusão.'],
      },
      5: {
        level: 5,
        score: 200,
        officialDescriptor: 'Desenvolve o tema por meio de argumentação consistente, a partir de um repertório sociocultural produtivo e apresenta excelente domínio do texto dissertativo-argumentativo.',
        evaluatorGuidance: 'Abordagem COMPLETA do tema (todas as palavras do recorte). Estrutura dissertativa em 4 parágrafos. Para atingir 200 pontos, é obrigatório haver repertório sociocultural LEGITIMADO, PERTINENTE e PRODUTIVO também nos parágrafos de argumentação (D1 e/ou D2) — não apenas na introdução nem restrito a órgãos/leis da conclusão.',
        tolerancesAndLimits: 'Exige pertinência explícita e vínculo produtivo na argumentação (D1 e/ou D2).',
        examplesOrEvidence: ['Articulação orgânica de conceitos como "Cidadanias Mutiladas" de Milton Santos nos desenvolvimentos para sustentar as causas do problema.'],
      },
    },
    pedagogicalGoldenRules: [
      'A tríade do repertório na Cartilha: 1. Legitimado (área formal) + 2. Pertinente (ao tema) + 3. Produtivo (sustenta a argumentação em D1/D2).',
      'Não concentre o repertório apenas na introdução: mobilize referências produtivas nos parágrafos de desenvolvimento (D1 e/ou D2) para alcançar 200 pts.',
      'Ministérios, leis ou órgãos citados apenas como agentes da Proposta de Intervenção (Conclusão) não contam como repertório sociocultural.',
      'Aborde todas as palavras-chave do tema desde a introdução e mantenha a macroestrutura dissertativa em 4 parágrafos equilibrados.',
    ],
  },

  3: {
    competency: 3,
    name: 'Seleção, Organização e Interpretação de Argumentos (Projeto de Texto)',
    shortTitle: 'Projeto de Texto & Causalidade',
    officialDefinition: 'Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos em defesa de um ponto de vista.',
    evaluatorFocus: 'Avalia a presença de projeto de texto estratégico (tese + 2 argumentos distintos anunciados na introdução e desenvolvidos em D1 e D2) e a distinção entre argumentação expositiva e aprofundamento estrutural com causa, consequência crítica e repertório nos dois desenvolvimentos.',
    maximumScore: 200,
    weightInTotal: 20,
    zeroTolerances: [
      'Contradição lógica direta entre teses ou parágrafos',
      'Amontoado de ideias sem qualquer linha de raciocínio',
      'Lacuna argumentativa que compromete a validade da tese',
    ],
    levels: {
      0: {
        level: 0,
        score: 0,
        officialDescriptor: 'Apresenta informações, fatos e opiniões não relacionados ao tema e sem defesa de um ponto de vista.',
        evaluatorGuidance: 'Ausência total de projeto de texto ou tese articulada.',
        tolerancesAndLimits: 'Critério eliminatório da competência.',
        examplesOrEvidence: ['Frases desconexas que não formam um argumento de defesa.'],
      },
      1: {
        level: 1,
        score: 40,
        officialDescriptor: 'Apresenta informações, fatos e opiniões pouco relacionados ao tema ou incoerentes e sem defesa de um ponto de vista.',
        evaluatorGuidance: 'Argumentos soltos, superficiais e com graves falhas de coerência.',
        tolerancesAndLimits: 'Projeto de texto embrionário ou incoerente.',
        examplesOrEvidence: ['Ideias contraditórias entre os parágrafos.'],
      },
      2: {
        level: 2,
        score: 80,
        officialDescriptor: 'Apresenta informações, fatos e opiniões relacionados ao tema, mas desorganizados ou contraditórios e limitados à defesa de um ponto de vista.',
        evaluatorGuidance: 'Projeto de texto com muitas falhas e argumentos apresentados sem cadeia de causa e efeito.',
        tolerancesAndLimits: 'Argumentação puramente expositiva.',
        examplesOrEvidence: ['Listagem de fatos sem explicar o porquê de serem danosos.'],
      },
      3: {
        level: 3,
        score: 120,
        officialDescriptor: 'Apresenta informações, fatos e opiniões relacionados ao tema, limitados aos textos motivadores e pouco organizados em defesa de um ponto de vista.',
        evaluatorGuidance: 'Projeto de texto com falhas visíveis (ex: introdução promete argumento A e B, mas no desenvolvimento fala de C; ou argumentos com lacunas causais).',
        tolerancesAndLimits: 'Lacunas argumentativas que deixam perguntas no leitor ("por que isso acontece?").',
        examplesOrEvidence: ['Afirmar que a educação é precária sem apontar a causa nem a consequência direta.'],
      },
      4: {
        level: 4,
        score: 160,
        officialDescriptor: 'Apresenta informações, fatos e opiniões relacionados ao tema, de forma consistente e organizada, com projeto de texto com poucos desvios na defesa de um ponto de vista.',
        evaluatorGuidance: 'Manter 4 parágrafos com dois argumentos distintos garante no máximo 160 pontos se D1 e/ou D2 permanecerem predominantemente expositivos/superficiais (apenas constatam o problema e efeitos óbvios sem analisar causas estruturais ou mecanismos sociais).',
        tolerancesAndLimits: 'Desenvolvimentos expositivos ou com aprofundamento desigual entre D1 e D2 limitam a C3 a 160 pts.',
        examplesOrEvidence: ['D1 e D2 abordam eixos distintos, mas descrevem o problema sem demonstrar sua origem estrutural e consequência crítica.'],
      },
      5: {
        level: 5,
        score: 200,
        officialDescriptor: 'Apresenta informações, fatos e opiniões relacionados ao tema, de forma consistente e organizada, configurando autoria em defesa de um ponto de vista.',
        evaluatorGuidance: 'Reservado exclusivamente para textos com projeto estratégico completo (tese + 2 eixos distintos anunciados na introdução) que articulam repertório, causa estrutural profunda e consequência crítica nos DOIS parágrafos de desenvolvimento (D1 e D2), sem repetição de ideia central entre eles.',
        tolerancesAndLimits: 'Exige aprofundamento causal e consequência crítica em AMBOS os desenvolvimentos (D1 e D2).',
        examplesOrEvidence: ['Encadeamento completo entre a tese inicial, a causa estrutural e o desdobramento crítico em D1 e em D2, articulados à conclusão.'],
      },
    },
    pedagogicalGoldenRules: [
      'Na introdução, declare claramente a tese e os dois eixos causais distintos que serão aprofundados no D1 e no D2.',
      'Não fique na constatação expositiva: em D1 e em D2, analise a causa estrutural (origem do problema), articule com repertório produtivo e explicite a consequência social crítica.',
      'Elimine lacunas argumentativas: explique como e por que o mecanismo denunciado produz o impacto social apontado.',
      'Garanta que D1 e D2 tratem de causas ou dimensões distintas do problema, evitando repetir o mesmo argumento central.',
    ],
  },

  4: {
    competency: 4,
    name: 'Demonstração do Conhecimento dos Mecanismos Linguísticos (Coesão Textual)',
    shortTitle: 'Coesão & Articulação',
    officialDefinition: 'Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação.',
    evaluatorFocus: 'Avalia o encadeamento textual, a presença e diversidade de operadores argumentativos interparágrafos (mínimo 2 expressivos) e intraparágrafos em todos os períodos, sem repetições viciosas nem inadequação coesiva.',
    maximumScore: 200,
    weightInTotal: 20,
    zeroTolerances: [
      'Emprego equivocado de conectivos com sentido oposto (ex: usar "onde" para tempo, "porquanto" como condicional)',
      'Texto em blocos isolados sem conectivos de transição',
      'Repetição exaustiva da mesma conjunção (ex: 5 vezes "portanto" ou "além disso")',
    ],
    levels: {
      0: {
        level: 0,
        score: 0,
        officialDescriptor: 'Não demonstra conhecimento dos mecanismos linguísticos necessários para a construção da argumentação.',
        evaluatorGuidance: 'Parágrafos e períodos desprovidos de articuladores coesivos.',
        tolerancesAndLimits: 'Critério eliminatório da coesão.',
        examplesOrEvidence: ['Frases soltas justapostas sem nenhum elemento de ligação.'],
      },
      1: {
        level: 1,
        score: 40,
        officialDescriptor: 'Demonstra domínio precário dos mecanismos linguísticos, com coesão escassa ou inadequada.',
        evaluatorGuidance: 'Conexões quase inexistentes e muitos erros de sentido conjuntivo.',
        tolerancesAndLimits: 'Coesão quase nula.',
        examplesOrEvidence: ['Uso incorreto reiterado de pronomes relativos e conectivos coordenativos.'],
      },
      2: {
        level: 2,
        score: 80,
        officialDescriptor: 'Demonstra domínio insuficiente dos mecanismos linguísticos, com muitas inadequações e/ou repertório coesivo pouco diversificado.',
        evaluatorGuidance: 'Repetição excessiva dos mesmos conectivos ("e", "mas", "porque") e ausência de operadores interparágrafos.',
        tolerancesAndLimits: 'Repertório coesivo muito limitado e empobrecido.',
        examplesOrEvidence: ['Uso de "além disso" ou "portanto" múltiplas vezes por falta de vocabulário coesivo.'],
      },
      3: {
        level: 3,
        score: 120,
        officialDescriptor: 'Demonstra domínio mediano dos mecanismos linguísticos, com algumas inadequações e/ou repertório coesivo pouco diversificado.',
        evaluatorGuidance: 'Presença de conectivos, mas com pouca variedade ou apenas 1 operador interparágrafo válido.',
        tolerancesAndLimits: 'Menos de 2 operadores interparágrafos válidos impede nota superior a 120/160.',
        examplesOrEvidence: ['Iniciar os parágrafos sem conectivos conclusivos ou aditivos expressivos.'],
      },
      4: {
        level: 4,
        score: 160,
        officialDescriptor: 'Demonstra bom domínio dos mecanismos linguísticos, com poucas inadequações e repertório coesivo diversificado.',
        evaluatorGuidance: 'Presença de no mínimo 2 operadores interparágrafos válidos e boa coesão interna, com pequenas repetições pontuais ou 1 inadequação leve.',
        tolerancesAndLimits: 'Pouquíssimas repetições e no máximo 1 inadequação coesiva leve.',
        examplesOrEvidence: ['Conectivos diversificados com apenas uma pequena falha de paralelismo correlativo.'],
      },
      5: {
        level: 5,
        score: 200,
        officialDescriptor: 'Demonstra excelente domínio dos mecanismos linguísticos, com repertório coesivo diversificado e pouquíssimas ou nenhuma repetição e sem inadequação.',
        evaluatorGuidance: 'Pelo menos 2 OPERADORES ARGUMENTATIVOS INTERPARÁGRAFOS com valor semântico de transição no início de parágrafos (ex: início do D2 com "Outrossim,"/"Ademais," e início da Conclusão com "Portanto,"/"Infere-se, portanto,"). RICA DIVERSIDADE de conectivos intraparágrafos em praticamente todos os períodos do texto. Ausência total de inadequação semântica e ausência de repetições viciosas.',
        tolerancesAndLimits: 'Mínimo 2 operadores interparágrafos explícitos e sem inadequações.',
        examplesOrEvidence: ['Uso harmônico de articuladores concessivos ("conquanto"), causais ("haja vista que"), conclusivos ("dessarte") e conformativos.'],
      },
    },
    pedagogicalGoldenRules: [
      'Inicie obrigatoriamente o 3º parágrafo (D2) com um conector aditivo/continuativo formal: "Ademais,", "Outrossim,", "Além disso,", "Nesse mesmo prisma,".',
      'Inicie obrigatoriamente o 4º parágrafo (Conclusão) com um conector conclusivo formal: "Portanto,", "Infere-se, portanto,", "Torna-se imperioso, dessarte,".',
      'Dentro de cada parágrafo, certifique-se de que cada período após o ponto final inicie com uma ligação coesiva ("Nesse viés,", "Com efeito,", "Dessa forma,").',
      'Nunca use o pronome "onde" para tempo, conceitos ou ideias abstratas; "onde" é EXCLUSIVO para localização física concreta no espaço.',
    ],
  },

  5: {
    competency: 5,
    name: 'Elaboração de Proposta de Intervenção Cidadã',
    shortTitle: 'Proposta de Intervenção',
    officialDefinition: 'Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos.',
    evaluatorFocus: 'Avalia a formulação de intervenção social concreta com a presença dos 5 ELEMENTOS CANÔNICOS DO INEP: Agente, Ação, Meio/Modo, Efeito e Detalhamento substantivo de um dos elementos, com respeito absoluto aos Direitos Humanos.',
    maximumScore: 200,
    weightInTotal: 20,
    zeroTolerances: [
      'Violação frontal aos Direitos Humanos (ex: incitação à tortura, pena de morte extrajudicial, linchamento, ódio contra minorias)',
      'Proposta nula (ex: "é preciso que cada um faça sua parte")',
      'Ausência total de intervenção',
    ],
    levels: {
      0: {
        level: 0,
        score: 0,
        officialDescriptor: 'Não apresenta proposta de intervenção ou apresenta proposta não relacionada ao tema ou desrespeita os direitos humanos.',
        evaluatorGuidance: 'Ausência de intervenção, desrespeito explícito aos Direitos Humanos ou proposta totalmente desconectada.',
        tolerancesAndLimits: 'Critério eliminatório da competência.',
        examplesOrEvidence: ['Defender punição violenta física ou propor medidas que não atacam o problema.'],
      },
      1: {
        level: 1,
        score: 40,
        officialDescriptor: 'Apresenta proposta de intervenção vaga, precária ou relacionada apenas ao assunto.',
        evaluatorGuidance: 'Apenas 1 dos 5 elementos canônicos identificado de forma válida.',
        tolerancesAndLimits: 'Apenas 1 elemento válido = 40 pontos cravados.',
        examplesOrEvidence: ['"O governo precisa resolver isso logo." (Apenas Agente vago sem Ação, Meio, Efeito ou Detalhamento).'],
      },
      2: {
        level: 2,
        score: 80,
        officialDescriptor: 'Elabora, de forma insuficiente, proposta de intervenção relacionada ao tema, ou não articulada com a discussão desenvolvida no texto.',
        evaluatorGuidance: 'Apenas 2 dos 5 elementos canônicos válidos, OU estrutura hipotético-condicional ("Se todos fizessem isso..."). Regra estrita da Cartilha do Corretor: intervenções condicionais não ultrapassam o Nível 2 (80 pontos).',
        tolerancesAndLimits: '2 elementos válidos = 80 pontos.',
        examplesOrEvidence: ['"O MEC deve criar campanhas." (Agente + Ação, faltando Meio, Efeito e Detalhamento).'],
      },
      3: {
        level: 3,
        score: 120,
        officialDescriptor: 'Elabora, de forma mediana, proposta de intervenção relacionada ao tema e articulada à discussão desenvolvida no texto.',
        evaluatorGuidance: 'Exatamente 3 dos 5 elementos canônicos válidos presentes.',
        tolerancesAndLimits: '3 elementos válidos = 120 pontos.',
        examplesOrEvidence: ['"O Ministério da Saúde deve investir em postos por meio de verbas federais." (Agente + Ação + Meio, faltando Efeito e Detalhamento).'],
      },
      4: {
        level: 4,
        score: 160,
        officialDescriptor: 'Elabora, de forma consistente, proposta de intervenção articulada à discussão desenvolvida no texto, com 4 dos 5 elementos válidos.',
        evaluatorGuidance: 'Exatamente 4 dos 5 elementos canônicos válidos presentes (geralmente falta o Detalhamento substantivo).',
        tolerancesAndLimits: '4 elementos válidos = 160 pontos. O detalhamento é indispensável para chegar a 200.',
        examplesOrEvidence: ['Agente, Ação, Meio e Efeito presentes, mas sem nenhuma oração explicativa ou exemplificativa adicional.'],
      },
      5: {
        level: 5,
        score: 200,
        officialDescriptor: 'Elabora muito bem proposta de intervenção, detalhada, relacionada ao tema e articulada à discussão desenvolvida no texto, com os 5 elementos válidos.',
        evaluatorGuidance: 'TODOS OS 5 ELEMENTOS VÁLIDOS E COMPLETOS: 1. Agente institucional/social legítimo; 2. Ação clara e prática (verbo no infinitivo ou presente); 3. Meio/Modo de execução tangível ("por meio de...", "mediante..."); 4. Efeito/Finalidade no longo prazo ("a fim de...", "com o fito de..."); 5. DETALHAMENTO SUBSTANTIVO de pelo menos um dos 4 elementos (oração explicativa, especificação técnica ou exemplificação). Proposta 100% aderente aos Direitos Humanos e articulada com a tese.',
        tolerancesAndLimits: '5 elementos completos e válidos = 200 pontos indiscutíveis.',
        examplesOrEvidence: ['"Cabe ao Ministério da Educação — órgão gestor das diretrizes pedagógicas nacionais — implementar oficinas curriculares de letramento digital, por meio da destinação de verbas complementares às redes municipais, a fim de capacitar os estudantes para a identificação de algoritmos predatórios."'],
      },
    },
    pedagogicalGoldenRules: [
      'A fórmula dos 5 elementos da Cartilha: [QUEM] + [O QUE FAZ] + [COMO FAZ] + [PARA QUE FAZ] + [DETALHAMENTO].',
      'O melhor detalhamento é o do Agente (use travessões: "— órgão responsável pela regulação sanitária —") ou do Meio ("— a exemplo de cartilhas interativas e plataformas digitais —").',
      'Nunca use verbos no condicional: evite "deveria fazer", "se fizesse"; use modo imperativo afirmativo ou indicativo: "cabe realizar", "deve instituir".',
      'Certifique-se de que a proposta resolve as duas causas levantadas no D1 e no D2, garantindo coerência global com a C3.',
    ],
  },
};

export const CARTILHA_SCORE_PROFILES: CartilhaScoreProfile[] = [
  {
    tier: 'Faixa 1000 (Perfeição)',
    scoreRange: [980, 1000],
    officialProfileName: 'Padrão Consenso Nota 1000 da Cartilha Oficial INEP',
    typicalCharacteristics: [
      'Nível 5 homologado nas 5 competências por ambos os corretores',
      'Períodos complexos bem articulados e vocabulário formal preciso, sem marcas de oralidade ou clichês vagos',
      'Repertório legitimado, pertinente e produtivo mobilizado também na argumentação (D1 e/ou D2)',
      'Projeto de texto estratégico com causa estrutural profunda e consequência crítica nos dois desenvolvimentos (D1 e D2)',
      'No mínimo 2 operadores interparágrafos e fluidez coesiva sem repetições estruturais',
      'Proposta de intervenção completa com os 5 elementos e detalhamento substantivo',
    ],
    keyBottleNecks: [
      'Manter a consistência sob pressão temporal e evitar qualquer desvio isolado na folha final',
    ],
    cartilhaPrescriptionToNextTier: 'Você alcançou o topo da matriz do INEP. Mantenha a precisão formal, o repertório produtivo em D1/D2 e o aprofundamento estrutural em temas variados.',
    representativeSamplesFromCartilha: [
      'Lucas Moraes (INEP 2025 - Envelhecimento)',
      'Ana Clara Pereira (INEP 2024 - Herança Africana)',
      'Amanda Teixeira Zampiris (INEP 2023 - Trabalho de Cuidado)',
      'Lucas Felpi (Cartilha Redação a Mil / INEP 2018 - Controle de Dados)',
    ],
  },
  {
    tier: 'Faixa 940-960 (Excelente)',
    scoreRange: [940, 960],
    officialProfileName: 'Padrão Alto Desempenho da Cartilha Oficial (940 a 960 pts)',
    typicalCharacteristics: [
      'Excelente projeto de texto com repertório nos desenvolvimentos e intervenção completa',
      'Perda pontual de 40 pts em 1 competência (ex.: C1=160 por precisão vocabular ou desvio leve, C4=160 ou C5=160)',
    ],
    keyBottleNecks: [
      'Detalhamento tímido na Proposta de Intervenção (C5=160)',
      'Desvio pontual ou pequena imprecisão vocabular/sintática (C1=160)',
      'Desenvolvimento de um dos argumentos com menor profundidade causal (C3=160)',
    ],
    cartilhaPrescriptionToNextTier: 'Para chegar ao 1000: garanta vocabulário formal preciso em períodos complexos (C1), aprofunde causa estrutural e consequência em D1 e D2 (C3) e explicite o detalhamento na C5.',
    representativeSamplesFromCartilha: [
      'Redações #11 (Julie Anne) e #14 (Beatriz Santana) da Cartilha dos 800+ / Módulo INEP (Faixa 960)',
    ],
  },
  {
    tier: 'Faixa 880-920 (Bom)',
    scoreRange: [840, 920],
    officialProfileName: 'Padrão Intermediário-Alto da Cartilha dos 800+ (840 a 920 pts)',
    typicalCharacteristics: [
      'Macroestrutura clássica em 4 parágrafos e boa fluência dissertativa',
      'Limitações pontuais em 2 ou 3 competências (ex.: C1=160, C2=160 ou C3=160, totalizando 840–920 pts)',
      'Repertório apenas na introdução (ausente em D1/D2) ou desenvolvimentos predominantemente expositivos',
    ],
    keyBottleNecks: [
      'Texto sem erros ortográficos mas com clichês vagos/oralidade ou períodos pouco complexos (C1=160)',
      'Repertório restrito à introdução ou órgãos/leis citados apenas como agentes na conclusão (C2=160)',
      'Estrutura de 4 parágrafos com 2 argumentos expositivos sem análise das causas estruturais em D1 e D2 (C3=160)',
    ],
    cartilhaPrescriptionToNextTier: 'Para saltar para 940+: substitua clichês vagos por vocabulário formal preciso (C1), leve repertório produtivo para D1/D2 (C2) e aprofunde causa estrutural + consequência crítica em ambos os desenvolvimentos (C3).',
    representativeSamplesFromCartilha: [
      'Redações #6 (Wallison) e #9 da Cartilha dos 800+ / Cartilha do Participante INEP (Faixa 880/920)',
    ],
  },
  {
    tier: 'Faixa 800 (Regular)',
    scoreRange: [740, 820],
    officialProfileName: 'Padrão Cartilha dos 800+ (740 a 820 pts)',
    typicalCharacteristics: [
      'Macroestrutura básica preservada em 4 parágrafos com compreensão temática adequada',
      'Combinação típica: C1=160/120 por imprecisão vocabular/desvios, C2=160 sem repertório em D1/D2, C3=160/120 por exposição superficial',
      'Proposta de intervenção funcional com 3 ou 4 elementos válidos (C5=120/160)',
    ],
    keyBottleNecks: [
      'Marcas de oralidade, clichês vagos ou desvios gramaticais na C1',
      'Repertório ausente nos desenvolvimentos D1/D2 (C2)',
      'Argumentação expositiva que constata o problema sem aprofundar causas estruturais (C3)',
    ],
    cartilhaPrescriptionToNextTier: 'Para atingir 880+: elimine clichês e oralidade (C1), insira repertório produtivo em D1 e D2 (C2), aprofunde causa e consequência nos desenvolvimentos (C3) e complete os 5 elementos da C5.',
    representativeSamplesFromCartilha: [
      'Amostras faixa 800-820 da Cartilha dos 800+ e Guia de Estudos do Participante INEP',
    ],
  },
  {
    tier: 'Abaixo de 700',
    scoreRange: [0, 720],
    officialProfileName: 'Padrão Inicial em Desenvolvimento (< 720 pts)',
    typicalCharacteristics: [
      'Estrutura dissertativa fragmentada ou períodos muito curtos',
      'Problemas estruturais na C1 (justaposição, truncamento)',
      'Repertório do senso comum sem área do saber legitimada',
      'Proposta com 1 ou 2 elementos apenas',
    ],
    keyBottleNecks: [
      'Desconhecimento dos critérios específicos dos 5 níveis do INEP',
      'Tangenciamento parcial do tema',
    ],
    cartilhaPrescriptionToNextTier: 'Foco inicial: domine a estrutura em 4 parágrafos, elimine os desvios gramaticais mais frequentes e garanta abordagem completa do tema.',
    representativeSamplesFromCartilha: [
      'Textos em fase preparatória diagnóstica',
    ],
  },
];

/**
 * Retorna o enquadramento exato da Cartilha Oficial do INEP com base na pontuação total e competências
 */
export function getCartilhaBenchmarkForScore(totalScore: number, competencies?: any) {
  const finalScore = Math.min(1000, Math.max(0, totalScore));

  const profile = CARTILHA_SCORE_PROFILES.find(p => finalScore >= p.scoreRange[0] && finalScore <= p.scoreRange[1]) 
    || CARTILHA_SCORE_PROFILES[CARTILHA_SCORE_PROFILES.length - 1];

  // Identificar status de cada competência com a matriz oficial
  const compScores = {
    c1: competencies?.c1?.score ?? (finalScore >= 960 ? 200 : finalScore >= 840 ? 160 : 120),
    c2: competencies?.c2?.score ?? (finalScore >= 920 ? 200 : finalScore >= 800 ? 160 : 120),
    c3: competencies?.c3?.score ?? (finalScore >= 940 ? 200 : finalScore >= 800 ? 160 : 120),
    c4: competencies?.c4?.score ?? (finalScore >= 920 ? 200 : finalScore >= 800 ? 160 : 120),
    c5: competencies?.c5?.score ?? (finalScore >= 960 ? 200 : finalScore >= 840 ? 160 : 120),
  };

  const c1Status = compScores.c1 === 200 ? 'Nível 5 (200 pts) - Períodos complexos bem articulados e vocabulário formal preciso' : `Nível ${Math.floor(compScores.c1 / 40)} (${compScores.c1} pts) - ${compScores.c1 === 160 ? 'Bom domínio com desvios leves, oralidade/imprecisão vocabular ou baixa complexidade sintática' : 'Desvios gramaticais a corrigir'}`;
  const c2Status = compScores.c2 === 200 ? 'Nível 5 (200 pts) - Repertório legitimado e produtivo mobilizado nos desenvolvimentos (D1/D2)' : `Nível ${Math.floor(compScores.c2 / 40)} (${compScores.c2} pts) - ${compScores.c2 === 160 ? 'Repertório restrito à introdução, pouco produtivo ou ausente em D1/D2' : 'Repertório restrito ou tangenciamento'}`;
  const c3Status = compScores.c3 === 200 ? 'Nível 5 (200 pts) - Projeto estratégico com causa estrutural profunda, consequência crítica e repertório em D1 e D2' : `Nível ${Math.floor(compScores.c3 / 40)} (${compScores.c3} pts) - ${compScores.c3 === 160 ? 'Desenvolvimentos expositivos ou sem aprofundamento causal simultâneo em D1 e D2' : 'Falhas de planejamento ou repetição'}`;
  const c4Status = compScores.c4 === 200 ? 'Nível 5 (200 pts) - 2+ operadores interparágrafos e rica coesão' : `Nível ${Math.floor(compScores.c4 / 40)} (${compScores.c4} pts) - ${compScores.c4 === 160 ? 'Poucas repetições' : 'Pouca variedade coesiva'}`;
  const c5Status = compScores.c5 === 200 ? 'Nível 5 (200 pts) - 5 elementos completos com detalhamento' : `Nível ${Math.floor(compScores.c5 / 40)} (${compScores.c5} pts) - Faltam elementos (${5 - Math.floor(compScores.c5 / 40)} ausentes)`;

  return {
    tier: profile.tier,
    closestProfileTitle: profile.officialProfileName,
    commonPatternIdentified: profile.typicalCharacteristics.slice(0, 3).join('; '),
    keyDifferenceTo900Plus: profile.cartilhaPrescriptionToNextTier,
    edition: CARTILHA_METADATA.edition,
    cartilhaReferenceQuote: `Enquadramento homologado conforme a ${CARTILHA_METADATA.edition} e os Módulos Oficiais de Avaliação do INEP.`,
    officialMatrixAdherence: {
      c1Status,
      c2Status,
      c3Status,
      c4Status,
      c5Status,
    },
    inepDirectivesFollowed: [
      'Aplicação da Matriz de Referência Oficial com 6 níveis por competência (0 a 5)',
      'Simulação de dupla correção independente com critério de tolerância de até 80 pts',
      'Validação de 5 elementos na Competência 5 com exigência de detalhamento substantivo',
      'Auditoria de repertório legitimado, pertinente e produtivo na Competência 2',
      'Verificação de operadores argumentativos interparágrafos na Competência 4',
    ],
  };
}
