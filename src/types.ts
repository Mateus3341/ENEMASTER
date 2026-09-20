export type CompetencyNumber = 1 | 2 | 3 | 4 | 5;

export interface C1Deviation {
  snippet: string;
  problem: string;
  bestForm: string;
  category: 'convenções_escrita' | 'gramatical' | 'registro' | 'vocabular' | 'estrutura_sintatica';
}

export interface EvidenceWeightPillar {
  pillarName: string;
  weightPercentage: number; // e.g. 35
  scoreContribution: number; // e.g. 70 out of 200
  positiveEvidenceFound: string;
  gapOrPenaltyFound?: string;
  isExceptionalLevel: boolean;
}

export interface AvaliacaoCompetencia {
  trecho_evidencia: string; // Trecho textual da redação obrigatoriamente citado como evidência empírica antes da deliberação da nota
  justificativa_analitica: string; // Análise qualitativa aprofundada demonstrando a correspondência do trecho com a matriz do INEP
  nota: number; // 0, 40, 80, 120, 160, 200 (A nota 200 NUNCA é o valor padrão e exige comprovação afirmativa de distinção)
  nivel: number; // 0 a 5
  titulo_nivel: string;
  localizacao_trecho?: string; // Ex: 'Parágrafo 1 (Introdução)', 'Parágrafo 2 (D1)'
  pilares_ponderados?: EvidenceWeightPillar[];
  pontos_positivos?: string[];
  lacunas_ou_penalidades?: string[];
  demonstrou_excelencia_afirmativa?: boolean;
  bloqueio_padrao_200_ativo?: boolean;
  problemas_identificados?: string[];
  como_melhorar?: string;
  diagnostico?: string;
}

export interface CompetenciaEvaluation extends AvaliacaoCompetencia {
  score: number; // 0, 40, 80, 120, 160, 200
  level: number; // 0, 1, 2, 3, 4, 5
  levelTitle: string;
  evaluation: string;
  primaryEvidenceQuote?: string; // Trecho específico obrigatório citado antes de pontuar
  excerptLocation?: string; // Ex: 'Parágrafo 1 (Introdução)', 'Parágrafo 2 (D1)'
  evidenceSnippets?: string[];
  positiveEvidence?: string[];
  penaltiesOrGaps?: string[];
  exceptionalPerformanceDemonstrated?: boolean;
  evidenceWeightPillars?: EvidenceWeightPillar[];
  problemsIdentified?: string[];
  howToImprove?: string;
  diagnostic: string; // "Você perdeu pontos principalmente porque..."
}

export interface Competencia5Elements {
  agent: { present: boolean; text: string; isNull?: boolean; details?: string };
  action: { present: boolean; text: string; isNull?: boolean; details?: string };
  modeMedium: { present: boolean; text: string; details?: string };
  effect: { present: boolean; text: string; details?: string };
  detailing: { present: boolean; text: string; targetElement?: 'agente' | 'acao' | 'meio' | 'efeito' | string; details?: string };
  respectsHumanRights: boolean;
  humanRightsObservations?: string;
  validElementsCount: number;
}

export interface DualEvaluatorGrade {
  c1: number;
  c2: number;
  c3: number;
  c4: number;
  c5: number;
  total: number;
  evaluatorProfile: string;
  notes: string;
}

export interface DualEvaluatorSimulation {
  evaluatorA: DualEvaluatorGrade;
  evaluatorB: DualEvaluatorGrade;
  discrepancyC1: number;
  discrepancyC2: number;
  discrepancyC3: number;
  discrepancyC4: number;
  discrepancyC5: number;
  totalDiscrepancy: number;
  status: 'consenso_direto' | 'divergencia_tolerada' | 'terceiro_corretor_desnecessario';
  explanation: string;
}

export interface CartilhaBenchmark {
  tier: 'Abaixo de 700' | 'Faixa 800 (Regular)' | 'Faixa 880-920 (Bom)' | 'Faixa 940-960 (Excelente)' | 'Faixa 1000 (Perfeição)';
  closestProfileTitle: string;
  commonPatternIdentified: string;
  keyDifferenceTo900Plus: string;
  cartilhaReferenceQuote?: string;
}

export interface PedagogicalRewrite {
  original: string;
  problem: string;
  improvedVersion: string;
  explanation: string;
}

export interface CompetencyAuditLogItem {
  competencyNum: CompetencyNumber;
  competencyName: string;
  assignedScore: number;
  isMaxScore200: boolean;
  scoreJustification: string;
  requiredTextualEvidence: string;
  evidenceQuoteFromStudent: string;
  reasonNotRoundedTo200?: string;
  qualityPillarsChecked: Array<{
    pillar: string;
    status: 'atendido' | 'parcial' | 'ausente';
    detail: string;
  }>;
}

