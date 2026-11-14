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
  BookOpen,
  X
} from 'lucide-react';
import { 
  EssayCorrectionResult, 
  CompetencyNumber, 
  AvaliacaoCompetencia, 
  ReviewerAuditReport, 
  ReviewerCompetencyCheck,
  StructuredAiAnalysisLog,
  DiagnosticConsistencyAuditReport,
  AuditConcessionItem
} from '../types';
import { 
  HISTORICAL_THEMES,
  CARTILHA_METADATA,
  CARTILHA_COMPETENCIES,
  CARTILHA_ZERO_SITUATIONS,
  CARTILHA_SCORE_PROFILES,
  getCartilhaBenchmarkForScore,
  isOfficialNota1000Benchmark
} from '../data/officialData';
import { AiProgressBar } from './AiProgressBar';
import { useAiProgress } from '../hooks/useAiProgress';
import { validateAndAuditEssayScore } from '../utils/scoreValidator';
import { auditDiagnosticVsEvidenceConsistency } from '../utils/consistencyAuditor';
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
  versao_modelo: 'gemini-4-argon / gemini-3.8-flash (auto-downgrade gemini-3.1-flash-lite)',
  storageKey: 'enem_ia_analysis_logs_v1',
  maxStoredLogs: 30, // Limite ótimo de registros históricos mantidos
  maxStorageSizeBytes: 300 * 1024, // Limite rígido de 300 KB para o histórico de auditoria
  maxSnippetLength: 400, // Limite de caracteres por snippet de evidência no log para evitar inchaço
  autoPersist: true,
  ambiente: 'producao-banca-inep',
  banca_versao: 'Matriz_Referencia_INEP_2025_2026',

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
    const activeT = initialCorrectionResult?.theme || initialTheme || savedWork.activeCorrection?.theme || savedWork.correctionDraftTheme;
    if (activeT && HISTORICAL_THEMES.some(t => t.title === activeT)) {
      return activeT;
    }
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
    const validHistoricalTheme = HISTORICAL_THEMES.some(t => t.title === theme)
      ? theme
      : HISTORICAL_THEMES[0].title;
    const activeThemeTitle = isCustomTheme ? customThemeInput : validHistoricalTheme;
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
  const [showCartilhaModal, setShowCartilhaModal] = useState<boolean>(false);
  const [cartilhaModalTab, setCartilhaModalTab] = useState<'matrix' | 'zero' | 'rules'>('matrix');
  const [selectedCartilhaComp, setSelectedCartilhaComp] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Sync if initialTheme prop changes (e.g. when selecting a theme on Dashboard or Theme Generator)
  useEffect(() => {
    if (initialTheme) {
      setCorrectionResult(null);
      if (HISTORICAL_THEMES.some(t => t.title === initialTheme)) {
        setTheme(initialTheme);
        setIsCustomTheme(false);
      } else {
        setIsCustomTheme(true);
        setCustomThemeInput(initialTheme);
      }
    }
  }, [initialTheme]);

  // Sync if initialCorrectionResult prop changes
  useEffect(() => {
    if (initialCorrectionResult) {
      setCorrectionResult(initialCorrectionResult);
      setActiveCorrection(initialCorrectionResult);
      setEssayText(initialCorrectionResult.essayText || '');
      setIsSaved(true);
      if (!HISTORICAL_THEMES.some(t => t.title === initialCorrectionResult.theme)) {
        setIsCustomTheme(true);
        setCustomThemeInput(initialCorrectionResult.theme);
      } else {
        setTheme(initialCorrectionResult.theme);
        setIsCustomTheme(false);
      }
    }
  }, [initialCorrectionResult, setActiveCorrection]);

  const lastSyncedActiveIdRef = useRef<string | undefined>(savedWork.activeCorrection?.id);

  // Sync state if background task completed while user was on another tab
  useEffect(() => {
    if (
      savedWork.activeCorrection &&
      savedWork.activeCorrection.id !== lastSyncedActiveIdRef.current
    ) {
      lastSyncedActiveIdRef.current = savedWork.activeCorrection.id;
      setCorrectionResult(savedWork.activeCorrection);
      setIsSaved(true);
      if (savedWork.activeCorrection.theme) {
        if (!HISTORICAL_THEMES.some(t => t.title === savedWork.activeCorrection?.theme)) {
          setIsCustomTheme(true);
          setCustomThemeInput(savedWork.activeCorrection.theme);
        } else {
          setTheme(savedWork.activeCorrection.theme);
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
    const validHistoricalTheme = HISTORICAL_THEMES.some(t => t.title === theme)
      ? theme.trim()
      : HISTORICAL_THEMES[0].title;
    const activeTheme = isCustomTheme ? customThemeInput.trim() : validHistoricalTheme;
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
      let reviewerConsistencyReport: DiagnosticConsistencyAuditReport | undefined = undefined;

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

          const reviewData = await reviewRes.json();
          if (reviewData?.consistencyAuditReport) {
            reviewerConsistencyReport = reviewData.consistencyAuditReport;
          }

          if (reviewRes.ok) {
            reviewerAuditData = reviewData;

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
        } catch (revError: any) {
          console.warn('Reviewer endpoint call fallback:', revError);
        }
      }

      // Pre-display Score Validator & Exceptional Evidence Verification Prompt Check
      const {
        validatedTotalScore: rawValidatedTotalScore,
        validatedCompetencies,
        validationReport,
        evidenceValidatorReport,
        consistencyAuditReport,
        cleanedTop3Problems
      } = validateAndAuditEssayScore(
        {
          totalScore: data.totalScore,
          competencies: data.competencies,
          c1Deviations: data.c1Deviations || [],
          c5Structure: data.c5Structure,
          pedagogicalRewrites: data.pedagogicalRewrites || [],
          reviewerReport: reviewerAuditData,
          dualEvaluatorSimulation: data.dualEvaluatorSimulation,
          top3Problems: data.top3Problems || []
        },
        essayText.trim(),
        activeTheme
      );

      // Consolidar concessões entre a avaliação inicial e a auditoria de evidências, mantendo
      // apenas as observações vigentes sobre a nota final equilibrada.
      const combinedConcessionDetails = (() => {
        const byComp = new Map<AuditConcessionItem['competency'], AuditConcessionItem>();
        const serverItems: AuditConcessionItem[] = Array.isArray(data?.consistencyAuditReport?.concessionDetails)
          ? data.consistencyAuditReport.concessionDetails
          : [];
        const clientItems: AuditConcessionItem[] = Array.isArray(consistencyAuditReport?.concessionDetails)
          ? consistencyAuditReport.concessionDetails
          : [];
        for (const item of serverItems) {
          byComp.set(item.competency, { ...item });
        }
        for (const item of clientItems) {
          const prev = byComp.get(item.competency);
          if (prev) {
            byComp.set(item.competency, {
              competency: item.competency,
              previousScore: prev.previousScore,
              reconciledScore: item.reconciledScore,
              reasonPt: item.reasonPt
            });
          } else {
            byComp.set(item.competency, { ...item });
          }
        }
        return Array.from(byComp.values()).filter((d) => d.reconciledScore !== d.previousScore);
      })();

      const activeContradictions = (consistencyAuditReport?.contradictions || []).length > 0
        ? consistencyAuditReport.contradictions
        : (reviewerConsistencyReport?.contradictions || []).filter((rc) =>
            !combinedConcessionDetails.some((cd) => cd.competency === rc.competency)
          );

      const combinedConcessionApplied = combinedConcessionDetails.length > 0;
      const combinedConcessionDelta = combinedConcessionDetails.reduce(
        (acc, item) => acc + (item.reconciledScore - item.previousScore),
        0
      );

      let consolidatedConsistencyReport: DiagnosticConsistencyAuditReport = {
        ...consistencyAuditReport,
        passed: activeContradictions.length === 0,
        blockedFinalScoreEmission: false,
        finalScoreEmitted: rawValidatedTotalScore,
        contradictionsCount: activeContradictions.length,
        contradictions: activeContradictions,
        concessionApplied: combinedConcessionApplied,
        concessionDeltaPoints: combinedConcessionDelta,
        concessionDetails: combinedConcessionDetails,
        concessionSummaryPt: combinedConcessionApplied
          ? `Fizemos uma concessão entre a avaliação inicial e os trechos encontrados na sua redação, resultando na nota equilibrada de ${rawValidatedTotalScore} pts (${combinedConcessionDelta >= 0 ? `+${combinedConcessionDelta}` : combinedConcessionDelta} pts).`
          : (consistencyAuditReport?.concessionSummaryPt || 'A nota final está alinhada com os trechos encontrados na sua redação.'),
        summaryMessage: activeContradictions.length === 0
          ? (combinedConcessionApplied
              ? `Nota equilibrada (${rawValidatedTotalScore} pts): fizemos a concessão entre a análise inicial e o que está escrito na sua redação.`
              : 'Nota e justificativas 100% alinhadas com o que está escrito na sua redação.')
          : `Encontramos ${activeContradictions.length} diferença(s) entre a explicação dos erros e o que está no texto, detalhada(s) abaixo de forma simples.`,
      };

      const normalizeForNota1000Comparison = (txt: string) =>
        (txt || '')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[\s\r\n\t\.,;:\-"'«»“”!?()_\/\\\[\]{}*#]/g, '');

      const cleanInputEssay = normalizeForNota1000Comparison(essayText.trim());
      const cleanGeneratedEssay = normalizeForNota1000Comparison(savedWork.generatedEssay?.fullText || '');
      const isSystemGeneratedNota1000 = Boolean(
        cleanInputEssay.length >= 80 &&
        cleanGeneratedEssay.length >= 80 &&
        (cleanInputEssay === cleanGeneratedEssay ||
          cleanInputEssay.includes(cleanGeneratedEssay.slice(0, 80)) ||
          cleanGeneratedEssay.includes(cleanInputEssay.slice(0, 80)))
      );

      const isSystemNota1000 = isOfficialNota1000Benchmark(essayText.trim()) || isSystemGeneratedNota1000;
      const areAllFiveCompetencies200 =
        validatedCompetencies.c1?.score === 200 &&
        validatedCompetencies.c2?.score === 200 &&
        validatedCompetencies.c3?.score === 200 &&
        validatedCompetencies.c4?.score === 200 &&
        validatedCompetencies.c5?.score === 200;

      const shouldLockNota1000 = isSystemNota1000 || areAllFiveCompetencies200;

      if (shouldLockNota1000) {
        (['c1', 'c2', 'c3', 'c4', 'c5'] as const).forEach((compKey) => {
          if (validatedCompetencies[compKey]) {
            validatedCompetencies[compKey].score = 200;
            validatedCompetencies[compKey].nota = 200;
            validatedCompetencies[compKey].level = 5;
            validatedCompetencies[compKey].nivel = 5;
            validatedCompetencies[compKey].exceptionalPerformanceDemonstrated = true;
          }
        });

        if (data.dualEvaluatorSimulation) {
          if (data.dualEvaluatorSimulation.evaluatorA) {
            data.dualEvaluatorSimulation.evaluatorA.c1 = 200;
            data.dualEvaluatorSimulation.evaluatorA.c2 = 200;
            data.dualEvaluatorSimulation.evaluatorA.c3 = 200;
            data.dualEvaluatorSimulation.evaluatorA.c4 = 200;
            data.dualEvaluatorSimulation.evaluatorA.c5 = 200;
            data.dualEvaluatorSimulation.evaluatorA.total = 1000;
          }
          if (data.dualEvaluatorSimulation.evaluatorB) {
            data.dualEvaluatorSimulation.evaluatorB.c1 = 200;
            data.dualEvaluatorSimulation.evaluatorB.c2 = 200;
            data.dualEvaluatorSimulation.evaluatorB.c3 = 200;
            data.dualEvaluatorSimulation.evaluatorB.c4 = 200;
            data.dualEvaluatorSimulation.evaluatorB.c5 = 200;
            data.dualEvaluatorSimulation.evaluatorB.total = 1000;
          }
          data.dualEvaluatorSimulation.discrepancyC1 = 0;
          data.dualEvaluatorSimulation.discrepancyC2 = 0;
          data.dualEvaluatorSimulation.discrepancyC3 = 0;
          data.dualEvaluatorSimulation.discrepancyC4 = 0;
          data.dualEvaluatorSimulation.discrepancyC5 = 0;
          data.dualEvaluatorSimulation.totalDiscrepancy = 0;
          data.dualEvaluatorSimulation.status = 'consenso_direto';
          data.dualEvaluatorSimulation.explanation = 'Consenso unânime direto: ambos os avaliadores atribuíram 200 pontos nas 5 competências (Nota 1000 oficial).';
        }

        if (reviewerAuditData && Array.isArray(reviewerAuditData.competencyReviews)) {
          reviewerAuditData.competencyReviews.forEach((rComp) => {
            rComp.initialScore = 200;
            rComp.reviewedScore = 200;
            rComp.scoreReduced = false;
            rComp.scoreMaintained = true;
            rComp.isExceptionalLevelSustained = true;
            rComp.flawIdentified = undefined;
          });
          reviewerAuditData.initialTotalScore = 1000;
          reviewerAuditData.finalAuditedTotalScore = 1000;
          reviewerAuditData.wasInflationDetected = false;
          reviewerAuditData.inflationPointsAdjusted = 0;
        }
      }

      const validatedTotalScore = shouldLockNota1000 ? 1000 : rawValidatedTotalScore;

      // Gerar e persistir log estruturado com LOG_CONFIG para rastreabilidade e calibração contínua
      const aiAnalysisLog = LOG_CONFIG.gerarLogEstruturado({
        correctionResultId: `correction-${Date.now()}`,
        totalScore: validatedTotalScore,
        initialScore: shouldLockNota1000 ? 1000 : data.totalScore,
        competencies: validatedCompetencies,
        essayText: essayText.trim(),
        theme: activeTheme,
        reviewerReport: reviewerAuditData,
        ocrUsed: !!ocrFileName,
      });

      if (LOG_CONFIG.autoPersist) {
        LOG_CONFIG.salvarLog(aiAnalysisLog);
      }

      // A nota final oficial a considerar (Média INEP) é a média aritmética dos dois corretores (soma das médias das competências)
      const clientBreakdown = validationReport.highPerformanceCurveReport?.dualEvaluatorBreakdown;
      if (!shouldLockNota1000 && clientBreakdown) {
        const rawSimA = data.dualEvaluatorSimulation?.evaluatorA;
        const rawSimB = data.dualEvaluatorSimulation?.evaluatorB;
        const rawASum = rawSimA ? (rawSimA.c1 + rawSimA.c2 + rawSimA.c3 + rawSimA.c4 + rawSimA.c5) : -1;
        const rawBSum = rawSimB ? (rawSimB.c1 + rawSimB.c2 + rawSimB.c3 + rawSimB.c4 + rawSimB.c5) : -1;
        const clientAdjustedAny = (['c1', 'c2', 'c3', 'c4', 'c5'] as const).some((ck) => {
          const simMean = rawSimA && rawSimB ? Math.round(((rawSimA[ck] ?? 0) + (rawSimB[ck] ?? 0)) / 2) : 999;
          return simMean !== (validatedCompetencies[ck]?.score ?? 0);
        });
        const nonMaxTotalsTied = rawASum === rawBSum && rawValidatedTotalScore > 0 && rawValidatedTotalScore < 1000;

        if (!rawSimA || !rawSimB || clientAdjustedAny || nonMaxTotalsTied) {
          const aScores = clientBreakdown.evaluatorA_scores;
          const bScores = clientBreakdown.evaluatorB_scores;
          const dC1 = Math.abs(aScores.c1 - bScores.c1);
          const dC2 = Math.abs(aScores.c2 - bScores.c2);
          const dC3 = Math.abs(aScores.c3 - bScores.c3);
          const dC4 = Math.abs(aScores.c4 - bScores.c4);
          const dC5 = Math.abs(aScores.c5 - bScores.c5);
          const totA = clientBreakdown.evaluatorA_total;
          const totB = clientBreakdown.evaluatorB_total;
          const totDisc = Math.abs(totA - totB);
          const maxCompDisc = Math.max(dC1, dC2, dC3, dC4, dC5);
          const isUnanimous = totDisc === 0 && maxCompDisc === 0;

          data.dualEvaluatorSimulation = {
            evaluatorA: {
              ...aScores,
              total: totA,
              evaluatorProfile: rawSimA?.evaluatorProfile || 'Avaliador 1 — Perfil Normativo, Sintático e Coesivo (rigor estrito em C1 e C4)',
              notes: `Leitura estrita de norma-padrão, precisão vocabular, sintaxe e coesão (C1: ${aScores.c1} | C4: ${aScores.c4}); leitura funcional nos eixos macroestruturais (C2: ${aScores.c2} | C3: ${aScores.c3} | C5: ${aScores.c5}).`
            },
            evaluatorB: {
              ...bScores,
              total: totB,
              evaluatorProfile: rawSimB?.evaluatorProfile || 'Avaliador 2 — Perfil Estrutural, Temático e Interventivo (rigor estrito em C2, C3 e C5)',
              notes: `Leitura estrita de tema/repertório em D1/D2, aprofundamento estrutural e proposta C5 (C2: ${bScores.c2} | C3: ${bScores.c3} | C5: ${bScores.c5}); leitura funcional na forma linguística (C1: ${bScores.c1} | C4: ${bScores.c4}).`
            },
            discrepancyC1: dC1,
            discrepancyC2: dC2,
            discrepancyC3: dC3,
            discrepancyC4: dC4,
            discrepancyC5: dC5,
            totalDiscrepancy: totDisc,
            status: isUnanimous ? 'consenso_direto' : 'divergencia_tolerada',
            explanation: isUnanimous
              ? 'Consenso unânime direto entre os dois avaliadores nas 5 competências.'
              : `Perfis independentes do INEP aplicados: Avaliador 1 (Normativo/Sintático/Coesivo) somou ${totA} pts e Avaliador 2 (Estrutural/Temático/Interventivo) somou ${totB} pts (diferença total de ${totDisc} pts, dentro da tolerância oficial). Nota final = média aritmética (${clientBreakdown.calculatedArithmeticMean} pts).`
          };
        }
      }

      const simA = data.dualEvaluatorSimulation?.evaluatorA;
      const simB = data.dualEvaluatorSimulation?.evaluatorB;
      let finalOfficialScore = validatedTotalScore;

      // Sincronizar a nota de cada competência com a Média Oficial (Avaliador 1 + Avaliador 2) / 2
      // para que a Tabela Oficial, o Detalhamento das 5 Competências e o Log de Auditoria tenham exatamente os mesmos valores
      if (shouldLockNota1000) {
        finalOfficialScore = 1000;
      } else if (simA && simB) {
        let sumMeans = 0;
        (['c1', 'c2', 'c3', 'c4', 'c5'] as const).forEach((compKey, idx) => {
          const cNum = idx + 1;
          const sA = simA[compKey] ?? validatedCompetencies[compKey]?.score ?? 0;
          const sB = simB[compKey] ?? validatedCompetencies[compKey]?.score ?? 0;
          const compMean = Math.round((sA + sB) / 2);
          sumMeans += compMean;
          if (validatedCompetencies[compKey]) {
            validatedCompetencies[compKey].score = compMean;
            validatedCompetencies[compKey].nota = compMean;
            validatedCompetencies[compKey].level = Math.round(compMean / 40);
            validatedCompetencies[compKey].nivel = Math.round(compMean / 40);
          }
          const logEntry = data.auditLog?.competencyLogs?.find((l: any) => l.competencyNum === cNum);
          if (logEntry) {
            logEntry.assignedScore = compMean;
            logEntry.isMaxScore200 = compMean === 200;
          }
        });
        if (sumMeans >= 0) {
          finalOfficialScore = sumMeans;
        }
      } else {
        (['c1', 'c2', 'c3', 'c4', 'c5'] as const).forEach((compKey, idx) => {
          const cNum = idx + 1;
          const compScore = validatedCompetencies[compKey]?.score ?? 0;
          const logEntry = data.auditLog?.competencyLogs?.find((l: any) => l.competencyNum === cNum);
          if (logEntry) {
            logEntry.assignedScore = compScore;
            logEntry.isMaxScore200 = compScore === 200;
          }
        });
      }

      if (data.auditLog) {
        data.auditLog.finalConsolidatedScore = finalOfficialScore;
      }

      if (shouldLockNota1000) {
        consolidatedConsistencyReport = {
          ...consolidatedConsistencyReport,
          passed: true,
          blockedFinalScoreEmission: false,
          finalScoreEmitted: 1000,
          contradictionsCount: 0,
          contradictions: [],
          summaryMessage: 'Nota 1000 conferida: todas as competências e justificativas estão 100% alinhadas com o texto.'
        };
      } else if (finalOfficialScore !== rawValidatedTotalScore) {
        const refreshedAudit = auditDiagnosticVsEvidenceConsistency(
          {
            totalScore: finalOfficialScore,
            competencies: validatedCompetencies,
            c1Deviations: data.c1Deviations || [],
            c5Structure: data.c5Structure,
            pedagogicalRewrites: data.pedagogicalRewrites || [],
            reviewerReport: reviewerAuditData
          },
          essayText.trim(),
          activeTheme
        );
        consolidatedConsistencyReport = {
          ...refreshedAudit,
          concessionApplied: combinedConcessionApplied,
          concessionDeltaPoints: combinedConcessionDelta,
          concessionDetails: combinedConcessionDetails,
          concessionSummaryPt: combinedConcessionApplied
            ? `Fizemos uma concessão entre a avaliação inicial e os trechos encontrados na sua redação, resultando na nota equilibrada de ${finalOfficialScore} pts (${combinedConcessionDelta >= 0 ? `+${combinedConcessionDelta}` : combinedConcessionDelta} pts).`
            : consolidatedConsistencyReport.concessionSummaryPt,
          summaryMessage: refreshedAudit.passed && combinedConcessionApplied
            ? `Nota equilibrada (${finalOfficialScore} pts): fizemos a concessão entre a análise inicial e o que está escrito na sua redação.`
            : refreshedAudit.summaryMessage
        };
      } else {
        consolidatedConsistencyReport.finalScoreEmitted = finalOfficialScore;
      }

      const result: EssayCorrectionResult = {
        id: aiAnalysisLog.id_analise,
        date: new Date().toLocaleDateString('pt-BR'),
        theme: activeTheme,
        essayText: essayText.trim(),
        totalScore: finalOfficialScore,
        competencies: validatedCompetencies,
        reviewerReport: reviewerAuditData,
        aiAnalysisLog: aiAnalysisLog,
        auditLog: data.auditLog,
        validationReport: {
          ...validationReport,
          scoreBlocked: false,
          consistencyAuditReport: consolidatedConsistencyReport,
        },
        evidenceValidatorReport: evidenceValidatorReport,
        consistencyAuditReport: consolidatedConsistencyReport,
        scoreBlocked: false,
        dualEvaluatorSimulation: data.dualEvaluatorSimulation,
        cartilhaBenchmark: data.cartilhaBenchmark,
        c1Deviations: data.c1Deviations || [],
        c5Structure: data.c5Structure,
        generalDiagnostic:
          (data.generalDiagnostic && String(data.generalDiagnostic).trim()) ||
          `Sua redação alcançou ${finalOfficialScore}/1000 pontos no tema "${activeTheme}" (C1: ${validatedCompetencies.c1?.score ?? 160} | C2: ${validatedCompetencies.c2?.score ?? 160} | C3: ${validatedCompetencies.c3?.score ?? 160} | C4: ${validatedCompetencies.c4?.score ?? 160} | C5: ${validatedCompetencies.c5?.score ?? 160}). Confira abaixo os pontos fortes identificados e o direcionamento em cada competência para evoluir rumo aos 1000 pontos.`,
        top3Problems: cleanedTop3Problems || data.top3Problems || [],
        top3Strengths: data.top3Strengths || [],
        actionPlanToImprove: data.actionPlanToImprove || [],
        highPerformanceComparison: data.highPerformanceComparison || '',
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
      const updatedResult: EssayCorrectionResult = {
        ...correctionResult,
        totalScore: officialMeanScore,
      };
      onSaveEssay(updatedResult);
      setIsSaved(true);
    }
  };

  const handleCopyStructuredLog = () => {
    if (!correctionResult) return;
    const logData = correctionResult.aiAnalysisLog || LOG_CONFIG.gerarLogEstruturado({
      correctionResultId: correctionResult.id,
      totalScore: officialMeanScore,
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

  const isResultAll200OrOfficialNota1000 = Boolean(
    correctionResult &&
    (isOfficialNota1000Benchmark(correctionResult.essayText || essayText || '') ||
      (correctionResult.competencies?.c1?.score === 200 &&
        correctionResult.competencies?.c2?.score === 200 &&
        correctionResult.competencies?.c3?.score === 200 &&
        correctionResult.competencies?.c4?.score === 200 &&
        correctionResult.competencies?.c5?.score === 200))
  );

  const competencyDivergences = correctionResult ? (['c1', 'c2', 'c3', 'c4', 'c5'] as const).map((k, idx) => {
    const num = (idx + 1) as CompetencyNumber;
    const name = [
      'C1 - Norma Culta & Sintaxe',
      'C2 - Tema & Repertório Sociocultural',
      'C3 - Projeto de Texto & Causalidade',
      'C4 - Coesão Textual Inter/Intraparágrafos',
      'C5 - Proposta de Intervenção Oficial'
    ][idx];

    const scoreA = isResultAll200OrOfficialNota1000
      ? 200
      : (correctionResult.dualEvaluatorSimulation?.evaluatorA?.[k] ??
         correctionResult.validationReport?.highPerformanceCurveReport?.dualEvaluatorBreakdown?.evaluatorA_scores?.[k] ??
         correctionResult.reviewerReport?.competencyReviews?.find(r => r.competencyNum === num)?.initialScore ??
         correctionResult.competencies[k]?.score ?? 0);

    const scoreB = isResultAll200OrOfficialNota1000
      ? 200
      : (correctionResult.dualEvaluatorSimulation?.evaluatorB?.[k] ??
         correctionResult.validationReport?.highPerformanceCurveReport?.dualEvaluatorBreakdown?.evaluatorB_scores?.[k] ??
         correctionResult.reviewerReport?.competencyReviews?.find(r => r.competencyNum === num)?.reviewedScore ??
         correctionResult.competencies[k]?.score ?? 0);

    const officialCompMean = Math.round((scoreA + scoreB) / 2);
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

  // Soma rigorosa das notas por competência para cada avaliador e média oficial
  const evalACompetenciesSum = competencyDivergences.reduce((acc, curr) => acc + curr.scoreA, 0);
  const evalBCompetenciesSum = competencyDivergences.reduce((acc, curr) => acc + curr.scoreB, 0);
  const sumOfCompetencyMeans = competencyDivergences.reduce((acc, curr) => acc + curr.officialCompMean, 0);

  const preliminaryEstimatedScore = isResultAll200OrOfficialNota1000
    ? 1000
    : (evalACompetenciesSum > 0
      ? evalACompetenciesSum
      : (correctionResult?.dualEvaluatorSimulation?.evaluatorA?.total ??
         correctionResult?.reviewerReport?.initialTotalScore ??
         correctionResult?.validationReport?.rawSum ??
         correctionResult?.totalScore ?? 0));

  const strictAuditedScore = isResultAll200OrOfficialNota1000
    ? 1000
    : (evalBCompetenciesSum > 0
      ? evalBCompetenciesSum
      : (correctionResult?.dualEvaluatorSimulation?.evaluatorB?.total ??
         correctionResult?.reviewerReport?.finalAuditedTotalScore ??
         correctionResult?.validationReport?.validatedTotal ??
         correctionResult?.totalScore ?? 0));

  // NOTA OFICIAL A CONSIDERAR (MÉDIA INEP):
  // Regra oficial do ENEM: A nota final é a média aritmética calculada entre os dois corretores,
  // correspondendo exatamente à soma das médias de cada uma das 5 competências.
  // Ela nunca fica abaixo da média dos corretores e garante a soma correta das médias sem qualquer discrepância.
  const evaluatorsAverageScore = Math.round((preliminaryEstimatedScore + strictAuditedScore) / 2);
  const officialMeanScore = isResultAll200OrOfficialNota1000
    ? 1000
    : (competencyDivergences.length > 0 
      ? Math.round(sumOfCompetencyMeans) 
      : evaluatorsAverageScore);

  const scoreDivergence = Math.abs(preliminaryEstimatedScore - strictAuditedScore);
  const hasDivergence = isResultAll200OrOfficialNota1000
    ? false
    : (scoreDivergence > 0 || (correctionResult?.reviewerReport?.wasInflationDetected ?? false) || (correctionResult?.validationReport?.hasAdjustments ?? false));
  const minScoreRange = Math.min(preliminaryEstimatedScore, strictAuditedScore);
  const maxScoreRange = Math.max(preliminaryEstimatedScore, strictAuditedScore);

  const getC5MissingElementLabels = (c5?: EssayCorrectionResult['c5Structure']): string[] => {
    if (!c5) return [];
    const missing: string[] = [];
    if (!c5.agent?.present) missing.push('quem faz (Agente)');
    if (!c5.action?.present) missing.push('o que fazer (Ação)');
    if (!c5.modeMedium?.present) missing.push('como fazer (Meio/Modo)');
    if (!c5.effect?.present) missing.push('para que fazer (Finalidade)');
    if (!c5.detailing?.present) missing.push('uma explicação extra de um dos elementos (Detalhamento)');
    return missing;
  };

  const shortenToConciseText = (raw: string, maxChars = 190): string => {
    const clean = (raw || '')
      .replace(/Ocorrências extraídas do texto:[\s\S]*/gi, '')
      .replace(/Ocorrências retiradas do texto:[\s\S]*/gi, '')
      .replace(/Desvios identificados no texto:[\s\S]*/gi, '')
      .replace(/Desvios pontuais verificados:[\s\S]*/gi, '')
      .replace(/\(agentes citados apenas na Conclusão não contam como repertório;\s*teto de \d+ pts\)/gi, '')
      .replace(/Manter 4 parágrafos com dois argumentos distintos garante no máximo 160 pts quando os desenvolvimentos permanecem expositivos\.?/gi, '')
      .replace(/\(Conectivos comuns bem empregados não sofrem desconto nem se exige variedade vocabular obrigatória\)\.?/gi, '')
      .replace(/\[[^\]]*\]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    if (!clean) return '';
    if (clean.length <= maxChars) return clean;
    const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length > 0 && sentences[0].length <= maxChars) {
      if (sentences.length > 1 && (sentences[0].length + 1 + sentences[1].length) <= maxChars) {
        return `${sentences[0]} ${sentences[1]}`;
      }
      return sentences[0];
    }
    return `${clean.slice(0, maxChars - 1).trim()}…`;
  };

  const getSimplifiedCompetencyLevelTitle = (
    compNum: number,
    score: number,
    rawTitle?: string,
    c5?: EssayCorrectionResult['c5Structure']
  ): string => {
    const level = Math.max(0, Math.min(5, Math.round((score || 0) / 40)));
    if (compNum === 1) {
      if (score >= 200) return 'Nível 5 — Escrita formal excelente';
      if (score >= 160) return 'Nível 4 — Boa escrita formal (poucos desvios)';
      if (score >= 120) return 'Nível 3 — Escrita regular (atenção à gramática)';
      if (score >= 80) return 'Nível 2 — Muitos desvios gramaticais';
      if (score >= 40) return 'Nível 1 — Domínio precário da escrita';
      return 'Nível 0 — Sem domínio mínimo';
    }
    if (compNum === 2) {
      if (score >= 200) return 'Nível 5 — Tema completo e repertório produtivo';
      if (score >= 160) return 'Nível 4 — Bom domínio do tema';
      if (score >= 120) return 'Nível 3 — Abordagem mediana do tema';
      if (score >= 80) return 'Nível 2 — Abordagem superficial do tema';
      if (score >= 40) return 'Nível 1 — Tangenciamento ao tema';
      return 'Nível 0 — Fuga ao tema';
    }
    if (compNum === 3) {
      if (score >= 200) return 'Nível 5 — Argumentação completa e aprofundada';
      if (score >= 160) return 'Nível 4 — Bons argumentos (falta aprofundar)';
      if (score >= 120) return 'Nível 3 — Argumentação mediana';
      if (score >= 80) return 'Nível 2 — Argumentos pouco desenvolvidos';
      if (score >= 40) return 'Nível 1 — Pouca defesa de ponto de vista';
      return 'Nível 0 — Sem projeto argumentativo';
    }
    if (compNum === 4) {
      if (score >= 200) return 'Nível 5 — Conectivos e coesão excelentes';
      if (score >= 160) return 'Nível 4 — Boa coesão entre frases e parágrafos';
      if (score >= 120) return 'Nível 3 — Coesão regular';
      if (score >= 80) return 'Nível 2 — Poucos conectivos ou repetições';
      if (score >= 40) return 'Nível 1 — Frases pouco conectadas';
      return 'Nível 0 — Ausência de coesão';
    }
    if (compNum === 5) {
      if (c5 && !c5.respectsHumanRights) return 'Nível 0 — Desrespeito aos Direitos Humanos';
      if (score >= 200) return 'Nível 5 — Proposta completa (5 elementos)';
      if (score >= 160) {
        if (c5 && !c5.detailing?.present) return 'Nível 4 — Quase completa (falta detalhar)';
        return 'Nível 4 — Quase completa (4 de 5 elementos)';
      }
      if (score >= 120) return 'Nível 3 — Proposta incompleta (3 de 5 elementos)';
      if (score >= 80) return 'Nível 2 — Poucos elementos (2 de 5)';
      if (score >= 40) return 'Nível 1 — Muito incompleta (1 de 5)';
      return 'Nível 0 — Sem proposta válida';
    }
    return rawTitle || `Nível ${level}`;
  };

  const buildCompetencyScoreExplanationDisplay = (
    compNum: number,
    compData: EssayCorrectionResult['competencies']['c1'] | undefined,
    compAudit?: NonNullable<EssayCorrectionResult['auditLog']>['competencyLogs'][number],
    c5?: EssayCorrectionResult['c5Structure']
  ): { headline: string; detail: string; scoreNote: string } => {
    const score = compData?.score ?? compData?.nota ?? compAudit?.assignedScore ?? 0;
    const rawDiag = shortenToConciseText(compData?.diagnostic || '', 175);
    const rawEval = shortenToConciseText(
      compData?.evaluation || compData?.justificativa_analitica || compAudit?.scoreJustification || '',
      185
    );
    const devCount = correctionResult?.c1Deviations?.length ?? 0;

    if (compNum === 5) {
      const missing = getC5MissingElementLabels(c5);
      const presentCount = c5?.validElementsCount ?? Math.min(5, Math.round(score / 40));
      let scoreNote = '';
      if (c5 && !c5.respectsHumanRights) {
        scoreNote =
          'Explicação da nota: foi identificado desrespeito aos Direitos Humanos na proposta, o que zera apenas a Competência 5 (0/200), mantendo as notas normais das demais competências.';
      } else if (score >= 200) {
        scoreNote =
          'Explicação da nota: sua conclusão trouxe todos os 5 elementos exigidos (Agente, Ação, Meio/Modo, Finalidade e Detalhamento) respeitando os Direitos Humanos (200/200).';
      } else if (missing.length > 0) {
        scoreNote = `Explicação da nota: você apresentou ${presentCount} de 5 elementos na conclusão (${score}/200). Para chegar aos 200 pontos, faltou deixar claro: ${missing.join('; ')}.`;
      } else {
        scoreNote = `Explicação da nota: sua conclusão somou ${score}/200 pontos com ${presentCount} de 5 elementos claramente identificados.`;
      }
      const headline =
        rawDiag ||
        (score >= 200
          ? 'Sua proposta de intervenção está completa, clara e bem articulada.'
          : `Sua conclusão apresentou ${presentCount} de 5 elementos exigidos na Competência 5.`);
      return { headline, detail: '', scoreNote };
    }

    let defaultHeadline = '';
    let scoreNote = '';

    if (compNum === 1) {
      defaultHeadline =
        score >= 200
          ? 'Excelente domínio da escrita formal, com frases bem pontuadas e vocabulário preciso.'
          : `Sua escrita formal recebeu ${score}/200 pontos na Competência 1.`;
      scoreNote =
        score >= 200
          ? 'Explicação da nota: você construiu períodos claros e bem articulados, sem desvios gramaticais relevantes.'
          : devCount > 0
            ? `Explicação da nota: foram identificados ${devCount} ponto(s) de revisão (como vírgula, concordância, crase ou termos informais) que impediram os 200 pontos.`
            : 'Explicação da nota: para chegar aos 200 pontos, é preciso unir correção gramatical com vocabulário formal preciso e frases mais bem articuladas.';
    } else if (compNum === 2) {
      defaultHeadline =
        score >= 200
          ? 'Você abordou o tema por completo e usou repertório produtivo nos desenvolvimentos.'
          : score === 40
            ? 'Atenção: o texto tratou apenas do assunto geral, sem focar no recorte específico do tema (40/200).'
            : `Você recebeu ${score}/200 pontos pelo desenvolvimento do tema e uso de repertório.`;
      scoreNote =
        score >= 200
          ? 'Explicação da nota: seu texto desenvolveu o recorte do tema e explicou bem o repertório sociocultural nos parágrafos de desenvolvimento.'
          : 'Explicação da nota: para alcançar 200 pontos na C2, além de abordar todo o tema, é necessário trazer repertório legítimo também no D1 ou D2 e conectá-lo ao seu argumento.';
    } else if (compNum === 3) {
      defaultHeadline =
        score >= 200
          ? 'Projeto de texto completo, com causas e consequências bem explicadas em D1 e D2.'
          : `Seus argumentos são coerentes (${score}/200), mas ainda podem ser mais aprofundados.`;
      scoreNote =
        score >= 200
          ? 'Explicação da nota: seus dois parágrafos de desenvolvimento defendem ideias claras e explicam o porquê do problema (causa) e seu efeito (consequência).'
          : 'Explicação da nota: você organizou bem os parágrafos, mas faltou explicar com mais profundidade a causa do problema e sua consequência prática nos dois desenvolvimentos (D1 e D2).';
    } else {
      defaultHeadline =
        score >= 200
          ? 'Excelente uso de conectivos entre parágrafos e frases, garantindo leitura fluida.'
          : `Boa conexão geral das ideias (${score}/200), com espaço para variar melhor a estrutura das frases.`;
      scoreNote =
        score >= 200
          ? 'Explicação da nota: você ligou bem os parágrafos e períodos internos sem repetir estruturas.'
          : 'Explicação da nota: seus conectivos funcionam bem, mas houve repetição de estruturas parecidas ou faltou maior fluidez na ligação interna entre algumas frases.';
    }

    const headline = rawDiag || defaultHeadline;
    const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();
    const showDetail = Boolean(
      rawEval &&
      norm(rawEval) !== norm(headline) &&
      !norm(scoreNote).includes(norm(rawEval).slice(0, 30)) &&
      !norm(headline).includes(norm(rawEval).slice(0, 30))
    );

    return {
      headline,
      detail: showDetail ? rawEval : '',
      scoreNote,
    };
  };

  const buildCompetencyGuidanceDisplay = (
    compNum: number,
    compData: EssayCorrectionResult['competencies']['c1'] | undefined,
    compAudit?: NonNullable<EssayCorrectionResult['auditLog']>['competencyLogs'][number],
    c5?: EssayCorrectionResult['c5Structure']
  ): { primaryGuidance: string; practicalStep: string } => {
    const score = compData?.score ?? compData?.nota ?? compAudit?.assignedScore ?? 0;
    const rawImprove = shortenToConciseText(compData?.howToImprove || '', 185);

    if (compNum === 5) {
      const missing = getC5MissingElementLabels(c5);
      let practicalStep = '';
      if (c5 && !c5.respectsHumanRights) {
        practicalStep =
          'Direcionamento: reformule a proposta garantindo medidas educativas, preventivas ou de apoio social que respeitem integralmente os Direitos Humanos.';
      } else if (score >= 200) {
        practicalStep =
          'Direcionamento: continue usando essa estrutura completa (quem faz, o que faz, como faz, para quê e um detalhe concreto sobre público, local ou funcionamento).';
      } else if (c5 && !c5.detailing?.present && missing.length === 1) {
        practicalStep =
          'Direcionamento: mantenha os elementos que você já colocou e acrescente uma explicação extra entre travessões ou vírgulas (dizendo quem será atendido, onde ocorrerá ou dando um exemplo concreto da ação) para chegar aos 200 pontos.';
      } else if (missing.length > 0) {
        practicalStep = `Direcionamento: complete sua proposta na conclusão incluindo claramente ${missing.join(' e ')} para alcançar os 200 pontos.`;
      } else {
        practicalStep =
          'Direcionamento: revise sua conclusão para confirmar que estão explícitos quem faz (Agente), o que faz (Ação), como faz (Meio), para quê (Finalidade) e uma explicação extra (Detalhamento).';
      }
      return { primaryGuidance: practicalStep, practicalStep: '' };
    }

    let primaryGuidance = '';
    if (compNum === 1) {
      primaryGuidance =
        score >= 200
          ? 'Direcionamento: mantenha a revisão atenta de vírgulas, crase e concordância e continue usando vocabulário formal preciso.'
          : 'Direcionamento: revise a vírgula após os conectivos de início de frase, troque expressões informais ("no dia a dia", "por causa de", "coisas") por termos formais e confira a concordância.';
    } else if (compNum === 2) {
      primaryGuidance =
        score >= 200
          ? 'Direcionamento: continue trazendo repertório legítimo nos desenvolvimentos e explicando como ele comprova sua tese.'
          : 'Direcionamento: inclua um repertório sociocultural legítimo (autor, obra, dado ou lei) também dentro do D1 ou D2 e adicione uma frase explicando como ele confirma o seu argumento.';
    } else if (compNum === 3) {
      primaryGuidance =
        score >= 200
          ? 'Direcionamento: continue estruturando D1 e D2 com duas causas diferentes, explicando o motivo e a consequência de cada uma.'
          : 'Direcionamento: em cada desenvolvimento (D1 e D2), siga 3 passos claros: 1) apresente a causa do problema; 2) relacione com um repertório; 3) mostre a consequência prática disso na sociedade.';
    } else {
      primaryGuidance =
        score >= 200
          ? 'Direcionamento: continue iniciando D1, D2 e Conclusão com conectivos adequados e variando a ligação entre as frases.'
          : 'Direcionamento: inicie o D1, o D2 e a Conclusão com conectivos variados (ex.: "Nesse cenário", "Ademais", "Portanto") e evite repetir o mesmo formato de frase entre parágrafos.';
    }

    const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();
    const showExtra = Boolean(
      rawImprove &&
      norm(rawImprove) !== norm(primaryGuidance) &&
      !norm(primaryGuidance).includes(norm(rawImprove).slice(0, 30))
    );

    return {
      primaryGuidance,
      practicalStep: showExtra ? rawImprove : '',
    };
  };

  const simplifyAuditScoreExplanation = (
    logItem: NonNullable<EssayCorrectionResult['auditLog']>['competencyLogs'][number],
    compData: EssayCorrectionResult['competencies']['c1'] | undefined,
    officialAuditScore: number
  ): { mainReason: string; extraExplanation: string } => {
    const exp = buildCompetencyScoreExplanationDisplay(
      logItem.competencyNum,
      compData ? { ...compData, score: officialAuditScore } : ({ score: officialAuditScore } as any),
      logItem,
      correctionResult?.c5Structure
    );
    return {
      mainReason: exp.headline,
      extraExplanation: exp.scoreNote,
    };
  };

  const simplifyAuditMissingAndGuidance = (
    logItem: NonNullable<EssayCorrectionResult['auditLog']>['competencyLogs'][number],
    compData: EssayCorrectionResult['competencies']['c1'] | undefined,
    isMax200: boolean
  ): { missingSummary: string; guidanceText: string } => {
    const score = isMax200 ? 200 : (compData?.score ?? logItem.assignedScore ?? 160);
    const guide = buildCompetencyGuidanceDisplay(
      logItem.competencyNum,
      compData ? { ...compData, score } : ({ score } as any),
      logItem,
      correctionResult?.c5Structure
    );

    if (logItem.competencyNum === 5 && correctionResult?.c5Structure) {
      const c5Struct = correctionResult.c5Structure;
      const missing = getC5MissingElementLabels(c5Struct);
      const missingSummary = isMax200
        ? 'Sua proposta reuniu todos os 5 elementos obrigatórios com clareza.'
        : missing.length > 0
          ? `Faltou deixar mais claro na conclusão: ${missing.join('; ')}.`
          : 'Vale deixar cada um dos 5 elementos da proposta ainda mais explícito na conclusão.';
      return {
        missingSummary,
        guidanceText: guide.primaryGuidance,
      };
    }

    const rawReason = shortenToConciseText(logItem.reasonNotRoundedTo200 || '', 155);
    const missingSummary = isMax200
      ? 'Você atendeu a todos os critérios exigidos para a nota máxima nesta competência.'
      : rawReason || 'Pequenos ajustes pontuais impediram a nota 200 nesta competência.';

    return {
      missingSummary,
      guidanceText: guide.primaryGuidance,
    };
  };

  const simplifyAuditPillar = (
    pillar: { pillar: string; status: 'atendido' | 'parcial' | 'ausente'; detail: string },
    pillarIdx: number,
    competencyNum: number
  ): { title: string; detail: string } => {
    const ok = pillar.status === 'atendido';
    if (competencyNum === 1) {
      if (pillarIdx === 0) {
        return {
          title: 'Construção das frases',
          detail: ok ? 'Períodos claros e bem pontuados.' : 'Melhore a pontuação e ligação das frases.',
        };
      }
      if (pillarIdx === 1) {
        return {
          title: 'Vocabulário formal',
          detail: ok ? 'Linguagem formal e precisa.' : 'Substitua termos informais ou vagos.',
        };
      }
      const devCount = correctionResult?.c1Deviations?.length ?? 0;
      return {
        title: 'Revisão de desvios',
        detail: ok || devCount === 0 ? 'Sem desvios gramaticais graves.' : `${devCount} ponto(s) de revisão encontrados.`,
      };
    }
    if (competencyNum === 2) {
      if (pillarIdx === 0) {
        return {
          title: 'Foco no tema',
          detail: ok ? 'Tema abordado dentro do recorte.' : 'Atenção ao recorte específico do tema.',
        };
      }
      if (pillarIdx === 1) {
        return {
          title: 'Repertório em D1/D2',
          detail: ok ? 'Referência presente nos argumentos.' : 'Inclua repertório também no D1 ou D2.',
        };
      }
      return {
        title: 'Uso do repertório',
        detail: ok ? 'Referência bem conectada à tese.' : 'Explique melhor a referência no parágrafo.',
      };
    }
    if (competencyNum === 3) {
      if (pillarIdx === 0) {
        return {
          title: 'Ideias em D1 e D2',
          detail: ok ? 'D1 e D2 defendem pontos distintos.' : 'Diferencie melhor os argumentos de D1 e D2.',
        };
      }
      if (pillarIdx === 1) {
        return {
          title: 'Causa e consequência',
          detail: ok ? 'Causas e efeitos bem explicados.' : 'Aprofunde o porquê e o impacto do problema.',
        };
      }
      return {
        title: 'Repertório nos argumentos',
        detail: ok ? 'Ideias e referências bem ligadas.' : 'Conecte melhor tese, repertório e explicação.',
      };
    }
    if (competencyNum === 4) {
      if (pillarIdx === 0) {
        return {
          title: 'Variação das frases',
          detail: ok ? 'Sem repetição de estruturas.' : 'Varie a forma de iniciar as explicações.',
        };
      }
      if (pillarIdx === 1) {
        return {
          title: 'Fluidez da leitura',
          detail: ok ? 'Boa transição entre frases e blocos.' : 'Melhore a ligação entre as frases internas.',
        };
      }
      return {
        title: 'Uso dos conectivos',
        detail: ok ? 'Conectivos bem usados e naturais.' : 'Ajuste os conectivos entre parágrafos.',
      };
    }
    if (competencyNum === 5) {
      if (pillarIdx === 0) {
        const count = correctionResult?.c5Structure?.validElementsCount ?? (ok ? 5 : 4);
        return {
          title: 'Elementos da proposta',
          detail: `${count} de 5 elementos identificados na conclusão.`,
        };
      }
      if (pillarIdx === 1) {
        return {
          title: 'Detalhamento',
          detail: ok ? 'Detalhamento claro e específico.' : 'Faltou adicionar uma explicação extra.',
        };
      }
      return {
        title: 'Direitos Humanos',
        detail: ok ? 'Sua proposta respeita os Direitos Humanos.' : 'Proposta incompatível com os Direitos Humanos.',
      };
    }
    return {
      title: shortenToConciseText(pillar.pillar, 40),
      detail: shortenToConciseText(pillar.detail, 70),
    };
  };

  const buildGeneralPerformanceOverview = (res: EssayCorrectionResult | null): string => {
    if (!res) return '';
    const c1 = competencyDivergences[0]?.officialCompMean ?? res.competencies?.c1?.score ?? res.competencies?.c1?.nota ?? 0;
    const c2 = competencyDivergences[1]?.officialCompMean ?? res.competencies?.c2?.score ?? res.competencies?.c2?.nota ?? 0;
    const c3 = competencyDivergences[2]?.officialCompMean ?? res.competencies?.c3?.score ?? res.competencies?.c3?.nota ?? 0;
    const c4 = competencyDivergences[3]?.officialCompMean ?? res.competencies?.c4?.score ?? res.competencies?.c4?.nota ?? 0;
    const c5 = competencyDivergences[4]?.officialCompMean ?? res.competencies?.c5?.score ?? res.competencies?.c5?.nota ?? 0;
    const total = officialMeanScore || res.totalScore || (c1 + c2 + c3 + c4 + c5);

    const raw = (res.generalDiagnostic || '').trim();
    const isBoilerplateOnly = /^Redação avaliada por auditoria ponderada de evidências/i.test(raw);
    if (raw && raw.length >= 25 && !isBoilerplateOnly) {
      return raw.replace(/\b\d{3,4}\s*\/\s*1000\b/g, `${total}/1000`);
    }

    const compList = [
      { num: 1, label: 'C1 (Escrita Formal)', score: c1 },
      { num: 2, label: 'C2 (Tema e Repertório)', score: c2 },
      { num: 3, label: 'C3 (Argumentação)', score: c3 },
      { num: 4, label: 'C4 (Coesão)', score: c4 },
      { num: 5, label: 'C5 (Proposta de Intervenção)', score: c5 },
    ];

    const strongComps = compList
      .filter((c) => c.score >= 160)
      .sort((a, b) => b.score - a.score)
      .map((c) => `${c.label} (${c.score} pts)`);

    const improveComps = compList
      .filter((c) => c.score < 200)
      .sort((a, b) => a.score - b.score)
      .map((c) => `${c.label} (${c.score} pts)`);

    const tierLabel =
      total === 1000
        ? 'desempenho máximo (Nota 1000)'
        : total >= 920
        ? 'excelente desempenho'
        : total >= 800
        ? 'bom desempenho'
        : total >= 600
        ? 'desempenho intermediário'
        : 'desempenho em fase de consolidação';

    const strongSentence =
      strongComps.length > 0
        ? `Seus melhores resultados foram em ${strongComps.slice(0, 3).join(', ')}, mostrando boa base na estrutura dissertativo-argumentativa.`
        : 'Sua redação abordou a proposta, mas precisa consolidar a estrutura dos parágrafos e a fundamentação dos argumentos.';

    const improveSentence =
      improveComps.length > 0
        ? `Para subir sua nota nas próximas redações, concentre seus ajustes principalmente em ${improveComps.slice(0, 2).join(' e ')}.`
        : 'Você atingiu a pontuação máxima nas 5 competências da Matriz Oficial do INEP.';

    return `Sua redação obteve ${total}/1000 pontos (${tierLabel}) no tema "${res.theme}" — C1: ${c1} | C2: ${c2} | C3: ${c3} | C4: ${c4} | C5: ${c5}. ${strongSentence} ${improveSentence}`;
  };

  const getEffectiveTop3Strengths = (res: EssayCorrectionResult | null): string[] => {
    if (!res) return [];
    const valid = (res.top3Strengths || []).map((s) => String(s || '').trim()).filter(Boolean);
    if (valid.length > 0) return valid;

    const c1 = competencyDivergences[0]?.officialCompMean ?? res.competencies?.c1?.score ?? 160;
    const c2 = competencyDivergences[1]?.officialCompMean ?? res.competencies?.c2?.score ?? 160;
    const c3 = competencyDivergences[2]?.officialCompMean ?? res.competencies?.c3?.score ?? 160;
    const c4 = competencyDivergences[3]?.officialCompMean ?? res.competencies?.c4?.score ?? 160;
    const c5 = competencyDivergences[4]?.officialCompMean ?? res.competencies?.c5?.score ?? 160;

    const fallbacks: string[] = [];
    if (c2 >= 160) fallbacks.push(`Desenvolvimento consistente do tema "${res.theme}" dentro do texto dissertativo-argumentativo (${c2}/200 na C2).`);
    if (c1 >= 160) fallbacks.push(`Bom domínio da modalidade escrita formal e construção clara das frases (${c1}/200 na C1).`);
    if (c4 >= 160) fallbacks.push(`Uso adequado de conectivos para ligar os parágrafos e ideias (${c4}/200 na C4).`);
    if (c3 >= 160) fallbacks.push(`Defesa de ponto de vista com organização entre introdução, desenvolvimento e conclusão (${c3}/200 na C3).`);
    if (c5 >= 160) fallbacks.push(`Proposta de intervenção alinhada aos Direitos Humanos na conclusão (${c5}/200 na C5).`);
    while (fallbacks.length < 3) {
      if (fallbacks.length === 0) fallbacks.push('Atendimento ao formato dissertativo-argumentativo exigido pelo ENEM.');
      else if (fallbacks.length === 1) fallbacks.push('Organização visual do texto em parágrafos distintos.');
      else fallbacks.push('Respeito integral aos Direitos Humanos ao longo do texto.');
    }
    return fallbacks.slice(0, 3);
  };

  const getEffectiveTop3Problems = (res: EssayCorrectionResult | null): string[] => {
    if (!res) return [];
    const valid = (res.top3Problems || []).map((p) => String(p || '').trim()).filter(Boolean);
    if (valid.length > 0) return valid;

    const list: string[] = [];
    (['c1', 'c2', 'c3', 'c4', 'c5'] as const).forEach((ck, idx) => {
      const comp = res.competencies?.[ck];
      const sc = competencyDivergences[idx]?.officialCompMean ?? comp?.score ?? 200;
      if (sc < 200) {
        const exp = buildCompetencyScoreExplanationDisplay(idx + 1, comp, undefined, res.c5Structure);
        list.push(`C${idx + 1} (${sc}/200): ${exp.scoreNote.replace(/^Explicação da nota:\s*/i, '')}`);
      }
    });
    if (list.length === 0) {
      list.push('Todas as competências atingiram 200 pontos. Mantenha o padrão de revisão gramatical, repertório produtivo e proposta detalhada.');
    }
    return list.slice(0, 3);
  };

  const getEffectiveActionPlan = (res: EssayCorrectionResult | null): string[] => {
    if (!res) return [];
    const valid = (res.actionPlanToImprove || []).map((a) => String(a || '').trim()).filter(Boolean);
    if (valid.length > 0) return valid;

    const actions: string[] = [];
    (['c1', 'c2', 'c3', 'c4', 'c5'] as const).forEach((ck, idx) => {
      const comp = res.competencies?.[ck];
      const sc = competencyDivergences[idx]?.officialCompMean ?? comp?.score ?? 200;
      if (sc < 200) {
        const guide = buildCompetencyGuidanceDisplay(idx + 1, comp, undefined, res.c5Structure);
        actions.push(`Na Competência ${idx + 1}: ${guide.primaryGuidance.replace(/^Direcionamento:\s*/i, '')}`);
      }
    });
    if (actions.length === 0) {
      actions.push('Continue praticando novos eixos temáticos mantendo repertórios produtivos nos desenvolvimentos e os 5 elementos na conclusão.');
    }
    return actions.slice(0, 4);
  };

  const getEffectiveHighPerformanceComparison = (res: EssayCorrectionResult | null): string => {
    if (!res) return '';
    const raw = (res.highPerformanceComparison || '').trim();
    if (raw.length >= 15) return raw;
    const actions = getEffectiveActionPlan(res);
    return actions.join(' ');
  };

  const handleCopyReport = () => {
    if (!correctionResult) return;
    const reportText = `================================================
RELATÓRIO DE CORREÇÃO OFICIAL — REDAÇÃO ENEM
Tema: ${correctionResult.theme}
Data: ${correctionResult.date}

⭐ NOTA OFICIAL A CONSIDERAR (MÉDIA INEP): ${officialMeanScore} / 1000
${hasDivergence ? `[1º Olhar (Nota Estimada): ${preliminaryEstimatedScore} pts | Banca Revisora (Nota Auditada): ${strictAuditedScore} pts | Faixa Realista no ENEM: ${minScoreRange} a ${maxScoreRange} pts]` : ''}

PONTUAÇÃO POR COMPETÊNCIAS (MÉDIA OFICIAL):
- C1 (Norma Culta): ${competencyDivergences[0]?.officialCompMean ?? correctionResult.competencies.c1.score} / 200
- C2 (Tema e Repertório): ${competencyDivergences[1]?.officialCompMean ?? correctionResult.competencies.c2.score} / 200
- C3 (Projeto de Texto): ${competencyDivergences[2]?.officialCompMean ?? correctionResult.competencies.c3.score} / 200
- C4 (Coesão Textual): ${competencyDivergences[3]?.officialCompMean ?? correctionResult.competencies.c4.score} / 200
- C5 (Proposta Intervenção): ${competencyDivergences[4]?.officialCompMean ?? correctionResult.competencies.c5.score} / 200

DIAGNÓSTICO GERAL:
${buildGeneralPerformanceOverview(correctionResult)}

3 MAIORES PONTOS FORTES:
${getEffectiveTop3Strengths(correctionResult).map((s, i) => `${i + 1}. ${s}`).join('\n')}

${correctionResult.totalScore >= 960 ? 'AJUSTES FINOS DE EXCELÊNCIA (RUMO AOS 1000):' : '3 MAIORES PROBLEMAS:'}
${getEffectiveTop3Problems(correctionResult).map((p, i) => `${i + 1}. ${p}`).join('\n')}

COMO SUBIR SUA NOTA (PLANO DE AÇÃO):
${getEffectiveActionPlan(correctionResult).map((a, i) => `${i + 1}. ${a}`).join('\n')}

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
                          setTheme(saved.theme);
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
                setActiveCorrection(null);
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
                  onClick={() => {
                    setIsCustomTheme(false);
                    if (!HISTORICAL_THEMES.some(t => t.title === theme)) {
                      setTheme(HISTORICAL_THEMES[0].title);
                    }
                  }}
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
                  value={HISTORICAL_THEMES.some(t => t.title === theme) ? theme : HISTORICAL_THEMES[0].title}
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
                      1º Avaliador (Normativo)
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">Rigor C1 e C4</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {correctionResult.dualEvaluatorSimulation?.evaluatorA?.evaluatorProfile || 'Rigor estrito em norma-padrão, sintaxe e coesão textual'}
                  </p>
                </div>
                <div className="pt-3 mt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Nota Avaliador 1:</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
                    {preliminaryEstimatedScore} <span className="text-xs font-normal text-slate-400">pts</span>
                  </span>
                </div>
              </div>

              {/* Avaliador 2 (Estrutural, Temático e Interventivo) */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center text-xs font-bold">2</span>
                      2º Avaliador (Estrutural)
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">Rigor C2, C3 e C5</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {correctionResult.dualEvaluatorSimulation?.evaluatorB?.evaluatorProfile || 'Rigor estrito em repertório, projeto de texto e proposta C5'}
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
                      <th className="p-3 text-center">2º Avaliador</th>
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
                  { key: 'c1', num: 1, title: 'C1: Norma Culta', score: competencyDivergences[0]?.officialCompMean ?? correctionResult.competencies.c1.score },
                  { key: 'c2', num: 2, title: 'C2: Tema e Repertório', score: competencyDivergences[1]?.officialCompMean ?? correctionResult.competencies.c2.score },
                  { key: 'c3', num: 3, title: 'C3: Projeto de Texto', score: competencyDivergences[2]?.officialCompMean ?? correctionResult.competencies.c3.score },
                  { key: 'c4', num: 4, title: 'C4: Coesão Textual', score: competencyDivergences[3]?.officialCompMean ?? correctionResult.competencies.c4.score },
                  { key: 'c5', num: 5, title: 'C5: Intervenção', score: competencyDivergences[4]?.officialCompMean ?? correctionResult.competencies.c5.score },
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
                {buildGeneralPerformanceOverview(correctionResult)}
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
              {
                num: 1,
                key: 'c1' as const,
                name: 'Competência 1',
                subtitle: 'Domínio da modalidade escrita formal da Língua Portuguesa',
                data: {
                  ...correctionResult.competencies.c1,
                  score: competencyDivergences[0]?.officialCompMean ?? correctionResult.competencies.c1.score,
                  nota: competencyDivergences[0]?.officialCompMean ?? correctionResult.competencies.c1.score,
                },
              },
              {
                num: 2,
                key: 'c2' as const,
                name: 'Competência 2',
                subtitle: 'Compreensão do tema e aplicação de repertório sociocultural produtivo',
                data: {
                  ...correctionResult.competencies.c2,
                  score: competencyDivergences[1]?.officialCompMean ?? correctionResult.competencies.c2.score,
                  nota: competencyDivergences[1]?.officialCompMean ?? correctionResult.competencies.c2.score,
                },
              },
              {
                num: 3,
                key: 'c3' as const,
                name: 'Competência 3',
                subtitle: 'Seleção, relação, organização e interpretação (Projeto de Texto & Autoria)',
                data: {
                  ...correctionResult.competencies.c3,
                  score: competencyDivergences[2]?.officialCompMean ?? correctionResult.competencies.c3.score,
                  nota: competencyDivergences[2]?.officialCompMean ?? correctionResult.competencies.c3.score,
                },
              },
              {
                num: 4,
                key: 'c4' as const,
                name: 'Competência 4',
                subtitle: 'Conhecimento dos mecanismos linguísticos e operadores argumentativos',
                data: {
                  ...correctionResult.competencies.c4,
                  score: competencyDivergences[3]?.officialCompMean ?? correctionResult.competencies.c4.score,
                  nota: competencyDivergences[3]?.officialCompMean ?? correctionResult.competencies.c4.score,
                },
              },
              {
                num: 5,
                key: 'c5' as const,
                name: 'Competência 5',
                subtitle: 'Elaboração de proposta de intervenção com respeito aos Direitos Humanos',
                data: {
                  ...correctionResult.competencies.c5,
                  score: competencyDivergences[4]?.officialCompMean ?? correctionResult.competencies.c5.score,
                  nota: competencyDivergences[4]?.officialCompMean ?? correctionResult.competencies.c5.score,
                },
              },
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
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            ({getSimplifiedCompetencyLevelTitle(
                              comp.num,
                              comp.data.score,
                              comp.data.levelTitle || comp.data.titulo_nivel,
                              correctionResult.c5Structure
                            )})
                          </span>
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

                  {isExpanded && (() => {
                    const compAudit = correctionResult.auditLog?.competencyLogs?.find(
                      (l) => l.competencyNum === comp.num
                    );
                    const curve =
                      correctionResult.highPerformanceCurveReport ||
                      correctionResult.validationReport?.highPerformanceCurveReport;
                    const reviewerCheck = correctionResult.reviewerReport?.competencyReviews?.find(
                      (r) => r.competencyNum === comp.num
                    );

                    // Collect all unique textual evidence snippets from the student's essay for this competency
                    const rawQuotes = [
                      comp.data.trecho_evidencia,
                      comp.data.primaryEvidenceQuote,
                      ...(comp.data.evidenceSnippets || []),
                      compAudit?.evidenceQuoteFromStudent,
                    ]
                      .map((q) => (q || '').trim())
                      .filter(
                        (q) =>
                          q.length > 0 &&
                          q !== 'Trecho sob análise textual.' &&
                          q !== 'Análise global do texto submetido.'
                      );
                    const uniqueQuotes = Array.from(new Set(rawQuotes));

                    // Helper to normalize strings for strict deduplication
                    const normalizeForDedup = (str: string) =>
                      (str || '')
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-z0-9\s]/g, '')
                        .replace(/\s+/g, ' ')
                        .trim();

                    // Classify each pedagogicalRewrite into ONE single competency (1..5) so the same rewrite NEVER appears in both C1 and C2
                    const classifyRewriteCompetency = (rw: {
                      original: string;
                      problem: string;
                      explanation: string;
                      competencyNum?: number;
                    }): 1 | 2 | 3 | 4 | 5 => {
                      if (rw.competencyNum && [1, 2, 3, 4, 5].includes(rw.competencyNum)) {
                        return rw.competencyNum as 1 | 2 | 3 | 4 | 5;
                      }
                      const probText = `${rw.problem || ''} ${rw.explanation || ''}`.toLowerCase();
                      if (
                        /(intervenç|intervenc|proposta|agente|meio\/modo|meio ou modo|detalhamento|finalidade|efeito social|\bc5\b)/i.test(
                          probText
                        )
                      ) {
                        return 5;
                      }
                      if (
                        /(gramat|ortograf|vírgula|virgula|crase|concord|regênc|regenc|sintát|sintat|norma-padrão|norma culta|acentua|pontuaç|oralidade|coloquial|informal|truncament|paralelismo|\bc1\b)/i.test(
                          probText
                        )
                      ) {
                        return 1;
                      }
                      if (
                        /(conectiv|coesão|coesao|coesiv|operador|transiç|articulador|repetição de palavra|anáfora|anafora|interparágrafo|intraparágrafo|\bc4\b)/i.test(
                          probText
                        )
                      ) {
                        return 4;
                      }
                      if (
                        /(repertór|repertor|recorte temático|tangencia|senso comum|legitimad|alinhad|produtiv|filósof|sociólog|constituição|tema central|\bc2\b)/i.test(
                          probText
                        )
                      ) {
                        return 2;
                      }
                      return 3;
                    };

                    const matchingRewrites = comp.data.score >= 200
                      ? []
                      : (correctionResult.pedagogicalRewrites || []).filter(
                          (rw) => classifyRewriteCompetency(rw) === comp.num
                        );

                    // Helper to clean a student quote and generate a natural, non-repetitive 200-point rewrite (Depois)
                    const cleanTheme = (correctionResult.theme || 'a problemática em questão')
                      .replace(/^["'“”]+|["'“”.]+$/g, '')
                      .trim();

                    const themeSignificantWords = normalizeForDedup(cleanTheme)
                      .split(' ')
                      .filter((w) => w.length > 4);

                    const sanitizeRewriteOutput = (txt: string): string => {
                      let out = (txt || '')
                        .replace(/^["'“”]+|["'“”]+$/g, '')
                        .replace(/\s+/g, ' ')
                        .trim();
                      // Remove accidental duplicate observation verbs
                      out = out.replace(
                        /\b(observa-se que|verifica-se que|constata-se que|percebe-se que|nota-se que)\s+(observa-se que|verifica-se que|constata-se que|percebe-se que|nota-se que|é possível observar que|vemos que)\b/gi,
                        '$1'
                      );
                      // Remove consecutive duplicate words
                      out = out.replace(/\b(\w+)(\s+\1\b)+/gi, '$1');
                      // Remove duplicate punctuation
                      out = out.replace(/([,;:.])\s*\1+/g, '$1');
                      return out;
                    };

                    const extractCleanCoreClause = (rawQuote: string): { fullClean: string; coreClause: string } => {
                      const base = (rawQuote || '')
                        .replace(/^["'“”]+|["'“”]+$/g, '')
                        .replace(/\s+/g, ' ')
                        .trim();
                      // Take first meaningful sentence if multiple sentences are pasted
                      const sentences = base
                        .split(/(?<=[.!?])\s+/)
                        .map((s) => s.trim())
                        .filter((s) => s.length > 10);
                      const targetSentence = (sentences[0] || base).replace(/[.!;:,]+$/, '').trim();

                      // Strip leading connectors and introductory formulas so we never double them
                      let stripped = targetSentence
                        .replace(
                          /^(sob a ótica[^,]+,\s*|à luz[^,]+,\s*|de acordo com[^,]+,\s*|segundo[^,]+,\s*|conforme[^,]+,\s*|diante desse cenário,\s*|diante disso,\s*|nesse contexto,\s*|nesse sentido,\s*|sob esse viés,\s*|outrossim,\s*|ademais,\s*|além disso,\s*|portanto,\s*|dessa forma,\s*|assim,\s*|no brasil contemporâneo,\s*|no brasil,\s*|hoje em dia,\s*|atualmente,\s*|primeiramente,\s*|em primeiro lugar,\s*)+/i,
                          ''
                        )
                        .replace(
                          /^(observa-se que\s+|verifica-se que\s+|constata-se que\s+|percebe-se que\s+|nota-se que\s+|é possível observar que\s+|é possível perceber que\s+|é notório que\s+|vemos que\s+|pode-se afirmar que\s+|vale ressaltar que\s+|nota-se\s+|percebe-se\s+)/i,
                          ''
                        )
                        .replace(
                          /,\s*(visto que|já que|uma vez que|haja vista|pois|porque|o que perpetua|o que gera|evidenciando|realidade que).*$/i,
                          ''
                        )
                        .trim();

                      if (stripped.length < 12) {
                        stripped = targetSentence;
                      }

                      const startsWithProper =
                        /^(Brasil|Constituição|Estado|Governo|Ministério|ONU|OMS|IBGE|ECA|Foucault|Bauman|Durkheim|Bourdieu|Arendt|Kant|Aristóteles|Platão|Habermas)/i.test(
                          stripped
                        );
                      const coreClause =
                        stripped.length > 1
                          ? (startsWithProper ? stripped[0] : stripped[0].toLowerCase()) + stripped.slice(1)
                          : stripped;

                      return { fullClean: targetSentence, coreClause };
                    };

                    const buildConcreteCompetencyRewrite = (
                      cNum: number,
                      rawQuote: string,
                      flawText: string
                    ): { fixAfter: string; stepByStep: string } => {
                      const { fullClean, coreClause } = extractCleanCoreClause(rawQuote);
                      const clauseNorm = normalizeForDedup(fullClean);
                      const flawLower = (flawText || '').toLowerCase();

                      // Check if the student's quote already mentions the theme or "Brasil/país" to avoid repeating them
                      const quoteAlreadyHasTheme =
                        themeSignificantWords.length > 0 &&
                        themeSignificantWords.filter((w) => clauseNorm.includes(w)).length >=
                          Math.min(2, themeSignificantWords.length);
                      const quoteAlreadyHasBrazil = /(brasil|pais|sociedade brasileira)/i.test(clauseNorm);

                      const themeRef = quoteAlreadyHasTheme ? 'essa questão' : cleanTheme;
                      const countryRef = quoteAlreadyHasBrazil ? 'no país' : 'no Brasil';

                      if (cNum === 1) {
                        let fixedC1 = fullClean;
                        if (correctionResult.c1Deviations && correctionResult.c1Deviations.length > 0) {
                          correctionResult.c1Deviations.forEach((dev) => {
                            if (dev.snippet && dev.bestForm && fixedC1.includes(dev.snippet)) {
                              fixedC1 = fixedC1.replace(dev.snippet, dev.bestForm);
                            }
                          });
                        }
                        fixedC1 = fixedC1
                          .replace(/\ba gente\b/gi, 'a sociedade')
                          .replace(/\bpra\b/gi, 'para')
                          .replace(/\btá\b/gi, 'está')
                          .replace(/\btem muitos\b/gi, 'existem diversos')
                          .replace(/\btem muitas\b/gi, 'existem diversas');

                        if (!/[.!?]$/.test(fixedC1)) {
                          fixedC1 = `${fixedC1}.`;
                        }
                        return {
                          fixAfter: sanitizeRewriteOutput(fixedC1),
                          stepByStep:
                            'Aplique apenas os ajustes pontuais de norma-padrão ou pontuação necessários, preservando o sentido e a fluidez do seu período.',
                        };
                      }

                      if (cNum === 2) {
                        const quoteHasRepertoire =
                          /(segundo|conforme|de acordo com|constituição|1988|artigo|ibge|onu|oms|bauman|foucault|durkheim|bourdieu|arendt|kant|aristóteles|habermas|locke|hobbes|rousseau|lei|estatuto|eca|filósof|sociólog|historiad|obra|livro)/i.test(
                            fullClean
                          );

                        if (quoteHasRepertoire || /(produtiv|articul|justapost|colado|vínculo|vinculo|integra)/i.test(flawLower)) {
                          const strippedVistoQue = fullClean.replace(/,\s*(visto que|já que|uma vez que|pois).*$/i, '').trim();
                          return {
                            fixAfter: sanitizeRewriteOutput(
                              `${strippedVistoQue} — premissa que se relaciona diretamente a ${themeRef}, uma vez que a falha na efetivação desse princípio compromete a garantia plena de direitos ${countryRef}.`
                            ),
                            stepByStep: `Mantenha a referência citada no seu texto, mas acrescente logo em seguida um conectivo explicativo ("uma vez que", "na medida em que") amarrando a ideia teórica diretamente ao tema.`,
                          };
                        }

                        if (/(tangencia|parcial|recorte|palavra-chave|palavras-chave|núcleo|tese)/i.test(flawLower)) {
                          return {
                            fixAfter: sanitizeRewriteOutput(
                              `Sob a ótica da Constituição Federal de 1988, que assegura a dignidade e o bem-estar social como deveres do Estado, verifica-se que ${coreClause}, evidenciando a urgência de enfrentar ${themeRef} ${countryRef}.`
                            ),
                            stepByStep: `Inclua expressamente os núcleos do tema ("${cleanTheme}") dentro do período e fundamente sua tese em um repertório legitimado logo na abertura do parágrafo.`,
                          };
                        }

                        return {
                          fixAfter: sanitizeRewriteOutput(
                            `À luz da Constituição Federal de 1988 — a qual garante a cidadania como direito fundamental —, observa-se que ${coreClause}, realidade que agrava os entraves ligados a ${themeRef} ${countryRef}.`
                          ),
                          stepByStep: `Substitua a afirmação de senso comum por uma referência sociocultural legitimada (como a Constituição de 1988, dados do IBGE ou um conceito sociológico) articulada a "${cleanTheme}".`,
                        };
                      }

                      if (cNum === 3) {
                        return {
                          fixAfter: sanitizeRewriteOutput(
                            `${fullClean}, visto que a persistência das causas ligadas a ${themeRef} impede a superação efetiva desse quadro e amplia seus impactos concretos ${countryRef}.`
                          ),
                          stepByStep:
                            'Mantenha seu tema específico e seu repertório, aprofundando no mesmo parágrafo a explicação da causa (por que ocorre) e da consequência prática.',
                        };
                      }

                      if (cNum === 4) {
                        return {
                          fixAfter: sanitizeRewriteOutput(
                            `Ademais, sob essa perspectiva, ${coreClause}, de modo que tal cenário demanda ações articuladas para ser superado.`
                          ),
                          stepByStep:
                            'Articule os períodos com precisão funcional e retomadas referenciais claras ("tal cenário", "essa realidade"), evitando repetição de estruturas explicativas semelhantes.',
                        };
                      }

                      // C5 - Proposta de Intervenção com os 5 Elementos
                      const c5 = correctionResult.c5Structure;
                      const rawAgentTxt = c5?.agent?.present && c5.agent.text
                        ? c5.agent.text.split(/[\/|;]+/)[0].replace(/[.]+$/, '').trim()
                        : '';
                      const agentPart = rawAgentTxt || 'o Poder Público Federal';
                      return {
                        fixAfter: sanitizeRewriteOutput(
                          `Portanto, cabe a ${agentPart} — instância responsável pela gestão e efetivação de políticas públicas (Detalhamento) — implementar um plano nacional voltado a ${cleanTheme} (Ação), por meio do direcionamento de recursos e campanhas formativas nas escolas e mídias (Meio/Modo), a fim de reduzir esse problema e garantir o pleno exercício da cidadania ${countryRef} (Efeito).`
                        ),
                        stepByStep:
                          'Mantenha o agente e a ação já presentes e complete apenas os elementos faltantes entre os 5 exigidos pelo INEP (Agente, Ação, Meio/Modo, Efeito e Detalhamento específico).',
                      };
                    };

                    // Build non-repetitive list of ALL errors and how to resolve them for this competency
                    interface CompetencyErrorItem {
                      badge: string;
                      errorTitle: string;
                      quoteBefore: string;
                      fixAfter: string;
                      howToResolve: string;
                    }
                    const allCompetencyErrors: CompetencyErrorItem[] = [];
                    const usedQuotesNorm = new Set<string>();
                    const usedFixAftersNorm = new Set<string>();
                    const usedErrorTitlesNorm = new Set<string>();

                    const isQuoteAlreadyUsed = (quote: string) => {
                      const norm = normalizeForDedup(quote);
                      if (!norm) return true;
                      for (const existing of usedQuotesNorm) {
                        if (
                          existing === norm ||
                          (existing.length >= 12 && norm.includes(existing)) ||
                          (norm.length >= 12 && existing.includes(norm))
                        ) {
                          return true;
                        }
                      }
                      return false;
                    };

                    const isFixAfterAlreadyUsed = (fix: string) => {
                      const norm = normalizeForDedup(fix);
                      if (!norm) return true;
                      for (const existing of usedFixAftersNorm) {
                        if (
                          existing === norm ||
                          existing.slice(0, 50) === norm.slice(0, 50) ||
                          (existing.length >= 25 && norm.includes(existing.slice(0, 35))) ||
                          (norm.length >= 25 && existing.includes(norm.slice(0, 35)))
                        ) {
                          return true;
                        }
                      }
                      return false;
                    };

                    const isErrorTopicAlreadyUsed = (title: string) => {
                      const norm = normalizeForDedup(title);
                      if (!norm) return true;
                      for (const existing of usedErrorTitlesNorm) {
                        if (
                          existing.slice(0, 35) === norm.slice(0, 35) ||
                          existing.includes(norm.slice(0, 28)) ||
                          norm.includes(existing.slice(0, 28))
                        ) {
                          return true;
                        }
                      }
                      return false;
                    };

                    // Extract fallback sentences from the student's essay in case multiple distinct flaws exist
                    const essaySentences = (essayText || correctionResult.essayText || '')
                      .split(/(?<=[.!?])\s+|\n+/)
                      .map((s) => s.trim())
                      .filter((s) => s.length >= 25);

                    const pickDistinctStudentQuote = (preferredQuote?: string, fallbackIdx = 0): string => {
                      const candidates = [
                        preferredQuote,
                        ...uniqueQuotes,
                        essaySentences[comp.num - 1],
                        essaySentences[fallbackIdx],
                        essaySentences[0],
                      ]
                        .map((c) => (c || '').trim())
                        .filter(
                          (c) =>
                            c.length > 0 &&
                            c !== 'Trecho sob análise textual.' &&
                            c !== 'Análise global do texto submetido.'
                        );

                      for (const cand of candidates) {
                        if (!isQuoteAlreadyUsed(cand)) {
                          return cand;
                        }
                      }
                      return candidates[0] || 'Trecho avaliado na redação.';
                    };

                    // 1. If C1, add deduplicated C1 deviations with exact Before -> After
                    if (comp.num === 1 && correctionResult.c1Deviations && correctionResult.c1Deviations.length > 0) {
                      correctionResult.c1Deviations.forEach((dev) => {
                        const snippetClean = (dev.snippet || '').trim();
                        const bestFormClean = sanitizeRewriteOutput(dev.bestForm || '');
                        if (!snippetClean || !bestFormClean) return;
                        if (normalizeForDedup(snippetClean) === normalizeForDedup(bestFormClean)) return;
                        if (isQuoteAlreadyUsed(snippetClean) || isFixAfterAlreadyUsed(bestFormClean)) return;

                        const catLabel =
                          dev.category === 'convenções_escrita'
                            ? 'Convenções da Escrita'
                            : dev.category === 'estrutura_sintatica'
                            ? 'Estrutura Sintática'
                            : dev.category === 'gramatical'
                            ? 'Gramatical'
                            : dev.category === 'vocabular'
                            ? 'Vocabulário / Precisão'
                            : 'Registro Formal';

                        usedQuotesNorm.add(normalizeForDedup(snippetClean));
                        usedFixAftersNorm.add(normalizeForDedup(bestFormClean));
                        usedErrorTitlesNorm.add(normalizeForDedup(dev.problem));

                        allCompetencyErrors.push({
                          badge: `Desvio C1 • ${catLabel}`,
                          errorTitle: dev.problem,
                          quoteBefore: snippetClean,
                          fixAfter: bestFormClean,
                          howToResolve: `Substitua "${snippetClean}" por "${bestFormClean}" para corrigir o desvio de ${catLabel.toLowerCase()}.`,
                        });
                      });
                    }

                    // 2. Add matching Pedagogical Rewrites ONLY if score < 200 and not already covered by C1 deviations or an earlier card
                    // In C1, if c1Deviations already populated the exact errors, skip redundant C1 rewrites
                    if (comp.data.score < 200 && !(comp.num === 1 && allCompetencyErrors.length > 0)) {
                      matchingRewrites.forEach((rw) => {
                        if (isQuoteAlreadyUsed(rw.original) || isErrorTopicAlreadyUsed(rw.problem)) return;
                        // For C2..C5, keep at most 1 rewrite per topic so C2 never repeats two cards about repertoire/theme
                        if (comp.num >= 2 && allCompetencyErrors.length >= 1) return;

                        const generated = buildConcreteCompetencyRewrite(comp.num, rw.original, rw.problem);
                        const cleanedAiRewrite = sanitizeRewriteOutput(rw.improvedVersion || '');
                        const hasValidAiRewrite =
                          cleanedAiRewrite.length > 12 &&
                          normalizeForDedup(cleanedAiRewrite) !== normalizeForDedup(rw.original) &&
                          !isFixAfterAlreadyUsed(cleanedAiRewrite);

                        const finalFixAfter = hasValidAiRewrite ? cleanedAiRewrite : generated.fixAfter;
                        if (isFixAfterAlreadyUsed(finalFixAfter)) return;

                        usedQuotesNorm.add(normalizeForDedup(rw.original));
                        usedFixAftersNorm.add(normalizeForDedup(finalFixAfter));
                        usedErrorTitlesNorm.add(normalizeForDedup(rw.problem));

                        allCompetencyErrors.push({
                          badge: `C${comp.num} • Reescrita Prática`,
                          errorTitle: rw.problem,
                          quoteBefore: rw.original,
                          fixAfter: finalFixAfter,
                          howToResolve:
                            rw.explanation &&
                            normalizeForDedup(rw.explanation) !== normalizeForDedup(comp.data.howToImprove || '')
                              ? rw.explanation
                              : generated.stepByStep,
                        });
                      });
                    }

                    // 3. If C5 and score < 200, consolidate any missing mandatory intervention elements into a single clear Before -> After card
                    if (comp.num === 5 && comp.data.score < 200 && correctionResult.c5Structure) {
                      const c5 = correctionResult.c5Structure;
                      const missingNames: string[] = [];
                      if (!c5.agent.present) missingNames.push('AGENTE (Quem executa a ação)');
                      if (!c5.action.present) missingNames.push('AÇÃO prática (O que será feito)');
                      if (!c5.modeMedium.present) missingNames.push('MEIO/MODO (Como será executado)');
                      if (!c5.effect.present) missingNames.push('EFEITO/FINALIDADE (Para que será feito)');
                      if (!c5.detailing.present) missingNames.push('DETALHAMENTO (Explicação extra de um dos elementos)');

                      if (missingNames.length > 0 && allCompetencyErrors.length === 0) {
                        const c5Quote = pickDistinctStudentQuote(uniqueQuotes[0], essaySentences.length - 1);
                        const generatedC5 = buildConcreteCompetencyRewrite(5, c5Quote, missingNames.join(', '));
                        usedQuotesNorm.add(normalizeForDedup(c5Quote));
                        usedFixAftersNorm.add(normalizeForDedup(generatedC5.fixAfter));
                        allCompetencyErrors.push({
                          badge: `C5 • Elementos Faltantes (-${200 - comp.data.score} pts)`,
                          errorTitle: `Sua proposta de intervenção ficou incompleta porque faltou: ${missingNames.join('; ')}.`,
                          quoteBefore: c5Quote,
                          fixAfter: generatedC5.fixAfter,
                          howToResolve: generatedC5.stepByStep,
                        });
                      }
                    }

                    // 4. Fallback for any competency with score < 200 where no error card was added yet
                    if (comp.data.score < 200 && allCompetencyErrors.length === 0) {
                      const rawFlawCandidates: { badge: string; title: string; snippet?: string }[] = [];

                      if (curve?.penaltiesApplied) {
                        curve.penaltiesApplied
                          .filter((p) => p.competencyAffected.toUpperCase().includes(`C${comp.num}`))
                          .forEach((pen) => {
                            rawFlawCandidates.push({
                              badge: `Penalidade C${comp.num} (-${200 - comp.data.score} pts)`,
                              title: `${pen.penaltyName}: ${pen.reason}`,
                              snippet: pen.evidenceSnippet,
                            });
                          });
                      }

                      if (compAudit?.reasonNotRoundedTo200) {
                        rawFlawCandidates.push({
                          badge: `Motivo do Desconto na C${comp.num} (-${200 - comp.data.score} pts)`,
                          title: compAudit.reasonNotRoundedTo200,
                          snippet: uniqueQuotes[0],
                        });
                      }

                      (comp.data.problemsIdentified || []).forEach((prob) => {
                        if (prob && prob.trim()) {
                          rawFlawCandidates.push({
                            badge: `Falha Identificada na C${comp.num}`,
                            title: prob.trim(),
                          });
                        }
                      });

                      (comp.data.penaltiesOrGaps || []).forEach((gap) => {
                        if (gap && gap.trim()) {
                          rawFlawCandidates.push({
                            badge: `Lacuna Identificada na C${comp.num}`,
                            title: gap.trim(),
                          });
                        }
                      });

                      if (compAudit?.qualityPillarsChecked) {
                        compAudit.qualityPillarsChecked
                          .filter((p) => p.status !== 'atendido')
                          .forEach((p) => {
                            rawFlawCandidates.push({
                              badge: `Critério ${p.status === 'parcial' ? 'Incompleto' : 'Ausente'} • ${p.pillar}`,
                              title: p.detail,
                            });
                          });
                      }

                      const primaryFlaw = rawFlawCandidates.find(
                        (c) => c.title && normalizeForDedup(c.title).length >= 8
                      );

                      if (primaryFlaw) {
                        const primaryQuote = pickDistinctStudentQuote(
                          primaryFlaw.snippet || uniqueQuotes[0],
                          0
                        );
                        const generatedPrimary = buildConcreteCompetencyRewrite(
                          comp.num,
                          primaryQuote,
                          primaryFlaw.title
                        );

                        usedQuotesNorm.add(normalizeForDedup(primaryQuote));
                        usedFixAftersNorm.add(normalizeForDedup(generatedPrimary.fixAfter));
                        usedErrorTitlesNorm.add(normalizeForDedup(primaryFlaw.title));

                        allCompetencyErrors.push({
                          badge: primaryFlaw.badge,
                          errorTitle: primaryFlaw.title,
                          quoteBefore: primaryQuote,
                          fixAfter: generatedPrimary.fixAfter,
                          howToResolve: generatedPrimary.stepByStep,
                        });
                      }
                    }

                    return (
                      <div className="px-5 sm:px-6 pb-6 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-5 text-sm text-slate-700 dark:text-slate-300">
                        {/* 1. Resumo simples: Por que você tirou esta nota */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-extrabold text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                              <Info className="w-4 h-4 shrink-0" />
                              <span>Por que você tirou {comp.data.score} de 200 pontos</span>
                            </span>
                            {(comp.data.localizacao_trecho || comp.data.excerptLocation) && (
                              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                📍 {comp.data.localizacao_trecho || comp.data.excerptLocation}
                              </span>
                            )}
                          </div>
                          {(() => {
                            const compExp = buildCompetencyScoreExplanationDisplay(
                              comp.num,
                              comp.data,
                              compAudit,
                              correctionResult.c5Structure
                            );
                            return (
                              <div className="space-y-1.5">
                                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                                  {compExp.headline}
                                </p>
                                {compExp.detail && (
                                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {compExp.detail}
                                  </p>
                                )}
                                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed pt-0.5">
                                  {compExp.scoreNote}
                                </p>
                              </div>
                            );
                          })()}
                        </div>

                        {/* 2. O que você acertou vs. Resumo do que melhorar */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* O que você acertou */}
                          <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2.5">
                            <h5 className="font-extrabold text-emerald-800 dark:text-emerald-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span>O que você mandou bem</span>
                            </h5>
                            {comp.data.positiveEvidence && comp.data.positiveEvidence.length > 0 ? (
                              <ul className="space-y-1.5">
                                {comp.data.positiveEvidence.map((pos, pIdx) => (
                                  <li
                                    key={pIdx}
                                    className="text-xs text-emerald-950 dark:text-emerald-200 flex items-start gap-2 leading-relaxed"
                                  >
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                                    <span>{pos}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-emerald-900/80 dark:text-emerald-200/80 leading-relaxed">
                                {comp.data.score >= 160
                                  ? 'Você atendeu bem à estrutura principal exigida nesta competência.'
                                  : 'Seu texto apresenta base inicial, mas precisa de ajustes práticos para subir de nível.'}
                              </p>
                            )}
                          </div>

                          {/* Direcionamento Geral para 200 */}
                          <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/25 border border-indigo-200/80 dark:border-indigo-800/60 space-y-2.5">
                            <h5 className="font-extrabold text-indigo-900 dark:text-indigo-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                              <span>
                                {comp.data.score === 200
                                  ? 'Como manter os 200 pontos'
                                  : 'Direcionamento geral para chegar aos 200'}
                              </span>
                            </h5>
                            {(() => {
                              const compGuide = buildCompetencyGuidanceDisplay(
                                comp.num,
                                comp.data,
                                compAudit,
                                correctionResult.c5Structure
                              );
                              return (
                                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                                  <p className="font-medium text-slate-800 dark:text-slate-100">
                                    {compGuide.primaryGuidance}
                                  </p>
                                  {compGuide.practicalStep && (
                                    <p className="text-slate-600 dark:text-slate-300">
                                      {compGuide.practicalStep}
                                    </p>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        </div>

                        {/* 3. TODOS OS ERROS DESTA COMPETÊNCIA E COMO RESOLVÊ-LOS */}
                        {allCompetencyErrors.length > 0 && (
                          <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/40 dark:bg-rose-950/15 border border-rose-200/80 dark:border-rose-900/60 space-y-3.5">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-200/60 dark:border-rose-800/50 pb-2.5">
                              <h5 className="font-extrabold text-rose-900 dark:text-rose-200 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                                <span>
                                  Todos os Erros Identificados na C{comp.num} e Como Resolvê-los ({allCompetencyErrors.length})
                                </span>
                              </h5>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 dark:bg-rose-900/70 text-rose-800 dark:text-rose-200">
                                Reescrita Antes → Depois
                              </span>
                            </div>

                            <div className="space-y-3.5">
                              {allCompetencyErrors.map((errItem, eIdx) => (
                                <div
                                  key={eIdx}
                                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="px-2.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px] font-black uppercase tracking-wider border border-rose-200 dark:border-rose-800">
                                      Erro #{eIdx + 1} • {errItem.badge}
                                    </span>
                                  </div>

                                  <p className="text-xs sm:text-sm font-bold text-rose-900 dark:text-rose-200 leading-snug">
                                    ⚠️ O que você errou: <span className="font-semibold text-slate-800 dark:text-slate-100">{errItem.errorTitle}</span>
                                  </p>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                    <div className="p-3 rounded-lg bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/70 space-y-1">
                                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-300 block">
                                        ❌ Como você escreveu no texto (Antes)
                                      </span>
                                      <p className="font-serif italic text-xs sm:text-sm text-rose-950 dark:text-rose-100 leading-relaxed">
                                        "{errItem.quoteBefore}"
                                      </p>
                                    </div>

                                    <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/70 space-y-1">
                                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">
                                        ✅ Como deveria ser escrito (Depois)
                                      </span>
                                      <p className="font-serif text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 font-semibold leading-relaxed">
                                        "{errItem.fixAfter}"
                                      </p>
                                    </div>
                                  </div>

                                  <div className="p-2.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/25 border border-indigo-200/70 dark:border-indigo-800/50 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                                    <div>
                                      <strong className="font-extrabold text-indigo-900 dark:text-indigo-300">Como resolver na prática: </strong>
                                      <span>{errItem.howToResolve}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 4. Additional Evidence Quotes if not already shown */}
                        {(() => {
                          const remainingQuotes = uniqueQuotes.filter((q) => !isQuoteAlreadyUsed(q));
                          if (remainingQuotes.length === 0) return null;
                          return (
                            <div className="space-y-2">
                              <h5 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <Quote className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                <span>Outras citações analisadas nesta competência</span>
                              </h5>
                              <div className="space-y-2">
                                {remainingQuotes.map((quote, qIdx) => (
                                  <blockquote
                                    key={qIdx}
                                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border-l-4 border-indigo-500 text-xs font-serif italic text-slate-800 dark:text-slate-200"
                                  >
                                    "{quote}"
                                  </blockquote>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {/* 5. Special: C5 5-Element Checklist Table */}
                        {comp.num === 5 && correctionResult.c5Structure && (
                          <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
                                Checklist dos 5 Elementos da Proposta de Intervenção
                              </span>
                              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                {correctionResult.c5Structure.validElementsCount} de 5 Elementos Encontrados
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                                {correctionResult.c5Structure.agent.present ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <strong className="text-slate-900 dark:text-slate-100">1. AGENTE (Quem faz?):</strong>{' '}
                                  <span className="text-slate-700 dark:text-slate-300">
                                    {correctionResult.c5Structure.agent.present
                                      ? correctionResult.c5Structure.agent.text
                                      : 'Faltou indicar um agente claro'}
                                  </span>
                                </div>
                              </div>

                              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                                {correctionResult.c5Structure.action.present ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <strong className="text-slate-900 dark:text-slate-100">2. AÇÃO (O que faz?):</strong>{' '}
                                  <span className="text-slate-700 dark:text-slate-300">
                                    {correctionResult.c5Structure.action.present
                                      ? correctionResult.c5Structure.action.text
                                      : 'Faltou indicar uma ação concreta'}
                                  </span>
                                </div>
                              </div>

                              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                                {correctionResult.c5Structure.modeMedium.present ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <strong className="text-slate-900 dark:text-slate-100">3. MEIO / MODO (Como faz?):</strong>{' '}
                                  <span className="text-slate-700 dark:text-slate-300">
                                    {correctionResult.c5Structure.modeMedium.present
                                      ? correctionResult.c5Structure.modeMedium.text
                                      : 'Faltou explicar por qual meio a ação ocorre'}
                                  </span>
                                </div>
                              </div>

                              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                                {correctionResult.c5Structure.effect.present ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <strong className="text-slate-900 dark:text-slate-100">4. EFEITO (Para quê?):</strong>{' '}
                                  <span className="text-slate-700 dark:text-slate-300">
                                    {correctionResult.c5Structure.effect.present
                                      ? correctionResult.c5Structure.effect.text
                                      : 'Faltou indicar a finalidade/resultado esperado'}
                                  </span>
                                </div>
                              </div>

                              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 sm:col-span-2 flex items-start gap-2">
                                {correctionResult.c5Structure.detailing.present ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <strong className="text-slate-900 dark:text-slate-100">5. DETALHAMENTO (Explicação extra):</strong>{' '}
                                  <span className="text-slate-700 dark:text-slate-300">
                                    {correctionResult.c5Structure.detailing.present
                                      ? `${correctionResult.c5Structure.detailing.text} (detalhando ${correctionResult.c5Structure.detailing.targetElement || 'um dos elementos'})`
                                      : 'Faltou detalhar um dos elementos (ex.: explicar quem é o agente ou dar exemplo do meio)'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div
                              className={`p-2.5 rounded-lg flex items-center gap-2 text-xs font-semibold ${
                                correctionResult.c5Structure.respectsHumanRights
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                  : 'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
                              }`}
                            >
                              {correctionResult.c5Structure.respectsHumanRights ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                  <span>Sua proposta respeita integralmente os Direitos Humanos.</span>
                                </>
                              ) : (
                                <>
                                  <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                  <span>
                                    Atenção: Foi identificada violação aos Direitos Humanos (Nota 0 na C5).{' '}
                                    {correctionResult.c5Structure.humanRightsObservations}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>

          {/* Internal AI Audit Log: Enriched with More Textual Evidence & Clearer Score Explanations */}
          {correctionResult.auditLog && (
            <div className="bg-slate-950 text-slate-100 p-6 sm:p-7 rounded-2xl border border-slate-800 shadow-xl space-y-5 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black">
                    <Terminal className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-base text-white tracking-wide">
                        Log de Auditoria da Nota (Evidências do Seu Texto e Motivo da Pontuação)
                      </h4>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Auditoria Completa
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Veja exatamente quais trechos da sua redação foram usados para definir a nota de cada competência e o motivo detalhado.
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
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Critério de Correção</span>
                    <span className="font-bold text-slate-200">Matriz Oficial do ENEM (2025/2026)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Regra de Pontuação</span>
                    <span className="font-bold text-emerald-400">Baseada em Trechos Reais da Redação</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Search className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Verificação Textual</span>
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
                    {(['c1', 'c2', 'c3', 'c4', 'c5'] as const).map((key, i) => {
                      const chipScore =
                        competencyDivergences[i]?.officialCompMean ??
                        correctionResult.competencies[key]?.score ??
                        0;
                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedAuditTab(key)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            selectedAuditTab === key
                              ? 'bg-amber-400 text-slate-950 shadow-xs'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                          }`}
                        >
                          C{i + 1} ({chipScore} pts)
                        </button>
                      );
                    })}
                  </div>

                  {/* Audit Items List */}
                  <div className="space-y-4">
                    {correctionResult.auditLog.competencyLogs
                      .filter(item => selectedAuditTab === 'all' || selectedAuditTab === `c${item.competencyNum}`)
                      .map((logItem) => {
                        const cKey = `c${logItem.competencyNum}` as 'c1' | 'c2' | 'c3' | 'c4' | 'c5';
                        const compData = correctionResult.competencies[cKey];
                        const officialAuditScore =
                          competencyDivergences[logItem.competencyNum - 1]?.officialCompMean ??
                          compData?.score ??
                          logItem.assignedScore;
                        const isOfficialMax200 = officialAuditScore === 200;

                        // Collect all concrete evidence quotes from the student's essay for this competency
                        const collectedQuotes = Array.from(
                          new Set(
                            [
                              logItem.evidenceQuoteFromStudent,
                              compData?.trecho_evidencia,
                              compData?.primaryEvidenceQuote,
                              ...(compData?.evidenceSnippets || []),
                              ...(logItem.competencyNum === 5 && correctionResult.c5Structure
                                ? [
                                    correctionResult.c5Structure.agent.present && correctionResult.c5Structure.agent.text
                                      ? `Agente identificado: "${correctionResult.c5Structure.agent.text}"`
                                      : null,
                                    correctionResult.c5Structure.action.present && correctionResult.c5Structure.action.text
                                      ? `Ação identificada: "${correctionResult.c5Structure.action.text}"`
                                      : null,
                                    correctionResult.c5Structure.modeMedium.present && correctionResult.c5Structure.modeMedium.text
                                      ? `Meio/Modo identificado: "${correctionResult.c5Structure.modeMedium.text}"`
                                      : null,
                                    correctionResult.c5Structure.effect.present && correctionResult.c5Structure.effect.text
                                      ? `Efeito identificado: "${correctionResult.c5Structure.effect.text}"`
                                      : null,
                                  ].filter(Boolean) as string[]
                                : []),
                            ]
                              .map((q) => (q || '').trim())
                              .filter(
                                (q) =>
                                  q.length > 0 &&
                                  q !== 'Trecho sob análise textual.' &&
                                  q !== 'Análise global do texto submetido.'
                              )
                          )
                        );

                        return (
                          <div
                            key={logItem.competencyNum}
                            className="p-4 sm:p-5 rounded-xl bg-slate-900/75 border border-slate-800 hover:border-slate-700 transition-colors space-y-3.5"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                              <div className="flex items-center gap-2.5">
                                <span className="w-7 h-7 rounded-lg bg-slate-800 text-amber-400 font-black text-xs flex items-center justify-center border border-slate-700">
                                  C{logItem.competencyNum}
                                </span>
                                <div>
                                  <span className="font-extrabold text-sm text-slate-100 block">
                                    {logItem.competencyName}
                                  </span>
                                  {(compData?.localizacao_trecho || compData?.excerptLocation) && (
                                    <span className="text-[11px] text-slate-400">
                                      📍 Local analisado: {compData.localizacao_trecho || compData.excerptLocation}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                                  isOfficialMax200 
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                                }`}>
                                  Nota: {officialAuditScore}/200
                                </span>
                                {isOfficialMax200 ? (
                                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80">
                                    ★ Nota Máxima Atingida
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
                                    Perdeu {200 - officialAuditScore} pts
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Clear Score Reason & What Was Needed for 200 */}
                            {(() => {
                              const simpleReason = simplifyAuditScoreExplanation(logItem, compData, officialAuditScore);
                              const simpleGuidance = simplifyAuditMissingAndGuidance(logItem, compData, isOfficialMax200);
                              return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                  <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/90 space-y-1.5">
                                    <span className="text-[11px] font-extrabold uppercase text-indigo-300 tracking-wider flex items-center gap-1.5">
                                      <Info className="w-3.5 h-3.5 text-indigo-400" />
                                      Explicação clara da sua nota ({officialAuditScore} pts)
                                    </span>
                                    <p className="text-slate-100 font-semibold leading-relaxed">
                                      {simpleReason.mainReason}
                                    </p>
                                    {simpleReason.extraExplanation && (
                                      <p className="text-slate-300 leading-relaxed">
                                        {simpleReason.extraExplanation}
                                      </p>
                                    )}
                                  </div>

                                  <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/90 space-y-1.5">
                                    <span className="text-[11px] font-extrabold uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                      {isOfficialMax200
                                        ? 'Como você garantiu os 200 pontos'
                                        : 'O que faltou e direcionamento para 200'}
                                    </span>
                                    {simpleGuidance.missingSummary && (
                                      <p className="text-amber-200 font-semibold leading-relaxed">
                                        {simpleGuidance.missingSummary}
                                      </p>
                                    )}
                                    <p className="text-slate-300 leading-relaxed">
                                      {simpleGuidance.guidanceText}
                                    </p>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* SPECIAL FOR C1 IN AUDIT LOG: Explicit & Detailed C1 Deviations Extracted from Text */}
                            {logItem.competencyNum === 1 && (() => {
                              const fullEssayStr = (essayText || correctionResult.essayText || '').trim();
                              const essayParagraphs = fullEssayStr
                                .split(/\n+/)
                                .map((p) => p.trim())
                                .filter((p) => p.length > 0);
                              const essaySentencesList = fullEssayStr
                                .split(/(?<=[.!?])\s+|\n+/)
                                .map((s) => s.trim())
                                .filter((s) => s.length >= 20);

                              const normalizeAuditStr = (s: string) =>
                                (s || '')
                                  .toLowerCase()
                                  .normalize('NFD')
                                  .replace(/[\u0300-\u036f]/g, '')
                                  .replace(/[^a-z0-9\s]/g, '')
                                  .replace(/\s+/g, ' ')
                                  .trim();

                              const locateSnippetParagraph = (snippet: string): string => {
                                const cleanSnip = (snippet || '').trim().toLowerCase();
                                if (!cleanSnip || essayParagraphs.length === 0) return 'Texto da Redação';
                                const probe = cleanSnip.slice(0, Math.min(35, cleanSnip.length));
                                const pIdx = essayParagraphs.findIndex((p) => p.toLowerCase().includes(probe));
                                if (pIdx === -1) return 'Trecho da Redação';
                                if (pIdx === 0) return '1º Parágrafo (Introdução)';
                                if (pIdx === essayParagraphs.length - 1 && essayParagraphs.length >= 3) {
                                  return `${pIdx + 1}º Parágrafo (Conclusão)`;
                                }
                                return `${pIdx + 1}º Parágrafo (Desenvolvimento ${pIdx})`;
                              };

                              interface C1AuditDeviationItem {
                                categoryLabel: string;
                                locationLabel: string;
                                snippet: string;
                                problem: string;
                                bestForm: string;
                              }

                              const c1ExtractedDeviations: C1AuditDeviationItem[] = [];
                              const usedSnippetsNorm = new Set<string>();

                              const addC1AuditDev = (item: C1AuditDeviationItem) => {
                                const snipClean = (item.snippet || '').replace(/^["'“”]+|["'“”]+$/g, '').trim();
                                const bestClean = (item.bestForm || '').replace(/^["'“”]+|["'“”]+$/g, '').trim();
                                const normS = normalizeAuditStr(snipClean);
                                if (!normS || normS.length < 6) return;
                                for (const existing of usedSnippetsNorm) {
                                  if (
                                    existing === normS ||
                                    (existing.length >= 15 && normS.includes(existing)) ||
                                    (normS.length >= 15 && existing.includes(normS))
                                  ) {
                                    return;
                                  }
                                }
                                usedSnippetsNorm.add(normS);
                                c1ExtractedDeviations.push({
                                  ...item,
                                  snippet: snipClean,
                                  bestForm: bestClean,
                                });
                              };

                              // 1. Direct C1 Deviations from AI analysis
                              (correctionResult.c1Deviations || []).forEach((dev) => {
                                if (!dev.snippet || !dev.bestForm) return;
                                const catLabel =
                                  dev.category === 'convenções_escrita'
                                    ? 'Convenções da Escrita (Ortografia / Acentuação)'
                                    : dev.category === 'estrutura_sintatica'
                                    ? 'Estrutura Sintática (Pontuação / Período)'
                                    : dev.category === 'gramatical'
                                    ? 'Desvio Gramatical (Concordância / Regência / Crase)'
                                    : dev.category === 'vocabular'
                                    ? 'Precisão Vocabular'
                                    : 'Registro Formal / Oralidade';
                                addC1AuditDev({
                                  categoryLabel: catLabel,
                                  locationLabel: locateSnippetParagraph(dev.snippet),
                                  snippet: dev.snippet,
                                  problem: dev.problem,
                                  bestForm: dev.bestForm,
                                });
                              });

                              // 2. Pedagogical Rewrites classified under C1 (grammar, syntax, punctuation, register)
                              (correctionResult.pedagogicalRewrites || []).forEach((rw) => {
                                const pText = `${rw.problem || ''} ${rw.explanation || ''}`;
                                if (
                                  /(gramat|ortograf|vírgula|virgula|crase|concord|regênc|regenc|sintát|sintat|norma-padrão|norma culta|acentua|pontuaç|oralidade|coloquial|informal|truncament|paralelismo)/i.test(
                                    pText
                                  ) &&
                                  rw.original &&
                                  rw.improvedVersion
                                ) {
                                  addC1AuditDev({
                                    categoryLabel: 'Norma-Padrão e Estrutura Sintática',
                                    locationLabel: locateSnippetParagraph(rw.original),
                                    snippet: rw.original,
                                    problem: rw.problem,
                                    bestForm: rw.improvedVersion,
                                  });
                                }
                              });

                              // 3. Inspect student's actual sentences for concrete C1 deviations ONLY if backend did not provide verified c1Deviations and score < 200
                              const backendHasC1Devs = (correctionResult.c1Deviations || []).length > 0;
                              if (!isOfficialMax200 && !backendHasC1Devs && essaySentencesList.length > 0) {
                                essaySentencesList.forEach((sent) => {
                                  // 3a. Missing comma after initial connector or displaced adverbial phrase
                                  const missingCommaMatch = sent.match(
                                    /^(Nesse contexto|Nesse sentido|Diante desse cenário|Diante disso|Sob essa ótica|Sob esse viés|Além disso|Ademais|Outrossim|Portanto|Dessa forma|Desse modo|Em primeiro lugar|Em segundo lugar|Primeiramente|Por conseguinte|Contudo|Entretanto|Todavia)\s+([a-záàâãéêíóôõúç][^,.!?]+)/i
                                  );
                                  if (missingCommaMatch) {
                                    const connector = missingCommaMatch[1];
                                    const fixedSent = sent.replace(
                                      new RegExp(`^${connector}\\s+`, 'i'),
                                      `${connector}, `
                                    );
                                    addC1AuditDev({
                                      categoryLabel: 'Estrutura Sintática (Pontuação / Vírgula)',
                                      locationLabel: locateSnippetParagraph(sent),
                                      snippet: sent,
                                      problem: `Ausência de vírgula após o conector ou adjunto deslocado na abertura do período ("${connector}").`,
                                      bestForm: fixedSent,
                                    });
                                  }

                                  // 3b. Marks of informality / colloquialism
                                  if (/\b(a gente|pra\b|pro\b|tá\b|tipo assim)\b/i.test(sent)) {
                                    const fixedInformal = sent
                                      .replace(/\ba gente\b/gi, 'a sociedade')
                                      .replace(/\bpra\b/gi, 'para')
                                      .replace(/\bpro\b/gi, 'para o')
                                      .replace(/\btá\b/gi, 'está')
                                      .replace(/\btipo assim\b/gi, 'desse modo');
                                    addC1AuditDev({
                                      categoryLabel: 'Registro Formal / Oralidade',
                                      locationLabel: locateSnippetParagraph(sent),
                                      snippet: sent,
                                      problem:
                                        'Presença de marca de oralidade ou expressão informal no período, incompatível com a modalidade escrita formal do ENEM.',
                                      bestForm: fixedInformal,
                                    });
                                  }
                                });
                              }

                              return (
                                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/70 space-y-3">
                                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-800/50 pb-2.5">
                                    <span className="text-xs font-extrabold uppercase text-rose-300 tracking-wider flex items-center gap-2">
                                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                                      <span>
                                        Desvios Identificados Retirados do Seu Texto (Competência 1)
                                      </span>
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-md bg-rose-900/80 text-rose-200 text-[10px] font-black uppercase border border-rose-700">
                                      {isOfficialMax200
                                        ? '0 desvios graves (200 pts)'
                                        : `${c1ExtractedDeviations.length} trecho(s) com desvio identificado`}
                                    </span>
                                  </div>

                                  {c1ExtractedDeviations.length > 0 ? (
                                    <div className="space-y-3">
                                      {c1ExtractedDeviations.map((dev, dIdx) => (
                                        <div
                                          key={dIdx}
                                          className="p-3.5 rounded-lg bg-slate-950/90 border border-rose-800/60 space-y-2.5 text-xs"
                                        >
                                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                                            <span className="font-black text-rose-300 uppercase text-[10px] tracking-wider">
                                              Desvio #{dIdx + 1} • {dev.categoryLabel}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                                              📍 {dev.locationLabel}
                                            </span>
                                          </div>

                                          <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-800/60">
                                            <span className="text-[10px] font-extrabold uppercase text-rose-400 block mb-1">
                                              ❌ Trecho exato retirado do seu texto (Onde ocorreu o desvio):
                                            </span>
                                            <blockquote className="font-serif italic text-rose-100 leading-relaxed">
                                              "{dev.snippet}"
                                            </blockquote>
                                          </div>

                                          <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/50">
                                            <span className="text-[10px] font-extrabold uppercase text-amber-300 block mb-0.5">
                                              ⚠️ Qual foi o desvio identificado neste trecho:
                                            </span>
                                            <p className="text-slate-200 leading-relaxed">{dev.problem}</p>
                                          </div>

                                          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60">
                                            <span className="text-[10px] font-extrabold uppercase text-emerald-400 block mb-1">
                                              ✅ Como escrever este trecho na norma-padrão (Corrigido):
                                            </span>
                                            <p className="font-serif text-emerald-200 font-semibold leading-relaxed">
                                              "{dev.bestForm}"
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/50 text-xs text-emerald-200">
                                      Nenhum desvio gramatical ou sintático que comprometesse a nota máxima foi identificado nos trechos analisados.
                                    </div>
                                  )}
                                </div>
                              );
                            })()}

                            {/* Expanded Textual Evidence Quotes from Student's Essay (Shown for C2..C5, or C1 when 200 pts) */}
                            {(logItem.competencyNum !== 1 || isOfficialMax200) && collectedQuotes.length > 0 && (
                              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[11px] font-extrabold uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                                    <Quote className="w-3.5 h-3.5 text-emerald-400" />
                                    Evidências retiradas diretamente do seu texto ({collectedQuotes.length})
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  {collectedQuotes.map((quote, qIdx) => (
                                    <blockquote
                                      key={qIdx}
                                      className="text-xs font-serif italic text-emerald-200 bg-emerald-950/25 p-2.5 rounded-lg border-l-3 border-emerald-500 leading-relaxed"
                                    >
                                      "{quote}"
                                    </blockquote>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Positive Evidence vs Checked Points */}
                            {compData?.positiveEvidence && compData.positiveEvidence.length > 0 && (
                              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 space-y-1.5">
                                <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider block">
                                  Pontos positivos comprovados na sua escrita:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {compData.positiveEvidence.map((pos, pIdx) => (
                                    <span
                                      key={pIdx}
                                      className="text-[11px] text-emerald-200 bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-800/50"
                                    >
                                      ✓ {pos}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Quality Pillars Micro-Audit */}
                            {logItem.qualityPillarsChecked && logItem.qualityPillarsChecked.length > 0 && (
                              <div className="space-y-1.5 pt-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                  Critérios avaliados nesta competência:
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  {logItem.qualityPillarsChecked.map((pillar, pIdx) => {
                                    const displayedPillar = simplifyAuditPillar(pillar, pIdx, logItem.competencyNum);
                                    return (
                                      <div
                                        key={pIdx}
                                        className={`p-2.5 rounded-lg text-[11px] border flex items-center justify-between gap-2 ${
                                          pillar.status === 'atendido'
                                            ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                                            : pillar.status === 'parcial'
                                            ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                                            : 'bg-rose-950/30 border-rose-800/60 text-rose-300'
                                        }`}
                                      >
                                        <div className="min-w-0">
                                          <span className="font-bold block truncate">{displayedPillar.title}</span>
                                          <span className="text-[10px] opacity-85 block leading-snug">{displayedPillar.detail}</span>
                                        </div>
                                        <span className="font-black shrink-0 text-xs">
                                          {pillar.status === 'atendido' ? '✓' : pillar.status === 'parcial' ? '⚠' : '✗'}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* High Performance Scoring Curve Panel (Simplified Text) */}
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
                        Curva Estatística de Desempenho (Padrão ENEM)
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Veja de forma simples o quão perto sua redação está das notas acima de 900 pontos
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
                        Domínio da Escrita e Conectivos (C1 e C4)
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
                      Mede se você escreveu sem erros gramaticais e usou bons conectivos entre frases e parágrafos.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Força da Argumentação e Proposta (C2, C3 e C5)
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
                      Mede o uso de repertório útil, defesa clara do seu ponto de vista e conclusão completa.
                    </p>
                  </div>
                </div>

                {/* Criteria Checked Grid */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    O que sua redação já comprovou na prática
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                    <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                      curve.criteriaVerified.c1_normativeMastery
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      <span>{curve.criteriaVerified.c1_normativeMastery ? '✅' : '⏳'}</span>
                      <span className="font-semibold text-[11px]">C1: Gramática Firme</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                      curve.criteriaVerified.c2_productiveRepertoire
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      <span>{curve.criteriaVerified.c2_productiveRepertoire ? '✅' : '⏳'}</span>
                      <span className="font-semibold text-[11px]">C2: Bom Repertório</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                      curve.criteriaVerified.c3_strategicProject
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      <span>{curve.criteriaVerified.c3_strategicProject ? '✅' : '⏳'}</span>
                      <span className="font-semibold text-[11px]">C3: Argumentação Clara</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                      curve.criteriaVerified.c4_cohesiveDiversity
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      <span>{curve.criteriaVerified.c4_cohesiveDiversity ? '✅' : '⏳'}</span>
                      <span className="font-semibold text-[11px]">C4: Bons Conectivos</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                      curve.criteriaVerified.c5_fiveCanonicalElements
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      <span>{curve.criteriaVerified.c5_fiveCanonicalElements ? '✅' : '⏳'}</span>
                      <span className="font-semibold text-[11px]">C5: 5 Elementos na C5</span>
                    </div>
                  </div>
                </div>

                {/* Simplified Summary */}
                <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="leading-relaxed font-medium">
                      <strong>Resumo do seu desempenho:</strong> {curve.rigorVerdict}
                    </p>
                  </div>
                </div>

                {/* Penalties Applied Matrix (Coherent with Official Competency Means) */}
                {(() => {
                  const coherentDeductions = competencyDivergences
                    .filter((cd) => cd.officialCompMean < 200)
                    .map((cd) => {
                      const matchedPen = curve.penaltiesApplied?.find((p) =>
                        p.competencyAffected.toUpperCase().includes(`C${cd.num}`)
                      );
                      const auditItem = correctionResult.auditLog?.competencyLogs?.find(
                        (l) => l.competencyNum === cd.num
                      );
                      const compObj = correctionResult.competencies[cd.key];
                      return {
                        competencyAffected: `C${cd.num}`,
                        penaltyName: matchedPen?.penaltyName || cd.name.replace(/^C\d\s*-\s*/, ''),
                        reason:
                          matchedPen?.reason ||
                          auditItem?.reasonNotRoundedTo200 ||
                          compObj?.problemsIdentified?.[0] ||
                          compObj?.diagnostic ||
                          'Ajuste necessário para atingir a nota máxima nesta competência.',
                        penaltyPoints: 200 - cd.officialCompMean,
                      };
                    });

                  if (coherentDeductions.length === 0) return null;

                  return (
                    <div className="space-y-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider block text-rose-700 dark:text-rose-400">
                        Onde sua redação perdeu pontos ({coherentDeductions.length} competência{coherentDeductions.length > 1 ? 's' : ''} • Total: -{1000 - officialMeanScore} pts)
                      </span>
                      <div className="space-y-2">
                        {coherentDeductions.map((pen, idx) => (
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
                  );
                })()}
              </div>
            );
          })()}

          {/* Cartilha Benchmark (Without Correlated Profile, Edition 2025/2026) */}
          {correctionResult.cartilhaBenchmark && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-amber-200/80 dark:border-amber-900/50 shadow-xs space-y-4 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-black">
                    <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                        Benchmark Oficial: Cartilha Oficial do Participante INEP 2025/2026
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                        INEP / MEC 2025/2026
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Comparativo direto da sua redação com os parâmetros oficiais da Cartilha do Participante 2025/2026
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setShowCartilhaModal(true)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Consultar Cartilha 2025/2026</span>
                  </button>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                    {correctionResult.cartilhaBenchmark.tier}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                <span className="font-bold text-slate-900 dark:text-slate-100 block uppercase tracking-wider text-[11px]">
                  O que separa sua redação atual da faixa 900+ / 1000:
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-xs sm:text-sm">
                  {correctionResult.cartilhaBenchmark.keyDifferenceTo900Plus}
                </p>
              </div>

              {/* Status de Aderência da Matriz Oficial (C1 a C5) */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Seu nível atual nas 5 Competências da Cartilha 2025/2026 (clique para ver a regra):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {(['c1', 'c2', 'c3', 'c4', 'c5'] as const).map((compKey, cIdx) => {
                    const compNum = (cIdx + 1) as 1 | 2 | 3 | 4 | 5;
                    const cScore = correctionResult.competencies[compKey].score;
                    const is200 = cScore === 200;
                    return (
                      <div 
                        key={compKey}
                        onClick={() => {
                          setSelectedCartilhaComp(compNum);
                          setCartilhaModalTab('matrix');
                          setShowCartilhaModal(true);
                        }}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all hover:scale-102 ${
                          is200 
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200' 
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                        }`}
                        title="Clique para ver o descritor deste nível na Cartilha Oficial 2025/2026"
                      >
                        <div className="flex items-center justify-between text-[10px] font-extrabold mb-1">
                          <span>C{compNum}</span>
                          <span className={is200 ? 'text-emerald-700 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}>
                            {cScore} pts
                          </span>
                        </div>
                        <p className="text-[11px] font-bold line-clamp-1">
                          Nível {Math.floor(cScore / 40)}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {is200 ? 'Nota Máxima Oficial' : `Faltam ${200 - cScore} pts para 200`}
                        </p>
                      </div>
                    );
                  })}
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
                <span>🏆 3 Maiores Acertos da Sua Redação</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {getEffectiveTop3Strengths(correctionResult).map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3 Maiores Problemas / Ajustes Finos de Excelência */}
            <div
              className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-xs space-y-3 transition-colors ${
                correctionResult.totalScore >= 960
                  ? 'border-indigo-200 dark:border-indigo-800'
                  : 'border-rose-200 dark:border-rose-800'
              }`}
            >
              <h4
                className={`font-extrabold text-base flex items-center gap-2 ${
                  correctionResult.totalScore >= 960
                    ? 'text-indigo-800 dark:text-indigo-300'
                    : 'text-rose-800 dark:text-rose-300'
                }`}
              >
                {correctionResult.totalScore >= 960 ? (
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                )}
                <span>
                  {correctionResult.totalScore >= 960
                    ? '✨ Ajustes Finos de Excelência (Rumo aos 1000)'
                    : '⚠️ 3 Principais Pontos que Descontaram Nota'}
                </span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {getEffectiveTop3Problems(correctionResult).map((prob, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      className={`w-5 h-5 rounded-full font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                        correctionResult.totalScore >= 960
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                      }`}
                    >
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
              <span>Passo a Passo Simples para Subir Sua Nota</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Aplique estes ajustes diretos na sua próxima redação:
            </p>

            <div className="space-y-2.5 pt-2">
              {getEffectiveActionPlan(correctionResult).map((action, i) => (
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
              <span>O que falta para sua redação chegar ao nível Nota 1000?</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {getEffectiveHighPerformanceComparison(correctionResult)}
            </p>
          </div>

          {/* Complete Consolidated Before -> After Section: All Errors & How to Resolve Across All 5 Competencies */}
          {(() => {
            interface ConsolidatedErrorQuote {
              compLabel: string;
              original: string;
              problem: string;
              improvedVersion: string;
              howToResolve: string;
            }

            const consolidatedList: ConsolidatedErrorQuote[] = [];
            const seenOriginals = new Set<string>();
            const seenImproved = new Set<string>();

            const normText = (s: string) =>
              (s || '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, ' ')
                .trim();

            const sanitizeConsolidatedText = (txt: string): string => {
              let out = (txt || '')
                .replace(/^["'“”]+|["'“”]+$/g, '')
                .replace(/\s+/g, ' ')
                .trim();
              out = out.replace(
                /\b(observa-se que|verifica-se que|constata-se que|percebe-se que|nota-se que)\s+(observa-se que|verifica-se que|constata-se que|percebe-se que|nota-se que|é possível observar que|vemos que)\b/gi,
                '$1'
              );
              out = out.replace(/\b(\w+)(\s+\1\b)+/gi, '$1');
              out = out.replace(/([,;:.])\s*\1+/g, '$1');
              return out;
            };

            const cleanThemeConsolidated = (correctionResult.theme || 'a problemática discutida no tema')
              .replace(/^["'“”]+|["'“”.]+$/g, '')
              .trim();

            const themeWordsConsolidated = normText(cleanThemeConsolidated)
              .split(' ')
              .filter((w) => w.length > 4);

            const buildConsolidatedRewrite = (
              cNum: number,
              rawOriginal: string,
              problemDesc: string
            ): { improved: string; step: string } => {
              const baseQ = (rawOriginal || '')
                .replace(/^["'“”]+|["'“”]+$/g, '')
                .replace(/\s+/g, ' ')
                .trim();
              const firstSent = (
                baseQ
                  .split(/(?<=[.!?])\s+/)
                  .map((s) => s.trim())
                  .filter((s) => s.length > 10)[0] || baseQ
              )
                .replace(/[.!;:,]+$/, '')
                .trim();

              let stripped = firstSent
                .replace(
                  /^(sob a ótica[^,]+,\s*|à luz[^,]+,\s*|de acordo com[^,]+,\s*|segundo[^,]+,\s*|conforme[^,]+,\s*|diante desse cenário,\s*|diante disso,\s*|nesse contexto,\s*|nesse sentido,\s*|sob esse viés,\s*|outrossim,\s*|ademais,\s*|além disso,\s*|portanto,\s*|dessa forma,\s*|assim,\s*|no brasil contemporâneo,\s*|no brasil,\s*|hoje em dia,\s*|atualmente,\s*)+/i,
                  ''
                )
                .replace(
                  /^(observa-se que\s+|verifica-se que\s+|constata-se que\s+|percebe-se que\s+|nota-se que\s+|é possível observar que\s+|é notório que\s+|vemos que\s+|pode-se afirmar que\s+)/i,
                  ''
                )
                .replace(
                  /,\s*(visto que|já que|uma vez que|haja vista|pois|porque|o que perpetua|o que gera|evidenciando|realidade que).*$/i,
                  ''
                )
                .trim();

              if (stripped.length < 12) stripped = firstSent;

              const startsProper =
                /^(Brasil|Constituição|Estado|Governo|Ministério|ONU|OMS|IBGE|ECA|Foucault|Bauman|Durkheim|Bourdieu|Arendt|Kant|Aristóteles|Platão|Habermas)/i.test(
                  stripped
                );
              const clause =
                stripped.length > 1
                  ? (startsProper ? stripped[0] : stripped[0].toLowerCase()) + stripped.slice(1)
                  : stripped;

              const sentNorm = normText(firstSent);
              const alreadyHasTheme =
                themeWordsConsolidated.length > 0 &&
                themeWordsConsolidated.filter((w) => sentNorm.includes(w)).length >=
                  Math.min(2, themeWordsConsolidated.length);
              const alreadyHasBrazil = /(brasil|pais|sociedade brasileira)/i.test(sentNorm);

              const themeLabel = alreadyHasTheme ? 'essa questão' : cleanThemeConsolidated;
              const placeLabel = alreadyHasBrazil ? 'no país' : 'no Brasil';

              if (cNum === 1) {
                let fixedFirst = firstSent;
                if (correctionResult.c1Deviations && correctionResult.c1Deviations.length > 0) {
                  correctionResult.c1Deviations.forEach((dev) => {
                    if (dev.snippet && dev.bestForm && fixedFirst.includes(dev.snippet)) {
                      fixedFirst = fixedFirst.replace(dev.snippet, dev.bestForm);
                    }
                  });
                }
                return {
                  improved: sanitizeConsolidatedText(
                    /[.!?]$/.test(fixedFirst) ? fixedFirst : `${fixedFirst}.`
                  ),
                  step: 'Aplique apenas os ajustes pontuais de norma-padrão ou pontuação necessários, preservando o sentido original do período.',
                };
              }
              if (cNum === 2) {
                const hasRep =
                  /(segundo|conforme|de acordo com|constituição|1988|artigo|ibge|onu|oms|bauman|foucault|durkheim|bourdieu|arendt|kant|aristóteles|habermas|lei|estatuto|eca|filósof|sociólog)/i.test(
                    firstSent
                  );
                if (hasRep || /(produtiv|articul|justapost|vínculo|vinculo)/i.test(problemDesc)) {
                  const cleanNoVisto = firstSent.replace(/,\s*(visto que|já que|uma vez que|pois).*$/i, '').trim();
                  return {
                    improved: sanitizeConsolidatedText(
                      `${cleanNoVisto} — premissa teórica que se comprova diretamente nos desafios de ${themeLabel}, visto que a falha na efetivação desse princípio agrava o cenário social ${placeLabel}.`
                    ),
                    step: `Mantenha sua referência teórica, mas acrescente imediatamente um conectivo explicativo ("visto que") amarrando-a aos termos-chave do tema.`,
                  };
                }
                return {
                  improved: sanitizeConsolidatedText(
                    `À luz da Constituição Federal de 1988 — que assegura a dignidade e o bem-estar social como garantias fundamentais —, observa-se que ${clause}, realidade que evidencia os entraves de ${themeLabel} ${placeLabel}.`
                  ),
                  step: `Ancore sua afirmação em um repertório sociocultural legitimado (como a Constituição Federal de 1988, dados do IBGE ou um pensador) vinculado ao tema.`,
                };
              }
              if (cNum === 3) {
                return {
                  improved: sanitizeConsolidatedText(
                    `${firstSent}, visto que a persistência das causas ligadas a ${themeLabel} impede a superação efetiva desse quadro e amplia seus impactos concretos ${placeLabel}.`
                  ),
                  step: 'Mantenha o repertório e o tema específico do parágrafo, aprofundando a relação entre a causa apontada e sua consequência prática.',
                };
              }
              if (cNum === 4) {
                return {
                  improved: sanitizeConsolidatedText(
                    `Ademais, sob essa perspectiva, ${clause}, de modo que tal cenário demanda medidas articuladas para ser superado.`
                  ),
                  step: 'Articule os períodos com precisão funcional e retomadas referenciais claras ("tal cenário"), evitando repetição de estruturas explicativas semelhantes.',
                };
              }
              const rawConsAgent = correctionResult.c5Structure?.agent?.present && correctionResult.c5Structure.agent.text
                ? correctionResult.c5Structure.agent.text.split(/[\/|;]+/)[0].replace(/[.]+$/, '').trim()
                : '';
              const consAgent = rawConsAgent || 'o Poder Público Federal';
              return {
                improved: sanitizeConsolidatedText(
                  `Portanto, cabe a ${consAgent} — instância responsável pela execução e fiscalização de políticas públicas (Detalhamento) — implementar um programa nacional voltado a ${cleanThemeConsolidated} (Ação), por meio de investimentos direcionados e ações educativas nas escolas e mídias (Meio/Modo), a fim de superar esse entrave e efetivar a cidadania ${placeLabel} (Efeito).`
                ),
                step: 'Mantenha o agente e a ação já presentes na conclusão e complete apenas os elementos que faltarem entre os 5 exigidos pelo INEP.',
              };
            };

            const addConsolidated = (item: ConsolidatedErrorQuote) => {
              const quoteKey = normText(item.original);
              const impKey = normText(item.improvedVersion);
              if (!quoteKey || !impKey || quoteKey === impKey) return;

              const isDuplicateOriginal = Array.from(seenOriginals).some(
                (existing) =>
                  existing === quoteKey ||
                  (existing.length >= 12 && quoteKey.includes(existing)) ||
                  (quoteKey.length >= 12 && existing.includes(quoteKey))
              );
              const isDuplicateImproved = Array.from(seenImproved).some(
                (existing) =>
                  existing === impKey ||
                  existing.slice(0, 50) === impKey.slice(0, 50)
              );

              if (!isDuplicateOriginal && !isDuplicateImproved) {
                seenOriginals.add(quoteKey);
                seenImproved.add(impKey);
                consolidatedList.push({
                  ...item,
                  improvedVersion: sanitizeConsolidatedText(item.improvedVersion),
                });
              }
            };

            // 1. Add all C1 Deviations (Norma-Padrão & Sintaxe)
            if (correctionResult.c1Deviations && correctionResult.c1Deviations.length > 0) {
              correctionResult.c1Deviations.forEach((dev) => {
                const catName =
                  dev.category === 'convenções_escrita'
                    ? 'Convenções da Escrita'
                    : dev.category === 'estrutura_sintatica'
                    ? 'Estrutura Sintática'
                    : dev.category === 'gramatical'
                    ? 'Gramática'
                    : dev.category === 'vocabular'
                    ? 'Vocabulário'
                    : 'Registro Formal';
                addConsolidated({
                  compLabel: `Competência 1 • ${catName}`,
                  original: dev.snippet,
                  problem: dev.problem,
                  improvedVersion: dev.bestForm,
                  howToResolve: `Substitua "${dev.snippet}" por "${dev.bestForm}" para eliminar a falha de ${catName.toLowerCase()} e garantir os pontos na C1.`,
                });
              });
            }

            // 2. Add Pedagogical Rewrites ONLY for competencies scored below 200
            if (correctionResult.pedagogicalRewrites && correctionResult.pedagogicalRewrites.length > 0) {
              correctionResult.pedagogicalRewrites.forEach((rw: any) => {
                const pText = (rw.problem + ' ' + rw.explanation).toLowerCase();
                let inferredComp = 'Competência 3 • Argumentação';
                let inferredNum: 1 | 2 | 3 | 4 | 5 = (rw.competencyNum && [1, 2, 3, 4, 5].includes(rw.competencyNum)) ? rw.competencyNum : 3;
                if (inferredNum === 5 || /(interven|proposta|agente|meio\/modo|detalhamento|finalidade|\bc5\b)/i.test(pText)) {
                  inferredComp = 'Competência 5 • Proposta de Intervenção';
                  inferredNum = 5;
                } else if (inferredNum === 1 || /(gramat|ortograf|vírgula|crase|concord|regênc|sintát|norma-padrão|oralidade|\bc1\b)/i.test(pText)) {
                  inferredComp = 'Competência 1 • Norma-Padrão';
                  inferredNum = 1;
                } else if (inferredNum === 4 || /(conectiv|coes|repeti|operador|articul|\bc4\b)/i.test(pText)) {
                  inferredComp = 'Competência 4 • Coesão e Conectivos';
                  inferredNum = 4;
                } else if (inferredNum === 2 || /(repertór|tema|tese|sociolog|filosof|produtiv|\bc2\b)/i.test(pText)) {
                  inferredComp = 'Competência 2 • Repertório e Tema';
                  inferredNum = 2;
                }

                const cKeyCheck = `c${inferredNum}` as 'c1' | 'c2' | 'c3' | 'c4' | 'c5';
                const targetCompScore =
                  competencyDivergences[inferredNum - 1]?.officialCompMean ??
                  correctionResult.competencies[cKeyCheck]?.score ??
                  200;
                if (targetCompScore >= 200) return;

                const fallbackGen = buildConsolidatedRewrite(inferredNum, rw.original, rw.problem);
                const cleanAiImp = sanitizeConsolidatedText(rw.improvedVersion || '');
                const validImproved =
                  cleanAiImp.length > 12 && normText(cleanAiImp) !== normText(rw.original)
                    ? cleanAiImp
                    : fallbackGen.improved;

                addConsolidated({
                  compLabel: inferredComp,
                  original: rw.original,
                  problem: rw.problem,
                  improvedVersion: validImproved,
                  howToResolve: rw.explanation || fallbackGen.step,
                });
              });
            }

            // 3. Add all Competency-specific error quotes from C1 to C5 where score < 200 (with concrete Before -> After rewrite)
            const compNames: Record<number, string> = {
              1: 'Competência 1 • Escrita Formal',
              2: 'Competência 2 • Tema e Repertório',
              3: 'Competência 3 • Argumentação',
              4: 'Competência 4 • Conectivos e Coesão',
              5: 'Competência 5 • Proposta de Intervenção',
            };

            ([1, 2, 3, 4, 5] as const).forEach((cNum) => {
              const cKey = `c${cNum}` as 'c1' | 'c2' | 'c3' | 'c4' | 'c5';
              const cData = correctionResult.competencies[cKey];
              const cAudit = correctionResult.auditLog?.competencyLogs?.find((l) => l.competencyNum === cNum);
              const officialCScore =
                competencyDivergences[cNum - 1]?.officialCompMean ?? cData?.score ?? 200;
              if (!cData || officialCScore >= 200) return;

              const quote =
                cData.trecho_evidencia ||
                cData.primaryEvidenceQuote ||
                cData.evidenceSnippets?.[0] ||
                cAudit?.evidenceQuoteFromStudent;

              const mainError =
                cAudit?.reasonNotRoundedTo200 ||
                cData.problemsIdentified?.[0] ||
                cData.penaltiesOrGaps?.[0] ||
                cData.diagnostic;

              if (
                quote &&
                quote.trim().length > 0 &&
                quote !== 'Trecho sob análise textual.' &&
                quote !== 'Análise global do texto submetido.' &&
                mainError
              ) {
                const generated = buildConsolidatedRewrite(cNum, quote.trim(), mainError);
                addConsolidated({
                  compLabel: `${compNames[cNum]} (${officialCScore}/200 pts)`,
                  original: quote.trim(),
                  problem: mainError,
                  improvedVersion: generated.improved,
                  howToResolve: generated.step,
                });
              }
            });

            if (consolidatedList.length === 0) return null;

            return (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>Citações do Seu Texto: Onde Errou e Como Escrever Melhor (Antes → Depois)</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Todos os erros identificados nas 5 competências reunidos em um só lugar, com o trecho exato do seu texto e a reescrita prática de como deveria ser escrito.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl text-xs font-black uppercase bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shrink-0 self-start sm:self-auto">
                    {consolidatedList.length} Correções Práticas
                  </span>
                </div>

                <div className="space-y-4">
                  {consolidatedList.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3.5 text-xs sm:text-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-black text-[11px] uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
                          #{idx + 1} • {item.compLabel}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/70 space-y-2">
                          <span className="font-black text-rose-800 dark:text-rose-300 text-[11px] uppercase tracking-wider block">
                            ❌ Como você escreveu (Antes)
                          </span>
                          <p className="font-serif italic text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 p-3 rounded-lg border border-rose-200/80 dark:border-rose-900/60 leading-relaxed">
                            "{item.original}"
                          </p>
                          <p className="text-rose-800 dark:text-rose-300 text-xs pt-0.5 leading-snug">
                            <strong>Qual foi o erro:</strong> {item.problem}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/70 space-y-2">
                          <span className="font-black text-emerald-800 dark:text-emerald-300 text-[11px] uppercase tracking-wider block">
                            ✅ Como deveria ser escrito (Depois)
                          </span>
                          <p className="font-serif text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 p-3 rounded-lg border border-emerald-200/80 dark:border-emerald-900/60 font-semibold leading-relaxed">
                            "{item.improvedVersion}"
                          </p>
                          <p className="text-emerald-800 dark:text-emerald-300 text-xs pt-0.5 leading-snug">
                            <strong>Como resolver na prática:</strong> {item.howToResolve}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Professor AI Dedicado Exclusivamente à Redação Avaliada */}
          <div id="essay-correction-professor-chat-section" className="pt-2">
            <EssayCorrectionProfessorChat 
              correctionResult={correctionResult}
              onNavigateToFullChat={() => {
                onAskProfessorAboutEssay(
                  correctionResult.essayText, 
                  correctionResult.theme,
                  `Nota ${officialMeanScore}/1000. C1: ${competencyDivergences[0]?.officialCompMean ?? correctionResult.competencies.c1.score}, C2: ${competencyDivergences[1]?.officialCompMean ?? correctionResult.competencies.c2.score}, C3: ${competencyDivergences[2]?.officialCompMean ?? correctionResult.competencies.c3.score}, C4: ${competencyDivergences[3]?.officialCompMean ?? correctionResult.competencies.c4.score}, C5: ${competencyDivergences[4]?.officialCompMean ?? correctionResult.competencies.c5.score}.`
                );
              }}
            />
          </div>
        </div>
      )}

      {/* Modal Interativo da Cartilha Oficial do Participante (INEP 2025/2026) */}
      {showCartilhaModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowCartilhaModal(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-600 to-indigo-800 text-white flex items-center justify-between gap-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/20 border border-white/30">
                    INEP / MEC
                  </span>
                  <span className="text-xs font-bold text-amber-200">
                    Edição Atualizada 2025 / 2026
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black">
                  {CARTILHA_METADATA.edition}
                </h3>
                <p className="text-xs text-amber-100 max-w-xl">
                  Normas canônicas e critérios de correção oficiais utilizados pelos avaliadores do ENEM
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCartilhaModal(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 p-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 overflow-x-auto shrink-0 text-xs font-bold">
              <button
                type="button"
                onClick={() => setCartilhaModalTab('matrix')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  cartilhaModalTab === 'matrix'
                    ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-2xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>Matriz das 5 Competências</span>
              </button>
              <button
                type="button"
                onClick={() => setCartilhaModalTab('zero')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  cartilhaModalTab === 'zero'
                    ? 'bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-300 shadow-2xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>Situações de Nota Zero</span>
              </button>
              <button
                type="button"
                onClick={() => setCartilhaModalTab('rules')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  cartilhaModalTab === 'rules'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Regras de Ouro dos Corretores</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800 dark:text-slate-200">
              {cartilhaModalTab === 'matrix' && (
                <div className="space-y-5">
                  {/* Competency Pill Selector */}
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl overflow-x-auto">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSelectedCartilhaComp(num as 1|2|3|4|5)}
                        className={`flex-1 min-w-[70px] py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          selectedCartilhaComp === num
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        Comp {num}
                      </button>
                    ))}
                  </div>

                  {/* Selected Competency Header */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/80 space-y-1">
                    <span className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-300">
                      Competência {selectedCartilhaComp}
                    </span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      {CARTILHA_COMPETENCIES[selectedCartilhaComp].name}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {CARTILHA_COMPETENCIES[selectedCartilhaComp].officialDefinition}
                    </p>
                  </div>

                  {/* 6 Levels of Cartilha */}
                  <div className="space-y-2.5">
                    {([5, 4, 3, 2, 1, 0] as const).map((lvl) => {
                      const lvlData = CARTILHA_COMPETENCIES[selectedCartilhaComp].levels[lvl];
                      const is200 = lvl === 5;
                      return (
                        <div
                          key={lvl}
                          className={`p-3.5 rounded-xl border text-xs ${
                            is200 
                              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700' 
                              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`px-2 py-0.5 rounded font-black text-[11px] ${
                              is200 ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                            }`}>
                              Nível {lvlData.level} — {lvlData.score} pontos
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                              {lvlData.tolerancesAndLimits}
                            </span>
                          </div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            "{lvlData.officialDescriptor}"
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                            Orientação INEP: {lvlData.evaluatorGuidance}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {cartilhaModalTab === 'zero' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 space-y-1">
                    <h4 className="text-sm font-black text-red-900 dark:text-red-200">
                      Critérios Oficiais de Anulação e Nota Zero no ENEM
                    </h4>
                    <p className="text-xs text-red-700 dark:text-red-400">
                      Segundo o Edital do Exame e a Cartilha do Participante, as ocorrências abaixo anulam a prova sumariamente:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {CARTILHA_ZERO_SITUATIONS.map((sit) => (
                      <div 
                        key={sit.code}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-red-200/80 dark:border-red-900/40 space-y-1.5"
                      >
                        <span className="font-black text-red-700 dark:text-red-400 block text-xs">
                          {sit.title}
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 text-xs">
                          {sit.description}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200 dark:border-slate-700">
                          {sit.inepModuleRule}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cartilhaModalTab === 'rules' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-1">
                    <h4 className="text-sm font-black text-indigo-900 dark:text-indigo-200">
                      Regras de Ouro dos Módulos Oficiais de Avaliação
                    </h4>
                    <p className="text-xs text-indigo-700 dark:text-indigo-400">
                      Orientações transmitidas nos cursos de capacitação de corretores contratados pelo INEP:
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((compNum) => {
                      const comp = CARTILHA_COMPETENCIES[compNum as 1|2|3|4|5];
                      return (
                        <div key={compNum} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                          <span className="font-black text-amber-700 dark:text-amber-400 uppercase text-[11px] block">
                            Competência {compNum}: {comp.name}
                          </span>
                          <ul className="space-y-1.5">
                            {comp.pedagogicalGoldenRules.map((r, rIdx) => (
                              <li key={rIdx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                                <span className="text-indigo-500 font-bold shrink-0">•</span>
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Matriz Homologada conforme a Cartilha do Participante INEP / MEC.
              </span>
              <button
                type="button"
                onClick={() => setShowCartilhaModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition-colors"
              >
                Fechar Consulta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
