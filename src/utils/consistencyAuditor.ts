import {
  AuditConcessionItem,
  C1Deviation,
  Competencia5Elements,
  CompetenciaEvaluation,
  ConsistencyContradiction,
  DiagnosticConsistencyAuditReport,
  EssayAuditLog,
  EvidenceCrossValidationItem,
  EvidenceCrossValidationReport,
  PedagogicalRewrite,
  ReviewerAuditReport
} from '../types';

const AUDIT_RULE_TITLES_PT: Record<string, string> = {
  EXCERPT_NOT_FOUND_IN_ESSAY: 'Trecho citado não localizado no texto',
  EXCERPT_TRUNCATED_IN_ERROR_CLAIM: 'Trecho citado estava incompleto',
  LOCATION_MISMATCH: 'Parágrafo indicado foi conferido',
  C1_IDENTICAL_CORRECTION: 'Sugestão igual ao texto original',
  C1_FALSE_ANAPHORIC_MESMO: 'Uso de "o mesmo" não encontrado no texto',
  C1_FALSE_MISSING_CRASE: 'Crase já está presente no trecho',
  C1_FALSE_IMPROPER_CRASE: 'Uso de crase conferido no trecho',
  C1_FALSE_ORTHOGRAPHY_CLAIM: 'Grafia conferida como correta',
  C1_FALSE_MISSING_COMMA: 'Vírgula já está presente no trecho',
  C1_FALSE_ORALITY_CLAIM: 'Sem marca de oralidade nesse trecho',
  C2_FALSE_ABSENCE_OF_REPERTOIRE: 'Repertório sociocultural encontrado no texto',
  C2_FALSE_MISSING_DEV_REPERTOIRE: 'Repertório encontrado no desenvolvimento',
  C2_CONCLUSION_AGENCY_TREATED_AS_REPERTOIRE: 'Órgão da conclusão não conta como repertório',
  C3_FALSE_D1_D2_REPETITION: 'Argumentos de D1 e D2 são diferentes',
  C3_ARTIFICIAL_AUTHORSHIP_CRITERION: 'Critério de autoria alinhado ao INEP',
  C3_SCORE_200_WITH_REWRITE: 'Nota máxima comparada com sugestão de melhoria',
  C3_EVIDENCE_SEMANTIC_MISMATCH: 'Trecho ajustado para o desenvolvimento',
  C3_FEEDBACK_NOT_GROUNDED_IN_FACTS: 'Resumo da C3 alinhado a D1 e D2',
  C4_FALSE_MISSING_CONNECTIVE: 'Conectivo de abertura presente no texto',
  C4_FALSE_ONDE_CLAIM: 'Palavra "onde" não aparece no texto',
  C4_FALSE_ANAPHORIC_MESMO: 'Uso de "o mesmo" não aparece no texto',
  C4_FALSE_CONNECTIVE_REPETITION: 'Quantidade de conectivos conferida',
  C5_FALSE_MISSING_ACTION: 'Ação da proposta encontrada na conclusão',
  C5_FALSE_MISSING_AGENT: 'Agente da proposta encontrado na conclusão',
  C5_FALSE_MISSING_MODE: 'Meio/modo encontrado na conclusão',
  C5_FALSE_MISSING_EFFECT: 'Finalidade encontrada na conclusão',
  C5_FALSE_MISSING_DETAILING: 'Detalhamento encontrado na conclusão',
  C5_FALSE_HUMAN_RIGHTS_VIOLATION: 'Proposta respeita os Direitos Humanos',
  C5_EVIDENCE_SEMANTIC_MISMATCH: 'Trecho ajustado para a conclusão',
  C5_FEEDBACK_NOT_GROUNDED_IN_FACTS: 'Resumo da C5 alinhado à conclusão',
  SCORE_200_JUSTIFICATION_CONTRADICTION: 'Nota 200 conferida com os apontamentos',
  LOW_SCORE_PRAISE_CONTRADICTION: 'Nota conferida com o comentário',
  TOTAL_SCORE_SUM_MISMATCH: 'Soma total das competências conferida',
  REVIEWER_200_WITH_FLAW: 'Revisão da nota 200 conferida',
  REVIEWER_EXCERPT_NOT_FOUND: 'Trecho da revisão conferido no texto',
  REWRITE_EXCERPT_NOT_FOUND: 'Trecho da reescrita conferido no texto',
  REWRITE_EXCERPT_TRUNCATED: 'Trecho da reescrita completado',
  COMPETENCY_EXCERPT_NOT_FOUND: 'Trecho da competência ajustado ao texto',
  COMPETENCY_EVIDENCE_SEMANTIC_MISMATCH: 'Trecho alinhado à competência avaliada'
};

export function getFriendlyAuditTitlePt(ruleCode: string): string {
  return AUDIT_RULE_TITLES_PT[ruleCode] || 'Conferência automática do texto';
}

export interface AuditInputPayload {
  totalScore?: number | null;
  competencies?: {
    c1?: Partial<CompetenciaEvaluation>;
    c2?: Partial<CompetenciaEvaluation>;
    c3?: Partial<CompetenciaEvaluation>;
    c4?: Partial<CompetenciaEvaluation>;
    c5?: Partial<CompetenciaEvaluation>;
  };
  c1Deviations?: C1Deviation[];
  c5Structure?: Partial<Competencia5Elements>;
  pedagogicalRewrites?: Array<Partial<PedagogicalRewrite> & { competencyNum?: number }>;
  top3Problems?: string[];
  auditLog?: Partial<EssayAuditLog>;
  reviewerReport?: Partial<ReviewerAuditReport>;
  thematicAudit?: {
    classification?: string;
    hasRealThematicRelation?: boolean;
    consistencyJustification?: string;
  };
  argumentativeAndCohesionAudit?: {
    c2RepertoireUsage?: string;
    c2RepertoireEvidence?: string;
    c2HasRepertoireInDevelopment?: boolean;
    c3HasCrossParagraphRepetition?: boolean;
    c3HasCausalAndConsequentialDepth?: boolean;
    c5DetailingIsDistinctAndSpecific?: boolean;
  };
}

interface ExcerptLocationResult {
  found: boolean;
  wasTruncated: boolean;
  cleanedProbe: string;
  allParagraphIndices: number[];
  firstParagraphIndex: number;
  firstSentenceContext: string;
}

const DESCRIPTIVE_PLACEHOLDER_PATTERNS = [
  /^trecho\s+sob\s+an[áa]lise/i,
  /^argumenta[çc][ãa]o\s+central\s+e\s+encadeamento/i,
  /^estrutura\s+do\s+par[áa]grafo\s+inicial/i,
  /^articula[çc][ãa]o\s+e\s+retomada\s+referencial/i,
  /^proposta\s+de\s+interven[çc][ãa]o\s+e\s+detalhamento/i,
  /^trecho\s+tem[áa]tico\s*\/\s*repert[óo]rio\s+analisado/i,
  /^trecho\s+sint[áa]tico\s+avaliado/i,
  /^repert[óo]rio\s+sociocultural\s+demonstrado/i,
  /^encadeamento\s+de\s+causa\s+e\s+efeito/i,
  /^operador\s+interpar[áa]grafo\s+e\s+articula[çc][ãa]o/i,
  /^ocorr[êe]ncias?\s+retiradas?\s+do\s+texto/i,
  /^nenhum\s+desvio/i,
  /^desenvolvimento\s+argumentativo$/i,
  /^articula[çc][ãa]o\s+textual$/i,
  /^texto\s+da\s+reda[çc][ãa]o$/i
];

