import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  ChevronRight, 
  AlertTriangle, 
  Target, 
  BookOpen, 
  ShieldCheck, 
  Award, 
  Zap, 
  ArrowRight,
  HelpCircle,
  TrendingUp,
  GraduationCap,
  Flame,
  Check
} from 'lucide-react';
import { EnemasterMascot } from './EnemasterMascot';

export interface ScoreLevelRequirement {
  score: 0 | 40 | 80 | 120 | 160 | 200;
  level: number;
  badgeLabel: string;
  badgeColor: string;
  mascotMood: 'happy' | 'scholar' | 'celebrating' | 'thinking';
  mascotQuote: string;
  summary: string;
  inepCriteria: string;
  practicalExample: {
    type: 'good' | 'bad' | 'warning';
    snippet: string;
    analysis: string;
  };
  howToLevelUp: string[];
  fatalTraps: string[];
}

export interface CompetencyStepGuide {
  id: number;
  code: 'C1' | 'C2' | 'C3' | 'C4' | 'C5';
  title: string;
  subtitle: string;
  pillarSummary: string;
  accentColor: string;
  tagColor: string;
  levels: Record<number, ScoreLevelRequirement>;
}

export const COMPETENCIES_STEP_DATA: CompetencyStepGuide[] = [
  {
    id: 1,
    code: 'C1',
    title: 'Domínio da Norma Culta & Sintaxe',
    subtitle: 'Estrutura sintática fluida, subordinação complexa e controle de desvios',
    pillarSummary: 'Avalia a precisão gramatical, pontuação, crase, concordância e a maturidade de períodos oracionais (sem truncamentos ou justaposições).',
    accentColor: 'indigo',
    tagColor: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    levels: {
      0: {
        score: 0,
        level: 0,
        badgeLabel: 'Nível 0 • Desconhecimento',
        badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300',
        mascotMood: 'thinking',
        mascotQuote: 'Atenção total! O texto precisa obrigatoriamente estar em Língua Portuguesa formal para ser pontuado.',
        summary: 'Desconhecimento da modalidade escrita formal ou texto ilegível / em língua estrangeira.',
        inepCriteria: 'Demonstra desconhecimento total da norma padrão da língua escrita.',
        practicalExample: {
          type: 'bad',
          snippet: 'nois precisa muda as coisa pq o brasil ta ruim dmais e ngm faz nada.',
          analysis: 'Linguagem estritamente coloquial, gírias e desvios morfológicos severos que inviabilizam o padrão culto.'
        },
        howToLevelUp: [
          'Escreva exclusivamente no registro formal da Língua Portuguesa.',
          'Elimine abreviações de internet (vc, pq, tbm, nois) e coloquialismos.',
          'Estruture orações com Sujeito, Verbo e Complemento.'
        ],
        fatalTraps: ['Uso de gírias e oralidade', 'Grafia de internet e abreviações informais']
      },
      40: {
        score: 40,
        level: 1,
        badgeLabel: 'Nível 1 • Domínio Precário',
        badgeColor: 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200',
        mascotMood: 'thinking',
        mascotQuote: 'Aqui temos uma sequência de frases curtas ou quebradas com muitos erros gramaticais acumulados.',
        summary: 'Estrutura sintática deficitária com muitos desvios graves recorrentes (concordância, regência e pontuação).',
        inepCriteria: 'Demonstra domínio precário da modalidade escrita formal, com diversificados e frequentes desvios gramaticais e de convenções da escrita.',
        practicalExample: {
          type: 'bad',
          snippet: 'O governo tem que ver os problemas. Porque a saúde ta ruim. Falta hospitais para as pessoa.',
          analysis: 'Período truncado iniciando com "Porque", erro de concordância ("falta hospitais", "as pessoa") e vocabulário simplório.'
        },
        howToLevelUp: [
          'Nunca inicie períodos com "Porque" ou gerúndios sem oração principal.',
          'Revise a concordância plural do sujeito com o verbo (ex: "Faltam hospitais").',
          'Una frases curtas usando conjunções subordinativas.'
        ],
        fatalTraps: ['Truncamentos frequentes', 'Erros crônicos de concordância plural']
      },
      80: {
        score: 80,
        level: 2,
        badgeLabel: 'Nível 2 • Domínio Insuficiente',
        badgeColor: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200',
        mascotMood: 'thinking',
        mascotQuote: 'O texto já ganha forma, mas ainda escorrega em justaposições com vírgula ou desvios de crase e acentuação.',
        summary: 'Estrutura sintática deficitária OU muitos desvios gramaticais que comprometem a fluidez do leitor.',
        inepCriteria: 'Demonstra domínio insuficiente da modalidade escrita formal, com muitos desvios gramaticais ou falhas de estrutura sintática.',
        practicalExample: {
          type: 'warning',
          snippet: 'A educação no Brasil é precária, as escolas não tem verba para comprar livros à todos alunos.',
          analysis: 'Justaposição de duas orações completas separadas só por vírgula, verbo "ter" sem acento circunflexo no plural ("têm") e crase proibida antes de pronome indefinido masculino ("à todos").'
        },
        howToLevelUp: [
          'Substitua vírgulas que emendam orações completas por ponto e vírgula ou conjunções.',
          'Atente à regra da crase: nunca use crase antes de palavras masculinas, verbos ou plurais genéricos.',
          'Lembre-se dos acentos diferenciais (ele tem / eles têm; ele vem / eles vêm).'
        ],
        fatalTraps: ['Justaposição (emendar orações sem conectivo)', 'Crase antes de masculino ou verbo']
      },
      120: {
        score: 120,
        level: 3,
        badgeLabel: 'Nível 3 • Domínio Mediano',
        badgeColor: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300 border-yellow-200',
        mascotMood: 'scholar',
        mascotQuote: 'É a faixa onde a maioria dos estudantes trava! O texto está correto, mas as frases são simples e lineares.',
        summary: 'Estrutura sintática regular com alguns desvios gramaticais leves. Frases muito curtas ou previsíveis.',
        inepCriteria: 'Demonstra domínio mediano da modalidade escrita formal, com alguns desvios gramaticais e convenções da escrita e estrutura sintática regular.',
        practicalExample: {
          type: 'warning',
          snippet: 'O descaso com os idosos é grande no país. Isso acontece devido à falta de investimentos públicos e da família.',
          analysis: 'Frases corretas, porém sem complexidade sintática (apenas orações coordenadas simples sem inversões ou vocabulário erudito).'
        },
        howToLevelUp: [
          'Treine orações intercaladas entre vírgulas (ex: "O etarismo, problema histórico no país, perpetua...").',
          'Substitua termos comuns ("o descaso é grande") por vocabulário formal ("a negligência estatal se consolida").',
          'Use orações subordinadas substantivas e adjetivas para dar ritmo ao parágrafo.'
        ],
        fatalTraps: ['Monotonia sintática (só períodos simples)', 'Repetição de "fazer com que" e "devido a"']
      },
      160: {
        score: 160,
        level: 4,
        badgeLabel: 'Nível 4 • Bom Domínio',
        badgeColor: 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200',
        mascotMood: 'scholar',
        mascotQuote: 'Muito perto do topo! Você constrói períodos complexos e maduros, mas deixou passar 3 a 5 pequenos desvios.',
        summary: 'Estrutura sintática boa com poucos desvios gramaticais. O texto é agradável e demonstra domínio da norma.',
        inepCriteria: 'Demonstra bom domínio da modalidade escrita formal e de estrutura sintática, com poucos desvios gramaticais e de convenções da escrita.',
        practicalExample: {
          type: 'good',
          snippet: 'Em primeiro plano, cabe destacar que a inoperância governamental contribui para a perpetuação do etarismo, visto que a escassez de centros-dia públicos sobrecarregam as famílias.',
          analysis: 'Estrutura sintática madura e excelente subordinação, porém com um desvio pontual de concordância ("a escassez... sobrecarregam" em vez de "sobrecarrega").'
        },
        howToLevelUp: [
          'Faça uma leitura minuciosa de trás para frente procurando concordância de sujeitos distantes do verbo.',
          'Certifique-se de que a crase e a regência verbal estejam impecáveis (máximo de 2 desvios leves no texto todo).',
          'Garanta que não haja nenhum truncamento ou oração sem verbo principal.'
        ],
        fatalTraps: ['Concordância com núcleo do sujeito distante', 'Pequenos deslizes de pontuação em adjuntos longos']
      },
      200: {
        score: 200,
        level: 5,
        badgeLabel: 'Nível 5 • Excelência Nota 1000',
        badgeColor: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 ring-1 ring-emerald-400/40',
        mascotMood: 'celebrating',
        mascotQuote: 'Perfeição sintática! Períodos longos, elegantes, bem pontuados e no máximo 2 desvios gramaticais em toda a folha.',
        summary: 'Estrutura sintática excelente (subordinação complexa, inversões, vocabulário refinado) E no máximo 2 desvios gramaticais leves excepcionais.',
        inepCriteria: 'Demonstra excelente domínio da modalidade escrita formal e de estrutura sintática, admitindo-se desvios gramaticais ou de convenções da escrita apenas como excepcionalidade e sem reincidência.',
        practicalExample: {
          type: 'good',
          snippet: 'Em primeiro plano, cabe pontuar que a desvalorização social da terceira idade decorre de raízes utilitaristas, haja vista que a sociedade contemporânea, pautada no ritmo frenético da produção, tende a marginalizar aqueles que já não atendem às exigências do mercado.',
          analysis: 'Estrutura sintática irrepreensível: orações subordinadas causais e adjetivas intercaladas com pontuação precisa e regência exemplar ("atendem às exigências").'
        },
        howToLevelUp: [
          'Mantenha a caligrafia nítida e sem rasuras bruscas.',
          'Conserve o padrão de 2 a 3 períodos por parágrafo com rica subordinação.',
          'Domine regências nobres (ex: "implicar algo" sem "em", "visar a", "aspirar a").'
        ],
        fatalTraps: ['Excesso de confiança sem revisão palavra por palavra', 'Reincidência do mesmo erro gramatical']
      }
    }
  },
  {
    id: 2,
    code: 'C2',
    title: 'Compreensão do Tema & Repertório',
    subtitle: 'Abordagem completa do tema, tipologia dissertativa e repertório produtivo legitimado',
    pillarSummary: 'Avalia se você cobriu todas as palavras-chave do tema, respeitou a estrutura em 4 parágrafos e utilizou repertórios filosóficos, sociológicos ou históricos de forma estritamente produtiva.',
    accentColor: 'emerald',
    tagColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    levels: {
      0: {
        score: 0,
        level: 0,
        badgeLabel: 'Nível 0 • Fuga ao Tema',
        badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300',
        mascotMood: 'thinking',
        mascotQuote: 'Fuga total anula a redação inteira! O texto precisa discutir rigorosamente o tema proposto pelo INEP.',
        summary: 'Fuga total ao tema proposto OU texto que não seja dissertativo-argumentativo (ex: poema, conto, lista).',
        inepCriteria: 'Fuga ao tema ou não atendimento à estrutura dissertativo-argumentativa.',
        practicalExample: {
          type: 'bad',
          snippet: 'Era uma vez um jovem que andava pela rua e pensava em como o mundo estava violento...',
          analysis: 'Texto narrativo de ficção que desrespeita completamente a tipologia dissertativo-argumentativa do ENEM.'
        },
        howToLevelUp: [
          'Escreva sempre um texto dissertativo em 4 parágrafos (Introdução, 2 Desenvolvimentos, Conclusão).',
          'Defenda uma tese com argumentos lógicos e soluções sociais.',
          'Nunca conte histórias fictícias ou em primeira pessoa ("eu acho").'
        ],
        fatalTraps: ['Formato narrativo ou poético', 'Fuga para outro tema']
      },
      40: {
        score: 40,
        level: 1,
        badgeLabel: 'Nível 1 • Tangenciamento Severo',
        badgeColor: 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200',
        mascotMood: 'thinking',
        mascotQuote: 'Cuidado: falar apenas do assunto geral (ex: velhice) esquecendo o recorte (perspectivas no Brasil) derruba sua nota.',
        summary: 'Apresenta apenas o assunto amplo sem abordar o recorte temático específico ou tem estrutura dissertativa quase nula.',
        inepCriteria: 'Apresenta o assunto, tangenciando o tema, ou demonstra domínio precário do texto dissertativo-argumentativo.',
        practicalExample: {
          type: 'bad',
          snippet: 'Os idosos são muito importantes no mundo e precisamos respeitar nossos avós todos os dias.',
          analysis: 'Foco sentimental no assunto geral "idosos", sem problematizar o recorte temático de desafios e perspectivas estruturais no Brasil.'
        },
        howToLevelUp: [
          'Identifique e sublinhe as palavras-chave da proposta de redação antes de começar.',
          'Insira todas as palavras do tema já no primeiro parágrafo de introdução.',
          'Analise o problema sob o ponto de vista social e institucional brasileiro.'
        ],
        fatalTraps: ['Tangenciamento (ignorar as palavras centrais da proposta)', 'Abordagem puramente sentimental']
      },
      80: {
        score: 80,
        level: 2,
        badgeLabel: 'Nível 2 • Cópia dos Textos Motivadores',
        badgeColor: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200',
        mascotMood: 'thinking',
        mascotQuote: 'Copiar ou parafrasear os textos de apoio da prova limita seu texto ao nível básico.',
        summary: 'Recorre à cópia ou paráfrase direta dos textos motivadores da prova, sem nenhum repertório sociocultural externo.',
        inepCriteria: 'Recorre à cópia de trechos dos textos motivadores ou desenvolve de forma tangencial o tema.',
        practicalExample: {
          type: 'warning',
          snippet: 'Conforme o Texto 1 da coletânea, a população com mais de 60 anos cresceu 50% na última década segundo o IBGE.',
          analysis: 'Uso exclusivo e literal dos dados fornecidos na prova, sem acréscimo de áreas do saber externas (filosofia, literatura, história).'
        },
        howToLevelUp: [
          'Use os textos motivadores apenas como inspiração para delimitar o problema, nunca como seu argumento principal.',
          'Memorize coringas legitimados universais (Constituição Federal, Simone de Beauvoir, Milton Santos, Bauman).',
          'Mostre à banca conhecimentos adquiridos ao longo da sua formação escolar.'
        ],
        fatalTraps: ['Cópia descarada de frases da coletânea', 'Falta de referências de outras ciências']
      },
      120: {
        score: 120,
        level: 3,
        badgeLabel: 'Nível 3 • Repertório do Senso Comum',
        badgeColor: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300 border-yellow-200',
        mascotMood: 'scholar',
        mascotQuote: 'Aqui a redação usa argumentos batidos e previsíveis, ou citações que todo mundo coloca sem aprofundar.',
        summary: 'Argumentação previsível baseada no senso comum ou repertório não legitimado (ex: "como diz o ditado popular").',
        inepCriteria: 'Desenvolve o tema por meio de argumentação previsível e apresenta domínio mediano do texto dissertativo-argumentativo, com repertório baseado nos textos motivadores.',
        practicalExample: {
          type: 'warning',
          snippet: 'A sociedade brasileira precisa mudar, pois a união faz a força e sem amor ao próximo não há futuro para os cidadãos.',
          analysis: 'Provérbios e argumentos de senso comum desprovidos de autoridade científica ou legitimidade acadêmica.'
        },
        howToLevelUp: [
          'Substitua ditados populares por conceitos filosóficos ou sociológicos com autoria expressa.',
          'Em vez de clichês morais, aponte causas estruturais (omissão estatal, raízes históricas, mercado de consumo).',
          'Cite leis formais (ex: Constituição de 1988, Estatuto da Pessoa Idosa, ECA).'
        ],
        fatalTraps: ['Citação de provérbios ou "ouvi falar"', 'Argumentos de moralismo individual']
      },
      160: {
        score: 160,
        level: 4,
        badgeLabel: 'Nível 4 • Repertório Legitimado e Pertinente',
        badgeColor: 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200',
        mascotMood: 'scholar',
        mascotQuote: 'Excelente! Você citou um autor reconhecido e o tema está perfeito, mas faltou conectar o autor à sua tese.',
        summary: 'Repertório legitimado por área do saber e pertinente ao tema, porém sem uso estritamente produtivo (repertório solto).',
        inepCriteria: 'Desenvolve o tema por meio de argumentação consistente e apresenta bom domínio do texto dissertativo-argumentativo, com repertório legitimado e pertinente ao tema.',
        practicalExample: {
          type: 'good',
          snippet: 'Segundo o filósofo Thomas Hobbes, o Estado deve garantir a segurança dos indivíduos. No Brasil, os idosos sofrem com a falta de hospitais públicos.',
          analysis: 'Hobbes é legitimado e o tema é abordado, mas o autor jogou a frase e não explicou O PORQUÊ do pensamento de Hobbes se aplicar à falha de gestão nos hospitais.'
        },
        howToLevelUp: [
          'Regra de ouro do repertório produtivo: Citação + Explicação do conceito + Aplicação direta à realidade brasileira do tema.',
          'Use conectivos explicativos: "Fora da teoria, essa reflexão coaduna-se com...", "Nesse viés, nota-se que...".',
          'Mostre que o repertório é o motor do seu raciocínio, não um enfeite isolado.'
        ],
        fatalTraps: ['Citação solta de filósofo decorado', 'Falta de ponte explicativa entre a teoria e o Brasil']
      },
      200: {
        score: 200,
        level: 5,
        badgeLabel: 'Nível 5 • Repertório 100% Produtivo',
        badgeColor: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 ring-1 ring-emerald-400/40',
        mascotMood: 'celebrating',
        mascotQuote: 'Nota Máxima! O repertório é legitimado, pertinente e indispensável para a sustentação da sua tese.',
        summary: 'Repertório legitimado pelas áreas do saber, pertinente ao tema e com uso estritamente PRODUTIVO articulado à tese em 4 parágrafos perfeitos.',
        inepCriteria: 'Desenvolve o tema por meio de argumentação consistente, a partir de um repertório sociocultural produtivo e apresenta excelente domínio do texto dissertativo-argumentativo.',
        practicalExample: {
          type: 'good',
          snippet: 'Na obra "A Velhice", Simone de Beauvoir denuncia que a sociedade costuma tratar os idosos como seres descartáveis quando deixam de ser economicamente produtivos. Fora da teoria, essa reflexão coaduna-se com o Brasil hodierno, no qual a modernidade capitalista marginaliza a senescência e priva a população idosa do pleno amparo assegurado no Artigo 230 da Carta Magna.',
          analysis: 'Repertório legitimado (Beauvoir + CF/88), pertinente e 100% produtivo, pois a teoria é destrinchada para provar o argumento da exclusão capitalista no Brasil.'
        },
        howToLevelUp: [
          'Mantenha ao menos 2 repertórios legitimados de áreas distintas (ex: Filosofia na Intro e Legislação/Sociologia no D1 ou D2).',
          'Articule o repertório com o fechamento do parágrafo.',
          'Use sempre a tríade: Conceito + Ligação com a realidade + Consequência crítica.'
        ],
        fatalTraps: ['Inventar dados estatísticos não verificáveis', 'Repertório decorado que não dialoga com o argumento']
      }
    }
  },
  {
    id: 3,
    code: 'C3',
    title: 'Projeto de Texto & Autoria Crítica',
    subtitle: 'Planejamento prévio, encadeamento de causa e efeito e juízo de valor autoral',
    pillarSummary: 'Avalia se a redação possui um projeto de texto estratégico (tese bipartida cumprida em D1 e D2), sem lacunas argumentativas e com forte posicionamento autoral.',
    accentColor: 'amber',
    tagColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    levels: {
      0: {
        score: 0,
        level: 0,
        badgeLabel: 'Nível 0 • Ausência de Projeto',
        badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300',
        mascotMood: 'thinking',
        mascotQuote: 'Sem posicionamento ou argumentos estruturados, o texto perde o caráter dissertativo.',
        summary: 'Apresenta informações e argumentos desconexos sem nenhuma defesa de ponto de vista.',
        inepCriteria: 'Apresenta informações, fatos e opiniões não relacionados ao tema e sem defesa de um ponto de vista.',
        practicalExample: {
          type: 'bad',
          snippet: 'O sol nasce todos os dias e as cidades crescem muito. Existem carros e ônibus nas ruas.',
          analysis: 'Frases soltas sem nexo temático, sem tese e sem direcionamento argumentativo.'
        },
        howToLevelUp: [
          'Defina claramente sua tese: qual é a sua opinião crítica sobre o problema?',
          'Estruture a redação em causas (D1) e consequências (D2).',
          'Mantenha a coerência entre o início, o meio e o fim do texto.'
        ],
        fatalTraps: ['Desconexão lógica entre frases', 'Falta de tese central']
      },
      40: {
        score: 40,
        level: 1,
        badgeLabel: 'Nível 1 • Ideias Caóticas',
        badgeColor: 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200',
        mascotMood: 'thinking',
        mascotQuote: 'Muitas ideias jogadas sem explicação criam contradições que anulam a força dos seus argumentos.',
        summary: 'Informações e opiniões pouco articuladas ou com contradições graves na defesa do ponto de vista.',
        inepCriteria: 'Apresenta informações, fatos e opiniões pouco relacionados ao tema ou com contradições em defesa de um ponto de vista.',
        practicalExample: {
          type: 'bad',
          snippet: 'O governo ajuda muito os idosos com leis ótimas. Mas os idosos morrem desamparados porque ninguém faz leis para eles.',
          analysis: 'Contradição direta e flagrante no mesmo parágrafo (afirma que o governo ajuda e logo depois que ninguém faz leis).'
        },
        howToLevelUp: [
          'Antes de escrever, faça um rascunho em tópicos com sua tese.',
          'Escolha dois argumentos convergentes para não cair em contradições.',
          'Revise se uma frase não desmente o que você afirmou anteriormente.'
        ],
        fatalTraps: ['Contradição direta entre parágrafos', 'Misturar opiniões opostas sem mediação']
      },
      80: {
        score: 80,
        level: 2,
        badgeLabel: 'Nível 2 • Lacunas Argumentativas',
        badgeColor: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200',
        mascotMood: 'thinking',
        mascotQuote: 'Você afirma que um problema existe, mas não explica o porquê nem as consequências dele.',
        summary: 'Projeto de texto com muitas lacunas de argumentação e foco excessivo em relatos superficiais sem análise crítica.',
        inepCriteria: 'Apresenta projeto de texto com falhas e desenvolve informações limitadas aos fatos sem desdobramento crítico.',
        practicalExample: {
          type: 'warning',
          snippet: 'A saúde pública no Brasil é ruim e isso causa muitos prejuízos para todo mundo, então o problema deve ser resolvido.',
          analysis: 'Afirmação vaga e superficial ("muitos prejuízos para todo mundo") sem explicar QUAIS são os prejuízos e POR QUE a saúde é precária.'
        },
        howToLevelUp: [
          'Pergunte-se sempre: "Por que isso acontece?" e "Qual é a consequência prática disso?".',
          'Substitua expressões genéricas ("muitas coisas ruins") por fatos precisos ("sobrecarga hospitalar e endividamento familiar").',
          'Exemplifique com a realidade socioeconômica brasileira.'
        ],
        fatalTraps: ['Afirmações vagas e generalistas', 'Deixar perguntas sem resposta no texto']
      },
      120: {
        score: 120,
        level: 3,
        badgeLabel: 'Nível 3 • Texto Expositivo',
        badgeColor: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300 border-yellow-200',
        mascotMood: 'scholar',
        mascotQuote: 'Atenção: o ENEM não quer uma enciclopédia! Você precisa defender uma opinião crítica com juízo de valor.',
        summary: 'Projeto de texto com falhas visíveis ou predomínio do tom expositivo/informativo em vez de argumentativo autoral.',
        inepCriteria: 'Apresenta projeto de texto com algumas falhas na seleção e organização das ideias, desenvolvendo informações de forma previsível.',
        practicalExample: {
          type: 'warning',
          snippet: 'No Brasil existem várias leis para proteger os idosos, como o Estatuto do Idoso criado em 2003. Essas leis têm artigos sobre saúde e transporte público.',
          analysis: 'O participante apenas informa a existência da lei sem criticar a sua ineficiência prática ou posicionar-se sobre o problema.'
        },
        howToLevelUp: [
          'Use operadores axiológicos (juízo de valor): "nefasto", "urgente", "deletério", "inoperância", "negligência".',
          'Transforme informação em crítica: em vez de dizer que a lei existe, mostre que ela permanece no papel como "letra morta".',
          'Adote a estrutura do Projeto de Texto Bipartido (Argumento 1 na Intro -> D1; Argumento 2 na Intro -> D2).'
        ],
        fatalTraps: ['Tom puramente informativo/jornalístico', 'Falta de adjetivação crítica e juízo de valor']
      },
      160: {
        score: 160,
        level: 4,
        badgeLabel: 'Nível 4 • Bom Projeto com Poucas Lacunas',
        badgeColor: 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200',
        mascotMood: 'scholar',
        mascotQuote: 'Quase perfeito! Seu projeto de texto é evidente, mas houve um salto lógico ou argumento não aprofundado.',
        summary: 'Projeto de texto estratégico com poucos deslizes na progressão temática e argumentação consistente.',
        inepCriteria: 'Apresenta projeto de texto estratégico com poucas falhas na seleção, organização e interpretação de informações em defesa do ponto de vista.',
        practicalExample: {
          type: 'good',
          snippet: 'Com efeito, a omissão governamental agrava o cenário. Isso porque a baixa destinação de verbas ao SUS impossibilita a contratação de especialistas, gerando revolta na população brasileira.',
          analysis: 'Boa cadeia de causa e efeito, porém com um fechamento precipitado ("gerando revolta") sem desdobrar o impacto estrutural na vida dos cidadãos.'
        },
        howToLevelUp: [
          'Garanta que todas as causas citadas na Introdução sejam rigorosamente cumpridas no D1 e no D2.',
          'Feche cada parágrafo de desenvolvimento com uma frase de síntese crítica.',
          'Elimine saltos argumentativos: mostre passo a passo a cadeia causal do problema.'
        ],
        fatalTraps: ['Tópico frasal prometido na introdução que não foi aprofundado no desenvolvimento', 'Fechamentos de parágrafo bruscos']
      },
      200: {
        score: 200,
        level: 5,
        badgeLabel: 'Nível 5 • Projeto de Texto Estratégico Impecável',
        badgeColor: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 ring-1 ring-emerald-400/40',
        mascotMood: 'celebrating',
        mascotQuote: 'Autoria máxima! Cada frase tem um propósito planejado, articulando causas profundas e juízo de valor contundente.',
        summary: 'Projeto de texto estratégico consistente, tese bipartida transparente na introdução, cadeia causal irrefutável e fortes marcas de autoria.',
        inepCriteria: 'Apresenta projeto de texto estratégico com excelente desenvolvimento dos argumentos, sem lacunas argumentativas e com marcas claras de autoria.',
        practicalExample: {
          type: 'good',
          snippet: 'Em primeiro plano, cabe pontuar que a ineficiência de políticas públicas perpetua a precariedade da velhice no Brasil. De acordo com Norberto Bobbio, o envelhecimento digno requer garantias institucionais de autonomia. Contudo, a escassez de centros-dia e cuidadores públicos sobrecarrega desproporcionalmente as famílias vulneráveis, revelando a discrepância perversa entre a garantia legal e a realidade vivenciada.',
          analysis: 'Perfeição em C3: Tópico frasal assertivo -> Repertório como premissa -> Desdobramento causal no contexto nacional -> Juízo de valor com denúncia do descompasso social.'
        },
        howToLevelUp: [
          'Use a técnica do Fechamento Circular na Conclusão para amarrar o projeto de texto.',
          'Mantenha o equilíbrio visual e argumentativo de linhas entre D1 e D2 (7 a 8 linhas cada).',
          'Sustente a voz autoral crítica do início ao fim sem hesitações.'
        ],
        fatalTraps: ['Desequilíbrio de profundidade entre D1 e D2', 'Esquecer de retomar a tese no final do desenvolvimento']
      }
    }
  },
  {
    id: 4,
    code: 'C4',
    title: 'Coesão & Conectivos Estratégicos',
    subtitle: 'Conectores interparágrafos, articulação intraparágrafos e repertório lexical',
    pillarSummary: 'Avalia a ligação lógica entre os parágrafos (mínimo de 2 operadores interparágrafos) e entre os períodos internos, além do uso variado de anafóricos sem repetições.',
    accentColor: 'blue',
    tagColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    levels: {
      0: {
        score: 0,
        level: 0,
        badgeLabel: 'Nível 0 • Sem Articulação',
        badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300',
        mascotMood: 'thinking',
        mascotQuote: 'Frases jogadas sem nenhuma conjunção ou pronome deixam o texto incompreensível.',
        summary: 'Ausência total de recursos coesivos ou texto com frases justapostas sem articulação.',
        inepCriteria: 'Não articula as informações no texto.',
        practicalExample: {
          type: 'bad',
          snippet: 'O hospital está cheio. O médico não veio. As pessoas esperam. O remédio acabou.',
          analysis: 'Orações isoladas estilo telegrama, sem nenhum conectivo de ligação causal ou temporal.'
        },
        howToLevelUp: [
          'Aprenda as principais conjunções: causais (visto que, já que), adversativas (contudo, todavia) e conclusivas (portanto, dessarte).',
          'Conecte períodos com pronomes e pronomes demonstrativos (esse cenário, tal problemática).',
          'Estruture os períodos com no mínimo 2 orações articuladas.'
        ],
        fatalTraps: ['Períodos curtos soltos sem conectivos', 'Falta total de conjunções']
      },
      40: {
        score: 40,
        level: 1,
        badgeLabel: 'Nível 1 • Recursos Precários',
        badgeColor: 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200',
        mascotMood: 'thinking',
        mascotQuote: 'Uso de conectivos com sentido errado ou repetição exaustiva de "e" ou "mas" a cada linha.',
        summary: 'Recursos coesivos precários com inadequações frequentes que alteram o sentido pretendido.',
        inepCriteria: 'Articula as partes do texto de forma precária, com excessivas repetições de recursos coesivos ou inadequações.',
        practicalExample: {
          type: 'bad',
          snippet: 'O idoso precisa de remédio e o posto não tem e a família não tem dinheiro e o governo não ajuda.',
          analysis: 'Repetição monótona e viciosa da conjunção aditiva "e" (polissíndeto informal).'
        },
        howToLevelUp: [
          'Varie seus conectivos aditivos: "além disso", "outrossim", "ademais", "bem como".',
          'Elimine a repetição excessiva da letra "e" entre períodos.',
          'Substitua substantivos repetidos por sinônimos ou pronomes.'
        ],
        fatalTraps: ['Repetir "e", "mas", "porque" em todas as frases', 'Usar conectivos em desacordo com o sentido lógico']
      },
      80: {
        score: 80,
        level: 2,
        badgeLabel: 'Nível 2 • Repertório Pouco Diversificado',
        badgeColor: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200',
        mascotMood: 'thinking',
        mascotQuote: 'Você usa conectivos, mas repete as mesmas 3 palavras em todo o texto (além disso, com isso, onde).',
        summary: 'Repertório coesivo pouco diversificado com repetição constante de vocábulos e conectivos.',
        inepCriteria: 'Articula as partes do texto de forma insuficiente, com muitas inadequações e repertório coesivo pouco diversificado.',
        practicalExample: {
          type: 'warning',
          snippet: 'O problema é grave, onde a sociedade sofre com isso. Com isso, os jovens também são afetados onde moram.',
          analysis: 'Uso inadequado de "onde" para noções não espaciais e repetição do anafórico vicioso "com isso".'
        },
        howToLevelUp: [
          'Nunca use "onde" para ideias abstratas; use "em que", "no qual" ou "no contexto em que".',
          'Elimine o vício de "com isso" ou "através disso"; prefira "nesse cenário", "sob essa ótica".',
          'Amplie seu vocabulário de transição entre orações.'
        ],
        fatalTraps: ['"Onde" referindo-se a abstrações', 'Repetição insistente de "com isso" ou "o mesmo"']
      },
      120: {
        score: 120,
        level: 3,
        badgeLabel: 'Nível 3 • Coesão Regular',
        badgeColor: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300 border-yellow-200',
        mascotMood: 'scholar',
        mascotQuote: 'Conexões presentes, mas faltam operadores fortes no início dos parágrafos ou há períodos justapostos internamente.',
        summary: 'Repertório coesivo mediano com algumas repetições ou inadequações leves e falta de operadores interparágrafos.',
        inepCriteria: 'Articula as partes do texto de forma mediana, com poucas inadequações e repertório coesivo regular.',
        practicalExample: {
          type: 'warning',
          snippet: '§1: No Brasil... / §2: O sociólogo Bauman afirma... / §3: A saúde pública... / §4: Portanto...',
          analysis: 'Apenas 1 operador interparágrafo no início do parágrafo 4 ("Portanto"). O INEP exige no mínimo 2 operadores interparágrafos expressivos.'
        },
        howToLevelUp: [
          'Inicie o D1 com operador inter: "Em primeiro plano,", "A princípio,", "De início,".',
          'Inicie o D2 com operador inter aditivo: "Outrossim,", "Ademais,", "Sob outro prisma,".',
          'Inicie a Conclusão com operador inter conclusivo: "Infere-se, portanto,", "Em suma,", "Dessarte,".'
        ],
        fatalTraps: ['Iniciar D1 ou D2 sem operador interparágrafo', 'Deixar parágrafos sem conexão explícita']
      },
      160: {
        score: 160,
        level: 4,
        badgeLabel: 'Nível 4 • Boa Articulação Coesiva',
        badgeColor: 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200',
        mascotMood: 'scholar',
        mascotQuote: 'Muito bom! Você usou conectivos interparágrafos, mas houve um pequeno deslize ou repetição de palavra no mesmo parágrafo.',
        summary: 'Boa articulação inter e intraparágrafos com poucas inadequações e repertório coesivo diversificado.',
        inepCriteria: 'Articula as partes do texto com poucas inadequações e apresenta repertório coesivo diversificado.',
        practicalExample: {
          type: 'good',
          snippet: 'Outrossim, cabe salientar que a negligência familiar agrava o quadro. Nesse sentido, os dados comprovam que o abandono afeta a saúde mental dos idosos.',
          analysis: 'Excelente operador inter ("Outrossim") e intra ("Nesse sentido"), mas com pequena repetição léxica que poderia ser substituída por hiperônimo.'
        },
        howToLevelUp: [
          'Substitua substantivos repetidos pelo recurso da anáfora: "a população idosa" -> "esse grupo etário" -> "a terceira idade" -> "os indivíduos em senescência".',
          'Assegure conectivos no início de TODOS os períodos internos dos parágrafos.',
          'Mantenha no mínimo 2 operadores interparágrafos comprovados (D1/D2 e Conclusão).'
        ],
        fatalTraps: ['Repetir 3 vezes a mesma palavra-chave no mesmo parágrafo', 'Falta de conectivo intra em algum período']
      },
      200: {
        score: 200,
        level: 5,
        badgeLabel: 'Nível 5 • Coesão Perfeita e Expressiva',
        badgeColor: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 ring-1 ring-emerald-400/40',
        mascotMood: 'celebrating',
        mascotQuote: 'Fluidez impecável! Operadores interparágrafos estratégicos em 2+ posições e coesão intra em todas as frases.',
        summary: 'Presença garantida de 2+ operadores interparágrafos expressivos E conectivos variados em todos os períodos internos, com riqueza lexical sem repetições.',
        inepCriteria: 'Articula bem as partes do texto, sem inadequações, e apresenta repertório coesivo diversificado e expressivo.',
        practicalExample: {
          type: 'good',
          snippet: 'Outrossim, é imperativo analisar a ineficácia dos mecanismos socioassistenciais. Sob esse viés, a teoria de Pierre Bourdieu elucida como as estruturas institucionais reproduzem desigualdades. Desse modo, torna-se evidente que a superação desse entrave demanda intervenções coordenadas.',
          analysis: 'Coesão Nível 5: Operador inter expressivo ("Outrossim,") + Operadores intraparágrafos em cada período ("Sob esse viés,", "Desse modo,") com anafóricos sofisticados ("desse entrave").'
        },
        howToLevelUp: [
          'Gabarite o Checklist Oficial: D1 ("Em primeiro plano,"), D2 ("Outrossim,"), Conclusão ("Infere-se, portanto,").',
          'Use conectivos oracionais sofisticados: "haja vista que", "por conseguinte", "consoante", "ao passo que".',
          'Varie referências ao tema com rica sinonímia.'
        ],
        fatalTraps: ['Esquecer conectivo em qualquer um dos períodos internos', 'Uso forçado de conectivos arcaicos sem fluidez']
      }
    }
  },
  {
    id: 5,
    code: 'C5',
    title: 'Proposta de Intervenção (5 Elementos)',
    subtitle: 'Agente, Ação afirmativa, Meio/Modo, Efeito e Detalhamento substantivo com Direitos Humanos',
    pillarSummary: 'A competência mais matemática da prova: cada um dos 5 elementos válidos vale exatamente 40 pontos (40 x 5 = 200). Violação aos Direitos Humanos zera a competência.',
    accentColor: 'purple',
    tagColor: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    levels: {
      0: {
        score: 0,
        level: 0,
        badgeLabel: 'Nível 0 • Ausente ou Violação DH',
        badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300',
        mascotMood: 'thinking',
        mascotQuote: 'Atenção máxima: nunca sugira penas cruéis, tortura ou censura. Violação aos Direitos Humanos é nota ZERO!',
        summary: 'Ausência total de proposta de intervenção OU proposta nula / violação explícita aos Direitos Humanos.',
        inepCriteria: 'Não apresenta proposta de intervenção ou apresenta proposta não articulada com a discussão desenvolvida no texto / viola Direitos Humanos.',
        practicalExample: {
          type: 'bad',
          snippet: 'Os idosos abandonados deveriam ser isolados da sociedade à força em campos fechados.',
          analysis: 'Violação gravíssima aos Direitos Humanos e à dignidade da pessoa humana, zerando a Competência 5 imediatamente.'
        },
        howToLevelUp: [
          'Pense sempre em soluções democráticas, educativas, orçamentárias e inclusivas.',
          'Respeite as liberdades individuais e as garantias constitucionais.',
          'Nunca sugira violência, exclusão compulsória ou justiça com as próprias mãos.'
        ],
        fatalTraps: ['Violação de Direitos Humanos', 'Esquecer de colocar a proposta de intervenção']
      },
      40: {
        score: 40,
        level: 1,
        badgeLabel: 'Nível 1 • Apenas 1 Elemento Válido',
        badgeColor: 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200',
        mascotMood: 'thinking',
        mascotQuote: 'Propostas vagas como "a sociedade precisa se conscientizar" contam no máximo 1 elemento.',
        summary: 'Apresenta apenas 1 elemento válido (40 pts) ou proposta puramente condicional/vaga.',
        inepCriteria: 'Apresenta proposta de intervenção vaga, precária ou relacionada apenas ao assunto geral (1 elemento).',
        practicalExample: {
          type: 'bad',
          snippet: 'Portanto, a sociedade precisa se conscientizar para que as coisas melhorem no Brasil.',
          analysis: 'Apenas 1 elemento precário (Ação vaga de "conscientizar" sem agente institucional, sem meio de execução e sem detalhamento).'
        },
        howToLevelUp: [
          'Bana "a sociedade precisa se conscientizar" como sua única ação.',
          'Substitua "a sociedade" por agentes institucionais concretos (Ministério da Educação, Ministério da Saúde, Poder Legislativo).',
          'Use verbos de ação prática (instituir, aprovar, capacitar, fiscalizar).'
        ],
        fatalTraps: ['"A sociedade deve se conscientizar"', 'Frases condicionais ("se as pessoas quiserem...")']
      },
      80: {
        score: 80,
        level: 2,
        badgeLabel: 'Nível 2 • 2 Elementos Válidos',
        badgeColor: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200',
        mascotMood: 'thinking',
        mascotQuote: 'Você indicou quem faz (Agente) e o que fazer (Ação), mas faltou explicar COMO (Meio) e PARA QUE (Efeito).',
        summary: 'Apresenta 2 elementos válidos presentes (2 x 40 = 80 pts). Proposta ainda incompleta.',
        inepCriteria: 'Apresenta proposta de intervenção de forma insuficiente ou não articulada com a tese (2 elementos).',
        practicalExample: {
          type: 'warning',
          snippet: 'Cabe ao Ministério da Saúde criar novos centros de acolhimento geriátrico nas capitais brasileiras.',
          analysis: 'Contém apenas 2 elementos: 1. Agente (Ministério da Saúde) e 2. Ação (criar novos centros). Falta Meio ("por meio de..."), Efeito ("a fim de...") e Detalhamento.'
        },
        howToLevelUp: [
          'Acrescente o MEIO DE EXECUÇÃO introduzido pela locução "por meio de" ou "mediante".',
          'Acrescente a FINALIDADE introduzida por "a fim de" ou "com o objetivo de".',
          'Conecte a proposta aos problemas denunciados no D1 e D2.'
        ],
        fatalTraps: ['Esquecer o "por meio de" (meio/modo)', 'Esquecer o "a fim de" (efeito)']
      },
      120: {
        score: 120,
        level: 3,
        badgeLabel: 'Nível 3 • 3 Elementos Válidos',
        badgeColor: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300 border-yellow-200',
        mascotMood: 'scholar',
        mascotQuote: 'Você tem Agente, Ação e Efeito! Agora adicione o Meio/Modo de execução para chegar a 160.',
        summary: 'Apresenta 3 elementos válidos presentes (3 x 40 = 120 pts).',
        inepCriteria: 'Apresenta proposta de intervenção mediana, articulada ao tema e com 3 elementos válidos.',
        practicalExample: {
          type: 'warning',
          snippet: 'Cabe ao Ministério da Educação implementar palestras nas escolas, a fim de combater o etarismo entre os jovens.',
          analysis: 'Contém 3 elementos: 1. Agente (MEC), 2. Ação (implementar palestras) e 3. Efeito (a fim de combater o etarismo). Falta Meio/Modo e Detalhamento.'
        },
        howToLevelUp: [
          'Insira sempre a ferramenta ou instrumento de execução: "por meio de oficinas interdisciplinares e cartilhas digitais".',
          'Explique quem financiará ou coordenará a medida.',
          'Prepare-se para adicionar o Detalhamento substantivo.'
        ],
        fatalTraps: ['Achar que "palestras" já é o meio e a ação ao mesmo tempo', 'Omissão do instrumento de ação']
      },
      160: {
        score: 160,
        level: 4,
        badgeLabel: 'Nível 4 • 4 Elementos Válidos',
        badgeColor: 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200',
        mascotMood: 'scholar',
        mascotQuote: 'A dor de 90% dos alunos que tiram 960! Falta apenas 1 elemento: o DETALHAMENTO SUBSTANTIVO.',
        summary: 'Apresenta 4 elementos válidos (4 x 40 = 160 pts). Falta apenas o Detalhamento de um dos elementos.',
        inepCriteria: 'Apresenta proposta de intervenção bem articulada, mas carece do detalhamento substantivo de um dos elementos (4 elementos).',
        practicalExample: {
          type: 'good',
          snippet: 'Cabe ao Ministério da Saúde criar centros-dia públicos, por meio de repasse de verbas federais, a fim de garantir atendimento digno aos idosos.',
          analysis: 'Possui 4 elementos canônicos: Agente (MS) + Ação (criar centros-dia) + Meio (por meio de repasse) + Efeito (a fim de garantir...). Falta o Detalhamento para atingir os 200 pontos!'
        },
        howToLevelUp: [
          'Técnica infalível de Detalhamento do Agente: coloque um aposto explicativo da função do órgão entre travessões (ex: "— órgão responsável pela gestão do SUS —").',
          'Técnica de Detalhamento do Meio: exemplifique o que será incluído (ex: "mediante verbas orçamentárias, como o Fundo Nacional de Saúde,").',
          'Técnica de Detalhamento da Ação: especifique a metodologia ou o conteúdo da medida.'
        ],
        fatalTraps: ['Achar que frases longas já contêm detalhamento', 'Esquecer o aposto explicativo do órgão']
      },
      200: {
        score: 200,
        level: 5,
        badgeLabel: 'Nível 5 • 5 Elementos Completos (Nota 200)',
        badgeColor: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 ring-1 ring-emerald-400/40',
        mascotMood: 'celebrating',
        mascotQuote: 'Gabarito total na C5! 5 elementos comprovados matematicamente e fechamento circular perfeito.',
        summary: 'Todos os 5 elementos canônicos completos (5 x 40 = 200 pts) + respeito irrestrito aos Direitos Humanos + Fechamento Circular.',
        inepCriteria: 'Apresenta proposta de intervenção muito bem articulada, detalhada e que respeita os Direitos Humanos (5 elementos completos).',
        practicalExample: {
          type: 'good',
          snippet: 'Infere-se, portanto, a urgência de mitigar esse cenário. Cabe ao Ministério dos Direitos Humanos e da Cidadania — órgão responsável pelas políticas de inclusão nacional — instituir o Programa Nacional de Longevidade Ativa, mediante o financiamento e a ampliação de Centros-Dia Públicos, a fim de proporcionar acolhimento multidisciplinar e suporte integral às famílias. Dessarte, o Brasil poderá assegurar a dignidade humana preconizada na Carta Magna.',
          analysis: '5 Elementos Perfeitos: 1. Agente (MDHC), 2. Detalhamento do Agente ("— órgão responsável pelas políticas de inclusão nacional —"), 3. Ação ("instituir o Programa Nacional..."), 4. Meio/Modo ("mediante o financiamento e a ampliação..."), 5. Efeito ("a fim de proporcionar acolhimento...").'
        },
        howToLevelUp: [
          'Feche o parágrafo com uma frase de Fechamento Circular retomando a alusão da Introdução.',
          'Revise se os 5 elementos estão nítidos e fáceis de identificar pelo corretor.',
          'Garanta que a proposta resolva as duas causas problematizadas no D1 e no D2.'
        ],
        fatalTraps: ['Proposta desconectada dos problemas do desenvolvimento', 'Deixar a intervenção com menos de 5 linhas']
      }
    }
  }
];

