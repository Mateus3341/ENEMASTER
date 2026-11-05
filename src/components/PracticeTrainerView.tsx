import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Target, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RefreshCw, 
  Sparkles, 
  Bot, 
  Flame, 
  Layers,
  Loader2,
  AlertCircle,
  BookOpen,
  PenTool,
  Link2,
  Puzzle,
  Wand2,
  Copy,
  Check
} from 'lucide-react';
import { PracticeSnippetCategory, PracticeSnippetQuiz } from '../types';
import { AiProgressBar } from './AiProgressBar';
import { useAiProgress } from '../hooks/useAiProgress';
import { EnemasterMascot } from './EnemasterMascot';

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Randomly shuffles the 4 options of a snippet and recalculates the correctOptionIndex
function shuffleSnippetOptions(snippet: PracticeSnippetQuiz): PracticeSnippetQuiz {
  if (!snippet.options || snippet.options.length === 0) return snippet;
  const indexedOptions = snippet.options.map((text, idx) => ({
    text,
    isCorrect: idx === snippet.correctOptionIndex
  }));
  const shuffled = shuffleArray(indexedOptions);
  const newCorrectIndex = shuffled.findIndex(item => item.isCorrect);
  return {
    ...snippet,
    options: shuffled.map(item => item.text),
    correctOptionIndex: newCorrectIndex !== -1 ? newCorrectIndex : 0
  };
}

const PRACTICE_QUIZ_AI_STORAGE_KEY = 'enem_practice_quiz_ai_only_v3';
const PRACTICE_SEEN_HISTORY_KEY = 'enem_practice_seen_history_v1';

function getTodayDateKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function loadSeenHistory(): { themes: string[]; snippets: string[] } {
  try {
    const raw = localStorage.getItem(PRACTICE_SEEN_HISTORY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        themes: Array.isArray(parsed.themes) ? parsed.themes.slice(-60) : [],
        snippets: Array.isArray(parsed.snippets) ? parsed.snippets.slice(-60) : []
      };
    }
  } catch {}
  return { themes: [], snippets: [] };
}

function recordSeenSnippets(newItems: PracticeSnippetQuiz[]) {
  try {
    const current = loadSeenHistory();
    const addedThemes = newItems.map(i => i.themeContext || '').filter(Boolean);
    const addedSnippets = newItems.map(i => (i.snippet || '').slice(0, 90)).filter(Boolean);

    const updatedThemes = Array.from(new Set([...current.themes, ...addedThemes])).slice(-60);
    const updatedSnippets = Array.from(new Set([...current.snippets, ...addedSnippets])).slice(-60);

    localStorage.setItem(
      PRACTICE_SEEN_HISTORY_KEY,
      JSON.stringify({
        themes: updatedThemes,
        snippets: updatedSnippets
      })
    );
  } catch {}
}

type FilterMode = 'all' | PracticeSnippetCategory;

const CATEGORY_TABS: {
  id: FilterMode;
  label: string;
  shortDesc: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  {
    id: 'all',
    label: 'Todos Misturados',
    shortDesc: 'Questões 100% inéditas geradas por IA misturando conectivos, repertórios, tese/C5 e reescrita',
    icon: Layers
  },
  {
    id: 'conectivos',
    label: 'Lacunas: Conectivos',
    shortDesc: 'Preencha a lacuna com o conectivo que cria o sentido exato na frase',
    icon: Link2
  },
  {
    id: 'repertorio',
    label: 'Qual Repertório Usar?',
    shortDesc: 'Escolha o repertório sociocultural mais produtivo para o tema e argumento',
    icon: BookOpen
  },
  {
    id: 'completar_trecho',
    label: 'Completar Tese / C5',
    shortDesc: 'Complete lacunas de fechamento de introdução, tópico frasal ou conclusão',
    icon: Puzzle
  },
  {
    id: 'reescrita',
    label: 'Fortalecer Trecho',
    shortDesc: 'Substitua frases de senso comum ou truncadas por escrita Nota 1000',
    icon: Wand2
  }
];

