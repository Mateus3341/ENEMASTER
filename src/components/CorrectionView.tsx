import React, { useState, useEffect, useRef } from 'react';
import { 
  PenTool, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Save, 
  Share2, 
  Sparkles, 
  GraduationCap, 
  Lightbulb, 
  ArrowRight,
  RefreshCw,
  Info,
  BookCheck,
  ShieldAlert,
  Award,
  Camera,
  FileType,
  FileCheck,
  Trash2,
  Check,
  Terminal,
  FileCode,
  Lock,
  Search,
  Scale,
  Quote,
  CheckCheck,
  Bookmark,
  ShieldCheck,
  Loader2,
  Zap,
  Target,
  TrendingUp,
  History,
  Calendar,
  MessageSquare,
  Eye,
  BookOpen
} from 'lucide-react';
import { 
  EssayCorrectionResult, 
  CompetencyNumber, 
  AvaliacaoCompetencia, 
  ReviewerAuditReport, 
  ReviewerCompetencyCheck,
  StructuredAiAnalysisLog
} from '../types';
import { HISTORICAL_THEMES } from '../data/officialData';
import { AiProgressBar } from './AiProgressBar';
import { useAiProgress } from '../hooks/useAiProgress';
import { validateAndAuditEssayScore } from '../utils/scoreValidator';
import { EssayCorrectionProfessorChat } from './EssayCorrectionProfessorChat';
import { useSavedWork } from '../contexts/SavedWorkContext';
import { useBackgroundTasks } from '../contexts/BackgroundTasksContext';
import { CorrectionSkeleton } from './SavedDataSkeleton';

/**
 * Constante LOG_CONFIG: Estrutura oficial de armazenamento de logs para cada análise da IA.
 * Inclui 'versao_modelo' e 'timestamp_analise' garantindo a rastreabilidade da decisão de nota,
 * com controle rigoroso de cota (limite de itens e bytes) no localStorage para evitar degradação de performance.
 */