interface InteractiveCompetencyGuideProps {
  onNavigateToStudy?: () => void;
  onNavigateToPractice?: () => void;
  onNavigateToCorrection?: () => void;
  currentScores?: { c1: number; c2: number; c3: number; c4: number; c5: number };
}

export const InteractiveCompetencyGuide: React.FC<InteractiveCompetencyGuideProps> = ({
  onNavigateToStudy,
  onNavigateToPractice,
  onNavigateToCorrection,
  currentScores = { c1: 160, c2: 160, c3: 120, c4: 160, c5: 160 }
}) => {
  const [selectedCompId, setSelectedCompId] = useState<number>(1);
  const [selectedScore, setSelectedScore] = useState<number>(200);
  const [diagnosticMode, setDiagnosticMode] = useState<boolean>(false);
  const [userSelectedBaseline, setUserSelectedBaseline] = useState<number>(160);

  const activeComp = COMPETENCIES_STEP_DATA.find(c => c.id === selectedCompId) || COMPETENCIES_STEP_DATA[0];
  const activeLevel = activeComp.levels[selectedScore] || activeComp.levels[200];

  // Quick helper to jump to current score
  const handleJumpToCurrent = (score: number) => {
    // nearest valid score in (0, 40, 80, 120, 160, 200)
    const validScores = [0, 40, 80, 120, 160, 200];
    const closest = validScores.reduce((prev, curr) => 
      Math.abs(curr - score) < Math.abs(prev - score) ? curr : prev
    );
    setSelectedScore(closest);
  };

  const getCompScoreProp = (id: number) => {
    switch (id) {
      case 1: return currentScores.c1;
      case 2: return currentScores.c2;
      case 3: return currentScores.c3;
      case 4: return currentScores.c4;
      case 5: return currentScores.c5;
      default: return 160;
    }
  };

  const scoreButtons: (0 | 40 | 80 | 120 | 160 | 200)[] = [0, 40, 80, 120, 160, 200];

  return (
    <div id="interactive-competency-guide-container" className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-900 dark:text-amber-300 border border-amber-400/40">
                Guia Oficial Interativo
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">Matriz INEP 0 a 200 pts</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2 mt-0.5">
              <span>Passo a Passo das 5 Competências</span>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hidden sm:inline-block">com Mestre Corujito</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl mt-0.5">
              Descubra o que a banca examinadora exige em cada faixa de nota, identifique onde você está e aplique a rota prática para subir de nível rumo aos 1000 pontos.
            </p>
          </div>
        </div>

        {/* Action Toggle Diagnostic Mode */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <button
            id="guide-btn-my-score"
            onClick={() => handleJumpToCurrent(getCompScoreProp(selectedCompId))}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
            <span>Meu Nível Atual ({getCompScoreProp(selectedCompId)} pts)</span>
          </button>
          
          <button
            id="guide-btn-view-200"
            onClick={() => setSelectedScore(200)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedScore === 200 
                ? 'bg-emerald-500 text-white shadow-xs' 
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Padrão 200 pts</span>
          </button>
        </div>
      </div>

      {/* Competencies Horizontal Tabs (C1 to C5) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {COMPETENCIES_STEP_DATA.map((comp) => {
          const isSelected = comp.id === selectedCompId;
          const currentStudentScore = getCompScoreProp(comp.id);
          return (
            <button
              key={comp.id}
              id={`comp-tab-${comp.code.toLowerCase()}`}
              onClick={() => {
                setSelectedCompId(comp.id);
              }}
              className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/90 dark:bg-indigo-950/70 text-indigo-950 dark:text-indigo-100 shadow-xs ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                  isSelected 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                }`}>
                  {comp.code}
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  {currentStudentScore} pts
                </span>
              </div>
              <p className="text-xs font-bold line-clamp-1 leading-snug">
                {comp.title.split('&')[0].replace('Domínio da ', '')}
              </p>
              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Competency Pillar Header */}
      <div className="bg-slate-50/80 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
              {activeComp.code} • {activeComp.title}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {activeComp.subtitle}
          </p>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm sm:text-right italic">
          "{activeComp.pillarSummary}"
        </div>
      </div>

      {/* Interactive Step-by-Step Score Ladder */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Selecione a Nota na Matriz Oficial:</span>
          </label>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Clique nos degraus para ver o que muda
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {scoreButtons.map((score) => {
            const isCurrentSelected = selectedScore === score;
            const levelData = activeComp.levels[score];
            const isTop = score === 200;
            const isZero = score === 0;

            return (
              <button
                key={score}
                id={`score-step-btn-${score}`}
                onClick={() => setSelectedScore(score)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 relative ${
                  isCurrentSelected
                    ? isTop 
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-300 dark:ring-emerald-700'
                      : isZero
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md ring-2 ring-rose-300'
                        : 'bg-indigo-600 text-white border-indigo-500 shadow-md ring-2 ring-indigo-300'
                    : 'bg-slate-50 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-indigo-50/40 dark:hover:bg-slate-750'
                }`}
              >
                <span className="text-lg sm:text-xl font-black tracking-tight">
                  {score}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  isCurrentSelected ? 'text-white/90' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  Nível {levelData.level}
                </span>

                {isTop && (
                  <span className="absolute -top-2 right-2 px-1.5 py-0.2 bg-amber-400 text-amber-950 font-black text-[9px] rounded-full shadow-2xs">
                    MAX
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Showcase: Mestre Corujito Voice + Practical INEP Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Mestre Corujito Card with Speech Bubble (4 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-[2rem] p-6 shadow-md border border-indigo-800/60 flex flex-col justify-between relative overflow-hidden min-h-[380px]">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">
                  Conselho do Mestre
                </span>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${activeLevel.badgeColor}`}>
                {activeLevel.badgeLabel}
              </span>
            </div>

            {/* Mascot Avatar & Speech Bubble */}
            <div className="flex items-center gap-4 pt-1">
              <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner shrink-0">
                <EnemasterMascot size="lg" mood={activeLevel.mascotMood} />
              </div>
              <div>
                <p className="text-xs font-black text-amber-300">Mestre Corujito</p>
                <p className="text-[11px] text-indigo-200">Avaliador Oficial da Banca</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-300 font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Critério INEP {activeComp.code}</span>
                </div>
              </div>
            </div>

            {/* Quote Bubble */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-inner">
              <p className="text-xs sm:text-sm text-indigo-50 font-serif leading-relaxed italic">
                "{activeLevel.mascotQuote}"
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                Definição Oficial da Matriz:
              </p>
              <p className="text-xs text-indigo-100/90 leading-relaxed font-sans">
                {activeLevel.inepCriteria}
              </p>
            </div>
          </div>

          {/* Quick Action in Mascot Card */}
          <div className="relative z-10 pt-4 mt-4 border-t border-indigo-800/60 flex items-center justify-between gap-2">
            <span className="text-[11px] text-indigo-300">Quer testar seu texto?</span>
            <button
              onClick={onNavigateToCorrection}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs transition-all shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <span>Ir para o Corretor</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Background Ambient Glow */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Right Column: Detailed Practical Analysis & Level Up Blueprint (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Box 1: Practical Example (O que o INEP Enxerga) */}
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Exemplo Prático Analisado pela Banca</span>
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                activeLevel.practicalExample.type === 'good'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : activeLevel.practicalExample.type === 'bad'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {activeLevel.practicalExample.type === 'good' ? 'Padrão Nota 1000' : 'Trecho com Falhas'}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 font-serif text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic">
              "{activeLevel.practicalExample.snippet}"
            </div>

            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 bg-indigo-50/60 dark:bg-slate-850 p-3 rounded-xl border border-indigo-100/80 dark:border-slate-800">
              <span className="font-bold text-indigo-700 dark:text-indigo-300 shrink-0">Diagnóstico do Corretor:</span>
              <span>{activeLevel.practicalExample.analysis}</span>
            </div>
          </div>

          {/* Box 2: How to Level Up (O Salto de Nível) */}
          <div className="bg-gradient-to-br from-emerald-50/60 to-white dark:from-emerald-950/20 dark:to-slate-900 rounded-2xl p-5 border border-emerald-200/80 dark:border-emerald-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Como Subir de Nível (O Salto para os 200 pontos)</span>
              </span>
              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                Plano de Ação
              </span>
            </div>

            <div className="space-y-2">
              {activeLevel.howToLevelUp.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="leading-snug">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Box 3: Fatal Traps to Avoid (Armadilhas que rebaixam a nota) */}
          <div className="bg-rose-50/40 dark:bg-rose-950/20 rounded-2xl p-4 border border-rose-200/80 dark:border-rose-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Armadilhas Fatais a Evitar:</span>
              </span>
              <div className="flex items-center gap-2 flex-wrap text-xs text-rose-900 dark:text-rose-200">
                {activeLevel.fatalTraps.map((trap, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 text-[11px] font-semibold">
                    &bull; {trap}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={onNavigateToPractice}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-xs font-bold text-rose-800 dark:text-rose-300 transition-all flex items-center justify-center gap-1 shrink-0 cursor-pointer"
            >
              <span>Treinar Diagnósticos</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Summary Bar with Direct Navigation */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Matriz homologada conforme a Cartilha do Participante e Módulos de Correção Oficiais do INEP.</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToStudy}
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Simulador & Checklist Completo de Evidências</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