function getCorujitoPositiveMessage(category: PracticeSnippetCategory, currentStreak: number): string {
  const streakPrefix =
    currentStreak >= 3
      ? `Uau, ${currentStreak} acertos seguidos! `
      : 'Mandou muito bem! ';

  switch (category) {
    case 'conectivos':
      return `${streakPrefix}Você escolheu o conectivo exato para costurar a relação lógica do período. É assim que se constrói coesão fluida de 200 pontos na Competência 4!`;
    case 'repertorio':
      return `${streakPrefix}Repertório legitimado, pertinente e produtivo! Você conectou a referência teórica diretamente ao problema do tema sem deixar o repertório solto.`;
    case 'completar_trecho':
      return `${streakPrefix}Fechamento cirúrgico! Completar o parágrafo com estrutura clara garante que o corretor identifique todos os elementos obrigatórios de primeira.`;
    case 'reescrita':
      return `${streakPrefix}Que evolução de escrita! Você trocou o senso comum por vocabulário formal, sintaxe limpa e argumentação madura digna de Redação Nota 1000.`;
    default:
      return `${streakPrefix}Escolha certeira! Esse padrão de escrita valoriza imediatamente a sua redação no ENEM.`;
  }
}

function getDidacticDistractorReason(snippet: PracticeSnippetQuiz, chosenIdx: number | null): string {
  if (chosenIdx === null || !snippet.options[chosenIdx]) return '';
  const chosenText = snippet.options[chosenIdx];

  switch (snippet.category) {
    case 'conectivos':
      return `Ao preencher a lacuna com "${chosenText}", a relação lógica entre as duas ideias do parágrafo muda ou gera desvio gramatical na Competência 4.`;
    case 'repertorio':
      return `A opção escolhida cita uma referência que não conversa diretamente com a causa ou consequência defendida neste parágrafo, o que tornaria o repertório improdutivo na Competência 2.`;
    case 'completar_trecho':
      return `O complemento escolhido fica vago, condicional ou deixa faltar o elemento estrutural exigido pelo projeto de texto (C3) ou pela proposta de intervenção (C5).`;
    case 'reescrita':
      return `A alternativa marcada ainda mantém traços de oralidade/senso comum ou preserva uma falha sintática que impede o parágrafo de atingir o nível máximo.`;
    default:
      return `A alternativa selecionada não resolve o ponto central exigido pelo contexto prático deste parágrafo.`;
  }
}