export interface EvidenceValidationItem {
  competencyNum: CompetencyNumber;
  competencyName: string;
  assignedScore: number;
  citedExcerpt: string;
  excerptLocation: string;
  isExcerptVerbatimInText: boolean;
  qualitativeCriteriaMet: string[];
  qualitativeGapsOrLimits: string[];
  verdict: 'validado_com_evidencia' | 'evidencia_parcial' | 'sem_evidencia';
  verdictMessage: string;
}

export interface EvidenceValidatorReport {
  timestamp: string;
  totalCompetenciesValidated: number;
  allCitationsVerified: boolean;
  qualitativeIntegrityScore: number; // e.g. 100%
  evidenceItems: EvidenceValidationItem[];
  protocolStatement: string;
}

export interface ReviewerCompetencyCheck {
  competencyNum: CompetencyNumber;
  competencyName: string;
  initialScore: number;
  reviewedScore: number;
  scoreReduced: boolean;
  scoreMaintained: boolean;
  isExceptionalLevelSustained: boolean;
  cartilhaCriteriaChecked: string;
  evidenceQuotesExamined: string[];
  trecho_evidencia?: string;
  justificativa_analitica?: string;
  flawIdentified?: string;
  reviewerVerdict: string;
}

export interface ReviewerAuditReport {
  timestamp: string;
  triggeredByHighScore: boolean;
  triggerReason: string; // Ex: "Nota 200 detectada na C2/C5" ou "Nota Global 960+ detectada"
  reviewerModel: string;
  initialTotalScore: number;
  finalAuditedTotalScore: number;
  wasInflationDetected: boolean;
  inflationPointsAdjusted: number;
  competencyReviews: ReviewerCompetencyCheck[];
  reviewerExecutiveSummary: string;
  cartilhaStandardAdherenceVerdict: string;
}

export interface ScoreValidationItem {
  competencyNum: CompetencyNumber;
  competencyName: string;
  originalScore: number;
  validatedScore: number;
  isMaxScore200: boolean;
  exceptionalEvidenceVerified: boolean;
  verificationVerdict: 'aprovado_200' | 'calibrado_160' | 'consistente' | 'revisado';
  verificationDetail: string;
  textualEvidenceFound: string;
  qualityPillarsSummary: string;
  weightedPillars?: EvidenceWeightPillar[];
  qualitativeWeightReasoning?: string;
  absenceOfFlawsCaveat?: string;
}

export interface AppliedPenaltyItem {
  competencyAffected: string;
  penaltyName: string;
  penaltyPoints: number;
  reason: string;
  evidenceSnippet?: string;
  severity: 'leve' | 'moderada' | 'severa' | 'critica';
}

export interface ExcellenceEvidenceGate {
  gateName: string;
  competency: string;
  requirement: string;
  isMet: boolean;
  verbatimEvidenceFound?: string;
  impactOnScore: string;
}

export interface HighPerformanceCurveReport {
  isHighScore: boolean;
  tier: 'Excelência Máxima (1000)' | 'Excelência Rara (980)' | 'Alto Nível Superior (960)' | 'Alto Nível Consistente (940)' | 'Alto Nível Inicial (920)' | 'Faixa 900' | 'Padrão Regular (<900)';
  statisticalPercentileEstimate: string;
  rigorVerdict: string;
  technicalMasteryIndex: number;
  argumentativeDepthIndex: number;
  finalCalculatedScore: number;
  scoreGateSummary: string;
  penaltiesApplied: AppliedPenaltyItem[];
  requiredExcellenceEvidence: ExcellenceEvidenceGate[];
  dualEvaluatorBreakdown: {
    evaluatorA_total: number;
    evaluatorB_total: number;
    calculatedArithmeticMean: number;
    evaluatorA_scores: { c1: number; c2: number; c3: number; c4: number; c5: number };
    evaluatorB_scores: { c1: number; c2: number; c3: number; c4: number; c5: number };
  };
  criteriaVerified: {
    c1_normativeMastery: boolean;
    c2_productiveRepertoire: boolean;
    c3_strategicProject: boolean;
    c4_cohesiveDiversity: boolean;
    c5_fiveCanonicalElements: boolean;
  };
}

export interface ScoreValidationReport {
  timestamp: string;
  isCoherent: boolean;
  rawSum: number;
  validatedTotal: number;
  hasAdjustments: boolean;
  auditedCompetencies: ScoreValidationItem[];
  exceptionalVerificationPrompt: string;
  validationSummary: string;
  highPerformanceCurveReport?: HighPerformanceCurveReport;
}

