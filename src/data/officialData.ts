import { Nota1000Sample, RepertoireItem, PracticeSnippetQuiz, CompetencyGuideInfo, KnowledgeAreaConfig, GeneratedThemeResponse } from '../types';
import { NOTA_1000_SAMPLES, isOfficialNota1000Benchmark, findMatchingOfficialSample } from './officialSamples';

export { NOTA_1000_SAMPLES, isOfficialNota1000Benchmark, findMatchingOfficialSample };

export const HISTORICAL_THEMES = [
  {
    year: '2025',
    title: 'Perspectivas acerca do envelhecimento na sociedade brasileira',
    axis: 'Demografia, Direitos e Saúde Pública',
    keyPoints: 'Transição demográfica acelerada, inversão da pirâmide etária, combate ao etarismo/idadismo, sustentabilidade da previdência e do SUS, efetivação do Estatuto da Pessoa Idosa e inclusão social ativa.',
  },
  {
    year: '2024',
    title: 'Desafios para a valorização da herança africana no Brasil',
    axis: 'Cultura e Sociedade / Diversidade Étnico-Racial',
    keyPoints: 'Legado histórico da escravidão, apagamento curricular, racismo estrutural, invisibilidade de personalidades negras, valorização além do folclore.',
  },
  {
    year: '2023',
    title: 'Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil',
    axis: 'Trabalho e Sociedade / Questões de Gênero',
    keyPoints: 'Trabalho de cuidado não remunerado/mal pago, dupla jornada feminina, naturalização patriarcal, impacto socioeconômico, falta de políticas públicas de suporte.',
  },
  {
    year: '2022',
    title: 'Desafios para a valorização de comunidades e povos tradicionais no Brasil',
    axis: 'Cidadania e Meio Ambiente / Direitos Humanos',
    keyPoints: 'Quilombolas, indígenas, ribeirinhos, ciganos; preservação de saberes ancestrais, conflito com exploração predatória, garantia de demarcação e direitos constitucionais.',
  },
  {
    year: '2021',
    title: 'Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil',
    axis: 'Cidadania e Direitos Civis',
    keyPoints: 'Milhares de não registrados, privação de direitos civis, políticos e sociais (SUS, escola, trabalho formal), papel do Estado em democratizar acesso a cartórios.',
  },
  {
    year: '2020',
    title: 'O estigma associado às doenças mentais na sociedade brasileira',
    axis: 'Saúde Pública e Cidadania',
    keyPoints: 'Preconceito e tabu sobre saúde mental, falta de empatia e conhecimento, desassistência de políticas públicas, papel da educação e conscientização.',
  },
  {
    year: '2019',
    title: 'Democratização do acesso ao cinema no Brasil',
    axis: 'Cultura, Lazer e Acessibilidade',
    keyPoints: 'Concentração em shoppings/grandes centros urbanos, preços inacessíveis, direito constitucional ao lazer e à cultura (Art. 215 CF/88), interiorização e democratização.',
  },
  {
    year: '2018',
    title: 'Manipulação do comportamento do usuário pelo controle de dados na internet',
    axis: 'Tecnologia, Informação e Democracia',
    keyPoints: 'Filtragem por algoritmos, bolhas informacionais, direcionamento de consumo e opiniões, ilusão de liberdade de escolha, necessidade de educação digital.',
  },
];

// Samples are loaded from officialSamples.ts
export const REPERTOIRE_DATABASE: RepertoireItem[] = [
  {
    id: 'rep-1',
    authorOrWork: 'Milton Santos (O Espaço do Cidadão)',
    conceptOrQuote: 'Cidadanias Mutiladas',
    area: 'Geografia',
    applicableAxes: ['Invisibilidade social', 'Acesso à documentação', 'Desigualdade urbana', 'Segregação espacial'],
    productiveUsageGuide: 'Explicar como a falta de documentação ou de serviços básicos reduz o indivíduo a uma cidadania mutilada, em que a lei existe na teoria mas não se consubstancia na prática.',
    pocketTrapWarning: 'Evitar citar Milton Santos de forma genérica ("há cidadania mutilada"). Explique de que maneira a exclusão específica do tema mutila a cidadania do grupo afetado.'
  },
  {
    id: 'rep-2',
    authorOrWork: 'Hannah Arendt (Eichmann em Jerusalém)',
    conceptOrQuote: 'Banalidade do Mal',
    area: 'Filosofia',
    applicableAxes: ['Naturalização da violência', 'Trabalho de cuidado invisível', 'Preconceito contra minorias'],
    productiveUsageGuide: 'Articular a teoria para demonstrar que a sociedade brasileira naturaliza a sobrecarga feminina no cuidado ou o preconceito racial por hábito histórico e acomodação burocrática.',
    pocketTrapWarning: 'Não usar como frase decorada para qualquer problema social; explique O PROCESSO de banalização daquela mazela em particular.'
  },
  {
    id: 'rep-3',
    authorOrWork: 'Florestan Fernandes (A Integração do Negro na Sociedade de Classes)',
    conceptOrQuote: 'Mito da Democracia Racial',
    area: 'Sociologia',
    applicableAxes: ['Herança africana', 'Desigualdade racial', 'Violência contra jovens negros'],
    productiveUsageGuide: 'Demostrar que a negação do racismo no imaginário popular impede políticas ativas de valorização do patrimônio e da herança afro-brasileira.',
    pocketTrapWarning: 'Não confunda a autoria (Florestan Fernandes desconstruiu o mito atribuído a interpretações de Gilberto Freyre).'
  },
  {
    id: 'rep-4',
    authorOrWork: 'Djamila Ribeiro (Pequeno Manual Antirracista)',
    conceptOrQuote: 'Lugar de Fala & Silenciamento Estrutural',
    area: 'Filosofia',
    applicableAxes: ['Racismo institucional', 'Povos tradicionais', 'Violência de gênero', 'Invisibilidade do cuidado'],
    productiveUsageGuide: 'Vincular a tese de que o silenciamento sobre saberes ancestrais negros e o trabalho de cuidado perpetua a desvalorização social.',
    pocketTrapWarning: 'Explique a conexão da teoria com a ação governamental e comunitária para superar o silenciamento.'
  },
  {
    id: 'rep-5',
    authorOrWork: 'Constituição Federal de 1988 (Art. 1º, 5º, 6º e 215)',
    conceptOrQuote: 'Dignidade da Pessoa Humana & Patrimônio Cultural',
    area: 'Legislação',
    applicableAxes: ['Cidadania', 'Saúde pública', 'Educação', 'Cultura', 'Minorias e trabalho'],
    productiveUsageGuide: 'Citar o artigo específico e demonstrar a contradição fática (paradoxo entre o asseguramento jurídico e a vulnerabilidade social prática).',
    pocketTrapWarning: 'Não cite a Constituição genericamente. Especifique o artigo ou princípio (ex: Art. 215 para cultura, Art. 6º para trabalho) e analise a ineficácia fática.'
  },
  {
    id: 'rep-6',
    authorOrWork: 'Carolina Maria de Jesus (Quarto de Despejo)',
    conceptOrQuote: 'Invisibilidade e Marginalização Social',
    area: 'Literatura',
    applicableAxes: ['Insegurança alimentar', 'Herança negra e racismo', 'Invisibilidade feminina'],
    productiveUsageGuide: 'Usar a trajetória de Carolina para ilustrar o apagamento das contribuições literárias e intelectuais de mulheres negras no país.',
    pocketTrapWarning: 'Contextualize a obra e não use apenas como enfeite poético; analise a dinâmica social revelada pelo livro.'
  },
  {
    id: 'rep-7',
    authorOrWork: 'Jürgen Habermas (Teoria do Agir Comunicativo)',
    conceptOrQuote: 'Esfera Pública & Democracia Deliberativa',
    area: 'Filosofia',
    applicableAxes: ['Manipulação na internet', 'Acesso à informação', 'Participação política'],
    productiveUsageGuide: 'Demonstrar que o controle algorítmico de dados ou a exclusão de grupos vulneráveis mina o debate público e a emancipação cidadã.',
    pocketTrapWarning: 'Evite definições vagas; explique como a distorção comunicativa afeta o problema em análise.'
  },
  {
    id: 'rep-8',
    authorOrWork: 'Sérgio Buarque de Holanda (Raízes do Brasil)',
    conceptOrQuote: 'Homem Cordial & Patrimonialismo',
    area: 'História',
    applicableAxes: ['Corrupção', 'Inoperância estatal', 'Desrespeito às leis públicas'],
    productiveUsageGuide: 'Explicar a sobreposição dos interesses privados e afetivos sobre a esfera pública institucional no Brasil.',
    pocketTrapWarning: 'Lembre-se de que "cordial" vem de "cor" (coração/emoção), não significando que o brasileiro é necessariamente gentil ou educado.'
  },
  {
    id: 'rep-9',
    authorOrWork: 'Simone de Beauvoir (A Velhice)',
    conceptOrQuote: 'Marginalização e Conspiração do Silêncio sobre a Terceira Idade',
    area: 'Filosofia',
    applicableAxes: ['Envelhecimento da população', 'Etarismo', 'Dignidade humana', 'Trabalho e aposentadoria'],
    productiveUsageGuide: 'Demonstrar como a sociedade capitalista e produtivista tende a invisibilizar e descartar indivíduos que já não atendem ao ritmo do mercado de trabalho.',
    pocketTrapWarning: 'Não reduza a citação a um mero lamento; relacione criticamente o utilitarismo socioeconômico com a falta de suporte institucional a idosos no Brasil.'
  },
  {
    id: 'rep-10',
    authorOrWork: 'Estatuto da Pessoa Idosa (Lei Federal nº 10.741/2003 & Art. 230 da CF/88)',
    conceptOrQuote: 'Princípio da Prioridade Absoluta e Proteção Integral',
    area: 'Legislação',
    applicableAxes: ['Envelhecimento populacional', 'Saúde preventiva no SUS', 'Acessibilidade urbana', 'Combate ao abandono'],
    productiveUsageGuide: 'Evidenciar o contraste entre a proteção jurídica integral assegurada em lei e a precariedade fática de centros-dia, cuidadores e acolhimento nas cidades brasileiras.',
    pocketTrapWarning: 'Especifique a garantia legal concreta (como o direito a acompanhante no SUS, transporte ou acolhimento) em vez de citar a lei de forma vazia.'
  }
];

