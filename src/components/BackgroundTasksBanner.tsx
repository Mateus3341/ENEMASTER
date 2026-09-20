import React from 'react';
import { Sparkles, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useBackgroundTasks, BackgroundTask } from '../contexts/BackgroundTasksContext';

interface BackgroundTasksBannerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BackgroundTasksBanner: React.FC<BackgroundTasksBannerProps> = ({
  activeTab,
  setActiveTab
}) => {
  const { tasks, clearTask } = useBackgroundTasks();
  const allTasks = Object.values(tasks);

  // We only show banner for tasks that are currently running OR just completed and NOT in the current active tab
  const visibleTasks = allTasks.filter(task => {
    if (task.status === 'running' && task.tabId !== activeTab) return true;
    if (task.status === 'completed' && task.tabId !== activeTab) return true;
    if (task.status === 'error' && task.tabId !== activeTab) return true;
    return false;
  });

  if (visibleTasks.length === 0) return null;

  return (
    <aside aria-label="Tarefas em segundo plano" className="mb-4 space-y-2">
      {visibleTasks.map((task: BackgroundTask) => {
        const isRunning = task.status === 'running';
        const isCompleted = task.status === 'completed';
        const isError = task.status === 'error';

        return (
          <div
            key={task.id}
            onClick={() => {
              setActiveTab(task.tabId);
              if (isCompleted || isError) {
                clearTask(task.id);
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setActiveTab(task.tabId);
                if (isCompleted || isError) clearTask(task.id);
              }
            }}
            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border transition-all animate-in fade-in slide-in-from-top-2 shadow-xs cursor-pointer hover:scale-[1.005] active:scale-[0.995] ${
              isRunning
                ? 'bg-indigo-500/10 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/80 text-indigo-950 dark:text-indigo-200'
                : isCompleted
                ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/80 text-emerald-950 dark:text-emerald-200'
                : 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700/80 text-rose-950 dark:text-rose-200'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  isRunning
                    ? 'bg-indigo-600 text-white animate-pulse'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {isRunning ? (
                  <Sparkles className="w-4 h-4" />
                ) : isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs sm:text-sm truncate">
                    {task.title}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      isRunning
                        ? 'bg-indigo-100 dark:bg-indigo-900/80 text-indigo-800 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700'
                        : isCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                        : 'bg-rose-100 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700'
                    }`}
                  >
                    {isRunning ? `${Math.round(task.progress)}% • Em segundo plano` : isCompleted ? 'Concluído • Toque para ver' : 'Erro'}
                  </span>
                </div>

                <p className="text-[11px] opacity-80 truncate mt-0.5">
                  {task.currentStep || task.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {(isCompleted || isError) && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearTask(task.id);
                  }}
                  title="Fechar notificação"
                  className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 opacity-70 hover:opacity-100 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </aside>
  );
};
