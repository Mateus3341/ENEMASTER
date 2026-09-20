import { GlossaryTerm, GlossaryCategory } from '../types';

export const GLOSSARY_CATEGORIES: Array<{
  id: GlossaryCategory | 'all';
  label: string;
  shortLabel: string;
  iconName: string;
  color: string;
  description: string;
}> = [
  {
    id: 'all',
    label: 'Todos os Termos & Repertórios',
    shortLabel: 'Todos',
    iconName: 'BookMarked',
    color: 'bg-indigo-600 text-white',
    description: 'Visualização completa de todos os conceitos, regras do INEP e repertórios da redação.'
  },
  {
    id: 'geral',
    label: 'Matriz Geral & Critérios INEP',
    shortLabel: 'Matriz INEP',
    iconName: 'ShieldCheck',
    color: 'bg-blue-600 text-white',
    description: 'Conceitos fundamentais da prova: tese, projeto de texto, tipologia e regras de correção.'
  },
  {
    id: 'c1',
    label: 'Competência 1 (Gramática & Sintaxe)',
    shortLabel: 'C1: Sintaxe',
    iconName: 'CheckCircle2',
    color: 'bg-emerald-600 text-white',
    description: 'Paralelismo, concordância, regência, truncamento, crase e precisão vocabular.'
  },
  {
    id: 'c2',
    label: 'Competência 2 (Repertório & Tema)',
    shortLabel: 'C2: Repertório',
    iconName: 'Sparkles',
    color: 'bg-amber-600 text-white',
    description: 'Repertório legitimado, pertinente e produtivo, tangenciamento e recorte temático.'
  },
  {
    id: 'c3',
    label: 'Competência 3 (Projeto de Texto & Argumentação)',
    shortLabel: 'C3: Argumentação',
    iconName: 'Target',
    color: 'bg-purple-600 text-white',
    description: 'Tópicos frasais, causalidade, autoria, lacunas argumentativas e coerência.'
  },
  {
    id: 'c4',
    label: 'Competência 4 (Coesão & Conectivos)',
    shortLabel: 'C4: Coesão',
    iconName: 'Layers',
    color: 'bg-cyan-600 text-white',
    description: 'Conectivos interparágrafos, operadores intraparágrafos e coesão referencial.'
  },
  {
    id: 'c5',
    label: 'Competência 5 (Proposta de Intervenção)',
    shortLabel: 'C5: Proposta',
    iconName: 'PenTool',
    color: 'bg-rose-600 text-white',
    description: 'Os 5 elementos obrigatórios: Agente, Ação, Modo/Meio, Efeito e Detalhamento.'
  },
  {
    id: 'filosofia_sociologia',
    label: 'Conceitos Filosóficos & Sociológicos',
    shortLabel: 'Filosofia/Sociologia',
    iconName: 'GraduationCap',
    color: 'bg-violet-600 text-white',
    description: 'Bauman, Bourdieu, Foucault, Arendt, Dimenstein, Habermas e outros pensadores.'
  },
  {
    id: 'legislacao',
    label: 'Legislação & Marcos Constitucionais',
    shortLabel: 'Legislação & Leis',
    iconName: 'Scale',
    color: 'bg-teal-600 text-white',
    description: 'Constituição de 1988, ECA, Estatutos, Declaração da ONU, Marco Civil e LGPD.'
  },
  {
    id: 'literatura_cultura',
    label: 'Literatura Brasileira & Obras Culturais',
    shortLabel: 'Literatura',
    iconName: 'BookOpen',
    color: 'bg-orange-600 text-white',
    description: 'Graciliano Ramos, Carolina de Jesus, Jorge Amado, Machado de Assis e Aluísio Azevedo.'
  }
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // ==========================================
  // MATRIZ GERAL & CRITÉRIOS INEP
  // ==========================================
  {
    id: 'projeto-de-texto',
    term: 'Projeto de Texto Estratégico',
    category: 'geral',
    competencyTag: 'C3',
    shortDefinition: 'Planejamento prévio e intencional do texto, no qual cada parágrafo cumpre uma função lógica claramente articulada desde a introdução.',
    fullDefinition: 'O Projeto de Texto Estratégico é a espinha dorsal avaliada na Competência 3. Consiste na arquitetura prévia da redação: o candidato antecipa na introdução quais argumentos desenvolverá (A1 e A2), cumpre fielmente essa promessa no D1 e no D2, e propõe uma intervenção no D5 que dialogue diretamente com as raízes do problema discutidas.',
    inepCriteriaContext: 'A banca penaliza redações com "projeto de texto com falhas" (quando argumentos anunciados na tese não são aprofundados no desenvolvimento ou quando a conclusão propõe algo desconectado do corpo do texto). Para atingir o Nível 5 (200 pontos), o projeto deve ser evidente, estratégico e sem lacunas.',
    practicalExample: 'Se a tese na introdução aponta "a negligência governamental e a passividade social", o D1 DEVE aprofundar a inércia do Estado e o D2 DEVE aprofundar a alienação da sociedade.',
    commonMistakeWarning: 'Citar três argumentos na tese e desenvolver apenas dois no corpo do texto, ou criar uma tese vazia sem direcionamento temático claro.',
    relatedTerms: ['Tese Bipartida', 'Lacuna Argumentativa', 'Marca de Autoria', 'Direcionamento Argumentativo'],
    difficultyLevel: 'Nota 1000',
    authorOrSource: 'Matriz Oficial INEP - Competência 3'
  },
  {
    id: 'tese-bipartida',
    term: 'Tese Bipartida / Tese com Dois Núcleos',
    category: 'geral',
    competencyTag: 'Geral',
    shortDefinition: 'Formulaçâo da tese na introdução dividida em duas causas ou vertentes centrais que serão aprofundadas respectivamente no D1 e no D2.',
    fullDefinition: 'A tese bipartida é a estrutura mais segura e elegante para garantir nota 1000. Ao invés de uma tese difusa ou genérica, o candidato delimita dois eixos causais (por exemplo: um fator institucional/estatal e um fator sociocultural/comportamental), assegurando simetria e clareza no projeto de texto.',
    inepCriteriaContext: 'Facilita a leitura do avaliador ao estabelecer um roteiro límpido para a argumentação e fortalece a Coesão Sequencial (C4) e o Projeto de Texto (C3).',
    practicalExample: '"Desse modo, torna-se imperioso analisar não apenas a omissão das políticas públicas educacionais, mas também a persistência de um preconceito estrutural enraizado no cotidiano."',
    commonMistakeWarning: 'Formular uma tese com duas causas que na verdade são sinônimas (ex.: "falta de conscientização e ausência de informação popular"), gerando redundância argumentativa.',
    relatedTerms: ['Projeto de Texto Estratégico', 'Tópico Frasal', 'Paralelismo Sintático'],
    difficultyLevel: 'Fundamental',
    authorOrSource: 'Cartilha de Redação INEP'
  },
  {
    id: 'tangenciamento-tematico',
    term: 'Tangenciamento Temático',
    category: 'geral',
    competencyTag: 'C2',
    shortDefinition: 'Abordagem parcial da proposta de redação, na qual o participante discute apenas o assunto geral, ignorando o recorte específico exigido pelo tema.',
    fullDefinition: 'Ocorre quando o estudante escreve sobre o tema genérico (ex.: "cinema") e esquece de focar na chave problematizadora exigida pelo INEP (ex.: "a democratização do acesso no Brasil"). No tangenciamento, a nota da Competência 2 é limitada ao Nível 1 (40 pontos), e as outras competências também são severamente impactadas.',
    inepCriteriaContext: 'A regra do INEP é taxativa: se todos os núcleos da frase-tema não estiverem presentes ou contemplados semanticamente no texto, a redação é classificada como tangenciada.',
    practicalExample: 'No tema "Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil" (ENEM 2021), falar apenas de cidadania e esquecer do registro de nascimento/certidão de nascimento configurava tangenciamento.',
    commonMistakeWarning: 'Esquecer de citar ou parafrasear os substantivos e adjetivos determinantes da frase-tema logo na introdução.',
    relatedTerms: ['Recorte Temático', 'Repertório Pertinente', 'Abordagem Completa'],
    difficultyLevel: 'Fundamental',
    authorOrSource: 'Manual de Correção do INEP - Competência 2'
  },
  {
    id: 'marca-de-autoria',
    term: 'Marca de Autoria',
    category: 'geral',
    competencyTag: 'C3',
    shortDefinition: 'Presença de julgamento crítico autônomo, vocabulário valorativo e posicionamento contundente do autor, superando o mero resumo de informações.',
    fullDefinition: 'A marca de autoria é o que distingue uma redação robótica ou copiada de uma redação autêntica e madura. Revela-se pela seleção precisa de adjetivos, advérbios e substantivos de carga apreciativa ou depreciativa (ex.: "nefasto", "inadmissível", "ilusório", "urgente"), demonstrando engajamento crítico com a realidade analisada.',
    inepCriteriaContext: 'Fundamental para a obtenção do Nível 5 na Competência 3. O corretor busca verificar se o texto possui "voz própria" e reflexão aprofundada, e não apenas uma colagem de repertórios decorados.',
    practicalExample: 'Em vez de apenas descrever: "Existem poucas vagas nos hospitais", o autor com marca de autoria escreve: "Essa crônica desassistência hospitalar evidencia a perversa violação do pacto social republicano."',
    commonMistakeWarning: 'Ficar em cima do muro ou adotar tom puramente expositivo e neutro, transformando a dissertação argumentativa em um texto informativo.',
    relatedTerms: ['Projeto de Texto Estratégico', 'Adjetivação Valorativa', 'Lacuna Argumentativa'],
    difficultyLevel: 'Nota 1000',
    authorOrSource: 'Matriz INEP - Nível 5 da C3'
  },
  {
    id: 'direitos-humanos-c5',
    term: 'Direitos Humanos na Redação do ENEM',
    category: 'geral',
    competencyTag: 'C5',
    shortDefinition: 'Diretriz obrigatória que proíbe qualquer proposta que incite à violência, faça apologia à tortura, discrimine grupos ou proponha justiçamento.',
    fullDefinition: 'Desde a decisão do STF em 2017, o desrespeito aos Direitos Humanos não zera mais a redação inteira automaticamente, mas zera OBRIGATORIAMENTE a Competência 5 (0 pontos na C5) e impede o candidato de alcançar pontuação competitiva.',
    inepCriteriaContext: 'São consideradas violações: propor prisão perpétua ou pena de morte no Brasil, censura prévia, esterilização forçada, linchamento, trabalho análogo à escravidão ou discursos que desrespeitem minorias com base em raça, etnia, gênero, religião ou orientação sexual.',
    practicalExample: 'Propor que "infratores sejam banidos do convívio social sem julgamento" anula a C5. A proposta correta deve sempre primar por reeducação, fiscalização institucional e aplicação legal do devido processo.',
    commonMistakeWarning: 'Usar expressões radicais como "eliminar", "erradicar sumariamente quem descumprir" ou defender a justiça pelas próprias mãos.',
    relatedTerms: ['Competência 5', 'Proposta Válida', 'GOMIFES'],
    difficultyLevel: 'Fundamental',
    authorOrSource: 'Edital Oficial ENEM & Cartilha do Participante'
  },

  // ==========================================
  // COMPETÊNCIA 1: GRAMÁTICA & SINTAXE
  // ==========================================
  {
    id: 'paralelismo-sintatico',
    term: 'Paralelismo Sintático',
    category: 'c1',
    competencyTag: 'C1',
    shortDefinition: 'Manutenção da mesma estrutura gramatical entre termos coordenados, orações ligadas por conjunções e enumerações.',
    fullDefinition: 'Consiste em expressar ideias de igual valor semântico com estruturas gramaticais simétricas. Se um termo começa com substantivo, o outro deve seguir com substantivo; se uma oração começa com verbo no infinitivo, a seguinte deve manter o infinitivo.',
    inepCriteriaContext: 'A quebra de paralelismo é classificada como falha de estrutura sintática na Competência 1 e rebaixa a nota para o Nível 4 ou 3 se recorrente.',
    practicalExample: 'Incorreto: "É preciso investir na educação e que se combata a evasão." (substantivo + oração subordinada).\nCorreto: "É preciso investir na educação e combater a evasão escolar." (dois verbos no infinitivo com seus complementos).',
    commonMistakeWarning: 'Misturar tempos verbais diferentes em teses compostas: "O Estado negligencia a fiscalização e puniu pouco os infratores."',
    relatedTerms: ['Truncamento', 'Justaposição', 'Estrutura Sintática'],
    difficultyLevel: 'Avançado',
    authorOrSource: 'Gramática Normativa & Matriz INEP C1'
  },
  {
    id: 'truncamento-de-periodos',
    term: 'Truncamento de Períodos',
    category: 'c1',
    competencyTag: 'C1',
    shortDefinition: 'Erro de pontuação grave no qual uma oração subordinada ou termo dependente é isolado por ponto final, ficando sem oração principal.',
    fullDefinition: 'Ocorre quando o estudante separa com ponto final uma oração que não tem sentido completo sozinha (como uma oração adverbial ou adjetiva introduzida por "Visto que", "Porque", "O qual", "Sendo assim"), quebrando o fluxo sintático.',
    inepCriteriaContext: 'O INEP considera o truncamento uma das falhas de estrutura sintática mais graves. Apenas duas falhas estruturais já impedem a nota 200 na C1.',
    practicalExample: 'Incorreto: "A evasão escolar é alarmante no país. Porque faltam políticas de permanência para os jovens da periferia."\nCorreto: "A evasão escolar é alarmante no país, porque faltam políticas de permanência para os jovens da periferia."',
    commonMistakeWarning: 'Iniciar parágrafos ou períodos com gerúndios soltos ("Sendo essencial agir...") sem sujeito e sem oração principal vinculada.',
    relatedTerms: ['Justaposição de Orações', 'Paralelismo Sintático', 'Período Composto'],
    difficultyLevel: 'Fundamental',
    authorOrSource: 'Guia de Corretores INEP C1'
  },
  {
    id: 'justaposicao-de-oracoes',
    term: 'Justaposição de Orações',
    category: 'c1',
    competencyTag: 'C1',
    shortDefinition: 'Emenda indevida de dois períodos independentes apenas por vírgula, sem conjunção ou sem ponto final separador.',
    fullDefinition: 'É o oposto do truncamento: em vez de cortar uma frase onde deveria haver vírgula, o participante junta duas orações completas usando somente uma vírgula, gerando períodos gigantescos e frouxos sintaticamente.',
    inepCriteriaContext: 'Classificado como falha de estrutura sintática na C1. Provoca perda de pontos imediata se houver mais de uma ocorrência no texto.',
    practicalExample: 'Incorreto: "O preconceito persiste no Brasil, ele decorre da falta de instrução formal nas escolas."\nCorreto: "O preconceito persiste no Brasil. Essa problemática decorre da falta de instrução formal nas escolas."',
    commonMistakeWarning: 'Escrever parágrafos inteiros de 6 linhas com uma única frase contendo apenas vírgulas.',
    relatedTerms: ['Truncamento de Períodos', 'Conectivos Intraparágrafos'],
    difficultyLevel: 'Fundamental',
    authorOrSource: 'Critérios Oficiais INEP C1'
  },
  {
    id: 'crase-enem',
    term: 'Uso da Crase (Regras Críticas no ENEM)',
    category: 'c1',
    competencyTag: 'C1',
    shortDefinition: 'Fusão da preposição "a" exigida por um verbo ou nome com o artigo definido feminino "a(s)" ou pronomes demonstrativos "aquele(s)".',
    fullDefinition: 'No ENEM, a crase é exigida principalmente diante de palavras femininas subordinadas a termos regentes que pedem preposição "a" (ex.: "acesso à saúde", "direito à educação", "visar à erradicação", "relacionado à dignidade") e em locuções prepositivas/conjuntivas femininas (ex.: "à medida que", "à proporção que", "à disposição de").',
    inepCriteriaContext: 'Desvios de crase contam como desvios gramaticais na C1. Mais de dois desvios em todo o texto tiram a nota máxima (200 pts).',
    practicalExample: 'Correto: "O acesso à cidadania depende da garantia dos direitos sociais."\nIncorreto: "O acesso a cidadania..." (falta de crase) ou "O governo deve combater à desigualdade" (crase indevida com verbo transitivo direto).',
    commonMistakeWarning: 'Usar crase antes de palavras masculinas, verbos ("disposto à agir") ou pronomes que não admitem artigo ("referente à ela").',
    relatedTerms: ['Regência Verbal e Nominal', 'Desvios Gramaticais'],
    difficultyLevel: 'Fundamental',
    authorOrSource: 'Norma Padrão da Língua Portuguesa'
  },
  {
    id: 'regencia-implicar',
    term: 'Regência Verbal do Verbo "Implicar"',
    category: 'c1',
    competencyTag: 'C1',
    shortDefinition: 'No sentido de "acarretar" ou "ter como consequência", o verbo implicar é TRANSITIVO DIRETO (não aceita a preposição "em").',
    fullDefinition: 'Um dos erros mais frequentes na redação do ENEM. No padrão culto formal, diz-se "isso implica graves consequências", e NUNCA "isso implica em graves consequências".',
    inepCriteriaContext: 'A banca penaliza o uso de "implicar em" como desvio de regência verbal na Competência 1.',
    practicalExample: 'Incorreto: "A falta de saneamento básico implica em sérios riscos de contaminação."\nCorreto: "A falta de saneamento básico implica sérios riscos de contaminação."',
    commonMistakeWarning: 'Empregar "implica em", "visar o objetivo" (em vez de "visar ao objetivo") ou "assistir o filme" (em vez de "assistir ao filme").',
    relatedTerms: ['Paralelismo Sintático', 'Competência 1'],
    difficultyLevel: 'Avançado',
    authorOrSource: 'Manual de Redação e Regência Verbal'
  },

  // ==========================================
  // COMPETÊNCIA 2: REPERTÓRIO & TEMA
  // ==========================================
  {
    id: 'repertorio-legitimado',
    term: 'Repertório Legitimado',
    category: 'c2',
    competencyTag: 'C2',
    shortDefinition: 'Informação, fato, citação ou conceito fundamentado em áreas formais do saber (Filosofia, Sociologia, História, Leis, Literatura, Artes, Ciência).',
    fullDefinition: 'É o primeiro dos 3 critérios obrigatórios da Competência 2. Para ser considerado legitimado pelo INEP, o repertório deve conter nome de autor, teoria reconhecida, obra artística, dado com fonte ou artigo de lei explícito. Informações do senso comum ("todos sabem que") não são legitimadas.',
    inepCriteriaContext: 'Sem ao menos um repertório legitimado, pertinente e produtivo, a nota máxima que o estudante pode atingir na C2 é 120 pontos (Nível 3).',
    practicalExample: 'Citar "Segundo a filósofa Hannah Arendt em seu conceito de Banalidade do Mal..." é um repertório legitimado pela Filosofia Política.',
    commonMistakeWarning: 'Inventar filósofos ou atribuir frases famosas a autores incorretos (ex.: atribuir a frase da Modernidade Líquida a Platão).',
    relatedTerms: ['Repertório Pertinente', 'Repertório Produtivo', 'Repertório de Bolso'],
    difficultyLevel: 'Fundamental',
    authorOrSource: 'Guia do Participante INEP - Competência 2'
  },
  {
    id: 'repertorio-pertinente',
    term: 'Repertório Pertinente',
    category: 'c2',
    competencyTag: 'C2',
    shortDefinition: 'Repertório que possui vínculo temático direto e explícito com pelo menos um dos elementos centrais da frase-tema do ENEM.',
    fullDefinition: 'É o segundo critério da C2. O repertório pode ser altamente legitimado (ex.: Teoria da Gravidade de Newton), mas se ele não mantiver pertinência com o problema social da redação (ex.: evasão escolar), ele será considerado não pertinente e desconsiderado.',
    inepCriteriaContext: 'O corretor avalia se o repertório dialoga com o tema ou se foi forçado como um encaixe postiço.',
    practicalExample: 'Em um tema sobre alimentação e desperdício, citar o relatório SOFI da FAO (ONU) ou Josué de Castro em "Geografia da Fome" é 100% pertinente.',
    commonMistakeWarning: 'Usar citações vagas e genéricas que poderiam servir para qualquer tema sem explicar a ligação com o problema em questão.',
    relatedTerms: ['Repertório Legitimado', 'Repertório Produtivo', 'Tangenciamento Temático'],
    difficultyLevel: 'Fundamental',
    authorOrSource: 'Matriz INEP C2'
  },
  {
    id: 'repertorio-produtivo',
    term: 'Repertório Produtivo',
    category: 'c2',
    competencyTag: 'C2',
    shortDefinition: 'Repertório devidamente articulado ao projeto argumentativo do texto, servindo como motor analítico para defender o ponto de vista do candidato.',
    fullDefinition: 'É o critério de excelência do Nível 5 (200 pontos). Não basta jogar a citação no parágrafo; o estudante deve explicar como a teoria citada se manifesta na realidade brasileira, estabelecendo uma ponte interpretativa com a sua tese.',
    inepCriteriaContext: 'Um repertório é improdutivo quando fica "jogado", "descolado" ou apenas decorativo na frase, sem que o parágrafo se aprofunde a partir dele.',
    practicalExample: '"Conforme o sociólogo Zygmunt Bauman, a modernidade líquida é marcada pela fragilidade dos vínculos. Analogamente a esse pensamento, nota-se que a indiferença comunitária no Brasil corrobora o abandono de pessoas idosas, perpetuando o isolamento afetivo."',
    commonMistakeWarning: 'Colocar uma frase de efeito entre aspas no início do parágrafo e nunca mais mencioná-la no restante da argumentação.',
    relatedTerms: ['Repertório Legitimado', 'Repertório Pertinente', 'Projeto de Texto Estratégico'],
    difficultyLevel: 'Nota 1000',
    authorOrSource: 'INEP - Critério Nível 5 de C2'
  },
  {
    id: 'repertorio-de-bolso',
    term: 'Repertório de Bolso / Repertório Coringa',
    category: 'c2',
    competencyTag: 'C2',
    shortDefinition: 'Citações ou conceitos ultra-genéricos decorados para tentar encaixar em qualquer tema sem reflexão analítica aprofundada.',
    fullDefinition: 'Embora frases como "A educação é a arma mais poderosa para mudar o mundo" (Nelson Mandela) sejam válidas, o uso mecânico e descontextualizado é severamente penalizado pelos corretores do INEP se não houver articulação produtiva e específica com a tese.',
    inepCriteriaContext: 'Os corretores são orientados a verificar a produtividade real do repertório, penalizando encaixes artificiais.',
    practicalExample: 'Em vez de usar apenas a citação decorada de Mandela, aprofunde a análise relacionando-a às deficiências orçamentárias ou curriculares da educação básica no Brasil.',
    commonMistakeWarning: 'Depender exclusivamente de uma única citação memorizada para resolver todos os temas sem repertórios específicos do eixo temático.',
    relatedTerms: ['Repertório Produtivo', 'Marca de Autoria'],
    difficultyLevel: 'Avançado',
    authorOrSource: 'Capacitação de Corretores INEP'
  },

  // ==========================================
  // COMPETÊNCIA 3: PROJETO DE TEXTO & ARGUMENTAÇÃO
  // ==========================================
  {
    id: 'topico-frasal',
    term: 'Tópico Frasal',
    category: 'c3',
    competencyTag: 'C3',
    shortDefinition: 'Frase de abertura do parágrafo de desenvolvimento que enuncia de forma direta, clara e concisa o argumento central a ser comprovado.',
    fullDefinition: 'Funciona como a síntese temática do parágrafo. Um bom tópico frasal no D1 e no D2 recupera o argumento prometido na introdução (A1 ou A2) acompanhado de um operador de conexão interparágrafo.',
    inepCriteriaContext: 'Demonstra domínio de planejamento textual e clareza de projeto de texto na Competência 3.',
    practicalExample: '"Em primeiro plano, cabe pontuar que a inoperância legislativa atua como catalisadora da persistência desse revés social no Brasil."',
    commonMistakeWarning: 'Começar o parágrafo de desenvolvimento diretamente com um dado ou uma citação longa sem enunciar primeiro o argumento analítico.',
    relatedTerms: ['Projeto de Texto Estratégico', 'Argumentação por Causalidade', 'Conectivos Interparágrafos'],
    difficultyLevel: 'Fundamental',
    authorOrSource: 'Teoria da Dissertação & INEP C3'
  },
  {
    id: 'lacuna-argumentativa',
    term: 'Lacuna Argumentativa',
    category: 'c3',
    competencyTag: 'C3',
    shortDefinition: 'Salto lógico no qual o autor afirma um problema ou causa sem explicar COMO ou POR QUE ele acontece na prática.',
    fullDefinition: 'Ocorre quando o estudante faz declarações dogmáticas sem justificativa causal. Exemplo: afirma que "a mídia aliena as pessoas", mas não explica quais mecanismos publicitários ou algorítmicos geram essa alienação.',
    inepCriteriaContext: 'A presença de lacunas argumentativas é a principal razão pela qual redações com boa gramática não ultrapassam os 120 ou 160 pontos na Competência 3.',
    practicalExample: 'Com lacuna: "A escola falha porque não ensina sobre o tema."\nSem lacuna: "A instituição escolar falha ao priorizar um modelo conteudista voltado apenas a exames vestibulares, negligenciando a formação cidadã e o debate crítico sobre a temática."',
    commonMistakeWarning: 'Deixar perguntas implícitas na mente do corretor ("Por quê?", "Como assim?", "De que forma?").',
    relatedTerms: ['Projeto de Texto Estratégico', 'Marca de Autoria', 'Argumentação por Causalidade'],
    difficultyLevel: 'Nota 1000',
    authorOrSource: 'Manual de Avaliação INEP C3'
  },
  {
    id: 'argumentacao-causalidade',
    term: 'Argumentação por Causalidade (Causa e Efeito)',
    category: 'c3',
    competencyTag: 'C3',
    shortDefinition: 'Técnica de persuasão que explica as causas estruturais de um problema e demonstra seus impactos destrutivos imediatos e futuros.',
    fullDefinition: 'É o modelo mais valorizado na dissertação do ENEM: o estudante identifica a raiz histórica ou institucional do impasse (causa) e detalha a consequência direta sobre os indivíduos mais vulneráveis (efeito).',
    inepCriteriaContext: 'Evidencia maturidade analítica e profundidade argumentativa exigida no Nível 5 da Competência 3.',
    practicalExample: 'Causa: A omissão na fiscalização governamental. → Efeito: A proliferação impune de crimes ambientais nas terras indígenas, desaguando na perda da biodiversidade e na insegurança dos povos tradicionais.',
    commonMistakeWarning: 'Listar 5 causas diferentes em um único parágrafo sem aprofundar a cadeia causal de nenhuma delas (falácia da enumeração rasa).',
    relatedTerms: ['Tópico Frasal', 'Lacuna Argumentativa'],
    difficultyLevel: 'Avançado',
    authorOrSource: 'Metodologia de Redação Argumentativa'
  },

  // ==========================================
  // COMPETÊNCIA 4: COESÃO & CONECTIVOS
  // ==========================================
  {
    id: 'conectivos-interparagrafos',
    term: 'Conectivos Interparágrafos',
    category: 'c4',
    competencyTag: 'C4',
    shortDefinition: 'Operadores argumentativos posicionados obrigatoriamente no início dos parágrafos para encadear as partes do texto.',
    fullDefinition: 'Elementos coesivos que estabelecem ligação lógica entre blocos textuais. Para a nota máxima na C4 (200 pts), o INEP exige o uso de conectivos interparágrafos em pelo menos DOIS momentos de transição textual (início do D2 e início da Conclusão).',
    inepCriteriaContext: 'A ausência de conectivo no início do D2 ou da Conclusão rebaixa a nota da C4 automaticamente para o Nível 4 (160 pts) ou menor.',
    practicalExample: 'Para iniciar o D2: "Ademais,", "Outrossim,", "Além disso,", "Em segundo lugar,".\nPara iniciar a Conclusão: "Portanto,", "Infere-se, pois,", "Dessarte,", "Urge, destarte,".',
    commonMistakeWarning: 'Começar o D2 ou a Conclusão com expressões neutras sem valor conectivo explícito, como "Na sociedade atual," ou "O governo deve agir,".',
    relatedTerms: ['Conectivos Intraparágrafos', 'Coesão Referencial', 'Competência 4'],
    difficultyLevel: 'Fundamental',
    authorOrSource: 'Matriz INEP C4 - Regra dos Conectivos Interparágrafos'
  },
  {
    id: 'conectivos-intraparagrafos',
    term: 'Conectivos Intraparágrafos',
    category: 'c4',
    competencyTag: 'C4',
    shortDefinition: 'Operadores coesivos que articulam os períodos internos dentro de um mesmo parágrafo, garantindo fluidez e progressão temática.',
    fullDefinition: 'Para a nota 200 na C4, cada parágrafo deve conter pelo menos 2 a 3 conectivos internos ligando as frases (ex.: "Nesse contexto,", "Desse modo,", "Contudo,", "Com efeito,", "Por conseguinte,").',
    inepCriteriaContext: 'Parágrafos compostos por frases soltas sem conectores expressivos não atingem o nível máximo da C4.',
    practicalExample: '"Nesse viés, nota-se que a inércia estatal perpetua o impasse. Com efeito, a ausência de verbas públicas asfixia o setor. Por conseguinte, milhares de cidadãos permanecem desamparados."',
    commonMistakeWarning: 'Repetir o mesmo conectivo ("além disso", "além disso", "além disso") em vários parágrafos seguidos.',
    relatedTerms: ['Conectivos Interparágrafos', 'Coesão Sequencial'],
    difficultyLevel: 'Avançado',
    authorOrSource: 'Critérios Oficiais INEP C4'
  },
  {
    id: 'coesao-referencial',
    term: 'Coesão Referencial',
    category: 'c4',
    competencyTag: 'C4',
    shortDefinition: 'Mecanismos linguísticos usados para retomar ou antecipar termos no texto sem incorrer em repetições vocabulares desnecessárias.',
    fullDefinition: 'Utiliza anáforas, catáforas, elipses, pronomes demonstrativos/relativos ("este", "esse", "cujo", "o qual"), sinônimos e hiperônimos para garantir riqueza lexical e coesão textual elegante.',
    inepCriteriaContext: 'A repetição excessiva de palavras-chave da frase-tema (ex.: repetir "criança" 12 vezes) demonstra pobreza lexical e penaliza a C4.',
    practicalExample: 'Em vez de repetir "escola", variar com: "instituição de ensino", "espaço pedagógico", "ambiente formativo", "nicho escolar".',
    commonMistakeWarning: 'Confundir o uso de "este" (presente/termo posterior) com "esse" (retomada de termo já citado anteriormente no texto).',
    relatedTerms: ['Conectivos Intraparágrafos', 'Hiperônimos', 'Competência 4'],
    difficultyLevel: 'Avançado',
    authorOrSource: 'Linguística Textual & INEP C4'
  },

  // ==========================================
  // COMPETÊNCIA 5: PROPOSTA DE INTERVENÇÃO
  // ==========================================
  {
    id: 'gomifes-agentes',
    term: 'GOMIFES (Mnemônico de Agentes Sociais da C5)',
    category: 'c5',
    competencyTag: 'C5',
    shortDefinition: 'Mnemônico que reúne as 7 principais categorias de agentes executores legítimos para a proposta de intervenção da Competência 5.',
    fullDefinition: 'G = Governo / Ministérios; O = ONGs e Terceiro Setor; M = Mídia e Canais de Comunicação; I = Indivíduo / Cidadão; F = Família; E = Escolas e Universidades; S = Sociedade Civil organizada. Permite selecionar o agente social mais competente para resolver o problema abordado.',
    inepCriteriaContext: 'Agentes genéricos e vagos como "alguém", "a gente" ou "o mundo" NÃO são pontuados na Competência 5.',
    practicalExample: 'Em vez de apenas "o governo", use a pasta específica: "O Ministério da Educação (MEC)", "O Ministério do Meio Ambiente e Mudança do Clima", "O Ministério dos Direitos Humanos".',
    commonMistakeWarning: 'Atribuir ações a agentes inadequados (ex.: pedir para o Ministério da Saúde construir estradas).',
    relatedTerms: ['Detalhamento Válido', 'Os 5 Elementos da C5', 'Competência 5'],
    difficultyLevel: 'Fundamental',
    authorOrSource: 'Matriz Pedagógica INEP C5'
  },
  {
    id: 'cinco-elementos-c5',
    term: 'Os 5 Elementos da Proposta de Intervenção',
    category: 'c5',
    competencyTag: 'C5',
    shortDefinition: 'A estrutura obrigatória de 5 perguntas respondidas na conclusão que garante os 200 pontos na Competência 5 (40 pts cada).',
    fullDefinition: '1. Agente (QUEM faz?); 2. Ação (O QUE faz?); 3. Modo/Meio (COMO faz?); 4. Efeito/Finalidade (PARA QUE faz?); 5. Detalhamento (O que mais se pode ESPECIFICAR sobre um dos elementos anteriores?).',
    inepCriteriaContext: 'Cada elemento vale exatamente 40 pontos na grade do INEP. A ausência de qualquer um deles limita a nota a 160, 120, 80 ou 40 pontos.',
    practicalExample: '"Portanto, cabe ao Ministério da Saúde [AGENTE], por meio da alocação prioritária de verbas orçamentárias federais [MODO/MEIO], implementar centros de atendimento psicossocial nas periferias [AÇÃO], com a contratação emergencial de psicólogos e assistentes sociais [DETALHAMENTO DO MODO/AÇÃO], a fim de democratizar o suporte à saúde mental da população vulnerável [EFEITO]."',
    commonMistakeWarning: 'Esquecer o detalhamento, que é o responsável por 80% das perdas de nota na C5 entre alunos que já escrevem bem.',
    relatedTerms: ['Detalhamento Válido', 'GOMIFES', 'Proposta Nula'],
    difficultyLevel: 'Fundamental',
    authorOrSource: 'Guia do Participante INEP - Competência 5'
  },
  {
    id: 'detalhamento-valido-c5',
    term: 'Detalhamento Válido na C5',
    category: 'c5',
    competencyTag: 'C5',
    shortDefinition: 'Informação adicional, justificativa, exemplificação ou especificação minuciosa associada a um dos outros quatro elementos da proposta.',
    fullDefinition: 'O 5º elemento pode detalhar: o Agente (explicando sua função constitucional: ", órgão responsável por..."), o Meio (exemplificando ferramentas: ", como palestras interativas e oficinas práticas"), a Ação (especificando seu escopo) ou o Efeito (com desdobramento de impacto a longo prazo).',
    inepCriteriaContext: 'O detalhamento deve ser substantivo. Meras frases vazias como "isso é muito importante" não são aceitas como detalhamento válido pelos corretores.',
    practicalExample: 'Detalhamento do Agente: "Cabe ao Ministério da Educação — pasta responsável pela elaboração das diretrizes curriculares nacionais — [...]".\nDetalhamento do Meio: "[...] mediante campanhas nos meios digitais, a exemplo de podcasts e vídeos informativos nas redes sociais, [...]".',
    commonMistakeWarning: 'Achar que o detalhamento precisa ser uma frase separada no final do texto, quando ele deve ser inserido organicamente em aposto ou oração explicativa.',
    relatedTerms: ['Os 5 Elementos da C5', 'GOMIFES', 'Competência 5'],
    difficultyLevel: 'Avançado',
    authorOrSource: 'Manual de Capacitação de Avaliadores INEP C5'
  },

  // ==========================================
  // CONCEITOS FILOSÓFICOS & SOCIOLÓGICOS (REPERTÓRIO)
  // ==========================================
  {
    id: 'bauman-modernidade-liquida',
    term: 'Modernidade Líquida (Zygmunt Bauman)',
    category: 'filosofia_sociologia',
    competencyTag: 'C2',
    shortDefinition: 'Conceito sociológico que descreve a transição de instituições sólidas e duráveis para relações sociais efêmeras, voláteis e consumistas.',
    fullDefinition: 'Para Bauman, vivemos em uma era em que nada é feito para durar: compromissos, vínculos afetivos e responsabilidades cívicas se tornaram fluidos e descartáveis. A lógica do mercado e do hiperconsumo substituiu o compromisso com o bem coletivo.',
    inepCriteriaContext: 'Repertório legitimado e altamente produtivo para temas que envolvam consumismo, individualismo, descarte ambiental, relações virtuais e fragilização de laços comunitários.',
    repertoireApplication: 'Pode ser articulado para explicar a falta de empatia social ou a busca por soluções imediatistas em detrimento de políticas públicas sustentáveis.',
    practicalExample: '"Conforme o sociólogo Zygmunt Bauman em sua obra \'Modernidade Líquida\', as relações contemporâneas são marcadas pela fragilidade dos vínculos e pelo individualismo. Essa perspectiva reflete a indiferença da sociedade brasileira perante a vulnerabilidade das populações em situação de rua."',
    commonMistakeWarning: 'Citar Bauman sem explicar o que significa a "liquidez" no contexto específico do tema proposto.',
    relatedTerms: ['Sociedade do Cansaço', 'Indústria Cultural', 'Repertório Produtivo'],
    difficultyLevel: 'Fundamental',
    authorOrSource: 'Zygmunt Bauman (1925–2017) - Sociologia'
  },
  {
    id: 'dimenstein-cidadao-de-papel',
    term: 'Cidadão de Papel (Gilberto Dimenstein)',
    category: 'filosofia_sociologia',
    competencyTag: 'C2',
    shortDefinition: 'Conceito que denuncia o abismo entre os direitos universais garantidos na Constituição de 1988 e a sua ineficácia na prática cotidiana.',
    fullDefinition: 'No livro "O Cidadão de Papel", o jornalista Gilberto Dimenstein demonstra que no Brasil as leis são avançadas no papel, mas muitos indivíduos vivem como cidadãos fictícios, desprovidos de direitos básicos como saúde, educação de qualidade, saneamento e segurança.',
    inepCriteriaContext: 'Repertório clássico, legítimo e produtivo para qualquer tema que envolva exclusão social, negligência estatal ou disparidade entre a lei e a realidade.',
    repertoireApplication: 'Excelente para o D1 para contrastar a promessa da Carta Magna com o abandono fático de comunidades marginalizadas.',
    practicalExample: '"Nesse sentido, a obra \'O Cidadão de Papel\', de Gilberto Dimenstein, elucida que os direitos assegurados pela legislação brasileira permanecem muitas vezes restritos ao plano teórico. Essa discrepância é evidente na carência de assistência aos povos tradicionais."',
    commonMistakeWarning: 'Escrever "Cidadão de Papel" sem vincular à inércia do Estado ou à desigualdade de acesso aos direitos.',
    relatedTerms: ['Constituição Cidadã de 1988', 'Contrato Social', 'Direcionamento Argumentativo'],
    difficultyLevel: 'Fundamental',
    authorOrSource: 'Gilberto Dimenstein (1956–2020) - Obra: O Cidadão de Papel (1993)'
  },
  {
    id: 'bourdieu-violencia-simbolica',
    term: 'Violência Simbólica e Habitus (Pierre Bourdieu)',
    category: 'filosofia_sociologia',
    competencyTag: 'C2',
    shortDefinition: 'Forma de dominação e opressão sutil, invisível e naturalizada pela cultura e instituições, na qual os próprios dominados aceitam a sua condição.',
    fullDefinition: 'Bourdieu explica que as desigualdades se perpetuam não apenas pela força física, mas pela reprodução de valores culturais e preconceitos internalizados (o habitus) que fazem as disparidades sociais parecerem "normais" ou culpa do próprio indivíduo.',
    inepCriteriaContext: 'Repertório de alto padrão sociocultural para temas sobre machismo, preconceito linguístico, racismo estrutural, capacitismo ou elitismo escolar.',
    repertoireApplication: 'Ideal para desconstruir preconceitos enraizados no D2 e justificar por que a sociedade tolera certas violações de forma passiva.',
    practicalExample: '"Sob a ótica do sociólogo Pierre Bourdieu, a \'violência simbólica\' se manifesta quando estruturas de dominação são naturalizadas pelo corpo social. De maneira análoga, os estigmas associados às doenças mentais são perpetuados por discursos cotidianos de desqualificação."',
    commonMistakeWarning: 'Confundir violência simbólica com agressão física explícita.',
    relatedTerms: ['Banalidade do Mal', 'Indústria Cultural', 'Marca de Autoria'],
    difficultyLevel: 'Nota 1000',
    authorOrSource: 'Pierre Bourdieu (1930–2002) - Sociologia da Cultura'
  },
  {
    id: 'arendt-banalidade-do-mal',
    term: 'Banalidade do Mal (Hannah Arendt)',
    category: 'filosofia_sociologia',
    competencyTag: 'C2',
    shortDefinition: 'Conceito que explica como o mal e as atrocidades sociais se normalizam quando os indivíduos deixam de pensar criticamente e passam a cumprir rotinas de forma passiva.',
    fullDefinition: 'Em "Eichmann em Jerusalém", Arendt conclui que grandes tragédias sociais muitas vezes não decorrem de monstros sádicos, mas de pessoas comuns que se recusam a refletir sobre o impacto humano de suas ações e aceitam a barbárie como algo corriqueiro.',
    inepCriteriaContext: 'Repertório excelente para discutir a naturalização de violências cotidianas, a indiferença com a miséria, o descaso ambiental e a omissão coletiva.',
    repertoireApplication: 'Aplicável para demonstrar que a sociedade civil normalizou a exclusão de determinados grupos vulneráveis.',
    practicalExample: '"Consoante a filósofa política Hannah Arendt em sua tese da \'Banalidade do Mal\', a alienação crítica das massas fomenta a aceitação de injustiças estruturais. Essa constatação aplica-se à passividade com que a sociedade convive com a fome crônica no território nacional."',
    commonMistakeWarning: 'Usar o conceito para temas puramente técnicos sem vínculo com desumanização ou inação moral.',
    relatedTerms: ['Cidadão de Papel', 'Biopolítica', 'Repertório Produtivo'],
    difficultyLevel: 'Nota 1000',
    authorOrSource: 'Hannah Arendt (1906–1975) - Filosofia Política'
  },
  {
    id: 'foucault-biopolitica',
    term: 'Biopolítica e Microfísica do Poder (Michel Foucault)',
    category: 'filosofia_sociologia',
    competencyTag: 'C2',
    shortDefinition: 'Técnicas de poder e gestão estatal voltadas para o controle, vigilância, regulação dos corpos e administração da vida biológica da população.',
    fullDefinition: 'Foucault argumenta que o poder moderno opera de maneira capilar e disciplinar: o Estado e as instituições regulam quem deve viver plenamente e quais grupos podem ser abandonados ou silenciados à margem da sociedade.',
    inepCriteriaContext: 'Conceito filosófico sofisticado e consagrado em redações nota 1000 para temas de saúde pública, controle de dados na internet, sistema prisional e vigilância.',
    repertoireApplication: 'Útil para problematizar como a falta de assistência a certos grupos populacionais constitui uma escolha política velada do poder público.',
    practicalExample: '"Sob a perspectiva de Michel Foucault em seus estudos sobre a \'Biopolítica\', o Estado moderno exerce mecanismos de controle sobre a vida e a saúde dos corpos. Todavia, a ausência de saneamento básico nas periferias revela a seletividade com que essas políticas são distribuídas."',
    commonMistakeWarning: 'Usar termos complexos de Foucault sem explicar a correlação prática com o problema brasileiro.',
    relatedTerms: ['Hannah Arendt', 'Pierre Bourdieu', 'Repertório Legitimado'],
    difficultyLevel: 'Nota 1000',
    authorOrSource: 'Michel Foucault (1926–1984) - Filosofia & Teoria Crítica'
  },
  {
    id: 'byung-chul-han-sociedade-do-cansaco',
    term: 'Sociedade do Cansaço (Byung-Chul Han)',
    category: 'filosofia_sociologia',
    competencyTag: 'C2',
    shortDefinition: 'Conceito contemporâneo sobre a transição da sociedade disciplinar para a sociedade do desempenho, na qual o indivíduo se autoexplora até o esgotamento.',
    fullDefinition: 'O filósofo sul-coreano Byung-Chul Han aponta que o excesso de positividade e o imperativo da produtividade ininterrupta geram patologias neuronais como depressão, ansiedade e síndrome de Burnout, criando a ilusão de que o fracasso é sempre culpa do indivíduo.',
    inepCriteriaContext: 'Repertório moderno e extremamente atual para temas ligados a saúde mental, impactos do trabalho remoto, inteligência artificial, redes sociais e juventude.',
    repertoireApplication: 'Permite desconstruir o discurso meritocrático falacioso e abordar o sofrimento psíquico estrutural no Brasil contemporâneo.',
    practicalExample: '"Consoante o filósofo Byung-Chul Han em \'A Sociedade do Cansaço\', o imperativo moderno de rendimento ininterrupto conduz os cidadãos à autoexploração e ao colapso mental. No cenário brasileiro, essa dinâmica acentua a crise de saúde mental entre os trabalhadores."',
    commonMistakeWarning: 'Escrever o nome do filósofo incorretamente ou não associar o esgotamento mental ao recorte do tema.',
    relatedTerms: ['Modernidade Líquida', 'Indústria Cultural', 'C2'],
    difficultyLevel: 'Nota 1000',
    authorOrSource: 'Byung-Chul Han (1959–) - Filosofia Contemporânea'
  },
  {
    id: 'durkheim-fato-social-anomia',
    term: 'Fato Social e Anomia (Émile Durkheim)',
    category: 'filosofia_sociologia',
    competencyTag: 'C2',
    shortDefinition: 'Fato Social é tudo que é exterior ao indivíduo, coercitivo e geral; Anomia é o estado de desintegração social decorrente da perda de eficácia das regras morais.',
    fullDefinition: 'Durkheim estabelece que a sociedade é como um organismo vivo. Quando as instituições falham em regular a convivência ou em integrar os indivíduos, instala-se o estado de anomia social, gerando aumento da criminalidade, desesperança e ruptura da solidariedade orgânica.',
    inepCriteriaContext: 'Repertório clássico e seguro da Sociologia para temas de segurança pública, evasão escolar, desestruturação familiar e falência de serviços essenciais.',
    repertoireApplication: 'Pode ser usado no D1 para demonstrar que a persistência de um problema não é uma fatalidade natural, mas um "Fato Social" moldado pela inércia institucional.',
    practicalExample: '"De acordo com o sociólogo Émile Durkheim, a falha das instituições em cumprir seu papel regulador gera um estado de \'anomia social\', marcado pela desagregação comunitária. Tal conceito coaduna-se com a vulnerabilidade dos jovens sem acesso a espaços culturais."',
    commonMistakeWarning: 'Falar de anomia sem ligar à responsabilidade das instituições públicas e sociais.',
    relatedTerms: ['Contrato Social', 'Zygmunt Bauman', 'C3'],
    difficultyLevel: 'Fundamental',
    authorOrSource: 'Émile Durkheim (1858–1917) - Sociologia Clássica'
  },
  {
    id: 'adorno-industria-cultural',
    term: 'Indústria Cultural (Theodor Adorno & Max Horkheimer)',
    category: 'filosofia_sociologia',
    competencyTag: 'C2',
    shortDefinition: 'Conceito da Escola de Frankfurt que denuncia a transformação da arte e da informação em mercadorias padronizadas para alienar a população.',
    fullDefinition: 'Os teóricos demonstram que os conglomerados de comunicação e entretenimento padronizam conteúdos de consumo rápido para manter o público em estado de passividade acrítica, bloqueando a capacidade de questionar as contradições do sistema econômico.',
    inepCriteriaContext: 'Repertório de alto valor para temas envolvendo redes sociais, desinformação (fake news), cinema, patrimônio cultural, algoritmos e publicidade infantil.',
    repertoireApplication: 'Permite explicar por que produtos culturais enriquecedores são preteridos em favor de entretenimentos alienantes.',
    practicalExample: '"Segundo Theodor Adorno e Max Horkheimer em sua crítica à \'Indústria Cultural\', a massificação dos bens artísticos destitui o indivíduo de sua capacidade reflexiva. Esse fenômeno é evidente na proliferação de bolhas algorítmicas nas redes digitais."',
    commonMistakeWarning: 'Confundir indústria cultural com qualquer tipo de empresa comercial.',
    relatedTerms: ['Pierre Bourdieu', 'Modernidade Líquida', 'C2'],
    difficultyLevel: 'Nota 1000',
    authorOrSource: 'Escola de Frankfurt (1947) - Filosofia & Teoria Crítica'
  },

  // ==========================================
  // LEGISLAÇÃO & MARCOS CONSTITUCIONAIS (REPERTÓRIO)
  // ==========================================
  {
    id: 'cf88-artigos-chave',
    term: 'Constituição Federal de 1988 ("Constituição Cidadã")',
    category: 'legislacao',
    competencyTag: 'C2',
    shortDefinition: 'A Carta Magna brasileira promulgada em 1988 que estabeleceu o Estado Democrático de Direito e consagrou os direitos sociais fundamentais.',
    fullDefinition: 'Artigos essenciais para o ENEM:\n• Art. 1º, III: Princípio da Dignidade da Pessoa Humana;\n• Art. 3º: Objetivos da República (construir sociedade livre, justa e solidária; erradicar a pobreza e reduzir desigualdades);\n• Art. 5º: Princípio da Isonomia e inviolabilidade da vida, liberdade e igualdade;\n• Art. 6º: Direitos Sociais fundamentais (educação, saúde, alimentação, trabalho, moradia, lazer, segurança, previdência social, proteção à maternidade e à infância);\n• Art. 196: A saúde como direito de todos e dever do Estado;\n• Art. 205: A educação como direito de todos para o pleno desenvolvimento da pessoa;\n• Art. 225: O direito ao meio ambiente ecologicamente equilibrado para as presentes e futuras gerações.',
    inepCriteriaContext: 'Repertório legitimado máximo, universal e de fácil pertinência para qualquer tema com dimensão de direitos no Brasil.',
    repertoireApplication: 'Pode ser empregado na introdução ou no D1 para estabelecer a base jurídica ideal e em seguida contrastá-la com a realidade precária vivida na prática.',
    practicalExample: '"A Constituição Federal de 1988, documento basilar da ordem democrática brasileira, assegura em seu Artigo 6º o direito inalienável à segurança alimentar e à saúde pública. No entanto, a persistência do desperdício de comida contrasta com essa garantia legal."',
    commonMistakeWarning: 'Escrever "Constituição de 1988" sem vincular ao artigo ou direito específico pertinente ao tema.',
    relatedTerms: ['Cidadão de Papel', 'Declaração Universal da ONU', 'ECA'],
    difficultyLevel: 'Fundamental',
    authorOrSource: 'Assembleia Nacional Constituinte (1988) - Brasil'
  },
  {
    id: 'dudh-onu-1948',
    term: 'Declaração Universal dos Direitos Humanos (DUDH - ONU, 1948)',
    category: 'legislacao',
    competencyTag: 'C2',
    shortDefinition: 'Tratado internacional proclamado pela Assembleia Geral da ONU que estabelece a proteção universal dos direitos humanos fundamentais.',
    fullDefinition: 'Adotada no pós-Segunda Guerra Mundial, a DUDH estabelece em seu Artigo 1º que todos os seres humanos nascem livres e iguais em dignidade e direitos. Seu Artigo 25 garante o direito a um padrão de vida capaz de assegurar saúde, bem-estar, alimentação, vestuário, habitação e cuidados médicos.',
    inepCriteriaContext: 'Repertório de legitimidade global incontestável para introduzir ou respaldar discussões éticas, migratórias, antirracistas ou de combate à fome.',
    repertoireApplication: 'Ideal para embasar a introdução ou o tópico frasal com alcance universal.',
    practicalExample: '"Promulgada em 1948 pela ONU, a Declaração Universal dos Direitos Humanos preconiza que a dignidade e o bem-estar são prerrogativas inalienáveis de todo cidadão. Contudo, o preconceito contra pessoas com deficiência desafia o cumprimento dessa premissa."',
    commonMistakeWarning: 'Citar a DUDH como se fosse uma lei brasileira comum, quando é um tratado internacional recepcionado pelo ordenamento pátrio.',
    relatedTerms: ['Constituição Federal de 1988', 'Agenda 2030 da ONU'],
    difficultyLevel: 'Fundamental',
    authorOrSource: 'Organização das Nações Unidas (1948)'
  },
  {
    id: 'eca-lei-8069',
    term: 'Estatuto da Criança e do Adolescente (ECA - Lei 8.069/1990)',
    category: 'legislacao',
    competencyTag: 'C2',
    shortDefinition: 'Legislação federal que dispõe sobre a proteção integral e prioridade absoluta dos direitos de crianças e adolescentes no Brasil.',
    fullDefinition: 'O ECA estabelece que é dever da família, da comunidade, da sociedade em geral e do poder público assegurar, com absoluta prioridade, a efetivação dos direitos à vida, à saúde, à alimentação, à educação, ao esporte, ao lazer, à cultura e à dignidade.',
    inepCriteriaContext: 'Repertório indispensável para qualquer tema que aborde trabalho infantil, evasão escolar na infância, proteção digital de menores, saúde mental infantojuvenil ou adoção.',
    repertoireApplication: 'Excelente para fundamentar a ação interventiva da C5 envolvendo o Ministério da Educação, conselhos tutelares e escolas.',
    practicalExample: '"Conforme prevê o Estatuto da Criança e do Adolescente (ECA), a população infanto-juvenil deve desfrutar de prioridade absoluta na garantia de direitos fundamentais. Não obstante, o avanço da publicidade abusiva na internet viola essa salvaguarda."',
    commonMistakeWarning: 'Esquecer de mencionar a sigla ou o número da lei ao contextualizar.',
    relatedTerms: ['Constituição Federal de 1988', 'GOMIFES'],
    difficultyLevel: 'Fundamental',
    authorOrSource: 'Lei Federal nº 8.069/1990 - Brasil'
  },
  {
    id: 'marco-civil-lgpd',
    term: 'Marco Civil da Internet (Lei 12.965/14) & LGPD (Lei 13.709/18)',
    category: 'legislacao',
    competencyTag: 'C2',
    shortDefinition: 'Leis brasileiras pioneiras que regulam os princípios, garantias, neutralidade da rede e proteção de dados pessoais no ambiente digital.',
    fullDefinition: 'O Marco Civil da Internet estabelece a liberdade de expressão, a privacidade e a neutralidade da rede como pilares da navegação online. A LGPD (Lei Geral de Proteção de Dados) disciplina o tratamento de informações de cidadãos por empresas e governos, exigindo consentimento e transparência.',
    inepCriteriaContext: 'Repertório cirúrgico para temas de crimes cibernéticos, vazamento de dados, inteligência artificial, manipulação de comportamento online e dependência de telas.',
    repertoireApplication: 'Útil tanto na argumentação teórica quanto na formulação da proposta de intervenção na C5 (envolvendo a ANPD - Autoridade Nacional de Proteção de Dados).',
    practicalExample: '"Embora o Marco Civil da Internet e a LGPD estabeleçam diretrizes para a privacidade e o consentimento no ambiente virtual, a manipulação de informações mediante algoritmos opacos ainda ameaça a autonomia dos usuários."',
    commonMistakeWarning: 'Falar de regulação da internet sem citar o Marco Civil ou a LGPD nominalmente.',
    relatedTerms: ['Biopolítica', 'Indústria Cultural', 'Competência 2'],
    difficultyLevel: 'Avançado',
    authorOrSource: 'Legislação Federal Brasileira (2014 / 2018)'
  },
  {
    id: 'agenda-2030-ods-onu',
    term: 'Agenda 2030 e os ODS da ONU',
    category: 'legislacao',
    competencyTag: 'C2',
    shortDefinition: 'Plano de ação global composto por 17 Objetivos de Desenvolvimento Sustentável para erradicar a pobreza, proteger o planeta e garantir paz e prosperidade.',
    fullDefinition: 'Os 17 ODS abrangem: ODS 1 (Erradicação da Pobreza), ODS 2 (Fome Zero e Agricultura Sustentável), ODS 3 (Saúde e Bem-Estar), ODS 4 (Educação de Qualidade), ODS 5 (Igualdade de Gênero), ODS 6 (Água Potável e Saneamento), ODS 10 (Redução das Desigualdades), ODS 13 (Ação contra a Mudança Global do Clima), entre outros.',
    inepCriteriaContext: 'Repertório contemporâneo de altíssima legitimidade internacional, altamente valorizado pelos avaliadores do INEP.',
    repertoireApplication: 'Pode ser articulado para demonstrar o compromisso que o Brasil assumiu perante a comunidade internacional e o atraso no cumprimento das metas.',
    practicalExample: '"A Agenda 2030 da ONU estabelece, em seu Objetivo de Desenvolvimento Sustentável 2, a erradicação da fome e o fomento à segurança alimentar. Entretanto, no contexto brasileiro, o desperdício sistêmico retarda a consecução dessa meta."',
    commonMistakeWarning: 'Citar o ODS sem especificar o seu número ou o seu conteúdo correspondente.',
    relatedTerms: ['DUDH da ONU', 'Constituição Federal de 1988'],
    difficultyLevel: 'Avançado',
    authorOrSource: 'Cúpula das Nações Unidas sobre Desenvolvimento Sustentável (2015)'
  },

  // ==========================================
  // LITERATURA BRASILEIRA & OBRAS CULTURAIS (REPERTÓRIO)
  // ==========================================
  {
    id: 'vidas-secas-graciliano',
    term: '"Vidas Secas" (Graciliano Ramos, 1938)',
    category: 'literatura_cultura',
    competencyTag: 'C2',
    shortDefinition: 'Clássico do Modernismo brasileiro (2ª fase) que retrata a desumanização, a mudez social e a miséria de uma família de retirantes no sertão nordestino.',
    fullDefinition: 'A obra expõe o drama de Fabiano, Sinhá Vitória e seus filhos, que vivem sob o jugo da seca e da exploração dos proprietários de terras. Pela falta de instrução formal e exclusão social, Fabiano se enxerga como um "bicho", incapaz de articular palavras para reivindicar seus direitos.',
    inepCriteriaContext: 'Repertório literário emblemático para temas sobre analfabetismo, insegurança alimentar, seca/mudanças climáticas, exclusão linguística e invisibilidade social.',
    repertoireApplication: 'Pode ser utilizado para ilustrar como a carência educacional e a pobreza extrema retiram a dignidade e a voz do indivíduo.',
    practicalExample: '"Na clássica obra \'Vidas Secas\', de Graciliano Ramos, a personagem Fabiano é retratada em constante processo de desumanização pela mudez imposta pela falta de letramento. Fora da ficção, a ausência de registro civil perpetua essa mesma condição de invisibilidade."',
    commonMistakeWarning: 'Resumir o enredo do livro sem traçar o paralelo analítico com a realidade brasileira atual.',
    relatedTerms: ['Quarto de Despejo', 'Cidadão de Papel', 'Repertório Produtivo'],
    difficultyLevel: 'Fundamental',
    authorOrSource: 'Graciliano Ramos (1892–1953) - Literatura Brasileira'
  },
  {
    id: 'quarto-de-despejo-carolina',
    term: '"Quarto de Despejo: Diário de uma Favelada" (Carolina Maria de Jesus, 1960)',
    category: 'literatura_cultura',
    competencyTag: 'C2',
    shortDefinition: 'Relato autobiográfico contundente sobre a fome, o cotidiano da favela do Canindé e a exclusão socioeconômica no Brasil urbano.',
    fullDefinition: 'Carolina Maria de Jesus narra com crueza poética a luta diária de uma mãe catadora de papel para alimentar seus filhos. A autora metaforiza a favela como o "quarto de despejo" da cidade, onde a sociedade dominante joga os indivíduos que não deseja enxergar.',
    inepCriteriaContext: 'Repertório legitimado de enorme prestígio acadêmico e literário, com forte apelo crítico em redações nota 1000.',
    repertoireApplication: 'Excepcional para temas sobre fome, moradia, saneamento básico, invisibilidade da mulher negra e desigualdade urbana.',
    practicalExample: '"Em \'Quarto de Despejo\', a escritora Carolina Maria de Jesus compara a favela ao cômodo onde a cidade esconde os seus rejeitados, denunciando a fome como uma violência cotidiana. Analogamente, o deficit habitacional contemporâneo reflete essa segregação espacial persistente."',
    commonMistakeWarning: 'Escrever o nome da autora incorretamente ou deixar de mencionar o título completo da obra.',
    relatedTerms: ['Vidas Secas', 'O Cortiço', 'C2'],
    difficultyLevel: 'Nota 1000',
    authorOrSource: 'Carolina Maria de Jesus (1914–1977) - Literatura Testemunhal'
  },
  {
    id: 'o-cortico-aluisio',
    term: '"O Cortiço" (Aluísio Azevedo, 1890)',
    category: 'literatura_cultura',
    competencyTag: 'C2',
    shortDefinition: 'Obra expoente do Naturalismo brasileiro que explora o determinismo do meio, a degradação humana e a precarização das moradias coletivas.',
    fullDefinition: 'No romance, o ambiente insalubre e superlotado da habitação coletiva molda os comportamentos dos personagens, revelando as mazelas do processo de urbanização desordenada do Rio de Janeiro no final do século XIX.',
    inepCriteriaContext: 'Repertório perfeito para temas de urbanização, saneamento, epidemias, segregação socioespacial e especulação imobiliária.',
    repertoireApplication: 'Pode ser comparado à persistência de favelas desprovidas de infraestrutura no século XXI.',
    practicalExample: '"Na narrativa naturalista \'O Cortiço\', de Aluísio Azevedo, o espaço habitacional degradado atua como catalisador da marginalização dos indivíduos. De modo análogo, a precariedade do saneamento básico no Brasil atual comprova que o meio ainda limita a qualidade de vida."',
    commonMistakeWarning: 'Confundir Naturalismo com Realismo ou falar de determinismo biológico em temas inadequados.',
    relatedTerms: ['Quarto de Despejo', 'Capitães da Areia'],
    difficultyLevel: 'Avançado',
    authorOrSource: 'Aluísio Azevedo (1857–1913) - Naturalismo Brasileiro'
  },
  {
    id: 'capitaes-da-areia-amado',
    term: '"Capitães da Areia" (Jorge Amado, 1937)',
    category: 'literatura_cultura',
    competencyTag: 'C2',
    shortDefinition: 'Romance do Modernismo baiano que denuncia o abandono, a criminalização e a vulnerabilidade de um grupo de menores de rua em Salvador.',
    fullDefinition: 'Jorge Amado humaniza os meninos liderados por Pedro Bala, demonstrando que a delinquência juvenil é fruto direto do abandono familiar, da ausência de escolas e da violência policial, e não de uma maldade inata.',
    inepCriteriaContext: 'Repertório produtivo para discutir a delinquência juvenil, evasão escolar, falta de acolhimento institucional e violência urbana.',
    repertoireApplication: 'Excelente contraponto ao ECA para demonstrar o que acontece quando o Estado falha na proteção da infância.',
    practicalExample: '"No romance \'Capitães da Areia\', de Jorge Amado, a trajetória de crianças marginalizadas expõe o abandono institucional como raiz da criminalidade juvenil. Decorridas décadas da publicação, a negligência com jovens em situação de rua ainda espelha esse cenário ficcional."',
    commonMistakeWarning: 'Romantizar a criminalidade em vez de focar na falha das políticas públicas educacionais e sociais.',
    relatedTerms: ['ECA', 'Vidas Secas', 'C3'],
    difficultyLevel: 'Fundamental',
    authorOrSource: 'Jorge Amado (1912–2001) - Literatura Brasileira'
  }
];