function isDescriptivePlaceholder(snippet: string): boolean {
  const clean = (snippet || '').trim().replace(/^["'«“]+|["'»”]+$/g, '').trim();
  if (!clean || clean.length < 4) return true;
  return DESCRIPTIVE_PLACEHOLDER_PATTERNS.some((re) => re.test(clean));
}

function stripLocationPrefix(raw: string): { cleaned: string; declaredParaIndex: number | null } {
  let text = String(raw || '').trim();
  let declaredParaIndex: number | null = null;

  const prefixMatch = text.match(/^\[\s*Par[áa]grafo\s+(\d+)(?:[^\]]*)\]\s*:?\s*(.*)$/is);
  if (prefixMatch) {
    declaredParaIndex = parseInt(prefixMatch[1], 10);
    text = prefixMatch[2].trim();
  } else {
    const refPrefix = text.match(/^Refer[êe]ncia\s*\(\s*Par[áa]grafo\s+(\d+)[^)]*\)\s*:?\s*[^->]*->\s*["'“]?(.+?)["'”]?$/is);
    if (refPrefix) {
      declaredParaIndex = parseInt(refPrefix[1], 10);
      text = refPrefix[2].trim();
    }
  }

  text = text.replace(/^Trecho(?:\s+tangencial|\s+que\s+viola[^:]*)?\s*:\s*/i, '').trim();
  text = text.replace(/^["'«“]+|["'»”]+$/g, '').trim();
  return { cleaned: text, declaredParaIndex };
}

function normalizeForMatch(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/[“”«»]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function locateExcerptParagraphs(rawSnippet: string, essayText: string): ExcerptLocationResult {
  const { cleaned } = stripLocationPrefix(rawSnippet);
  const wasTruncated = /(\.\.\.|…|\[…\]|\[\.\.\.\])/.test(cleaned);
  const probe = cleaned.replace(/^(\.\.\.|…)+\s*/, '').replace(/\s*(\.\.\.|…)+$/, '').trim();

  const empty: ExcerptLocationResult = {
    found: false,
    wasTruncated,
    cleanedProbe: probe,
    allParagraphIndices: [],
    firstParagraphIndex: 0,
    firstSentenceContext: ''
  };

  if (!probe || probe.length < 3 || !essayText.trim()) return empty;

  const paragraphs = essayText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const effectiveParagraphs = paragraphs.length > 0 ? paragraphs : [essayText.trim()];
  const normProbe = normalizeForMatch(probe);
  const matchedIndices: number[] = [];
  let firstSentenceContext = '';

  for (let pIdx = 0; pIdx < effectiveParagraphs.length; pIdx++) {
    const para = effectiveParagraphs[pIdx];
    const normPara = normalizeForMatch(para);
    if (normPara.includes(normProbe)) {
      matchedIndices.push(pIdx + 1);
      if (!firstSentenceContext) {
        const sentences = para.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
        const foundSent = sentences.find((s) => normalizeForMatch(s).includes(normProbe));
        firstSentenceContext = foundSent || para;
      }
    }
  }

  if (matchedIndices.length === 0) {
    const normFull = normalizeForMatch(essayText);
    if (normFull.includes(normProbe)) {
      matchedIndices.push(1);
      firstSentenceContext = probe;
    }
  }

  return {
    found: matchedIndices.length > 0,
    wasTruncated,
    cleanedProbe: probe,
    allParagraphIndices: matchedIndices,
    firstParagraphIndex: matchedIndices[0] || 0,
    firstSentenceContext
  };
}

function extractDeclaredParagraphIndex(text: string, totalParagraphs: number): number | null {
  if (!text) return null;
  const tagMatch = text.match(/\[\s*Par[áa]grafo\s+(\d+)/i) || text.match(/\bno\s+par[áa]grafo\s+(\d+)/i) || text.match(/\bpar[áa]grafo\s+(\d+)\b/i);
  if (tagMatch) {
    const n = parseInt(tagMatch[1], 10);
    if (n >= 1 && n <= Math.max(1, totalParagraphs)) return n;
  }
  if (/\b(?:na\s+introdu[çc][ãa]o|no\s+1[º°]\s+par[áa]grafo|no\s+primeiro\s+par[áa]grafo)\b/i.test(text)) {
    return 1;
  }
  if (totalParagraphs >= 3 && /\b(?:no\s+d1|no\s+primeiro\s+desenvolvimento|no\s+2[º°]\s+par[áa]grafo|no\s+segundo\s+par[áa]grafo)\b/i.test(text)) {
    return 2;
  }
  if (totalParagraphs >= 4 && /\b(?:no\s+d2|no\s+segundo\s+desenvolvimento|no\s+3[º°]\s+par[áa]grafo|no\s+terceiro\s+par[áa]grafo)\b/i.test(text)) {
    return 3;
  }
  if (totalParagraphs >= 3 && /\b(?:na\s+conclus[ãa]o|no\s+[úu]ltimo\s+par[áa]grafo)\b/i.test(text)) {
    return totalParagraphs;
  }
  return null;
}

/**
 * Remove cláusulas negadas ou de explicação de regra geral para evitar falsos positivos
 * (ex.: "sem marcas de oralidade", "ausência de repetição", "não há violação aos direitos humanos").
 */
function stripNegationsAndRuleExplanations(text: string): string {
  if (!text) return '';
  return text
    .replace(/\b(?:sem|aus[êe]ncia\s+(?:de|total\s+de)?|inexist[êe]ncia\s+de|livre\s+de|isen[çc][ãa]o\s+de|controle\s+de|evit(?:e|ar|ando)|n[ãa]o\s+(?:h[áa]|apresenta|possui|constam?|foram\s+encontrad[oa]s|foram\s+identificad[oa]s|se\s+verifica|confundir|penaliz\w*|exige|zera))\s+(?:[oa]s?\s+|qualquer\s+)?[^.;!\n]{0,110}/giu, ' ')
    .replace(/\b(?:para\s+(?:200|atingir\s+200|alcan[çc]ar\s+200|nota\s+m[áa]xima)|a\s+matriz\s+(?:do\s+inep|oficial)\s+exige|regra\s+(?:oficial|fundamental)\s+do\s+inep)\b[^.;!\n]{0,140}/giu, ' ')
    .replace(/\b[A-Za-zÀ-ÿ/]+\s*\(✓\)/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findAnaphoricMesmoMatches(text: string): string[] {
  const cleanText = (text || '').trim();
  if (!cleanText) return [];
  const anaphoricRegex = /\b(?:(?:para|com|entre|sobre|ante|d[eoa]s?|n[eoa]s?|pel[oa]s?|a(?:o|os|[àa]s)?)\s+(?:o|os|a|as)?\s*mesm(?:o|os|a|as)(?!\s+(?:tempo|sentido|modo|jeito|n[íi]vel|patamar|grau|caso|problema|fen[ôo]meno|tema|assunto|local|espa[çc]o|contexto|passo|dia|ano|momento|aspecto|fator|tipo|direito|valor|princ[íi]pio|objetivo|forma|maneira|medida|caminh(?:o|os)|ponto|eixo|mecanismo|padr[ãa]o|cen[áa]rio|impacto|efeito|papel|processo|sistema|recurso|grupo|p[úu]blico|setor)\b)|(?:o|os|a|as)\s+mesm(?:o|os|a|as)\s+(?:foi|foram|[ée]|s[ãa]o|tem|t[êe]m|fez|fizeram|pode|podem|deve|devem|acaba|acabam|gera|geram|causa|causam|se|n[ãa]o|est[áa]|est[ãa]o|passa|passam|precisa|precisam|sofre|sofrem))\b/giu;
  return cleanText.match(anaphoricRegex) || [];
}

function findOralOrVagueMatches(text: string): string[] {
  const regex = /\b(no\s+dia\s+a\s+dia|por\s+causa\s+(?:d[eao]s?|disso|daquilo|que)|tomar\s+medidas|acaba[m]?\s+(?:gerando|causando|trazendo|ficando|sendo|levando|fazendo|prejudicando|afetando|resultando)|coisas?|hoje\s+em\s+dia|nos\s+dias\s+de\s+hoje|a\s+gente|tipo\s+assim|desse\s+jeito|muita\s+gente|fazer\s+algo|muito\s+ruim|muito\s+bom|pra\s+(?:fazer|garantir|resolver|evitar|isso|que|quem))\b/giu;
  return (text || '').match(regex) || [];
}

const REP_SCHOLAR_OR_CULTURE_REGEX = /(segundo|conforme|de acordo com|filósofo|filósofa|sociólogo|socióloga|antropólogo|antropóloga|geógrafo|geógrafa|economista|educador|educadora|teórico|teórica|psiquiatra|médico|médica|professor|professora|jurista|escritor|escritora|cientista|pesquisador|pesquisadora|pensador|pensadora|ibge|ipea|onu|oms|unesco|século|historiador|historiadora|literatura|obra|livro|romance|documentário|filme|poema|machado de assis|habermas|bauman|durkheim|foucault|kant|aristóteles|platão|locke|rousseau|hannah arendt|sartre|gilberto freyre|sergio buarque|sérgio buarque|simone de beauvoir|norberto bobbio|carolina maria de jesus|conceição evaristo|lélia gonzalez|djamila ribeiro|stefan zweig|thomas hobbes|pierre bourdieu|milton santos|thomas piketty|thomas marshall|darcy ribeiro|paulo freire|silvio almeida|frantz fanon|florestan fernandes|elijah anderson|heleieth saffioti|silvia federici|joan robinson|david harvey|jean de la bruyère|shoshana zuboff|erving goffman|nise da silveira|ulrich beck|gayatri spivak|claude lévi-strauss|josé afonso da silva|thomas more|vidas secas|cidadão de papel|byung-chul han|ailton krenak|1984|admirável mundo novo|quarto de despejo|artaud|antonin artaud|emile durkheim|émile durkheim|graciliano ramos|monte[i]?ro lobato|drummond|guimarães rosa|clarice lispector|john dewey|anísio teixeira|adam smith|karl marx|max weber|montesquieu|maquiavel|walter benjamin|adorno|marcuse|chomsky|seneca|sêneca|sócrates|platão|hipócrates|revolução industrial|iluminismo|renascimento|era vargas|ditadura militar|constituição de 1988|constituicao de 1988|carta magna)/i;
const REP_LAW_OR_INSTITUTION_REGEX = /(constituição|carta magna|artigo\s+\d+|cf\/88|declaração universal|estatuto\s+d[oa]|lei\s+\d|código\s+(?:penal|civil))/i;
const REPERTOIRE_CUE_REGEX = /(segundo|conforme|de acordo|constitui[çc][ãa]o|artigo|ibge|ipea|onu|oms|unesco|estatuto|lei\b|fil[óo]sof|soci[óo]log|historiador|ge[óo]graf|economista|educador|te[óo]ric|psiquiatra|jurista|escritor|professor|cientista|pesquisador|pensador|obra|livro|filme|s[ée]rie|document[áa]rio|poema|autor|autora|teoria|conceito|pesquisa|dados|estudo|s[ée]culo|d[ée]cada)/i;

function isConclusionProposalAgencyOnly(txt: string): boolean {
  return (
    /\b(portanto|logo|assim|dessa\s+forma|desse\s+modo|cabe\s+a[oa]?|deve\s+(?:criar|implementar|promover|ampliar|realizar|fiscalizar|garantir|investir)|por\s+meio\s+de)\b/i.test(txt) &&
    /\b(minist[ée]rio|secretaria|governo|poder\s+executivo|lei|estatuto|c[óo]digo)\b/i.test(txt) &&
    !/\b(fil[óo]sof|soci[óo]log|historiador|ge[óo]graf|economista|educador|te[óo]ric|psiquiatra|ibge|ipea|unesco|oms|onu|machado|bauman|foucault|bourdieu|arendt|durkheim|kant|hobbes|locke|rousseau|habermas|paulo\s+freire|milton\s+santos|vidas\s+secas)\b/i.test(txt)
  );
}

function paragraphHasValidRepertoire(paraText: string, role: 'intro' | 'dev' | 'conclusion'): boolean {
  if (!paraText) return false;
  if (REP_SCHOLAR_OR_CULTURE_REGEX.test(paraText)) return true;
  if (role === 'conclusion') return false;
  return REP_LAW_OR_INSTITUTION_REGEX.test(paraText);
}

function detectLiteralD1D2Repetition(d1: string, d2: string): boolean {
  if (!d1 || !d2) return false;
  const genericStop = new Set([
    'sobre', 'entre', 'porque', 'assim', 'desse', 'dessa', 'nesse', 'nessa', 'forma', 'maneira',
    'ainda', 'outros', 'outras', 'muito', 'todos', 'todas', 'tambem', 'apenas', 'atraves',
    'social', 'brasil', 'estado', 'governo', 'sociedade', 'problema', 'pessoas', 'cidadaos',
    'brasileiro', 'brasileira', 'contexto', 'realidade', 'cenario', 'portanto',
    'ademais', 'outrossim', 'entanto', 'todavia', 'contudo', 'porem',
    'causa', 'efeito', 'consequencia', 'impasse', 'questao', 'desafio'
  ]);
  const extractStems = (txt: string) =>
    new Set(
      (txt || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length >= 6 && !genericStop.has(w))
        .map((w) => w.slice(0, 6))
    );
  const s1 = extractStems(d1);
  const s2 = extractStems(d2);
  if (s1.size < 6 || s2.size < 6) return false;
  const shared = Array.from(s1).filter((s) => s2.has(s));
  const minRatio = shared.length / Math.min(s1.size, s2.size);
  const unionSize = new Set([...s1, ...s2]).size;
  const jaccard = unionSize > 0 ? shared.length / unionSize : 0;

  const axisGroups = [
    /\b(estado|govern|lei|legisl|constitui|fiscaliza|verba|or[çc]ament|pol[íi]tica\s+p[úu]blica|administrativ|jur[íi]dic|estatal|minist[ée]rio|poder\s+p[úu]blico)\b/i,
    /\b(educa[çc][ãa]o|escola|ensino|pedag[óo]gic|informa[çc][ãa]o|conscientiza|alfabetiza|forma[çc][ãa]o|universidade)\b/i,
    /\b(cultura|preconceit|estigma|estere[óo]tipo|comportament|mentalidade|fam[íi]lia|hist[óo]ric|patrimonial|machism|racism)\b/i,
    /\b(econom|renda|desigualdade|pobreza|mercado|consumo|lucro|empresa|capital|trabalho|emprego|infraestrutura|saneamento)\b/i,
    /\b(m[íi]dia|rede\s+social|internet|algoritmo|tecnologia|digital|televis|imprensa|publicidade|desinforma)\b/i
  ];
  const d1Axes = axisGroups.map((re, idx) => (re.test(d1) ? idx : -1)).filter((x) => x >= 0);
  const d2Axes = axisGroups.map((re, idx) => (re.test(d2) ? idx : -1)).filter((x) => x >= 0);
  const hasDistinctAxis = d1Axes.some((a) => !d2Axes.includes(a)) || d2Axes.some((a) => !d1Axes.includes(a));
  if (hasDistinctAxis && minRatio < 0.78) return false;
  return minRatio >= 0.72 && jaccard >= 0.52;
}

const D1_D2_OPENING_OP_REGEX = /^(?:em\s+primeir[ao]\s+(?:an[áa]lise|lugar|plano|inst[âa]ncia)|em\s+segund[ao]\s+(?:an[áa]lise|lugar|plano|inst[âa]ncia)|primeiramente|segundamente|inicialmente|a\s+princ[íi]pio|de\s+in[íi]cio|antes\s+de\s+tudo|sob\s+ess[ea]\s+(?:[óo]tica|prisma|vi[ée]s|perspectiva|aspecto)|sob\s+est[ea]\s+(?:[óo]tica|prisma|vi[ée]s|perspectiva)|ness[ea]\s+(?:contexto|sentido|cen[áa]rio|vi[ée]s|perspectiva|seara|[âa]mbito|l[óo]gica|realidade|conjuntura)|diante\s+d(?:esse|isso|essa|o\s+exposto|a\s+situa[çc][ãa]o)|ademais|outrossim|al[ée]m\s+disso|soma-se\s+a\s+isso|somado\s+a\s+isso|acrescenta-se|paralelamente|por\s+outro\s+lado|em\s+contrapartida|contudo|todavia|entretanto|no\s+entanto|não\s+obstante|nesse\s+entanto|vale\s+(?:ressaltar|destacar|salientar|pontuar)|cabe\s+(?:ressaltar|destacar|salientar|pontuar|analisar)|conv[ée]m\s+(?:ressaltar|destacar|salientar|analisar)|[ée]\s+(?:preciso|necess[áa]rio|fundamental|imperativo)\s+(?:ressaltar|destacar|analisar|considerar)|com\s+efeito|em\s+vista\s+disso|portanto|desse\s+modo|dessa\s+forma|assim)\b/i;
const CONCL_OPENING_OP_REGEX = /^(?:portanto|logo|dessarte|destarte|dessa\s+forma|desse\s+modo|dessa\s+maneira|em\s+suma|assim|assim\s+sendo|por\s+conseguinte|infere-se|depreende-se|conclui-se|torna-se\s+(?:evidente|imperioso|necess[áa]rio)|urgem?\s+medidas|diante\s+d(?:o\s+exposto|esse\s+cen[áa]rio|isso|essa\s+realidade)|frente\s+a\s+esse\s+cen[áa]rio|sendo\s+assim|em\s+virtude\s+d(?:isso|esse))\b/i;

function extractC5EvidenceSignals(text: string) {
  const clean = (text || '').trim();
  const hasAgent = /\b(governo\s+federal|governo\s+estadual|governo\s+municipal|governo|estado\s+brasileiro|estado|minist[ée]rios?(?:\s+(?:da|de|do|dos|das)\s+[\p{L}\s]{2,40})?|poder\s+p[úu]blico|poder\s+executivo|poder\s+legislativo|poder\s+judici[áa]rio|congresso\s+nacional|minist[ée]rio\s+p[úu]blico|secretarias?(?:\s+(?:de|da|do)\s+[\p{L}\s]{2,35})?|escolas?|institui[çc][õo]es\s+de\s+ensino|redes?\s+de\s+ensino|universidades?|m[íi]dia\s+(?:brasileira|de\s+massa)?|imprensa|fam[íi]lias?|sociedade\s+civil|sociedade|ongs?|organiza[çc][õo]es\s+n[ãa]o\s+governamentais|prefeituras?|munic[íi]pios?|empresas?|setor\s+privado|[óo]rg[ãa]os\s+competentes|conselhos\s+tutelares|hospitais?|agentes\s+comunit[áa]rios|comunidade\s+escolar|sistema\s+[úu]nico\s+de\s+sa[úu]de|sus)\b/iu.test(clean);
  const propositiveVerbs = '(?:expandir|expanda|expandam|promover|promova|promovam|oferecer|ofere[çc]a|ofere[çc]am|implementar|implemente|implementem|ampliar|amplie|ampliem|desenvolver|desenvolva|desenvolvam|criar|crie|criem|elaborar|elabore|elaborem|garantir|garanta|garantam|viabilizar|viabilize|viabilizem|fomentar|fomente|fomentem|instituir|institua|instituam|refor[çc]ar|reforce|reforcem|intensificar|intensifique|intensifiquem|aplicar|aplique|apliquem|assegurar|assegure|assegurem|estruturar|estruture|estruturem|capacitar|capacite|capacitem|fiscalizar|fiscalize|fiscalizem|investir|invista|invistam|disponibilizar|disponibilize|disponibilizem|estabelecer|estabele[çc]a|estabele[çc]am|proporcionar|proporcione|proporcionem|realizar|realize|realizem|efetivar|efetive|efetivem|inserir|insira|insiram|incluir|inclua|incluam|reformular|reformule|reformulem|democratizar|democratize|democratizem|fortalecer|fortale[çc]a|fortale[çc]am|construir|construa|construam|destinar|destine|destinem|regulamentar|regulamente|regulamentem|coibir|co[íi]ba|co[íi]bam|conscientizar|conscientize|conscientizem)';
  const actionRegex = new RegExp(`(?:\\b(?:deve|devem|deveria|deveriam|cabe|cabem|precisa|precisam|urge|[ée]\\s+(?:preciso|necess[áa]rio|fundamental|imprescind[íi]vel)|torna-se\\s+(?:necess[áa]rio|imperativo|imprescind[íi]vel|urgente))\\b[^.!?;]{0,115}\\b${propositiveVerbs}\\b|\\b${propositiveVerbs}\\b\\s+(?:o|a|os|as|um|uma|uns|umas|projetos?|programas?|pol[íi]ticas?|campanhas?|medidas?|a[çc][õo]es|recursos?|verbas?|investimentos?|leis?|servi[çc]os?|atendimento|acesso|capacita[çc][ãa]o|infraestrutura|fiscaliza[çc][ãa]o|apoio|suporte|ensino|educa[çc][ãa]o|iniciativas?|espa[çc]os?|centros?|oficinas?|debates?|redes?))`, 'iu');
  const hasAction = actionRegex.test(clean);
  const hasMode = /\b(?:por\s+meio\s+(?:de|da|do|dos|das)|mediante(?:\s+(?:o|a|os|as))?|por\s+interm[ée]dio\s+(?:de|da|do|dos|das)|atrav[ée]s\s+(?:de|da|do|dos|das)|com\s+o\s+aux[íi]lio\s+(?:de|da|do)|com\s+o\s+apoio\s+(?:de|da|do)|utilizando|a\s+partir\s+(?:de|da|do|dos|das)|por\s+via\s+(?:de|da|do)|com\s+base\s+(?:em|na|no))\b[^.!?;]{4,}/iu.test(clean);
  const hasEffect = /\b(?:a\s+fim\s+de|com\s+(?:o\s+objetivo|a\s+finalidade|o\s+fito|o\s+intuito)\s+de|no\s+intuito\s+de|para\s+que|visando(?:\s+(?:a|ao|[àa]))?|de\s+modo\s+a|com\s+vistas?\s+(?:a|ao|[àa])|com\s+o\s+prop[óo]sito\s+de|para\s+(?:mitigar|combater|erradicar|garantir|reduzir|diminuir|solucionar|resolver|promover|melhorar|assegurar|evitar|conscientizar|incentivar|ampliar|fortalecer|reverter|superar|minimizar|prevenir|democratizar|incluir|transformar))\b[^.!?;]{4,}/iu.test(clean);
  const hasUnambiguousDetailing = /(?:[—–]\s*[^—–\n]{8,180}?\s*[—–]|\((?=[^()\n]*\S+\s+\S+\s+\S+)[^()\n]{14,160}\)|,\s*(?:(?:[óo]rg[ãa]o|institui[çc][ãa]o|pasta|entidade|autarquia|minist[ée]rio|conselho)\s+(?:que|respons[áa]vel|encarregad|gestor|voltad|federal|estadual|municipal|p[úu]blic)|(?:ferramenta|iniciativa|medida|estrat[ée]gia|espa[çc]o)\s+(?:que|essencial|indispens[áa]vel|voltad|capaz|destinad|respons[áa]vel)|respons[áa]vel\s+por|encarregad[oa]\s+de|(?:o|a)\s+qual\s+\w+|(?:os|as)\s+quais\s+\w+|que\s+(?:visa|tem\s+como|atua|assegura|promove|permite|contempla|ocorrer[áã]o|funcionar[áã]o)|cuj[oa]\s+(?:atribui[çc][ãa]o|fun[çc][ãa]o|papel|objetivo|compet[êe]ncia))[^,.;!?]{5,140}|,\s*(?:a\s+exemplo\s+de|por\s+exemplo|tais\s+como|incluindo|especificamente|sobretudo|especialmente)\s+[^.!?;—()]{6,140}|,\s*(?:haja\s+vista\s+que|uma\s+vez\s+que|visto\s+que)\s+[^.!?;]{8,140}|,\s*(?:o\s+que\s+(?:garantir[áa]|permitir[áa]|assegurar[áa]|reduzir[áa]|diminuir[áa]|promover[áa]|evitar[áa]|possibilitar[áa]|contribuir[áa]|viabilizar[áa]|culminar[áa]|resultar[áa]|trar[áa]|transformar[áa]|reverter[áa])|(?:possibilitando|contribuindo\s+para|assegurando|garantindo|promovendo|permitindo|resultando\s+em|evitando\s+que|alterando|tornando|viabilizando|disponibilizando|articulando|aplicando)\s+)[^.!?;]{6,140}|\b(?:voltad[oa]s?|destinad[oa]s?|direcionad[oa]s?)\s+(?:[àa]s?|aos?|para)\s+(?:estudantes|alunos|jovens|crian[çc]as|fam[íi]lias|comunidades|popula[çc][ãa]o|popula[çc][õo]es|trabalhadores|idosos|mulheres|moradores|professores|docentes|m[ãa]es|cuidadoras|cidad[ãa]os|pessoas\s+em\s+situa[çc][ãa]o|setores)[^.!?;]{3,120}|\b(?:priorizando|com\s+prioridade\s+para|constru[çc][ãa]o\s+priorit[áa]ria|repasse\s+priorit[áa]rio|com\s+cotas\s+obrigat[óo]rias\s+de|inscrit[oa]s\s+no\s+cad[úu]nico|em\s+extrema\s+vulnerabilidade|de\s+baixa\s+renda)|\b(?:nas\s+(?:escolas\s+p[úu]blicas|unidades\s+(?:b[áa]sicas\s+)?de\s+sa[úu]de|periferias|zonas\s+(?:rurais|perif[ée]ricas))|(?:nos|aos)\s+(?:audit[óo]rios\s+escolares|finais\s+de\s+semana|munic[íi]pios\s+sem\s+\w+)|(?:para|em)\s+(?:(?:as?|os?)\s+)?(?:[áa]reas\s+(?:de\s+(?:alta\s+)?vulnerabilidade|perif[ée]ricas)|aldeias\s+remotas|comunidades\s+isoladas|s[íi]tios\s+hist[óo]ricos\s+quilombolas|bibliotecas\s+p[úu]blicas|cidades\s+interioranas|zonas\s+perif[ée]ricas\s+e\s+rurais|tv\s+aberta\s+e\s+plataformas\s+digitais))|\b(?:em\s+tempo\s+integral|no\s+contraturno\s+escolar|funcionamento\s+ininterrupto\s+24\s+horas|teleatendimento\s+[^.!?;]{3,40}gratuito\s+24\s+horas|(?:sess[õo]es|encontros|palestras|oficinas|proje[çc][õo]es|cursos|audi[êe]ncias\s+p[úu]blicas)\s+(?:semanais|mensais|peri[óo]dic[oa]s|bimestrais|semestrais|anuais|obrigat[óo]ri[oa]s)(?:\s+gratuit[oa]s)?|de\s+(?:forma|maneira)\s+(?:gratuita|cont[íi]nua|bimestral|semestral|anual|integrada)|(?:atendimento|emiss[ãa]o)\s+gratuit[oa][^.!?;]{3,80}|(?:com\s+)?monitoramento\s+(?:ativo|por\s+sat[ée]lite)|com\s+(?:equipe\s+multidisciplinar|psic[óo]logos|assistentes\s+sociais|metas\s+(?:anuais|semestrais)|verba\s+vinculada|encontros\s+(?:semanais|mensais)|debates\s+orientados|atendimento\s+gratuito|unidades\s+m[óo]veis\s+com\s+peritos)|para\s+fins\s+de\s+aposentadoria)\b)/iu.test(clean);

  return { hasAgent, hasAction, hasMode, hasEffect, hasUnambiguousDetailing };
}

function extractDetailedC5Facts(text: string) {
  const clean = (text || '').trim();
  const base = extractC5EvidenceSignals(clean);
  const agentMatch = clean.match(/\b(governo\s+federal|governo\s+estadual|governo\s+municipal|governo|estado\s+brasileiro|estado|minist[ée]rios?(?:\s+(?:da|de|do|dos|das)\s+[\p{L}\s]{2,40})?|poder\s+p[úu]blico|poder\s+executivo|poder\s+legislativo|poder\s+judici[áa]rio|congresso\s+nacional|minist[ée]rio\s+p[úu]blico|secretarias?(?:\s+(?:de|da|do)\s+[\p{L}\s]{2,35})?|escolas?|institui[çc][õo]es\s+de\s+ensino|redes?\s+de\s+ensino|universidades?|m[íi]dia\s+(?:brasileira|de\s+massa)?|imprensa|fam[íi]lias?|sociedade\s+civil|sociedade|ongs?|organiza[çc][õo]es\s+n[ãa]o\s+governamentais|prefeituras?|munic[íi]pios?|empresas?|setor\s+privado|[óo]rg[ãa]os\s+competentes|conselhos\s+tutelares|hospitais?|agentes\s+comunit[áa]rios|comunidade\s+escolar|sistema\s+[úu]nico\s+de\s+sa[úu]de|sus)\b/iu);
  const propositiveVerbs = '(?:expandir|expanda|expandam|promover|promova|promovam|oferecer|ofere[çc]a|ofere[çc]am|implementar|implemente|implementem|ampliar|amplie|ampliem|desenvolver|desenvolva|desenvolvam|criar|crie|criem|elaborar|elabore|elaborem|garantir|garanta|garantam|viabilizar|viabilize|viabilizem|fomentar|fomente|fomentem|instituir|institua|instituam|refor[çc]ar|reforce|reforcem|intensificar|intensifique|intensifiquem|aplicar|aplique|apliquem|assegurar|assegure|assegurem|estruturar|estruture|estruturem|capacitar|capacite|capacitem|fiscalizar|fiscalize|fiscalizem|investir|invista|invistam|disponibilizar|disponibilize|disponibilizem|estabelecer|estabele[çc]a|estabele[çc]am|proporcionar|proporcione|proporcionem|realizar|realize|realizem|efetivar|efetive|efetivem|inserir|insira|insiram|incluir|inclua|incluam|reformular|reformule|reformulem|democratizar|democratize|democratizem|fortalecer|fortale[çc]a|fortale[çc]am|construir|construa|construam|destinar|destine|destinem|regulamentar|regulamente|regulamentem|coibir|co[íi]ba|co[íi]bam|conscientizar|conscientize|conscientizem)';
  const actionMatch = clean.match(new RegExp(`(?:\\b(?:deve|devem|deveria|deveriam|cabe|cabem|precisa|precisam|urge|[ée]\\s+(?:preciso|necess[áa]rio|fundamental|imprescind[íi]vel)|torna-se\\s+(?:necess[áa]rio|imperativo|imprescind[íi]vel|urgente))\\b[^.!?;]{0,115}\\b${propositiveVerbs}\\b[^.!?;]{2,90}|\\b${propositiveVerbs}\\b\\s+(?:o|a|os|as|um|uma|uns|umas|projetos?|programas?|pol[íi]ticas?|campanhas?|medidas?|a[çc][õo]es|recursos?|verbas?|investimentos?|leis?|servi[çc]os?|atendimento|acesso|capacita[çc][ãa]o|infraestrutura|fiscaliza[çc][ãa]o|apoio|suporte|ensino|educa[çc][ãa]o|iniciativas?|espa[çc]os?|centros?|oficinas?|debates?|redes?)[^.!?;]{0,80})`, 'iu'));
  const modeMatch = clean.match(/\b(?:por\s+meio\s+(?:de|da|do|dos|das)|mediante(?:\s+(?:o|a|os|as))?|por\s+interm[ée]dio\s+(?:de|da|do|dos|das)|atrav[ée]s\s+(?:de|da|do|dos|das)|com\s+o\s+aux[íi]lio\s+(?:de|da|do)|com\s+o\s+apoio\s+(?:de|da|do)|utilizando|a\s+partir\s+(?:de|da|do|dos|das)|por\s+via\s+(?:de|da|do)|com\s+base\s+(?:em|na|no))\b[^.!?;,]{4,100}/iu);
  const effectMatch = clean.match(/\b(?:a\s+fim\s+de|com\s+(?:o\s+objetivo|a\s+finalidade|o\s+fito|o\s+intuito)\s+de|no\s+intuito\s+de|para\s+que|visando(?:\s+(?:a|ao|[àa]))?|de\s+modo\s+a|com\s+vistas?\s+(?:a|ao|[àa])|com\s+o\s+prop[óo]sito\s+de|para\s+(?:mitigar|combater|erradicar|garantir|reduzir|diminuir|solucionar|resolver|promover|melhorar|assegurar|evitar|conscientizar|incentivar|ampliar|fortalecer|reverter|superar|minimizar|prevenir|democratizar|incluir|transformar))\b[^.!?;]{4,110}/iu);
  const detailingMatch = clean.match(/(?:[—–]\s*[^—–\n]{8,180}?\s*[—–]|\((?=[^()\n]*\S+\s+\S+\s+\S+)[^()\n]{14,160}\)|,\s*(?:(?:[óo]rg[ãa]o|institui[çc][ãa]o|pasta|entidade|autarquia|minist[ée]rio|conselho)\s+(?:que|respons[áa]vel|encarregad|gestor|voltad|federal|estadual|municipal|p[úu]blic)|(?:ferramenta|iniciativa|medida|estrat[ée]gia|espa[çc]o)\s+(?:que|essencial|indispens[áa]vel|voltad|capaz|destinad|respons[áa]vel)|respons[áa]vel\s+por|encarregad[oa]\s+de|(?:o|a)\s+qual\s+\w+|(?:os|as)\s+quais\s+\w+|que\s+(?:visa|tem\s+como|atua|assegura|promove|permite|contempla|ocorrer[áã]o|funcionar[áã]o)|cuj[oa]\s+(?:atribui[çc][ãa]o|fun[çc][ãa]o|papel|objetivo|compet[êe]ncia))[^,.;!?]{5,140}|,\s*(?:a\s+exemplo\s+de|por\s+exemplo|tais\s+como|incluindo|especificamente|sobretudo|especialmente)\s+[^.!?;—()]{6,140}|,\s*(?:haja\s+vista\s+que|uma\s+vez\s+que|visto\s+que)\s+[^.!?;]{8,140}|,\s*(?:o\s+que\s+(?:garantir[áa]|permitir[áa]|assegurar[áa]|reduzir[áa]|diminuir[áa]|promover[áa]|evitar[áa]|possibilitar[áa]|contribuir[áa]|viabilizar[áa]|culminar[áa]|resultar[áa]|trar[áa]|transformar[áa]|reverter[áa])|(?:possibilitando|contribuindo\s+para|assegurando|garantindo|promovendo|permitindo|resultando\s+em|evitando\s+que|alterando|tornando|viabilizando|disponibilizando|articulando|aplicando)\s+)[^.!?;]{6,140}|\b(?:voltad[oa]s?|destinad[oa]s?|direcionad[oa]s?)\s+(?:[àa]s?|aos?|para)\s+(?:estudantes|alunos|jovens|crian[çc]as|fam[íi]lias|comunidades|popula[çc][ãa]o|popula[çc][õo]es|trabalhadores|idosos|mulheres|moradores|professores|docentes|m[ãa]es|cuidadoras|cidad[ãa]os|pessoas\s+em\s+situa[çc][ãa]o|setores)[^.!?;]{3,120}|\b(?:priorizando|com\s+prioridade\s+para|constru[çc][ãa]o\s+priorit[áa]ria|repasse\s+priorit[áa]rio|com\s+cotas\s+obrigat[óo]rias\s+de|inscrit[oa]s\s+no\s+cad[úu]nico|em\s+extrema\s+vulnerabilidade|de\s+baixa\s+renda)|\b(?:nas\s+(?:escolas\s+p[úu]blicas|unidades\s+(?:b[áa]sicas\s+)?de\s+sa[úu]de|periferias|zonas\s+(?:rurais|perif[ée]ricas))|(?:nos|aos)\s+(?:audit[óo]rios\s+escolares|finais\s+de\s+semana|munic[íi]pios\s+sem\s+\w+)|(?:para|em)\s+(?:(?:as?|os?)\s+)?(?:[áa]reas\s+(?:de\s+(?:alta\s+)?vulnerabilidade|perif[ée]ricas)|aldeias\s+remotas|comunidades\s+isoladas|s[íi]tios\s+hist[óo]ricos\s+quilombolas|bibliotecas\s+p[úu]blicas|cidades\s+interioranas|zonas\s+perif[ée]ricas\s+e\s+rurais|tv\s+aberta\s+e\s+plataformas\s+digitais))|\b(?:em\s+tempo\s+integral|no\s+contraturno\s+escolar|funcionamento\s+ininterrupto\s+24\s+horas|teleatendimento\s+[^.!?;]{3,40}gratuito\s+24\s+horas|(?:sess[õo]es|encontros|palestras|oficinas|proje[çc][õo]es|cursos|audi[êe]ncias\s+p[úu]blicas)\s+(?:semanais|mensais|peri[óo]dic[oa]s|bimestrais|semestrais|anuais|obrigat[óo]ri[oa]s)(?:\s+gratuit[oa]s)?|de\s+(?:forma|maneira)\s+(?:gratuita|cont[íi]nua|bimestral|semestral|anual|integrada)|(?:atendimento|emiss[ãa]o)\s+gratuit[oa][^.!?;]{3,80}|(?:com\s+)?monitoramento\s+(?:ativo|por\s+sat[ée]lite)|com\s+(?:equipe\s+multidisciplinar|psic[óo]logos|assistentes\s+sociais|metas\s+(?:anuais|semestrais)|verba\s+vinculada|encontros\s+(?:semanais|mensais)|debates\s+orientados|atendimento\s+gratuito|unidades\s+m[óo]veis\s+com\s+peritos)|para\s+fins\s+de\s+aposentadoria)\b)/iu);
  const sentences = clean.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
  const primaryProposalSentence = sentences.find(s => extractC5EvidenceSignals(s).hasAgent || extractC5EvidenceSignals(s).hasAction) || sentences[0] || clean;
  return {
    ...base,
    agentMatch: agentMatch?.[0]?.trim() || '',
    actionMatch: actionMatch?.[0]?.trim() || '',
    modeMatch: modeMatch?.[0]?.trim() || '',
    effectMatch: effectMatch?.[0]?.trim() || '',
    detailingMatch: detailingMatch?.[0]?.replace(/^[,\s—–(]+|[—–)\s.,;]+$/g, '').trim() || '',
    primaryProposalSentence,
    hasHumanRightsViolation: detectsTrueHumanRightsViolation(clean)
  };
}

function extractDetailedC3Facts(paragraphs: string[]) {
  const intro = paragraphs[0] || '';
  const d1 = paragraphs[1] || '';
  const d2 = paragraphs.length >= 4 ? (paragraphs[2] || '') : '';
  const devCombined = [d1, d2].filter(Boolean).join('\n\n');

  const axisDefs: Array<{ label: string; regex: RegExp }> = [
    { label: 'omissão/política estatal e legislação', regex: /\b(estado|govern|lei|legisl|constitui|fiscaliza|verba|or[çc]ament|pol[íi]tica\s+p[úu]blica|estatal|minist[ée]rio|poder\s+p[úu]blico)\b/i },
    { label: 'educação e formação crítica', regex: /\b(educa[çc][ãa]o|escola|ensino|pedag[óo]gic|informa[çc][ãa]o|conscientiza|alfabetiza|forma[çc][ãa]o|universidade)\b/i },
    { label: 'cultura, estigma e comportamento social', regex: /\b(cultura|preconceit|estigma|estere[óo]tipo|comportament|mentalidade|fam[íi]lia|hist[óo]ric|patrimonial|machism|racism|invisibilidade|silenciamento)\b/i },
    { label: 'economia, renda e desigualdade estrutural', regex: /\b(econom|renda|desigualdade|pobreza|mercado|consumo|lucro|empresa|capital|trabalho|emprego|infraestrutura|saneamento|precariza)\b/i },
    { label: 'mídia, algoritmos e tecnologia', regex: /\b(m[íi]dia|rede\s+social|internet|algoritmo|tecnologia|digital|televis|imprensa|publicidade|desinforma)\b/i }
  ];

  const getAxes = (txt: string) => axisDefs.filter(a => a.regex.test(txt)).map(a => a.label);
  const d1Axes = getAxes(d1);
  const d2Axes = getAxes(d2);

  const causalRegex = /\b(porque|visto\s+que|j[áa]\s+que|uma\s+vez\s+que|haja\s+vista|por\s+conseguinte|consequentemente|resultando\s+em|gerando|acarreta|desencadeia|perpetua|implica|compromete|agrava|em\s+decorr[êe]ncia\s+de|o\s+que\s+(?:evidencia|gera|causa|resulta)|de\s+modo\s+que|fazendo\s+com\s+que|sob\s+esse\s+(?:vi[ée]s|[óo]tica)|desse\s+modo|nesse\s+sentido|com\s+efeito)\b/giu;
  const d1CausalMatches = d1.match(causalRegex) || [];
  const d2CausalMatches = d2.match(causalRegex) || [];
  const hasD1Repertoire = paragraphHasValidRepertoire(d1, 'dev');
  const hasD2Repertoire = paragraphHasValidRepertoire(d2, 'dev');
  const hasLiteralRepetition = Boolean(d1 && d2 && detectLiteralD1D2Repetition(d1, d2));

  const pickBestArgSentence = (para: string) => {
    const sents = (para || '').split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
    return sents.find(s => causalRegex.test(s) && s.length >= 35) || sents[1] || sents[0] || para;
  };
  const d1BestSentence = pickBestArgSentence(d1);
  const d2BestSentence = pickBestArgSentence(d2);
  const introThesisSentence = (intro.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean).pop()) || intro;

  const isExpositiveD1 = d1.length > 0 && d1CausalMatches.length < 2;
  const isExpositiveD2 = d2.length > 0 && d2CausalMatches.length < 2;

  return {
    intro,
    d1,
    d2,
    devCombined,
    d1Axes,
    d2Axes,
    d1CausalCount: d1CausalMatches.length,
    d2CausalCount: d2CausalMatches.length,
    hasD1Repertoire,
    hasD2Repertoire,
    hasLiteralRepetition,
    isExpositiveD1,
    isExpositiveD2,
    d1BestSentence,
    d2BestSentence,
    introThesisSentence
  };
}

const C4_COHESIVE_DOMAIN_REGEX = /\b(portanto|logo|dessarte|destarte|dessa\s+forma|desse\s+modo|assim|por\s+conseguinte|ademais|outrossim|al[ée]m\s+disso|contudo|todavia|entretanto|no\s+entanto|n[ãa]o\s+obstante|por[ée]m|sob\s+ess[ea]\s+(?:[óo]tica|prisma|vi[ée]s)|ness[ea]\s+(?:sentido|contexto|cen[áa]rio)|com\s+efeito|visto\s+que|j[áa]\s+que|uma\s+vez\s+que|haja\s+vista|esse|essa|isso|este|esta|isto|tal|tais|cuj[oa]s?|(?:o|a|os|as)\s+quais|o\s+qual|a\s+qual|onde|mesm[oa]s?)\b/iu;

/**
 * Validação Cruzada Semântica de Evidências:
 * Verifica se os trechos citados como evidência (via regex/extração literal) possuem
 * correlação semântica direta com a competência penalizada, extraindo fatos reais da
 * redação especialmente para fundamentar os feedbacks de C3 e C5.
 */
export function crossValidateEvidenceSemanticCorrelation(
  payload: AuditInputPayload,
  essayText: string,
  theme: string = ''
): EvidenceCrossValidationReport {
  const cleanEssay = (essayText || '').trim();
  const paragraphs = cleanEssay.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const lastIdx = paragraphs.length;
  const prevPara = paragraphs.length >= 2 ? paragraphs[paragraphs.length - 2] : '';
  const conclusionText = paragraphs.length >= 4 && CONCL_OPENING_OP_REGEX.test(prevPara)
    ? `${prevPara}\n\n${paragraphs[paragraphs.length - 1]}`
    : (paragraphs[paragraphs.length - 1] || cleanEssay);

  const c3Facts = extractDetailedC3Facts(paragraphs);
  const c5Facts = extractDetailedC5Facts(conclusionText);
  const comps = payload?.competencies || {};
  const deviations = Array.isArray(payload?.c1Deviations) ? payload.c1Deviations : [];
  const essayAnaphoricMesmos = findAnaphoricMesmoMatches(cleanEssay);
  const essayOralMarks = findOralOrVagueMatches(cleanEssay);

  const themeTokens = (theme || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 5 && !['sobre', 'entre', 'para', 'desafios', 'caminhos', 'sociedade', 'brasileira', 'brasil', 'persistencia', 'impactos'].includes(w));

  const getScore = (k: 'c1' | 'c2' | 'c3' | 'c4' | 'c5'): number | null => {
    const c = comps[k];
    if (!c) return null;
    if (typeof c.score === 'number') return c.score;
    if (typeof c.nota === 'number') return c.nota;
    return null;
  };
  const getEvidence = (k: 'c1' | 'c2' | 'c3' | 'c4' | 'c5'): string => {
    const c = comps[k];
    return String(c?.trecho_evidencia || c?.primaryEvidenceQuote || c?.evidenceSnippets?.[0] || '').trim();
  };
  const getNarrative = (k: 'c1' | 'c2' | 'c3' | 'c4' | 'c5'): string => {
    const c = comps[k];
    if (!c) return '';
    return [
      c.justificativa_analitica,
      c.evaluation,
      c.diagnostic,
      ...(Array.isArray(c.problemsIdentified) ? c.problemsIdentified : []),
      ...(Array.isArray(c.penaltiesOrGaps) ? c.penaltiesOrGaps : [])
    ].filter(Boolean).join(' | ');
  };

  const isGlobalZero = payload?.totalScore === 0;
  const c2Score = getScore('c2');
  const isTangenciamento = !isGlobalZero && (c2Score === 40 || payload?.thematicAudit?.classification === 'tangenciamento');

  const items: EvidenceCrossValidationItem[] = [];
  const keys: Array<'c1' | 'c2' | 'c3' | 'c4' | 'c5'> = ['c1', 'c2', 'c3', 'c4', 'c5'];

  for (const ck of keys) {
    const compTag = ck.toUpperCase() as 'C1' | 'C2' | 'C3' | 'C4' | 'C5';
    const score = getScore(ck);
    const isPenalized = score !== null && score < 200;
    const rawEvidence = getEvidence(ck);
    const nar = getNarrative(ck);
    const { cleaned: cleanEvidence } = stripLocationPrefix(rawEvidence);
    const loc = rawEvidence && !isDescriptivePlaceholder(rawEvidence)
      ? locateExcerptParagraphs(rawEvidence, cleanEssay)
      : { found: false, wasTruncated: false, cleanedProbe: '', allParagraphIndices: [] as number[], firstParagraphIndex: 0, firstSentenceContext: '' };

    const matchedDomainSignals: string[] = [];
    const mismatchedDomainHints: string[] = [];
    const groundedFactsExtracted: string[] = [];
    let reanchoredExcerpt: string | undefined;
    let correlationScore = 100;

    if (isGlobalZero) {
      groundedFactsExtracted.push('Anulação global da redação (Nota 0 oficial).');
      items.push({
        competency: compTag,
        score,
        isPenalized,
        citedExcerpt: rawEvidence,
        locatedParagraphs: loc.allParagraphIndices,
        semanticCorrelationMatched: true,
        correlationScore: 100,
        matchedDomainSignals: ['Anulação global verificada'],
        mismatchedDomainHints: [],
        groundedFactsExtracted
      });
      continue;
    }

    if (ck === 'c1') {
      if (deviations.length > 0) {
        groundedFactsExtracted.push(`${deviations.length} desvio(s) encontrado(s) no texto (ex.: "${deviations[0].snippet}").`);
      }
      if (essayOralMarks.length > 0) {
        groundedFactsExtracted.push(`Expressão informal ou imprecisa encontrada: "${essayOralMarks.slice(0, 2).join('", "')}".`);
      }
      if (essayAnaphoricMesmos.length > 0) {
        groundedFactsExtracted.push(`Uso inadequado de "${essayAnaphoricMesmos[0]}" encontrado no texto.`);
      }
      if (cleanEvidence) {
        const hasOralInEv = findOralOrVagueMatches(cleanEvidence).length > 0;
        const hasDevInEv = deviations.some((d) => d.snippet && cleanEvidence.toLowerCase().includes(stripLocationPrefix(d.snippet).cleaned.toLowerCase()));
        const hasNormOrSyntaxContext = /[,;:]|[àÀ]|[\p{L}]{4,}/u.test(cleanEvidence) && cleanEvidence.split(/\s+/).length >= 3;
        if (hasOralInEv) matchedDomainSignals.push('Expressão informal confirmada no trecho');
        if (hasDevInEv) matchedDomainSignals.push('Desvio gramatical confirmado no trecho citado');
        if (hasNormOrSyntaxContext) matchedDomainSignals.push('Trecho válido para análise gramatical');

        const isPureC5Claim = lastIdx >= 3 && loc.found && loc.allParagraphIndices.every((p) => p === lastIdx) && extractC5EvidenceSignals(cleanEvidence).hasAgent && !hasDevInEv && !hasOralInEv && deviations.length > 0;
        if (isPenalized && isPureC5Claim) {
          mismatchedDomainHints.push('O trecho citado veio da proposta de conclusão (C5), enquanto o erro gramatical (C1) está em outra parte do texto.');
          reanchoredExcerpt = deviations[0]?.snippet || essayOralMarks[0];
          correlationScore = 35;
        }
      } else if (isPenalized) {
        mismatchedDomainHints.push('Faltou citar um trecho da redação para comprovar o desconto na C1.');
        reanchoredExcerpt = deviations[0]?.snippet || essayOralMarks[0];
        correlationScore = 40;
      }
    } else if (ck === 'c2') {
      const hasRepInIntro = paragraphs[0] ? paragraphHasValidRepertoire(paragraphs[0], 'intro') : false;
      const hasRepInD1 = c3Facts.hasD1Repertoire;
      const hasRepInD2 = c3Facts.hasD2Repertoire;
      if (hasRepInD1 || hasRepInD2) groundedFactsExtracted.push('Repertório sociocultural válido presente nos parágrafos de desenvolvimento (D1/D2).');
      else if (hasRepInIntro) groundedFactsExtracted.push('Repertório encontrado apenas na introdução (não aparece em D1 nem em D2).');
      else groundedFactsExtracted.push('Não há repertório externo citado na introdução ou no desenvolvimento.');

      if (cleanEvidence) {
        const hasRepSignal = REP_SCHOLAR_OR_CULTURE_REGEX.test(cleanEvidence) || REP_LAW_OR_INSTITUTION_REGEX.test(cleanEvidence) || REPERTOIRE_CUE_REGEX.test(cleanEvidence);
        const hasThemeSignal = themeTokens.some((tok) => normalizeForMatch(cleanEvidence).normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(tok));
        if (hasRepSignal) matchedDomainSignals.push('Referência sociocultural confirmada no trecho');
        if (hasThemeSignal) matchedDomainSignals.push('Palavras do tema confirmadas no trecho');
        if (!hasRepSignal && !hasThemeSignal && isPenalized && isConclusionProposalAgencyOnly(cleanEvidence)) {
          mismatchedDomainHints.push('O trecho citado fala apenas de órgão ou lei da conclusão (C5), não de repertório ou desenvolvimento do tema (C2).');
          reanchoredExcerpt = c3Facts.d1BestSentence || paragraphs[0];
          correlationScore = 30;
        }
      } else if (isPenalized) {
        mismatchedDomainHints.push('Faltou citar um trecho da redação para comprovar a avaliação da C2.');
        correlationScore = 40;
      }
    } else if (ck === 'c3') {
      if (c3Facts.d1) {
        groundedFactsExtracted.push(`1º desenvolvimento (Parágrafo 2): ${c3Facts.d1CausalCount} conexão(ões) de causa e efeito; ${c3Facts.hasD1Repertoire ? 'com repertório' : 'sem repertório externo'}.`);
      }
      if (c3Facts.d2) {
        groundedFactsExtracted.push(`2º desenvolvimento (Parágrafo 3): ${c3Facts.d2CausalCount} conexão(ões) de causa e efeito; ${c3Facts.hasD2Repertoire ? 'com repertório' : 'sem repertório externo'}.`);
      }
      groundedFactsExtracted.push(
        c3Facts.hasLiteralRepetition
          ? 'D1 e D2 repetem o mesmo argumento central.'
          : 'D1 e D2 trazem ideias diferentes (sem repetição entre os parágrafos).'
      );

      if (isTangenciamento && /tangenc/i.test(nar)) {
        matchedDomainSignals.push('Regra de tangenciamento aplicada na C3');
      } else {
        const isOnlyInConclusion = paragraphs.length >= 3 && loc.found && loc.allParagraphIndices.every((p) => p === lastIdx);
        const c5SignalsInEv = extractC5EvidenceSignals(cleanEvidence);
        const hasC3ArgCues = Boolean(
          cleanEvidence && (
            /\b(porque|visto\s+que|j[áa]\s+que|uma\s+vez\s+que|haja\s+vista|portanto|consequentemente|desencadeia|resulta|perpetua|compromete|evidencia|demonstra|nesse\s+sentido|sob\s+esse|al[ée]m\s+disso|outrossim|ademais|tese|causa|consequ[êe]ncia|desigualdade|omiss[ãa]o|neglig[êe]ncia|exclus[ãa]o)\b/iu.test(cleanEvidence) ||
            (loc.found && loc.allParagraphIndices.some((p) => p === 2 || p === 3 || (p === 1 && cleanEvidence.length >= 35)))
          )
        );
        const onlyC1TypoClaimInC3 = isPenalized && /\b(erro\s+ortogr[áa]fico|falta\s+de\s+crase|acento\s+grave|desvio\s+de\s+v[íi]rgula)\b/i.test(stripNegationsAndRuleExplanations(nar)) && !/\b(causa|consequ[êe]ncia|argument|expositiv|projeto\s+de\s+texto|desenvolvimento|repert[óo]rio|tese)\b/i.test(nar);

        if (isOnlyInConclusion && (c5SignalsInEv.hasAgent || c5SignalsInEv.hasAction || c5SignalsInEv.hasMode)) {
          mismatchedDomainHints.push('O trecho citado veio da conclusão (C5), e não da argumentação (introdução ou desenvolvimento).');
          reanchoredExcerpt = c3Facts.d1BestSentence || c3Facts.d2BestSentence || c3Facts.introThesisSentence;
          correlationScore = 25;
        } else if (onlyC1TypoClaimInC3) {
          mismatchedDomainHints.push('O comentário da C3 falou de erro de gramática/ortografia, que pertence à C1.');
          reanchoredExcerpt = c3Facts.d1BestSentence || c3Facts.d2BestSentence;
          correlationScore = 30;
        } else if (isPenalized && (!cleanEvidence || isDescriptivePlaceholder(rawEvidence) || !loc.found || !hasC3ArgCues)) {
          mismatchedDomainHints.push('O trecho citado na C3 não mostra a parte argumentativa do texto (introdução ou desenvolvimento).');
          reanchoredExcerpt = c3Facts.d1BestSentence || c3Facts.d2BestSentence || c3Facts.introThesisSentence;
          correlationScore = 35;
        } else {
          if (loc.allParagraphIndices.some((p) => p === 2 || p === 3)) {
            matchedDomainSignals.push(`Trecho confirmado no desenvolvimento (Parágrafo ${loc.allParagraphIndices.filter(p => p === 2 || p === 3).join(' e ')})`);
          } else if (loc.allParagraphIndices.includes(1)) {
            matchedDomainSignals.push('Trecho confirmado na introdução (tese inicial)');
          }
          if (hasC3ArgCues) matchedDomainSignals.push('Estrutura de causa e argumentação confirmada no trecho');
        }
      }
    } else if (ck === 'c4') {
      const d1HasOp = paragraphs[1] ? D1_D2_OPENING_OP_REGEX.test(paragraphs[1]) : false;
      const d2HasOp = paragraphs[2] ? D1_D2_OPENING_OP_REGEX.test(paragraphs[2]) : false;
      const conclHasOp = paragraphs[lastIdx - 1] ? CONCL_OPENING_OP_REGEX.test(paragraphs[lastIdx - 1]) : false;
      groundedFactsExtracted.push(`Conectivos no início dos parágrafos: D1 (${d1HasOp ? 'sim' : 'não'}), D2 (${d2HasOp ? 'sim' : 'não'}), Conclusão (${conclHasOp ? 'sim' : 'não'}).`);
      if (essayAnaphoricMesmos.length > 0) groundedFactsExtracted.push(`Uso inadequado de "${essayAnaphoricMesmos[0]}" encontrado no texto.`);

      if (cleanEvidence) {
        const hasCohesiveCue = C4_COHESIVE_DOMAIN_REGEX.test(cleanEvidence) || cleanEvidence.split(/\s+/).length >= 6;
        if (hasCohesiveCue) matchedDomainSignals.push('Conectivos e ligação entre frases confirmados no trecho');
        if (isPenalized && !hasCohesiveCue) {
          mismatchedDomainHints.push('O trecho curto citado na C4 não mostra conectivo ou ligação entre ideias.');
          reanchoredExcerpt = paragraphs[1]?.split(/(?<=[.!?])\s+/)[0] || cleanEvidence;
          correlationScore = 40;
        }
      } else if (isPenalized) {
        mismatchedDomainHints.push('Faltou citar um trecho da redação para comprovar o desconto na C4.');
        reanchoredExcerpt = paragraphs[1]?.split(/(?<=[.!?])\s+/)[0];
        correlationScore = 40;
      }
    } else if (ck === 'c5') {
      groundedFactsExtracted.push(
        `Na conclusão: Agente (${c5Facts.hasAgent ? c5Facts.agentMatch || 'encontrado' : 'não encontrado'}), Ação (${c5Facts.hasAction ? 'sim' : 'não'}), Meio (${c5Facts.hasMode ? 'sim' : 'não'}), Finalidade (${c5Facts.hasEffect ? 'sim' : 'não'}), Detalhamento (${c5Facts.hasUnambiguousDetailing ? c5Facts.detailingMatch || 'sim' : 'não encontrado'}).`
      );
      if (c5Facts.hasHumanRightsViolation) {
        groundedFactsExtracted.push('Violação explícita aos Direitos Humanos identificada na proposta.');
      }

      if (isTangenciamento && /tangenc/i.test(nar)) {
        matchedDomainSignals.push('Regra de tangenciamento aplicada na C5');
      } else {
        const conclIndices = paragraphs.length >= 4 && CONCL_OPENING_OP_REGEX.test(prevPara) ? [lastIdx - 1, lastIdx] : [lastIdx];
        const isOutsideConclusion = paragraphs.length >= 3 && loc.found && loc.allParagraphIndices.every((p) => !conclIndices.includes(p));
        const evC5 = extractC5EvidenceSignals(cleanEvidence);
        const hasInterventionSemantics = Boolean(
          evC5.hasAgent || evC5.hasAction || evC5.hasMode || evC5.hasEffect || evC5.hasUnambiguousDetailing ||
          c5Facts.hasHumanRightsViolation ||
          (!c5Facts.hasAgent && !c5Facts.hasAction && loc.allParagraphIndices.some((p) => conclIndices.includes(p)))
        );

        if (isOutsideConclusion && !evC5.hasAgent && !evC5.hasAction) {
          mismatchedDomainHints.push(`O trecho citado para a C5 veio de outro parágrafo (Parágrafo ${loc.allParagraphIndices.join(', ')}), fora da conclusão.`);
          reanchoredExcerpt = c5Facts.primaryProposalSentence;
          correlationScore = 20;
        } else if (isPenalized && (!cleanEvidence || isDescriptivePlaceholder(rawEvidence) || !loc.found || !hasInterventionSemantics)) {
          mismatchedDomainHints.push('O trecho citado na C5 não corresponde à proposta de intervenção escrita na conclusão.');
          reanchoredExcerpt = c5Facts.primaryProposalSentence;
          correlationScore = 30;
        } else {
          if (loc.allParagraphIndices.some((p) => conclIndices.includes(p))) {
            matchedDomainSignals.push('Trecho confirmado no parágrafo de conclusão');
          }
          if (evC5.hasAgent) matchedDomainSignals.push('Agente identificado no trecho');
          if (evC5.hasAction) matchedDomainSignals.push('Ação identificada no trecho');
          if (evC5.hasMode) matchedDomainSignals.push('Meio/modo identificado no trecho');
          if (evC5.hasEffect) matchedDomainSignals.push('Finalidade identificada no trecho');
          if (evC5.hasUnambiguousDetailing) matchedDomainSignals.push('Detalhamento identificado no trecho');
        }
      }
    }

    const semanticCorrelationMatched = mismatchedDomainHints.length === 0;
    items.push({
      competency: compTag,
      score,
      isPenalized,
      citedExcerpt: rawEvidence,
      locatedParagraphs: loc.allParagraphIndices,
      semanticCorrelationMatched,
      correlationScore,
      matchedDomainSignals,
      mismatchedDomainHints,
      groundedFactsExtracted,
      reanchoredExcerpt
    });
  }

  // Verificar se o feedback de C3 e C5 está efetivamente apoiado no que está escrito na redação
  const c3Item = items.find((i) => i.competency === 'C3');
  const c5Item = items.find((i) => i.competency === 'C5');

  const c3NarAff = stripNegationsAndRuleExplanations(getNarrative('c3'));
  const c3FalseRepClaim = paragraphs.length >= 4 && /(?:repeti[çc][ãa]o\s+(?:de\s+ideias?\s+entre(?:\s+os)?\s+par[áa]grafos|literal\s+entre\s+d1\s+e\s+d2)|d1\s+e\s+d2\s+defendem\s+(?:literalmente\s+)?o\s+mesmo\s+argumento)/i.test(c3NarAff) && !c3Facts.hasLiteralRepetition;
  const c3ArtificialAuth = /(?:aus[êe]ncia\s+de\s+marcas\s+de\s+autoria|falta(?:m)?\s+(?:marcas\s+de\s+autoria|express[õo]es\s+opinativas))/i.test(c3NarAff);
  const c3FeedbackGroundedInFacts = Boolean(
    c3Item &&
    c3Item.semanticCorrelationMatched &&
    !c3FalseRepClaim &&
    !c3ArtificialAuth &&
    (!c3Item.isPenalized || c3Item.groundedFactsExtracted.length > 0)
  );

  const c5NarRaw = getNarrative('c5');
  const c5Struct = payload?.c5Structure;
  const c5FalseElementMiss =
    (/(?:aus[êe]ncia\s+de\s+a[çc][ãa]o|a[çc][ãa]o\s+ausente|a[çc][ãa]o\s*\(✗\))/i.test(c5NarRaw) && c5Facts.hasAction) ||
    (/(?:aus[êe]ncia\s+de\s+agente|agente\s+ausente|agente\s*\(✗\))/i.test(c5NarRaw) && c5Facts.hasAgent) ||
    (/(?:aus[êe]ncia\s+de\s+(?:meio|modo)|modo\/meio\s+ausente|modo\/meio\s*\(✗\))/i.test(c5NarRaw) && c5Facts.hasMode) ||
    (/(?:aus[êe]ncia\s+de\s+(?:finalidade|efeito)|finalidade\s+ausente|finalidade\s*\(✗\))/i.test(c5NarRaw) && c5Facts.hasEffect) ||
    (/(?:aus[êe]ncia\s+de\s+detalhamento|falt(?:a|ou)\s+(?:o\s+)?detalhamento|detalhamento\s*(?:\(✗\)|ausente))/i.test(c5NarRaw.replace(/\b(?:sem\s+confundir\s+aus[êe]ncia\s+de\s+detalhamento|n[ãa]o\s+h[áa]\s+aus[êe]ncia\s+de\s+detalhamento)\b[^.;!\n]{0,110}/giu, ' ')) && !/(?:apenas\s+repete|descreve\s+(?:o\s+)?meio|reformula\s+(?:a\s+)?finalidade|confund|sobreposto)/i.test(c5NarRaw) && (c5Facts.hasUnambiguousDetailing || Boolean(c5Struct?.detailing?.present && (c5Struct.detailing.text || '').trim().length >= 8)));

  const c5FeedbackGroundedInFacts = Boolean(
    c5Item &&
    c5Item.semanticCorrelationMatched &&
    !c5FalseElementMiss &&
    (!c5Item.isPenalized || c5Item.groundedFactsExtracted.length > 0)
  );

  const allPenalizedCorrelated = items.filter((i) => i.isPenalized).every((i) => i.semanticCorrelationMatched);
  const overallCorrelationScore = items.length > 0
    ? Math.round(items.reduce((acc, it) => acc + it.correlationScore, 0) / items.length)
    : 100;

  return {
    timestamp: new Date().toISOString(),
    allPenalizedCorrelated,
    c3FeedbackGroundedInFacts,
    c5FeedbackGroundedInFacts,
    overallCorrelationScore,
    items,
    summaryMessage: allPenalizedCorrelated && c3FeedbackGroundedInFacts && c5FeedbackGroundedInFacts
      ? 'Conferência concluída: todos os trechos citados combinam com as competências avaliadas e com o que foi escrito na redação.'
      : 'Alguns trechos citados foram ajustados automaticamente para refletir exatamente o que está escrito na redação.'
  };
}

/**
 * Reancora trechos de evidência e garante que diagnósticos/problemas de C3 e C5
 * estejam lastreados nos fatos reais extraídos da redação antes da emissão do relatório.
 */
export function groundC3AndC5FeedbackInEssayFacts(
  payload: AuditInputPayload,
  essayText: string,
  theme: string = ''
): {
  c3ReanchoredQuote?: string;
  c5ReanchoredQuote?: string;
  c3GroundedSummary: string;
  c5GroundedSummary: string;
  c3FactsList: string[];
  c5FactsList: string[];
  crossValidation: EvidenceCrossValidationReport;
} {
  const cleanEssay = (essayText || '').trim();
  const paragraphs = cleanEssay.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const prevPara = paragraphs.length >= 2 ? paragraphs[paragraphs.length - 2] : '';
  const conclusionText = paragraphs.length >= 4 && CONCL_OPENING_OP_REGEX.test(prevPara)
    ? `${prevPara}\n\n${paragraphs[paragraphs.length - 1]}`
    : (paragraphs[paragraphs.length - 1] || cleanEssay);

  const c3Facts = extractDetailedC3Facts(paragraphs);
  const c5Facts = extractDetailedC5Facts(conclusionText);
  const crossValidation = crossValidateEvidenceSemanticCorrelation(payload, cleanEssay, theme);

  const c3Item = crossValidation.items.find((i) => i.competency === 'C3');
  const c5Item = crossValidation.items.find((i) => i.competency === 'C5');

  const c3FactsList: string[] = [];
  if (c3Facts.d1) {
    c3FactsList.push(`D1 (Parágrafo 2): eixos [${c3Facts.d1Axes.join(', ') || 'temático geral'}], ${c3Facts.d1CausalCount} marcador(es) causal(is), repertório ${c3Facts.hasD1Repertoire ? 'presente' : 'ausente'}.`);
  }
  if (c3Facts.d2) {
    c3FactsList.push(`D2 (Parágrafo 3): eixos [${c3Facts.d2Axes.join(', ') || 'temático geral'}], ${c3Facts.d2CausalCount} marcador(es) causal(is), repertório ${c3Facts.hasD2Repertoire ? 'presente' : 'ausente'}.`);
  }

  const c5Missing: string[] = [];
  if (!c5Facts.hasAgent) c5Missing.push('Agente');
  if (!c5Facts.hasAction) c5Missing.push('Ação');
  if (!c5Facts.hasMode) c5Missing.push('Meio/Modo');
  if (!c5Facts.hasEffect) c5Missing.push('Finalidade');
  if (!c5Facts.hasUnambiguousDetailing && !(payload?.c5Structure?.detailing?.present && (payload?.c5Structure?.detailing?.text || '').trim().length >= 8)) {
    c5Missing.push('Detalhamento');
  }

  const c5FactsList: string[] = [
    `Conclusão analisada: Agente(${c5Facts.hasAgent ? c5Facts.agentMatch || '✓' : '✗'}), Ação(${c5Facts.hasAction ? '✓' : '✗'}), Meio(${c5Facts.hasMode ? '✓' : '✗'}), Finalidade(${c5Facts.hasEffect ? '✓' : '✗'}), Detalhamento(${c5Facts.hasUnambiguousDetailing ? c5Facts.detailingMatch || '✓' : '✗'}).`,
    ...(c5Missing.length > 0 ? [`Elemento(s) ausente(s) na conclusão: ${c5Missing.join(', ')}.`] : ['Todos os 5 elementos canônicos comprovados na conclusão.'])
  ];

  const c3ReanchoredQuote = (!c3Item?.semanticCorrelationMatched && c3Item?.reanchoredExcerpt)
    ? c3Item.reanchoredExcerpt
    : (!c3Item?.citedExcerpt ? (c3Facts.d1BestSentence || c3Facts.introThesisSentence) : undefined);

  const c5ReanchoredQuote = (!c5Item?.semanticCorrelationMatched && c5Item?.reanchoredExcerpt)
    ? c5Item.reanchoredExcerpt
    : (!c5Item?.citedExcerpt ? c5Facts.primaryProposalSentence : undefined);

  const c3GroundedSummary = c3Facts.hasLiteralRepetition
    ? `Resumo de D1 e D2: os dois parágrafos repetem a mesma ideia principal ("${c3Facts.d1BestSentence.slice(0, 90)}").`
    : (c3Facts.isExpositiveD1 || c3Facts.isExpositiveD2)
      ? `Resumo dos desenvolvimentos: ${c3Facts.isExpositiveD1 ? `D1 (${c3Facts.d1CausalCount} conexão causal)` : 'D1 completo'} e ${c3Facts.isExpositiveD2 ? `D2 (${c3Facts.d2CausalCount} conexão causal)` : 'D2 completo'} ainda precisam explicar melhor as causas e consequências em "${(c3Facts.isExpositiveD2 && c3Facts.d2BestSentence) ? c3Facts.d2BestSentence : c3Facts.d1BestSentence}".`
      : `D1 (${c3Facts.d1Axes.join('/') || 'tema 1'}) e D2 (${c3Facts.d2Axes.join('/') || 'tema 2'}) trazem argumentos diferentes e explicam causas e consequências.`;

  const c5GroundedSummary = c5Facts.hasHumanRightsViolation
    ? `Na conclusão: foi identificado trecho incompatível com os Direitos Humanos ("${c5Facts.primaryProposalSentence}").`
    : c5Missing.length > 0
      ? `Resumo da conclusão ("${c5Facts.primaryProposalSentence}"): faltou indicar ${c5Missing.join(', ')}.`
      : `Resumo da conclusão: os 5 elementos estão presentes — Agente (${c5Facts.agentMatch || 'identificado'}), Ação, Meio, Finalidade e Detalhamento (${c5Facts.detailingMatch || 'presente'}).`;

  return {
    c3ReanchoredQuote,
    c5ReanchoredQuote,
    c3GroundedSummary,
    c5GroundedSummary,
    c3FactsList,
    c5FactsList,
    crossValidation
  };
}

function detectsTrueHumanRightsViolation(text: string): boolean {
  const violationRegex = /\b(pena\s+de\s+morte|fuzilamento|linchamento|tortura|espancamento|trabalho\s+(?:escravo|for[çc]ado\s+degradante)|eugenia|esteriliza[çc][ãa]o\s+for[çc]ada|elimina[çc][ãa]o\s+f[íi]sica|segrega[çc][ãa]o\s+racial|deportação\s+em\s+massa\s+por\s+raça|retirada\s+de\s+direitos\s+humanos|castigo\s+f[íi]sico|humilha[çc][ãa]o\s+p[úu]blica|exterm[íi]nio|mutila[çc][ãa]o|chicotada|redu[çc][ãa]o\s+a\s+subumano)\b/i;
  return violationRegex.test(text || '');
}

/**
 * Camada de Auditoria Automática de Consistência (Diagnóstico da IA x Evidências Extraídas).
 * Verifica se há contradição entre a justificativa / descrição do erro e o trecho citado ou regex extraído.
 * Se detectar qualquer contradição, impede a emissão da nota final (`blockedFinalScoreEmission: true`).
 */
export function auditDiagnosticVsEvidenceConsistency(
  payload: AuditInputPayload,
  essayText: string,
  _theme: string = ''
): DiagnosticConsistencyAuditReport {
  const cleanEssay = (essayText || '').trim();
  const paragraphs = cleanEssay.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const contradictions: ConsistencyContradiction[] = [];
  const seenKeys = new Set<string>();
  let checksRun = 0;

  const pushContradiction = (item: Omit<ConsistencyContradiction, 'id' | 'severity' | 'friendlyTitlePt'>) => {
    const key = `${item.competency}:${item.ruleCode}:${item.citedExcerpt.slice(0, 45).toLowerCase()}`;
    if (seenKeys.has(key)) return;
    seenKeys.add(key);
    contradictions.push({
      id: `audit-${contradictions.length + 1}-${item.ruleCode.toLowerCase()}`,
      severity: 'alerta',
      friendlyTitlePt: getFriendlyAuditTitlePt(item.ruleCode),
      ...item
    });
  };

  const comps = payload?.competencies || {};
  const getCompScore = (k: 'c1' | 'c2' | 'c3' | 'c4' | 'c5'): number | null => {
    const c = comps[k];
    if (!c) return null;
    if (typeof c.score === 'number') return c.score;
    if (typeof c.nota === 'number') return c.nota;
    return null;
  };
  const getCompEvidence = (k: 'c1' | 'c2' | 'c3' | 'c4' | 'c5'): string => {
    const c = comps[k];
    return String(c?.trecho_evidencia || c?.primaryEvidenceQuote || c?.evidenceSnippets?.[0] || '').trim();
  };
  const getCompNarrative = (k: 'c1' | 'c2' | 'c3' | 'c4' | 'c5'): string => {
    const c = comps[k];
    if (!c) return '';
    return [
      c.justificativa_analitica,
      c.evaluation,
      c.diagnostic,
      ...(Array.isArray(c.problemsIdentified) ? c.problemsIdentified : []),
      ...(Array.isArray(c.penaltiesOrGaps) ? c.penaltiesOrGaps : [])
    ]
      .filter(Boolean)
      .join(' | ');
  };

  // 1. VERIFICAÇÃO DE EXISTÊNCIA LITERAL, TRUNCAMENTO E LOCALIZAÇÃO DE EVIDÊNCIAS CITADAS
  checksRun++;
  const deviations = Array.isArray(payload?.c1Deviations) ? payload.c1Deviations : [];
  for (const dev of deviations) {
    const rawSnip = String(dev?.snippet || '').trim();
    const probText = String(dev?.problem || (dev as any)?.description || '').trim();
    const bestForm = String(dev?.bestForm || '').trim();
    if (!rawSnip || isDescriptivePlaceholder(rawSnip)) continue;

    const loc = locateExcerptParagraphs(rawSnip, cleanEssay);
    if (!loc.found) {
      pushContradiction({
        competency: 'C1',
        ruleCode: 'EXCERPT_NOT_FOUND_IN_ESSAY',
        justificationClaim: probText || 'Desvio apontado na C1',
        citedExcerpt: rawSnip,
        extractedEvidence: 'Esse trecho exato não foi encontrado em nenhum parágrafo da redação.',
        explanation: 'O comentário citou um trecho diferente do que está escrito na sua redação.'
      });
      continue;
    }

    if (loc.wasTruncated) {
      pushContradiction({
        competency: 'C1',
        ruleCode: 'EXCERPT_TRUNCATED_IN_ERROR_CLAIM',
        justificationClaim: probText || 'Desvio apontado na C1',
        citedExcerpt: rawSnip,
        extractedEvidence: `Frase completa no texto: "${loc.firstSentenceContext}"`,
        explanation: 'O trecho citado estava cortado com reticências ("..."); mostramos a frase inteira acima.'
      });
    }

    const declaredPara = extractDeclaredParagraphIndex(probText, paragraphs.length);
    if (declaredPara !== null && loc.allParagraphIndices.length > 0 && !loc.allParagraphIndices.includes(declaredPara)) {
      pushContradiction({
        competency: 'C1',
        ruleCode: 'LOCATION_MISMATCH',
        justificationClaim: probText,
        citedExcerpt: loc.cleanedProbe,
        extractedEvidence: `Esse trecho aparece no(s) Parágrafo(s) ${loc.allParagraphIndices.join(', ')}.`,
        explanation: `O comentário mencionou o Parágrafo ${declaredPara}, mas esse trecho está no Parágrafo ${loc.allParagraphIndices.join(', ')}.`
      });
    }

    // Subverificações C1 no próprio snippet vs descrição do erro
    const cleanProbAff = stripNegationsAndRuleExplanations(probText);
    const { cleaned: cleanSnip } = stripLocationPrefix(rawSnip);

    // 1a. bestForm idêntico ao snippet em erro alegado de ortografia/crase/pontuação/gramática
    if (
      bestForm &&
      cleanSnip &&
      !/^(?:substituir|evitar|reescrever|alterar|manter)/i.test(bestForm) &&
      bestForm.replace(/^["'“]|["'”]$/g, '').trim() === cleanSnip &&
      /(erro|desvio|falta|omiss[ãa]o|incorret|inadequad|crase|acento|v[íi]rgula|ortograf)/i.test(cleanProbAff)
    ) {
      pushContradiction({
        competency: 'C1',
        ruleCode: 'C1_IDENTICAL_CORRECTION',
        justificationClaim: probText,
        citedExcerpt: cleanSnip,
        extractedEvidence: `A correção sugerida ("${bestForm}") é igual ao que você já escreveu.`,
        explanation: 'O texto já está escrito exatamente como a sugestão proposta.'
      });
    }

    // 1b. Acusação de "o mesmo" anafórico sem haver "mesmo" no trecho
    if (/(?:o\s+mesmo|os\s+mesmos|a\s+mesma|as\s+mesmas)/i.test(cleanProbAff) && !/\bmesm[oa]s?\b/i.test(cleanSnip)) {
      pushContradiction({
        competency: 'C1',
        ruleCode: 'C1_FALSE_ANAPHORIC_MESMO',
        justificationClaim: probText,
        citedExcerpt: cleanSnip,
        extractedEvidence: 'A expressão "o mesmo / os mesmos" não aparece nesse trecho.',
        explanation: 'O apontamento falou em uso de "o mesmo", mas essa expressão não existe no trecho citado.'
      });
    }

    const probDirectAccusation = probText
      .replace(/\b(?:n[ãa]o\s+h[áa]\s+(?:aus[êe]ncia|falta)\s+de|sem\s+(?:aus[êe]ncia|falta)\s+de)\b[^.;!\n]{0,80}/giu, ' ')
      .trim();

    // 1c. Falsa acusação de falta de crase quando o trecho já traz "à/às" (ou o inverso)
    if (/(?:falta\s+de\s+crase|aus[êe]ncia\s+de\s+crase|omiss[ãa]o\s+de\s+crase|crase\s+obrigat[óo]ria\s+(?:ausente|omitida))/i.test(probDirectAccusation)) {
      const hasCraseInSnip = /\b(?:à|às|àquele|àquela|àquilo)\b/i.test(cleanSnip);
      const hasCandidateAWithoutCrase = /\b[aA]s?\s+(?!partir\b|respeito\b|fim\b|cerca\b|partir\s+de\b)[a-záéíóúâêôãõç]{3,}\b/.test(cleanSnip);
      const bestClean = bestForm.replace(/^["'“]|["'”]$/g, '').trim();
      const targetAlreadyCorrectInSnip = bestClean.length >= 4 && /[àÀ]/.test(bestClean) && cleanSnip.toLowerCase().includes(bestClean.toLowerCase());
      if (targetAlreadyCorrectInSnip || (hasCraseInSnip && !hasCandidateAWithoutCrase)) {
        pushContradiction({
          competency: 'C1',
          ruleCode: 'C1_FALSE_MISSING_CRASE',
          justificationClaim: probText,
          citedExcerpt: cleanSnip,
          extractedEvidence: `A crase já foi usada corretamente no trecho ("${cleanSnip}").`,
          explanation: 'O comentário falou em falta de crase, mas o seu texto já traz a crase correta.'
        });
      }
    }
    if (/(?:uso\s+indevido\s+de\s+crase|crase\s+indevida|crase\s+proibida|crase\s+incorreta)/i.test(cleanProbAff) && !/[àÀ]/.test(cleanSnip)) {
      pushContradiction({
        competency: 'C1',
        ruleCode: 'C1_FALSE_IMPROPER_CRASE',
        justificationClaim: probText,
        citedExcerpt: cleanSnip,
        extractedEvidence: 'Não há crase ("à/às") nesse trecho.',
        explanation: 'O comentário apontou erro de crase, mas não existe crase no trecho citado.'
      });
    }

    // 1d. Falsa acusação de falta de acento/ortografia quando a palavra já está grafada corretamente no trecho
    if (/(?:falta\s+de\s+acento|omiss[ãa]o\s+de\s+acento|erro\s+ortogr[áa]fico|grafia\s+incorreta)/i.test(probDirectAccusation) && bestForm) {
      const singleWordMatch = bestForm.replace(/^["'“]|["'”]$/g, '').trim().match(/^[\p{L}-]{4,}$/u);
      if (singleWordMatch) {
        const expectedWord = singleWordMatch[0];
        const unaccented = expectedWord.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const hasCorrectInSnip = new RegExp(`\\b${expectedWord}\\b`, 'i').test(cleanSnip);
        const hasUnaccentedInSnip = unaccented.toLowerCase() !== expectedWord.toLowerCase() && new RegExp(`\\b${unaccented}\\b`, 'i').test(cleanSnip);
        if (hasCorrectInSnip && !hasUnaccentedInSnip) {
          pushContradiction({
            competency: 'C1',
            ruleCode: 'C1_FALSE_ORTHOGRAPHY_CLAIM',
            justificationClaim: probText,
            citedExcerpt: cleanSnip,
            extractedEvidence: `A palavra "${expectedWord}" já está escrita corretamente no trecho.`,
            explanation: `A palavra "${expectedWord}" já aparece escrita de forma correta na sua redação.`
          });
        }
      }
    }

    // 1e. Falsa acusação de falta de vírgula após expressão específica que já contém vírgula
    const missingCommaAfter = probDirectAccusation.match(/(?:falta|aus[êe]ncia)\s+de\s+v[íi]rgula\s+(?:ap[óo]s|depois\s+de)\s+["'“]([^"'”]{2,30})["'”]/i);
    if (missingCommaAfter?.[1]) {
      const term = missingCommaAfter[1].trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (new RegExp(`${term}\\s*,`, 'i').test(cleanSnip) && !new RegExp(`${term}(?!\\s*,)`, 'i').test(cleanSnip)) {
        pushContradiction({
          competency: 'C1',
          ruleCode: 'C1_FALSE_MISSING_COMMA',
          justificationClaim: probText,
          citedExcerpt: cleanSnip,
          extractedEvidence: `A vírgula após "${missingCommaAfter[1]}" já está no seu texto.`,
          explanation: `A vírgula depois de "${missingCommaAfter[1]}" já foi colocada corretamente no trecho.`
        });
      }
    }
  }

  // Verificar reescritas pedagógicas (pedagogicalRewrites)
  checksRun++;
  const rewrites = Array.isArray(payload?.pedagogicalRewrites) ? payload.pedagogicalRewrites : [];
  for (const rw of rewrites) {
    const orig = String(rw?.original || '').trim();
    const prob = String(rw?.problem || '').trim();
    if (!orig || isDescriptivePlaceholder(orig)) continue;
    const loc = locateExcerptParagraphs(orig, cleanEssay);
    if (!loc.found) {
      pushContradiction({
        competency: 'GLOBAL',
        ruleCode: 'REWRITE_EXCERPT_NOT_FOUND',
        justificationClaim: prob || 'Sugestão de reescrita',
        citedExcerpt: orig,
        extractedEvidence: 'O trecho original da sugestão não foi encontrado na redação.',
        explanation: 'Uma sugestão de reescrita citou um trecho diferente do texto original.'
      });
      continue;
    }
    if (loc.wasTruncated) {
      pushContradiction({
        competency: 'GLOBAL',
        ruleCode: 'REWRITE_EXCERPT_TRUNCATED',
        justificationClaim: prob || 'Sugestão de reescrita',
        citedExcerpt: orig,
        extractedEvidence: `Frase completa no texto: "${loc.firstSentenceContext}"`,
        explanation: 'O trecho usado na sugestão de reescrita estava incompleto.'
      });
    }
    const declaredPara = extractDeclaredParagraphIndex(prob, paragraphs.length);
    if (declaredPara !== null && loc.allParagraphIndices.length > 0 && !loc.allParagraphIndices.includes(declaredPara)) {
      pushContradiction({
        competency: 'GLOBAL',
        ruleCode: 'LOCATION_MISMATCH',
        justificationClaim: prob,
        citedExcerpt: loc.cleanedProbe,
        extractedEvidence: `Trecho encontrado no(s) Parágrafo(s) ${loc.allParagraphIndices.join(', ')}.`,
        explanation: `A sugestão indicou o Parágrafo ${declaredPara}, mas o trecho está no Parágrafo ${loc.allParagraphIndices.join(', ')}.`
      });
    }
  }

  // Verificar trecho_evidencia / primaryEvidenceQuote e localização declarada de cada competência
  checksRun++;
  const compKeys: Array<'c1' | 'c2' | 'c3' | 'c4' | 'c5'> = ['c1', 'c2', 'c3', 'c4', 'c5'];
  for (const ck of compKeys) {
    const compObj = comps[ck];
    if (!compObj) continue;
    const compTag = ck.toUpperCase() as 'C1' | 'C2' | 'C3' | 'C4' | 'C5';
    const ev = getCompEvidence(ck);
    const nar = getCompNarrative(ck);
    const cleanAff = stripNegationsAndRuleExplanations(nar);
    const hasFlawNarrative = (compObj.problemsIdentified && compObj.problemsIdentified.length > 0) ||
      /(desvio|erro|falha|aus[êe]ncia|repeti[çc][ãa]o|tangenciamento|inadequa[çc][ãa]o|viola[çc][ãa]o|falta\s+de|limitad|teto\s+de\s+160|expositiv)/i.test(cleanAff);

    if (ev && !isDescriptivePlaceholder(ev) && ev.length >= 12) {
      const loc = locateExcerptParagraphs(ev, cleanEssay);
      if (!loc.found && hasFlawNarrative) {
        pushContradiction({
          competency: compTag,
          ruleCode: 'COMPETENCY_EXCERPT_NOT_FOUND',
          justificationClaim: compObj.justificativa_analitica || compObj.diagnostic || compObj.evaluation || `Justificativa da ${compTag}`,
          citedExcerpt: ev,
          extractedEvidence: 'Esse trecho não aparece exatamente assim na redação.',
          explanation: `Na ${compTag}, o trecho citado não foi encontrado literalmente no seu texto.`
        });
      } else if (loc.found) {
        const declaredLocStr = String(compObj.localizacao_trecho || compObj.excerptLocation || '');
        const declaredPara = extractDeclaredParagraphIndex(declaredLocStr, paragraphs.length);
        if (declaredPara !== null && loc.allParagraphIndices.length > 0 && !loc.allParagraphIndices.includes(declaredPara)) {
          pushContradiction({
            competency: compTag,
            ruleCode: 'LOCATION_MISMATCH',
            justificationClaim: `Parágrafo indicado: "${declaredLocStr}"`,
            citedExcerpt: loc.cleanedProbe,
            extractedEvidence: `Trecho encontrado no(s) Parágrafo(s) ${loc.allParagraphIndices.join(', ')}.`,
            explanation: `Na ${compTag}, o comentário mencionou o Parágrafo ${declaredPara}, mas o trecho está no Parágrafo ${loc.allParagraphIndices.join(', ')}.`
          });
        }
      }
    }
  }

  // 2. AUDITORIA ESPECÍFICA C1 (Narrativa x Texto)
  checksRun++;
  const c1NarAff = stripNegationsAndRuleExplanations(getCompNarrative('c1'));
  const c1Evidence = getCompEvidence('c1');
  const essayAnaphoricMesmos = findAnaphoricMesmoMatches(cleanEssay);
  const essayOralMarks = findOralOrVagueMatches(cleanEssay);

  if (/(?:uso\s+(?:anaf[óo]rico|indevido|inadequado)\s+(?:de|do)\s+["'“]?o\s+mesmo|["'“]o\s+mesmo["'”]\s+(?:como\s+pronome|retomando))/i.test(c1NarAff) && essayAnaphoricMesmos.length === 0) {
    pushContradiction({
      competency: 'C1',
      ruleCode: 'C1_FALSE_ANAPHORIC_MESMO',
      justificationClaim: 'Comentário da C1 apontou uso inadequado de "o mesmo"',
      citedExcerpt: c1Evidence || 'Texto completo',
      extractedEvidence: 'A expressão "o mesmo / os mesmos" não foi usada como pronome na redação.',
      explanation: 'A justificativa da C1 citou o erro de "o mesmo", mas isso não aparece no seu texto.'
    });
  }

  if (/(?:presen[çc]a\s+de\s+marcas\s+de\s+oralidade|marcas\s+de\s+oralidade\s+identificadas|emprega\s+(?:express[õo]es\s+coloquiais|marcas\s+de\s+oralidade))/i.test(c1NarAff) && essayOralMarks.length === 0 && !deviations.some((d) => d.category === 'registro' || d.category === 'vocabular')) {
    const hasSlangOrColloquial = /\b(pra|t[áa]|né|tipo|a\s+gente|muita\s+gente|hoje\s+em\s+dia|dia\s+a\s+dia|coisa|bom|ruim|legal|bacana|fazer\s+algo|por\s+causa)\b/i.test(cleanEssay);
    if (!hasSlangOrColloquial) {
      pushContradiction({
        competency: 'C1',
        ruleCode: 'C1_FALSE_ORALITY_CLAIM',
        justificationClaim: 'Comentário da C1 apontou expressões informais ou gírias',
        citedExcerpt: c1Evidence || 'Texto completo',
        extractedEvidence: 'Nenhuma expressão informal ou coloquial foi encontrada na redação.',
        explanation: 'A justificativa da C1 mencionou marcas de oralidade, mas o texto mantém linguagem formal.'
      });
    }
  }

  // 3. AUDITORIA ESPECÍFICA C2 (Repertório & Tema x Texto)
  checksRun++;
  const c2Score = getCompScore('c2');
  const c2NarRaw = getCompNarrative('c2');
  const c2Evidence = getCompEvidence('c2');

  const hasIntroRep = paragraphs.length > 0 && paragraphHasValidRepertoire(paragraphs[0], 'intro');
  const devParas = paragraphs.length >= 3 ? paragraphs.slice(1, -1) : (paragraphs.length === 2 ? [paragraphs[1]] : []);
  const hasDevRep = paragraphs.length >= 3
    ? devParas.some((p) => paragraphHasValidRepertoire(p, 'dev'))
    : (hasIntroRep || devParas.some((p) => paragraphHasValidRepertoire(p, 'dev')));
  const hasAnyValidRep = hasIntroRep || hasDevRep;
  const c2CitedHasRepertoire = Boolean(
    c2Evidence &&
    !isDescriptivePlaceholder(c2Evidence) &&
    !isConclusionProposalAgencyOnly(c2Evidence) &&
    (REP_SCHOLAR_OR_CULTURE_REGEX.test(c2Evidence) || REPERTOIRE_CUE_REGEX.test(c2Evidence))
  );

  // 3a. Afirmar ausência total de repertório quando há repertório no texto
  const claimsGlobalAbsenceOfRep = /(?:aus[êe]ncia\s+(?:total\s+)?de\s+repert[óo]rio(?!\s+(?:nos\s+desenvolvimentos|em\s+d1|em\s+d2|produtivo\s+nos\s+desenvolvimentos|externo\s+nos\s+par[áa]grafos\s+de\s+desenvolvimento))|n[ãa]o\s+apresenta\s+(?:nenhum\s+)?repert[óo]rio(?!\s+(?:nos\s+desenvolvimentos|em\s+d1|em\s+d2))|sem\s+(?:nenhum\s+)?repert[óo]rio\s+(?:sociocultural|externo)(?!\s+(?:nos\s+desenvolvimentos|em\s+d1|em\s+d2|produtivo\s+em\s+d1))|inexist[êe]ncia\s+de\s+repert[óo]rio\s+sociocultural|texto\s+desprovido\s+de\s+repert[óo]rio)/i.test(c2NarRaw);
  if (claimsGlobalAbsenceOfRep && (hasAnyValidRep || c2CitedHasRepertoire)) {
    pushContradiction({
      competency: 'C2',
      ruleCode: 'C2_FALSE_ABSENCE_OF_REPERTOIRE',
      justificationClaim: 'Comentário da C2 afirmou falta de repertório sociocultural',
      citedExcerpt: c2Evidence || paragraphs[0] || '',
      extractedEvidence: `Encontramos repertório sociocultural válido no texto${c2CitedHasRepertoire ? ` ("${c2Evidence}")` : ''}.`,
      explanation: 'A justificativa da C2 disse que faltava repertório, mas você trouxe uma referência válida.'
    });
  }

  // 3b. Afirmar que repertório só existe na introdução quando há repertório em D1/D2
  const claimsOnlyIntroOrMissingDevRep = /(?:repert[óo]rio\s+(?:sociocultural\s+)?(?:apenas|somente|restrito|limitado|mobilizado\s+apenas)\s+(?:na|[àa])\s+introdu[çc][ãa]o|sem\s+repert[óo]rio\s+(?:externo\s+|produtivo\s+)?(?:nos\s+desenvolvimentos|nos\s+par[áa]grafos\s+de\s+desenvolvimento|em\s+d1\s+e(?:\/ou|\s+nem\s+em)\s+d2)|aus[êe]ncia\s+de\s+repert[óo]rio\s+(?:produtivo\s+)?nos\s+(?:par[áa]grafos\s+de\s+)?desenvolvimento)/i.test(c2NarRaw);
  if (claimsOnlyIntroOrMissingDevRep && paragraphs.length >= 3 && hasDevRep) {
    pushContradiction({
      competency: 'C2',
      ruleCode: 'C2_FALSE_MISSING_DEV_REPERTOIRE',
      justificationClaim: 'Comentário da C2 afirmou que não havia repertório nos parágrafos D1 ou D2',
      citedExcerpt: c2Evidence || devParas[0] || '',
      extractedEvidence: 'Identificamos repertório sociocultural válido dentro dos parágrafos de desenvolvimento (D1/D2).',
      explanation: 'A redação apresenta repertório sociocultural nos parágrafos de desenvolvimento (D1 ou D2).'
    });
  }

  // 3c. Citar agente da conclusão como se fosse repertório em C2 = 200
  if (c2Score === 200 && paragraphs.length >= 3 && !hasDevRep && c2Evidence && isConclusionProposalAgencyOnly(c2Evidence)) {
    pushContradiction({
      competency: 'C2',
      ruleCode: 'C2_CONCLUSION_AGENCY_TREATED_AS_REPERTOIRE',
      justificationClaim: 'Nota 200 na C2 usou um órgão da conclusão como repertório',
      citedExcerpt: c2Evidence,
      extractedEvidence: 'O trecho citado é apenas um órgão ou lei da proposta final, e não há repertório em D1/D2.',
      explanation: 'Órgãos ou leis citados apenas na conclusão não valem como repertório do desenvolvimento para nota 200.'
    });
  }

  // 4. AUDITORIA ESPECÍFICA C3 (Repetição D1/D2, Marcas de Autoria, Nota 200 vs Falha)
  checksRun++;
  const c3Score = getCompScore('c3');
  const c3NarRaw = getCompNarrative('c3');
  const c3NarAff = stripNegationsAndRuleExplanations(c3NarRaw);
  const c3Evidence = getCompEvidence('c3');

  const claimsD1D2Repetition = /(?:repeti[çc][ãa]o\s+(?:de\s+ideias?\s+entre(?:\s+os)?\s+par[áa]grafos|literal\s+entre\s+d1\s+e\s+d2|do\s+mesmo\s+argumento\s+central)|d1\s+e\s+d2\s+defendem\s+(?:literalmente\s+)?o\s+mesmo\s+argumento)/i.test(c3NarAff);
  if (claimsD1D2Repetition && paragraphs.length >= 4 && !detectLiteralD1D2Repetition(paragraphs[1], paragraphs[2])) {
    pushContradiction({
      competency: 'C3',
      ruleCode: 'C3_FALSE_D1_D2_REPETITION',
      justificationClaim: 'Comentário da C3 apontou repetição de ideias entre D1 e D2',
      citedExcerpt: c3Evidence || paragraphs[1] || '',
      extractedEvidence: 'Os parágrafos D1 e D2 trazem motivos e pontos de vista diferentes entre si.',
      explanation: 'Os dois parágrafos de desenvolvimento (D1 e D2) tratam de ideias diferentes e não são repetitivos.'
    });
  }

  if (/(?:aus[êe]ncia\s+de\s+marcas\s+de\s+autoria|falta(?:m)?\s+(?:marcas\s+de\s+autoria|express[õo]es\s+opinativas))/i.test(c3NarAff)) {
    pushContradiction({
      competency: 'C3',
      ruleCode: 'C3_ARTIFICIAL_AUTHORSHIP_CRITERION',
      justificationClaim: 'Comentário da C3 cobrou palavras opinativas artificiais como "marcas de autoria"',
      citedExcerpt: c3Evidence || paragraphs[1] || '',
      extractedEvidence: 'O critério oficial do ENEM avalia a organização dos argumentos, sem exigir palavras subjetivas específicas.',
      explanation: 'A correção oficial do INEP não exige expressões subjetivas prontas para comprovar autoria.'
    });
  }

  if (c3Score === 200 && rewrites.some((rw) => rw.competencyNum === 3 || /\bc3\b|projeto de texto|aprofundamento causal/i.test(`${rw.problem || ''} ${rw.explanation || ''}`))) {
    pushContradiction({
      competency: 'C3',
      ruleCode: 'C3_SCORE_200_WITH_REWRITE',
      justificationClaim: 'A C3 recebeu nota 200, mas existe uma sugestão de melhoria apontando falha na C3',
      citedExcerpt: c3Evidence || 'Desenvolvimento',
      extractedEvidence: 'A nota máxima 200 não combina com sugestão de erro nessa mesma competência.',
      explanation: 'Se a C3 recebe nota máxima 200, não deve existir sugestão corrigindo falha estrutural nela.'
    });
  }

  // 5. AUDITORIA ESPECÍFICA C4 (Conectivos, 'onde', 'o mesmo', Repetição de Conectivo)
  checksRun++;
  const c4NarRaw = getCompNarrative('c4');
  const c4NarAff = stripNegationsAndRuleExplanations(c4NarRaw);
  const c4Evidence = getCompEvidence('c4');

  if (paragraphs.length >= 3) {
    const missingD1 = paragraphs[1] ? !D1_D2_OPENING_OP_REGEX.test(paragraphs[1]) : false;
    const missingD2 = paragraphs.length >= 4 && paragraphs[2] ? !D1_D2_OPENING_OP_REGEX.test(paragraphs[2]) : false;
    const missingConcl = paragraphs[paragraphs.length - 1] ? !CONCL_OPENING_OP_REGEX.test(paragraphs[paragraphs.length - 1]) : false;

    const c4OpCheckText = c4NarRaw
      .replace(/\b(?:n[ãa]o\s+h[áa]\s+(?:aus[êe]ncia|falta)\s+de|sem\s+(?:aus[êe]ncia|falta)\s+de|n[ãa]o\s+penalizar)[^.;!\n]{0,100}/giu, ' ')
      .trim();
    const claimsMissingOp = /(?:aus[êe]ncia\s+de\s+(?:conectivo|operador\s+argumentativo)\s+(?:interpar[áa]grafo|de\s+abertura)|n[ãa]o\s+inicia\s+(?:o\s+)?(?:d1|d2|par[áa]grafo|conclus[ãa]o)\s+com\s+conectivo|sem\s+conectivo\s+(?:interpar[áa]grafo|de\s+abertura|no\s+in[íi]cio)|falta\s+(?:conectivo|operador)\s+(?:no\s+in[íi]cio|interpar[áa]grafo|no\s+d1|no\s+d2|na\s+conclus[ãa]o))/i.test(c4OpCheckText);
    if (claimsMissingOp) {
      const targetD1 = /\bd1\b|2[º°]\s*par[áa]grafo|primeiro\s+desenvolvimento/i.test(c4OpCheckText);
      const targetD2 = /\bd2\b|3[º°]\s*par[áa]grafo|segundo\s+desenvolvimento/i.test(c4OpCheckText);
      const targetConcl = /conclus[ãa]o|[úu]ltimo\s+par[áa]grafo/i.test(c4OpCheckText);

      const citedHasOp = Boolean(c4Evidence && (D1_D2_OPENING_OP_REGEX.test(c4Evidence) || CONCL_OPENING_OP_REGEX.test(c4Evidence)));
      const specificWrong =
        (targetD1 && !missingD1) ||
        (targetD2 && !missingD2) ||
        (targetConcl && !missingConcl) ||
        (!targetD1 && !targetD2 && !targetConcl && !missingD1 && !missingD2 && !missingConcl);

      if (specificWrong || citedHasOp) {
        pushContradiction({
          competency: 'C4',
          ruleCode: 'C4_FALSE_MISSING_CONNECTIVE',
          justificationClaim: 'Comentário da C4 apontou falta de conectivo no início do parágrafo',
          citedExcerpt: c4Evidence || (targetD2 ? paragraphs[2] : targetConcl ? paragraphs[paragraphs.length - 1] : paragraphs[1]),
          extractedEvidence: 'O parágrafo já começa com conectivo válido ligando as ideias do texto.',
          explanation: 'O texto já inicia o parágrafo com um conectivo adequado.'
        });
      }
    }
  }

  if (/(?:uso\s+(?:indevido|incorreto|inadequado)\s+(?:do|de)\s+["'“]?onde["'”]?|emprego\s+(?:indevido|errado)\s+de\s+["'“]?onde["'”]?)/i.test(c4NarAff) && !/\bonde\b/i.test(cleanEssay)) {
    pushContradiction({
      competency: 'C4',
      ruleCode: 'C4_FALSE_ONDE_CLAIM',
      justificationClaim: 'Comentário da C4 apontou erro no uso de "onde"',
      citedExcerpt: c4Evidence || 'Texto completo',
      extractedEvidence: 'A palavra "onde" não aparece em nenhuma frase da redação.',
      explanation: 'A justificativa falou em erro com "onde", mas essa palavra não existe no texto.'
    });
  }

  if (/(?:uso\s+(?:anaf[óo]rico|indevido|inadequado)\s+(?:de|do)\s+["'“]?o\s+mesmo)/i.test(c4NarAff) && essayAnaphoricMesmos.length === 0) {
    pushContradiction({
      competency: 'C4',
      ruleCode: 'C4_FALSE_ANAPHORIC_MESMO',
      justificationClaim: 'Comentário da C4 apontou uso inadequado de "o mesmo"',
      citedExcerpt: c4Evidence || 'Texto completo',
      extractedEvidence: 'A expressão "o mesmo / os mesmos" não foi usada para retomar termos na redação.',
      explanation: 'O apontamento citou o uso de "o mesmo", mas isso não aparece no seu texto.'
    });
  }

  const repeatedConnClaim = c4NarAff.match(/repeti[çc][ãa]o\s+(?:excessiva|viciosa)\s+(?:do\s+conectivo|d[aeo])\s+["'“]([^"'”]{3,28})["'”]/i);
  if (repeatedConnClaim?.[1]) {
    const conn = repeatedConnClaim[1].trim();
    const esc = conn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matches = cleanEssay.match(new RegExp(`\\b${esc}\\b`, 'giu')) || [];
    if (matches.length <= 1) {
      pushContradiction({
        competency: 'C4',
        ruleCode: 'C4_FALSE_CONNECTIVE_REPETITION',
        justificationClaim: `Comentário da C4 apontou repetição exagerada de "${conn}"`,
        citedExcerpt: c4Evidence || conn,
        extractedEvidence: `A palavra "${conn}" aparece apenas ${matches.length} vez(es) na redação inteira.`,
        explanation: `O termo "${conn}" aparece apenas ${matches.length} vez(es), sem repetição exagerada.`
      });
    }
  }

  // 6. AUDITORIA ESPECÍFICA C5 (5 Elementos da Conclusão & Direitos Humanos)
  checksRun++;
  const c5Score = getCompScore('c5');
  const c5NarRaw = getCompNarrative('c5');
  const c5NarAff = stripNegationsAndRuleExplanations(c5NarRaw);
  const c5Evidence = getCompEvidence('c5');
  const lastPara = paragraphs.length > 0 ? paragraphs[paragraphs.length - 1] : cleanEssay;
  const prevPara = paragraphs.length >= 2 ? paragraphs[paragraphs.length - 2] : '';
  const conclusionText = paragraphs.length >= 4 && CONCL_OPENING_OP_REGEX.test(prevPara) ? `${prevPara}\n\n${lastPara}` : lastPara;
  const c5TextTarget = c5Evidence && !isDescriptivePlaceholder(c5Evidence) && /portanto|deve|cabe|governo|minist[ée]rio|por meio|a fim de/i.test(c5Evidence)
    ? `${c5Evidence}\n${conclusionText}`
    : conclusionText;
  const c5Signals = extractC5EvidenceSignals(c5TextTarget);
  const c5Struct = payload?.c5Structure;

  if (/(?:aus[êe]ncia\s+de\s+a[çc][ãa]o|a[çc][ãa]o\s+ausente|n[ãa]o\s+(?:apresenta|indica|especifica)\s+(?:a\s+)?a[çc][ãa]o|falta\s+(?:identificar\s+o\s+que\s+ser[áa]\s+feito|a\s+a[çc][ãa]o)|a[çc][ãa]o\s*\(✗\))/i.test(c5NarRaw) && c5Signals.hasAction) {
    pushContradiction({
      competency: 'C5',
      ruleCode: 'C5_FALSE_MISSING_ACTION',
      justificationClaim: 'Comentário da C5 disse que faltava a Ação da proposta',
      citedExcerpt: c5Evidence || lastPara,
      extractedEvidence: 'Existe ação clara explicando o que deve ser feito na conclusão.',
      explanation: 'A Ação da proposta de intervenção está presente na conclusão.'
    });
  }

  if (/(?:aus[êe]ncia\s+de\s+agente|agente\s+ausente|n[ãa]o\s+identifica\s+(?:o\s+agente|quem\s+executar[áa])|agente\s*\(✗\))/i.test(c5NarRaw) && c5Signals.hasAgent) {
    pushContradiction({
      competency: 'C5',
      ruleCode: 'C5_FALSE_MISSING_AGENT',
      justificationClaim: 'Comentário da C5 disse que faltava o Agente da proposta',
      citedExcerpt: c5Evidence || lastPara,
      extractedEvidence: 'O Agente responsável pela medida foi citado claramente na conclusão.',
      explanation: 'O Agente da proposta de intervenção está presente na conclusão.'
    });
  }

  if (/(?:aus[êe]ncia\s+de\s+(?:meio|modo)|modo\/meio\s+ausente|n[ãa]o\s+(?:informa|apresenta)\s+(?:o\s+)?(?:meio|modo)|modo\/meio\s*\(✗\))/i.test(c5NarRaw) && c5Signals.hasMode) {
    pushContradiction({
      competency: 'C5',
      ruleCode: 'C5_FALSE_MISSING_MODE',
      justificationClaim: 'Comentário da C5 disse que faltava o Meio/Modo da proposta',
      citedExcerpt: c5Evidence || lastPara,
      extractedEvidence: 'A conclusão explica como a ação será feita ("por meio de", "mediante", etc.).',
      explanation: 'O Meio/Modo de execução está presente na conclusão.'
    });
  }

  if (/(?:aus[êe]ncia\s+de\s+(?:finalidade|efeito)|finalidade\s+ausente|n[ãa]o\s+(?:explicita|apresenta)\s+(?:a\s+)?finalidade|finalidade\s*\(✗\))/i.test(c5NarRaw) && c5Signals.hasEffect) {
    pushContradiction({
      competency: 'C5',
      ruleCode: 'C5_FALSE_MISSING_EFFECT',
      justificationClaim: 'Comentário da C5 disse que faltava a Finalidade/Efeito da proposta',
      citedExcerpt: c5Evidence || lastPara,
      extractedEvidence: 'A conclusão informa para que a medida serve ("a fim de", "para que", etc.).',
      explanation: 'A Finalidade/Efeito da proposta está presente na conclusão.'
    });
  }

  // Para Detalhamento: só flagra contradição se NÃO estiver explicando que o trecho se confunde com meio/finalidade
  const c5DetailCheckText = c5NarRaw
    .replace(/\b(?:sem\s+confundir\s+aus[êe]ncia\s+de\s+detalhamento|n[ãa]o\s+confund\w*\s+aus[êe]ncia\s+de\s+detalhamento|n[ãa]o\s+h[áa]\s+aus[êe]ncia\s+de\s+detalhamento)\b[^.;!\n]{0,110}/giu, ' ')
    .trim();
  const claimsMissingDetailing = /(?:aus[êe]ncia\s+de\s+detalhamento|falt(?:a|ou)\s+(?:o\s+)?detalhamento|sem\s+(?:o\s+)?detalhamento|n[ãa]o\s+(?:h[áa]|apresenta|possui|houve)\s+(?:o\s+)?detalhamento|detalhamento\s*(?:\(✗\)|ausente))/i.test(c5DetailCheckText);
  const qualifiesOverlap = /(?:apenas\s+repete\s+a\s+a[çc][ãa]o|descreve\s+(?:o\s+)?meio|reformula\s+(?:a\s+)?finalidade|confund|sobreposto)/i.test(c5NarRaw);
  const rawDetText = (c5Struct?.detailing?.text || '').replace(/^[,\s—–(]+|[—–)\s.,;]+$/g, '').trim();
  const isVagueOrAcronymDet = rawDetText.length < 6
    || (/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9.\-\/\s]{2,18}$/.test(rawDetText) && !/[a-záéíóúâêôãõç]{3,}\s+[a-záéíóúâêôãõç]{2,}/.test(rawDetText))
    || /^(?:[A-Za-zÀ-ú]{2,14})(?:\s+[A-Za-zÀ-ú0-9]{1,12})?$/.test(rawDetText)
    || /^(?:isso\s+[ée]\s+muito\s+importante|o\s+que\s+[ée]\s+(?:muito\s+)?importante|com\s+muito\s+esfor[çc]o|de\s+(?:forma|maneira)\s+(?:eficaz|eficiente|adequada|r[áa]pida|urgente)|o\s+quanto\s+antes|sem\s+medir\s+esfor[çc]os|para\s+o\s+bem\s+de\s+todos)$/iu.test(rawDetText);
  const structHasAuthenticDetailing = Boolean(
    c5Struct?.detailing?.present &&
    rawDetText.length >= 8 &&
    !isVagueOrAcronymDet &&
    payload?.argumentativeAndCohesionAudit?.c5DetailingIsDistinctAndSpecific !== false
  );
  const citedHasUnambiguousDetailing = Boolean(c5Evidence && !isDescriptivePlaceholder(c5Evidence) && extractC5EvidenceSignals(c5Evidence).hasUnambiguousDetailing);

  if (claimsMissingDetailing && !qualifiesOverlap && (structHasAuthenticDetailing || citedHasUnambiguousDetailing || c5Signals.hasUnambiguousDetailing)) {
    pushContradiction({
      competency: 'C5',
      ruleCode: 'C5_FALSE_MISSING_DETAILING',
      justificationClaim: 'Comentário da C5 disse que faltava o Detalhamento da proposta',
      citedExcerpt: c5Struct?.detailing?.text || c5Evidence || lastPara,
      extractedEvidence: 'Há explicação extra ou exemplo detalhando um dos elementos da proposta na conclusão.',
      explanation: 'Encontramos um Detalhamento válido na conclusão, por isso o apontamento foi conferido.'
    });
  }

  if (/(?:desrespeito\s+aos\s+direitos\s+humanos|viola[çc][ãa]o\s+aos\s+direitos\s+humanos|fere\s+os\s+direitos\s+humanos)/i.test(c5NarAff) && !detectsTrueHumanRightsViolation(cleanEssay)) {
    pushContradiction({
      competency: 'C5',
      ruleCode: 'C5_FALSE_HUMAN_RIGHTS_VIOLATION',
      justificationClaim: 'Comentário da C5 apontou violação aos Direitos Humanos',
      citedExcerpt: c5Evidence || lastPara,
      extractedEvidence: 'Nenhuma proposta violenta ou contrária à dignidade humana foi encontrada no texto.',
      explanation: 'Não há desrespeito aos Direitos Humanos na proposta escrita na conclusão.'
    });
  }

  // 7. COERÊNCIA DE POLARIDADE NOTA ↔ JUSTIFICATIVA & SOMA ARITMÉTICA
  checksRun++;
  const unmitigatedFailurePattern = /\b(?:teto\s+(?:m[áa]ximo\s+)?de\s+(?:160|40|80|120)|limitad[oa]\s+a\s+(?:160|40|80|120)|desvios\s+recorrentes|m[úu]ltiplos\s+desvios|marcas\s+de\s+oralidade\s+identificadas|tangenciamento\s+tem[áa]tico\s+identificado|fuga\s+total|desrespeito\s+aos\s+direitos\s+humanos|aus[êe]ncia\s+de\s+detalhamento|falt(?:a|am)\s+(?:1|2|3|4)\s+elemento|repeti[çc][ãa]o\s+do\s+mesmo\s+argumento\s+central|predominantement[ea]\s+expositiv[oa]s)\b/i;

  for (const ck of compKeys) {
    const score = getCompScore(ck);
    if (score === null) continue;
    const compObj = comps[ck];
    const compTag = ck.toUpperCase() as 'C1' | 'C2' | 'C3' | 'C4' | 'C5';
    const rawNar = getCompNarrative(ck);
    const affNar = stripNegationsAndRuleExplanations(rawNar);

    if (score === 200) {
      const hasProbs = (compObj?.problemsIdentified?.length || 0) > 0 || (compObj?.penaltiesOrGaps?.length || 0) > 0;
      const hasFailureClaim = unmitigatedFailurePattern.test(affNar);
      if (hasProbs || hasFailureClaim) {
        pushContradiction({
          competency: compTag,
          ruleCode: 'SCORE_200_JUSTIFICATION_CONTRADICTION',
          justificationClaim: compObj?.problemsIdentified?.[0] || compObj?.penaltiesOrGaps?.[0] || compObj?.justificativa_analitica || compObj?.diagnostic || '',
          citedExcerpt: getCompEvidence(ck) || 'Trecho avaliado',
          extractedEvidence: `A ${compTag} recebeu nota máxima 200, mas ainda há apontamento de erro ou limite no comentário.`,
          explanation: `Na ${compTag}, a nota 200 diverge do apontamento de falha registrado no comentário.`
        });
      }
    } else if (score > 0 && score <= 80) {
      const hasOnlyMaxPraise = /\b(?:nota\s+m[áa]xima\s+200|excel[êe]ncia\s+comprovada\s+em\s+todos\s+os\s+requisitos|desempenho\s+m[áa]ximo\s+atestad[oa])\b/i.test(affNar) &&
        !/(desvio|erro|falha|tangencia|aus[êe]ncia|incomplet|prec[áa]r|insuficient|limitad|lacuna)/i.test(affNar);
      if (hasOnlyMaxPraise) {
        pushContradiction({
          competency: compTag,
          ruleCode: 'LOW_SCORE_PRAISE_CONTRADICTION',
          justificationClaim: compObj?.justificativa_analitica || compObj?.diagnostic || '',
          citedExcerpt: getCompEvidence(ck) || 'Trecho avaliado',
          extractedEvidence: `A nota (${score} pts) está baixa, mas o comentário traz apenas elogios de nota máxima.`,
          explanation: `Na ${compTag}, a pontuação (${score} pts) precisa combinar com uma explicação clara do que faltou.`
        });
      }
    }
  }

  // Verificar soma aritmética de totalScore
  const c1s = getCompScore('c1');
  const c2s = getCompScore('c2');
  const c3s = getCompScore('c3');
  const c4s = getCompScore('c4');
  const c5s = getCompScore('c5');
  if (
    typeof payload?.totalScore === 'number' &&
    c1s !== null && c2s !== null && c3s !== null && c4s !== null && c5s !== null
  ) {
    const expectedSum = c1s + c2s + c3s + c4s + c5s;
    if (Math.abs(payload.totalScore - expectedSum) > 1) {
      pushContradiction({
        competency: 'GLOBAL',
        ruleCode: 'TOTAL_SCORE_SUM_MISMATCH',
        justificationClaim: `Nota total (${payload.totalScore}) diferente da soma (${c1s}+${c2s}+${c3s}+${c4s}+${c5s}=${expectedSum}).`,
        citedExcerpt: 'Soma das 5 competências',
        extractedEvidence: `A soma das notas é ${expectedSum} pts, mas o total exibido era ${payload.totalScore} pts.`,
        explanation: 'A soma das 5 competências foi ajustada para bater exatamente com a nota total.'
      });
    }
  }

  // Verificar reviewerReport (quando presente)
  checksRun++;
  const reviews = Array.isArray(payload?.reviewerReport?.competencyReviews) ? payload.reviewerReport!.competencyReviews! : [];
  for (const rev of reviews) {
    const revTag = (`C${rev.competencyNum}` as 'C1' | 'C2' | 'C3' | 'C4' | 'C5');
    if (rev.reviewedScore === 200 && rev.flawIdentified && rev.flawIdentified.trim().length > 0) {
      pushContradiction({
        competency: revTag,
        ruleCode: 'REVIEWER_200_WITH_FLAW',
        justificationClaim: rev.flawIdentified,
        citedExcerpt: rev.trecho_evidencia || 'Revisão da avaliação',
        extractedEvidence: `A revisão manteve 200 pts na ${revTag}, mas registrou uma falha ao mesmo tempo.`,
        explanation: `Na revisão da ${revTag}, a nota 200 divergiu do apontamento de falha.`
      });
    }
    if (rev.trecho_evidencia && !isDescriptivePlaceholder(rev.trecho_evidencia) && rev.trecho_evidencia.length >= 12) {
      const loc = locateExcerptParagraphs(rev.trecho_evidencia, cleanEssay);
      if (!loc.found && rev.flawIdentified) {
        pushContradiction({
          competency: revTag,
          ruleCode: 'REVIEWER_EXCERPT_NOT_FOUND',
          justificationClaim: rev.flawIdentified,
          citedExcerpt: rev.trecho_evidencia,
          extractedEvidence: 'O trecho citado pela revisão não foi encontrado exatamente assim na redação.',
          explanation: `Na revisão da ${revTag}, o trecho citado não aparece literalmente no seu texto.`
        });
      }
    }
  }

  // 8. CONFERÊNCIA ENTRE TRECHOS CITADOS E COMPETÊNCIAS PENALIZADAS
  checksRun++;
  const crossValidationReport = crossValidateEvidenceSemanticCorrelation(payload, cleanEssay, _theme);
  for (const cvItem of crossValidationReport.items) {
    if (cvItem.isPenalized && !cvItem.semanticCorrelationMatched && cvItem.mismatchedDomainHints.length > 0) {
      const ruleCode =
        cvItem.competency === 'C3'
          ? 'C3_EVIDENCE_SEMANTIC_MISMATCH'
          : cvItem.competency === 'C5'
            ? 'C5_EVIDENCE_SEMANTIC_MISMATCH'
            : 'COMPETENCY_EVIDENCE_SEMANTIC_MISMATCH';
      pushContradiction({
        competency: cvItem.competency,
        ruleCode,
        justificationClaim: `Trecho usado na ${cvItem.competency} (nota ${cvItem.score ?? 'N/A'}) não correspondia diretamente ao critério avaliado.`,
        citedExcerpt: cvItem.citedExcerpt || 'Trecho ausente',
        extractedEvidence: `${cvItem.mismatchedDomainHints[0]} ${cvItem.groundedFactsExtracted[0] || ''}`.trim(),
        explanation: `Na ${cvItem.competency}, conferimos que ${cvItem.mismatchedDomainHints[0].charAt(0).toLowerCase()}${cvItem.mismatchedDomainHints[0].slice(1)}`
      });
    }
  }
  if (!crossValidationReport.c3FeedbackGroundedInFacts) {
    const c3Cv = crossValidationReport.items.find((i) => i.competency === 'C3');
    if (c3Cv && c3Cv.semanticCorrelationMatched) {
      pushContradiction({
        competency: 'C3',
        ruleCode: 'C3_FEEDBACK_NOT_GROUNDED_IN_FACTS',
        justificationClaim: 'Comentário da C3 divergiu do que foi encontrado nos parágrafos D1 e D2.',
        citedExcerpt: c3Cv.citedExcerpt || paragraphs[1] || '',
        extractedEvidence: c3Cv.groundedFactsExtracted.join(' '),
        explanation: 'Conferência da C3: o comentário precisa considerar exatamente as ideias e conexões presentes em D1 e D2.'
      });
    }
  }
  if (!crossValidationReport.c5FeedbackGroundedInFacts) {
    const c5Cv = crossValidationReport.items.find((i) => i.competency === 'C5');
    if (c5Cv && c5Cv.semanticCorrelationMatched) {
      pushContradiction({
        competency: 'C5',
        ruleCode: 'C5_FEEDBACK_NOT_GROUNDED_IN_FACTS',
        justificationClaim: 'Comentário da C5 divergiu dos elementos encontrados na conclusão.',
        citedExcerpt: c5Cv.citedExcerpt || lastPara,
        extractedEvidence: c5Cv.groundedFactsExtracted.join(' '),
        explanation: 'Conferência da C5: o comentário precisa refletir exatamente os elementos presentes na conclusão.'
      });
    }
  }

  const passed = contradictions.length === 0;
  const computedTotal =
    typeof payload?.totalScore === 'number'
      ? payload.totalScore
      : (c1s !== null && c2s !== null && c3s !== null && c4s !== null && c5s !== null ? c1s + c2s + c3s + c4s + c5s : null);

  return {
    timestamp: new Date().toISOString(),
    passed,
    blockedFinalScoreEmission: false,
    finalScoreEmitted: computedTotal,
    totalChecksRun: checksRun,
    contradictionsCount: contradictions.length,
    contradictions,
    summaryMessage: passed
      ? 'Nota e justificativas 100% alinhadas com o que está escrito na sua redação.'
      : `Encontramos ${contradictions.length} diferença(s) entre a explicação dos erros e o que está no texto, detalhada(s) abaixo de forma simples.`,
    verifiedDimensions: [
      'Conferência literal dos trechos citados no seu texto',
      'Localização exata do parágrafo onde cada ponto aparece',
      'Ligação entre cada trecho citado e a competência avaliada',
      'Conferência da C3 nos parágrafos de desenvolvimento (D1 e D2) e da C5 na conclusão',
      'Checagem de crase, vírgula, ortografia, repetição e conectivos',
      'Alinhamento entre a nota final e a justificativa de cada competência'
    ],
    crossValidationReport
  };
}

function roundToStep20(val: number): number {
  return Math.max(0, Math.min(200, Math.round(val / 20) * 20));
}

export interface ConcessaoNotaOptions {
  maxCap?: number;
  aiWeight?: number;
  auditWeight?: number;
}

/**
 * Concessão de Nota: calcula a média ponderada entre a pontuação atribuída pela IA
 * e o rigor da Auditoria de Consistência baseada nas evidências textuais,
 * ajustando para a escala oficial do ENEM (múltiplos de 20) dentro dos tetos válidos.
 */
export function concederNotaPonderada(
  aiScore: number,
  auditEvidenceScore: number,
  options: ConcessaoNotaOptions = {}
): number {
  const maxCap = typeof options.maxCap === 'number' ? options.maxCap : 200;
  const aiWeight = typeof options.aiWeight === 'number' ? options.aiWeight : 0.45;
  const auditWeight = typeof options.auditWeight === 'number' ? options.auditWeight : 0.55;
  const totalWeight = aiWeight + auditWeight || 1;
  const weightedMean = (aiScore * aiWeight + auditEvidenceScore * auditWeight) / totalWeight;
  const stepped = roundToStep20(weightedMean);
  return Math.min(maxCap, Math.max(0, stepped));
}

export interface ReconcileAuditOptions {
  isOfficialBenchmark?: boolean;
  isWholeEssayZero?: boolean;
  isTangenciamento?: boolean;
  isHumanRightsViolationC5?: boolean;
  caps?: Partial<Record<'c1Max' | 'c2Max' | 'c3Max' | 'c4Max' | 'c5Max', number>>;
}

export interface ReconcileAuditResult {
  reconciledScores: { c1: number; c2: number; c3: number; c4: number; c5: number; total: number };
  previousScores: { c1: number; c2: number; c3: number; c4: number; c5: number; total: number };
  concessionApplied: boolean;
  concessionDeltaPoints: number;
  concessionDetails: AuditConcessionItem[];
  concessionSummaryPt: string;
  consistencyAuditReport: DiagnosticConsistencyAuditReport;
}

function simplifyDidacticFeedbackForStudent(
  compKey: 'c1' | 'c2' | 'c3' | 'c4' | 'c5',
  finalScore: number,
  context: {
    validC1Count: number;
    hasOralMarks: boolean;
    hasIntroRep: boolean;
    hasDevRep: boolean;
    bothDevsDeep: boolean;
    hasConnsAll: boolean;
    c5ElementsCount: number;
    hasDetailing: boolean;
  }
): { diagnostic: string; evaluation: string; howToImprove: string } {
  if (compKey === 'c1') {
    if (finalScore >= 200) {
      return {
        diagnostic: 'Excelente domínio da escrita formal, com frases bem ligadas e vocabulário preciso.',
        evaluation: 'Seu texto manteve registro formal e clareza do início ao fim, sem desvios que comprometam a nota.',
        howToImprove: 'Continue revisando pontuação e concordância na releitura final para manter os 200 pontos.'
      };
    }
    if (finalScore >= 160) {
      return {
        diagnostic: context.hasOralMarks
          ? 'Bom domínio da escrita formal, mas há expressões mais próximas da fala do dia a dia.'
          : 'Bom domínio da norma-padrão, com apenas alguns desvios pontuais de gramática ou pontuação.',
        evaluation: `Nota ${finalScore}/200: você escreve com clareza; ajustando pequenos desvios (${context.validC1Count} encontrado(s)) e escolhendo termos mais formais, você alcança a nota máxima.`,
        howToImprove: 'Troque expressões informais ou genéricas por termos mais precisos e revise vírgulas e crase antes de entregar.'
      };
    }
    return {
      diagnostic: 'A escrita transmite sua ideia, mas precisa de revisão mais atenta de gramática e pontuação.',
      evaluation: `Nota ${finalScore}/200: foram encontrados desvios na norma-padrão que podem ser corrigidos com revisão simples.`,
      howToImprove: 'Releia cada frase buscando erros de concordância, acentuação, crase e pontuação entre orações.'
    };
  }

  if (compKey === 'c2') {
    if (finalScore >= 200) {
      return {
        diagnostic: 'Você entendeu todo o tema e usou repertório sociocultural de forma produtiva na argumentação.',
        evaluation: 'Seu texto trouxe referências externas válidas nos parágrafos de desenvolvimento e conectou tudo ao assunto proposto.',
        howToImprove: 'Mantenha esse padrão, sempre explicando como cada referência comprova sua tese.'
      };
    }
    if (finalScore === 160) {
      return {
        diagnostic: context.hasDevRep
          ? 'Você abordou bem o tema e trouxe repertório válido, que pode ser explorado com ainda mais profundidade.'
          : 'Você compreendeu o tema, mas faltou usar repertório sociocultural nos parágrafos de desenvolvimento.',
        evaluation: context.hasDevRep
          ? 'Nota 160/200: a referência aparece no texto, mas vale ligá-la com mais clareza ao seu ponto de vista.'
          : context.hasIntroRep
            ? 'Nota 160/200: você trouxe repertório na introdução, mas para chegar a 200 pontos é preciso apresentar e explicar repertório também no desenvolvimento.'
            : 'Nota 160/200: inclua dados, leis ou autores nos parágrafos de desenvolvimento para fortalecer sua tese.',
        howToImprove: 'Sempre apresente uma referência cultural, histórica ou científica nos parágrafos de desenvolvimento e explique sua relação com o problema.'
      };
    }
    return {
      diagnostic: 'O tema foi abordado, mas o texto precisa de repertório externo para sustentar melhor os argumentos.',
      evaluation: `Nota ${finalScore}/200: fortaleça os parágrafos de desenvolvimento com dados, citações ou fatos históricos ligados ao tema.`,
      howToImprove: 'Conecte seu ponto de vista a pelo menos uma referência confiável nos parágrafos de desenvolvimento.'
    };
  }

  if (compKey === 'c3') {
    if (finalScore >= 200) {
      return {
        diagnostic: 'Projeto de texto estratégico: seus dois argumentos avançam bem, explicando causas e consequências com profundidade.',
        evaluation: 'Você articulou tese, repertório e análise crítica nos dois parágrafos de desenvolvimento sem repetir ideias.',
        howToImprove: 'Continue planejando dois motivos diferentes antes de escrever para manter esse alto nível.'
      };
    }
    if (finalScore >= 160) {
      return {
        diagnostic: 'Boa organização de ideias, com argumentos distintos e ligados ao tema.',
        evaluation: `Nota ${finalScore}/200: você apresentou bons pontos, e pode ganhar ainda mais força explicando melhor por que o problema acontece e o que ele provoca na prática.`,
        howToImprove: 'Em cada parágrafo de desenvolvimento, deixe claro qual é a causa principal e qual é a consequência concreta desse problema.'
      };
    }
    return {
      diagnostic: 'Os argumentos aparecem no texto, mas ainda estão mais descritivos do que aprofundados.',
      evaluation: `Nota ${finalScore}/200: evite apenas constatar que o problema existe; explique o que o causa e quais são seus efeitos na sociedade.`,
      howToImprove: 'Dedique algumas linhas em D1 e D2 para responder "por que isso acontece?" e "o que isso gera?".'
    };
  }

  if (compKey === 'c4') {
    if (finalScore >= 200) {
      return {
        diagnostic: 'Excelente ligação entre frases e parágrafos, tornando a leitura fluida e organizada.',
        evaluation: 'Os conectivos iniciam bem os parágrafos e retomam as ideias anteriores sem repetições desnecessárias.',
        howToImprove: 'Mantenha essa variedade natural de conectivos e pronomes para preservar a fluidez.'
      };
    }
    if (finalScore >= 160) {
      return {
        diagnostic: 'Boa articulação entre as partes do texto, com conectivos claros na maioria das passagens.',
        evaluation: `Nota ${finalScore}/200: as ideias conversam entre si; variar ainda mais as formas de retomada ajuda a chegar aos 200 pontos.`,
        howToImprove: 'Evite repetir sempre os mesmos conectivos no início das frases e revise pronomes de retomada.'
      };
    }
    return {
      diagnostic: 'A ligação entre algumas frases ou parágrafos pode ficar mais clara.',
      evaluation: `Nota ${finalScore}/200: use conectivos adequados no começo dos parágrafos e entre os períodos para guiar o leitor.`,
      howToImprove: 'Comece D1, D2 e a conclusão com conectivos claros (como "Em primeiro plano", "Além disso" e "Portanto").'
    };
  }

  // C5
  if (finalScore >= 200) {
    return {
      diagnostic: 'Proposta de intervenção completa, clara e articulada, com todos os 5 elementos exigidos pelo ENEM.',
      evaluation: 'Você indicou quem faz, o que fazer, como fazer, para quê e ainda detalhou concretamente a medida, respeitando os Direitos Humanos.',
      howToImprove: 'Mantenha esse padrão detalhando sempre o público, o local ou o funcionamento prático da ação.'
    };
  }
  const missingHint = !context.hasDetailing
    ? 'faltou detalhar melhor um dos elementos (explicando quem, onde ou como funcionará na prática)'
    : 'vale deixar todos os 5 elementos (agente, ação, meio, finalidade e detalhamento) ainda mais explícitos';
  return {
    diagnostic: `Sua conclusão traz ${context.c5ElementsCount} de 5 elementos da proposta de intervenção.`,
    evaluation: `Nota ${finalScore}/200: a solução dialoga com o tema, mas ${missingHint}.`,
    howToImprove: 'Confira sempre na conclusão se respondeu às 5 perguntas: quem faz, o que faz, como faz, para quê e qual o detalhe extra.'
  };
}

/**
 * Concessão de Nota: ao detectar divergência entre a pontuação da IA e a Auditoria de Consistência,
 * realiza reavaliação ponderada entre o diagnóstico da IA e as evidências literais encontradas,
 * simplificando o feedback final para que seja direto e didático ao estudante.
 */
export function reconcileEvaluationWithConsistencyAudit(
  payload: AuditInputPayload,
  essayText: string,
  theme: string = '',
  options: ReconcileAuditOptions = {}
): ReconcileAuditResult {
  const cleanEssay = (essayText || '').trim();
  const paragraphs = cleanEssay.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const comps = payload?.competencies || {};

  const getScore = (k: 'c1' | 'c2' | 'c3' | 'c4' | 'c5'): number => {
    const raw = comps[k]?.score ?? comps[k]?.nota ?? 120;
    return Math.max(0, Math.min(200, roundToStep20(Number(raw))));
  };

  const prev = {
    c1: getScore('c1'),
    c2: getScore('c2'),
    c3: getScore('c3'),
    c4: getScore('c4'),
    c5: getScore('c5'),
    total: 0
  };
  prev.total = prev.c1 + prev.c2 + prev.c3 + prev.c4 + prev.c5;

  const isWholeEssayZero = Boolean(options.isWholeEssayZero || prev.total === 0);
  const isOfficialBenchmark = Boolean(options.isOfficialBenchmark);
  const isTangenciamento = Boolean(!isWholeEssayZero && (options.isTangenciamento || prev.c2 === 40 || payload?.thematicAudit?.classification === 'tangenciamento'));
  const realHRViolation = Boolean(options.isHumanRightsViolationC5 || detectsTrueHumanRightsViolation(cleanEssay));

  if (isOfficialBenchmark || isWholeEssayZero) {
    const fixedVal = isOfficialBenchmark ? 200 : 0;
    const fixedScores = { c1: fixedVal, c2: fixedVal, c3: fixedVal, c4: fixedVal, c5: fixedVal, total: fixedVal * 5 };
    const report = auditDiagnosticVsEvidenceConsistency(payload, cleanEssay, theme);
    report.concessionApplied = false;
    report.concessionDeltaPoints = 0;
    report.concessionDetails = [];
    report.concessionSummaryPt = isOfficialBenchmark
      ? 'Redação oficial Nota 1000 conferida sem divergências.'
      : 'Nota Zero oficial conferida pelas regras do ENEM.';
    return {
      reconciledScores: fixedScores,
      previousScores: prev,
      concessionApplied: false,
      concessionDeltaPoints: 0,
      concessionDetails: [],
      concessionSummaryPt: report.concessionSummaryPt,
      consistencyAuditReport: report
    };
  }

  const initialAudit = auditDiagnosticVsEvidenceConsistency(payload, cleanEssay, theme);
  const next = { ...prev };
  const concessionDetails: AuditConcessionItem[] = [];
  const caps = {
    c1Max: options.caps?.c1Max ?? 200,
    c2Max: isTangenciamento ? 40 : (options.caps?.c2Max ?? 200),
    c3Max: isTangenciamento ? Math.min(40, options.caps?.c3Max ?? 40) : (options.caps?.c3Max ?? 200),
    c4Max: options.caps?.c4Max ?? 200,
    c5Max: realHRViolation ? 0 : (isTangenciamento ? Math.min(40, options.caps?.c5Max ?? 40) : (options.caps?.c5Max ?? 200))
  };

  const rulesFor = (comp: 'C1' | 'C2' | 'C3' | 'C4' | 'C5') =>
    new Set(initialAudit.contradictions.filter((c) => c.competency === comp).map((c) => c.ruleCode));

  // --- C1 Concessão de Nota ---
  const c1Rules = rulesFor('C1');
  const falseC1Rules = [
    'C1_IDENTICAL_CORRECTION',
    'C1_FALSE_ANAPHORIC_MESMO',
    'C1_FALSE_MISSING_CRASE',
    'C1_FALSE_IMPROPER_CRASE',
    'C1_FALSE_ORTHOGRAPHY_CLAIM',
    'C1_FALSE_MISSING_COMMA',
    'C1_FALSE_ORALITY_CLAIM'
  ];
  const validC1Deviations = (Array.isArray(payload?.c1Deviations) ? payload.c1Deviations! : []).filter((d) => {
    const snip = String(d?.snippet || '').trim();
    if (!snip || isDescriptivePlaceholder(snip)) return false;
    const loc = locateExcerptParagraphs(snip, cleanEssay);
    if (!loc.found || loc.wasTruncated) return false;
    const best = String(d?.bestForm || '').replace(/^["'“]|["'”]$/g, '').trim();
    const cleanSnip = stripLocationPrefix(snip).cleaned;
    if (best && cleanSnip && best === cleanSnip) return false;
    const probAff = stripNegationsAndRuleExplanations(String(d?.problem || ''));
    if (/(?:o\s+mesmo|os\s+mesmos|a\s+mesma|as\s+mesmas)/i.test(probAff) && !/\bmesm[oa]s?\b/i.test(cleanSnip)) return false;
    if (/(?:falta\s+de\s+crase|aus[êe]ncia\s+de\s+crase)/i.test(probAff) && /\b(?:à|às|àquele|àquela|àquilo)\b/i.test(cleanSnip) && !/\b[aA]s?\s+[a-záéíóúâêôãõç]{3,}\b/.test(cleanSnip)) return false;
    return true;
  });
  if (Array.isArray(payload?.c1Deviations)) {
    payload.c1Deviations = validC1Deviations;
  }

  const essayOralMarks = findOralOrVagueMatches(cleanEssay);
  const hasC1FalseClaim = falseC1Rules.some((r) => c1Rules.has(r));
  const factualC1 = (essayOralMarks.length > 0 || validC1Deviations.length >= 2)
    ? (validC1Deviations.length >= 6 ? 120 : 160)
    : (validC1Deviations.length === 1 ? Math.min(caps.c1Max, 180) : Math.min(caps.c1Max, 200));

  if ((hasC1FalseClaim && factualC1 > prev.c1) || (prev.c1 < 160 && factualC1 >= 180 && validC1Deviations.length <= 1 && essayOralMarks.length === 0)) {
    const target = Math.max(prev.c1, concederNotaPonderada(prev.c1, factualC1, { maxCap: caps.c1Max }));
    if (target > prev.c1) {
      next.c1 = target;
      concessionDetails.push({
        competency: 'C1',
        previousScore: prev.c1,
        reconciledScore: target,
        reasonPt: `Concessão ponderada na C1 (${prev.c1} → ${target} pts) após conferir os desvios reais na sua escrita.`
      });
    }
  } else if (prev.c1 === 200 && (c1Rules.has('SCORE_200_JUSTIFICATION_CONTRADICTION') || factualC1 < 200)) {
    if (essayOralMarks.length > 0 || validC1Deviations.length >= 2) {
      const target = Math.min(caps.c1Max, 160);
      next.c1 = target;
      concessionDetails.push({
        competency: 'C1',
        previousScore: prev.c1,
        reconciledScore: target,
        reasonPt: `Concessão ponderada na C1 (200 → ${target} pts) considerando as marcas de oralidade ou desvios confirmados.`
      });
    } else if (comps.c1 && c1Rules.has('SCORE_200_JUSTIFICATION_CONTRADICTION')) {
      comps.c1.problemsIdentified = [];
      comps.c1.penaltiesOrGaps = [];
    }
  }

  // --- C2 Concessão de Nota ---
  const c2Rules = rulesFor('C2');
  const hasIntroRep = paragraphs.length > 0 && paragraphHasValidRepertoire(paragraphs[0], 'intro');
  const devParas = paragraphs.length >= 3 ? paragraphs.slice(1, -1) : (paragraphs.length === 2 ? [paragraphs[1]] : []);
  const hasDevRep = paragraphs.length >= 3
    ? devParas.some((p) => paragraphHasValidRepertoire(p, 'dev'))
    : (hasIntroRep || devParas.some((p) => paragraphHasValidRepertoire(p, 'dev')));
  const hasAnyValidRep = hasIntroRep || hasDevRep;
  const factualC2 = paragraphs.length >= 3
    ? (hasDevRep ? 200 : (hasIntroRep ? 160 : 120))
    : (hasAnyValidRep ? 200 : 120);

  if (!isTangenciamento) {
    if (c2Rules.has('C2_CONCLUSION_AGENCY_TREATED_AS_REPERTOIRE') || (prev.c2 === 200 && !hasDevRep && paragraphs.length >= 3)) {
      const target = 160;
      next.c2 = target;
      concessionDetails.push({
        competency: 'C2',
        previousScore: prev.c2,
        reconciledScore: target,
        reasonPt: 'Concessão na C2 para 160 pts: não há repertório produtivo nos parágrafos de desenvolvimento.'
      });
    } else if ((c2Rules.has('C2_FALSE_ABSENCE_OF_REPERTOIRE') || c2Rules.has('C2_FALSE_MISSING_DEV_REPERTOIRE') || (factualC2 - prev.c2 >= 40 && hasAnyValidRep)) && prev.c2 < factualC2) {
      const target = concederNotaPonderada(prev.c2, factualC2, { maxCap: caps.c2Max });
      if (target > prev.c2) {
        next.c2 = target;
        concessionDetails.push({
          competency: 'C2',
          previousScore: prev.c2,
          reconciledScore: target,
          reasonPt: hasDevRep
            ? `Concessão ponderada na C2 (${prev.c2} → ${target} pts): repertório sociocultural confirmado no desenvolvimento.`
            : `Concessão ponderada na C2 (${prev.c2} → ${target} pts): repertório sociocultural válido identificado no texto.`
        });
      }
    } else if (prev.c2 === 200 && c2Rules.has('SCORE_200_JUSTIFICATION_CONTRADICTION')) {
      const hasRealGap = (comps.c2?.problemsIdentified?.length || 0) > 0 || !hasDevRep;
      if (hasRealGap) {
        const auditTarget = hasDevRep ? 160 : 160;
        const target = Math.min(caps.c2Max, hasDevRep ? concederNotaPonderada(prev.c2, auditTarget, { maxCap: caps.c2Max }) : 160);
        next.c2 = target;
        concessionDetails.push({
          competency: 'C2',
          previousScore: prev.c2,
          reconciledScore: target,
          reasonPt: `Concessão ponderada na C2 (200 → ${target} pts) alinhando a nota à exploração do repertório.`
        });
      }
    }
  }

  // --- C3 Concessão de Nota ---
  const c3Rules = rulesFor('C3');
  const c3Facts = extractDetailedC3Facts(paragraphs);
  const bothDeep = !c3Facts.isExpositiveD1 && !c3Facts.isExpositiveD2 && hasDevRep;
  const oneDeep = (!c3Facts.isExpositiveD1 || !c3Facts.isExpositiveD2) && hasDevRep;
  const factualC3 = bothDeep ? 200 : (oneDeep ? 180 : 160);

  if (!isTangenciamento) {
    if (
      (c3Rules.has('C3_FALSE_D1_D2_REPETITION') || c3Rules.has('C3_ARTIFICIAL_AUTHORSHIP_CRITERION') || (bothDeep && prev.c3 <= 120)) &&
      prev.c3 < factualC3
    ) {
      const effectiveMaxC3 = Math.min(caps.c3Max, factualC3);
      const target = concederNotaPonderada(prev.c3, factualC3, { maxCap: effectiveMaxC3 });
      if (target > prev.c3) {
        next.c3 = target;
        concessionDetails.push({
          competency: 'C3',
          previousScore: prev.c3,
          reconciledScore: target,
          reasonPt: `Concessão ponderada na C3 (${prev.c3} → ${target} pts): D1 e D2 trazem argumentos distintos e bem organizados.`
        });
      }
    } else if (prev.c3 === 200 && (c3Rules.has('C3_SCORE_200_WITH_REWRITE') || c3Rules.has('SCORE_200_JUSTIFICATION_CONTRADICTION') || !bothDeep)) {
      if (c3Facts.isExpositiveD1 || c3Facts.isExpositiveD2 || c3Rules.has('C3_SCORE_200_WITH_REWRITE')) {
        const auditRigourTarget = c3Facts.isExpositiveD1 && c3Facts.isExpositiveD2 ? 160 : 160;
        const capC3Concession = Math.min(caps.c3Max, c3Facts.isExpositiveD1 && c3Facts.isExpositiveD2 ? 160 : 180);
        const target = concederNotaPonderada(prev.c3, auditRigourTarget, { maxCap: capC3Concession });
        if (target < prev.c3) {
          next.c3 = target;
          concessionDetails.push({
            competency: 'C3',
            previousScore: prev.c3,
            reconciledScore: target,
            reasonPt: `Concessão ponderada na C3 (200 → ${target} pts) considerando o nível de aprofundamento de causas e consequências.`
          });
        }
      }
    }
  }

  // --- C4 Concessão de Nota ---
  const c4Rules = rulesFor('C4');
  const d1HasOp = paragraphs[1] ? D1_D2_OPENING_OP_REGEX.test(paragraphs[1]) : false;
  const d2HasOp = paragraphs[2] ? D1_D2_OPENING_OP_REGEX.test(paragraphs[2]) : false;
  const conclHasOp = paragraphs[paragraphs.length - 1] ? CONCL_OPENING_OP_REGEX.test(paragraphs[paragraphs.length - 1]) : false;
  const anaphoricMesmos = findAnaphoricMesmoMatches(cleanEssay);
  const falseC4Rules = ['C4_FALSE_MISSING_CONNECTIVE', 'C4_FALSE_ONDE_CLAIM', 'C4_FALSE_ANAPHORIC_MESMO', 'C4_FALSE_CONNECTIVE_REPETITION'];
  const factualC4 = (d1HasOp && d2HasOp && conclHasOp && anaphoricMesmos.length === 0) ? 200 : ((d1HasOp || d2HasOp) && anaphoricMesmos.length === 0 ? 160 : 120);

  if ((falseC4Rules.some((r) => c4Rules.has(r)) || (factualC4 - prev.c4 >= 40 && d1HasOp && d2HasOp && conclHasOp)) && prev.c4 < factualC4) {
    const target = concederNotaPonderada(prev.c4, factualC4, { maxCap: caps.c4Max });
    if (target > prev.c4) {
      next.c4 = target;
      concessionDetails.push({
        competency: 'C4',
        previousScore: prev.c4,
        reconciledScore: target,
        reasonPt: `Concessão ponderada na C4 (${prev.c4} → ${target} pts) após confirmar o uso correto dos conectivos no texto.`
      });
    }
  } else if (prev.c4 === 200 && c4Rules.has('SCORE_200_JUSTIFICATION_CONTRADICTION')) {
    if (anaphoricMesmos.length > 0 || !d1HasOp || !d2HasOp || !conclHasOp) {
      const target = concederNotaPonderada(prev.c4, factualC4, { maxCap: Math.min(caps.c4Max, 160) });
      next.c4 = target;
      concessionDetails.push({
        competency: 'C4',
        previousScore: prev.c4,
        reconciledScore: target,
        reasonPt: `Concessão ponderada na C4 (200 → ${target} pts) pelas oportunidades de melhoria na coesão encontradas.`
      });
    } else if (comps.c4) {
      comps.c4.problemsIdentified = [];
      comps.c4.penaltiesOrGaps = [];
    }
  }

  // --- C5 Concessão de Nota ---
  const c5Rules = rulesFor('C5');
  const prevPara = paragraphs.length >= 2 ? paragraphs[paragraphs.length - 2] : '';
  const conclusionText = paragraphs.length >= 4 && CONCL_OPENING_OP_REGEX.test(prevPara)
    ? `${prevPara}\n\n${paragraphs[paragraphs.length - 1]}`
    : (paragraphs[paragraphs.length - 1] || cleanEssay);
  const c5Facts = extractDetailedC5Facts(conclusionText);
  const c5Struct = payload?.c5Structure;
  const structDetText = (c5Struct?.detailing?.text || '').replace(/^[,\s—–(]+|[—–)\s.,;]+$/g, '').trim();
  const hasC5DetailingFact = c5Facts.hasUnambiguousDetailing || (Boolean(c5Struct?.detailing?.present) && structDetText.length >= 8 && payload?.argumentativeAndCohesionAudit?.c5DetailingIsDistinctAndSpecific !== false);
  const factualC5Elements = [
    c5Facts.hasAgent || Boolean(c5Struct?.agent?.present),
    c5Facts.hasAction || Boolean(c5Struct?.action?.present),
    c5Facts.hasMode || Boolean(c5Struct?.modeMedium?.present),
    c5Facts.hasEffect || Boolean(c5Struct?.effect?.present),
    hasC5DetailingFact
  ].filter(Boolean).length;
  const factualC5Score = Math.min(200, factualC5Elements * 40);

  if (!realHRViolation && !isTangenciamento) {
    const falseC5MissRules = [
      'C5_FALSE_MISSING_ACTION',
      'C5_FALSE_MISSING_AGENT',
      'C5_FALSE_MISSING_MODE',
      'C5_FALSE_MISSING_EFFECT',
      'C5_FALSE_MISSING_DETAILING',
      'C5_FALSE_HUMAN_RIGHTS_VIOLATION'
    ];
    if ((falseC5MissRules.some((r) => c5Rules.has(r)) || factualC5Score - prev.c5 >= 40) && factualC5Score > prev.c5) {
      const target = prev.c5 === 0 && c5Rules.has('C5_FALSE_HUMAN_RIGHTS_VIOLATION')
        ? Math.min(caps.c5Max, factualC5Score)
        : concederNotaPonderada(prev.c5, factualC5Score, { maxCap: caps.c5Max });
      if (target > prev.c5) {
        next.c5 = target;
        concessionDetails.push({
          competency: 'C5',
          previousScore: prev.c5,
          reconciledScore: target,
          reasonPt: c5Rules.has('C5_FALSE_HUMAN_RIGHTS_VIOLATION')
            ? `Nota da C5 restaurada para ${target} pts após confirmar que a proposta respeita os Direitos Humanos.`
            : `Concessão ponderada na C5 (${prev.c5} → ${target} pts) pelos elementos completos identificados na conclusão.`
        });
      }
    } else if (prev.c5 === 200 && (c5Rules.has('SCORE_200_JUSTIFICATION_CONTRADICTION') || factualC5Elements < 5)) {
      if (factualC5Elements < 5) {
        const target = concederNotaPonderada(prev.c5, Math.max(120, factualC5Score), { maxCap: Math.min(caps.c5Max, 180) });
        if (target < prev.c5) {
          next.c5 = target;
          concessionDetails.push({
            competency: 'C5',
            previousScore: prev.c5,
            reconciledScore: target,
            reasonPt: `Concessão ponderada na C5 (200 → ${target} pts) alinhada aos elementos presentes na conclusão.`
          });
        }
      } else if (comps.c5 && c5Rules.has('SCORE_200_JUSTIFICATION_CONTRADICTION')) {
        comps.c5.problemsIdentified = [];
        comps.c5.penaltiesOrGaps = [];
      }
    }
  }

  // Aplicar notas reconciliadas e simplificar o feedback final para o estudante
  const compKeyMap: Array<{ key: 'c1' | 'c2' | 'c3' | 'c4' | 'c5'; tag: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' }> = [
    { key: 'c1', tag: 'C1' },
    { key: 'c2', tag: 'C2' },
    { key: 'c3', tag: 'C3' },
    { key: 'c4', tag: 'C4' },
    { key: 'c5', tag: 'C5' }
  ];

  const feedbackContext = {
    validC1Count: validC1Deviations.length,
    hasOralMarks: essayOralMarks.length > 0,
    hasIntroRep,
    hasDevRep,
    bothDevsDeep: bothDeep,
    hasConnsAll: d1HasOp && d2HasOp && conclHasOp,
    c5ElementsCount: factualC5Elements,
    hasDetailing: hasC5DetailingFact
  };

  for (const { key, tag } of compKeyMap) {
    const compObj = comps[key];
    if (!compObj) continue;
    const oldVal = prev[key];
    const newVal = next[key];
    compObj.score = newVal;
    compObj.nota = newVal;
    compObj.level = Math.round(newVal / 40);
    compObj.nivel = Math.round(newVal / 40);

    const changed = concessionDetails.find((cd) => cd.competency === tag);
    if (changed) {
      const simplified = simplifyDidacticFeedbackForStudent(key, newVal, feedbackContext);
      const isDisprovenClaim = (txt: string) => {
        const t = String(txt || '').toLowerCase();
        if (!t) return false;
        if (key === 'c1' && (c1Rules.has('C1_FALSE_ORALITY_CLAIM') || newVal > oldVal) && /oralidade|coloquial|m[úu]ltiplos desvios|desvios graves/.test(t)) return true;
        if (key === 'c1' && c1Rules.has('C1_FALSE_ANAPHORIC_MESMO') && /o mesmo|os mesmos/.test(t)) return true;
        if (key === 'c2' && (c2Rules.has('C2_FALSE_ABSENCE_OF_REPERTOIRE') || c2Rules.has('C2_FALSE_MISSING_DEV_REPERTOIRE') || newVal > oldVal) && /(?:aus[êe]ncia|falta|n[ãa]o\s+apresenta|sem).*repert[óo]rio|apenas na introdu[çc][ãa]o/.test(t)) return true;
        if (key === 'c2' && newVal < oldVal && /excelente\s+repert[óo]rio\s+na\s+conclus[ãa]o|repert[óo]rio.*conclus[ãa]o|nota\s*200|m[áa]ximo/.test(t)) return true;
        if (key === 'c3' && (c3Rules.has('C3_FALSE_D1_D2_REPETITION') || c3Rules.has('C3_ARTIFICIAL_AUTHORSHIP_CRITERION') || newVal > oldVal) && /repeti[çc][ãa]o.*par[áa]grafo|marcas de autoria|superficial/.test(t)) return true;
        if (key === 'c4' && (c4Rules.has('C4_FALSE_MISSING_CONNECTIVE') || c4Rules.has('C4_FALSE_ONDE_CLAIM') || c4Rules.has('C4_FALSE_ANAPHORIC_MESMO') || newVal > oldVal) && /aus[êe]ncia de conectivo|sem conectivo|\bonde\b|o mesmo/.test(t)) return true;
        if (key === 'c5' && newVal > oldVal && /(?:aus[êe]ncia\s+de|falta(?:\s+de)?|faltou|sem|inexist[êe]ncia\s+de)\s+(?:a\s+|o\s+|a[çc][ãa]o|agente|meio|modo|finalidade|detalhamento)|direitos humanos/.test(t)) return true;
        return false;
      };

      if (newVal === 200) {
        compObj.problemsIdentified = [];
        compObj.penaltiesOrGaps = [];
      } else {
        if (Array.isArray(compObj.problemsIdentified)) {
          compObj.problemsIdentified = compObj.problemsIdentified.filter((p) => !isDisprovenClaim(p));
        }
        if (Array.isArray(compObj.penaltiesOrGaps)) {
          compObj.penaltiesOrGaps = compObj.penaltiesOrGaps.filter((p) => !isDisprovenClaim(p));
        }
      }

      if (Array.isArray(payload.top3Problems)) {
        payload.top3Problems = payload.top3Problems.filter((tp) => !isDisprovenClaim(tp));
      }

      // Atualizar feedback para linguagem direta, simples e didática sem marcas técnicas de auditoria
      compObj.diagnostic = simplified.diagnostic;
      compObj.evaluation = simplified.evaluation;
      compObj.justificativa_analitica = simplified.evaluation;
      compObj.howToImprove = simplified.howToImprove;
    }
  }

  // Reancorar citações de C3 e C5 e manter feedback apoiado nos fatos sem jargão técnico
  if (!isTangenciamento && !isWholeEssayZero) {
    const grounding = groundC3AndC5FeedbackInEssayFacts(payload, cleanEssay, theme);
    if (grounding.c3ReanchoredQuote && comps.c3) {
      comps.c3.primaryEvidenceQuote = grounding.c3ReanchoredQuote;
      comps.c3.trecho_evidencia = grounding.c3ReanchoredQuote;
    }
    if (grounding.c3GroundedSummary && comps.c3 && !grounding.crossValidation?.c3FeedbackGroundedInFacts) {
      const curC3 = String(comps.c3.evaluation || comps.c3.justificativa_analitica || '').trim();
      if (!curC3.includes('Resumo dos desenvolvimentos') && !curC3.includes('Resumo de D1')) {
        comps.c3.justificativa_analitica = curC3 ? `${curC3} (${grounding.c3GroundedSummary})` : grounding.c3GroundedSummary;
      }
    }
    if (grounding.c5ReanchoredQuote && !realHRViolation && comps.c5) {
      comps.c5.primaryEvidenceQuote = grounding.c5ReanchoredQuote;
      comps.c5.trecho_evidencia = grounding.c5ReanchoredQuote;
    }
    if (grounding.c5GroundedSummary && !realHRViolation && comps.c5 && !grounding.crossValidation?.c5FeedbackGroundedInFacts) {
      const curC5 = String(comps.c5.evaluation || comps.c5.justificativa_analitica || '').trim();
      if (!curC5.includes('Resumo da conclusão') && !curC5.includes('Na conclusão:')) {
        comps.c5.justificativa_analitica = curC5 ? `${curC5} (${grounding.c5GroundedSummary})` : grounding.c5GroundedSummary;
      }
    }
  }

  // Limpar reescritas cuja citação não existe na redação ou que pertençam a competência com 200 pts
  if (Array.isArray(payload?.pedagogicalRewrites)) {
    payload.pedagogicalRewrites = payload.pedagogicalRewrites.filter((rw) => {
      const orig = String(rw?.original || '').trim();
      if (!orig || isDescriptivePlaceholder(orig)) return false;
      const loc = locateExcerptParagraphs(orig, cleanEssay);
      if (!loc.found) return false;
      if (next.c3 === 200 && (rw.competencyNum === 3 || /\bc3\b|projeto de texto|aprofundamento causal/i.test(`${rw.problem || ''} ${rw.explanation || ''}`))) return false;
      if (next.c5 === 200 && (rw.competencyNum === 5 || /\bc5\b|proposta de interven[çc][ãa]o|detalhamento/i.test(`${rw.problem || ''} ${rw.explanation || ''}`))) return false;
      return true;
    });
  }

  const nextTotal = next.c1 + next.c2 + next.c3 + next.c4 + next.c5;
  payload.totalScore = nextTotal;

  // Re-executar auditoria internamente após a concessão para confirmar alinhamento
  const finalAudit = auditDiagnosticVsEvidenceConsistency(payload, cleanEssay, theme);
  const deltaPoints = nextTotal - prev.total;
  const concessionApplied = concessionDetails.length > 0;
  const concessionSummaryPt = concessionApplied
    ? `Concessão de Nota aplicada: média ponderada entre avaliação inicial (${prev.total} pts) e evidências do texto resultou em ${nextTotal} pts (${deltaPoints >= 0 ? `+${deltaPoints}` : deltaPoints} pts).`
    : 'A nota inicial já está em equilíbrio com todas as evidências encontradas na sua redação.';

  finalAudit.concessionApplied = concessionApplied;
  finalAudit.concessionDeltaPoints = deltaPoints;
  finalAudit.concessionDetails = concessionDetails;
  finalAudit.concessionSummaryPt = concessionSummaryPt;

  if (concessionApplied) {
    finalAudit.summaryMessage = finalAudit.passed
      ? `Nota equilibrada (${nextTotal} pts): concessão ponderada aplicada com feedback simplificado.`
      : `Nota equilibrada (${nextTotal} pts) após concessão ponderada com base nas evidências.`;
  }

  return {
    reconciledScores: { ...next, total: nextTotal },
    previousScores: prev,
    concessionApplied,
    concessionDeltaPoints: deltaPoints,
    concessionDetails,
    concessionSummaryPt,
    consistencyAuditReport: finalAudit
  };
}

export const executarConcessaoDeNota = reconcileEvaluationWithConsistencyAudit;