export interface EssayAuditLog {
  auditTimestamp: string;
  modelEngine: string;
  roundingBiasRemoved: boolean;
  auditorProtocol: string;
  competencyLogs: CompetencyAuditLogItem[];
  generalObservations: string;
}

export interface StructuredAiAnalysisLog {
  id_analise: string;
  timestamp_analise: string; // ISO-8601 com carimbo temporal preciso para rastreabilidade
  versao_modelo: string; // Ex: 'gemini-2.5-flash-enem-v2.4-strict'
  banca_versao: string;
  ambiente: string;
  tema: string;
  estatisticas_texto: {
    total_palavras: number;
    total_caracteres: number;
    total_paragrafos: number;
    ocr_utilizado: boolean;
  };
  deliberacao_notas: {
    nota_total_final: number;
    nota_total_proposta: number;
    inflacao_mitigada_pontos: number;
    c1: { nota: number; nivel: number; trecho_evidencia: string; justificativa: string };
    c2: { nota: number; nivel: number; trecho_evidencia: string; justificativa: string };
    c3: { nota: number; nivel: number; trecho_evidencia: string; justificativa: string };
    c4: { nota: number; nivel: number; trecho_evidencia: string; justificativa: string };
    c5: { nota: number; nivel: number; trecho_evidencia: string; justificativa: string };
  };
  auditoria_reviewer: {
    acionado: boolean;
    motivo_acionamento?: string;
    inflacao_detectada: boolean;
    pontos_ajustados: number;
    veredito_revisor?: string;
  };
  rastreabilidade: {
    protocolo_calibracao: string;
    conformidade_inep: string;
    hash_sessao: string;
  };
}

export interface EssayCorrectionResult {
  id: string;
  date: string;
  theme: string;
  essayText: string;
  totalScore: number;
  competencies: {
    c1: CompetenciaEvaluation;
    c2: CompetenciaEvaluation;
    c3: CompetenciaEvaluation;
    c4: CompetenciaEvaluation;
    c5: CompetenciaEvaluation;
  };
  auditLog?: EssayAuditLog;
  reviewerReport?: ReviewerAuditReport;
  aiAnalysisLog?: StructuredAiAnalysisLog;
  validationReport?: ScoreValidationReport;
  evidenceValidatorReport?: EvidenceValidatorReport;
  highPerformanceCurveReport?: HighPerformanceCurveReport;
  dualEvaluatorSimulation?: DualEvaluatorSimulation;
  cartilhaBenchmark?: CartilhaBenchmark;
  c1Deviations: C1Deviation[];
  c5Structure: Competencia5Elements;
  generalDiagnostic: string;
  top3Problems: string[];
  top3Strengths: string[];
  actionPlanToImprove: string[];
  highPerformanceComparison: string;
  pedagogicalRewrites: PedagogicalRewrite[];
  isHandwrittenOcr?: boolean;
  ocrConfidenceNote?: string;
  userId?: string;
  createdAt?: string;
}

export interface GeneratedEssayAuditReport {
  verifiedGrade: number;
  auditorProtocol: string;
  bancaVerdict: string;
  c1Audit: {
    status: 'aprovado_200' | 'aprovado_alto';
    score: number;
    syntacticComplexity: string;
    eruditeVocabCount: number;
    deviationsFound: number;
    verifiedPillars: string[];
    exemplaryExcerpt: string;
  };
  c2Audit: {
    status: 'aprovado_200' | 'aprovado_alto';
    score: number;
    thematicAdherence: string;
    legitimacyAreas: string[];
    productiveLinkProof: string;
    exemplaryExcerpt: string;
  };
  c3Audit: {
    status: 'aprovado_200' | 'aprovado_alto';
    score: number;
    bipartiteThesisCompliance: string;
    causalChainCheck: string;
    authorialVoiceMarker: string;
    exemplaryExcerpt: string;
  };
  c4Audit: {
    status: 'aprovado_200' | 'aprovado_alto';
    score: number;
    interParagraphConnectors: Array<{ paragraph: string; connector: string; role: string }>;
    intraParagraphDiversity: string;
    exemplaryExcerpt: string;
  };
  c5Audit: {
    status: 'aprovado_200' | 'aprovado_alto';
    score: number;
    elements: {
      agente: { text: string; status: 'valido' | 'parcial' };
      acao: { text: string; status: 'valido' | 'parcial' };
      meio: { text: string; status: 'valido' | 'parcial' };
      efeito: { text: string; status: 'valido' | 'parcial' };
      detalhamento: { text: string; status: 'valido' | 'parcial'; detailedElement: string };
    };
    humanRightsRespected: boolean;
    circularClosingVerified: boolean;
    exemplaryExcerpt: string;
  };
  antiInflationChecklist: Array<{
    criterion: string;
    verified: boolean;
    evidenceInGeneratedText: string;
  }>;
}