export const GLOSSARY_FLASHCARDS = [
  {
    id: 'fc-1',
    question: 'Qual é o critério exigido na C4 para conectivos interparágrafos para atingir 200 pontos?',
    answer: 'Presença obrigatória de conectivos interparágrafos em pelo menos DOIS momentos de transição textual (início do D2 e início da Conclusão).',
    category: 'C4: Coesão'
  },
  {
    id: 'fc-2',
    question: 'Quais são os 3 critérios de ouro para que um repertório atinja a nota máxima na Competência 2?',
    answer: '1. Legitimado (respaldado por área do saber formal); 2. Pertinente (ligado ao recorte temático); 3. Produtivo (articulado ao argumento do autor).',
    category: 'C2: Repertório'
  },
  {
    id: 'fc-3',
    question: 'O que caracteriza uma "Lacuna Argumentativa" na Competência 3?',
    answer: 'Quando o autor faz uma afirmação ou diagnóstico de problema mas deixa de explicar o COMO ou o POR QUÊ, criando um salto lógico sem comprovação.',
    category: 'C3: Argumentação'
  },
  {
    id: 'fc-4',
    question: 'Quais são os 5 elementos obrigatórios da proposta de intervenção na C5?',
    answer: '1. Agente (Quem); 2. Ação (O que); 3. Modo/Meio (Como); 4. Efeito (Para que); 5. Detalhamento (Especificação de um dos 4 anteriores). Cada um vale 40 pontos.',
    category: 'C5: Proposta'
  },
  {
    id: 'fc-5',
    question: 'Por que o verbo "implicar" no sentido de acarretar não admite a preposição "em" na C1?',
    answer: 'Porque é um verbo transitivo direto na norma culta padrão: escreve-se "isso implica problemas" e NUNCA "isso implica em problemas".',
    category: 'C1: Sintaxe'
  },
  {
    id: 'fc-6',
    question: 'O que o sociólogo Gilberto Dimenstein critica com o conceito de "Cidadão de Papel"?',
    answer: 'O abismo entre os direitos sociais garantidos na teoria pela Constituição de 1988 e a sua ineficácia na vida prática de milhões de brasileiros vulneráveis.',
    category: 'Repertório Sociológico'
  }
];
