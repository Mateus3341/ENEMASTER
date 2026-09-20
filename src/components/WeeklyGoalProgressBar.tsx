import React, { useState, useEffect, useMemo } from 'react';
import { 
  Target, 
  Flame, 
  CheckCircle2, 
  PenTool, 
  SlidersHorizontal, 
  Plus, 
  Minus, 
  Sparkles,
  Check,
  CalendarDays
} from 'lucide-react';
import { EssayCorrectionResult } from '../types';

interface WeeklyGoalProgressBarProps {
  savedEssays: EssayCorrectionResult[];
  setActiveTab: (tab: string) => void;
}

export const WeeklyGoalProgressBar: React.FC<WeeklyGoalProgressBarProps> = ({
  savedEssays,
  setActiveTab
}) => {
  // Weekly goal stored in localStorage (default: 3 essays/week)
  const [weeklyGoal, setWeeklyGoal] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('enemaster_weekly_goal');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 20) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return 3;
  });

  const [isEditingGoal, setIsEditingGoal] = useState<boolean>(false);

  // Update localStorage when weekly goal changes
  const updateGoal = (newGoal: number) => {
    const clamped = Math.max(1, Math.min(20, newGoal));
    setWeeklyGoal(clamped);
    try {
      localStorage.setItem('enemaster_weekly_goal', clamped.toString());
    } catch {
      // Storage error ignored
    }
  };

  // Calculate current week range (Monday to Sunday)
  const weekInfo = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday...
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
    
    const monday = new Date(now);
    monday.setDate(now.getDate() - distanceToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const formatDay = (d: Date) => {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      return `${dd}/${mm}`;
    };

    return {
      start: monday,
      end: sunday,
      label: `${formatDay(monday)} a ${formatDay(sunday)}`
    };
  }, []);

  // Filter essays submitted in the current calendar week
  const essaysThisWeek = useMemo(() => {
    return savedEssays.filter(essay => {
      try {
        let essayDate: Date | null = null;
        if (essay.createdAt) {
          essayDate = new Date(essay.createdAt);
        } else if (essay.date) {
          if (essay.date.includes('/')) {
            const parts = essay.date.split('/');
            if (parts.length === 3) {
              const day = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10) - 1;
              const year = parseInt(parts[2], 10);
              essayDate = new Date(year, month, day);
            }
          } else {
            const parsed = new Date(essay.date);
            if (!isNaN(parsed.getTime())) {
              essayDate = parsed;
            }
          }
        }

        if (!essayDate || isNaN(essayDate.getTime())) return false;
        return essayDate >= weekInfo.start && essayDate <= weekInfo.end;
      } catch {
        return false;
      }
    });
  }, [savedEssays, weekInfo]);

  const count = essaysThisWeek.length;
  const progressPercent = Math.min(100, Math.round((count / weeklyGoal) * 100));
  const isGoalReached = count >= weeklyGoal;
  const remaining = Math.max(0, weeklyGoal - count);

  return (
    <div 
      id="dashboard-weekly-goal-card"
      className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 sm:p-6 shadow-xs border border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
            isGoalReached 
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-300/60 dark:border-emerald-700/60'
              : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/80'
          }`}>
            {isGoalReached ? <Flame className="w-5 h-5 fill-emerald-500/30" /> : <Target className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Meta Semanal de Redações
              </h3>
              {isGoalReached && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700/80">
                  <CheckCircle2 className="w-3 h-3" />
                  Meta Batida!
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
              <span>Semana atual ({weekInfo.label})</span>
            </p>
          </div>
        </div>

        {/* Toggle Goal Configuration */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsEditingGoal(!isEditingGoal)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Ajustar quantidade de redações da meta semanal"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isEditingGoal ? 'Concluir' : 'Configurar Meta'}</span>
          </button>
        </div>
      </div>

      {/* Goal Configuration Controls (when active) */}
      {isEditingGoal && (
        <div className="mb-4 p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                Defina quantas redações você quer produzir por semana:
              </p>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-400 mt-0.5">
                Recomendamos de 2 a 4 redações semanais para manter consistência rumo aos 1000 pontos.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 5].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => updateGoal(preset)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                      weeklyGoal === preset 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-indigo-100/50'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Stepper Buttons */}
              <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={() => updateGoal(weeklyGoal - 1)}
                  disabled={weeklyGoal <= 1}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40"
                  aria-label="Diminuir meta"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center font-black text-xs text-slate-900 dark:text-slate-100">
                  {weeklyGoal}
                </span>
                <button
                  type="button"
                  onClick={() => updateGoal(weeklyGoal + 1)}
                  disabled={weeklyGoal >= 20}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40"
                  aria-label="Aumentar meta"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingGoal(false)}
                className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs"
                title="Salvar"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Metric and Bar */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between text-xs">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {count}
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-bold">
              / {weeklyGoal} {weeklyGoal === 1 ? 'redação' : 'redações'}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 font-bold">
            <span className={`text-sm ${
              isGoalReached 
                ? 'text-emerald-600 dark:text-emerald-400 font-black' 
                : 'text-indigo-600 dark:text-indigo-400 font-extrabold'
            }`}>
              {progressPercent}%
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">concluído</span>
          </div>
        </div>

        {/* Outer Bar */}
        <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60 relative">
          <div 
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isGoalReached
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-xs shadow-emerald-500/20'
                : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 shadow-xs shadow-indigo-600/20'
            }`}
            style={{ width: `${Math.max(count > 0 ? 5 : 0, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Dynamic Status / Call to Action */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {isGoalReached ? (
            <span className="text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              Excelente ritmo! Você atingiu a sua meta de escrita desta semana. Continue assim!
            </span>
          ) : count === 0 ? (
            <span>
              Você ainda não enviou redações esta semana. Inicie um texto para manter seu ritmo de treino!
            </span>
          ) : (
            <span>
              Falta apenas <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{remaining} {remaining === 1 ? 'redação' : 'redações'}</strong> para atingir sua meta semanal!
            </span>
          )}
        </p>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('correction')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-transform active:scale-[0.98] cursor-pointer"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Enviar Redação</span>
          </button>
        </div>
      </div>
    </div>
  );
};