export const PRACTICE_SNIPPETS: PracticeSnippetQuiz[] = [
  {
    id: 'ps-1',
    competencyFocus: 'Competência 1 (Estrutura Sintática)',
    snippet: 'O Poder Público precisa agir com urgência. Criando projetos nas escolas que valorizem a cultura afro-brasileira.',
    options: [
      'Configura um truncamento de período por isolamento indevido de oração subordinada reduzida de gerúndio da sua oração principal.',
      'Apresenta estrutura sintática perfeita, visto que o ponto final antes de formas nominais de gerúndio é de uso facultativo no padrão culto.',
      'Classifica-se como desvio clássico de regência verbal e pontuação oracional, sem prejuízo direto à estrutura sintática formal do texto.',
      'Caracteriza-se como erro de concordância nominal e justaposição de orações coordenadas assindéticas sem o conectivo aditivo obrigatório.'
    ],
    correctOptionIndex: 0,
    explanation: 'Conforme o Módulo 3 do INEP, orações subordinadas ou gerundiais isoladas por ponto final constituem "truncamento de período", contabilizado diretamente como falha de estrutura sintática que derruba a nota da C1.',
    improvedSnippet: 'O Poder Público precisa agir com urgência, criando projetos nas escolas que valorizem a cultura afro-brasileira.'
  },
  {
    id: 'ps-2',
    competencyFocus: 'Competência 2 (Repertório Sociocultural)',
    snippet: 'Na obra "Utopia", de Thomas More, retrata-se uma sociedade perfeita e justa. No entanto, no Brasil isso não ocorre, pois a herança africana ainda é desvalorizada.',
    options: [
      'Garante a nota máxima na C2 (200 pontos), pois a referência filosófica humanista clássica valida de forma autônoma a argumentação do autor.',
      'Constitui repertório ilegítimo pela banca do INEP, pois obras literárias ficcionais estrangeiras não são aceitas em redações dissertativas.',
      'Configura repertório de bolso desprovido de produtividade orgânica, pois a citação genérica não aprofunda o recorte temático específico.',
      'Configura tangenciamento temático compulsório, o que acarreta anulação automática de toda a redação por fuga aos textos motivadores.'
    ],
    correctOptionIndex: 2,
    explanation: 'A Cartilha Oficial do Participante do INEP cita expressamente que citações genéricas desconectadas da realidade concreta configuram repertório sem produtividade, limitando a Competência 2.',
    improvedSnippet: 'A filósofa Djamila Ribeiro, em "Pequeno Manual Antirracista", adverte que para transformar uma estrutura discriminatória é preciso tirá-la da invisibilidade. No Brasil contemporâneo, contudo, a herança africana permanece silenciada nas salas de aula.'
  },
  {
    id: 'ps-3',
    competencyFocus: 'Competência 5 (Proposta Condicional)',
    snippet: 'Se o Governo Federal investir em verbas públicas e as famílias colaborarem, os desafios do trabalho de cuidado diminuirão no Brasil.',
    options: [
      'Atinge a nota máxima de 200 pontos na C5, uma vez que articula dois agentes institucionais distintos em cooperação com a sociedade civil.',
      'Fica limitada ao Nível 2 (máximo de 80 pontos) na C5, pois a estrutura hipotética-condicional não configura intervenção afirmativa concreta.',
      'Recebe nota zero imediata na C5 por não detalhar expressamente as prerrogativas do Poder Judiciário nem indicar penalidades cabíveis.',
      'Alcança o Nível 4 (160 pontos) na C5, pois contém agente, ação, meio e efeito plenamente articulados ao debate dos direitos humanos.'
    ],
    correctOptionIndex: 1,
    explanation: 'A Grade Específica da Competência 5 do INEP estabelece a regra: "Estruturas condicionais (se... caso...) com 2 ou mais elementos válidos não devem ultrapassar o Nível 2 (80 pontos)".',
    improvedSnippet: 'Portanto, cabe ao Governo Federal — instância máxima de gestão pública — instituir políticas de suporte financeiro ao trabalho de cuidado, mediante destinação orçamentária no Plano Plurianual, a fim de valorizar as trabalhadoras.'
  },
  {
    id: 'ps-4',
    competencyFocus: 'Competência 4 (Operadores Interparágrafos)',
    snippet: 'Início dos parágrafos da redação:\n§1: "No cenário brasileiro contemporâneo..."\n§2: "De acordo com o sociólogo Zygmunt Bauman..."\n§3: "Além disso..."\n§4: "Portanto..."',
    options: [
      'Cumpre os requisitos para nota 200 na C4, visto que possui conectivos diversificados iniciando todos os parágrafos do texto dissertativo.',
      'Apresenta 4 operadores interparágrafos válidos segundo o INEP, dispensando o emprego de outros conectivos no interior dos períodos.',
      'Zera a Competência 4, pois o conector conclusivo "Portanto" é estritamente proibido pela banca no início do parágrafo de fechamento.',
      'Não assegura 200 pontos na C4 apenas pelo início: "De acordo com" no §2 é operador intraparágrafo, exigindo-se coesão interna ampla.'
    ],
    correctOptionIndex: 3,
    explanation: 'Para 200 pontos na C4 são necessários: no mínimo 2 operadores interparágrafos expressivos conectando parágrafos E coesão intraparágrafo em TODOS os parágrafos, sem repertório coesivo precário ou repetições excessivas.',
    improvedSnippet: 'Início do D2 com "Outrossim," ou "Ademais,", início da Conclusão com "Portanto," ou "Infere-se, portanto," acompanhados de rica diversidade de articuladores intraparágrafo.'
  },
  {
    id: 'ps-5',
    competencyFocus: 'Competência 1 (Justaposição de Orações)',
    snippet: 'A saúde pública no Brasil enfrenta graves impasses, a falta de médicos no interior agrava a vulnerabilidade social da população ribeirinha.',
    options: [
      'Apresenta falha estrutural por justaposição, pois duas orações completas e independentes foram separadas apenas por vírgula sem conectivo.',
      'Apresenta estrutura sintática irrepreensível, pois a vírgula é o recurso canônico prescrito pela norma para separar orações assindéticas.',
      'Constitui truncamento de período clássico na C1, visto que a segunda oração depende morfossintaticamente do predicado anterior para fazer sentido.',
      'Configura desvio pontual de regência nominal, sanável com a substituição da preposição "no" pela locução conjuntiva "em virtude de".'
    ],
    correctOptionIndex: 0,
    explanation: 'A justaposição ocorre quando duas orações completas com sentido pleno são unidas por vírgula sem conjunção ou ponto e vírgula, constituindo falha estrutural penalizada na C1.',
    improvedSnippet: 'A saúde pública no Brasil enfrenta graves impasses; com efeito, a carência de médicos no interior agrava a vulnerabilidade social da população ribeirinha.'
  },
  {
    id: 'ps-6',
    competencyFocus: 'Competência 3 (Lacuna Argumentativa / Autoria)',
    snippet: 'Historicamente, a desigualdade de gênero afeta o mercado de trabalho. Isso gera muitos prejuízos e o Estado deve solucionar o impasse.',
    options: [
      'Apresenta projeto de texto estratégico com excelente autoria, cumprindo todos os requisitos avaliativos da faixa de 200 pontos da C3.',
      'Apresenta cópia direta dos textos motivadores da proposta temática, incorrendo em desconsideração de linhas na contagem da banca.',
      'Apresenta lacuna argumentativa por superficialidade, pois aponta prejuízos genéricos sem desdobrar causas, evidências ou impactos concretos.',
      'Incorre em contradição lógica insolúvel entre os argumentos, o que rebaixa compulsoriamente o texto para o Nível 1 da Competência 3.'
    ],
    correctOptionIndex: 2,
    explanation: 'Na Competência 3, afirmações vagas e genéricas ("isso gera muitos problemas") sem desdobramento causal ou exemplificação geram lacuna argumentativa, rebaixando a nota para no máximo 120 pontos.',
    improvedSnippet: 'Historicamente, a desigualdade de gênero perpetua a precarização feminina no mercado de trabalho. Esse cenário se manifesta na disparidade salarial e na sobrecarga da dupla jornada, limitando a autonomia socioeconômica das mulheres.'
  },
  {
    id: 'ps-7',
    competencyFocus: 'Competência 5 (Detalhamento Válido)',
    snippet: 'Cabe ao Ministério da Educação criar campanhas de conscientização nas redes sociais para alertar os jovens sobre a importância do meio ambiente.',
    options: [
      'Garante 200 pontos na Competência 5, pois a menção às redes sociais já cumpre a exigência do detalhamento específico da ação estatal.',
      'Possui 4 elementos válidos (Agente, Ação, Meio e Efeito), carecendo do Detalhamento substantivo de um dos elementos para atingir 200 pontos.',
      'Apresenta apenas 2 elementos válidos (Agente e Efeito), pois campanhas de conscientização não são aceitas como ação válida pelo INEP.',
      'Recebe nota zero imediata na C5 por violar preceitos de Direitos Humanos ao delegar a responsabilidade educativa unicamente ao MEC.'
    ],
    correctOptionIndex: 1,
    explanation: 'Para 200 pontos na C5 são exigidos os 5 elementos: Agente, Ação, Meio/Modo, Efeito e Detalhamento (ex: explicitar a função institucional do órgão, o conteúdo temático da campanha ou a metodologia de veiculação).',
    improvedSnippet: 'Cabe ao Ministério da Educação — órgão responsável pelas diretrizes pedagógicas nacionais — criar campanhas pedagógicas veiculadas nas mídias sociais, a fim de conscientizar a juventude sobre a preservação ecológica.'
  },
  {
    id: 'ps-8',
    competencyFocus: 'Competência 1 (Regência e Crase)',
    snippet: 'O descaso governamental tende a levar à prejuízos irreparáveis a sociedade brasileira.',
    options: [
      'Apresenta sintaxe e ortografia adequadas, sendo a crase antes de vocábulos no plural facultativa na norma culta contemporânea.',
      'Possui desvio de crase proibida antes de masculino no plural ("à prejuízos") e omissão de crase devida na regência do verbo ("à sociedade").',
      'Contém erro exclusivo de concordância verbal entre o adjunto adverbial de modo e o núcleo do predicado composto da oração principal.',
      'Configura falha de estrutura sintática por inversão indevida dos complementos verbais direto e indireto no período dissertativo.'
    ],
    correctOptionIndex: 1,
    explanation: 'Não há crase antes de termos masculinos ("a prejuízos"), mas o verbo "levar a" associado ao substantivo feminino "a sociedade" exige o acento indicativo de crase ("levar a + a sociedade = à sociedade").',
    improvedSnippet: 'O descaso governamental tende a levar a prejuízos irreparáveis à sociedade brasileira.'
  },
  {
    id: 'ps-9',
    competencyFocus: 'Competência 2 (Repertório Produtivo e Articulação)',
    snippet: 'Segundo Gilberto Dimenstein, em "O Cidadão de Papel", a legislação assegura direitos que não se concretizam na prática. Essa realidade é visível na precariedade do saneamento básico, que priva milhões de brasileiros da dignidade garantida pela Carta Magna.',
    options: [
      'Configura repertório de bolso superficial, pois o autor não pertence à tradição da sociologia acadêmica clássica europeia.',
      'Apresenta repertório legitimado, pertinente e estritamente produtivo, pois vincula a teoria sociológica ao tema e à tese do autor.',
      'Incorre em tangenciamento temático, pois a citação da Carta Magna anula a pertinência do conceito de Dimenstein na redação.',
      'Configura cópia disfarçada dos textos motivadores, impossibilitando a pontuação na faixa superior de 160 a 200 pontos da C2.'
    ],
    correctOptionIndex: 1,
    explanation: 'O repertório é legitimado (obra consagrada de Dimenstein), pertinente (relaciona cidadania formal à falta de serviços básicos) e produtivo (conecta a teoria diretamente à tese desenvolvida pelo participante).',
    improvedSnippet: 'Segundo Gilberto Dimenstein, em "O Cidadão de Papel", a legislação assegura direitos que não se concretizam na prática. Essa realidade é visível na precariedade do saneamento básico, que priva milhões de brasileiros da dignidade garantida pela Carta Magna.'
  },
  {
    id: 'ps-10',
    competencyFocus: 'Competência 4 (Conectivo Inadequado / Desvio de Sentido)',
    snippet: 'O envelhecimento populacional impõe desafios econômicos urgentes, portanto a falta de cuidadores capacitados agrava o abandono dos idosos.',
    options: [
      'Apresenta coesão textual perfeita com conectivo conclusivo formal, atendendo a todos os requisitos do Nível 5 da Competência 4.',
      'Possui desvio de pontuação oracional, pois conjunções coordenativas conclusivas não podem ser precedidas por vírgula em redações.',
      'Configura inadequação coesiva no uso de "portanto", pois estabelece relação de conclusão onde o sentido pretendido é de adição ou causa.',
      'Configura truncamento de período na C1, visto que o conectivo "portanto" não pode conectar duas orações de mesmo nível sintático.'
    ],
    correctOptionIndex: 2,
    explanation: 'O conector "portanto" expressa conclusão lógica entre premissas. No trecho, a falta de cuidadores não é uma conclusão do envelhecimento, mas sim um fator aditivo ou causal ("outrossim", "ademais" ou "ao passo que").',
    improvedSnippet: 'O envelhecimento populacional impõe desafios econômicos urgentes; outrossim, a escassez de cuidadores capacitados agrava a vulnerabilidade dos idosos.'
  },
  {
    id: 'ps-11',
    competencyFocus: 'Competência 3 (Tópico Frasal e Autoria no Desenvolvimento)',
    snippet: 'No Brasil, existem muitos idosos que sofrem com o abandono familiar. Além disso, muitos hospitais não têm vagas suficientes para todos.',
    options: [
      'Apresenta projeto de texto exemplar, pois delimita duas causas paralelas com vocabulário dissertativo refinado e autoral.',
      'Configura texto predominantemente expositivo e sem tópico frasal reflexivo, limitando o desenvolvimento argumentativo na C3.',
      'Zera a Competência 3 automaticamente por utilizar a expressão conjuntiva aditiva "Além disso" no interior do desenvolvimento.',
      'Apresenta repertório sociocultural produtivo implícito, dispensando a necessidade de citação nominal de filósofos ou leis.'
    ],
    correctOptionIndex: 1,
    explanation: 'O trecho apenas relata fatos de forma expositiva ("existem muitos idosos", "muitos hospitais não têm vagas") sem posicionamento crítico, tese reflexiva ou cadeia argumentativa de causa e consequência.',
    improvedSnippet: 'Em primeiro plano, cabe pontuar que a negligência afetiva e institucional vulnerabiliza a terceira idade no Brasil. Esse cenário reflete o utilitarismo social que descarta aqueles que deixam de ser economicamente produtivos.'
  },
  {
    id: 'ps-12',
    competencyFocus: 'Competência 5 (Detalhamento do Agente vs Meio)',
    snippet: 'Cabe ao Ministério da Saúde — órgão responsável pela gestão do SUS — ampliar os leitos geriátricos, mediante verbas orçamentárias, a fim de garantir atendimento digno aos idosos.',
    options: [
      'Contém apenas 3 elementos válidos na C5, pois apostos explicativos entre travessões não são aceitos pela banca como detalhamento.',
      'Atinge a nota máxima de 200 pontos na C5, pois articula Agente com Detalhamento explicativo, Ação, Meio/Modo e Efeito explícito.',
      'Fica limitada a 120 pontos na C5 pela ausência de penalidades judiciais estipuladas contra a negligência dos hospitais privados.',
      'Recebe nota zero imediata por desrespeitar os Direitos Humanos ao focar o atendimento prioritário unicamente na população idosa.'
    ],
    correctOptionIndex: 1,
    explanation: 'A proposta contém os 5 elementos formais completos: 1. Agente (Ministério da Saúde), 2. Detalhamento do Agente ("órgão responsável pela gestão do SUS"), 3. Ação ("ampliar os leitos geriátricos"), 4. Meio ("mediante verbas orçamentárias") e 5. Efeito ("a fim de garantir atendimento digno...").',
    improvedSnippet: 'Cabe ao Ministério da Saúde — órgão responsável pela gestão do SUS — ampliar os leitos geriátricos, mediante verbas orçamentárias federais, a fim de garantir atendimento digno e humanizado aos idosos.'
  },
  {
    id: 'ps-13',
    competencyFocus: 'Competência 1 (Paralelismo Sintático)',
    snippet: 'O projeto visa à conscientização dos jovens e combater a evasão escolar no Ensino Médio.',
    options: [
      'Apresenta quebra de paralelismo sintático na C1, ao coordenar um substantivo regido de preposição ("à conscientização") com uma oração infinitiva ("combater").',
      'Apresenta concordância nominal e verbal perfeita, pois verbos no infinitivo podem coordenar livremente com substantivos femininos.',
      'Constitui desvio exclusivo de regência verbal do termo "visa", o qual na norma padrão não admite a presença da preposição "a".',
      'Configura erro crasso de justaposição de orações, exigindo a inclusão de ponto e vírgula antes da conjunção aditiva coordenativa "e".'
    ],
    correctOptionIndex: 0,
    explanation: 'Ao coordenar elementos ligados pela conjunção "e", deve-se manter a simetria sintática: ou dois substantivos regidos de preposição ("visa à conscientização... e ao combate...") ou dois verbos no infinitivo ("visa a conscientizar... e a combater...").',
    improvedSnippet: 'O projeto visa à conscientização dos jovens e ao combate à evasão escolar no Ensino Médio.'
  },
  {
    id: 'ps-14',
    competencyFocus: 'Competência 4 (Conectivo "Onde" para Contextos Não Físicos)',
    snippet: 'O país vivencia uma crise estrutural, onde os cidadãos mais vulneráveis têm seus direitos negligenciados cotidianamente.',
    options: [
      'Possui emprego adequado do pronome relativo "onde", perfeitamente admitido na norma culta para retomar substantivos abstratos como "crise".',
      'Apresenta inadequação coesiva no uso do pronome relativo "onde", que na norma padrão formal deve restringir-se estritamente à referência a lugares físicos.',
      'Configura truncamento de período na C1, exigindo a substituição do pronome relativo por uma conjunção consecutiva com sentido de causa.',
      'Constitui quebra de paralelismo sintático e concordância verbal entre o sujeito coletivo "país" e o predicativo composto da oração subordinada.'
    ],
    correctOptionIndex: 1,
    explanation: 'Na norma culta exigida no ENEM, o pronome relativo "onde" só pode ser utilizado para retomar substantivos que designem espaço ou lugar físico concreto. Para conceitos abstratos ("crise", "situação", "sociedade"), deve-se usar "em que", "no qual" ou "na qual".',
    improvedSnippet: 'O país vivencia uma crise estrutural, em que os cidadãos mais vulneráveis têm seus direitos negligenciados cotidianamente.'
  }
];

