import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';

export interface BackgroundTask {
  id: string;
  tabId: string; // 'correction' | 'creation' | 'themes' | 'repertoire_hunter' | 'practice'
  title: string;
  description: string;
  startedAt: number;
  status: 'running' | 'completed' | 'error';
  progress: number;
  currentStep?: string;
  result?: any;
  error?: string;
}

interface BackgroundTasksContextType {
  tasks: Record<string, BackgroundTask>;
  activeCount: number;
  startTask: (id: string, tabId: string, title: string, description: string) => void;
  updateTaskProgress: (id: string, progress: number, currentStep?: string) => void;
  completeTask: (id: string, result?: any) => void;
  failTask: (id: string, error: string) => void;
  clearTask: (id: string) => void;
  clearAllTasks: () => void;
  getTaskByTab: (tabId: string) => BackgroundTask | undefined;
}

const BackgroundTasksContext = createContext<BackgroundTasksContextType | undefined>(undefined);

const STORAGE_KEY = 'enemaster_bg_tasks_v1';

export const BackgroundTasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Record<string, BackgroundTask>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Clean up tasks older than 24h
        const now = Date.now();
        const valid: Record<string, BackgroundTask> = {};
        for (const [key, t] of Object.entries(parsed as Record<string, BackgroundTask>)) {
          if (now - t.startedAt < 24 * 60 * 60 * 1000) {
            // Se o app foi recarregado enquanto estava rodando, mantemos status para não travar
            valid[key] = t.status === 'running' ? { ...t, status: 'completed' } : t;
          }
        }
        return valid;
      }
    } catch {}
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Erro ao salvar tarefas de fundo:', e);
    }
  }, [tasks]);

  // Listen for global cache purge / restart events
  useEffect(() => {
    const handleCacheCleared = () => {
      setTasks({});
    };
    window.addEventListener('enemaster:cache-cleared', handleCacheCleared);
    return () => window.removeEventListener('enemaster:cache-cleared', handleCacheCleared);
  }, []);

  const startTask = useCallback((id: string, tabId: string, title: string, description: string) => {
    setTasks(prev => ({
      ...prev,
      [id]: {
        id,
        tabId,
        title,
        description,
        startedAt: Date.now(),
        status: 'running',
        progress: 8,
        currentStep: 'Iniciando processamento com IA...',
      }
    }));
  }, []);

  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  const hasRunningTasks = Object.values(tasks).some(t => t.status === 'running');

  // Continuous monotonic ticker for running tasks to reflect real ongoing time and never freeze
  useEffect(() => {
    if (!hasRunningTasks) return;

    const interval = setInterval(() => {
      setTasks(prev => {
        const runningTaskIds = Object.keys(prev).filter(k => prev[k].status === 'running');
        if (runningTaskIds.length === 0) return prev;

        let changed = false;
        const next = { ...prev };

        for (const id of runningTaskIds) {
          const t = next[id];
          if (!t || t.status !== 'running') continue;

          const elapsed = Date.now() - t.startedAt;
          // Most AI tasks take between 12s and 20s
          const estimatedMs = 14000;
          let calculatedProgress: number;

          if (elapsed <= estimatedMs * 0.7) {
            const ratio = elapsed / (estimatedMs * 0.7);
            calculatedProgress = Math.round(8 + ratio * 67); // 8% -> 75%
          } else if (elapsed <= estimatedMs) {
            const extraTime = elapsed - estimatedMs * 0.7;
            const extraRatio = extraTime / (estimatedMs * 0.3);
            calculatedProgress = Math.round(75 + extraRatio * 15); // 75% -> 90%
          } else {
            // Overtime: gradually crawl up to 98% smoothly without ever freezing
            const overtimeSec = (elapsed - estimatedMs) / 1000;
            const overtimeBonus = Math.min(Math.floor(overtimeSec / 2.5), 8);
            calculatedProgress = Math.min(90 + overtimeBonus, 98);
          }

          // Monotonically increase: always preserve or advance progress
          const newProgress = Math.max(t.progress, calculatedProgress);
          if (newProgress !== t.progress) {
            next[id] = { ...t, progress: newProgress };
            changed = true;
          }
        }

        return changed ? next : prev;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [hasRunningTasks]);

  const updateTaskProgress = useCallback((id: string, progress: number, currentStep?: string) => {
    setTasks(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: {
          ...prev[id],
          progress: Math.max(prev[id].progress, progress),
          currentStep: currentStep || prev[id].currentStep,
        }
      };
    });
  }, []);

  const completeTask = useCallback((id: string, result?: any) => {
    setTasks(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: {
          ...prev[id],
          status: 'completed',
          progress: 100,
          currentStep: 'Concluído com sucesso!',
          result,
        }
      };
    });
  }, []);

  const failTask = useCallback((id: string, error: string) => {
    setTasks(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: {
          ...prev[id],
          status: 'error',
          error,
          currentStep: 'Ocorreu um erro no processamento.',
        }
      };
    });
  }, []);

  const clearTask = useCallback((id: string) => {
    setTasks(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }, []);

  const clearAllTasks = useCallback(() => {
    setTasks({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const getTaskByTab = useCallback((tabId: string) => {
    const current = tasksRef.current;
    return Object.values(current).find(t => t.tabId === tabId && t.status === 'running') ||
      Object.values(current).find(t => t.tabId === tabId);
  }, []);

  const activeCount = Object.values(tasks).filter(t => t.status === 'running').length;

  const contextValue = useMemo(() => ({
    tasks,
    activeCount,
    startTask,
    updateTaskProgress,
    completeTask,
    failTask,
    clearTask,
    clearAllTasks,
    getTaskByTab,
  }), [
    tasks,
    activeCount,
    startTask,
    updateTaskProgress,
    completeTask,
    failTask,
    clearTask,
    clearAllTasks,
    getTaskByTab,
  ]);

  return (
    <BackgroundTasksContext.Provider value={contextValue}>
      {children}
    </BackgroundTasksContext.Provider>
  );
};

export const useBackgroundTasks = () => {
  const context = useContext(BackgroundTasksContext);
  if (!context) {
    throw new Error('useBackgroundTasks must be used within a BackgroundTasksProvider');
  }
  return context;
};
