export interface OfficialTip {
  id: string;
  category: 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'nota1000' | 'armadilhas' | 'repertorio_express';
  categoryLabel: string;
  title: string;
  sourceDoc: string; // Documento/Manual oficial INEP
  icon: string;
  badgeColor: string;
  highlightText: string;
  explanation: string;
  practicalExample?: {
    incorrect?: string;
    correct: string;
    why: string;
  };
  repertoireBonus?: {
    author: string;
    concept: string;
    application: string;
  };
  keyTakeaway: string;
}

export const OFFICIAL_ENEM_TIPS: OfficialTip[] = [
  // ==========================================
  // COMPETÊNCIA 1 - NORMA PADRÃO & SINTAXE
  // ==========================================
  {
    id: 'tip-c1-01',
    category: 'c1',
    categoryLabel: 'Competência 1: Sintaxe',
    title: 'Truncamento de Período: O Vilão Silencioso da C1',
    sourceDoc: 'Manual de Correção de Redação do INEP - Módulo 3',
    icon: '✂️',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    highlightText: 'Nunca separe uma oração subordinada ou gerundial da oração principal por ponto final.',
    explanation: 'O truncamento ocorre quando uma oração dependente é pontuada como se fosse um período autônomo. No ENEM, 2 falhas graves de estrutura sintática já rebaixam a nota da C1 para 120 ou 160 pontos.',
    practicalExample: {
      incorrect: 'O Estado deve agir imediatamente. Criando políticas de conscientização nas escolas.',
      correct: 'O Estado deve agir imediatamente, criando políticas de conscientização nas escolas.',
      why: 'A oração reduzida de gerúndio é dependente da anterior e deve ser unida por vírgula.'
    },
    keyTakeaway: 'Revise todas as frases iniciadas por gerúndio ("Sendo assim", "Gerando") e garanta que não há ponto final indevido antes delas.'
  },
  {
    id: 'tip-c1-02',
    category: 'c1',
    categoryLabel: 'Competência 1: Sintaxe',
    title: 'Justaposição de Orações: Falta de Conectivo',
    sourceDoc: 'Guia do Participante ENEM / Matriz C1',
    icon: '🧩',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    highlightText: 'Não una duas orações independentes apenas com vírgula (comma splice).',
    explanation: 'A justaposição acontece quando o estudante coloca vírgula onde deveria haver ponto final ou conectivo coordenativo (como "e", "pois", "portanto").',
    practicalExample: {
      incorrect: 'O preconceito persiste no Brasil, ele afeta a dignidade das minorias.',
      correct: 'O preconceito persiste no Brasil; com efeito, ele afeta a dignidade das minorias.',
      why: 'Use ponto e vírgula com operador ou ponto final seguido de conectivo.'
    },
    keyTakeaway: 'Cada período deve expressar uma ideia completa e estar devidamente articulado sintaticamente.'
  },
  {
    id: 'tip-c1-03',
    category: 'c1',
    categoryLabel: 'Competência 1: Gramática',
    title: 'Crase Diante de Pronomes e Palavras Masculinas',
    sourceDoc: 'Acervo de Erros Frequentes INEP',
    icon: '⚠️',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    highlightText: 'Crase nunca ocorre antes de verbo, pronomes em geral (esta, essa, ela) e palavras masculinas.',
    explanation: 'A crase é a fusão da preposição "a" com o artigo definido feminino "a". Sem substantivo feminino determinado, não pode haver crase.',
    practicalExample: {
      incorrect: 'O governo visa à combater a desigualdade e dar suporte à todos.',
      correct: 'O governo visa a combater a desigualdade e dar suporte a todos.',
      why: '"Combater" é verbo e "todos" é pronome indefinido masculino.'
    },
    keyTakeaway: 'Dica de ouro: troque a palavra seguinte por um termo masculino. Se virar "ao", há crase; se virar apenas "a" ou "o", não há.'
  },
  {
    id: 'tip-c1-04',
    category: 'c1',
    categoryLabel: 'Competência 1: Sintaxe',
    title: 'Paralelismo Sintático nas Teses da Introdução',
    sourceDoc: 'Manual de Redação Nota 1000 INEP',
    icon: '⚖️',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    highlightText: 'Mantenha a mesma estrutura gramatical ao listar os dois argumentos da tese.',
    explanation: 'Se a tese A começa com "a negligência governamental" (substantivo + adjetivo), a tese B deve seguir a mesma estrutura: "o silenciamento social", e não um verbo.',
    practicalExample: {
      incorrect: 'Destacam-se a omissão do Estado e porque as pessoas são preconceituosas.',
      correct: 'Destacam-se a omissão do Estado e a passividade da sociedade civil.',
      why: 'Equilíbrio morfológico entre dois sintagmas nominais paralelos.'
    },
    keyTakeaway: 'O paralelismo transmite elegância sintática e demonstra pleno domínio formal da língua.'
  },
  {
    id: 'tip-c1-05',
    category: 'c1',
    categoryLabel: 'Competência 1: Gramática',
    title: 'Regência dos Verbos "Implicar", "Visar" e "Assistir"',
    sourceDoc: 'Norma Padrão Culta / Matriz INEP',
    icon: '🎯',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    highlightText: '"Implicar" no sentido de acarretar é direto (não usa "em").',
    explanation: 'No padrão culto: "Essa atitude implica graves consequências" (e não "implica em consequências"). O verbo "visar" (ter como objetivo) exige preposição "a": "visar ao bem-estar".',
    practicalExample: {
      incorrect: 'A falta de leis implica no aumento da violência.',
      correct: 'A falta de leis implica o aumento da violência.',
      why: 'Verbo transitivo direto dispensa preposição.'
    },
    keyTakeaway: 'Pequenos detalhes de regência diferenciam redações nota 160 de notas 200 na C1.'
  },

  // ==========================================
  // COMPETÊNCIA 2 - REPERTÓRIO SOCIOCULTURAL
  // ==========================================
  {
    id: 'tip-c2-01',
    category: 'c2',
    categoryLabel: 'Competência 2: Repertório',
    title: 'O Tripé do Repertório Nota 200: Legitimado, Pertinente e Produtivo',
    sourceDoc: 'Manual de Correção C2 do INEP',
    icon: '🏛️',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    highlightText: 'Citar o autor não basta: é obrigatório vincular o conceito diretamente à causa do problema debatido.',
    explanation: 'Legitimado = reconhecido em área do saber (Filosofia, Sociologia, História, Leis, Arte). Pertinente = tem relação com o tema. Produtivo = é usado ativamente para fundamentar seu argumento.',
    repertoireBonus: {
      author: 'Zygmunt Bauman',
      concept: 'Instituições Zumbis / Modernidade Líquida',
      application: 'Usar para provar que órgãos públicos perderam a capacidade protetiva original diante das demandas atuais.'
    },
    keyTakeaway: 'Sempre faça a ponte: "Analogamente à teoria de [Autor], constata-se que no Brasil..."'
  },
  {
    id: 'tip-c2-02',
    category: 'c2',
    categoryLabel: 'Competência 2: Repertório',
    title: 'A Armadilha do "Repertório Decorativo" (Não Produtivo)',
    sourceDoc: 'Cartilha do Participante INEP / Critérios de Correção',
    icon: '🛑',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    highlightText: 'Se você apenas jogar uma citação e não explicar sua relação com o Brasil, a C2 fica travada em 120/160.',
    explanation: 'A banca penaliza fortemente o aluno que usa uma citação como epígrafe ou "enfeite" sem desenvolver sua lógica dentro do parágrafo.',
    practicalExample: {
      incorrect: 'Segundo Platão, o homem é um animal político. No Brasil a educação é precária.',
      correct: 'Conforme Platão, a pólis deve assegurar o desenvolvimento ético dos cidadãos. No Brasil, contudo, a precariedade educacional impede essa emancipação política.',
      why: 'O segundo exemplo conecta a teoria grega ao diagnóstico da educação brasileira.'
    },
    keyTakeaway: 'Após citar o repertório, escreva pelo menos mais dois períodos explicando como ele comprova a sua tese.'
  },
  {
    id: 'tip-c2-03',
    category: 'c2',
    categoryLabel: 'Competência 2: Repertório',
    title: 'Constituição de 1988: Como Usar com Produtividade Máxima',
    sourceDoc: 'Análise de Redações Nota 1000 INEP',
    icon: '📜',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    highlightText: 'Especifique o Artigo e aponte a antítese (o descompasso entre a lei e a realidade fática).',
    explanation: 'Em vez de apenas citar "a Constituição garante direitos", mencione: Art. 5º (igualdade e vida), Art. 6º (direitos sociais como saúde, educação e trabalho), ou Art. 215/225 (cultura e meio ambiente).',
    repertoireBonus: {
      author: 'Gilberto Dimenstein',
      concept: 'O Cidadão de Papel',
      application: 'Excelente par conceitual com a CF/88 para demonstrar que direitos existem no papel, mas são negados na prática.'
    },
    keyTakeaway: 'A fórmula "Constituição + Dimenstein" é um clássico nota 1000 quando bem contextualizada.'
  },
  {
    id: 'tip-c2-04',
    category: 'c2',
    categoryLabel: 'Competência 2: Repertório',
    title: 'Textos Motivadores: Como Usar Sem Cometer Cópia',
    sourceDoc: 'Manual INEP - Módulo C2',
    icon: '📊',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    highlightText: 'Dados dos textos motivadores podem ser interpretados, mas você DEVE trazer pelo menos um repertório externo.',
    explanation: 'Se a sua redação utilizar apenas dados e ideias dos textos da prova, sua nota na Competência 2 será limitada a no máximo 120 pontos.',
    keyTakeaway: 'Use os textos motivadores para entender os limites do recorte temático e adicione suas próprias referências culturais.'
  },

  // ==========================================
  // COMPETÊNCIA 3 - PROJETO DE TEXTO & ARGUMENTAÇÃO
  // ==========================================
  {
    id: 'tip-c3-01',
    category: 'c3',
    categoryLabel: 'Competência 3: Projeto de Texto',
    title: 'A Regra da Tese Bipartida na Introdução',
    sourceDoc: 'Matriz de Correção C3 - INEP',
    icon: '🎯',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    highlightText: 'Apresente explicitamente dois argumentos (A1 e A2) no último período da sua introdução.',
    explanation: 'O corretor do ENEM busca no final do primeiro parágrafo quais serão os temas do D1 e do D2. Se isso estiver claro, seu Projeto de Texto já ganha avaliação altamente positiva.',
    practicalExample: {
      correct: 'Desse modo, urge analisar não apenas a inoperância governamental (A1), mas também a naturalização da negligência na sociedade civil (A2).',
      why: 'D1 desenvolverá a inoperância estatal e D2 desenvolverá a apatia social.'
    },
    keyTakeaway: 'O projeto de texto é o mapa da redação: cumpra rigorosamente no D1 e D2 o que prometeu na Introdução.'
  },
  {
    id: 'tip-c3-02',
    category: 'c3',
    categoryLabel: 'Competência 3: Argumentação',
    title: 'Cuidado com Argumentos Embrionários ou Circulares',
    sourceDoc: 'Critérios de Penalização C3 INEP',
    icon: '🔄',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    highlightText: 'Não fique repetindo que o problema é "ruim" ou "grave" sem explicar o PORQUÊ e as CONSEQUÊNCIAS.',
    explanation: 'Argumento embrionário é aquele que é apenas mencionado e abandonado. Argumento circular é dizer "a violência cresce porque as pessoas são violentas".',
    practicalExample: {
      incorrect: 'A falta de registro gera muitos prejuízos para os brasileiros porque eles ficam prejudicados.',
      correct: 'A privação do registro civil engendra a exclusão cidadã, visto que impede o indivíduo de acessar benefícios assistenciais, matricular-se em instituições públicas e obter trabalho formal.',
      why: 'Explicita causas materiais e consequências verificáveis.'
    },
    keyTakeaway: 'Em cada desenvolvimento, responda mentalmente: "Por que isso acontece?" e "Qual o impacto concreto na vida do cidadão?".'
  },
  {
    id: 'tip-c3-03',
    category: 'c3',
    categoryLabel: 'Competência 3: Autoria',
    title: 'Marcas de Autoria e Vocabulário Apreciativo',
    sourceDoc: 'Análise de Textos de Desempenho Máximo INEP',
    icon: '💎',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    highlightText: 'Use adjetivos e advérbios críticos para deixar claro o seu posicionamento argumentativo.',
    explanation: 'Termos como "inadmissível", "alarmante", "perversa realidade", "notória negligência", "imprescindível" demonstram que você não está apenas expondo fatos, mas sim defendendo uma tese firme.',
    keyTakeaway: 'Evite textos puramente expositivos ou neutros. O ENEM exige dissertação ARGUMENTATIVA.'
  },

  // ==========================================
  // COMPETÊNCIA 4 - COESÃO & CONECTIVOS
  // ==========================================
  {
    id: 'tip-c4-01',
    category: 'c4',
    categoryLabel: 'Competência 4: Coesão',
    title: 'A Regra dos 2 Operadores Interparágrafos Obrigatórios',
    sourceDoc: 'Manual C4 do INEP / Grade Específica',
    icon: '🔗',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    highlightText: 'Pelo menos 2 parágrafos devem começar com operadores argumentativos interparágrafos expressivos.',
    explanation: 'Para tirar 200 na C4, é MANDATÓRIO iniciar os parágrafos com conectivos que estabeleçam relação lógica com o anterior. Exemplo: D2 com "Outrossim," ou "Ademais,", e Conclusão com "Portanto," ou "Infere-se, portanto,".',
    practicalExample: {
      correct: '§2: "Em primeiro plano, cabe destacar..."; §3: "Ademais, é imperioso pontuar..."; §4: "Portanto, medidas são urgentes para..."',
      why: 'Articulação sequencial e fluida entre todos os blocos do texto.'
    },
    keyTakeaway: '"De acordo com" ou "Segundo" no início do parágrafo NÃO contam como operador interparágrafo, pois são apenas introdutores de citação.'
  },
  {
    id: 'tip-c4-02',
    category: 'c4',
    categoryLabel: 'Competência 4: Coesão',
    title: 'Diversidade de Conectivos Intraparágrafos',
    sourceDoc: 'Guia de Correção C4 INEP',
    icon: '🌈',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    highlightText: 'Evite repetir os mesmos conectivos como "além disso", "onde" e "já que" várias vezes.',
    explanation: 'Varie o repertório coesivo dentro dos parágrafos: Concessão ("embora", "conquanto"), Causa ("haja vista", "porquanto"), Conclusão ("por conseguinte", "dessarte"), Conformidade ("consoante", "sob a ótica de").',
    keyTakeaway: 'Nunca use "onde" para se referir a conceitos abstratos ou situações (use "no qual", "em que", "no contexto em que").'
  },

  // ==========================================
  // COMPETÊNCIA 5 - PROPOSTA DE INTERVENÇÃO
  // ==========================================
  {
    id: 'tip-c5-01',
    category: 'c5',
    categoryLabel: 'Competência 5: Intervenção',
    title: 'A Fórmula Infalível dos 5 Elementos da C5 (40 pts cada)',
    sourceDoc: 'Grade Específica da Competência 5 INEP',
    icon: '⭐',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    highlightText: 'Garanta: 1. Agente + 2. Ação + 3. Meio/Modo + 4. Efeito + 5. Detalhamento.',
    explanation: 'Cada elemento vale exatamente 40 pontos (40 x 5 = 200). Se faltar qualquer um deles, sua nota cai para 160 pontos automaticamente.',
    practicalExample: {
      correct: 'Cabe ao Ministério da Educação [AGENTE], órgão responsável pelas diretrizes pedagógicas nacionais [DETALHAMENTO DO AGENTE], implementar oficinas de letramento digital [AÇÃO], por meio de investimentos orçamentários em parceria com universidades [MEIO/MODO], a fim de democratizar o acesso ético à tecnologia [EFEITO].',
      why: 'Contém todos os 5 elementos explicitamente identificáveis.'
    },
    keyTakeaway: 'Decore as palavras-chave para o corretor identificar seus elementos: "por meio de" (meio), "a fim de" (efeito), "órgão responsável por..." (detalhamento).'
  },
  {
    id: 'tip-c5-02',
    category: 'c5',
    categoryLabel: 'Competência 5: Intervenção',
    title: 'Onde Fazer o Detalhamento na Intervenção',
    sourceDoc: 'Manual Oficial de Correção C5 INEP',
    icon: '🔍',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    highlightText: 'O detalhamento mais seguro é explicar a função do Agente ou exemplificar os instrumentos do Meio.',
    explanation: 'Detalhamento é uma oração explicativa ou exemplificativa adicional. Fórmulas recomendadas: "— autarquia federal responsável pela regulação —" (sobre o Agente) ou "como cartilhas digitais e debates curriculares" (sobre o Meio).',
    keyTakeaway: 'Não faça detalhamento vago como "com muito esforço". Explique uma especificação técnica ou operacional.'
  },
  {
    id: 'tip-c5-03',
    category: 'c5',
    categoryLabel: 'Competência 5: Direitos Humanos',
    title: 'Respeito aos Direitos Humanos: Como Não Zerar a C5',
    sourceDoc: 'Edital Oficial ENEM / Critérios de Anulação C5',
    icon: '🕊️',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    highlightText: 'Propostas que violem a dignidade humana, preguem linchamento, tortura ou censura tiram zero na C5.',
    explanation: 'A violação aos Direitos Humanos não anula toda a redação desde a decisão do STF em 2017, mas ZERA compulsoriamente a nota da Competência 5 (perda de 200 pontos).',
    keyTakeaway: 'Mantenha propostas com base na legalidade, educação, políticas públicas afirmativas e ampliação da cidadania.'
  },
  {
    id: 'tip-c5-04',
    category: 'c5',
    categoryLabel: 'Competência 5: Intervenção',
    title: 'Propostas Condicionais: Limite de 80 Pontos no ENEM',
    sourceDoc: 'Módulo de Treinamento de Corretores do INEP',
    icon: '⛔',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    highlightText: 'Nunca escreva sua proposta usando "Se o governo fizer..." ou "Caso a sociedade queira...".',
    explanation: 'A matriz oficial determina que propostas em formato de hipótese ou condição não representam uma intervenção concreta e ficam limitadas a no máximo 80 pontos.',
    keyTakeaway: 'Use verbos afirmativos no modo indicativo: "Portanto, cabe ao Estado instituir..." e nunca estruturas hipotéticas.'
  },

  // ==========================================
  // REPERTÓRIOS EXPRESS & AUTORES CORINGA
  // ==========================================
  {
    id: 'tip-rep-01',
    category: 'repertorio_express',
    categoryLabel: 'Repertório Express: Filosofia',
    title: 'Thomas Hobbes: O Contrato Social e o Dever Protetivo',
    sourceDoc: 'Banco de Repertórios Homologados Enemaster',
    icon: '👑',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    highlightText: 'Ideal para temas que envolvem negligência governamental, segurança pública e vulnerabilidade social.',
    explanation: 'Em "Leviatã", Hobbes argumenta que os indivíduos cedem parte de sua liberdade ao Estado em troca de segurança e preservação da vida. Quando o Estado é omisso, quebra o pacto social.',
    repertoireBonus: {
      author: 'Thomas Hobbes',
      concept: 'Contrato Social e Teoria do Estado',
      application: '"Nessa perspectiva, o pensamento de Thomas Hobbes adverte que o Estado deve assegurar o bem-estar coletivo. Contudo, a ausência de políticas públicas para [Tema] rompe o pacto social no Brasil."'
    },
    keyTakeaway: 'Use sempre para fundamentar a tese de inoperância ou omissão do poder público.'
  },
  {
    id: 'tip-rep-02',
    category: 'repertorio_express',
    categoryLabel: 'Repertório Express: Sociologia',
    title: 'Pierre Bourdieu: Violência Simbólica e Capital Cultural',
    sourceDoc: 'Banco de Repertórios Homologados Enemaster',
    icon: '🎭',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    highlightText: 'Perfeito para temas de preconceito sutil, desigualdade escolar, herança cultural e elitismo.',
    explanation: 'Bourdieu mostra que a opressão muitas vezes ocorre sem coação física, mas sim pela imposição de normas e padrões que fazem os oprimidos aceitarem sua condição como natural.',
    repertoireBonus: {
      author: 'Pierre Bourdieu',
      concept: 'Violência Simbólica e Reprodução Social',
      application: '"Segundo Pierre Bourdieu, a violência simbólica se consolida quando a dominação é assimilada como natural pela própria sociedade."'
    },
    keyTakeaway: 'Excelente para o D2 ao explicar por que certos preconceitos são perpetuados sem resistência popular.'
  },
  {
    id: 'tip-rep-03',
    category: 'repertorio_express',
    categoryLabel: 'Repertório Express: Geografia & Cidadania',
    title: 'Milton Santos: Cidadanias Mutiladas',
    sourceDoc: 'Banco de Repertórios Homologados Enemaster',
    icon: '🗺️',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    highlightText: 'Um dos repertórios mais produtivos para temas de invisibilidade, moradia, saneamento e direitos civis.',
    explanation: 'Milton Santos formulou que a maioria dos brasileiros usufrui apenas de uma "cidadania mutilada", pois o acesso a bens e serviços depende do poder aquisitivo e não da condição humana.',
    keyTakeaway: 'Aplique para evidenciar que leis universais se tornam privilégios de poucos no cotidiano urbano.'
  },
  {
    id: 'tip-rep-04',
    category: 'repertorio_express',
    categoryLabel: 'Repertório Express: Filosofia Contemporânea',
    title: 'Byung-Chul Han: A Sociedade do Cansaço e Hiperconectividade',
    sourceDoc: 'Banco de Repertórios Homologados Enemaster',
    icon: '📱',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    highlightText: 'Ideal para temas de tecnologia, saúde mental, pressão por produtividade e redes sociais.',
    explanation: 'O filósofo sul-coreano demonstra que o indivíduo contemporâneo se autoexplora sob a ilusão de liberdade, gerando esgotamento psíquico, ansiedade e depressão.',
    keyTakeaway: 'Use para problematizar a relação do jovem com o trabalho precarizado e os algoritmos de recompensa rápida.'
  },

  // ==========================================
  // SEGREDOS NOTA 1000 & ESTRATÉGIA DE PROVA
  // ==========================================
  {
    id: 'tip-n1000-01',
    category: 'nota1000',
    categoryLabel: 'Segredos Nota 1000: Gestão do Tempo',
    title: 'A Regra dos 4 Parágrafos e o Balanço Visual de Linhas',
    sourceDoc: 'Estatísticas de Redações Nota 1000 INEP',
    icon: '📐',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    highlightText: 'Divida suas 30 linhas em: 6-7 linhas (Intro), 7-8 linhas (D1), 7-8 linhas (D2) e 7-8 linhas (Conclusão).',
    explanation: 'Textos com parágrafos desproporcionais (ex: introdução de 12 linhas e desenvolvimento de 4 linhas) transmitem falta de planejamento e sofrem penalização no projeto de texto.',
    keyTakeaway: 'Treine a caligrafia para manter a quantidade constante de palavras por linha (média de 9 a 11 palavras).'
  },
  {
    id: 'tip-n1000-02',
    category: 'nota1000',
    categoryLabel: 'Segredos Nota 1000: Estratégia',
    title: 'Fechamento Circular (Chave de Ouro)',
    sourceDoc: 'Análise Estilística de Textos com Pontuação Máxima',
    icon: '✨',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    highlightText: 'Retome a alusão cultural ou livro citado na Introdução na última frase da sua Conclusão.',
    explanation: 'Se você abriu a redação com o conceito de "Brasil, País do Futuro" de Stefan Zweig, feche a redação dizendo: "Assim, o país poderá finalmente concretizar a promessa civilizatória almejada por Stefan Zweig".',
    keyTakeaway: 'O fechamento circular é uma das marcas mais elegantes de autoria e domínio textual reconhecidas pelos avaliadores.'
  },
  {
    id: 'tip-n1000-03',
    category: 'nota1000',
    categoryLabel: 'Segredos Nota 1000: Título',
    title: 'O Título é Obrigatório no ENEM?',
    sourceDoc: 'Edital Oficial ENEM / Orientações ao Participante',
    icon: '❓',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    highlightText: 'O título é OPCIONAL no ENEM. Não use a primeira linha com título se você precisa de espaço para argumentar.',
    explanation: 'Se colocar título, ele conta como a linha 1 da redação. Se não colocar, você ganha uma linha extra para aprofundar repertórios ou detalhar a proposta na Competência 5.',
    keyTakeaway: 'Mais de 90% das redações nota 1000 nos últimos anos optaram por NÃO colocar título para aproveitar todas as 30 linhas.'
  },

  // ==========================================
  // ARMADILHAS DE BOLSO & ERROS FATAIS
  // ==========================================
  {
    id: 'tip-arm-01',
    category: 'armadilhas',
    categoryLabel: 'Armadilhas Fatais: Fuga ao Tema',
    title: 'Tangenciamento: O Risco de Falar Só do Assunto e Esquecer o Recorte',
    sourceDoc: 'Manual de Correção Geral INEP',
    icon: '⚠️',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    highlightText: 'Se o tema for "Desafios para a valorização de povos tradicionais", você NÃO pode falar apenas de índios de forma genérica.',
    explanation: 'Tangenciamento ocorre quando o aluno aborda o assunto geral (ex: meio ambiente ou cinema), mas ignora as palavras-chave do recorte (ex: "desafios", "democratização", "invisibilidade").',
    keyTakeaway: 'Faça questão de inserir todas as palavras-chave da proposta de redação no primeiro e no último parágrafo do seu texto.'
  },
  {
    id: 'tip-arm-02',
    category: 'armadilhas',
    categoryLabel: 'Armadilhas Fatais: Vocabulário',
    title: 'Gírias, Expressões Orais e Clichês Proibidos',
    sourceDoc: 'Módulo C1/C2 - Adequação Vocabular INEP',
    icon: '🚫',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    highlightText: 'Bana termos como: "nos dias de hoje", "a cada dia que passa", "fechar com chave de ouro", "dar um basta".',
    explanation: 'Clichês empobrecem o texto e denotam falta de originalidade. Substitua por expressões precisas como: "na conjuntura brasileira hodierna", "progressivamente", "mitigar os efeitos".',
    keyTakeaway: 'A maturidade argumentativa é expressa pela precisão vocabular e afastamento da linguagem coloquial.'
  }
];