export const OFFICIAL_COMPETENCIES_INFO: CompetencyGuideInfo[] = [
  {
    number: 1,
    title: 'Domínio da Norma Culta e Estrutura Sintática',
    description: 'Avalia se o participante domina a modalidade escrita formal da Língua Portuguesa, observando a estrutura sintática (orações completas, ausência de truncamentos ou justaposições) e desvios gramaticais/ortográficos.',
    levels: [
      { level: 5, score: 200, description: 'Estrutura sintática excelente (no máximo 1 falha) E no máximo 2 desvios gramaticais/convenções de escrita.' },
      { level: 4, score: 160, description: 'Estrutura sintática boa (poucas falhas) E poucos desvios.' },
      { level: 3, score: 120, description: 'Estrutura sintática regular E alguns desvios.' },
      { level: 2, score: 80, description: 'Estrutura sintática deficitária OU muitos desvios.' },
      { level: 1, score: 40, description: 'Estrutura sintática deficitária com muitos desvios.' },
      { level: 0, score: 0, description: 'Desconhecimento da modalidade escrita formal.' }
    ],
    commonMistakes: [
      'Truncamento de período (separar orações subordinadas ou gerúndios com ponto final)',
      'Justaposição (emendar duas orações completas apenas com vírgula)',
      'Desvios de concordância verbal e nominal com sujeitos pospostos ou coletivos',
      'Regência inadequada (ex: "assistir o filme" em vez de "assistir ao filme")',
      'Uso incorreto da crase antes de verbos ou palavras masculinas'
    ],
    keyTips: [
      'Revise o texto procurando períodos que começam com "Sendo assim,", "Criando...", "Onde..." sem oração principal.',
      'Varie a estrutura das frases usando orações intercaladas entre vírgulas ou travessões.',
      'Mantenha no máximo 2 desvios em toda a folha para garantir 200 pontos.'
    ]
  },
  {
    number: 2,
    title: 'Compreensão do Tema e Repertório Sociocultural Produtivo',
    description: 'Avalia a compreensão da proposta de redação, a aplicação de conceitos de várias áreas do conhecimento (repertório legitimado e produtivo) e a obediência ao tipo dissertativo-argumentativo.',
    levels: [
      { level: 5, score: 200, description: 'Desenvolve o tema por meio de argumentação consistente, a partir de um repertório sociocultural produtivo e apresenta excelente domínio do texto dissertativo-argumentativo.' },
      { level: 4, score: 160, description: 'Desenvolve o tema por meio de argumentação consistente e apresenta bom domínio do texto dissertativo-argumentativo, com repertório legitimado e pertinente ao tema.' },
      { level: 3, score: 120, description: 'Desenvolve o tema por meio de argumentação previsível e apresenta domínio mediano do texto dissertativo-argumentativo, com repertório baseado nos textos motivadores.' },
      { level: 2, score: 80, description: 'Recorre à cópia de trechos dos textos motivadores OU desenvolve de forma tangencial o tema.' },
      { level: 1, score: 40, description: 'Apresenta o assunto, tangenciando o tema, ou demonstra domínio precário do tipo textual.' },
      { level: 0, score: 0, description: 'Fuga total ao tema OU não obediência ao tipo dissertativo-argumentativo.' }
    ],
    commonMistakes: [
      'Tangenciamento do tema (falar de "racismo" e esquecer de "desafios da valorização da herança africana")',
      'Repertório de Bolso (citar Bauman ou Thomas More de forma decorativa sem vincular ao problema)',
      'Repertório ilegítimo (citar "pesquisa de Harvard" sem base real ou frase atribuída erroneamente)',
      'Copiar dados dos textos motivadores sem acrescentar repertório externo legitimado'
    ],
    keyTips: [
      'Garantir a fórmula de 4 etapas: Repertório -> Argumento -> Tese -> Tema.',
      'Sempre explicite todos os núcleos da frase temática já na introdução.',
      'Mobilize autores legitimados (filosofia, sociologia, história, literatura ou leis).'
    ]
  },
  {
    number: 3,
    title: 'Projeto de Texto e Desenvolvimento Argumentativo (Autoria)',
    description: 'Avalia a capacidade de selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos em defesa de um ponto de vista com indícios claros de autoria.',
    levels: [
      { level: 5, score: 200, description: 'Apresenta projeto de texto estratégico, com desenvolvimento consistente dos argumentos em todo o texto e com indícios de autoria.' },
      { level: 4, score: 160, description: 'Apresenta projeto de texto com poucas falhas e desenvolve a maior parte das ideias apresentadas.' },
      { level: 3, score: 120, description: 'Apresenta projeto de texto com algumas falhas e desenvolve algumas ideias de forma superficial.' },
      { level: 2, score: 80, description: 'Apresenta projeto de texto com muitas falhas e ideias desarticuladas, ou apenas 1 ideia desenvolvida.' },
      { level: 1, score: 40, description: 'Apresenta informações, fatos e opiniões pouco relacionados ao tema e sem direção argumentativa.' },
      { level: 0, score: 0, description: 'Apresenta informações desconexas que não defendem nenhum ponto de vista.' }
    ],
    commonMistakes: [
      'Lacuna argumentativa (apresentar uma ideia na introdução e não desenvolvê-la no D1 ou D2)',
      'Contradição entre os parágrafos de desenvolvimento',
      'Argumentação expositiva (apenas contar uma história sem posicionamento crítico)',
      'Falta de tópico frasal claro no início dos desenvolvimentos'
    ],
    keyTips: [
      'Defina na introdução as duas teses/causas que serão desenvolvidas (D1 e D2).',
      'Estruture cada desenvolvimento com: Tópico Frasal -> Repertório -> Causa -> Consequência Crítica -> Fechamento.',
      'Não deixe nenhuma afirmação sem explicação do "porquê" e do "com que impacto".'
    ]
  },
  {
    number: 4,
    title: 'Coesão Textual e Mecanismos Linguísticos',
    description: 'Avalia o conhecimento dos mecanismos linguísticos necessários para a construção da argumentação, incluindo o uso de operadores interparágrafos e intraparágrafos sem repetições excessivas.',
    levels: [
      { level: 5, score: 200, description: 'Presença expressiva de operadores interparágrafos (mínimo 2) e coesivos intraparágrafos em todos os parágrafos, com raras repetições e sem inadequações.' },
      { level: 4, score: 160, description: 'Presença constante de recursos coesivos, com poucas repetições e poucas inadequações.' },
      { level: 3, score: 120, description: 'Presença regular de recursos coesivos, com algumas repetições e algumas inadequações.' },
      { level: 2, score: 80, description: 'Presença insuficiente de recursos coesivos, com repetições frequentes e/ou inadequações.' },
      { level: 1, score: 40, description: 'Presença precária de recursos coesivos.' },
      { level: 0, score: 0, description: 'Texto monobloco ou ausência total de elementos coesivos.' }
    ],
    commonMistakes: [
      'Iniciar D2 ou Conclusão sem operador interparágrafo autêntico (ex: começar com "O Governo deve...")',
      'Repetição excessiva da mesma palavra (ex: "sociedade", "problema", "onde")',
      'Uso incorreto do pronome "onde" para situações que não são lugares físicos',
      'Uso inadequado de conectivos (ex: usar "entretanto" com sentido de adição)'
    ],
    keyTips: [
      'Use operadores interparágrafos expressivos: "Outrossim,", "Ademais,", "Nessa perspectiva,", "Infere-se, portanto,".',
      'Distribua conectivos dentro de TODOS os períodos de cada parágrafo.',
      'Substitua substantivos repetidos por pronomes anafóricos ou sinônimos sofisticados.'
    ]
  },
  {
    number: 5,
    title: 'Proposta de Intervenção e Direitos Humanos',
    description: 'Avalia a elaboração de proposta de intervenção para o problema abordado, que respeite os Direitos Humanos e contenha os 5 elementos oficiais: Agente, Ação, Meio/Modo, Efeito e Detalhamento.',
    levels: [
      { level: 5, score: 200, description: 'Elabora muito bem proposta de intervenção, detalhada, articulada à discussão e contendo os 5 elementos obrigatórios válidos.' },
      { level: 4, score: 160, description: 'Elabora bem proposta de intervenção com 4 elementos válidos.' },
      { level: 3, score: 120, description: 'Elabora proposta de intervenção com 3 elementos válidos.' },
      { level: 2, score: 80, description: 'Elabora proposta de intervenção com 2 elementos válidos OU proposta com estrutura condicional.' },
      { level: 1, score: 40, description: 'Elabora proposta de intervenção com apenas 1 elemento válido.' },
      { level: 0, score: 0, description: 'Não apresenta proposta de intervenção OU apresenta proposta que desrespeita os Direitos Humanos.' }
    ],
    commonMistakes: [
      'Ação nula ou vaga (ex: "é preciso tomar providências", "a sociedade precisa se conscientizar")',
      'Agente nulo (ex: "alguém precisa fazer algo")',
      'Falta de detalhamento específico (não acrescentar explicação extra a um dos 4 elementos)',
      'Usar estrutura condicional ("Se o Estado fizer x...") que limita a nota a 80 pontos',
      'Violar os Direitos Humanos (excluir direitos, pregar violência ou justiça com as próprias mãos)'
    ],
    keyTips: [
      'Garantir os 5 elementos claros: QUEM faz (Agente + Detalhe), O QUE faz (Ação afirmativa), COMO faz (Meio/Modo com "por meio de"), PARA QUE faz (Efeito com "a fim de").',
      'Use o detalhamento do Agente ("órgão federal responsável por coordenar a educação nacional").',
      'Finalize com uma frase de fechamento circular que retoma o repertório da introdução.'
    ]
  }
];

