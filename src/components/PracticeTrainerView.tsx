import React, { useState, useEffect } from 'react';
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
  BrainCircuit,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { PRACTICE_SNIPPETS } from '../data/officialData';
import { PracticeSnippetQuiz } from '../types';
import { AiProgressBar } from './AiProgressBar';
import { useAiProgress } from '../hooks/useAiProgress';

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

function prepareSnippets(list: PracticeSnippetQuiz[]): PracticeSnippetQuiz[] {
  return shuffleArray(list).map(s => shuffleSnippetOptions(s));
}

export const PracticeTrainerView: React.FC = () => {
  const [snippets, setSnippets] = useState<PracticeSnippetQuiz[]>(() => prepareSnippets(PRACTICE_SNIPPETS));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const practiceProgress = useAiProgress({
    steps: [
      'Consultando banco de matrizes e competências do ENEM...',
      'Formulando trechos dissertativos e diagnósticos de desvio...',
      'Construindo alternativas e justificativas pedagógicas...',
      'Calibrando nível de dificuldade e indexando quiz...'
    ],
    estimatedDurationMs: 6000,
  });

  const currentSnippet = snippets[currentIndex];
  const isLastQuestion = currentIndex >= snippets.length - 1;

  // Background pre-fetch: automatically fetch more questions before the user reaches the end
  useEffect(() => {
    const remaining = snippets.length - currentIndex;
    if (remaining <= 3 && !isLoadingAi && snippets.length < 60) {
      handleFetchAiQuestions(false, true);
    }
  }, [currentIndex, snippets.length]);

  // Fast AI question fetch with background support and instant failover
  const handleFetchAiQuestions = async (autoAdvance: boolean = false, isBackground: boolean = false) => {
    if (isLoadingAi) return;
    if (!isBackground) {
      setIsLoadingAi(true);
      practiceProgress.startProgress();
      setErrorMsg(null);
    }

    try {
      const response = await fetch('/api/generate-snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          count: 3, 
          excludeIds: snippets.map(s => s.id) 
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar novas questões com IA.');
      }

      const data = await response.json();
      if (data.snippets && Array.isArray(data.snippets) && data.snippets.length > 0) {
        if (!isBackground) {
          practiceProgress.completeProgress();
        }
        const newSnippets = data.snippets.map((s: PracticeSnippetQuiz) => 
          shuffleSnippetOptions({
            ...s,
            isAiGenerated: true
          })
        );

        setSnippets(prev => [...prev, ...newSnippets]);

        if (autoAdvance) {
          setCurrentIndex(prev => prev + 1);
          setSelectedOption(null);
          setIsAnswered(false);
        }
      } else if (!isBackground) {
        throw new Error('Nenhuma questão foi retornada pelo servidor.');
      }
    } catch (err: any) {
      if (!isBackground) {
        practiceProgress.resetProgress();
      }
      console.error('Error loading AI questions:', err);
      if (!isBackground) {
        setErrorMsg(err.message || 'Erro ao comunicar com a IA.');
      }
    } finally {
      if (!isBackground) {
        setIsLoadingAi(false);
      }
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
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
      // User reached the end of the current pool -> generate new ones with AI automatically
      handleFetchAiQuestions(true);
    } else {
      setSelectedOption(null);
      setIsAnswered(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleShuffleAndRestart = () => {
    setSnippets(prepareSnippets(PRACTICE_SNIPPETS));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setTotalAnswered(0);
    setStreak(0);
    setErrorMsg(null);
  };

  const accuracyRate = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
              <Target className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Treino de Trechos & Diagnóstico
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 text-[10px] font-black uppercase tracking-wider">
                  Modo Infinito IA
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Questões misturadas da base oficial e geração contínua por IA quando você concluir a série.
              </p>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex items-center gap-3 self-start sm:self-auto bg-slate-50 dark:bg-slate-900 px-3.5 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-800">
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
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
                  <span>{streak}x</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Layers className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span>Pool atual: <strong className="text-slate-800 dark:text-slate-200">{snippets.length} questões</strong> (Base embaralhada + IA)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-shuffle-restart"
              onClick={handleShuffleAndRestart}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Embaralhar Base</span>
            </button>

            <button
              type="button"
              id="btn-generate-ai-more"
              disabled={isLoadingAi}
              onClick={() => handleFetchAiQuestions(false)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoadingAi ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-700 dark:text-purple-400" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
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
            onClick={() => handleFetchAiQuestions(isLastQuestion)}
            className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 shrink-0 cursor-pointer"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Loading state when generating next question from AI */}
      {isLoadingAi && isLastQuestion && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <AiProgressBar
            isLoading={isLoadingAi}
            progress={practiceProgress.progress}
            currentStepIndex={practiceProgress.currentStepIndex}
            steps={practiceProgress.steps}
            title="Formulando Novas Questões de Treinamento com IA..."
            subtitle="Elaborando trechos dissertativos, alternativas e gabaritos comentados pela matriz do INEP"
            accentColor="purple"
            variant="card"
          />
        </div>
      )}

      {/* Main Question Card */}
      {(!isLoadingAi || !isLastQuestion) && currentSnippet && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Card Meta / Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 text-xs font-black">
                Questão {currentIndex + 1} de {snippets.length}
              </span>
              {currentSnippet.isAiGenerated ? (
                <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-[11px] font-extrabold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>Gerada por IA</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                  Oficial INEP (Base)
                </span>
              )}
            </div>

            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs font-bold">
              {currentSnippet.competencyFocus}
            </span>
          </div>

          {/* The Snippet under examination */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Trecho de redação sob análise:
            </span>
            <blockquote className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-l-4 border-purple-500 font-serif text-slate-900 dark:text-slate-100 text-base sm:text-lg leading-relaxed italic">
              "{currentSnippet.snippet}"
            </blockquote>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Qual é a avaliação técnica mais precisa deste trecho segundo o INEP?
            </span>

            <div className="space-y-2.5">
              {currentSnippet.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                let btnStyle = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200';

                if (isAnswered) {
                  if (idx === currentSnippet.correctOptionIndex) {
                    btnStyle = 'border-emerald-500 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-300 dark:ring-emerald-800 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'border-rose-500 dark:border-rose-600 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-200 ring-2 ring-rose-300 dark:ring-rose-800';
                  } else {
                    btnStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 dark:text-slate-600 opacity-60';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-purple-600 dark:border-purple-500 bg-purple-50/80 dark:bg-purple-950/60 text-purple-950 dark:text-purple-200 ring-2 ring-purple-200 dark:ring-purple-800 font-bold';
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
                  Próxima será gerada por IA automaticamente!
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
                  className="px-6 py-3 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 transition-colors cursor-pointer shadow-xs"
                >
                  Confirmar Resposta
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-next-practice"
                  disabled={isLoadingAi}
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl font-bold text-xs bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isLoadingAi ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                      <span>Gerando com IA...</span>
                    </>
                  ) : (
                    <>
                      <span>{isLastQuestion ? 'Avançar (Gerar por IA)' : 'Próxima Questão'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Feedback Explanation Card */}
          {isAnswered && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <div className={`p-4 sm:p-5 rounded-2xl flex items-start gap-3.5 ${
                selectedOption === currentSnippet.correctOptionIndex 
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' 
                  : 'bg-rose-50/90 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}>
                {selectedOption === currentSnippet.correctOptionIndex ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="font-bold text-sm">
                    {selectedOption === currentSnippet.correctOptionIndex ? 'Correto! Excelente leitura técnica.' : 'Incorreto. Veja a justificativa oficial:'}
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    {currentSnippet.explanation}
                  </p>
                </div>
              </div>

              {/* Pedagogical Rewrite */}
              {currentSnippet.improvedSnippet && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-extrabold text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Como reescrever este trecho com excelência Nota 1000:</span>
                  </span>
                  <p className="font-serif text-sm sm:text-base text-slate-900 dark:text-slate-100 italic leading-relaxed pl-3 border-l-2 border-indigo-400">
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
