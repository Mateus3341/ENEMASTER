import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, Zap } from 'lucide-react';

export interface ProgressStep {
  id: string;
  label: string;
  detail?: string;
}

interface AiProgressBarProps {
  isLoading: boolean;
  progress: number; // 0 to 100
  currentStepIndex?: number;
  steps?: ProgressStep[] | string[];
  title?: string;
  subtitle?: string;
  accentColor?: 'indigo' | 'emerald' | 'amber' | 'blue' | 'purple';
  variant?: 'card' | 'inline' | 'compact' | 'modal';
  onComplete?: () => void;
  className?: string;
  showBackgroundNotice?: boolean;
}

export const AiProgressBar: React.FC<AiProgressBarProps> = ({
  isLoading,
  progress,
  currentStepIndex = 0,
  steps = [],
  title = 'Processando com Inteligência Artificial...',
  subtitle,
  accentColor = 'indigo',
  variant = 'card',
  className = '',
  showBackgroundNotice = true,
}) => {
  const [displayProgress, setDisplayProgress] = useState(progress);

  // Smooth lerp / transition for progress display
  useEffect(() => {
    const target = Math.min(Math.max(Math.round(progress), 0), 100);
    setDisplayProgress(target);
  }, [progress]);

  if (!isLoading && progress < 100) {
    return null;
  }

  // Normalize steps
  const normalizedSteps: ProgressStep[] = steps.map((s, idx) => {
    if (typeof s === 'string') {
      return { id: `step-${idx}`, label: s };
    }
    return s;
  });

  const activeIdx = Math.min(Math.max(currentStepIndex, 0), Math.max(normalizedSteps.length - 1, 0));
  const activeStep = normalizedSteps[activeIdx];

  // Color schemas
  const colorMap = {
    indigo: {
      bar: 'from-indigo-600 via-blue-500 to-indigo-500',
      border: 'border-indigo-200 dark:border-indigo-800/80',
      bg: 'bg-indigo-50/70 dark:bg-indigo-950/40',
      badge: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200',
      text: 'text-indigo-700 dark:text-indigo-300',
      activeDot: 'bg-indigo-600 ring-indigo-300 dark:ring-indigo-800',
    },
    emerald: {
      bar: 'from-emerald-600 via-teal-500 to-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800/80',
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/40',
      badge: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200',
      text: 'text-emerald-700 dark:text-emerald-300',
      activeDot: 'bg-emerald-600 ring-emerald-300 dark:ring-emerald-800',
    },
    amber: {
      bar: 'from-amber-500 via-orange-500 to-yellow-400',
      border: 'border-amber-200 dark:border-amber-800/80',
      bg: 'bg-amber-50/70 dark:bg-amber-950/40',
      badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200',
      text: 'text-amber-700 dark:text-amber-300',
      activeDot: 'bg-amber-500 ring-amber-300 dark:ring-amber-800',
    },
    blue: {
      bar: 'from-blue-600 via-sky-500 to-cyan-400',
      border: 'border-blue-200 dark:border-blue-800/80',
      bg: 'bg-blue-50/70 dark:bg-blue-950/40',
      badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200',
      text: 'text-blue-700 dark:text-blue-300',
      activeDot: 'bg-blue-600 ring-blue-300 dark:ring-blue-800',
    },
    purple: {
      bar: 'from-purple-600 via-fuchsia-500 to-pink-500',
      border: 'border-purple-200 dark:border-purple-800/80',
      bg: 'bg-purple-50/70 dark:bg-purple-950/40',
      badge: 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200',
      text: 'text-purple-700 dark:text-purple-300',
      activeDot: 'bg-purple-600 ring-purple-300 dark:ring-purple-800',
    },
  };

  const scheme = colorMap[accentColor] || colorMap.indigo;

  // COMPACT VARIANT (for small dialogs or quick inline cards)
  if (variant === 'compact') {
    return (
      <div className={`w-full p-3 rounded-xl border ${scheme.border} ${scheme.bg} space-y-2 transition-all ${className}`}>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
            <span className="truncate max-w-[200px] sm:max-w-xs">{activeStep?.label || title}</span>
          </div>
          <span className="font-mono text-xs font-black text-slate-900 dark:text-slate-100">
            {displayProgress}%
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-2 rounded-full bg-slate-200/80 dark:bg-slate-700/80 overflow-hidden relative">
          <div
            className={`h-full bg-gradient-to-r ${scheme.bar} transition-all duration-300 ease-out rounded-full`}
            style={{ width: `${displayProgress}%` }}
          />
        </div>
      </div>
    );
  }

  // INLINE VARIANT
  if (variant === 'inline') {
    return (
      <div className={`w-full space-y-2 ${className}`}>
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            {activeStep?.label || title}
          </span>
          <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
            {displayProgress}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
          <div
            className={`h-full bg-gradient-to-r ${scheme.bar} transition-all duration-300 ease-out`}
            style={{ width: `${displayProgress}%` }}
          />
        </div>
      </div>
    );
  }

  // FULL CARD VARIANT (Default)
  return (
    <div
      className={`w-full p-5 sm:p-6 rounded-2xl border ${scheme.border} ${scheme.bg} backdrop-blur-xs shadow-md space-y-4 transition-all animate-fadeIn ${className}`}
    >
      {/* Header with Title and Percentage */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-xs border border-slate-200/80 dark:border-slate-700">
              <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h4>
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 pl-8">
              {subtitle}
            </p>
          )}
        </div>

        {/* Big percentage counter */}
        <div className="flex flex-col items-end">
          <div className="flex items-baseline gap-0.5">
            <span className="font-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              {displayProgress}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">%</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {displayProgress === 100 ? 'Concluído' : 'Processando'}
          </span>
        </div>
      </div>

      {/* Main Gradient Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3 rounded-full bg-slate-200/90 dark:bg-slate-800 overflow-hidden relative p-0.5 border border-slate-300/40 dark:border-slate-700/50">
          <div
            className={`h-full bg-gradient-to-r ${scheme.bar} transition-all duration-300 ease-out rounded-full shadow-sm relative overflow-hidden`}
            style={{ width: `${displayProgress}%` }}
          >
            {/* Shimmer sweep animation */}
            <div className="absolute inset-0 bg-white/25 w-full h-full animate-[shimmer_2s_infinite] -skew-x-12" />
          </div>
        </div>

        {/* Active step readout */}
        {activeStep && (
          <div className="flex items-center justify-between text-xs pt-0.5">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
              <Loader2 className="w-3 h-3 animate-spin text-indigo-600 dark:text-indigo-400" />
              <span>{activeStep.label}</span>
            </div>
            {normalizedSteps.length > 0 && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Etapa {activeIdx + 1} de {normalizedSteps.length}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Step pipeline list (if steps provided) */}
      {normalizedSteps.length > 1 && (
        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {normalizedSteps.map((step, idx) => {
              const isCompleted = idx < activeIdx || displayProgress === 100;
              const isCurrent = idx === activeIdx && displayProgress < 100;

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-white dark:bg-slate-800/90 shadow-xs border border-indigo-200 dark:border-indigo-800 font-bold text-slate-900 dark:text-slate-100'
                      : isCompleted
                      ? 'text-slate-600 dark:text-slate-400 font-medium'
                      : 'text-slate-400 dark:text-slate-600 opacity-60'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : isCurrent ? (
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600" />
                    </span>
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                  )}
                  <span className="truncate">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Background processing reassurance badge */}
      {showBackgroundNotice && isLoading && displayProgress < 100 && (
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 px-4 py-2.5 sm:px-6 rounded-b-2xl border-t border-slate-200/60 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Execução em Segundo Plano Habilitada:
            </span>
            <span>Você pode navegar livremente por outras abas enquanto a IA processa.</span>
          </div>
          <span className="hidden sm:inline-block font-mono text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200/60 dark:border-indigo-800/60">
            Auto-salvamento ativo
          </span>
        </div>
      )}
    </div>
  );
};
