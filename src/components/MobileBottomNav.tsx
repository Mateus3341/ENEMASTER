import React, { useState } from 'react';
import { 
  BarChart3, 
  PenTool, 
  Sparkles, 
  GraduationCap, 
  Grid, 
  Compass, 
  Search, 
  BookOpen, 
  Target, 
  Award, 
  BookCheck, 
  BookMarked,
  X,
  Moon,
  Sun,
  ChevronRight,
  Loader2,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { useBackgroundTasks } from '../contexts/BackgroundTasksContext';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenRestartModal?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  theme,
  onToggleTheme,
  onOpenRestartModal,
}) => {
  const { tasks } = useBackgroundTasks();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  // Primary 4 actions in the bottom thumb bar
  const primaryTabs = [
    { id: 'dashboard', label: 'Início', icon: BarChart3 },
    { id: 'correction', label: 'Corretor', icon: PenTool, badge: 'Oficial' },
    { id: 'creation', label: 'Criador', icon: Sparkles },
    { id: 'professor', label: 'Professor', icon: GraduationCap },
  ];

  // Secondary tools presented in the "Mais" Bottom Sheet
  const moreTools = [
    { 
      id: 'themes', 
      label: 'Gerador de Temas', 
      desc: 'Propostas inéditas no padrão INEP com textos motivadores',
      icon: Compass, 
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60'
    },
    { 
      id: 'repertoire_hunter', 
      label: 'Caçador de Repertórios', 
      desc: 'Filósofos, alusões históricas e dados validados para C2/C3',
      icon: Search, 
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/60'
    },
    { 
      id: 'study', 
      label: '5 Competências INEP', 
      desc: 'Grade oficial comentada com critérios de cada nota',
      icon: BookOpen, 
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60'
    },
    { 
      id: 'practice', 
      label: 'Treino de Trechos', 
      desc: 'Exercícios práticos de introdução, D1, D2 e proposta C5',
      icon: Target, 
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
    },
    { 
      id: 'examples', 
      label: 'Exemplos Nota 1000', 
      desc: 'Redações reais analisadas com destaques por parágrafo',
      icon: Award, 
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60'
    },
    { 
      id: 'evolution', 
      label: 'Evolução do Aluno', 
      desc: 'Gráficos de evolução, médias e conquistas desbloqueadas',
      icon: BookCheck, 
      count: savedCount,
      color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/60'
    },
    { 
      id: 'glossary', 
      label: 'Glossário Pedagógico', 
      desc: 'Conceitos técnicos e termos da banca do ENEM',
      icon: BookMarked, 
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60'
    },
  ];

  const isMoreActive = moreTools.some(t => t.id === activeTab);

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setIsMoreMenuOpen(false);
    // Smooth scroll to top when changing tab on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* "Mais Ferramentas" Bottom Sheet Modal for Mobile */}
      {isMoreMenuOpen && (
        <div 
          className="fixed inset-0 z-50 sm:hidden flex flex-col justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsMoreMenuOpen(false)}
        >
          <div 
            className="w-full max-h-[85vh] bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle & Header */}
            <div className="p-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
                  <Grid className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Todas as Ferramentas
                  </h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Navegue pelas seções de estudo do Enemaster
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Theme Toggle in sheet */}
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                  title="Alternar tema"
                >
                  {isDark ? <Moon className="w-4 h-4 text-amber-300" /> : <Sun className="w-4 h-4 text-amber-500" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsMoreMenuOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable list of modules */}
            <div className="p-3 space-y-2 overflow-y-auto max-h-[calc(85vh-120px)] overscroll-contain">
              {moreTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTab === tool.id;

                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => handleSelectTab(tool.id)}
                    className={`w-full min-h-[52px] p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all active:scale-[0.98] ${
                      isActive 
                        ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-800 shadow-2xs' 
                        : 'bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/70 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${tool.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isActive ? 'text-indigo-950 dark:text-indigo-200' : 'text-slate-900 dark:text-slate-100'}`}>
                            {tool.label}
                          </span>
                          {typeof tool.count === 'number' && tool.count > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
                              {tool.count} salvas
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {tool.desc}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  </button>
                );
              })}

              {/* Action to Restart App & Clear Cache on Mobile */}
              {onOpenRestartModal && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onOpenRestartModal();
                    }}
                    className="w-full min-h-[48px] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-between transition-colors active:scale-[0.98] cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <RotateCcw className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-900 dark:text-slate-100">Reiniciar App & Limpar Cache</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Libera memória sem apagar suas redações salvas</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Mobile Bottom Dock */}
      <nav 
        id="mobile-bottom-navigation-dock"
        aria-label="Navegação móvel principal"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const bgTask = Object.values(tasks).find(t => t.tabId === tab.id);
            const isTaskRunning = bgTask?.status === 'running';
            const isTaskCompleted = bgTask?.status === 'completed' && !isActive;

            return (
              <button
                key={tab.id}
                id={`mobile-tab-${tab.id}`}
                type="button"
                onClick={() => handleSelectTab(tab.id)}
                className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl min-h-[48px] transition-all duration-200 cursor-pointer select-none active:scale-95 ${
                  isActive 
                    ? 'text-indigo-600 dark:text-indigo-400 font-black' 
                    : 'text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0.5 w-6 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-xs" />
                )}
                <div className={`relative p-1 rounded-xl transition-all ${
                  isActive ? 'bg-indigo-50 dark:bg-indigo-950/70 scale-110' : ''
                }`}>
                  {isTaskRunning ? (
                    <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                  ) : isTaskCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-bounce" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                  {isTaskRunning && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                  )}
                </div>
                <span className="text-[10px] leading-tight mt-0.5 tracking-tight">
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* "Mais" Menu Button */}
          <button
            id="mobile-tab-more"
            type="button"
            onClick={() => setIsMoreMenuOpen(true)}
            className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl min-h-[48px] transition-all duration-200 cursor-pointer select-none active:scale-95 ${
              isMoreActive || isMoreMenuOpen
                ? 'text-indigo-600 dark:text-indigo-400 font-black' 
                : 'text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {(isMoreActive || isMoreMenuOpen) && (
              <span className="absolute top-0.5 w-6 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-xs" />
            )}
            <div className={`relative p-1 rounded-xl transition-all ${
              isMoreActive || isMoreMenuOpen ? 'bg-indigo-50 dark:bg-indigo-950/70 scale-110' : ''
            }`}>
              <Grid className="w-5 h-5" />
            </div>
            <span className="text-[10px] leading-tight mt-0.5 tracking-tight">
              Mais
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