export const PracticeTrainerView: React.FC = () => {
  const todayKey = getTodayDateKey();

  const initialSavedQuiz = (() => {
    try {
      const raw = localStorage.getItem(PRACTICE_QUIZ_AI_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Only reuse cached AI questions if they were generated TODAY and are all AI-generated
        if (
          parsed &&
          parsed.sessionDate === todayKey &&
          Array.isArray(parsed.snippets) &&
          parsed.snippets.length > 0 &&
          parsed.snippets.every((s: PracticeSnippetQuiz) => s.isAiGenerated)
        ) {
          return parsed;
        }
      }
    } catch {}
    return null;
  })();

  const [snippets, setSnippets] = useState<PracticeSnippetQuiz[]>(
    () => initialSavedQuiz?.snippets || []
  );
  const [selectedCategory, setSelectedCategory] = useState<FilterMode>(
    () => initialSavedQuiz?.selectedCategory || 'all'
  );
  const [currentIndex, setCurrentIndex] = useState<number>(initialSavedQuiz?.currentIndex ?? 0);
  const [selectedOption, setSelectedOption] = useState<number | null>(
    initialSavedQuiz?.selectedOption ?? null
  );
  const [isAnswered, setIsAnswered] = useState<boolean>(Boolean(initialSavedQuiz?.isAnswered));
  const [score, setScore] = useState<number>(initialSavedQuiz?.score ?? 0);
  const [totalAnswered, setTotalAnswered] = useState<number>(initialSavedQuiz?.totalAnswered ?? 0);
  const [streak, setStreak] = useState<number>(initialSavedQuiz?.streak ?? 0);
  const [maxStreak, setMaxStreak] = useState<number>(initialSavedQuiz?.maxStreak ?? 0);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedModel, setCopiedModel] = useState<boolean>(false);
  const hasTriggeredInitialFetch = useRef<boolean>(false);

  const filteredSnippets = useMemo(() => {
    if (selectedCategory === 'all') return snippets;
    return snippets.filter(s => s.category === selectedCategory);
  }, [snippets, selectedCategory]);

  const safeIndex = filteredSnippets.length > 0
    ? Math.min(currentIndex, filteredSnippets.length - 1)
    : 0;

  const currentSnippet = filteredSnippets[safeIndex];
  const isLastQuestion = safeIndex >= filteredSnippets.length - 1;

  useEffect(() => {
    try {
      localStorage.setItem(
        PRACTICE_QUIZ_AI_STORAGE_KEY,
        JSON.stringify({
          sessionDate: todayKey,
          snippets,
          selectedCategory,
          currentIndex: safeIndex,
          selectedOption,
          isAnswered,
          score,
          totalAnswered,
          streak,
          maxStreak,
        })
      );
    } catch {}
  }, [todayKey, snippets, selectedCategory, safeIndex, selectedOption, isAnswered, score, totalAnswered, streak, maxStreak]);

  const practiceProgress = useAiProgress({
    steps: [
      'Sorteando novos eixos temáticos inéditos para o treino de hoje...',
      'Elaborando parágrafos com lacunas de conectivos, repertórios e C5...',
      'Calibrando alternativas práticas e gabarito do Mestre Corujito...',
      'Finalizando questões inéditas geradas exclusivamente por IA...'
    ],
    estimatedDurationMs: 5500,
  });

  const handleFetchAiQuestions = async (
    autoAdvance: boolean = false,
    isBackground: boolean = false,
    targetCategory: FilterMode = selectedCategory,
    replaceExisting: boolean = false
  ) => {
    if (isLoadingAi) return;
    if (!isBackground) {
      setIsLoadingAi(true);
      practiceProgress.startProgress();
      setErrorMsg(null);
    }

    try {
      const seen = loadSeenHistory();
      const response = await fetch('/api/generate-snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          count: 4, 
          category: targetCategory,
          excludeThemes: seen.themes,
          excludeSnippets: seen.snippets
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao gerar novos exercícios inéditos com IA.');
      }

      if (data.snippets && Array.isArray(data.snippets) && data.snippets.length > 0) {
        if (!isBackground) {
          practiceProgress.completeProgress();
        }
        const newSnippets: PracticeSnippetQuiz[] = data.snippets.map((s: PracticeSnippetQuiz) => 
          shuffleSnippetOptions({
            ...s,
            isAiGenerated: true
          })
        );

        recordSeenSnippets(newSnippets);

        if (replaceExisting) {
          setSnippets(newSnippets);
          setCurrentIndex(0);
          setSelectedOption(null);
          setIsAnswered(false);
        } else {
          setSnippets(prev => [...prev, ...newSnippets]);
          if (autoAdvance) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
          }
        }
      } else if (!isBackground) {
        throw new Error('Nenhuma questão foi retornada pela IA. Tente novamente.');
      }
    } catch (err: any) {
      if (!isBackground) {
        practiceProgress.resetProgress();
      }
      console.error('Error loading AI questions:', err);
      if (!isBackground) {
        setErrorMsg(err.message || 'Erro ao gerar questões com a IA.');
      }
    } finally {
      if (!isBackground) {
        setIsLoadingAi(false);
      }
    }
  };

  // Initial AI generation when opening on a new day or with an empty pool
  useEffect(() => {
    if (snippets.length === 0 && !hasTriggeredInitialFetch.current) {
      hasTriggeredInitialFetch.current = true;
      handleFetchAiQuestions(false, false, selectedCategory, true);
    }
  }, [snippets.length, selectedCategory]);

  // Background pre-fetch: automatically fetch more AI questions before the user reaches the end
  useEffect(() => {
    if (filteredSnippets.length === 0) return;
    const remaining = filteredSnippets.length - safeIndex;
    if (remaining <= 2 && !isLoadingAi && snippets.length < 80) {
      handleFetchAiQuestions(false, true, selectedCategory, false);
    }
  }, [safeIndex, filteredSnippets.length, selectedCategory, snippets.length]);

  const handleCategoryChange = (newCat: FilterMode) => {
    if (newCat === selectedCategory) return;
    setSelectedCategory(newCat);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setErrorMsg(null);

    const existingForCategory =
      newCat === 'all' ? snippets : snippets.filter(s => s.category === newCat);
    if (existingForCategory.length === 0 && !isLoadingAi) {
      handleFetchAiQuestions(false, false, newCat, false);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setCopiedModel(false);
  };

  const handleCopyModelSnippet = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedModel(true);
      setTimeout(() => setCopiedModel(false), 2000);
    } catch {}
  };

  const handleConfirm = () => {
    if (selectedOption === null || !currentSnippet) return;
    setIsAnswered(true);
    setTotalAnswered(prev => prev + 1);

    const isCorrect = selectedOption === currentSnippet.correctOptionIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleFetchAiQuestions(true, false, selectedCategory, false);
    } else {
      setSelectedOption(null);
      setIsAnswered(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleGenerateFreshSeries = () => {
    if (isLoadingAi) return;
    setSelectedOption(null);
    setIsAnswered(false);
    setErrorMsg(null);
    handleFetchAiQuestions(false, false, selectedCategory, true);
  };

  // Renders the snippet paragraph and highlights any [ _____ ] fill-in-the-blank slot
  const renderSnippetWithBlanks = (snippetText: string) => {
    if (!snippetText.includes('[ _____ ]')) {
      return <span>"{snippetText}"</span>;
    }

    const parts = snippetText.split('[ _____ ]');
    const previewText =
      selectedOption !== null && currentSnippet?.options[selectedOption]
        ? currentSnippet.options[selectedOption]
        : '_____';

    const isCorrectSelection =
      isAnswered && selectedOption === currentSnippet?.correctOptionIndex;

    let blankStyle =
      'bg-purple-100/90 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 border-b-2 border-purple-500 px-2.5 py-0.5 rounded-md font-sans font-bold not-italic text-sm sm:text-base transition-all';

    if (selectedOption === null) {
      blankStyle =
        'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-b-2 border-dashed border-amber-500 px-3 py-0.5 rounded-md font-sans font-extrabold not-italic tracking-widest text-sm sm:text-base';
    } else if (isAnswered) {
      blankStyle = isCorrectSelection
        ? 'bg-emerald-100 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-200 border-b-2 border-emerald-600 px-2.5 py-0.5 rounded-md font-sans font-bold not-italic text-sm sm:text-base'
        : 'bg-rose-100 dark:bg-rose-950/90 text-rose-900 dark:text-rose-200 border-b-2 border-rose-600 px-2.5 py-0.5 rounded-md font-sans font-bold not-italic text-sm sm:text-base';
    }

    return (
      <span>
        "{parts[0]}
        <span className={`inline-block mx-1 ${blankStyle}`}>
          {selectedOption === null ? 'Complete a lacuna' : previewText}
        </span>
        {parts.slice(1).join('[ _____ ]')}"
      </span>
    );
  };

  const accuracyRate = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
  const activeTabInfo = CATEGORY_TABS.find(t => t.id === selectedCategory) || CATEGORY_TABS[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 shrink-0">
              <Target className="w-6 h-6" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Quiz Prático de Escrita
                </h1>
                <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                  · 100% Gerado por IA
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Questões inéditas criadas dinamicamente por IA a cada sessão para você nunca repetir o mesmo treino.
              </p>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex items-center gap-3 self-start sm:self-auto bg-slate-50 dark:bg-slate-900 px-3.5 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 tabular-nums">
            <div className="text-center px-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Acertos</span>
              <span className="text-sm sm:text-base font-black text-purple-700 dark:text-purple-400">{score} / {totalAnswered}</span>
            </div>
            <div className="w-px h-7 bg-slate-200 dark:bg-slate-800"></div>
            <div className="text-center px-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Precisão</span>
              <span className="text-sm sm:text-base font-black text-indigo-700 dark:text-indigo-400">{accuracyRate}%</span>
            </div>
            {streak > 1 && (
              <>
                <div className="w-px h-7 bg-slate-200 dark:bg-slate-800"></div>
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 px-2 font-black text-xs sm:text-sm">
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{streak}x</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Interactive Category Filter Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Escolha o tipo de exercício prático:
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              {activeTabInfo.shortDesc}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900/90 rounded-2xl border border-slate-200/70 dark:border-slate-800">
            {CATEGORY_TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;
              const countInCat =
                tab.id === 'all'
                  ? snippets.length
                  : snippets.filter(s => s.category === tab.id).length;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleCategoryChange(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-300 shadow-xs border border-slate-200/80 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                  <span className="text-[11px] opacity-70 tabular-nums">({countInCat})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 tabular-nums">
            <PenTool className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>
              Série atual da IA: <strong className="text-slate-800 dark:text-slate-200">{filteredSnippets.length} questões inéditas</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-shuffle-restart"
              disabled={isLoadingAi}
              onClick={handleGenerateFreshSeries}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
              <span>Nova Série Inédita (IA)</span>
            </button>

            <button
              type="button"
              id="btn-generate-ai-more"
              disabled={isLoadingAi}
              onClick={() => handleFetchAiQuestions(false, false, selectedCategory, false)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0 shadow-xs"
            >
              {isLoadingAi ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              )}
              <span>+ Gerar mais com IA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <p className="text-xs sm:text-sm font-medium">{errorMsg}</p>
          </div>
          <button
            onClick={() => handleFetchAiQuestions(isLastQuestion, false, selectedCategory, filteredSnippets.length === 0)}
            className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 shrink-0 cursor-pointer whitespace-nowrap"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Loading state when generating questions from AI */}
      {isLoadingAi && (isLastQuestion || filteredSnippets.length === 0) && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <AiProgressBar
            isLoading={isLoadingAi}
            progress={practiceProgress.progress}
            currentStepIndex={practiceProgress.currentStepIndex}
            steps={practiceProgress.steps}
            title="Criando Questões Inéditas com IA..."
            subtitle="Formulando novos temas, lacunas de conectivos, repertórios aplicáveis e reescritas sem repetir trechos anteriores"
            accentColor="purple"
            variant="card"
          />
        </div>
      )}

      {/* Main Question Card */}
      {(!isLoadingAi || (!isLastQuestion && filteredSnippets.length > 0)) && currentSnippet && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-6">
          {/* Card Meta */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80 pb-3.5">
            <div className="flex flex-wrap items-center gap-2 tabular-nums">
              <span className="font-extrabold text-slate-900 dark:text-white">
                Exercício {safeIndex + 1} de {filteredSnippets.length}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-bold text-purple-700 dark:text-purple-300">
                {currentSnippet.categoryLabel}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-amber-700 dark:text-amber-300 font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>Inédita por IA</span>
              </span>
            </div>

            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              {currentSnippet.competencyFocus}
            </span>
          </div>

          {/* Theme Context Banner (when present) */}
          {currentSnippet.themeContext && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 shrink-0">
                Tema da Redação:
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                “{currentSnippet.themeContext}”
              </span>
            </div>
          )}

          {/* The Snippet under examination */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
              {currentSnippet.snippet.includes('[ _____ ]')
                ? 'Parágrafo com lacuna para preencher:'
                : 'Trecho de redação em construção:'}
            </span>
            <blockquote className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-serif text-slate-900 dark:text-slate-100 text-base sm:text-lg leading-relaxed italic">
              {renderSnippetWithBlanks(currentSnippet.snippet)}
            </blockquote>
          </div>

          {/* Dynamic Practical Question Prompt & Options */}
          <div className="space-y-3.5">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug">
              {currentSnippet.questionPrompt}
            </h2>

            <div className="space-y-2.5">
              {currentSnippet.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                let btnStyle =
                  'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200';

                if (isAnswered) {
                  if (idx === currentSnippet.correctOptionIndex) {
                    btnStyle =
                      'border-emerald-500 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-300 dark:ring-emerald-800 font-bold';
                  } else if (isSelected) {
                    btnStyle =
                      'border-rose-500 dark:border-rose-600 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-200 ring-2 ring-rose-300 dark:ring-rose-800';
                  } else {
                    btnStyle =
                      'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 dark:text-slate-600 opacity-60';
                  }
                } else if (isSelected) {
                  btnStyle =
                    'border-purple-600 dark:border-purple-500 bg-purple-50/80 dark:bg-purple-950/60 text-purple-950 dark:text-purple-200 ring-2 ring-purple-200 dark:ring-purple-800 font-bold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-3 transition-all cursor-pointer ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-full border border-current font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              {isAnswered && isLastQuestion && (
                <span className="text-purple-700 dark:text-purple-400 font-bold flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5" />
                  Próximas questões inéditas serão geradas por IA!
                </span>
              )}
            </div>

            <div>
              {!isAnswered ? (
                <button
                  type="button"
                  id="btn-confirm-practice"
                  disabled={selectedOption === null}
                  onClick={handleConfirm}
                  className="px-6 py-3 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                >
                  Confirmar Resposta
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-next-practice"
                  disabled={isLoadingAi}
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl font-bold text-xs bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 whitespace-nowrap"
                >
                  {isLoadingAi ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                      <span>Gerando com IA...</span>
                    </>
                  ) : (
                    <>
                      <span>{isLastQuestion ? 'Avançar (Gerar mais com IA)' : 'Próximo Exercício'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Immediate Feedback Card with Mestre Corujito */}
          {isAnswered && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {selectedOption === currentSnippet.correctOptionIndex ? (
                /* POSITIVE FEEDBACK FROM MESTRE CORUJITO (CORRECT ANSWER) */
                <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                        <EnemasterMascot size="md" variant="avatar" mood="celebrating" />
                      </div>
                      <div className="sm:hidden">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                          Mestre Corujito
                        </span>
                        <span className="text-sm font-black text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          Resposta Certa!
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="hidden sm:flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Mestre Corujito • Resposta Certa!</span>
                        </span>
                        {streak > 1 && (
                          <span className="text-xs font-black text-amber-700 dark:text-amber-300 tabular-nums">
                            Sequência de {streak} acertos!
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-100 leading-relaxed">
                        “{getCorujitoPositiveMessage(currentSnippet.category, streak)}”
                      </p>
                    </div>
                  </div>

                  {/* Didactic confirmation of why it works */}
                  <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200/70 dark:border-emerald-800/60 space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                      Por que essa escolha funciona na prática:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {currentSnippet.explanation}
                    </p>
                  </div>
                </div>
              ) : (
                /* DIDACTIC ERROR FEEDBACK & SUGGESTED CORRECT FORM (WRONG ANSWER) */
                <div className="p-5 sm:p-6 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 space-y-4">
                  {/* Mascot Mentor Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 shadow-2xs">
                        <EnemasterMascot size="md" variant="avatar" mood="scholar" />
                      </div>
                      <div className="sm:hidden">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700 dark:text-rose-400 block">
                          Mestre Corujito
                        </span>
                        <span className="text-sm font-black text-rose-950 dark:text-rose-100 flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          Resposta Errada!
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 flex-1">
                      <span className="hidden sm:flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                        <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        <span>Mestre Corujito • Resposta Errada!</span>
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-rose-950 dark:text-rose-100 leading-relaxed">
                        “Não desanime! Errar no treino evita perder pontos no dia do ENEM. Veja exatamente por que a sua opção não encaixa aqui e qual é a forma certa:”
                      </p>
                    </div>
                  </div>

                  {/* Step 1: Why the chosen option is wrong + full didactic explanation */}
                  <div className="p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-rose-200/80 dark:border-rose-800/70 space-y-2">
                    {selectedOption !== null && currentSnippet.options[selectedOption] && (
                      <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700 dark:text-rose-400 block">
                          Sua escolha (Alternativa {String.fromCharCode(65 + selectedOption)}):
                        </span>
                        <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 line-through mt-0.5">
                          {currentSnippet.options[selectedOption]}
                        </p>
                      </div>
                    )}
                    <div className="space-y-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 block">
                        Motivo do erro e regra prática:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {getDidacticDistractorReason(currentSnippet, selectedOption)}{' '}
                        {currentSnippet.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Suggested Correct Form */}
                  <div className="p-4 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 space-y-1.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        Forma Correta Sugerida (Alternativa {String.fromCharCode(65 + currentSnippet.correctOptionIndex)}):
                      </span>
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-100 leading-relaxed">
                      {currentSnippet.options[currentSnippet.correctOptionIndex]}
                    </p>
                  </div>
                </div>
              )}

              {/* Ready-to-use Paragraph with Copy Button */}
              {currentSnippet.improvedSnippet && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-extrabold text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Como aplicar na sua redação (Parágrafo Modelo Nota 1000):</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyModelSnippet(currentSnippet.improvedSnippet)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {copiedModel ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-700 dark:text-emerald-300">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Parágrafo</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="font-serif text-sm sm:text-base text-slate-900 dark:text-slate-100 italic leading-relaxed">
                    "{currentSnippet.improvedSnippet}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
