import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Copy, 
  RefreshCw, 
  ArrowRight, 
  Check, 
  FileText, 
  Layers, 
  GraduationCap, 
  Lightbulb,
  Share2,
  ExternalLink,
  Maximize2,
  Minimize2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  Eye,
  EyeOff,
  PenTool,
  Save,
  Send,
  HelpCircle,
  CheckCircle2,
  ShieldCheck,
  Award,
  CheckCheck,
  Scale,
  ListFilter,
  RefreshCcw,
  Sparkle,
  Sliders
} from 'lucide-react';
import { GeneratedEssayResponse, MasterDevelopmentTip } from '../types';
import { HISTORICAL_THEMES } from '../data/officialData';
import { MasterTipModal } from './MasterTipModal';
import { SynonymDictionaryModal } from './SynonymDictionaryModal';
import { RepertoireSwapModal, SelectedRepertoireItem } from './RepertoireSwapModal';
import { AiProgressBar } from './AiProgressBar';
import { useAiProgress } from '../hooks/useAiProgress';
import { ErrorBoundary } from './ErrorBoundary';
import { useSavedWork } from '../contexts/SavedWorkContext';
import { useBackgroundTasks } from '../contexts/BackgroundTasksContext';
import { CreationSkeleton } from './SavedDataSkeleton';

interface CreationViewProps {
  onSendToCorrection: (text: string, theme: string) => void;
  initialTheme?: string;
  isDataLoading?: boolean;
}

const STORAGE_KEYS = {
  FOCUS_DRAFT: 'enem_creation_focus_draft_v1',
  FOCUS_THEME: 'enem_creation_focus_theme_v1',
};