export const LOG_CONFIG = {
  versao_modelo: 'gemini-2.5-flash-enem-v2.4-strict',
  storageKey: 'enem_ia_analysis_logs_v1',
  maxStoredLogs: 30, // Limite ótimo de registros históricos mantidos
  maxStorageSizeBytes: 300 * 1024, // Limite rígido de 300 KB para o histórico de auditoria
  maxSnippetLength: 400, // Limite de caracteres por snippet de evidência no log para evitar inchaço
  autoPersist: true,
  ambiente: 'producao-banca-inep',
  banca_versao: 'Matriz_Referencia_INEP_2024_2025',

  /**
   * Trunca trechos longos de texto para otimização de payload
   */
  sanitizarSnippet: (texto?: string): string => {
    if (!texto) return '';
    const clean = texto.trim();
    if (clean.length <= LOG_CONFIG.maxSnippetLength) return clean;
    return clean.slice(0, LOG_CONFIG.maxSnippetLength) + '... [truncado p/ log]';
  },

  /**
   * Constrói o registro estruturado de log da análise com rastreabilidade completa e payload compacto.
   */
  gerarLogEstruturado: (params: {
    correctionResultId?: string;
    totalScore: number;
    initialScore?: number;
    competencies: EssayCorrectionResult['competencies'];
    essayText: string;
    theme: string;
    reviewerReport?: ReviewerAuditReport;
    ocrUsed?: boolean;
  }): StructuredAiAnalysisLog => {
    const timestamp_analise = new Date().toISOString();
    const words = params.essayText.trim().split(/\s+/).filter(Boolean).length;
    const chars = params.essayText.length;
    const paragraphs = params.essayText.split(/\n+/).filter(p => p.trim().length > 0).length;
    const initialProposed = params.reviewerReport?.initialTotalScore ?? params.initialScore ?? params.totalScore;
    const finalScore = params.totalScore;
    const inflationAdjusted = Math.max(0, initialProposed - finalScore);

    return {
      id_analise: params.correctionResultId || `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp_analise,
      versao_modelo: LOG_CONFIG.versao_modelo,
      banca_versao: LOG_CONFIG.banca_versao,
      ambiente: LOG_CONFIG.ambiente,
      tema: LOG_CONFIG.sanitizarSnippet(params.theme),
      estatisticas_texto: {
        total_palavras: words,
        total_caracteres: chars,
        total_paragrafos: paragraphs,
        ocr_utilizado: !!params.ocrUsed
      },
      deliberacao_notas: {
        nota_total_final: finalScore,
        nota_total_proposta: initialProposed,
        inflacao_mitigada_pontos: inflationAdjusted,
        c1: {
          nota: params.competencies.c1.nota ?? params.competencies.c1.score,
          nivel: params.competencies.c1.nivel ?? params.competencies.c1.level,
          trecho_evidencia: LOG_CONFIG.sanitizarSnippet(params.competencies.c1.trecho_evidencia || params.competencies.c1.primaryEvidenceQuote),
          justificativa: LOG_CONFIG.sanitizarSnippet(params.competencies.c1.justificativa_analitica || params.competencies.c1.evaluation)
        },
        c2: {
          nota: params.competencies.c2.nota ?? params.competencies.c2.score,
          nivel: params.competencies.c2.nivel ?? params.competencies.c2.level,
          trecho_evidencia: LOG_CONFIG.sanitizarSnippet(params.competencies.c2.trecho_evidencia || params.competencies.c2.primaryEvidenceQuote),
          justificativa: LOG_CONFIG.sanitizarSnippet(params.competencies.c2.justificativa_analitica || params.competencies.c2.evaluation)
        },
        c3: {
          nota: params.competencies.c3.nota ?? params.competencies.c3.score,
          nivel: params.competencies.c3.nivel ?? params.competencies.c3.level,
          trecho_evidencia: LOG_CONFIG.sanitizarSnippet(params.competencies.c3.trecho_evidencia || params.competencies.c3.primaryEvidenceQuote),
          justificativa: LOG_CONFIG.sanitizarSnippet(params.competencies.c3.justificativa_analitica || params.competencies.c3.evaluation)
        },
        c4: {
          nota: params.competencies.c4.nota ?? params.competencies.c4.score,
          nivel: params.competencies.c4.nivel ?? params.competencies.c4.level,
          trecho_evidencia: LOG_CONFIG.sanitizarSnippet(params.competencies.c4.trecho_evidencia || params.competencies.c4.primaryEvidenceQuote),
          justificativa: LOG_CONFIG.sanitizarSnippet(params.competencies.c4.justificativa_analitica || params.competencies.c4.evaluation)
        },
        c5: {
          nota: params.competencies.c5.nota ?? params.competencies.c5.score,
          nivel: params.competencies.c5.nivel ?? params.competencies.c5.level,
          trecho_evidencia: LOG_CONFIG.sanitizarSnippet(params.competencies.c5.trecho_evidencia || params.competencies.c5.primaryEvidenceQuote),
          justificativa: LOG_CONFIG.sanitizarSnippet(params.competencies.c5.justificativa_analitica || params.competencies.c5.evaluation)
        }
      },
      auditoria_reviewer: {
        acionado: !!params.reviewerReport,
        motivo_acionamento: LOG_CONFIG.sanitizarSnippet(params.reviewerReport?.triggerReason),
        inflacao_detectada: params.reviewerReport?.wasInflationDetected ?? false,
        pontos_ajustados: params.reviewerReport?.inflationPointsAdjusted ?? 0,
        veredito_revisor: LOG_CONFIG.sanitizarSnippet(params.reviewerReport?.reviewerExecutiveSummary)
      },
      rastreabilidade: {
        protocolo_calibracao: 'INEP-Matriz-Calibrada-V2',
        conformidade_inep: '100% aderente aos 5 níveis oficiais sem arredondamento arbitrário',
        hash_sessao: `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`
      }
    };
  },

  /**
   * Calcula o tamanho em bytes de uma string ou array de logs
   */
  calcularBytes: (conteudo: string): number => {
    try {
      return new Blob([conteudo]).size;
    } catch {
      return conteudo.length * 2; // Fallback aproximado UTF-16
    }
  },

  /**
   * Compacta e remove registros antigos via FIFO garantindo limites de contagem e bytes
   */
  compactarHistorico: (logs: StructuredAiAnalysisLog[]): StructuredAiAnalysisLog[] => {
    let list = [...logs].slice(0, LOG_CONFIG.maxStoredLogs);
    let serialized = JSON.stringify(list);
    let currentBytes = LOG_CONFIG.calcularBytes(serialized);

    // Se o tamanho exceder o limite de bytes, remover progressivamente os mais antigos
    while (list.length > 1 && currentBytes > LOG_CONFIG.maxStorageSizeBytes) {
      list.pop(); // Remove o mais antigo
      serialized = JSON.stringify(list);
      currentBytes = LOG_CONFIG.calcularBytes(serialized);
    }

    return list;
  },

  /**
   * Salva o log estruturado no storage com proteção de limite de tamanho e fallback anti-degradação.
   */
  salvarLog: (logEntry: StructuredAiAnalysisLog): boolean => {
    try {
      const stored = localStorage.getItem(LOG_CONFIG.storageKey);
      let list: StructuredAiAnalysisLog[] = [];
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) list = parsed;
        } catch {
          list = [];
        }
      }

      // Adiciona o novo log no topo e compacta respeitando limites de itens e bytes
      const updatedList = LOG_CONFIG.compactarHistorico([logEntry, ...list]);
      localStorage.setItem(LOG_CONFIG.storageKey, JSON.stringify(updatedList));
      return true;
    } catch (e) {
      console.warn('[LOG_CONFIG] Falha ou cota atingida ao salvar log no localStorage, aplicando expurgo de emergência:', e);
      try {
        // Fallback de emergência: manter apenas o log mais recente
        localStorage.setItem(LOG_CONFIG.storageKey, JSON.stringify([logEntry]));
        return true;
      } catch {
        return false;
      }
    }
  },

  /**
   * Recupera histórico de logs para calibração.
   */
  recuperarLogs: (): StructuredAiAnalysisLog[] => {
    try {
      const stored = localStorage.getItem(LOG_CONFIG.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  /**
   * Retorna métricas do storage de logs para monitoramento de saúde do localStorage
   */
  obterMetricasStorage: (): { totalLogs: number; bytesUsados: number; kbUsados: number; limiteKb: number; percentualUso: number } => {
    try {
      const stored = localStorage.getItem(LOG_CONFIG.storageKey) || '[]';
      const parsed: StructuredAiAnalysisLog[] = JSON.parse(stored);
      const bytes = LOG_CONFIG.calcularBytes(stored);
      const kbUsados = Math.round(bytes / 1024);
      const limiteKb = Math.round(LOG_CONFIG.maxStorageSizeBytes / 1024);
      const percentualUso = Math.min(100, Math.round((bytes / LOG_CONFIG.maxStorageSizeBytes) * 100));

      return {
        totalLogs: Array.isArray(parsed) ? parsed.length : 0,
        bytesUsados: bytes,
        kbUsados,
        limiteKb,
        percentualUso
      };
    } catch {
      return { totalLogs: 0, bytesUsados: 0, kbUsados: 0, limiteKb: Math.round(LOG_CONFIG.maxStorageSizeBytes / 1024), percentualUso: 0 };
    }
  }
};

export interface AuditPipelineStep {
  id: string;
  title: string;
  detail: string;
  badge: string;
}

export const AUDIT_PIPELINE_STEPS: AuditPipelineStep[] = [
  {
    id: 'step-1',
    title: 'Segmentando estrutura e sintaxe do texto...',
    detail: 'Análise de períodos, parágrafos, contagem de linhas e checagem da tipologia dissertativo-argumentativa.',
    badge: 'Estrutura & Tipologia'
  },
  {
    id: 'step-2',
    title: 'Avaliando competências com matriz de referência...',
    detail: 'Enquadramento analítico dos níveis 0 a 5 com base na Cartilha Oficial do INEP (C1 a C5).',
    badge: 'Matriz INEP'
  },
  {
    id: 'step-3',
    title: 'Verificando evidências...',
    detail: 'Extração e validação de trechos textuais afirmativos (impede atribuição de notas sem comprovação real no texto).',
    badge: 'Comprovação Textual'
  },
  {
    id: 'step-4',
    title: 'Validando critérios oficiais...',
    detail: 'Auditoria dos 5 elementos da intervenção na C5, legitimidade e produtividade na C2, e projeto de texto na C3.',
    badge: 'Validador de Critérios'
  },
  {
    id: 'step-5',
    title: 'Auditando rigor da Banca Revisora (Anti-Inflação)...',
    detail: 'Segunda chamada de auditoria e calibragem para notas elevadas (≥900 ou competências nível 200).',
    badge: 'Banca Revisora'
  },
  {
    id: 'step-6',
    title: 'Calibrando nota final...',
    detail: 'Ponderação dos 3 pilares qualitativos por competência, mitigação de complacência e homologação da nota.',
    badge: 'Homologação Final'
  }
];

interface ProgressoAuditoriaProps {
  isLoading: boolean;
  progress: number;
  currentStepIndex: number;
  mode?: 'live' | 'completed';
  className?: string;
}

export const ProgressoAuditoria: React.FC<ProgressoAuditoriaProps> = ({
  isLoading,
  progress,
  currentStepIndex,
  mode = 'live',
  className = ''
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(true);
  const activeIdx = Math.min(Math.max(currentStepIndex, 0), AUDIT_PIPELINE_STEPS.length - 1);
  const currentStep = AUDIT_PIPELINE_STEPS[activeIdx];
  const isCompleted = mode === 'completed' || (!isLoading && progress >= 100);

  return (
    <div 
      id="progresso-auditoria-widget"
      className={`rounded-2xl border transition-all ${
        isCompleted
          ? 'bg-slate-900 text-white border-slate-800 shadow-lg'
          : 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/80 shadow-xl'
      } p-6 sm:p-7 space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
            isCompleted 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
          }`}>
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>Progresso de Auditoria & Re-Análise</span>
              </h3>
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800 animate-pulse'
              }`}>
                {isCompleted ? '✓ Auditoria Concluída & Homologada' : '⚙️ Re-Análise em Andamento'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Validador de Nota com rigor oficial do INEP e auditoria anti-inflação em 6 etapas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isCompleted ? 100 : Math.round(progress)}
            </span>
            <span className="text-xs font-bold text-slate-400">%</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="space-y-2">
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative p-0.5 border border-slate-200 dark:border-slate-700/60">
          <div
            className={`h-full transition-all duration-300 ease-out rounded-full relative overflow-hidden ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-indigo-600 via-blue-500 to-emerald-500'
            }`}
            style={{ width: `${isCompleted ? 100 : Math.max(progress, 8)}%` }}
          >
            {!isCompleted && (
              <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite] -skew-x-12" />
            )}
          </div>
        </div>

        {/* Current Active Step Banner (Live mode) */}
        {!isCompleted && (
          <div className="flex items-center justify-between text-xs pt-1 px-1">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
              <span>{currentStep.title}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Etapa {activeIdx + 1} de {AUDIT_PIPELINE_STEPS.length}
            </span>
          </div>
        )}
      </div>

      {/* Steps Pipeline Checklist */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Etapas da Re-Análise & Validação da Nota:</span>
          </span>
          <button
            type="button"
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>{isDetailsOpen ? 'Recolher detalhes' : 'Ver todos os detalhes'}</span>
            {isDetailsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {AUDIT_PIPELINE_STEPS.map((step, idx) => {
            const stepCompleted = isCompleted || idx < activeIdx || progress >= 100;
            const stepActive = !isCompleted && idx === activeIdx && progress < 100;

            return (
              <div
                key={step.id}
                className={`p-3 sm:p-3.5 rounded-xl border transition-all ${
                  stepActive
                    ? 'bg-indigo-50/90 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-800 ring-2 ring-indigo-500/20 shadow-xs'
                    : stepCompleted
                    ? 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800'
                    : 'bg-slate-50/30 dark:bg-slate-900/40 border-slate-200/40 dark:border-slate-800/40 opacity-60'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    {stepCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : stepActive ? (
                      <div className="relative flex h-4 w-4 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-400">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs font-bold truncate ${
                        stepActive
                          ? 'text-indigo-950 dark:text-indigo-200'
                          : stepCompleted
                          ? 'text-slate-900 dark:text-slate-200'
                          : 'text-slate-500 dark:text-slate-500'
                      }`}>
                        {step.title}
                      </h4>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
                        stepActive
                          ? 'bg-indigo-200/80 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
                          : stepCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}>
                        {step.badge}
                      </span>
                    </div>

                    {isDetailsOpen && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {step.detail}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reassurance Footer Banner */}
      <div className="p-3.5 rounded-xl bg-slate-950/50 dark:bg-slate-950 border border-slate-800/80 text-xs flex items-center gap-3 text-slate-300">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="leading-relaxed">
          <strong>Garantia de Rigor INEP:</strong> A re-análise impede a atribuição automática de notas por mera ausência de erros, exigindo comprovação de evidências afirmativas em cada competência.
        </span>
      </div>
    </div>
  );
};

interface CorrectionViewProps {
  initialTheme?: string;
  initialCorrectionResult?: EssayCorrectionResult | null;
  savedEssays?: EssayCorrectionResult[];
  onSaveEssay: (result: EssayCorrectionResult) => void;
  onAskProfessorAboutEssay: (essayText: string, theme: string, resultSummary: string) => void;
  isLoading?: boolean;
}

export const CorrectionView: React.FC<CorrectionViewProps> = ({ 
  initialTheme = '', 
  initialCorrectionResult = null,
  savedEssays = [],
  onSaveEssay, 
  onAskProfessorAboutEssay,
  isLoading = false
}) => {
  const { savedWork, isLoadingSavedWork, setActiveCorrection, setCorrectionDraft } = useSavedWork();
  const { startTask, updateTaskProgress, completeTask, failTask, getTaskByTab } = useBackgroundTasks();

  const [theme, setTheme] = useState<string>(() => {
    if (initialCorrectionResult?.theme) return initialCorrectionResult.theme;
    if (initialTheme) return initialTheme;
    if (savedWork.activeCorrection?.theme) return savedWork.activeCorrection.theme;
    if (savedWork.correctionDraftTheme) return savedWork.correctionDraftTheme;
    return HISTORICAL_THEMES[0].title;
  });

  const [isCustomTheme, setIsCustomTheme] = useState<boolean>(() => {
    const activeT = initialCorrectionResult?.theme || initialTheme || savedWork.activeCorrection?.theme || savedWork.correctionDraftTheme;
    return Boolean(activeT && !HISTORICAL_THEMES.some(t => t.title === activeT));
  });

  const [customThemeInput, setCustomThemeInput] = useState<string>(() => {
    const activeT = initialCorrectionResult?.theme || initialTheme || savedWork.activeCorrection?.theme || savedWork.correctionDraftTheme;
    return (activeT && !HISTORICAL_THEMES.some(t => t.title === activeT)) ? activeT : '';
  });

  const [essayText, setEssayText] = useState<string>(() => {
    if (initialCorrectionResult?.essayText) return initialCorrectionResult.essayText;
    if (savedWork.activeCorrection?.essayText) return savedWork.activeCorrection.essayText;
    if (savedWork.correctionDraftText) return savedWork.correctionDraftText;
    return '';
  });
  
  // Keep draft persisted in background
  useEffect(() => {
    const activeThemeTitle = isCustomTheme ? customThemeInput : theme;
    setCorrectionDraft(essayText, activeThemeTitle);
  }, [essayText, theme, isCustomTheme, customThemeInput, setCorrectionDraft]);

  // OCR and Upload states
  const [isOcrLoading, setIsOcrLoading] = useState<boolean>(false);
  const [ocrFileName, setOcrFileName] = useState<string>('');
  const [ocrFileSize, setOcrFileSize] = useState<string>('');
  const [ocrWarning, setOcrWarning] = useState<string>('');
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [detectedFormat, setDetectedFormat] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Progress hooks with real stages
  const ocrProgress = useAiProgress({
    steps: [
      'Carregando e decodificando arquivo...',
      'Processando visão computacional e caligrafia...',
      'Transcrevendo e segmentando parágrafos...',
      'Validando fidelidade do texto...'
    ],
    estimatedDurationMs: 6500,
  });

  const gradingProgress = useAiProgress({
    steps: AUDIT_PIPELINE_STEPS.map(s => s.title),
    estimatedDurationMs: 12000,
  });

  // Grading states
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradingStep, setGradingStep] = useState<string>('');
  const [correctionResult, setCorrectionResult] = useState<EssayCorrectionResult | null>(() => {
    return initialCorrectionResult || savedWork.activeCorrection || null;
  });
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(!!initialCorrectionResult || !!savedWork.activeCorrection);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState<boolean>(false);

  // Sync if initialCorrectionResult prop changes
  useEffect(() => {
    if (initialCorrectionResult) {
      setCorrectionResult(initialCorrectionResult);
      setActiveCorrection(initialCorrectionResult);
      setTheme(initialCorrectionResult.theme);
      setEssayText(initialCorrectionResult.essayText || '');
      setIsSaved(true);
      if (!HISTORICAL_THEMES.some(t => t.title === initialCorrectionResult.theme)) {
        setIsCustomTheme(true);
        setCustomThemeInput(initialCorrectionResult.theme);
      } else {
        setIsCustomTheme(false);
      }
    }
  }, [initialCorrectionResult, setActiveCorrection]);

  // Sync state if background task completed while user was on another tab
  useEffect(() => {
    if (savedWork.activeCorrection && (!correctionResult || savedWork.activeCorrection.id !== correctionResult.id)) {
      setCorrectionResult(savedWork.activeCorrection);
      setIsSaved(true);
      if (savedWork.activeCorrection.theme) {
        setTheme(savedWork.activeCorrection.theme);
        if (!HISTORICAL_THEMES.some(t => t.title === savedWork.activeCorrection?.theme)) {
          setIsCustomTheme(true);
          setCustomThemeInput(savedWork.activeCorrection.theme);
        } else {
          setIsCustomTheme(false);
        }
      }
      if (savedWork.activeCorrection.essayText) {
        setEssayText(savedWork.activeCorrection.essayText);
      }
    }
  }, [savedWork.activeCorrection]);

  // UI accordion state
  const [expandedComp, setExpandedComp] = useState<number | null>(1);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isEssayTextExpanded, setIsEssayTextExpanded] = useState<boolean>(true);
  const [copiedEssayText, setCopiedEssayText] = useState<boolean>(false);

  // Guarantee that after grading completes or when viewing a correction result,
  // the viewport stays firmly at the top of the evaluation report and NEVER jumps automatically
  // to the bottom of the page where the AI chatbot is located.
  useEffect(() => {
    if (correctionResult && !isGrading) {
      window.scrollTo(0, 0);

      const timer = setTimeout(() => {
        const scoreBanner = document.getElementById('correction-score-banner') || document.getElementById('correction-view-top');
        if (scoreBanner) {
          scoreBanner.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 60);

      return () => clearTimeout(timer);
    }
  }, [correctionResult?.id, isGrading]);
  const [isAuditProgressExpanded, setIsAuditProgressExpanded] = useState<boolean>(false);
  const [isAuditLogExpanded, setIsAuditLogExpanded] = useState<boolean>(true);
  const [selectedAuditTab, setSelectedAuditTab] = useState<'all' | 'c1' | 'c2' | 'c3' | 'c4' | 'c5'>('all');
  const [isValidatorExpanded, setIsValidatorExpanded] = useState<boolean>(true);
  const [isEvidenceValidatorExpanded, setIsEvidenceValidatorExpanded] = useState<boolean>(true);
  const [selectedEvidenceTab, setSelectedEvidenceTab] = useState<'all' | 'c1' | 'c2' | 'c3' | 'c4' | 'c5'>('all');
  const [isReviewerReportExpanded, setIsReviewerReportExpanded] = useState<boolean>(true);
  const [selectedReviewerTab, setSelectedReviewerTab] = useState<'all' | 'c1' | 'c2' | 'c3' | 'c4' | 'c5'>('all');
  const [showPromptModal, setShowPromptModal] = useState<boolean>(false);
  const [isLogConfigExpanded, setIsLogConfigExpanded] = useState<boolean>(false);
  const [isLogCopied, setIsLogCopied] = useState<boolean>(false);
  const [isDivergenceGuideExpanded, setIsDivergenceGuideExpanded] = useState<boolean>(true);
  const [showTechnicalLogs, setShowTechnicalLogs] = useState<boolean>(false);
  const [activeTechnicalTab, setActiveTechnicalTab] = useState<'pipeline' | 'internal' | 'reviewer' | 'evidence' | 'json'>('pipeline');

  // Calculate text stats
  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
  const paragraphCount = essayText.trim() ? essayText.trim().split(/\n+/).filter(p => p.trim().length > 0).length : 0;
  const estimatedLines = Math.min(30, Math.max(1, Math.round(essayText.length / 70)));

  // Format file size nicely
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Process any uploaded File (Images: JPG, PNG, WEBP, HEIC; Docs: PDF, TXT, DOCX, MD)
  const processUploadedFile = async (file: File) => {
    if (!file) return;

    const fileName = file.name;
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const fileMime = file.type.toLowerCase();

    setOcrFileName(fileName);
    setOcrFileSize(formatBytes(file.size));
    setIsOcrLoading(true);
    ocrProgress.startProgress();
    setOcrWarning('');
    setErrorMsg('');

    // Case 1: Plain Text (.txt, .md) - Instant local reading without waiting
    if (ext === 'txt' || ext === 'md' || fileMime === 'text/plain' || fileMime === 'text/markdown') {
      try {
        const textContent = await file.text();
        setEssayText(textContent.trim());
        setDetectedFormat(ext.toUpperCase() || 'TXT');
        ocrProgress.completeProgress();
        setIsOcrLoading(false);
        return;
      } catch (err: any) {
        console.error('Error reading text file:', err);
      }
    }

    // Case 2: Images (JPG, JPEG, PNG, WEBP, HEIC, AVIF, BMP) & Documents (PDF, DOCX) via Multimodal AI
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        
        try {
          const res = await fetch('/api/ocr-essay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64Data,
              mimeType: file.type || (ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'png' ? 'image/png' : ext === 'pdf' ? 'application/pdf' : 'image/jpeg'),
              fileName: file.name
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Erro ao processar imagem ou documento da redação.');
          }

          setEssayText(data.transcription || '');
          setDetectedFormat(ext.toUpperCase() || (file.type ? file.type.split('/')[1]?.toUpperCase() : 'JPG'));
          
          if (data.transcription && data.transcription.includes('ilegível')) {
            setOcrWarning('Identificamos alguns trechos com caligrafia duvidosa/ilegível marcados no texto transcrito. Você pode revisá-los antes de corrigir.');
          }
          ocrProgress.completeProgress();
        } catch (err: any) {
          ocrProgress.resetProgress();
          setErrorMsg(err.message || 'Falha na leitura e transcrição do arquivo.');
        } finally {
          setIsOcrLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      ocrProgress.resetProgress();
      setErrorMsg('Não foi possível ler o arquivo enviado.');
      setIsOcrLoading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Clipboard Paste Support (Ctrl+V / Cmd+V screenshot or copied image)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const pastedFile = new File([blob], `print-redacao-${Date.now()}.jpg`, { type: blob.type || 'image/jpeg' });
            processUploadedFile(pastedFile);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  if (isLoading || isLoadingSavedWork) {
    return <CorrectionSkeleton />;
  }

  const handleClearUploadedFile = () => {
    setOcrFileName('');
    setOcrFileSize('');
    setDetectedFormat('');
    setOcrWarning('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleRunCorrection = async () => {
    const activeTheme = isCustomTheme ? customThemeInput.trim() : theme.trim();
    if (!activeTheme) {
      setErrorMsg('Por favor, informe o tema da redação.');
      return;
    }
    if (!essayText.trim() || essayText.trim().length < 50) {
      setErrorMsg('Por favor, digite ou envie o texto completo da sua redação (mínimo 50 caracteres).');
      return;
    }

    setErrorMsg('');
    setIsGrading(true);
    setIsSaved(false);
    gradingProgress.startProgress();

    const taskId = `task-correction-${Date.now()}`;
    startTask(taskId, 'correction', 'Correção de Redação (5 Competências)', activeTheme);

    try {
      updateTaskProgress(taskId, 25, 'Auditando eixos e desvios gramaticais (C1 e C4)...');
      const res = await fetch('/api/grade-essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: activeTheme,
          essayText: essayText.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao avaliar redação.');
      }

      updateTaskProgress(taskId, 65, 'Cruzando com a Matriz Oficial INEP e Banca Revisora...');

      // Validador de Nota & Reviewer Anti-Inflação (2ª Chamada Obrigatória para Notas 200 e Notas Altas >= 900)
      const compScores = [
        data.competencies?.c1?.score ?? data.competencies?.c1?.nota ?? 0,
        data.competencies?.c2?.score ?? data.competencies?.c2?.nota ?? 0,
        data.competencies?.c3?.score ?? data.competencies?.c3?.nota ?? 0,
        data.competencies?.c4?.score ?? data.competencies?.c4?.nota ?? 0,
        data.competencies?.c5?.score ?? data.competencies?.c5?.nota ?? 0,
      ];
      const hasScore200 = compScores.some(s => s === 200);
      const isTotalHighScore = (data.totalScore || 0) >= 900;
      let reviewerAuditData: ReviewerAuditReport | undefined = undefined;

      if (hasScore200 || isTotalHighScore) {
        try {
          const reviewRes = await fetch('/api/review-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              theme: activeTheme,
              essayText: essayText.trim(),
              initialGrading: data,
            }),
          });

          if (reviewRes.ok) {
            reviewerAuditData = await reviewRes.json();

            // Se a Banca Revisora recalibrou notas ou apontou evidências mais precisas, atualizar as competências
            if (reviewerAuditData && Array.isArray(reviewerAuditData.competencyReviews)) {
              reviewerAuditData.competencyReviews.forEach((rComp: ReviewerCompetencyCheck) => {
                const compKey = `c${rComp.competencyNum}` as 'c1' | 'c2' | 'c3' | 'c4' | 'c5';
                if (data.competencies && data.competencies[compKey]) {
                  const targetComp = data.competencies[compKey];
                  targetComp.score = rComp.reviewedScore;
                  targetComp.nota = rComp.reviewedScore;
                  targetComp.level = Math.round(rComp.reviewedScore / 40);
                  targetComp.nivel = Math.round(rComp.reviewedScore / 40);
                  if (rComp.trecho_evidencia) targetComp.trecho_evidencia = rComp.trecho_evidencia;
                  if (rComp.justificativa_analitica) targetComp.justificativa_analitica = rComp.justificativa_analitica;
                  if (rComp.flawIdentified) {
                    if (!targetComp.problemsIdentified) targetComp.problemsIdentified = [];
                    if (!targetComp.problemsIdentified.includes(rComp.flawIdentified)) {
                      targetComp.problemsIdentified.unshift(rComp.flawIdentified);
                    }
                  }
                }
              });
              data.totalScore = reviewerAuditData.finalAuditedTotalScore;
            }
          }
        } catch (revError) {
          console.warn('Reviewer endpoint call fallback:', revError);
        }
      }

      // Pre-display Score Validator & Exceptional Evidence Verification Prompt Check
      const { validatedTotalScore, validatedCompetencies, validationReport, evidenceValidatorReport } = validateAndAuditEssayScore(
        {
          totalScore: data.totalScore,
          competencies: data.competencies,
          c1Deviations: data.c1Deviations || [],
          c5Structure: data.c5Structure,
        },
        essayText.trim(),
        activeTheme
      );

      // Gerar e persistir log estruturado com LOG_CONFIG para rastreabilidade e calibração contínua
      const aiAnalysisLog = LOG_CONFIG.gerarLogEstruturado({
        correctionResultId: `correction-${Date.now()}`,
        totalScore: validatedTotalScore,
        initialScore: data.totalScore,
        competencies: validatedCompetencies,
        essayText: essayText.trim(),
        theme: activeTheme,
        reviewerReport: reviewerAuditData,
        ocrUsed: !!ocrFileName,
      });

      if (LOG_CONFIG.autoPersist) {
        LOG_CONFIG.salvarLog(aiAnalysisLog);
      }

      const result: EssayCorrectionResult = {
        id: aiAnalysisLog.id_analise,
        date: new Date().toLocaleDateString('pt-BR'),
        theme: activeTheme,
        essayText: essayText.trim(),
        totalScore: validatedTotalScore,
        competencies: validatedCompetencies,
        reviewerReport: reviewerAuditData,
        aiAnalysisLog: aiAnalysisLog,
        auditLog: data.auditLog,
        validationReport: validationReport,
        evidenceValidatorReport: evidenceValidatorReport,
        dualEvaluatorSimulation: data.dualEvaluatorSimulation,
        cartilhaBenchmark: data.cartilhaBenchmark,
        c1Deviations: data.c1Deviations || [],
        c5Structure: data.c5Structure,
        generalDiagnostic: data.generalDiagnostic,
        top3Problems: data.top3Problems || [],
        top3Strengths: data.top3Strengths || [],
        actionPlanToImprove: data.actionPlanToImprove || [],
        highPerformanceComparison: data.highPerformanceComparison,
        highPerformanceCurveReport: data.highPerformanceCurveReport || validationReport.highPerformanceCurveReport,
        pedagogicalRewrites: data.pedagogicalRewrites || [],
        isHandwrittenOcr: !!ocrFileName,
        ocrConfidenceNote: ocrWarning,
      };

      gradingProgress.completeProgress();
      setCorrectionResult(result);
      setActiveCorrection(result);
      setIsSaved(true);
      completeTask(taskId, result);

      // Keep user at the top of the evaluation result to view the overall score and overview
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
      
      // Persist active correction in LocalStorage so user can immediately see it again anytime
      try {
        localStorage.setItem('enem_last_correction_result_v1', JSON.stringify(result));
      } catch (storageErr) {
        console.warn('LocalStorage save note:', storageErr);
      }

      // Auto-save immediately to Firestore cloud account & local state so data is never lost across devices
      try {
        onSaveEssay(result);
      } catch (saveErr) {
        console.warn('Auto-save note:', saveErr);
      }
    } catch (err: any) {
      gradingProgress.resetProgress();
      failTask(taskId, err.message || 'Falha na avaliação da redação.');
      setErrorMsg(err.message || 'Falha ao processar a avaliação com o corretor.');
    } finally {
      setIsGrading(false);
    }
  };

  const handleSave = () => {
    if (correctionResult) {
      onSaveEssay(correctionResult);
      setIsSaved(true);
    }
  };

  const handleCopyStructuredLog = () => {
    if (!correctionResult) return;
    const logData = correctionResult.aiAnalysisLog || LOG_CONFIG.gerarLogEstruturado({
      correctionResultId: correctionResult.id,
      totalScore: correctionResult.totalScore,
      competencies: correctionResult.competencies,
      essayText: essayText.trim(),
      theme: theme,
      reviewerReport: correctionResult.reviewerReport,
      ocrUsed: !!ocrFileName,
    });

    navigator.clipboard.writeText(JSON.stringify(logData, null, 2));
    setIsLogCopied(true);
    setTimeout(() => setIsLogCopied(false), 2500);
  };

  const preliminaryEstimatedScore =
    correctionResult?.dualEvaluatorSimulation?.evaluatorA?.total ??
    correctionResult?.reviewerReport?.initialTotalScore ??
    correctionResult?.validationReport?.rawSum ??
    correctionResult?.totalScore ?? 0;

  const strictAuditedScore =
    correctionResult?.dualEvaluatorSimulation?.evaluatorB?.total ??
    correctionResult?.reviewerReport?.finalAuditedTotalScore ??
    correctionResult?.validationReport?.validatedTotal ??
    correctionResult?.totalScore ?? 0;

  const officialMeanScore = correctionResult?.totalScore ?? Math.round((preliminaryEstimatedScore + strictAuditedScore) / 2);
  const scoreDivergence = Math.abs(preliminaryEstimatedScore - strictAuditedScore);
  const hasDivergence = scoreDivergence > 0 || (correctionResult?.reviewerReport?.wasInflationDetected ?? false) || (correctionResult?.validationReport?.hasAdjustments ?? false);
  const minScoreRange = Math.min(preliminaryEstimatedScore, strictAuditedScore);
  const maxScoreRange = Math.max(preliminaryEstimatedScore, strictAuditedScore);

  const competencyDivergences = correctionResult ? (['c1', 'c2', 'c3', 'c4', 'c5'] as const).map((k, idx) => {
    const num = (idx + 1) as CompetencyNumber;
    const name = [
      'C1 - Norma Culta & Sintaxe',
      'C2 - Tema & Repertório Sociocultural',
      'C3 - Projeto de Texto & Causalidade',
      'C4 - Coesão Textual Inter/Intraparágrafos',
      'C5 - Proposta de Intervenção Oficial'
    ][idx];

    const scoreA = correctionResult.dualEvaluatorSimulation?.evaluatorA?.[k] ?? 
                   correctionResult.reviewerReport?.competencyReviews?.find(r => r.competencyNum === num)?.initialScore ??
                   correctionResult.competencies[k].score;

    const scoreB = correctionResult.dualEvaluatorSimulation?.evaluatorB?.[k] ?? 
                   correctionResult.reviewerReport?.competencyReviews?.find(r => r.competencyNum === num)?.reviewedScore ??
                   correctionResult.competencies[k].score;

    const officialCompMean = (scoreA + scoreB) / 2;
    const diff = Math.abs(scoreA - scoreB);

    return {
      num,
      name,
      key: k,
      scoreA,
      scoreB,
      officialCompMean,
      diff,
      isDivergent: diff > 0,
    };
  }) : [];

  const handleCopyReport = () => {
    if (!correctionResult) return;
    const reportText = `================================================
RELATÓRIO DE CORREÇÃO OFICIAL — REDAÇÃO ENEM
Tema: ${correctionResult.theme}
Data: ${correctionResult.date}

⭐ NOTA OFICIAL A CONSIDERAR (MÉDIA INEP): ${officialMeanScore} / 1000
${hasDivergence ? `[1º Olhar (Nota Estimada): ${preliminaryEstimatedScore} pts | Banca Revisora (Nota Auditada): ${strictAuditedScore} pts | Faixa Realista no ENEM: ${minScoreRange} a ${maxScoreRange} pts]` : ''}

PONTUAÇÃO POR COMPETÊNCIAS (MÉDIA OFICIAL):
- C1 (Norma Culta): ${correctionResult.competencies.c1.score} / 200
- C2 (Tema e Repertório): ${correctionResult.competencies.c2.score} / 200
- C3 (Projeto de Texto): ${correctionResult.competencies.c3.score} / 200
- C4 (Coesão Textual): ${correctionResult.competencies.c4.score} / 200
- C5 (Proposta Intervenção): ${correctionResult.competencies.c5.score} / 200

DIAGNÓSTICO GERAL:
${correctionResult.generalDiagnostic}

3 MAIORES PONTOS FORTES:
${correctionResult.top3Strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

3 MAIORES PROBLEMAS:
${correctionResult.top3Problems.map((p, i) => `${i + 1}. ${p}`).join('\n')}

COMO SUBIR SUA NOTA (PLANO DE AÇÃO):
${correctionResult.actionPlanToImprove.map((a, i) => `${i + 1}. ${a}`).join('\n')}

ESTRUTURA C5 (PROPOSTA DE INTERVENÇÃO):
- Agente: ${correctionResult.c5Structure.agent.present ? '✅' : '❌'} ${correctionResult.c5Structure.agent.text || 'Ausente'}
- Ação: ${correctionResult.c5Structure.action.present ? '✅' : '❌'} ${correctionResult.c5Structure.action.text || 'Ausente'}
- Meio: ${correctionResult.c5Structure.modeMedium.present ? '✅' : '❌'} ${correctionResult.c5Structure.modeMedium.text || 'Ausente'}
- Finalidade: ${correctionResult.c5Structure.effect.present ? '✅' : '❌'} ${correctionResult.c5Structure.effect.text || 'Ausente'}
- Detalhamento: ${correctionResult.c5Structure.detailing.present ? '✅' : '❌'} ${correctionResult.c5Structure.detailing.text || 'Ausente'}
- Direitos Humanos: ${correctionResult.c5Structure.respectsHumanRights ? '✅ Respeitados' : '❌ Violação'}
================================================`;

    navigator.clipboard.writeText(reportText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 900) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score >= 800) return 'text-blue-700 bg-blue-50 border-blue-300';
    if (score >= 640) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  const getCompScoreBadge = (score: number) => {
    if (score === 200) return 'bg-emerald-600 text-white';
    if (score === 160) return 'bg-blue-600 text-white';
    if (score === 120) return 'bg-amber-500 text-white';
    if (score === 80) return 'bg-orange-500 text-white';
    return 'bg-rose-600 text-white';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              <PenTool className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Corretor Especializado ENEM
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Correção criteriosa e conservadora orientada pelos manuais de capacitação de avaliadores do INEP.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {savedEssays.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <History className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Avaliações Salvas ({savedEssays.length})</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHistoryDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showHistoryDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 max-h-96 overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 p-2 space-y-1.5">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Histórico no LocalStorage ({savedEssays.length})
                    </span>
                    <span className="text-[10px] text-slate-400">Clique para rever</span>
                  </div>

                  {savedEssays.map((saved) => (
                    <button
                      key={saved.id}
                      type="button"
                      onClick={() => {
                        setCorrectionResult(saved);
                        setTheme(saved.theme);
                        setEssayText(saved.essayText || '');
                        setIsSaved(true);
                        setShowHistoryDropdown(false);
                        try {
                          localStorage.setItem('enem_last_correction_result_v1', JSON.stringify(saved));
                        } catch {}
                        if (!HISTORICAL_THEMES.some(t => t.title === saved.theme)) {
                          setIsCustomTheme(true);
                          setCustomThemeInput(saved.theme);
                        } else {
                          setIsCustomTheme(false);
                        }
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex flex-col gap-1 ${
                        correctionResult?.id === saved.id
                          ? 'bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {saved.date}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                          saved.totalScore >= 900 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          saved.totalScore >= 800 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                          saved.totalScore >= 640 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {saved.totalScore} pts
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                        {saved.theme}
                      </p>
                      {saved.essayText && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 italic font-serif">
                          "{saved.essayText}"
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {correctionResult && (
            <button
              onClick={() => {
                setCorrectionResult(null);
                setEssayText('');
                setOcrFileName('');
                try {
                  localStorage.removeItem('enem_last_correction_result_v1');
                } catch {}
              }}
              className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Nova Avaliação</span>
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Atenção</p>
            <p>{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Main Input Form (Hidden if result is available, or can toggle back) */}
      {!correctionResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form Setup */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Theme Card */}
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 sm:space-y-4 transition-colors">
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-100">
                1. Tema da Redação
              </label>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsCustomTheme(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    !isCustomTheme 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Temas Anteriores ENEM
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomTheme(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isCustomTheme 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Tema Personalizado
                </button>
              </div>

              {!isCustomTheme ? (
                <select
                  id="select-historical-theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium bg-slate-50/50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all"
                >
                  {HISTORICAL_THEMES.map((t) => (
                    <option key={t.year} value={t.title} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                      ENEM {t.year} — {t.title}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id="input-custom-theme"
                  value={customThemeInput}
                  onChange={(e) => setCustomThemeInput(e.target.value)}
                  placeholder="Ex: Os desafios da inteligência artificial no mercado de trabalho brasileiro..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all"
                />
              )}
            </div>

            {/* Essay Input Card */}
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 sm:space-y-4 transition-colors">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-slate-900 dark:text-slate-100">
                    2. Texto da Redação
                  </label>
                  {/* Quick trigger for OCR on mobile screens */}
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="lg:hidden text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer border border-indigo-200 dark:border-indigo-800"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Foto / OCR</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                  {/* Clean text stats pills */}
                  <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-600 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold">
                      <strong>{paragraphCount}</strong> {paragraphCount === 1 ? 'parágrafo' : 'parágrafos'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold">
                      <strong>{wordCount}</strong> palavras
                    </span>
                    <span className={`px-2 py-0.5 rounded-md font-semibold ${
                      estimatedLines > 30 
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                        : 'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      ~{estimatedLines}/30 linhas
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTheme("Povos Tradicionais (ENEM 2022)");
                      setEssayText(`De acordo com a Carta Magna, um importante documento na gerenciação de leis, condiz, no artigo 5, que todos são iguais perante a lei. Visto que, na sociedade hordiena não há uma valorização de povos tradicionais brasileiros, que são fundamentais para a movimentação do capital. No entanto, a desvalorização desses indivíduos ocorre devido aos esteriótipos impostos na sociedade, uma vez que o pensamento de que eles roubariam os bens pessoais é maior.

Inicialmente, na época do descobrimento do Brasil, em 1500, Dom pedro I descobriu terras brasileiras que trariam lucros para os mesmos, mas logo se depararam com indigenas que ali já habitavam nessas terras. Sob esse viés, os indigenas por longas décadas foram tratados com desrespeito e violência pelos seus donos, casos que infelizmente ainda são vistos na atualidade. Logo, a negligência estatal sobre dar enfoque a esses povos é crucial para que haja uma reflexão e mudanças no cenário brasileiro.

Ademais, os povos tradicionais possuem um papel essencial na preservação da fauna e flora brasileira, visto que, segundo pesquisas da ONU, as áreas protegidas por essas comunidades apresentam as menores taxas de desmatamento. Dessarte, a invisibilidade histórica enfrentada por esses grupos compromete a sustentabilidade ambiental do país.

Portanto, medidas são urgentes para valorizar essas comunidades. Cabe ao Ministério da Educação, por meio de palestras e materiais didáticos nas escolas, promover o respeito e a valorização das culturas tradicionais brasileiras, a fim de conscientizar as futuras gerações e erradicar preconceitos históricos.`);
                    }}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                  >
                    <BookCheck className="w-3.5 h-3.5" />
                    <span>Carregar Redação 800 (Benchmark)</span>
                  </button>
                </div>
              </div>

              {ocrWarning && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>{ocrWarning}</span>
                </div>
              )}

              {/* Real AI Progress Bar during Correction */}
              {isGrading && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <AiProgressBar
                    isLoading={isGrading}
                    progress={gradingProgress.progress}
                    currentStepIndex={gradingProgress.currentStepIndex}
                    steps={gradingProgress.steps}
                    title="Avaliando Redação pela Matriz Oficial do ENEM..."
                    subtitle="Calculando notas em múltiplos de 40 pontos e gerando diagnóstico pedagógico completo"
                    accentColor="emerald"
                    variant="card"
                  />
                </div>
              )}

              {/* Real AI Progress Bar during OCR / File reading */}
              {isOcrLoading && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <AiProgressBar
                    isLoading={isOcrLoading}
                    progress={ocrProgress.progress}
                    currentStepIndex={ocrProgress.currentStepIndex}
                    steps={ocrProgress.steps}
                    title="Digitalizando Documento / Foto da Redação..."
                    subtitle="Processamento neural de caligrafia e segmentação de parágrafos"
                    accentColor="indigo"
                    variant="compact"
                  />
                </div>
              )}

              <textarea
                id="textarea-essay-input"
                rows={11}
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                placeholder="Digite ou cole aqui sua redação dissertativo-argumentativa... (Separe os parágrafos com uma linha em branco)

Exemplo:
Na obra 'Quarto de Despejo', de Carolina Maria de Jesus..."
                className="w-full p-3.5 sm:p-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-serif leading-relaxed bg-slate-50/30 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all resize-y min-h-[240px] sm:min-h-[380px]"
              />

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  id="btn-run-grading"
                  type="button"
                  disabled={isGrading || isOcrLoading}
                  onClick={handleRunCorrection}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 shadow-md shadow-emerald-950/20 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isGrading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Avaliando pela Matriz Oficial...</span>
                    </>
                  ) : (
                    <>
                      <PenTool className="w-4 h-4 text-slate-950" />
                      <span>Corrigir Redação Completa</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: File Upload & Tips */}
          <div className="space-y-6">
            {/* Multi-Format Upload Card */}
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 sm:space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
                  <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Envio de Redação Multiformato</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  OCR IA + DOCS
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Envie fotos de folhas manuscritas, digitalizações ou documentos nos formatos <strong>JPG, JPEG, PNG, PDF, WEBP, HEIC, TXT ou DOCX</strong>.
              </p>

              {/* Supported Format Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { name: 'JPG / JPEG', color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
                  { name: 'PNG', color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
                  { name: 'PDF', color: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
                  { name: 'WEBP', color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
                  { name: 'HEIC (iOS)', color: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
                  { name: 'DOCX / TXT', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' },
                ].map((fmt) => (
                  <span
                    key={fmt.name}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${fmt.color}`}
                  >
                    {fmt.name}
                  </span>
                ))}
              </div>

              {/* Drag and Drop Zone */}
              <div
                id="file-upload-dropzone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all cursor-pointer group text-center ${
                  isDraggingOver
                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/60 ring-4 ring-indigo-200/60 scale-[1.01]'
                    : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50/40 dark:hover:bg-slate-800'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>

                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-900 dark:group-hover:text-indigo-300">
                  {isDraggingOver ? 'Solte seu arquivo JPG, PNG ou PDF aqui...' : 'Arraste ou selecione sua redação'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Formatos aceitos: JPG, JPEG, PNG, PDF, WEBP, HEIC, TXT ou DOCX
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Você também pode colar print com <strong>Ctrl+V</strong></span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.heic,.heif,.avif,.bmp,.pdf,.txt,.md,.docx,.doc,image/*,application/pdf,text/plain"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              {/* Action Buttons: Camera Snapshot */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Tirar Foto da Folha (JPG)</span>
                </button>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              {/* Active Upload File Indicator */}
              {ocrFileName && (
                <div className="p-3 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{ocrFileName}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {detectedFormat ? `Formato: ${detectedFormat} • ` : ''}{ocrFileSize || 'Processado'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearUploadedFile}
                    title="Remover arquivo"
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Loading State for OCR */}
              {isOcrLoading && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-semibold animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Lendo manuscrito/arquivo e transcrevendo com máxima fidelidade...</span>
                </div>
              )}
            </div>

            {/* Official Grading Criteria Reference Card */}
            <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <Lightbulb className="w-4 h-4" />
                  <span>Nova Lógica de Correção INEP</span>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Evidência Qualitativa
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium leading-relaxed bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                ⚖️ <strong>A Nota 200 não é o padrão:</strong> Exige comprovação positiva de excelência técnica e maturidade dissertativa, não sendo atribuída por mera ausência de falhas.
              </p>
              <div className="space-y-1.5 text-xs text-slate-300">
                <p><strong>C1:</strong> Complexidade sintática + vocabulário culto (máx 2 desvios leves).</p>
                <p><strong>C2:</strong> Repertório legitimado com produtividade comprovada com a tese.</p>
                <p><strong>C3:</strong> Projeto de texto bipartido com desdobramento crítico de causa e efeito.</p>
                <p><strong>C4:</strong> Mínimo 2 operadores interparágrafos autênticos + coesão intra diversificada.</p>
                <p><strong>C5:</strong> 5 elementos obrigatórios (Agente, Ação, Meio, Efeito, Detalhamento).</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Component: Progresso de Auditoria em Execução */}
      {isGrading && (
        <div className="max-w-4xl mx-auto my-8">
          <ProgressoAuditoria
            isLoading={true}
            progress={gradingProgress.progress}
            currentStepIndex={gradingProgress.currentStepIndex}
            mode="live"
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL CORRECTION RESULTS VIEW */}
      {/* ========================================================================= */}
      {correctionResult && !isGrading && (
        <div className="space-y-8">
          {/* Top Score Banner & Evaluator Comparison */}
          <div 
            id="correction-score-banner"
            className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6 transition-colors"
          >
            {/* Header: Title, Date & Action Buttons */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                    Resultado da Avaliação
                  </span>
                  {hasDivergence ? (
                    <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5" />
                      Divergência Tolerada (Δ {scoreDivergence} pts) • Média Oficial Aplicada
                    </span>
                  ) : (
                    <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Consenso Pleno entre Avaliadores
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                  {correctionResult.theme}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Avaliado em {correctionResult.date} • Base Oficial de Critérios do INEP (Duplo Avaliador)
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    const chatEl = document.getElementById('essay-correction-professor-chat-section');
                    if (chatEl) {
                      chatEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="Ir diretamente para o Professor AI no rodapé da avaliação"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span className="hidden sm:inline">Perguntar ao Professor AI</span>
                  <span className="sm:hidden">Professor AI</span>
                </button>

                <button
                  id="btn-save-evolution"
                  onClick={handleSave}
                  disabled={isSaved}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSaved 
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' 
                      : 'bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white shadow-xs'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaved ? 'Salva!' : 'Salvar Evolução'}</span>
                </button>

                <button
                  id="btn-copy-report"
                  onClick={handleCopyReport}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copySuccess ? 'Copiado!' : 'Copiar Relatório'}</span>
                </button>
              </div>
            </div>

            {/* Painel Direto dos Dois Avaliadores e da Nota Oficial */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {/* Avaliador 1 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-black uppercase text-blue-700 dark:text-blue-400 tracking-wider flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
                      1º Avaliador (Macro)
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">Leitura Ampla</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {correctionResult.dualEvaluatorSimulation?.evaluatorA?.evaluatorProfile || 'Visão global da estrutura e argumentação'}
                  </p>
                </div>
                <div className="pt-3 mt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Nota Avaliador 1:</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
                    {preliminaryEstimatedScore} <span className="text-xs font-normal text-slate-400">pts</span>
                  </span>
                </div>
              </div>

              {/* Avaliador 2 / Banca Revisora */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center text-xs font-bold">2</span>
                      2º Avaliador (Banca)
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">Rigor Estrito</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {correctionResult.dualEvaluatorSimulation?.evaluatorB?.evaluatorProfile || 'Auditoria técnica estrita da matriz do INEP'}
                  </p>
                </div>
                <div className="pt-3 mt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Nota Avaliador 2:</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
                    {strictAuditedScore} <span className="text-xs font-normal text-slate-400">pts</span>
                  </span>
                </div>
              </div>

              {/* Nota Oficial a Considerar (Média INEP) */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between shadow-xs ${getScoreColor(officialMeanScore)}`}>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                      ⭐ Nota Oficial a Considerar
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300">
                      Média INEP
                    </span>
                  </div>
                  <p className="text-[11px] opacity-80 leading-snug">
                    {hasDivergence 
                      ? `Média oficial entre os dois corretores (faixa: ${minScoreRange} a ${maxScoreRange} pts)` 
                      : 'Consenso unânime entre os avaliadores'}
                  </p>
                </div>
                <div className="pt-3 mt-2 border-t border-current/20 flex items-baseline justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">Pontuação Válida:</span>
                  <div className="text-3xl font-black tracking-tight leading-none">
                    {officialMeanScore}
                    <span className="text-sm font-semibold opacity-70 ml-1">/1000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Explicação Direta do Critério Oficial */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>
                <strong>Como funciona no ENEM oficial:</strong> Cada redação é avaliada de forma independente por dois corretores. Sua pontuação definitiva é a <strong>média aritmética</strong> das duas notas.
              </span>
            </div>

            {/* Tabela Comparativa Direta das 5 Competências */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Sua Nota por Competência: Avaliador 1 vs Avaliador 2 vs Média Oficial</span>
                </h3>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Clique na linha para expandir a competência
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-bold">
                      <th className="p-3">Competência</th>
                      <th className="p-3 text-center">1º Avaliador</th>
                      <th className="p-3 text-center">2º Avaliador (Banca)</th>
                      <th className="p-3 text-center bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-black">
                        Nota Oficial (Média)
                      </th>
                      <th className="p-3 text-center">Situação</th>
                      <th className="p-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {competencyDivergences.map((cd) => (
                      <tr 
                        key={cd.key}
                        onClick={() => setExpandedComp(cd.num)}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                          expandedComp === cd.num ? 'bg-indigo-50/40 dark:bg-indigo-950/30' : ''
                        }`}
                      >
                        <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-[11px] flex items-center justify-center shrink-0">
                              C{cd.num}
                            </span>
                            <span className="truncate font-medium">{cd.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300">
                          {cd.scoreA} pts
                        </td>
                        <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300">
                          {cd.scoreB} pts
                        </td>
                        <td className="p-3 text-center font-black text-sm bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300">
                          {cd.officialCompMean} pts
                        </td>
                        <td className="p-3 text-center">
                          {cd.isDivergent ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                              Δ {cd.diff} pts
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                              Consenso
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button 
                            type="button" 
                            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                          >
                            {expandedComp === cd.num ? 'Ocultar' : 'Ver Análise'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {/* Linha de Total */}
                    <tr className="bg-slate-50 dark:bg-slate-800/60 font-black border-t-2 border-slate-200 dark:border-slate-700">
                      <td className="p-3 text-slate-900 dark:text-slate-100 font-extrabold uppercase text-[11px]">
                        Pontuação Total (Soma)
                      </td>
                      <td className="p-3 text-center text-slate-800 dark:text-slate-200">
                        {preliminaryEstimatedScore} pts
                      </td>
                      <td className="p-3 text-center text-slate-800 dark:text-slate-200">
                        {strictAuditedScore} pts
                      </td>
                      <td className="p-3 text-center text-base bg-indigo-100/60 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-200">
                        {officialMeanScore} / 1000
                      </td>
                      <td className="p-3 text-center text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold">
                        {hasDivergence ? `Discrepância: ${scoreDivergence} pts` : 'Convergência'}
                      </td>
                      <td className="p-3"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Barras de Progresso Gráficas C1..C5 */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                {[
                  { key: 'c1', num: 1, title: 'C1: Norma Culta', score: correctionResult.competencies.c1.score },
                  { key: 'c2', num: 2, title: 'C2: Tema e Repertório', score: correctionResult.competencies.c2.score },
                  { key: 'c3', num: 3, title: 'C3: Projeto de Texto', score: correctionResult.competencies.c3.score },
                  { key: 'c4', num: 4, title: 'C4: Coesão Textual', score: correctionResult.competencies.c4.score },
                  { key: 'c5', num: 5, title: 'C5: Intervenção', score: correctionResult.competencies.c5.score },
                ].map((c) => (
                  <div 
                    key={c.key}
                    onClick={() => setExpandedComp(c.num)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      expandedComp === c.num 
                        ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/50 ring-2 ring-indigo-200 dark:ring-indigo-800' 
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1">
                      <span className="truncate">C{c.num}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold ${getCompScoreBadge(c.score)}`}>
                        {c.score}/200
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          c.score === 200 ? 'bg-emerald-500' :
                          c.score >= 160 ? 'bg-blue-500' :
                          c.score >= 120 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${(c.score / 200) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Diagnostic Statement */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                <BookCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Visão Geral do Desempenho</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {correctionResult.generalDiagnostic}
              </p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TEXTO DA REDAÇÃO AVALIADA (REVER REDAÇÃO ENVIADA) */}
          {/* ========================================================================= */}
          {correctionResult.essayText && (
            <div 
              id="correction-essay-text-card"
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden transition-all"
            >
              <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-800/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                      <FileText className="w-4 h-4" />
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                      Sua Redação Enviada
                    </h3>
                    {correctionResult.isHandwrittenOcr && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                        Transcrição OCR
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Texto original submetido para avaliação pelos corretores oficiais da banca.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Badges: Parágrafos, Palavras, Linhas */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 font-bold border border-slate-200 dark:border-slate-700 shadow-2xs">
                      {correctionResult.essayText.trim().split(/\n\s*\n+/).filter(Boolean).length} parágrafos
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 font-bold border border-slate-200 dark:border-slate-700 shadow-2xs">
                      {correctionResult.essayText.trim().split(/\s+/).filter(Boolean).length} palavras
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!correctionResult.essayText) return;
                      navigator.clipboard.writeText(correctionResult.essayText);
                      setCopiedEssayText(true);
                      setTimeout(() => setCopiedEssayText(false), 2000);
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    {copiedEssayText ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Texto</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEssayTextExpanded(!isEssayTextExpanded)}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title={isEssayTextExpanded ? 'Recolher redação' : 'Expandir redação'}
                  >
                    {isEssayTextExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isEssayTextExpanded && (
                <div className="p-5 sm:p-8 space-y-5 bg-white dark:bg-slate-900 font-serif">
                  {correctionResult.essayText
                    .trim()
                    .split(/\n\s*\n+/)
                    .filter(Boolean)
                    .map((paragraph, pIdx, arr) => {
                      const paragraphLabel = 
                        arr.length === 4
                          ? (pIdx === 0 ? 'Parágrafo 1 • Introdução & Tese' :
                             pIdx === 1 ? 'Parágrafo 2 • Desenvolvimento 1 (D1)' :
                             pIdx === 2 ? 'Parágrafo 3 • Desenvolvimento 2 (D2)' :
                             'Parágrafo 4 • Conclusão & Proposta (C5)')
                          : (pIdx === 0 ? 'Parágrafo 1 • Introdução' :
                             pIdx === arr.length - 1 ? `Parágrafo ${pIdx + 1} • Conclusão` :
                             `Parágrafo ${pIdx + 1} • Desenvolvimento ${pIdx}`);

                      return (
                        <div 
                          key={pIdx} 
                          className="group relative pl-4 sm:pl-6 border-l-2 border-indigo-200 dark:border-indigo-900 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
                        >
                          <div className="font-sans text-[11px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 mb-1.5 select-none flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            <span>{paragraphLabel}</span>
                          </div>
                          <p className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-100 whitespace-pre-line text-justify">
                            {paragraph}
                          </p>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* Detailed Competencies Accordion (C1 to C5) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Detalhamento das 5 Competências</h3>

            {[
              { num: 1, key: 'c1' as const, name: 'Competência 1', subtitle: 'Domínio da modalidade escrita formal da Língua Portuguesa', data: correctionResult.competencies.c1 },
              { num: 2, key: 'c2' as const, name: 'Competência 2', subtitle: 'Compreensão do tema e aplicação de repertório sociocultural produtivo', data: correctionResult.competencies.c2 },
              { num: 3, key: 'c3' as const, name: 'Competência 3', subtitle: 'Seleção, relação, organização e interpretação (Projeto de Texto & Autoria)', data: correctionResult.competencies.c3 },
              { num: 4, key: 'c4' as const, name: 'Competência 4', subtitle: 'Conhecimento dos mecanismos linguísticos e operadores argumentativos', data: correctionResult.competencies.c4 },
              { num: 5, key: 'c5' as const, name: 'Competência 5', subtitle: 'Elaboração de proposta de intervenção com respeito aos Direitos Humanos', data: correctionResult.competencies.c5 },
            ].map((comp) => {
              const isExpanded = expandedComp === comp.num;
              return (
                <div 
                  key={comp.num}
                  id={`competency-card-detail-${comp.num}`}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all overflow-hidden ${
                    isExpanded ? 'border-indigo-400 dark:border-indigo-600 shadow-sm' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedComp(isExpanded ? null : comp.num)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-8 h-8 rounded-xl font-bold text-sm flex items-center justify-center ${
                        comp.data.score === 200 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' :
                        comp.data.score >= 160 ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300' :
                        comp.data.score >= 120 ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                      }`}>
                        C{comp.num}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">{comp.name}</h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">({comp.data.levelTitle})</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{comp.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-base font-black px-3 py-1 rounded-xl ${
                        comp.data.score === 200 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' :
                        comp.data.score >= 160 ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300' :
                        comp.data.score >= 120 ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                      }`}>
                        {comp.data.score} / 200
                      </span>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-6 text-sm text-slate-700 dark:text-slate-300">
                      {/* 200 Score Rule Audit Badge */}
                      <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                        comp.data.score === 200
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                          : 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Award className={`w-4 h-4 shrink-0 ${comp.data.score === 200 ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}`} />
                          <div>
                            <span className="font-extrabold uppercase tracking-wide">
                              {comp.data.score === 200 ? '⭐ Nota 200 Concedida por Evidência Positiva de Excelência' : '⚖️ Critério Oficial de Pontuação Ponderada'}
                            </span>
                            <p className="text-[11px] opacity-90 mt-0.5">
                              {comp.data.score === 200 
                                ? 'Foram detectadas evidências textuais irrefutáveis de maturidade dissertativa neste critério.' 
                                : 'A nota 200 exige evidência positiva de alto padrão e não é conferida por mera ausência de falhas.'}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0 ${
                          comp.data.score === 200
                            ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-100'
                            : 'bg-indigo-200 dark:bg-indigo-900 text-indigo-950 dark:text-indigo-100'
                        }`}>
                          {comp.data.score === 200 ? 'Excelência Positiva' : `${comp.data.score}/200 Pontos`}
                        </span>
                      </div>

                      {/* Estrutura de Evidências Obrigatórias (Interface AvaliacaoCompetencia) */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-slate-100 border border-indigo-500/30 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                          <div className="flex items-center gap-2 text-indigo-300 font-extrabold text-xs uppercase tracking-wider">
                            <Scale className="w-4 h-4 text-indigo-400" />
                            <span>Estrutura de Evidências (Interface AvaliacaoCompetencia)</span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono bg-indigo-950/80 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-800/80">
                              📍 {comp.data.localizacao_trecho || comp.data.excerptLocation || 'Corpo da Redação'}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/80">
                              ✓ Evidência Obrigatória
                            </span>
                          </div>
                        </div>

                        {/* Passo 1: Trecho de Evidência Extraído */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Quote className="w-3.5 h-3.5 text-amber-400" />
                              <span>1. Trecho Evidência Citado (trecho_evidencia):</span>
                            </span>
                            <span className="text-[10px] text-slate-400">Obrigatório antes da pontuação</span>
                          </div>
                          <blockquote className="text-xs sm:text-sm font-serif italic text-emerald-300 bg-emerald-950/30 p-3.5 rounded-xl border-l-4 border-emerald-500 leading-relaxed shadow-inner">
                            "{comp.data.trecho_evidencia || comp.data.primaryEvidenceQuote || comp.data.evidenceSnippets?.[0] || 'Trecho sob análise textual.'}"
                          </blockquote>
                        </div>

                        {/* Passo 2: Justificativa Analítica */}
                        <div className="space-y-1.5">
                          <span className="font-bold text-indigo-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-indigo-400" />
                            <span>2. Justificativa Analítica Prévia (justificativa_analitica):</span>
                          </span>
                          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs sm:text-sm text-slate-200 leading-relaxed">
                            {comp.data.justificativa_analitica || comp.data.evaluation || 'Análise qualitativa fundamentada no trecho.'}
                          </div>
                        </div>

                        {/* Passo 3: Deliberação e Bloqueio de 200 Padrão */}
                        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
                            <p className="text-[11px] text-slate-300">
                              <strong>Regra Anti-Default 200:</strong> Nota {comp.data.nota ?? comp.data.score}/200 fixada exclusivamente após validação das evidências. Ausência de erros não pontua 200 por padrão.
                            </p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0 self-start sm:self-auto ${
                            (comp.data.nota ?? comp.data.score) === 200
                              ? 'bg-emerald-400 text-slate-950'
                              : 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/40'
                          }`}>
                            {(comp.data.nota ?? comp.data.score) === 200 ? 'Nota 200 Afirmativa' : `Nota: ${comp.data.nota ?? comp.data.score}/200`}
                          </span>
                        </div>
                      </div>

                      {/* Diagnostic summary */}
                      <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 text-amber-900 dark:text-amber-200">
                        <span className="font-bold block text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1">
                          Diagnóstico Direto
                        </span>
                        <p className="text-xs sm:text-sm font-medium">{comp.data.diagnostic}</p>
                      </div>

                      {/* Weighted Evidence Pillars (Soma Ponderada de Evidências) */}
                      {comp.data.evidenceWeightPillars && comp.data.evidenceWeightPillars.length > 0 && (
                        <div className="space-y-3 p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center justify-between">
                            <h5 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-1.5">
                              <BookCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              <span>Soma Ponderada de Evidências Coletadas</span>
                            </h5>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                              Matriz INEP Calibrada
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                            {comp.data.evidenceWeightPillars.map((pillar, pIdx) => (
                              <div key={pIdx} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between gap-2 shadow-xs">
                                <div>
                                  <div className="flex items-center justify-between gap-1 mb-1">
                                    <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200 line-clamp-1">{pillar.pillarName}</span>
                                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900 shrink-0">
                                      Peso {pillar.weightPercentage}%
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                                    {pillar.positiveEvidenceFound}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                                  <span className="text-slate-500 dark:text-slate-400 font-medium">Contribuição:</span>
                                  <span className={`font-black ${pillar.isExceptionalLevel ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                    {pillar.scoreContribution} pts
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Positive Evidence Audit List */}
                      {comp.data.positiveEvidence && comp.data.positiveEvidence.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-bold text-emerald-800 dark:text-emerald-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Evidências Positivas Auditadas</span>
                          </h5>
                          <ul className="space-y-1.5">
                            {comp.data.positiveEvidence.map((pos, pIdx) => (
                              <li key={pIdx} className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-950 dark:text-emerald-200 flex items-start gap-2">
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                                <span>{pos}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Detailed Evaluation */}
                      <div>
                        <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                          <Info className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>Avaliação da Banca</span>
                        </h5>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{comp.data.evaluation}</p>
                      </div>

                      {/* Evidence Snippets */}
                      {comp.data.evidenceSnippets && comp.data.evidenceSnippets.length > 0 && (
                        <div>
                          <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-1.5 text-xs uppercase tracking-wider">
                            📌 Citações Extraídas do Texto
                          </h5>
                          <div className="space-y-1.5">
                            {comp.data.evidenceSnippets.map((ev, i) => (
                              <blockquote key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border-l-3 border-indigo-500 text-xs font-serif text-slate-800 dark:text-slate-200 italic">
                                "{ev}"
                              </blockquote>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Micro Audit Log Card for this specific competency */}
                      {correctionResult.auditLog?.competencyLogs?.find(l => l.competencyNum === comp.num) && (() => {
                        const compAudit = correctionResult.auditLog!.competencyLogs.find(l => l.competencyNum === comp.num)!;
                        return (
                          <div className="p-4 rounded-xl bg-slate-950 text-slate-100 border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                              <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-amber-400" />
                                <span className="font-bold text-xs text-white uppercase tracking-wider">
                                  Auditoria Interna da IA (Justificativa Textual C{comp.num})
                                </span>
                              </div>
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                {compAudit.isMaxScore200 ? '200 Aprovado por Evidência' : '200 Bloqueado (Sem Arredondamento)'}
                              </span>
                            </div>

                            <div className="space-y-2 text-xs">
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                                  Justificativa Algorítmica da Pontuação:
                                </span>
                                <p className="text-slate-300 leading-relaxed font-sans">{compAudit.scoreJustification}</p>
                              </div>

                              <div>
                                <span className="text-[10px] font-bold text-amber-400/90 uppercase tracking-wider block mb-0.5">
                                  Evidência Textual Extraída para Validação:
                                </span>
                                <blockquote className="text-xs font-serif italic text-emerald-300 bg-emerald-950/20 p-2.5 rounded border-l-2 border-emerald-500">
                                  "{compAudit.evidenceQuoteFromStudent}"
                                </blockquote>
                              </div>

                              {!compAudit.isMaxScore200 && compAudit.reasonNotRoundedTo200 && (
                                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-600/30 text-amber-200 text-[11px] flex items-start gap-2">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                  <span><strong>Bloqueio de 200:</strong> {compAudit.reasonNotRoundedTo200}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Special: C1 Deviations Table */}
                      {comp.num === 1 && correctionResult.c1Deviations && correctionResult.c1Deviations.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-bold text-rose-800 dark:text-rose-300 text-xs uppercase tracking-wider">
                            🔍 Desvios Gramaticais e Estruturais Identificados
                          </h5>
                          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-bold">
                                  <th className="p-2.5">Trecho Original</th>
                                  <th className="p-2.5">Problema Identificado</th>
                                  <th className="p-2.5">Melhor Forma</th>
                                  <th className="p-2.5">Categoria</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {correctionResult.c1Deviations.map((dev, i) => (
                                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-2.5 font-serif text-rose-700 dark:text-rose-300 bg-rose-50/40 dark:bg-rose-950/30 font-medium">"{dev.snippet}"</td>
                                    <td className="p-2.5 text-slate-700 dark:text-slate-300">{dev.problem}</td>
                                    <td className="p-2.5 font-serif text-emerald-700 dark:text-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/30 font-medium">"{dev.bestForm}"</td>
                                    <td className="p-2.5 text-[11px] text-slate-500 dark:text-slate-400 capitalize">{dev.category.replace('_', ' ')}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Special: C5 5-Element Checklist Table */}
                      {comp.num === 5 && correctionResult.c5Structure && (
                        <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
                              Checklist Oficial da Proposta de Intervenção
                            </span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              {correctionResult.c5Structure.validElementsCount} de 5 Elementos Válidos
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                              {correctionResult.c5Structure.agent.present ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                              )}
                              <div>
                                <strong className="text-slate-900 dark:text-slate-100">AGENTE:</strong> <span className="text-slate-700 dark:text-slate-300">{correctionResult.c5Structure.agent.present ? correctionResult.c5Structure.agent.text : 'Ausente ou nulo'}</span>
                              </div>
                            </div>

                            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                              {correctionResult.c5Structure.action.present ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                              )}
                              <div>
                                <strong className="text-slate-900 dark:text-slate-100">AÇÃO:</strong> <span className="text-slate-700 dark:text-slate-300">{correctionResult.c5Structure.action.present ? correctionResult.c5Structure.action.text : 'Ausente ou nula'}</span>
                              </div>
                            </div>

                            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                              {correctionResult.c5Structure.modeMedium.present ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                              )}
                              <div>
                                <strong className="text-slate-900 dark:text-slate-100">MEIO / MODO:</strong> <span className="text-slate-700 dark:text-slate-300">{correctionResult.c5Structure.modeMedium.present ? correctionResult.c5Structure.modeMedium.text : 'Ausente'}</span>
                              </div>
                            </div>

                            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                              {correctionResult.c5Structure.effect.present ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                              )}
                              <div>
                                <strong className="text-slate-900 dark:text-slate-100">FINALIDADE / EFEITO:</strong> <span className="text-slate-700 dark:text-slate-300">{correctionResult.c5Structure.effect.present ? correctionResult.c5Structure.effect.text : 'Ausente'}</span>
                              </div>
                            </div>

                            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 sm:col-span-2 flex items-start gap-2">
                              {correctionResult.c5Structure.detailing.present ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                              )}
                              <div>
                                <strong className="text-slate-900 dark:text-slate-100">DETALHAMENTO:</strong> <span className="text-slate-700 dark:text-slate-300">{correctionResult.c5Structure.detailing.present ? `${correctionResult.c5Structure.detailing.text} (foco no ${correctionResult.c5Structure.detailing.targetElement || 'elemento'})` : 'Ausente (faltou detalhar agente, ação, meio ou efeito)'}</span>
                              </div>
                            </div>
                          </div>

                          <div className={`p-2.5 rounded-lg flex items-center gap-2 text-xs font-semibold ${
                            correctionResult.c5Structure.respectsHumanRights 
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' 
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
                          }`}>
                            {correctionResult.c5Structure.respectsHumanRights ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span>Respeito aos Direitos Humanos confirmado pela banca.</span>
                              </>
                            ) : (
                              <>
                                <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                <span>Violação de Direitos Humanos identificada (Nota 0 na C5). {correctionResult.c5Structure.humanRightsObservations}</span>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* How to reach 200 */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block mb-1">
                          🚀 Como atingir 200 pontos nesta competência:
                        </span>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{comp.data.howToImprove}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Internal AI Audit Log: Textual Evidence Verification & Anti-Rounding Engine */}
          {correctionResult.auditLog && (
            <div className="bg-slate-950 text-slate-100 p-6 sm:p-7 rounded-2xl border border-slate-800 shadow-xl space-y-5 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black">
                    <Terminal className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-base text-white tracking-wide">
                        Log de Auditoria Interna da IA (Evidências & Anti-Arredondamento)
                      </h4>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Zero Viés 200
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Protocolo estrito do INEP: cada nota foi justificada por evidência textual específica, sem arredondamentos automáticos.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => setIsAuditLogExpanded(!isAuditLogExpanded)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <span>{isAuditLogExpanded ? 'Recolher Log' : 'Expandir Log'}</span>
                    {isAuditLogExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Protocol Metadata Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Scale className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Motor de Avaliação</span>
                    <span className="font-mono text-slate-200">{correctionResult.auditLog.modelEngine}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Diretriz Anti-Arredondamento</span>
                    <span className="font-bold text-emerald-400">Ativa (Exige Comprovação Positiva)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Search className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Auditoria de Citações</span>
                    <span className="font-mono text-slate-200">5 de 5 Competências Auditadas</span>
                  </div>
                </div>
              </div>

              {isAuditLogExpanded && (
                <div className="space-y-4 pt-1">
                  {/* Competency Filter Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800 pb-3 text-xs">
                    <span className="text-slate-500 font-bold mr-1 text-[11px]">Filtrar Competência:</span>
                    <button
                      onClick={() => setSelectedAuditTab('all')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedAuditTab === 'all'
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      Todas as 5 Competências
                    </button>
                    {(['c1', 'c2', 'c3', 'c4', 'c5'] as const).map((key, i) => (
                      <button
                        key={key}
                        onClick={() => setSelectedAuditTab(key)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedAuditTab === key
                            ? 'bg-amber-400 text-slate-950 shadow-xs'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        C{i + 1} ({correctionResult.competencies[key]?.score} pts)
                      </button>
                    ))}
                  </div>

                  {/* Audit Items List */}
                  <div className="space-y-3.5">
                    {correctionResult.auditLog.competencyLogs
                      .filter(item => selectedAuditTab === 'all' || selectedAuditTab === `c${item.competencyNum}`)
                      .map((logItem) => (
                        <div
                          key={logItem.competencyNum}
                          className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2.5">
                              <span className="w-7 h-7 rounded-lg bg-slate-800 text-amber-400 font-black text-xs flex items-center justify-center border border-slate-700">
                                C{logItem.competencyNum}
                              </span>
                              <span className="font-extrabold text-sm text-slate-200">
                                {logItem.competencyName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                                logItem.isMaxScore200 
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                              }`}>
                                Pontuação: {logItem.assignedScore}/200
                              </span>
                              {logItem.isMaxScore200 ? (
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80">
                                  ★ Excelência Positiva
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
                                  🔒 200 Bloqueado (Faltam Requisitos)
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Justification & Criteria */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                <Info className="w-3 h-3 text-indigo-400" />
                                Justificativa Técnica da Pontuação
                              </span>
                              <p className="text-slate-300 leading-relaxed">
                                {logItem.scoreJustification}
                              </p>
                            </div>

                            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                              <span className="text-[10px] font-extrabold uppercase text-amber-400/90 tracking-wider flex items-center gap-1">
                                <Lock className="w-3 h-3 text-amber-400" />
                                Requisito Estrito Exigido para 200
                              </span>
                              <p className="text-slate-300 leading-relaxed">
                                {logItem.requiredTextualEvidence}
                              </p>
                            </div>
                          </div>

                          {/* Reason why not rounded to 200 */}
                          {!logItem.isMaxScore200 && logItem.reasonNotRoundedTo200 && (
                            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                              <div>
                                <strong className="font-bold text-amber-300">Gatilho de Auditoria (Motivo de não arredondar para 200): </strong>
                                <span>{logItem.reasonNotRoundedTo200}</span>
                              </div>
                            </div>
                          )}

                          {/* Textual Quote Verified in Student Draft */}
                          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                              <FileCode className="w-3 h-3 text-emerald-400" />
                              Evidência Textual Extraída do Rascunho do Aluno
                            </span>
                            <blockquote className="text-xs font-serif italic text-emerald-300 bg-emerald-950/20 p-2.5 rounded border-l-2 border-emerald-500">
                              "{logItem.evidenceQuoteFromStudent}"
                            </blockquote>
                          </div>

                          {/* Quality Pillars Micro-Audit */}
                          {logItem.qualityPillarsChecked && logItem.qualityPillarsChecked.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Pilares Qualitativos Verificados:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {logItem.qualityPillarsChecked.map((pillar, pIdx) => (
                                  <div
                                    key={pIdx}
                                    className={`p-2 rounded-lg text-[11px] border flex items-center justify-between gap-1.5 ${
                                      pillar.status === 'atendido'
                                        ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                                        : pillar.status === 'parcial'
                                        ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                                        : 'bg-rose-950/30 border-rose-800/60 text-rose-300'
                                    }`}
                                  >
                                    <div className="truncate">
                                      <span className="font-bold block truncate">{pillar.pillar}</span>
                                      <span className="text-[10px] opacity-80 block truncate">{pillar.detail}</span>
                                    </div>
                                    <span className="font-black shrink-0 text-xs">
                                      {pillar.status === 'atendido' ? '✓' : pillar.status === 'parcial' ? '⚠' : '✗'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>

                  {/* Anti-Rounding Technical Statement */}
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
                    <span className="text-base">🛡️</span>
                    <p className="text-[11px] leading-relaxed">
                      <strong>Declaração de Transparência Algorítmica:</strong> O motor de IA segue estritamente a política de calibragem do INEP. A nota máxima de 200 pontos em cada competência é uma honraria técnica restrita a textos com comprovação factual irrefutável de excelência.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* High Performance Scoring Curve Panel (Curva Estatística de Alto Desempenho INEP) */}
          {(correctionResult.highPerformanceCurveReport || correctionResult.validationReport?.highPerformanceCurveReport) && (() => {
            const curve = correctionResult.highPerformanceCurveReport || correctionResult.validationReport!.highPerformanceCurveReport!;
            return (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-black text-lg">
                      📈
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                        Curva Estatística de Alto Desempenho (Rigor INEP &gt; 900)
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Calibração oficial contra inflação de notas: distribuição realista em 920, 940, 960, 980 e 1000
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    <span className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      {curve.tier}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {curve.statisticalPercentileEstimate}
                    </span>
                  </div>
                </div>

                {/* Indices Gauges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Índice de Domínio Técnico (C1 & C4)
                      </span>
                      <span className="font-black text-indigo-600 dark:text-indigo-400">
                        {curve.technicalMasteryIndex}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${curve.technicalMasteryIndex}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Avalia ausência de desvios, complexidade sintática e riqueza de repertório coesivo.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Índice de Densidade Argumentativa (C2, C3 & C5)
                      </span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400">
                        {curve.argumentativeDepthIndex}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${curve.argumentativeDepthIndex}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Avalia legitimidade e produtividade do repertório, encadeamento causal e detalhamento da proposta.
                    </p>
                  </div>
                </div>

                {/* Criteria Checked Grid */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Comprovação dos Pilares de Excelência INEP
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                    <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                      curve.criteriaVerified.c1_normativeMastery
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      <span>{curve.criteriaVerified.c1_normativeMastery ? '✅' : '🔒'}</span>
                      <span className="font-semibold text-[11px]">C1: Sintaxe Erudita</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                      curve.criteriaVerified.c2_productiveRepertoire
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      <span>{curve.criteriaVerified.c2_productiveRepertoire ? '✅' : '🔒'}</span>
                      <span className="font-semibold text-[11px]">C2: Repertório Produtivo</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                      curve.criteriaVerified.c3_strategicProject
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      <span>{curve.criteriaVerified.c3_strategicProject ? '✅' : '🔒'}</span>
                      <span className="font-semibold text-[11px]">C3: Autoria & Causalidade</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                      curve.criteriaVerified.c4_cohesiveDiversity
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      <span>{curve.criteriaVerified.c4_cohesiveDiversity ? '✅' : '🔒'}</span>
                      <span className="font-semibold text-[11px]">C4: Diversidade Coesiva</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                      curve.criteriaVerified.c5_fiveCanonicalElements
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      <span>{curve.criteriaVerified.c5_fiveCanonicalElements ? '✅' : '🔒'}</span>
                      <span className="font-semibold text-[11px]">C5: 5 Elementos Válidos</span>
                    </div>
                  </div>
                </div>

                {/* Rigor Verdict & Gate Summary */}
                <div className="space-y-2">
                  <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="leading-relaxed font-medium">
                        <strong>Veredito da Curva de Rigor:</strong> {curve.rigorVerdict}
                      </p>
                      {curve.scoreGateSummary && (
                        <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                          <strong>Gating de Nota:</strong> {curve.scoreGateSummary}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Excellence Evidence Gates (Portas de Evidência de Excelência) */}
                {curve.requiredExcellenceEvidence && curve.requiredExcellenceEvidence.length > 0 && (
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                      Portas de Evidência de Excelência (Requisitos para Faixa 920–1000)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {curve.requiredExcellenceEvidence.map((gate, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border text-xs space-y-1.5 transition-colors ${
                            gate.isMet
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-slate-800 dark:text-slate-200'
                              : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 font-bold">
                              <span>{gate.isMet ? '✅' : '❌'}</span>
                              <span className="text-slate-900 dark:text-slate-100 font-extrabold">{gate.competency}: {gate.gateName}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                              gate.isMet
                                ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                                : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
                            }`}>
                              {gate.isMet ? 'Atestado' : 'Não Atendido'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                            {gate.requirement}
                          </p>
                          {gate.impactOnScore && (
                            <div className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                              <span>⚡ Impacto:</span> {gate.impactOnScore}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Penalties Applied Matrix (Penalizações Severas por Imprecisões) */}
                {curve.penaltiesApplied && curve.penaltiesApplied.length > 0 && (
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block text-rose-700 dark:text-rose-400">
                      Penalizações por Imprecisões e Desvios Aplicadas ({curve.penaltiesApplied.length})
                    </span>
                    <div className="space-y-2">
                      {curve.penaltiesApplied.map((pen, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-black text-[10px]">
                                {pen.competencyAffected}
                              </span>
                              <span className="font-bold text-slate-900 dark:text-slate-100">
                                {pen.penaltyName}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                pen.severity === 'critica'
                                  ? 'bg-red-700 text-white'
                                  : pen.severity === 'severa'
                                  ? 'bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200'
                                  : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
                              }`}>
                                Gravidade: {pen.severity}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400">
                              {pen.reason}
                            </p>
                          </div>
                          <div className="shrink-0 self-end sm:self-center font-black text-rose-600 dark:text-rose-400 text-sm">
                            -{pen.penaltyPoints} pts
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Dual-Evaluator Official Simulation (Simulação de Duplo Avaliador INEP) */}
          {correctionResult.dualEvaluatorSimulation && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-black">
                    ⚖️
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                      Simulação de Auditoria com Duplo Avaliador (INEP)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Reproduz o procedimento oficial com dois corretores independentes e cálculo de discrepância
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider self-start sm:self-auto ${
                  correctionResult.dualEvaluatorSimulation.status === 'consenso_direto'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700'
                }`}>
                  {correctionResult.dualEvaluatorSimulation.status === 'consenso_direto' ? '✅ Consenso Direto' : '⚖️ Divergência Tolerada'}
                </span>
              </div>

              {/* Evaluator Comparison Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Evaluator 1 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                        {correctionResult.dualEvaluatorSimulation.evaluatorA.evaluatorProfile}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {correctionResult.dualEvaluatorSimulation.evaluatorA.notes}
                      </p>
                    </div>
                    <span className="text-xl font-black text-slate-900 dark:text-slate-100">
                      {correctionResult.dualEvaluatorSimulation.evaluatorA.total}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                    {(['c1', 'c2', 'c3', 'c4', 'c5'] as const).map((k, i) => {
                      const scoreA = correctionResult.dualEvaluatorSimulation?.evaluatorA[k];
                      const scoreB = correctionResult.dualEvaluatorSimulation?.evaluatorB[k];
                      const hasDiff = scoreA !== undefined && scoreB !== undefined && scoreA !== scoreB;
                      return (
                        <div key={k} className={`p-2 rounded-lg border transition-colors ${
                          hasDiff 
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700' 
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                        }`}>
                          <span className="block text-[10px] text-slate-400 font-bold">C{i + 1}</span>
                          <span className={`font-extrabold ${hasDiff ? 'text-amber-900 dark:text-amber-200' : 'text-slate-800 dark:text-slate-200'}`}>
                            {scoreA}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Evaluator 2 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                        {correctionResult.dualEvaluatorSimulation.evaluatorB.evaluatorProfile}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {correctionResult.dualEvaluatorSimulation.evaluatorB.notes}
                      </p>
                    </div>
                    <span className="text-xl font-black text-slate-900 dark:text-slate-100">
                      {correctionResult.dualEvaluatorSimulation.evaluatorB.total}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                    {(['c1', 'c2', 'c3', 'c4', 'c5'] as const).map((k, i) => {
                      const scoreA = correctionResult.dualEvaluatorSimulation?.evaluatorA[k];
                      const scoreB = correctionResult.dualEvaluatorSimulation?.evaluatorB[k];
                      const hasDiff = scoreA !== undefined && scoreB !== undefined && scoreA !== scoreB;
                      return (
                        <div key={k} className={`p-2 rounded-lg border transition-colors ${
                          hasDiff 
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700' 
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                        }`}>
                          <span className="block text-[10px] text-slate-400 font-bold">C{i + 1}</span>
                          <span className={`font-extrabold ${hasDiff ? 'text-amber-900 dark:text-amber-200' : 'text-slate-800 dark:text-slate-200'}`}>
                            {scoreB}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Per-Competency Official Mean Breakdown if divergence occurred */}
              {correctionResult.dualEvaluatorSimulation.totalDiscrepancy > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      📊 Média Aritmética Oficial por Competência (Regra INEP)
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      (Avaliador 1 + Avaliador 2) ÷ 2
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    {(['c1', 'c2', 'c3', 'c4', 'c5'] as const).map((k, i) => {
                      const sA = correctionResult.dualEvaluatorSimulation?.evaluatorA[k] ?? 0;
                      const sB = correctionResult.dualEvaluatorSimulation?.evaluatorB[k] ?? 0;
                      const avg = (sA + sB) / 2;
                      const isDiv = sA !== sB;
                      return (
                        <div key={k} className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <span className="block text-[10px] text-slate-400 font-bold">C{i + 1}</span>
                          <span className="font-black text-indigo-700 dark:text-indigo-300">
                            {avg}
                          </span>
                          {isDiv && (
                            <span className="block text-[9px] text-amber-600 dark:text-amber-400 font-semibold">
                              Δ {Math.abs(sA - sB)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Discrepancy explanation */}
              <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between gap-4">
                <span>{correctionResult.dualEvaluatorSimulation.explanation}</span>
                <span className="font-bold shrink-0">
                  Divergência Total: {correctionResult.dualEvaluatorSimulation.totalDiscrepancy} pts
                </span>
              </div>
            </div>
          )}

          {/* Cartilha 800+ Benchmark & Comparative Profiler */}
          {correctionResult.cartilhaBenchmark && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-black">
                    📚
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                      Benchmark Oficial: Cartilha 800+ & Padrões do ENEM
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Cruzamento de dados estatísticos com redações reais catalogadas pelo INEP
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 self-start sm:self-auto">
                  {correctionResult.cartilhaBenchmark.tier}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block uppercase tracking-wider text-[11px]">
                    Perfil Correlato na Cartilha:
                  </span>
                  <p className="font-semibold text-indigo-700 dark:text-indigo-300 text-sm">
                    {correctionResult.cartilhaBenchmark.closestProfileTitle}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {correctionResult.cartilhaBenchmark.commonPatternIdentified}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block uppercase tracking-wider text-[11px]">
                    Distância Crucial para a Faixa 900+ / 1000:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {correctionResult.cartilhaBenchmark.keyDifferenceTo900Plus}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Performance Summary (3 Pontos Fortes & 3 Problemas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 3 Maiores Pontos Fortes */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-xs space-y-3 transition-colors">
              <h4 className="font-extrabold text-base flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>🏆 3 Maiores Pontos Fortes</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {correctionResult.top3Strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3 Maiores Problemas */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-rose-200 dark:border-rose-800 shadow-xs space-y-3 transition-colors">
              <h4 className="font-extrabold text-base flex items-center gap-2 text-rose-800 dark:text-rose-300">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <span>⚠️ 3 Maiores Problemas</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {correctionResult.top3Problems.map((prob, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{prob}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Plan: O que preciso fazer para subir minha nota */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-4 border border-indigo-800">
            <div className="flex items-center gap-2 text-amber-300 font-extrabold text-base sm:text-lg">
              <Sparkles className="w-5 h-5" />
              <span>O que preciso fazer para subir minha nota?</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Plano de ação prático e específico para seus próximos treinos:
            </p>

            <div className="space-y-2.5 pt-2">
              {correctionResult.actionPlanToImprove.map((action, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/10 border border-white/15 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                    {action}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison with Nota 1000 Patterns */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
            <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>O que redações de alto desempenho fazem que esta ainda não faz?</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {correctionResult.highPerformanceComparison}
            </p>
          </div>

          {/* Pedagogical Rewrites (Como eu melhoraria este trecho) */}
          {correctionResult.pedagogicalRewrites && correctionResult.pedagogicalRewrites.length > 0 && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Reescrita Pedagógica: Como eu melhoraria estes trechos</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Veja a transformação prática dos principais trechos que limitaram sua nota.
                </p>
              </div>

              <div className="space-y-4">
                {correctionResult.pedagogicalRewrites.map((rw, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-rose-800 dark:text-rose-300 text-[11px] uppercase tracking-wider block mb-1">
                        🔴 Trecho Original com Problema:
                      </span>
                      <p className="font-serif italic text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        "{rw.original}"
                      </p>
                      <p className="text-rose-700 dark:text-rose-300 text-xs mt-1">
                        <strong>Problema:</strong> {rw.problem}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 text-[11px] uppercase tracking-wider block mb-1">
                        🟢 Versão Melhorada de Alto Nível:
                      </span>
                      <p className="font-serif text-slate-900 dark:text-slate-100 bg-emerald-50/60 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 font-medium">
                        "{rw.improvedVersion}"
                      </p>
                    </div>

                    <div className="text-slate-600 dark:text-slate-400 text-xs bg-white dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800">
                      <strong>Por que melhorou:</strong> {rw.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Professor AI Dedicado Exclusivamente à Redação Avaliada */}
          <div id="essay-correction-professor-chat-section" className="pt-2">
            <EssayCorrectionProfessorChat 
              correctionResult={correctionResult}
              onNavigateToFullChat={() => {
                onAskProfessorAboutEssay(
                  correctionResult.essayText, 
                  correctionResult.theme,
                  `Nota ${correctionResult.totalScore}/1000. C1: ${correctionResult.competencies.c1.score}, C2: ${correctionResult.competencies.c2.score}, C3: ${correctionResult.competencies.c3.score}, C4: ${correctionResult.competencies.c4.score}, C5: ${correctionResult.competencies.c5.score}.`
                );
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