export const KNOWLEDGE_AREAS_CONFIG: KnowledgeAreaConfig[] = [
  {
    id: 'meio_ambiente',
    name: 'Meio Ambiente & Sustentabilidade',
    description: 'Crise climática, biomas brasileiros, segurança hídrica, descarte de resíduos e transição energética.',
    iconName: 'Leaf',
    color: 'emerald',
    exampleTopics: ['Crise hídrica e seca', 'Desmatamento e bioeconomia', 'Lixo eletrônico', 'Justiça climática']
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia & Sociedade Digital',
    description: 'Inteligência artificial, proteção de dados, dependência digital de jovens e exclusão digital.',
    iconName: 'Cpu',
    color: 'indigo',
    exampleTopics: ['IA no mercado de trabalho', 'Algoritmos e polarização', 'Cibersegurança e golpes', 'Letramento digital']
  },
  {
    id: 'saude',
    name: 'Saúde Pública & Bem-Estar',
    description: 'Saúde mental, vacinação, SUS, prevenção a epidemias, sedentarismo e saúde materno-infantil.',
    iconName: 'HeartPulse',
    color: 'rose',
    exampleTopics: ['Ansiedade entre jovens', 'Hesitação vacinal', 'Acesso a tratamentos raros', 'Doação de órgãos']
  },
  {
    id: 'educacao',
    name: 'Educação & Cidadania',
    description: 'Evasão escolar, educação financeira, formação de professores, inclusão e alfabetização na idade certa.',
    iconName: 'GraduationCap',
    color: 'amber',
    exampleTopics: ['Evasão no Ensino Médio', 'Inclusão neurodivergente', 'Valorização docente', 'Educação midiática']
  },
  {
    id: 'sociedade',
    name: 'Sociedade, Minorias & Direitos Humanos',
    description: 'População de rua, infância vulnerável, acessibilidade para PcD, combate ao etarismo e igualdade racial.',
    iconName: 'Users',
    color: 'violet',
    exampleTopics: ['Pessoas em situação de rua', 'Etarismo no Brasil', 'Acessibilidade urbana', 'Violência contra a mulher']
  },
  {
    id: 'cultura',
    name: 'Cultura, Memória & Identidade',
    description: 'Patrimônio histórico, literatura nacional, línguas indígenas, descentralização de incentivos culturais.',
    iconName: 'Sparkles',
    color: 'cyan',
    exampleTopics: ['Preservação do patrimônio', 'Povos originários', 'Incentivo à leitura', 'Cultura periférica']
  },
  {
    id: 'economia',
    name: 'Economia, Trabalho & Futuro',
    description: 'Trabalho por plataformas, superendividamento, empreendedorismo juvenil e informalidade.',
    iconName: 'Briefcase',
    color: 'blue',
    exampleTopics: ['Uberização do trabalho', 'Superendividamento familiar', 'Primeiro emprego jovem', 'Reindustrialização']
  },
  {
    id: 'seguranca',
    name: 'Segurança Alimentar, Urbana & Ética',
    description: 'Combate à fome, segurança no trânsito, desperdício de alimentos e ressocialização prisional.',
    iconName: 'ShieldAlert',
    color: 'orange',
    exampleTopics: ['Fome e desperdício de comida', 'Violência no trânsito', 'Sistema prisional e reincidência', 'Intolerância religiosa']
  }
];