export interface GeneratedEssayResponse {
  id?: string;
  theme: string;
  title?: string;
  aidType: 'ideas' | 'repertorios' | 'structure' | 'full_essay';
  targetLevel: string;
  structuralStyle: string;
  structure: {
    intro: string;
    d1: string;
    d2: string;
    conclusion: string;
  };
  fullText: string;
  repertoriosUsed: Array<{
    name: string;
    area: string;
    contextualization: string;
    connectionToThesis: string;
  }>;
  structuralExplanation: string;
  pedagogicalTips: string[];
  auditComplianceReport?: GeneratedEssayAuditReport;
  repertoireSwapSummary?: {
    previousRepertorios?: string[];
    previousRepertoires?: string[];
    newRepertorios?: string[];
    newRepertoires?: string[];
    rationale?: string;
    affectedParagraphs?: string[];
  };
}

export interface PracticeQuestion {
  id: string;
  title: string;
  competency: CompetencyNumber;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  contextSnippet: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  officialIneRuleExplained: string;
}

export interface PracticeSnippetQuiz {
  id: string;
  competencyFocus: string;
  snippet: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  improvedSnippet: string;
  isAiGenerated?: boolean;
}

export interface RepertoireItem {
  id: string;
  authorOrWork: string;
  conceptOrQuote: string;
  area: string;
  applicableAxes: string[];
  productiveUsageGuide: string;
  pocketTrapWarning: string;
}

export type RepertoireAreaCategory = 
  | 'todos'
  | 'Filmes'
  | 'Séries'
  | 'Livros & Literatura'
  | 'Documentários'
  | 'Filosofia'
  | 'Sociologia'
  | 'Legislação'
  | 'História'
  | 'Cinema & Artes'
  | 'Dados & Estatísticas';

export type RepertoireMediaType = 'filme' | 'serie' | 'livro' | 'documentario' | 'obra_literaria' | 'artes' | 'outro';

export interface HuntedRepertoireItem {
  id: string;
  name: string;
  workOrConcept: string;
  area: 'Filmes' | 'Séries' | 'Livros & Literatura' | 'Documentários' | 'Filosofia' | 'Sociologia' | 'Literatura' | 'Legislação' | 'História' | 'Cinema & Artes' | 'Dados & Estatísticas' | string;
  sourceType: 'arte_cultura' | 'filme' | 'serie' | 'livro' | 'documentario' | 'classico' | 'contemporaneo' | 'legislativo' | 'dados_pesquisa';
  mediaType?: RepertoireMediaType;
  directorOrAuthor?: string;
  releaseYear?: string;
  streamingPlatformOrPublisher?: string;
  summary: string;
  howToFit: string;
  suggestedParagraph: 'intro' | 'd1' | 'd2' | 'conclusion';
  sampleSentence: string;
  keyTheses: string[];
  groundingUrl?: string;
  isCustomFavorite?: boolean;
}

export interface RepertoireHunterResponse {
  theme: string;
  socialProblem?: string;
  thematicCut?: string;
  searchQueries?: string[];
  groundingSources?: GroundingSource[];
  repertoires: HuntedRepertoireItem[];
  pedagogicalInsight?: string;
}

export interface Nota1000Sample {
  id: string;
  author: string;
  year: string;
  theme: string;
  fullText: string;
  paragraphs: {
    intro: string;
    d1: string;
    d2: string;
    conclusion: string;
  };
  officialCommentary: string;
  repertoriosHighlighted: string[];
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface ProfessorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
  groundingSources?: GroundingSource[];
  searchQueries?: string[];
  suggestedFollowUps?: string[];
  personaUsed?: string;
  isStreaming?: boolean;
}

export interface ProfessorChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ProfessorMessage[];
  persona?: 'professor' | 'corretor' | 'escritor' | 'analista_trecho';
  focusCompetency?: string;
}

export type ChatModelMode = 'flash' | 'search' | 'fast' | 'pro';

export type GlossaryCategory = 
  | 'geral' 
  | 'c1' 
  | 'c2' 
  | 'c3' 
  | 'c4' 
  | 'c5' 
  | 'filosofia_sociologia' 
  | 'legislacao' 
  | 'literatura_cultura';