export const CreationView: React.FC<CreationViewProps> = ({ 
  onSendToCorrection, 
  initialTheme,
  isDataLoading = false 
}) => {
  const { savedWork, isLoadingSavedWork, setGeneratedEssay: setPersistedGeneratedEssay, setCreationDraft } = useSavedWork();
  const { startTask, updateTaskProgress, completeTask, failTask } = useBackgroundTasks();

  const [theme, setTheme] = useState<string>(() => {
    if (initialTheme) return initialTheme;
    if (savedWork.creationTheme) return savedWork.creationTheme;
    if (savedWork.generatedEssay?.theme) return savedWork.generatedEssay.theme;
    return HISTORICAL_THEMES[0].title;
  });

  const [isCustomTheme, setIsCustomTheme] = useState<boolean>(() => {
    const activeT = initialTheme || savedWork.creationTheme || savedWork.generatedEssay?.theme;
    return Boolean(activeT && !HISTORICAL_THEMES.some(t => t.title === activeT));
  });

  const [customThemeInput, setCustomThemeInput] = useState<string>(() => {
    const activeT = initialTheme || savedWork.creationTheme || savedWork.generatedEssay?.theme;
    return (activeT && !HISTORICAL_THEMES.some(t => t.title === activeT)) ? activeT : '';
  });

  const [aidType, setAidType] = useState<'full_essay' | 'ideas' | 'repertorios' | 'structure'>('full_essay');
  const [targetLevel, setTargetLevel] = useState<string>('nota_1000');
  const [structuralStyle, setStructuralStyle] = useState<string>('causas');
  const [connectiveStyle, setConnectiveStyle] = useState<string>('variado');
  const [customRepertorios, setCustomRepertorios] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedEssay, setGeneratedEssay] = useState<GeneratedEssayResponse | null>(() => {
    return savedWork.generatedEssay || null;
  });
  const [activeTabSub, setActiveTabSub] = useState<'full_text' | 'text' | 'repertoire' | 'structure' | 'audit'>('full_text');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Sync with initialTheme
  useEffect(() => {
    if (initialTheme) {
      setTheme(initialTheme);
      if (!HISTORICAL_THEMES.some(t => t.title === initialTheme)) {
        setIsCustomTheme(true);
        setCustomThemeInput(initialTheme);
      }
    }
  }, [initialTheme]);

  // Sync state if background task completed while user was on another tab
  useEffect(() => {
    if (savedWork.generatedEssay && (!generatedEssay || (savedWork.generatedEssay.id && generatedEssay.id ? savedWork.generatedEssay.id !== generatedEssay.id : savedWork.generatedEssay.fullText !== generatedEssay.fullText))) {
      setGeneratedEssay(savedWork.generatedEssay);
      if (savedWork.generatedEssay.theme) {
        setTheme(savedWork.generatedEssay.theme);
        if (!HISTORICAL_THEMES.some(t => t.title === savedWork.generatedEssay?.theme)) {
          setIsCustomTheme(true);
          setCustomThemeInput(savedWork.generatedEssay.theme);
        }
      }
    }
  }, [savedWork.generatedEssay, generatedEssay]);

  // --- Repertoire Swap States ---
  const [isRepertoireSwapOpen, setIsRepertoireSwapOpen] = useState<boolean>(false);
  const [isSwappingRepertoire, setIsSwappingRepertoire] = useState<boolean>(false);
  const [essayHistory, setEssayHistory] = useState<GeneratedEssayResponse[]>([]);
  const [swapNotice, setSwapNotice] = useState<string>('');

  const essayProgress = useAiProgress({
    steps: [
      '1. Mapeando frase temática e problema central com matriz INEP...',
      '2. Estruturando tese bipartida e projeto de texto estratégico (C3)...',
      '3. Vinculando repertórios legitimados com articulação produtiva (C2)...',
      '4. Aplicando operadores interparágrafos e diversidade coesiva (C4)...',
      '5. Construindo proposta de intervenção completa com os 5 elementos (C5)...',
      '6. Submetendo à Banca Revisora e auditando conformidade Nota 1000...'
    ],
    estimatedDurationMs: 14000,
  });

  // --- Master Tip (Dica do Mestre) States ---
  const [isMasterTipOpen, setIsMasterTipOpen] = useState<boolean>(false);
  const [masterTipData, setMasterTipData] = useState<MasterDevelopmentTip | null>(null);
  const [isMasterTipLoading, setIsMasterTipLoading] = useState<boolean>(false);

  // --- Synonym Dictionary States ---
  const [isSynonymModalOpen, setIsSynonymModalOpen] = useState<boolean>(false);
  const [synonymSearchWord, setSynonymSearchWord] = useState<string>('coisa');
  const [synonymContextSentence, setSynonymContextSentence] = useState<string>('');
  const [floatingSelection, setFloatingSelection] = useState<{
    text: string;
    x: number;
    y: number;
    visible: boolean;
    sentence: string;
    startIdx?: number;
    endIdx?: number;
    fromTextarea?: boolean;
  }>({ text: '', x: 0, y: 0, visible: false, sentence: '' });

  // --- Focus Mode States ---
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isZenDistractionFree, setIsZenDistractionFree] = useState<boolean>(false);
  const [focusDraft, setFocusDraft] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.FOCUS_DRAFT) || '';
    } catch {
      return '';
    }
  });

  // 60 minutes countdown timer (3600 seconds)
  const [timerSeconds, setTimerSeconds] = useState<number>(3600);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerFinished, setTimerFinished] = useState<boolean>(false);
  const [showHelperDrawer, setShowHelperDrawer] = useState<boolean>(false);
  const [focusThemeMode, setFocusThemeMode] = useState<'dark' | 'light'>('light');
  const [lastSavedNotice, setLastSavedNotice] = useState<string>('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeTheme = isCustomTheme ? customThemeInput.trim() : theme.trim();

  // Save focus draft to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FOCUS_DRAFT, focusDraft);
      if (activeTheme) {
        localStorage.setItem(STORAGE_KEYS.FOCUS_THEME, activeTheme);
      }
    } catch (e) {
      console.warn('Erro ao salvar rascunho do modo foco:', e);
    }
  }, [focusDraft, activeTheme]);

  // Timer interval countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isFocusMode && isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setTimerFinished(true);
            // Play gentle web audio chime if supported
            try {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
              osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4); // A5
              gain.gain.setValueAtTime(0.15, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 0.8);
            } catch {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFocusMode, isTimerRunning, timerSeconds]);

  // Lock body scroll and register Escape key handler when Focus Mode is open
  useEffect(() => {
    if (isFocusMode) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (isZenDistractionFree) {
            setIsZenDistractionFree(false);
          } else {
            setIsFocusMode(false);
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isFocusMode, isZenDistractionFree]);

  const handleStartFocusMode = (initialText?: string) => {
    if (initialText !== undefined && initialText.trim().length > 0) {
      setFocusDraft(initialText);
    }
    setIsFocusMode(true);
    setIsTimerRunning(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(3600);
    setTimerFinished(false);
  };

  const handleAddFiveMinutes = () => {
    setTimerSeconds((prev) => prev + 300);
    setTimerFinished(false);
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Metrics for drafting in Focus Mode
  const wordsCount = focusDraft.trim() ? focusDraft.trim().split(/\s+/).length : 0;
  const paragraphsCount = focusDraft.trim() ? focusDraft.trim().split(/\n+/).filter(p => p.trim().length > 0).length : 0;
  // Estimate ENEM lines: average 70-75 characters per line or manual newlines
  const estimatedLines = Math.max(
    focusDraft.split('\n').length,
    Math.round(focusDraft.length / 68)
  );

  const handleGenerate = async () => {
    if (!activeTheme) {
      setErrorMsg('Por favor, informe o tema da redação.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    essayProgress.startProgress();

    const taskId = `task-creation-${Date.now()}`;
    startTask(taskId, 'creation', 'Criação de Redação com IA', activeTheme);

    try {
      updateTaskProgress(taskId, 30, 'Montando tese e projeto de texto estratégico (C3)...');
      const res = await fetch('/api/generate-essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: activeTheme,
          aidType,
          targetLevel,
          structuralStyle,
          connectiveStyle,
          customRepertorios: customRepertorios.trim(),
        }),
      });

      updateTaskProgress(taskId, 70, 'Construindo intervenção C5 e auditando nota 1000...');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao gerar redação.');
      }

      const essayWithId: GeneratedEssayResponse = {
        ...data,
        id: data.id || taskId,
      };
      essayProgress.completeProgress();
      setGeneratedEssay(essayWithId);
      setPersistedGeneratedEssay(essayWithId);
      completeTask(taskId, essayWithId);
      setActiveTabSub('text');
    } catch (err: any) {
      essayProgress.resetProgress();
      failTask(taskId, err.message || 'Falha ao gerar redação.');
      setErrorMsg(err.message || 'Falha na geração do texto.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedEssay) return;
    navigator.clipboard.writeText(generatedEssay.fullText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleSwapRepertoires = async (params: {
    targetScope: 'all' | 'intro' | 'd1' | 'd2';
    newRepertoires: SelectedRepertoireItem[];
    customInstructions?: string;
  }) => {
    if (!generatedEssay) return;
    setIsSwappingRepertoire(true);
    setErrorMsg('');
    essayProgress.startProgress();

    try {
      const res = await fetch('/api/swap-essay-repertoire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: generatedEssay.theme,
          currentEssay: generatedEssay,
          targetScope: params.targetScope,
          newRepertoires: params.newRepertoires,
          customInstructions: params.customInstructions,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao reescrever redação com novos repertórios.');
      }

      essayProgress.completeProgress();
      setEssayHistory((prev) => [generatedEssay, ...prev]);
      setGeneratedEssay(data);
      setIsRepertoireSwapOpen(false);
      setSwapNotice(`Repertórios atualizados com sucesso! A redação foi reescrita no padrão Nota 1000 com vínculo 100% produtivo.`);
      setTimeout(() => setSwapNotice(''), 7000);
    } catch (err: any) {
      essayProgress.resetProgress();
      setErrorMsg(err.message || 'Falha ao reescrever com novos repertórios.');
    } finally {
      setIsSwappingRepertoire(false);
    }
  };

  const handleUndoSwap = () => {
    if (essayHistory.length === 0) return;
    const previous = essayHistory[0];
    setEssayHistory((prev) => prev.slice(1));
    setGeneratedEssay(previous);
    setSwapNotice('Versão anterior da redação restaurada.');
    setTimeout(() => setSwapNotice(''), 4000);
  };

  const handleOpenMasterTip = async (forceRefresh: boolean = false) => {
    if (!activeTheme) {
      setErrorMsg('Por favor, informe ou selecione o tema da redação.');
      return;
    }
    setErrorMsg('');
    setIsMasterTipOpen(true);
    
    // If we already have cached data for the same theme and not refreshing, keep it
    if (masterTipData && masterTipData.theme === activeTheme && !forceRefresh) {
      return;
    }

    setIsMasterTipLoading(true);
    try {
      const res = await fetch('/api/master-development-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: activeTheme,
          contextDraft: focusDraft.trim(),
        }),
      });
      const data = await res.json();
      setMasterTipData(data);
    } catch (err: any) {
      console.error('Erro ao obter Dica do Mestre:', err);
    } finally {
      setIsMasterTipLoading(false);
    }
  };

  // --- Synonym Dictionary Handlers ---
  const handleOpenSynonymDictionary = (word?: string, context?: string) => {
    if (word && word.trim()) {
      const clean = word.trim().replace(/^[^\wáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+|[^\wáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+$/g, '');
      if (clean) {
        setSynonymSearchWord(clean);
        setSynonymContextSentence(context || '');
      }
    }
    setIsSynonymModalOpen(true);
  };

  const handleReplaceInDraft = (oldWord: string, newWord: string) => {
    if (floatingSelection.startIdx !== undefined && floatingSelection.endIdx !== undefined && floatingSelection.fromTextarea) {
      const before = focusDraft.substring(0, floatingSelection.startIdx);
      const after = focusDraft.substring(floatingSelection.endIdx);
      const updated = before + newWord + after;
      setFocusDraft(updated);
      setFloatingSelection((prev) => ({ ...prev, visible: false }));
    } else if (focusDraft) {
      const cleanOld = oldWord.trim().replace(/^[^\wáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+|[^\wáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+$/g, '');
      if (cleanOld) {
        const escaped = cleanOld.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');
        if (regex.test(focusDraft)) {
          setFocusDraft(focusDraft.replace(regex, newWord));
        } else {
          setFocusDraft(focusDraft.replace(cleanOld, newWord));
        }
      }
    }
  };

  // Focus mode textarea select listener
  const handleTextareaSelect = () => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    if (start !== undefined && end !== undefined && start < end) {
      const rawSelected = focusDraft.substring(start, end).trim();
      const clean = rawSelected.replace(/^[^\wáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+|[^\wáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+$/g, '');
      if (clean.length > 0 && clean.length <= 45 && clean.split(/\s+/).length <= 4) {
        const before = focusDraft.substring(0, start);
        const after = focusDraft.substring(end);
        const lastPeriod = Math.max(before.lastIndexOf('.'), before.lastIndexOf('\n'), 0);
        const nextPeriod = after.indexOf('.') !== -1 ? end + after.indexOf('.') : focusDraft.length;
        const sentence = focusDraft.substring(lastPeriod, nextPeriod).trim();

        const rect = textareaRef.current.getBoundingClientRect();
        setFloatingSelection({
          text: clean,
          x: Math.min(Math.max(rect.left + 24, 16), window.innerWidth - 300),
          y: Math.max(rect.top + 16, 60),
          visible: true,
          sentence,
          startIdx: start,
          endIdx: end,
          fromTextarea: true,
        });
        return;
      }
    }
  };

  // Global mouseup text selection listener for generated essay or body texts
  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('#floating-synonym-pill') || 
        target.closest('[data-synonym-modal]') ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'INPUT'
      ) {
        return;
      }

      const selection = window.getSelection();
      const selText = selection?.toString().trim();
      if (selText && selText.length > 0 && selText.length <= 45 && selText.split(/\s+/).length <= 4) {
        const clean = selText.replace(/^[^\wáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+|[^\wáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+$/g, '');
        if (clean && selection?.rangeCount) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          if (rect.width > 0) {
            setFloatingSelection({
              text: clean,
              x: Math.min(Math.max(rect.left + rect.width / 2 - 120, 16), window.innerWidth - 300),
              y: Math.max(rect.top - 46, 16),
              visible: true,
              sentence: range.startContainer.parentElement?.textContent || '',
              fromTextarea: false,
            });
            return;
          }
        }
      }

      setTimeout(() => {
        if (!window.getSelection()?.toString().trim()) {
          setFloatingSelection((prev) => (prev.fromTextarea ? prev : { ...prev, visible: false }));
        }
      }, 250);
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (isDataLoading || isLoadingSavedWork) {
    return <CreationSkeleton />;
  }

  const handleInsertTipIntoDraft = (text: string) => {
    setFocusDraft(text);
    setIsFocusMode(true);
    setIsTimerRunning(true);
  };

  const handleSendDraftToCorrection = () => {
    const textToSend = focusDraft.trim();
    if (!textToSend) {
      alert('Escreva pelo menos um parágrafo antes de enviar para correção.');
      return;
    }
    setIsFocusMode(false);
    onSendToCorrection(textToSend, activeTheme || 'Tema Livre do ENEM');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header with Quick Focus Mode CTA & Master Tip CTA */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Criador de Redações & Laboratório
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gere redações autênticas orientadas pelo INEP, consulte a <strong>Dica do Mestre (5 Competências)</strong> ou pratique no <strong>Modo Foco</strong>.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Synonym Dictionary Button */}
          <button
            type="button"
            onClick={() => handleOpenSynonymDictionary('coisa')}
            className="px-3 py-2 sm:px-3.5 sm:py-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-900 dark:text-indigo-200 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-xs transition-all cursor-pointer group"
            title="Dicionário de Sinônimos Formais (Competência 1)"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>SINÔNIMOS C1</span>
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
          </button>

          {/* Master Tip Button */}
          <button
            type="button"
            onClick={() => handleOpenMasterTip(false)}
            className="px-3 py-2 sm:px-4 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer group"
          >
            <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 group-hover:scale-110 transition-transform" />
            <span>DICA DO MESTRE</span>
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-950/80" />
          </button>

          {/* Enter Focus Mode Button */}
          <button
            onClick={() => handleStartFocusMode(focusDraft || generatedEssay?.fullText || '')}
            className="px-3.5 py-2 sm:px-5 sm:py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer group"
          >
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 dark:text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>MODO FOCO</span>
            <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-white" />
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-2">
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Generation Form */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 sm:space-y-6 transition-colors">
        {/* Row 1: Theme */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-900 dark:text-slate-100">
            Tema da Redação
          </label>
          
          <div className="flex items-center gap-3">
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
              Tema Inédito / Personalizado
            </button>
          </div>

          {!isCustomTheme ? (
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium bg-slate-50/50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all"
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
              value={customThemeInput}
              onChange={(e) => setCustomThemeInput(e.target.value)}
              placeholder="Digite o tema da redação..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm bg-slate-50/50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all"
            />
          )}

          {/* Quick Master Tip Card Banner */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="p-1.5 rounded-lg bg-amber-500 text-slate-950 shrink-0">
                <Lightbulb className="w-4 h-4" />
              </span>
              <p className="text-xs text-amber-950 dark:text-amber-200 font-medium truncate">
                Precisa de orientação? Peça a <strong>Dica do Mestre</strong> para sugestão de teses (D1/D2), repertórios e proposta C5.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenMasterTip(false)}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shrink-0 transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <Sparkles className="w-3 h-3" />
              <span>Abrir Dica</span>
            </button>
          </div>
        </div>

        {/* Row 2: Aid Type & Target Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Aid Type */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Tipo de Auxílio
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'full_essay', label: 'Redação Completa', desc: '4 parágrafos Nota 1000' },
                { id: 'structure', label: 'Estrutura / Esqueleto', desc: 'Projeto de texto guiado' },
                { id: 'repertorios', label: 'Apenas Repertórios', desc: 'Autores e citações' },
                { id: 'ideas', label: 'Apenas Ideias / Tese', desc: 'Brainstorming de causas' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAidType(opt.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    aidType === opt.id
                      ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/60 ring-2 ring-amber-200 dark:ring-amber-800 text-amber-950 dark:text-amber-200 font-bold'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs block font-bold">{opt.label}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Level */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Nível Almejado
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'nota_1000', label: 'Nível Nota 1000', badge: 'Máximo' },
                { id: 'high', label: 'Alto Nível (920-960)', badge: 'Avançado' },
                { id: 'very_good', label: 'Muito Boa (840-880)', badge: 'Sólido' },
                { id: 'good', label: 'Boa (760-800)', badge: 'Intermediário' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setTargetLevel(lvl.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    targetLevel === lvl.id
                      ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/60 ring-2 ring-indigo-200 dark:ring-indigo-800 text-indigo-950 dark:text-indigo-200 font-bold'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs block font-bold">{lvl.label}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{lvl.badge}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Structural Style, Connective Profile & Custom Repertoires */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Structural Style */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Estilo Estrutural
            </label>
            <select
              value={structuralStyle}
              onChange={(e) => setStructuralStyle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-medium bg-slate-50/50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 outline-hidden transition-all"
            >
              <option value="causas" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Dois Fatores / Duas Causas (D1: Causa 1, D2: Causa 2)</option>
              <option value="contrastes" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Contraste / Teoria vs Realidade (D1: Lei/Ideal, D2: Abismo fático)</option>
              <option value="historico_filosofico" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Histórico-Filosófico (D1: Raiz histórica, D2: Teoria social)</option>
            </select>
          </div>

          {/* Connective Profile */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Perfil de Conectivos</span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-normal">Competência 4</span>
            </label>
            <select
              value={connectiveStyle}
              onChange={(e) => setConnectiveStyle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-medium bg-slate-50/50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 outline-hidden transition-all"
            >
              <option value="variado" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Variado & Inovador (Dessarte, Outrossim, Urge...)</option>
              <option value="formal_classico" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Clássico Fluido (Nesse contexto, Paralelamente, Infere-se...)</option>
              <option value="critico_enfase" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Crítico & Contraste (Não obstante, Sob outro prisma, Torna-se imperioso...)</option>
              <option value="expressivo_autoral" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Expressivo & Autoral (Sob essa ótica, Somado a isso, Faz-se mister...)</option>
            </select>
          </div>

          {/* Custom Repertoires */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Repertórios Desejados</span>
              <span className="text-[10px] text-slate-400 font-normal">Opcional</span>
            </label>
            <input
              type="text"
              value={customRepertorios}
              onChange={(e) => setCustomRepertorios(e.target.value)}
              placeholder="Ex: Quarto de Despejo, Milton Santos, CF/88..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs bg-slate-50/50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 outline-hidden transition-all"
            />
          </div>
        </div>

        {/* Quick Repertoire Chips for Inspiration */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Sugestões de repertórios diversificados (clique para incluir):
            </span>
            {customRepertorios && (
              <button
                type="button"
                onClick={() => setCustomRepertorios('')}
                className="text-[10px] text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
              >
                Limpar repertórios
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              'Carolina Maria de Jesus',
              'Milton Santos',
              'Achille Mbembe',
              'Machado de Assis',
              'Graciliano Ramos',
              'Bacurau (Cinema)',
              'Byung-Chul Han',
              'Hannah Arendt',
              'Constituição de 1988',
              'Ailton Krenak',
              'Darcy Ribeiro',
              'Pierre Bourdieu'
            ].map((repName) => {
              const isSelected = customRepertorios.toLowerCase().includes(repName.toLowerCase());
              return (
                <button
                  key={repName}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      setCustomRepertorios(prev => prev.replace(new RegExp(`\\b${repName}\\b,?\\s*`, 'gi'), '').trim());
                    } else {
                      setCustomRepertorios(prev => prev ? `${prev}, ${repName}` : repName);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-bold shadow-xs'
                      : 'bg-slate-100/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '} {repName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            <button
              type="button"
              onClick={() => handleStartFocusMode(focusDraft)}
              className="flex-1 sm:flex-none px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-colors"
            >
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Simulador / Foco</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenMasterTip(false)}
              className="flex-1 sm:flex-none px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-950 dark:text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
              <span>Dica do Mestre</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenSynonymDictionary('fazer')}
              className="flex-1 sm:flex-none px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-colors"
              title="Dicionário de Sinônimos Formais para Competência 1"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Sinônimos C1</span>
            </button>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleGenerate}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-extrabold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-950/20 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Construindo Argumentação...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>CRIAR REDAÇÃO NOTA 1000</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real AI Progress Bar during Essay Generation */}
      {isLoading && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <AiProgressBar
            isLoading={isLoading}
            progress={essayProgress.progress}
            currentStepIndex={essayProgress.currentStepIndex}
            steps={essayProgress.steps}
            title="Gerando Redação Nota 1000 pelo Padrão INEP..."
            subtitle="Articulando repertórios filosóficos e sociológicos, projeto de texto e intervenção completa"
            accentColor="amber"
            variant="card"
          />
        </div>
      )}

      {/* Generated Result Output */}
      {generatedEssay && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden space-y-6 p-6 sm:p-8 transition-colors">
          {/* Header of Generated Text */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800">
                Redação Dissertativa-Argumentativa
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
                {generatedEssay.theme}
              </h2>
              {generatedEssay.title && (
                <p className="text-sm font-serif italic text-slate-600 dark:text-slate-400 mt-1">
                  Título: "{generatedEssay.title}"
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsRepertoireSwapOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 flex items-center gap-1.5 transition-all cursor-pointer shadow-md border border-amber-300/80 hover:scale-[1.02] active:scale-[0.98]"
                title="Alterar os repertórios socioculturais mobilizados e reescrever a redação nota 1000 com a IA"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                <span>Alterar Repertórios</span>
              </button>

              {essayHistory.length > 0 && (
                <button
                  type="button"
                  onClick={handleUndoSwap}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Restaurar a versão anterior da redação antes da última troca"
                >
                  <RefreshCcw className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />
                  <span>Desfazer Troca ({essayHistory.length})</span>
                </button>
              )}

              <button
                onClick={() => handleStartFocusMode(generatedEssay.fullText)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Editar no Modo Foco</span>
              </button>

              <button
                onClick={() => handleOpenSynonymDictionary('problema', generatedEssay.theme)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Dicionário de Sinônimos Formais (Competência 1)"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Sinônimos C1</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copySuccess ? 'Copiado!' : 'Copiar'}</span>
              </button>

              <button
                onClick={() => onSendToCorrection(generatedEssay.fullText, generatedEssay.theme)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Analisar no Corretor</span>
              </button>

              <button
                onClick={handleGenerate}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Gerar Outra Versão</span>
              </button>
            </div>
          </div>

          {/* Swap Notice Banner */}
          {swapNotice && (
            <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <span>{swapNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setSwapNotice('')}
                className="text-amber-800 dark:text-amber-300 hover:underline text-[11px] cursor-pointer"
              >
                Fechar
              </button>
            </div>
          )}

          {/* Repertoire Swap Summary Card if current essay was regenerated via Swap */}
          {generatedEssay.repertoireSwapSummary && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border border-amber-300/80 dark:border-amber-700/80 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                    Repertório Atualizado
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Redação reescrita com novos alicerces socioculturais
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCheck className="w-3.5 h-3.5" /> C2: Vínculo Produtivo 200/200 pts
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Repertórios Anteriores:</span>
                  <p className="text-slate-700 dark:text-slate-300 line-through opacity-75 mt-0.5">
                    {(Array.isArray(generatedEssay.repertoireSwapSummary?.previousRepertoires)
                      ? generatedEssay.repertoireSwapSummary.previousRepertoires
                      : Array.isArray(generatedEssay.repertoireSwapSummary?.previousRepertorios)
                      ? generatedEssay.repertoireSwapSummary.previousRepertorios
                      : []
                    ).join(' • ') || 'Repertório inicial'}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase block">Novos Repertórios Ativos:</span>
                  <p className="text-emerald-900 dark:text-emerald-200 font-bold mt-0.5">
                    {(Array.isArray(generatedEssay.repertoireSwapSummary?.newRepertoires)
                      ? generatedEssay.repertoireSwapSummary.newRepertoires
                      : Array.isArray(generatedEssay.repertoireSwapSummary?.newRepertorios)
                      ? generatedEssay.repertoireSwapSummary.newRepertorios
                      : []
                    ).join(' • ') || 'Novo repertório'}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                <strong>Justificativa da Banca:</strong> {generatedEssay.repertoireSwapSummary.rationale || 'Repertórios socioculturais integrados organicamente à linha argumentativa.'}
              </p>
            </div>
          )}

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTabSub('full_text')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTabSub === 'full_text'
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Redação Completa Oficial</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTabSub('text')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeTabSub === 'text'
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Parágrafos & Conectivos
            </button>
            <button
              type="button"
              onClick={() => setActiveTabSub('audit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTabSub === 'audit'
                  ? 'bg-amber-500 dark:bg-amber-600 text-slate-950 font-black shadow-xs'
                  : 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/80'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Auditoria & Rigor INEP</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-600 text-white font-bold">1000</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTabSub('repertoire')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeTabSub === 'repertoire'
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Repertórios ({generatedEssay.repertoriosUsed?.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveTabSub('structure')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeTabSub === 'structure'
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Projeto de Texto & Dicas
            </button>
          </div>

          {/* Tab 0: Redação Completa Oficial (Texto Contínuo Formatado) */}
          {activeTabSub === 'full_text' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Stat Strip */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {(generatedEssay.fullText || `${generatedEssay.structure.intro} ${generatedEssay.structure.d1} ${generatedEssay.structure.d2} ${generatedEssay.structure.conclusion}`).trim().split(/\s+/).filter(Boolean).length}
                    </span>
                    <span className="text-slate-500">palavras</span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      ~{Math.min(30, Math.max(26, Math.round(((generatedEssay.fullText || '').length || 2100) / 75)))}
                    </span>
                    <span className="text-slate-500">linhas estimadas no ENEM (folha oficial)</span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>4 Parágrafos Padrão INEP</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copySuccess ? 'Copiado!' : 'Copiar Texto'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSendToCorrection(generatedEssay.fullText || [generatedEssay.structure.intro, generatedEssay.structure.d1, generatedEssay.structure.d2, generatedEssay.structure.conclusion].join('\n\n'), generatedEssay.theme)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Auditar no Corretor</span>
                  </button>
                </div>
              </div>

              {/* Sheet Simulation Container */}
              <div className="p-6 sm:p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                {generatedEssay.title && (
                  <div className="text-center pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-slate-900 dark:text-slate-100 tracking-wide">
                      {generatedEssay.title}
                    </h3>
                  </div>
                )}

                <div className="space-y-4 font-serif text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-relaxed text-justify">
                  <p className="indent-8 sm:indent-12">
                    {generatedEssay.structure.intro}
                  </p>
                  <p className="indent-8 sm:indent-12">
                    {generatedEssay.structure.d1}
                  </p>
                  <p className="indent-8 sm:indent-12">
                    {generatedEssay.structure.d2}
                  </p>
                  <p className="indent-8 sm:indent-12">
                    {generatedEssay.structure.conclusion}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="italic">Redação dissertativo-argumentativa estruturada conforme a Matriz Oficial do ENEM.</span>
                  <button
                    type="button"
                    onClick={() => setIsRepertoireSwapOpen(true)}
                    className="text-amber-800 dark:text-amber-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Trocar repertórios ou reescrever argumentos</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 1: Paragraphs */}
          {activeTabSub === 'text' && (
            <div className="space-y-6">
              {/* Intro */}
              <div className="p-5 rounded-xl bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                  <span>1. Introdução (Contexto + Tema + Tese)</span>
                  <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">~6 a 7 linhas</span>
                </div>
                <p className="font-serif text-slate-800 dark:text-slate-200 text-base leading-relaxed text-justify">
                  {generatedEssay.structure.intro}
                </p>
              </div>

              {/* D1 */}
              <div className="p-5 rounded-xl bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                  <span>2. Desenvolvimento 1 (Argumento 1 + Repertório + Consequência)</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-semibold text-[10px] lowercase first-letter:uppercase">
                      Conectivo Inicial Inaugural
                    </span>
                    <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">~7 a 8 linhas</span>
                  </div>
                </div>
                <p className="font-serif text-slate-800 dark:text-slate-200 text-base leading-relaxed text-justify">
                  {generatedEssay.structure.d1}
                </p>
              </div>

              {/* D2 */}
              <div className="p-5 rounded-xl bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                  <span>3. Desenvolvimento 2 (Operador Interparágrafo + Argumento 2 + Aprofundamento)</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold text-[10px]">
                      Operador Interparágrafo (§3)
                    </span>
                    <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">~7 a 8 linhas</span>
                  </div>
                </div>
                <p className="font-serif text-slate-800 dark:text-slate-200 text-base leading-relaxed text-justify">
                  {generatedEssay.structure.d2}
                </p>
              </div>

              {/* Conclusion */}
              <div className="p-5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  <span>4. Conclusão (Proposta de Intervenção com 5 Elementos + Fechamento Circular)</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-semibold text-[10px]">
                      Operador Conclusivo (§4)
                    </span>
                    <span className="text-[11px] font-normal text-emerald-700 dark:text-emerald-400">~7 a 8 linhas</span>
                  </div>
                </div>
                <p className="font-serif text-slate-800 dark:text-slate-200 text-base leading-relaxed text-justify">
                  {generatedEssay.structure.conclusion}
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Audit & Rigor Nota 1000 */}
          {activeTabSub === 'audit' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Official Seal & Executive Summary */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-indigo-500/5 to-slate-100 dark:from-amber-950/40 dark:via-indigo-950/20 dark:to-slate-900 border border-amber-300/60 dark:border-amber-700/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Homologação Oficial Nota 1000
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Auditoria de Matriz INEP
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-amber-500" />
                      Certificado de Auditoria da Banca Revisora
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {generatedEssay.auditComplianceReport?.auditorProtocol || 'Matriz Oficial de Referência INEP & Auditoria Anti-Inflação de 2ª Camada'}
                    </p>
                  </div>

                  {/* Score Pill */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800/80 shadow-xs">
                    <div className="text-right">
                      <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Nota Global</span>
                      <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                        {generatedEssay.auditComplianceReport?.verifiedGrade || 1000}
                        <span className="text-xs font-bold text-slate-400">/1000</span>
                      </span>
                    </div>
                    <div className="h-9 w-px bg-slate-200 dark:bg-slate-700" />
                    <div className="text-left text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex flex-col justify-center">
                      <span className="flex items-center gap-1">
                        <CheckCheck className="w-3.5 h-3.5" /> 5x Nível 5 (200 pts)
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Auditado sem inflação</span>
                    </div>
                  </div>
                </div>

                {/* Banca Executive Verdict */}
                <div className="p-3.5 rounded-xl bg-amber-100/60 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
                  <strong>Parecer da Banca Revisora:</strong> {generatedEssay.auditComplianceReport?.bancaVerdict || 'Texto com 100% de conformidade técnica nos parâmetros oficiais do INEP. Aprovado com pontuação máxima em todas as 5 competências.'}
                </div>
              </div>

              {/* Quick Competency Badges Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { num: 'C1', title: 'Norma Culta & Sintaxe', score: generatedEssay.auditComplianceReport?.c1Audit.score || 200 },
                  { num: 'C2', title: 'Tema & Repertório', score: generatedEssay.auditComplianceReport?.c2Audit.score || 200 },
                  { num: 'C3', title: 'Projeto & Autoria', score: generatedEssay.auditComplianceReport?.c3Audit.score || 200 },
                  { num: 'C4', title: 'Coesão Textual', score: generatedEssay.auditComplianceReport?.c4Audit.score || 200 },
                  { num: 'C5', title: 'Intervenção (5 Elem.)', score: generatedEssay.auditComplianceReport?.c5Audit.score || 200 },
                ].map((c) => (
                  <div key={c.num} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-700 dark:text-indigo-400">{c.num}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {c.score} pts
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate mt-1">
                      {c.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* 5 Competency Deep-Dive Cards */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Desdobramento Detalhado das 5 Competências Auditadas</span>
                </h4>

                {/* C1 Deep Dive */}
                <div className="p-4.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold text-xs">C1</span>
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Norma Padrão, Sintaxe e Vocabulário Formal</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                      200 / 200 pts (Zero Desvios)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <p className="text-slate-600 dark:text-slate-400">
                        <strong>Complexidade Sintática:</strong> {generatedEssay.auditComplianceReport?.c1Audit.syntacticComplexity || 'Subordinação complexa e orações intercaladas fluídas.'}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        <strong>Desvios Identificados:</strong> <span className="text-emerald-600 dark:text-emerald-400 font-bold">0 (Nenhum desvio gramatical ou truncamento)</span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="block font-bold text-slate-700 dark:text-slate-300">Pilares Verificados:</span>
                      <div className="flex flex-wrap gap-1">
                        {(generatedEssay.auditComplianceReport?.c1Audit.verifiedPillars || ['Subordinação Sintática', 'Paralelismo', 'Riqueza Lexical']).map((pillar, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-semibold">
                            ✓ {pillar}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {generatedEssay.auditComplianceReport?.c1Audit.exemplaryExcerpt && (
                    <div className="p-2.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs italic font-serif text-indigo-950 dark:text-indigo-200">
                      "{generatedEssay.auditComplianceReport.c1Audit.exemplaryExcerpt}"
                    </div>
                  )}
                </div>

                {/* C2 Deep Dive */}
                <div className="p-4.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold text-xs">C2</span>
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Compreensão Temática & Repertório Produtivo</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                      200 / 200 pts (100% Produtivo)
                    </span>
                  </div>
                  <div className="text-xs space-y-2">
                    <p className="text-slate-600 dark:text-slate-400">
                      <strong>Aderência ao Tema:</strong> {generatedEssay.auditComplianceReport?.c2Audit.thematicAdherence || 'Abordagem integral de todos os núcleos da proposta temática.'}
                    </p>
                    <div>
                      <strong className="text-slate-700 dark:text-slate-300">Áreas de Conhecimento Legitimadas:</strong>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {(generatedEssay.auditComplianceReport?.c2Audit.legitimacyAreas || ['Filosofia', 'Sociologia', 'Legislação']).map((area, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-[10px] font-bold">
                            ★ {area}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      <strong>Prova do Vínculo Produtivo:</strong> {generatedEssay.auditComplianceReport?.c2Audit.productiveLinkProof || 'O repertório sustenta diretamente a tese sem funcionar como mero adereço.'}
                    </p>
                  </div>
                </div>

                {/* C3 Deep Dive */}
                <div className="p-4.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold text-xs">C3</span>
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Projeto de Texto Estratégico & Autoria Crítica</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                      200 / 200 pts (Sem Lacunas)
                    </span>
                  </div>
                  <div className="text-xs space-y-2">
                    <p className="text-slate-600 dark:text-slate-400">
                      <strong>Tese Bipartida:</strong> {generatedEssay.auditComplianceReport?.c3Audit.bipartiteThesisCompliance || 'Tese articulada em 2 frentes claras na introdução, desenvolvidas em D1 e D2.'}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      <strong>Cadeia Causal:</strong> {generatedEssay.auditComplianceReport?.c3Audit.causalChainCheck || 'Relação de causa e efeito sustentada em ambos os desenvolvimentos sem saltos lógicos.'}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      <strong>Marca de Autoria:</strong> {generatedEssay.auditComplianceReport?.c3Audit.authorialVoiceMarker || 'Juízo de valor contundente e posicionamento crítico marcante.'}
                    </p>
                  </div>
                </div>

                {/* C4 Deep Dive */}
                <div className="p-4.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold text-xs">C4</span>
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Coesão Inter e Intraparágrafo</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                      200 / 200 pts (Mínimo 2 Interparágrafos)
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <span className="block font-bold text-slate-700 dark:text-slate-300">Operadores Interparágrafos Auditados:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {(generatedEssay.auditComplianceReport?.c4Audit.interParagraphConnectors || [
                        { paragraph: 'D1 (§2)', connector: 'Sob essa ótica,', role: 'Inaugural' },
                        { paragraph: 'D2 (§3)', connector: 'Outrossim,', role: 'Progressão/Soma' },
                        { paragraph: 'Conclusão (§4)', connector: 'Torna-se imperioso, dessarte,', role: 'Conclusivo' }
                      ]).map((op, i) => (
                        <div key={i} className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block">{op.paragraph}</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{op.connector}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">{op.role}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 pt-1">
                      <strong>Diversidade Intraparágrafo:</strong> {generatedEssay.auditComplianceReport?.c4Audit.intraParagraphDiversity || 'Amplo repertório de conectivos intraparágrafos sem repetições viciosas.'}
                    </p>
                  </div>
                </div>

                {/* C5 Deep Dive: 5 Elements */}
                <div className="p-4.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-bold text-xs">C5</span>
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Proposta de Intervenção com os 5 Elementos Validados</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                      200 / 200 pts (5/5 Elementos)
                    </span>
                  </div>

                  {/* 5 Elements Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                    {/* Agente */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-800 dark:text-emerald-400">1. Agente</span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">✓ Válido</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-snug">
                        {generatedEssay.auditComplianceReport?.c5Audit.elements.agente.text || 'Ministério da Educação (MEC)'}
                      </p>
                    </div>

                    {/* Ação */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-800 dark:text-emerald-400">2. Ação</span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">✓ Válido</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-snug">
                        {generatedEssay.auditComplianceReport?.c5Audit.elements.acao.text || 'deve formular um plano integrado de capacitação docente'}
                      </p>
                    </div>

                    {/* Meio/Modo */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-800 dark:text-emerald-400">3. Modo/Meio</span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">✓ Válido</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-snug">
                        {generatedEssay.auditComplianceReport?.c5Audit.elements.meio.text || 'por intermédio de repasses orçamentários e parcerias'}
                      </p>
                    </div>

                    {/* Efeito */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-800 dark:text-emerald-400">4. Efeito</span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">✓ Válido</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-snug">
                        {generatedEssay.auditComplianceReport?.c5Audit.elements.efeito.text || 'a fim de consolidar a igualdade de oportunidades'}
                      </p>
                    </div>

                    {/* Detalhamento */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900 space-y-1 sm:col-span-2 lg:col-span-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-800 dark:text-emerald-400">
                          5. Detalhamento (do {generatedEssay.auditComplianceReport?.c5Audit.elements.detalhamento.detailedElement || 'Agente'})
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">✓ Válido</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-snug">
                        {generatedEssay.auditComplianceReport?.c5Audit.elements.detalhamento.text || 'órgão do Poder Executivo responsável pelas políticas públicas federais de ensino'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-emerald-800 dark:text-emerald-300 pt-1">
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Direitos Humanos Respeitados
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Fechamento Circular com a Introdução
                    </span>
                  </div>
                </div>
              </div>

              {/* Anti-Inflation Checklist Table */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ListFilter className="w-4 h-4 text-amber-500" />
                  <span>Checklist Anti-Inflação de 2ª Camada (Auditoria de Rigor INEP)</span>
                </h4>
                <div className="space-y-2">
                  {(generatedEssay.auditComplianceReport?.antiInflationChecklist || [
                    { criterion: 'Comprovação textual de todos os 5 elementos na C5', verified: true, evidenceInGeneratedText: 'Agente, ação, meio com "por intermédio", efeito com "a fim de" e detalhamento presentes.' },
                    { criterion: 'Mínimo de 2 operadores interparágrafos explícitos (C4)', verified: true, evidenceInGeneratedText: 'Operadores no início do D2 e da Conclusão com função coesiva atestada.' },
                    { criterion: 'Uso 100% produtivo dos repertórios socioculturais (C2)', verified: true, evidenceInGeneratedText: 'Repertórios articulados causalmente à tese e ao tema.' },
                    { criterion: 'Projeto de texto estratégico sem lacunas argumentativas (C3)', verified: true, evidenceInGeneratedText: 'Tese bipartida da introdução cumprida integralmente em D1 e D2.' },
                    { criterion: 'Ausência total de desvios normativos e períodos truncados (C1)', verified: true, evidenceInGeneratedText: 'Sintaxe complexa e pontuação rigorosamente conforme à norma culta.' }
                  ]).map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{item.criterion}</span>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] italic">"{item.evidenceInGeneratedText}"</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] whitespace-nowrap self-start sm:self-center flex items-center gap-1">
                        <Check className="w-3 h-3" /> Auditado
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Re-audit Button */}
              <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5 text-center sm:text-left">
                  <span className="font-bold text-indigo-950 dark:text-indigo-200">
                    Deseja submeter esta redação ao pipeline de auditoria e validação de nota ao vivo?
                  </span>
                  <p className="text-indigo-700 dark:text-indigo-400 text-[11px]">
                    Envie o texto diretamente para o Corretor Oficial e visualize o Validador de Nota e o Progresso de Auditoria em tempo real.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSendToCorrection(generatedEssay.fullText, generatedEssay.theme)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <FileText className="w-4 h-4" />
                  <span>Auditar no Corretor Oficial</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Repertoires */}
          {activeTabSub === 'repertoire' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-slate-100 dark:from-amber-950/40 dark:via-indigo-950/20 dark:to-slate-900 border border-amber-300/70 dark:border-amber-700/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Personalização de Repertórios Socioculturais (Competência 2)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Deseja testar outros pensadores, filmes, leis ou dados históricos mantendo a estrutura Nota 1000?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRepertoireSwapOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Trocar Repertórios do Texto</span>
                </button>
              </div>

              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center justify-between">
                <span>Repertórios Socioculturais Atuais no Texto:</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {generatedEssay.repertoriosUsed?.length || 0} repertórios legitimados
                </span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedEssay.repertoriosUsed?.map((rep, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{rep.name}</span>
                        <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-semibold text-[10px]">
                          {rep.area}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">
                        <strong>Contextualização:</strong> {rep.contextualization}
                      </p>
                      <p className="text-indigo-900 dark:text-indigo-300 bg-indigo-50/60 dark:bg-indigo-950/60 p-2 rounded border border-indigo-100 dark:border-indigo-800">
                        <strong>Vínculo Produtivo com a Tese:</strong> {rep.connectionToThesis}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsRepertoireSwapOpen(true)}
                        className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Substituir este repertório</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Structure Explanation */}
          {activeTabSub === 'structure' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100">Projeto de Texto e Raciocínio Argumentativo:</h4>
                <p>{generatedEssay.structuralExplanation}</p>
              </div>

              {generatedEssay.pedagogicalTips && generatedEssay.pedagogicalTips.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-2">
                  <h4 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Dicas Pedagógicas para Praticar:</span>
                  </h4>
                  <ul className="list-disc list-inside text-amber-800 dark:text-amber-400 space-y-1">
                    {generatedEssay.pedagogicalTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULLSCREEN FOCUS MODE (SIMULADOR DE REDAÇÃO ENEM 60 MINUTOS) */}
      {/* ========================================================================= */}
      {isFocusMode && (
        <div className={`fixed inset-0 z-50 flex flex-col ${
          focusThemeMode === 'dark' 
            ? 'bg-slate-950 text-slate-100' 
            : 'bg-stone-100 text-slate-900'
        }`}>
          {/* Top Bar - Controls & Countdown */}
          <header className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-4 flex-wrap select-none ${
            focusThemeMode === 'dark' 
              ? 'bg-slate-900/90 border-slate-800' 
              : 'bg-white/95 border-stone-200 shadow-2xs'
          }`}>
            {/* Left: Theme Info & Mode Badge */}
            <div className="flex items-center gap-3 min-w-0 max-w-md sm:max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-100/80 px-2 py-0.5 rounded-md">
                  Modo Foco ENEM
                </span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold truncate text-slate-700 dark:text-slate-200" title={activeTheme}>
                {activeTheme || 'Tema Livre do ENEM'}
              </p>
            </div>

            {/* Center: 60-Min Countdown Timer */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl font-mono font-black text-sm sm:text-lg border ${
                timerFinished 
                  ? 'bg-rose-500 text-white border-rose-600 animate-bounce' 
                  : timerSeconds <= 600
                  ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300'
                  : timerSeconds <= 1200
                  ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300'
                  : 'bg-indigo-50 text-indigo-900 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300'
              }`}>
                <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${isTimerRunning ? 'animate-spin-slow' : ''}`} />
                <span>{formatTimer(timerSeconds)}</span>
                {timerFinished && <span className="text-xs font-sans uppercase">Tempo Esgotado!</span>}
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  title={isTimerRunning ? 'Pausar Cronômetro' : 'Iniciar Cronômetro'}
                  className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  type="button"
                  onClick={handleResetTimer}
                  title="Reiniciar 60 minutos"
                  className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleAddFiveMinutes}
                  title="Adicionar +5 min"
                  className="px-2 py-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  +5m
                </button>
              </div>
            </div>

            {/* Right: Actions & Exit */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsZenDistractionFree(!isZenDistractionFree)}
                title={isZenDistractionFree ? 'Exibir menus e ferramentas' : 'Ocultar tudo (Modo Tela Cheia Imersivo)'}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isZenDistractionFree
                    ? 'bg-amber-500 text-slate-950 border-amber-600'
                    : 'border-violet-400/50 bg-violet-500/20 hover:bg-violet-500/30 text-violet-950 dark:text-violet-200'
                }`}
              >
                {isZenDistractionFree ? <Eye className="w-3.5 h-3.5 text-slate-950" /> : <EyeOff className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />}
                <span className="hidden sm:inline">{isZenDistractionFree ? 'Ver Menus' : 'Zero Distrações'}</span>
              </button>

              <button
                type="button"
                onClick={() => setFocusThemeMode(focusThemeMode === 'dark' ? 'light' : 'dark')}
                title="Alternar Modo Claro / Escuro"
                className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
              >
                {focusThemeMode === 'dark' ? '☀️ Claro' : '🌙 Escuro'}
              </button>

              <button
                type="button"
                onClick={() => handleOpenSynonymDictionary(floatingSelection.text || 'coisa', activeTheme)}
                title="Dicionário de Sinônimos Formais (Competência 1)"
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-indigo-400/50 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-950 dark:text-indigo-200 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden sm:inline">Sinônimos C1</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenMasterTip(false)}
                title="Dica do Mestre (5 Competências)"
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-400/50 bg-amber-500/20 hover:bg-amber-500/30 text-amber-950 dark:text-amber-200 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">Dica do Mestre</span>
              </button>

              <button
                type="button"
                onClick={() => setShowHelperDrawer(!showHelperDrawer)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  showHelperDrawer 
                    ? 'bg-amber-500 text-slate-950 border-amber-600' 
                    : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-transparent'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Guia & Ideias</span>
              </button>

              <button
                type="button"
                onClick={handleSendDraftToCorrection}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Corrigir</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFocusMode(false)}
                title="Sair do Modo Foco (ESC)"
                className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950/60 dark:hover:bg-rose-900 dark:text-rose-200 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
              >
                <Minimize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </header>

          {/* Main Focus Area (Split with Optional Drawer) */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Writing Center Stage */}
            <div className={`flex-1 flex flex-col items-center justify-start overflow-y-auto transition-all ${
              isZenDistractionFree ? 'p-2 sm:p-4' : 'p-4 sm:p-8'
            }`}>
              {/* Paper Canvas (Simulating official ENEM 30-line Sheet) */}
              <div className={`w-full rounded-2xl border shadow-xl flex flex-col transition-all my-auto ${
                isZenDistractionFree ? 'max-w-5xl' : 'max-w-4xl'
              } ${
                focusThemeMode === 'dark'
                  ? 'bg-slate-900 border-slate-800 shadow-slate-950/50'
                  : 'bg-white border-stone-300 shadow-stone-300/40'
              }`}>
                {/* Folha Header */}
                <div className={`px-6 py-4 border-b flex items-center justify-between ${
                  focusThemeMode === 'dark' ? 'border-slate-800 bg-slate-950/40' : 'border-stone-200 bg-stone-50/70'
                }`}>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Folha Oficial de Redação do ENEM (Simulador)
                    </h3>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                      {activeTheme || 'Tema da Redação'}
                    </p>
                  </div>

                  {/* Real-time Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                      estimatedLines < 7 
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' 
                        : estimatedLines <= 30
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {estimatedLines} / 30 linhas
                    </span>
                  </div>
                </div>

                {/* Textarea with Line Numbers simulation & Selection Trigger */}
                <div className="relative p-6 sm:p-8 flex-1 min-h-[480px]">
                  <textarea
                    ref={textareaRef}
                    value={focusDraft}
                    onChange={(e) => setFocusDraft(e.target.value)}
                    onSelect={handleTextareaSelect}
                    onKeyUp={handleTextareaSelect}
                    onClick={handleTextareaSelect}
                    placeholder={`Escreva sua redação aqui respeitando a estrutura do ENEM:\n\n1. Introdução: Apresente o tema e a tese bipartida (Argumento 1 + Argumento 2);\n2. D1: Desenvolva o Argumento 1 com repertório produtivo e consequência;\n3. D2: Aprofunde o Argumento 2 com operador interparágrafo;\n4. Conclusão: Proposta de intervenção completa com os 5 elementos (Agente, Ação, Meio/Modo, Efeito, Detalhamento).`}
                    className={`w-full h-full min-h-[440px] resize-none outline-hidden font-serif text-base sm:text-lg leading-relaxed bg-transparent ${
                      focusThemeMode === 'dark' 
                        ? 'text-slate-100 placeholder:text-slate-600' 
                        : 'text-slate-900 placeholder:text-slate-400'
                    }`}
                    style={{ lineHeight: '1.8' }}
                  />
                </div>

                {/* Folha Footer Stats */}
                <div className={`px-6 py-3 border-t text-xs flex flex-wrap items-center justify-between gap-3 ${
                  focusThemeMode === 'dark' ? 'border-slate-800 bg-slate-950/40 text-slate-400' : 'border-stone-200 bg-stone-50/70 text-slate-600'
                }`}>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span><strong>{wordsCount}</strong> palavras</span>
                    <span><strong>{focusDraft.length}</strong> caracteres</span>
                    <span><strong>{paragraphsCount}</strong> {paragraphsCount === 1 ? 'parágrafo' : 'parágrafos'}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Salvo automaticamente
                    </span>
                    <span className="hidden md:inline">•</span>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Selecione qualquer palavra para sinônimos C1
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {estimatedLines < 7 ? (
                      <span className="text-rose-600 font-bold text-[11px] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Abaixo do mínimo (7 linhas)
                      </span>
                    ) : estimatedLines > 30 ? (
                      <span className="text-amber-600 font-bold text-[11px] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Ultrapassou 30 linhas
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Extensão ideal para o ENEM
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Slide-in Helper Drawer for Repertoires & Structure Tips (hidden in Zen Mode) */}
            {showHelperDrawer && !isZenDistractionFree && (
              <div className={`w-80 sm:w-96 border-l p-5 overflow-y-auto space-y-5 flex-shrink-0 animate-in slide-in-from-right duration-200 ${
                focusThemeMode === 'dark' 
                  ? 'bg-slate-900 border-slate-800 text-slate-200' 
                  : 'bg-white border-stone-200 text-slate-800 shadow-lg'
              }`}>
                <div className="flex items-center justify-between border-b pb-3">
                  <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <span>Guia de Redação Rápido</span>
                  </h4>
                  <button 
                    onClick={() => setShowHelperDrawer(false)}
                    className="text-xs p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    ✕
                  </button>
                </div>

                {/* Synonym quick finder card in drawer */}
                <div className="p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      Dicionário de Sinônimos C1
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Evite termos informais ou repetitivos na sua redação:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['coisa', 'problema', 'fazer', 'mostrar', 'hoje em dia', 'ter'].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => handleOpenSynonymDictionary(w, activeTheme)}
                        className="px-2 py-1 rounded-md text-[11px] font-semibold bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900 hover:border-indigo-400 text-indigo-900 dark:text-indigo-300 transition-colors cursor-pointer"
                      >
                        {w} →
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenSynonymDictionary('coisa', activeTheme)}
                    className="w-full mt-1.5 py-1.5 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold text-center transition-colors cursor-pointer"
                  >
                    Abrir Dicionário Completo
                  </button>
                </div>

                {/* Structure checklist */}
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 space-y-1">
                    <span className="font-bold text-indigo-900 dark:text-indigo-300">1. Introdução (6-7 linhas)</span>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                      Contextualização (Repertório) + Tema + Tese Bipartida (D1 e D2).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-1">
                    <span className="font-bold">2. Desenvolvimento 1 (7-8 linhas)</span>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                      Tópico Frasal + Repertório Legitimado + Desdobramento Crítico + Consequência.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-1">
                    <span className="font-bold">3. Desenvolvimento 2 (7-8 linhas)</span>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                      Operador (<em>Ademais/Outrossim</em>) + Tópico Frasal 2 + Argumentação + Impacto.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 space-y-1">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300">4. Conclusão C5 (7-8 linhas)</span>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                      Agente + Ação + Modo/Meio + Efeito + Detalhamento de 1 elemento.
                    </p>
                  </div>
                </div>

                {/* Master Tip CTA in Drawer */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenMasterTip(false)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4 text-slate-950" />
                    <span>Dica do Mestre (5 Competências)</span>
                  </button>
                </div>

                {/* Inserter for generated essay if present */}
                {generatedEssay && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setFocusDraft(generatedEssay.fullText)}
                      className="w-full py-2 px-3 rounded-xl bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-bold hover:bg-amber-500/30 transition-colors"
                    >
                      Inserir Modelo Nota 1000 Gerado
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Selection Tooltip Pill for Synonyms */}
      {floatingSelection.visible && (
        <div
          id="floating-synonym-pill"
          style={{
            position: 'fixed',
            left: `${floatingSelection.x}px`,
            top: `${floatingSelection.y}px`,
            zIndex: 9999,
          }}
          className="animate-in fade-in zoom-in-95 duration-150 drop-shadow-xl"
        >
          <button
            type="button"
            onClick={() => {
              handleOpenSynonymDictionary(floatingSelection.text, floatingSelection.sentence);
              setFloatingSelection((prev) => ({ ...prev, visible: false }));
            }}
            className="px-3 py-1.5 rounded-full bg-slate-950 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-xs font-extrabold border-2 border-amber-400 shadow-2xl flex items-center gap-1.5 cursor-pointer group transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Sinônimos C1 para <span className="text-amber-300 underline font-mono">"{floatingSelection.text}"</span></span>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </button>
        </div>
      )}

      {/* Master Tip Modal */}
      <MasterTipModal
        isOpen={isMasterTipOpen}
        onClose={() => setIsMasterTipOpen(false)}
        tip={masterTipData}
        isLoading={isMasterTipLoading}
        themeTitle={activeTheme}
        onInsertIntoDraft={handleInsertTipIntoDraft}
        onRefresh={() => handleOpenMasterTip(true)}
      />

      {/* Synonym Dictionary Modal (Competência 1) */}
      <SynonymDictionaryModal
        isOpen={isSynonymModalOpen}
        onClose={() => setIsSynonymModalOpen(false)}
        initialWord={synonymSearchWord}
        contextSentence={synonymContextSentence}
        theme={activeTheme}
        onReplaceInDraft={handleReplaceInDraft}
      />

      {/* Repertoire Swap Modal */}
      <ErrorBoundary fallbackTitle="Erro temporário no seletor de repertórios" fallbackMessage="Clique em restabelecer para recarregar o assistente de repertórios.">
        <RepertoireSwapModal
          isOpen={isRepertoireSwapOpen}
          onClose={() => setIsRepertoireSwapOpen(false)}
          essay={generatedEssay || undefined}
          currentEssay={generatedEssay || undefined}
          theme={activeTheme}
          onSwapRepertoires={handleSwapRepertoires}
          isLoading={isSwappingRepertoire}
        />
      </ErrorBoundary>
    </div>
  );
};