export const CURATED_THEME_PROPOSALS: GeneratedThemeResponse[] = [
  {
    id: 'theme-curated-1',
    title: 'Desafios para o enfrentamento da crise hídrica e a garantia da segurança hídrica no Brasil',
    axis: 'Meio Ambiente e Cidadania',
    areas: ['Meio Ambiente & Sustentabilidade', 'Sociedade, Minorias & Direitos Humanos'],
    socialProblem: 'Apesar de deter a maior reserva de água doce superficial do planeta, o Brasil enfrenta secas extremas, poluição de bacias hidrográficas, desperdício de até 40% na distribuição e severa desigualdade regional no acesso à água tratada, atingindo especialmente periferias e regiões do semiárido.',
    thematicCut: 'O participante deve discutir obrigatoriamente "desafios", "enfrentamento da crise hídrica" e a "segurança hídrica na realidade brasileira", sem restringir o texto apenas a secas no Nordeste ou poluição isolada de rios.',
    keywordsToCover: ['crise hídrica', 'segurança hídrica', 'desafios', 'desperdício/saneamento', 'Brasil'],
    motivatingTexts: [
      {
        id: 't1',
        number: 'I',
        title: 'Marco Legal do Saneamento e Constituição Federal',
        type: 'conceito_lei',
        content: 'O Artigo 225 da Constituição Federal de 1988 preconiza que "todos têm direito ao meio ambiente ecologicamente equilibrado, bem de uso comum do povo e essencial à sadia qualidade de vida". Paralelamente, o Novo Marco Legal do Saneamento Básico (Lei nº 14.026/2020) estabelece a meta de universalizar o abastecimento de água para 99% da população e a coleta de esgoto para 90% até 2033.',
        source: 'Constituição da República Federativa do Brasil e Diário Oficial da União.'
      },
      {
        id: 't2',
        number: 'II',
        title: 'Panorama das Perdas e Acesso à Água no Território Nacional',
        type: 'dados_estatistica',
        content: 'Segundo relatório do Instituto Trata Brasil (2024), mais de 33 milhões de brasileiros não possuem acesso regular a água potável tratada. Além disso, o índice nacional de perdas na distribuição atinge a alarmante marca de 37,8% — o equivalente a cerca de 7,8 mil piscinas olímpicas de água tratada desperdiçadas por dia antes de chegar às torneiras devido a vazamentos e fraudes na infraestrutura.',
        source: 'Instituto Trata Brasil / SNIS (Sistema Nacional de Informações sobre Saneamento).'
      },
      {
        id: 't3',
        number: 'III',
        title: 'A Mudança Climática e a Pressão sobre as Bacias Hidrográficas',
        type: 'social_noticia',
        content: 'O aumento da frequência de secas severas na bacia amazônica e na bacia do rio São Francisco expõe a vulnerabilidade hídrica do país. A degradação de matas ciliares, o desmatamento nas cabeceiras e a queima de combustíveis fósseis comprometem o regime dos chamados "rios voadores", alterando drasticamente o ciclo de chuvas no Centro-Sul e afetando o abastecimento urbano, a agricultura e a geração de energia elétrica.',
        source: 'Relatório Científico do CEMADEN / INPE.'
      },
      {
        id: 't4',
        number: 'IV',
        title: 'Água como Mercadoria versus Bem Comum',
        type: 'critica_reflexiva',
        content: '"Não há vida humana sem água, tampouco cidadania plena. Tratar a água apenas como insumo econômico ou mercadoria de livre exploração desconsidera sua dimensão como direito humano fundamental e patrimônio inegociável das gerações presentes e futuras."',
        source: 'Comentário Geral nº 15 do Comitê de Direitos Econômicos, Sociais e Culturais da ONU.'
      }
    ],
    suggestedTheses: {
      d1: 'A ineficiência e o atraso histórico na infraestrutura de saneamento público e conservação de bacias pelo poder público.',
      d2: 'A exploração predatória dos recursos hídricos associada ao desmatamento das nascentes e à negligência na gestão preventiva das mudanças climáticas.'
    },
    recommendedRepertoires: [
      {
        name: 'Gilberto Dimenstein ("O Cidadão de Papel")',
        area: 'Sociologia / Jornalismo',
        concept: 'Cidadania de Papel',
        howToApply: 'Demonstrar que o direito constitucional ao meio ambiente e à saúde (água potável) permanece no papel para milhões de brasileiros em comunidades desassistidas.'
      },
      {
        name: 'Ailton Krenak ("Ideias para Adiar o Fim do Mundo")',
        area: 'Filosofia Indígena',
        concept: 'Desconexão entre Humanidade e Natureza',
        howToApply: 'Argumentar que a visão mercantilista que trata os rios como meros depósitos de dejetos ou recursos infinitos culmina no esgotamento dos mananciais.'
      },
      {
        name: 'Hans Jonas ("O Princípio Responsabilidade")',
        area: 'Filosofia Ética',
        concept: 'Imperativo Ético para o Futuro',
        howToApply: 'Fundamentar o dever das gerações atuais em proteger os biomas e as águas para preservar a subsistência das futuras gerações.'
      }
    ],
    suggestedIntervention: {
      agent: 'Ministério do Meio Ambiente e Mudança do Clima, em articulação com a Agência Nacional de Águas e Saneamento Básico (ANA)',
      action: 'Implementar um Plano Nacional de Revitalização de Bacias Hidrográficas e Combate a Perdas na Distribuição',
      modeMedium: 'mediante a destinação de investimentos públicos prioritários para a substituição de tubulações obsoletas, recuperação de matas ciliares e incentivo a tecnologias de reuso de água',
      effect: 'a fim de assegurar a universalização do acesso à água potável e mitigar os impactos das secas nas regiões mais vulneráveis do Brasil',
      detailing: 'articulando comitês locais de bacia hidrográfica com participação direta das comunidades ribeirinhas e pequenos produtores rurais.'
    },
    commonTangentsWarning: 'Evite falar apenas de economia de água no banho individual sem problematizar o agronegócio, as perdas da rede de distribuição ou a omissão estatal. Não esqueça de vincular a crise ao contexto geopolítico e social brasileiro.',
    difficultyLevel: 'Padrão ENEM'
  },
  {
    id: 'theme-curated-2',
    title: 'Os impactos da inteligência artificial generativa na soberania e no mercado de trabalho brasileiro',
    axis: 'Tecnologia, Economia e Cidadania',
    areas: ['Tecnologia & Sociedade Digital', 'Economia, Trabalho & Futuro'],
    socialProblem: 'A rápida disseminação da inteligência artificial generativa intensifica o risco de substituição em massa de empregos formais e criativos, acentua a dependência tecnológica em relação a monopólios internacionais e aprofunda o abismo entre quem domina as ferramentas digitais e os trabalhadores em vulnerabilidade.',
    thematicCut: 'O estudante deve articular simultaneamente "inteligência artificial generativa", "mercado de trabalho" e "soberania/contexto brasileiro", sem focar apenas em ficção científica ou aspectos genéricos da internet.',
    keywordsToCover: ['inteligência artificial', 'mercado de trabalho', 'impactos/desafios', 'automação/soberania', 'Brasil'],
    motivatingTexts: [
      {
        id: 't1',
        number: 'I',
        title: 'Marco Regulatório da Inteligência Artificial (PL 2338/2023)',
        type: 'conceito_lei',
        content: 'O Projeto de Lei nº 2338/2023, em tramitação no Senado Federal brasileiro, visa estabelecer princípios, direitos e diretrizes para o desenvolvimento e uso ético da Inteligência Artificial no país, fixando que sistemas de alto risco devem respeitar a dignidade humana, a transparência algorítmica e a proteção contra a discriminação no ambiente de trabalho.',
        source: 'Senado Federal do Brasil / Comissão Especial de Inteligência Artificial.'
      },
      {
        id: 't2',
        number: 'II',
        title: 'Vulnerabilidade das Profissões à Automação no Brasil',
        type: 'dados_estatistica',
        content: 'Estudo do IPEA (Instituto de Pesquisa Econômica Aplicada) e da OIT aponta que até 54% dos empregos formais no Brasil apresentam algum grau de suscetibilidade a processos de automação e integração de IA generativa. No entanto, menos de 15% das empresas nacionais investem em programas de requalificação profissional de seus colaboradores.',
        source: 'IPEA / Organização Internacional do Trabalho (OIT).'
      },
      {
        id: 't3',
        number: 'III',
        title: 'Dependência Tecnológica e o Sul Global',
        type: 'social_noticia',
        content: 'A concentração dos grandes modelos de linguagem (LLMs) em poucas corporações transnacionais do Hemisfério Norte coloca desafios severos à soberania digital de nações como o Brasil. Sem desenvolvimento tecnológico nacional autônomo, o país corre o risco de tornar-se mero consumidor de dados e fornecedor de mão de obra barata para rotulagem algorítmica.',
        source: 'Revista Pesquisa FAPESP / Centro de Estudos da Sociedade da Informação.'
      },
      {
        id: 't4',
        number: 'IV',
        title: 'O Papel Humano na Era dos Algoritmos',
        type: 'critica_reflexiva',
        content: '"A máquina não deve ser uma ameaça ao homem, mas uma extensão de sua capacidade criadora. Quando a automação apenas visa o lucro precarizando a vida, o avanço técnico transforma-se em retrocesso social."',
        source: 'Reflexão sociológica sobre a Quarta Revolução Industrial.'
      }
    ],
    suggestedTheses: {
      d1: 'A lentidão do Estado brasileiro em formular políticas públicas de requalificação profissional e letramento digital voltadas às camadas vulneráveis.',
      d2: 'A dependência de tecnologias estrangeiras aliada à desregulamentação das relações laborais frente à automação irrestrita.'
    },
    recommendedRepertoires: [
      {
        name: 'Domenico De Masi ("O Futuro do Trabalho")',
        area: 'Sociologia do Trabalho',
        concept: 'Transformação das Funções Humanas',
        howToApply: 'Discutir que a tecnologia deveria libertar o indivíduo para atividades criativas e reflexivas, e não gerar descarte e angústia social.'
      },
      {
        name: 'Milton Santos ("Por uma Outra Globalização")',
        area: 'Geografia Crítica',
        concept: 'Tirania da Informação e do Dinheiro',
        howToApply: 'Apontar como a concentração algorítmica aprofunda a desigualdade entre países centrais e periféricos no cenário global.'
      },
      {
        name: 'Byung-Chul Han ("Psicopolítica / Infocracia")',
        area: 'Filosofia Contemporânea',
        concept: 'Submissão Voluntária ao Algoritmo',
        howToApply: 'Explicar a perda de autonomia crítica e a precarização psíquica dos trabalhadores na economia de dados.'
      }
    ],
    suggestedIntervention: {
      agent: 'Ministério da Ciência, Tecnologia e Inovação (MCTI), em conjunto com o Ministério do Trabalho e Emprego',
      action: 'Criar o Programa Nacional de Soberania em Inteligência Artificial e Requalificação Laboral',
      modeMedium: 'por meio de investimentos do FNDCT em centros de pesquisa públicos e oferta de cursos técnicos gratuitos em ferramentas de IA e computação nas escolas técnicas e institutos federais',
      effect: 'a fim de capacitar os trabalhadores brasileiros para a nova economia digital e evitar demissões em massa decorrentes da automação predatória',
      detailing: 'com cotas obrigatórias de vagas para jovens de baixa renda e trabalhadores de setores mais vulneráveis à substituição algorítmica.'
    },
    commonTangentsWarning: 'Não transforme a redação em uma apologia ou condenação moral cega da IA. O foco obrigatório é o impacto no trabalho e na sociedade do Brasil e a necessidade de regulamentação ética.',
    difficultyLevel: 'Desafiador / Inédito'
  },
  {
    id: 'theme-curated-3',
    title: 'A persistência da invisibilidade das pessoas em situação de rua nos centros urbanos do Brasil',
    axis: 'Sociedade, Cidadania e Direitos Humanos',
    areas: ['Sociedade, Minorias & Direitos Humanos', 'Saúde Pública & Bem-Estar'],
    socialProblem: 'O crescimento exponencial da população em situação de rua nas capitais brasileiras revela a falha das redes de assistência social, a carência habitacional, o preconceito higienista e a perda de dignidade humana de cidadãos que têm seus direitos básicos negados cotidianamente.',
    thematicCut: 'O participante deve abordar "a persistência", "invisibilidade", "pessoas em situação de rua" e "centros urbanos no Brasil", discutindo tanto as causas estruturais quanto a negligência social e estatal.',
    keywordsToCover: ['invisibilidade', 'pessoas em situação de rua', 'centros urbanos', 'persistência', 'direitos humanos'],
    motivatingTexts: [
      {
        id: 't1',
        number: 'I',
        title: 'Decreto nº 7.053/2009 e Política Nacional para a População em Situação de Rua',
        type: 'conceito_lei',
        content: 'A Política Nacional para a População em Situação de Rua institui como princípios fundamentais o respeito à dignidade da pessoa humana, o direito à convivência familiar e comunitária, a não discriminação e a garantia de acesso universal aos programas de saúde, moradia, trabalho e assistência social.',
        source: 'Presidência da República / Diário Oficial da União.'
      },
      {
        id: 't2',
        number: 'II',
        title: 'Crescimento da População de Rua no Brasil',
        type: 'dados_estatistica',
        content: 'Dados do IPEA (2023) apontam que mais de 281 mil pessoas vivem em situação de rua no Brasil, um aumento superior a 211% em relação à década anterior. Dentre essa população, 68% são pessoas negras e a imensa maioria não possui acesso a banheiros públicos adequados, documentação civil regular ou abrigo seguro.',
        source: 'IPEA (Instituto de Pesquisa Econômica Aplicada).'
      },
      {
        id: 't3',
        number: 'III',
        title: 'Aporofobia e Arquitetura Hostil nas Cidades',
        type: 'social_noticia',
        content: 'A promulgação da Lei Padre Júlio Lancellotti (Lei nº 14.489/2022) proibiu o emprego da chamada arquitetura hostil — como pedras pontiagudas, grades sob viadutos e bancos divididos para impedir que pessoas deitem. Contudo, intervenções higienistas e a aporofobia (rejeição e ódio aos pobres) persistem nas metrópoles.',
        source: 'Agência Brasil / Direitos Humanos.'
      },
      {
        id: 't4',
        number: 'IV',
        title: 'A Desumanização do Outro',
        type: 'critica_reflexiva',
        content: '"Passar pelo outro caído na calçada fingindo que ele não existe é a mais refinada técnica de cegueira moral da sociedade contemporânea. A indiferença urbana torna os seres humanos invisíveis antes mesmo de sua morte."',
        source: 'Zygmunt Bauman, em reflexões sobre a modernidade líquida.'
      }
    ],
    suggestedTheses: {
      d1: 'A ineficiência do déficit habitacional e a carência de políticas integradas de moradia e reinserção social pelo Estado.',
      d2: 'A naturalização da aporofobia e a indiferença social que perpetuam o preconceito higienista contra os mais vulneráveis.'
    },
    recommendedRepertoires: [
      {
        name: 'Carolina Maria de Jesus ("Quarto de Despejo")',
        area: 'Literatura Brasileira',
        concept: 'Marginalização e Fome na Periferia',
        howToApply: 'Evidenciar como a exclusão extrema descrita nos anos 1960 continua viva nas ruas das metrópoles brasileiras contemporâneas.'
      },
      {
        name: 'Adela Cortina ("Aporofobia, a Rejeição ao Pobre")',
        area: 'Filosofia Política',
        concept: 'Conceito de Aporofobia',
        howToApply: 'Explicar que a discriminação nas cidades não decorre apenas de nacionalidade ou etnia, mas da repulsa sistemática à condição de pobreza.'
      },
      {
        name: 'Zygmunt Bauman ("Cegueira Moral")',
        area: 'Sociologia',
        concept: 'Insensibilidade Moral e Banalização',
        howToApply: 'Demonstrar como a rotina acelerada das metrópoles anestesia a empatia da população diante do sofrimento alheio.'
      }
    ],
    suggestedIntervention: {
      agent: 'Ministério dos Direitos Humanos e da Cidadania, em parceria com o Ministério das Cidades e as Prefeituras Municipais',
      action: 'Expandir o programa "Moradia Primeiro" (Housing First) e criar centros integrados de acolhimento e capacitação',
      modeMedium: 'mediante a destinação de imóveis públicos ociosos para habitação social, concessão de auxílio-aluguel e oferta de cursos profissionalizantes com apoio psicossocial',
      effect: 'a fim de devolver a dignidade e promover a autonomia e reintegração socioeconômica das pessoas em situação de rua',
      detailing: 'garantindo atendimento médico multidisciplinar com equipes do programa Consultório na Rua do SUS.'
    },
    commonTangentsWarning: 'Não reduza o tema apenas a dependência química ou criminalidade. Trate a situação de rua como um problema complexo de direitos humanos, moradia, desemprego e dignidade.',
    difficultyLevel: 'Padrão ENEM'
  },
  {
    id: 'theme-curated-4',
    title: 'Caminhos para combater a epidemia de transtornos de ansiedade e depressão entre os jovens brasileiros',
    axis: 'Saúde Mental, Juventude e Educação',
    areas: ['Saúde Pública & Bem-Estar', 'Educação & Cidadania'],
    socialProblem: 'O Brasil lidera os índices globais de ansiedade entre jovens, agravados pela pressão por produtividade, hiperconectividade e comparação tóxica em redes sociais, bullying, e pela grave escassez de psicólogos e atendimento especializado na rede pública de saúde e nas escolas.',
    thematicCut: 'Exige abordar "caminhos para combater", "transtornos de ansiedade e depressão", "juventude" e a "realidade brasileira".',
    keywordsToCover: ['transtornos de ansiedade', 'jovens/juventude', 'combater/caminhos', 'saúde mental', 'Brasil'],
    motivatingTexts: [
      {
        id: 't1',
        number: 'I',
        title: 'Lei nº 13.935/2019 e a Presença de Psicologia nas Escolas',
        type: 'conceito_lei',
        content: 'A Lei Federal nº 13.935/2019 determina que as redes públicas de educação básica devem contar com serviços de psicologia e serviço social para atender às necessidades dos estudantes, visando à melhoria do processo de ensino-aprendizagem e ao suporte emocional preventivo.',
        source: 'Legislação Federal / Diário Oficial da União.'
      },
      {
        id: 't2',
        number: 'II',
        title: 'Brasil no Topo do Ranking de Ansiedade da OMS',
        type: 'dados_estatistica',
        content: 'Segundo a Organização Mundial da Saúde (OMS), o Brasil é o país com a maior prevalência de transtornos de ansiedade no mundo (9,3% da população total) e a taxa dobra na faixa etária entre 15 e 29 anos. Pesquisas do Datafolha indicam que 56% dos jovens relatam sintomas frequentes de exaustão e angústia ligados ao futuro profissional e à pressão escolar.',
        source: 'OMS / Relatório de Saúde Mental e Datafolha.'
      },
      {
        id: 't3',
        number: 'III',
        title: 'A Cultura do Desempenho e as Redes Sociais',
        type: 'social_noticia',
        content: 'A exposição contínua a vidas idealizadas em plataformas digitais e a cobrança constante por sucesso precoce geram um ciclo vicioso de comparação social e privação de sono. Especialistas apontam que a desregulação dopaminérgica causada por algoritmos potencializa episódios de crises de pânico e depressão.',
        source: 'Associação Brasileira de Psiquiatria (ABP) e Revista Saúde Pública.'
      },
      {
        id: 't4',
        number: 'IV',
        title: 'A Sociedade do Cansaço',
        type: 'critica_reflexiva',
        content: '"O homem do século XXI não é mais coagido por um senhor externo, mas explora a si mesmo na ilusão de que está se realizando. A cobrança pelo excesso de positividade e produtividade gera a autoagressão psíquica e a depressão profunda."',
        source: 'Byung-Chul Han, filósofo e autor de "Sociedade do Cansaço".'
      }
    ],
    suggestedTheses: {
      d1: 'A negligência no cumprimento efetivo da presença de apoio psicológico nas escolas públicas e a sobrecarga dos CAPS no SUS.',
      d2: 'A cultura da hipercompetitividade e o impacto desregulador dos algoritmos das redes sociais na autoimagem dos adolescentes.'
    },
    recommendedRepertoires: [
      {
        name: 'Byung-Chul Han ("Sociedade do Cansaço")',
        area: 'Filosofia Contemporânea',
        concept: 'Autoexploração e Burnout',
        howToApply: 'Demonstrar como a pressão por desempenho contínuo adoece os estudantes e jovens em fase de formação.'
      },
      {
        name: 'Michel Foucault ("História da Loucura")',
        area: 'Filosofia / História',
        concept: 'Estigmatização do Sofrimento Mental',
        howToApply: 'Explicar como o tabu e o silenciamento em torno do sofrimento psíquico impedem a busca precoce por auxílio médico.'
      },
      {
        name: 'Artigo 196 da Constituição Federal de 1988',
        area: 'Legislação Brasileira',
        concept: 'Saúde como Direito de Todos e Dever do Estado',
        howToApply: 'Argumentar que a saúde mental integra o conceito holístico de saúde previsto na Carta Magna brasileira.'
      }
    ],
    suggestedIntervention: {
      agent: 'Ministério da Saúde, em coordenação com o Ministério da Educação (MEC)',
      action: 'Implementar o Programa Nacional de Saúde Emocional nas Escolas e ampliar as unidades infanto-juvenis dos CAPS',
      modeMedium: 'mediante a contratação efetiva de psicólogos escolares e realização de rodas de conversa semanais com estudantes e pais sobre higiene digital e gestão de estresse',
      effect: 'a fim de identificar precocemente sinais de sofrimento mental e desconstruir o estigma sobre o tratamento psiquiátrico e terapêutico',
      detailing: 'disponibilizando também uma plataforma pública e sigilosa de teleatendimento psicológico gratuito 24 horas.'
    },
    commonTangentsWarning: 'Não foque unicamente em receitas caseiras ou conselhos de autoajuda. Trate a ansiedade e depressão como problemas de saúde pública que exigem políticas públicas de Estado e ambientes educacionais acolhedores.',
    difficultyLevel: 'Acessível'
  },
  {
    id: 'theme-curated-5',
    title: 'Desafios para a superação da evasão escolar e garantia da permanência no Ensino Médio brasileiro',
    axis: 'Educação, Desigualdade e Cidadania',
    areas: ['Educação & Cidadania', 'Economia, Trabalho & Futuro'],
    socialProblem: 'Meio milhão de jovens abandonam as escolas a cada ano no Brasil, impulsionados pela necessidade precoce de trabalhar para complementar a renda familiar, pelo desinteresse no modelo pedagógico arcaico e pela precariedade estrutural dos colégios públicos.',
    thematicCut: 'Exige discutir os "desafios", a "superação da evasão escolar" e a "garantia da permanência no Ensino Médio no Brasil".',
    keywordsToCover: ['evasão escolar', 'permanência', 'Ensino Médio', 'desafios', 'Brasil'],
    motivatingTexts: [
      {
        id: 't1',
        number: 'I',
        title: 'Plano Nacional de Educação (PNE) e Programa Pé-de-Meia',
        type: 'conceito_lei',
        content: 'A Meta 3 do Plano Nacional de Educação (PNE) prevê a universalização do atendimento escolar para toda a população de 15 a 17 anos no Ensino Médio. Em 2024, o Governo Federal lançou o programa "Pé-de-Meia" (Lei nº 14.818/2024), instituindo uma poupança financeira para combater a evasão de alunos de baixa renda cadastrados no CadÚnico.',
        source: 'Ministério da Educação / Diário Oficial da União.'
      },
      {
        id: 't2',
        number: 'II',
        title: 'Censo Escolar e os Motivos do Abandono',
        type: 'dados_estatistica',
        content: 'De acordo com o Censo Escolar do INEP e dados do IBGE, cerca de 14% dos matriculados na 1ª série do Ensino Médio abandonam ou são reprovados. Dentre os jovens que deixaram a escola, 48% declararam que precisavam trabalhar ou procurar emprego para sustentar a casa, e 24% afirmaram que a escola "não fazia sentido para seus projetos de vida".',
        source: 'INEP / Censo Escolar e PNAD Contínua / IBGE.'
      },
      {
        id: 't3',
        number: 'III',
        title: 'O Custo Social do Abandono para a Nação',
        type: 'social_noticia',
        content: 'Estudo conjunto da Fundação Roberto Marinho e do Insper estima que o Brasil perde cerca de R$ 220 bilhões por ano em potencial produtivo devido aos jovens que não concluem a educação básica. A evasão perpetua o ciclo intergeracional de pobreza e restringe os jovens ao subemprego informal.',
        source: 'Insper / Fundação Roberto Marinho.'
      },
      {
        id: 't4',
        number: 'IV',
        title: 'Educação como Instrumento de Libertação',
        type: 'critica_reflexiva',
        content: '"A educação não transforma o mundo. A educação muda as pessoas. Pessoas transformam o mundo. Quando a escola falha em acolher e dar sentido ao jovem, o futuro de toda uma sociedade é confiscado."',
        source: 'Paulo Freire, patrono da Educação Brasileira, em "Pedagogia da Autonomia".'
      }
    ],
    suggestedTheses: {
      d1: 'A vulnerabilidade socioeconômica que obriga o jovem a escolher entre o sustento alimentar imediato e a sala de aula.',
      d2: 'A defasagem pedagógica e estrutural das escolas públicas, que não oferecem ensino técnico de qualidade nem infraestrutura atrativa.'
    },
    recommendedRepertoires: [
      {
        name: 'Paulo Freire ("Pedagogia do Oprimido")',
        area: 'Filosofia da Educação',
        concept: 'Educação Libertadora e Dialógica',
        howToApply: 'Argumentar que a escola deve conectar-se à realidade viva dos estudantes para manter o engajamento e a criticidade.'
      },
      {
        name: 'Pierre Bourdieu ("Os Herdeiros / A Reprodução")',
        area: 'Sociologia da Educação',
        concept: 'Reprodução das Desigualdades Sociais',
        howToApply: 'Explicar como o sistema escolar tradicional pode reproduzir privilégios se não houver políticas afirmativas de permanência para as classes populares.'
      },
      {
        name: 'Artigo 205 da Constituição Federal de 1988',
        area: 'Legislação Brasileira',
        concept: 'Dever do Estado e da Família na Educação',
        howToApply: 'Ressaltar a obrigatoriedade estatal em assegurar condições de acesso e permanência plena na educação básica.'
      }
    ],
    suggestedIntervention: {
      agent: 'Ministério da Educação (MEC), em cooperação com as Secretarias Estaduais de Educação',
      action: 'Expandir o modelo de Ensino Médio em Tempo Integral integrado ao ensino técnico profissionalizante e fortalecer o programa de bolsas de permanência',
      modeMedium: 'por meio do repasse prioritário do Fundeb para a modernização dos laboratórios, oferta de alimentação escolar completa e acompanhamento individualizado de alunos com risco de infrequência',
      effect: 'a fim de assegurar que os jovens permaneçam na escola e concluam a educação básica com qualificação digna para o mercado de trabalho',
      detailing: 'com monitoramento ativo de frequência via aplicativo com alerta aos conselhos tutelares e famílias.'
    },
    commonTangentsWarning: 'Não confunda evasão no Ensino Médio com alfabetização infantil ou apenas vestibular universitário. Concentre-se nas especificidades da juventude de 14 a 18 anos.',
    difficultyLevel: 'Padrão ENEM'
  }
];