export interface GlossaryTerm {
  id: string;
  term: string;
  category: GlossaryCategory;
  competencyTag?: 'Geral' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5';
  shortDefinition: string;
  fullDefinition: string;
  inepCriteriaContext?: string; // Como a banca do INEP avalia
  practicalExample?: string; // Exemplo prático no texto
  repertoireApplication?: string; // Como articular como repertório sociocultural
  commonMistakeWarning?: string; // O que NÃO fazer / Perda de pontos
  relatedTerms?: string[];
  difficultyLevel: 'Fundamental' | 'Avançado' | 'Nota 1000';
  authorOrSource?: string; // ex: Zygmunt Bauman, CF/88, INEP
  isFavorited?: boolean;
  isMastered?: boolean;
}

export interface CompetencyGuideInfo {
  number: number;
  title: string;
  description: string;
  levels: Array<{
    level: number;
    score: number;
    description: string;
  }>;
  commonMistakes: string[];
  keyTips: string[];
}

export type KnowledgeAreaId = 
  | 'meio_ambiente' 
  | 'tecnologia' 
  | 'saude' 
  | 'educacao' 
  | 'sociedade' 
  | 'cultura' 
  | 'economia' 
  | 'seguranca';

export interface KnowledgeAreaConfig {
  id: KnowledgeAreaId;
  name: string;
  description: string;
  iconName: string;
  color: string;
  exampleTopics: string[];
}

export interface MotivatingText {
  id: string;
  number: 'I' | 'II' | 'III' | 'IV';
  title?: string;
  type: 'conceito_lei' | 'dados_estatistica' | 'social_noticia' | 'critica_reflexiva';
  content: string;
  source: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  category: 'competency' | 'volume' | 'score' | 'mastery';
  description: string;
  iconType: 'award' | 'sparkles' | 'target' | 'book' | 'zap' | 'check' | 'trophy' | 'flame' | 'shield' | 'star';
  rarity: 'bronze' | 'prata' | 'ouro' | 'diamante';
  isUnlocked: boolean;
  progress: number; // 0 to 100
  currentValue: number;
  targetValue: number;
  unit: string;
  unlockedAtDate?: string;
  requirementText: string;
}

export interface GeneratedThemeResponse {
  id: string;
  title: string;
  axis: string;
  areas: string[];
  socialProblem: string;
  thematicCut: string;
  keywordsToCover: string[];
  motivatingTexts?: MotivatingText[];
  suggestedTheses?: {
    d1: string;
    d2: string;
  };
  recommendedRepertoires?: Array<{
    name: string;
    area: string;
    concept: string;
    howToApply: string;
  }>;
  suggestedIntervention?: {
    agent: string;
    action: string;
    modeMedium: string;
    effect: string;
    detailing: string;
  };
  commonTangentsWarning?: string;
  difficultyLevel: 'Acessível' | 'Padrão ENEM' | 'Desafiador / Inédito';
  isFallback?: boolean;
}

export interface MasterDevelopmentTip {
  theme: string;
  thematicAnalysis: {
    coreProblem: string;
    keywordsToCover: string[];
    tangentRiskWarning: string;
  };
  competencies: {
    c1: {
      title: string;
      formalVocabulary: string[];
      syntacticPatterns: string[];
      goldTip: string;
    };
    c2: {
      title: string;
      repertoires: Array<{
        name: string;
        area: string;
        concept: string;
        articulationHook: string;
      }>;
      goldTip: string;
    };
    c3: {
      title: string;
      thesisD1: {
        focus: string;
        topicSentence: string;
        developmentGuide: string;
        guidingQuestion: string;
      };
      thesisD2: {
        focus: string;
        topicSentence: string;
        developmentGuide: string;
        guidingQuestion: string;
      };
      goldTip: string;
    };
    c4: {
      title: string;
      interparagraphConnectives: string[];
      intraparagraphConnectives: string[];
      goldTip: string;
    };
    c5: {
      title: string;
      interventionStructure: {
        agent: string;
        action: string;
        modeMedium: string;
        effect: string;
        detailing: string;
      };
      fullInterventionSample: string;
      goldTip: string;
    };
  };
  masterTakeaway: string;
  isAiGenerated?: boolean;
}

export interface SynonymItem {
  word: string;
  formalityLevel: 'Erudito / Alto Padrão' | 'Formal Dissertativo' | 'Técnico / Jurídico / Filosófico';
  contextExplanation: string;
  exampleSentence: string;
  grammaticalNotes?: string;
}

export interface SynonymResponse {
  baseWord: string;
  grammaticalClass: string;
  avoidReasonC1?: string;
  synonyms: SynonymItem[];
  c1GrammarTip: string;
  relatedExpressions?: string[];
  isAiGenerated: boolean;
}

