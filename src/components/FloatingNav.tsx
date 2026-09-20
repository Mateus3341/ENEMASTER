import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PenTool, 
  Sparkles, 
  GraduationCap, 
  Compass, 
  Search, 
  BookOpen, 
  Target, 
  Award, 
  BookCheck, 
  BookMarked,
  ChevronDown,
  Layers,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useBackgroundTasks } from '../contexts/BackgroundTasksContext';

interface FloatingNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedCount: number;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({
  activeTab,
  setActiveTab,
  savedCount
}) => {
  const { tasks } = useBackgroundTasks();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const coreTools = [
    { 
      id: 'dashboard', 
      label: 'Início', 
      shortLabel: 'Início', 
      icon: BarChart3,
      hint: 'Visão geral e metas'
    },
    { 
      id: 'correction', 
      label: 'Corretor', 
      shortLabel: 'Corretor', 
      icon: PenTool, 
      badge: 'Oficial',
      hint: 'Correção criteriosa por IA nas 5 competências'
    },
    { 
      id: 'creation', 
      label: 'Criador 1000', 
      shortLabel: 'Criador', 
      icon: Sparkles, 
      badge: 'IA',
      hint: 'Assistente estrutural de introdução, D1, D2 e C5'
    },
    { 
      id: 'professor', 
      label: 'Professor IA', 
      shortLabel: 'Professor', 
      icon: GraduationCap,
      hint: 'Mestre Corujito tira dúvidas 24/7'
    },
  ];

  const repertoireTools = [
    { 
      id: 'themes', 
      label: 'Gerador de Temas', 
      shortLabel: 'Temas', 
      icon: Compass, 
      badge: 'INEP',
      hint: 'Propostas com textos motivadores'
    },
    { 
      id: 'repertoire_hunter', 
      label: 'Caçador de Repertórios', 
      shortLabel: 'Repertórios', 
      icon: Search, 
      badge: 'C2/C3',
      hint: 'Filósofos, alusões, dados e leis'
    },
  ];

  const studyTools = [
    { 
      id: 'study', 
      label: '5 Competências', 
      shortLabel: 'Critérios', 
      icon: BookOpen,
      hint: 'Grade oficial comentada do ENEM'
    },
    { 
      id: 'practice', 
      label: 'Treino de Trechos', 
      shortLabel: 'Treino', 
      icon: Target,
      hint: 'Prática parágrafo por parágrafo'
    },
    { 
      id: 'examples', 
      label: 'Exemplos 1000', 
      shortLabel: 'Exemplos', 
      icon: Award,
      hint: 'Redações reais nota 1000 comentadas'
    },
    { 
      id: 'evolution', 
      label: 'Evolução', 
      shortLabel: 'Evolução', 
      icon: BookCheck, 
      count: savedCount,
      hint: 'Histórico, notas e gráficos'
    },
    { 
      id: 'glossary', 
      label: 'Glossário', 
      shortLabel: 'Glossário', 
      icon: BookMarked,
      hint: 'Termos técnicos da banca avaliadora'
    },
  ];

  const allSections = [
    { group: 'Principal', items: coreTools },
    { group: 'Inspiração', items: repertoireTools },
    { group: 'Aprofundamento', items: studyTools }
  ];

  const activeItem = [...coreTools, ...repertoireTools, ...studyTools].find(t => t.id === activeTab);

  return (
    <aside 
      aria-label="Barra de navegação flutuante para computador e tablet"
      className="hidden sm:block sticky top-3 z-30 mb-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300"
    >
      <div 
        className={`relative mx-auto transition-all duration-300 ease-out ${
          isScrolled 
            ? 'shadow-xl shadow-indigo-950/10 dark:shadow-black/40 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/90 rounded-2xl p-1.5' 
            : 'shadow-md shadow-slate-900/5 dark:shadow-black/20 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-1.5'
        }`}
      >
        {isCollapsed ? (
          /* Minimized pill floating bar */
          <div className="flex items-center justify-between px-3 py-1.5 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Navegação:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                  {activeItem?.label || 'Enemaster'}
                </span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span>Expandir Menu</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Full floating bar with categorized groups */
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            <div className="flex items-center gap-1 sm:gap-1.5 flex-1 overflow-x-auto no-scrollbar py-0.5">
              {allSections.map((section, sectionIdx) => (
                <React.Fragment key={section.group}>
                  {sectionIdx > 0 && (
                    <div className="h-6 w-[1px] bg-slate-200/80 dark:bg-slate-800 mx-1 shrink-0" />
                  )}

                  <div className="flex items-center gap-1 shrink-0">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      const bgTask = Object.values(tasks).find(t => t.tabId === item.id);
                      const isTaskRunning = bgTask?.status === 'running';
                      const isTaskCompleted = bgTask?.status === 'completed' && !isActive;

                      return (
                        <div key={item.id} className="relative group">
                          <button
                            id={`floating-nav-${item.id}`}
                            type="button"
                            onClick={() => setActiveTab(item.id)}
                            onMouseEnter={() => setHoveredTab(item.id)}
                            onMouseLeave={() => setHoveredTab(null)}
                            className={`relative flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer select-none whitespace-nowrap ${
                              isActive
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 dark:shadow-indigo-500/20'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 hover:bg-slate-100/90 dark:hover:bg-slate-800/80'
                            }`}
                          >
                            {isTaskRunning ? (
                              <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin text-amber-500 dark:text-amber-400" />
                            ) : isTaskCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500 animate-bounce" />
                            ) : (
                              <Icon 
                                className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110 ${
                                  isActive 
                                    ? 'text-white' 
                                    : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                                }`} 
                              />
                            )}
                            
                            <span className="hidden xl:inline">{item.label}</span>
                            <span className="xl:hidden">{item.shortLabel}</span>

                            {isTaskRunning && (
                              <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                              </span>
                            )}

                            {isTaskCompleted && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full font-black bg-emerald-500 text-white animate-pulse">
                                Pronto!
                              </span>
                            )}

                            {!isTaskRunning && !isTaskCompleted && item.badge && (
                              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black tracking-tight ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60'
                              }`}>
                                {item.badge}
                              </span>
                            )}

                            {typeof item.count === 'number' && item.count > 0 && (
                              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                                isActive
                                  ? 'bg-amber-400 text-slate-950'
                                  : 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300'
                              }`}>
                                {item.count}
                              </span>
                            )}
                          </button>

                          {/* Quick tooltip on hover */}
                          {hoveredTab === item.id && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 rounded-lg bg-slate-950 dark:bg-slate-800 text-white text-[11px] font-medium shadow-lg z-50 pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950 dark:bg-slate-800 rotate-45" />
                              <div className="relative font-bold text-slate-100 flex items-center gap-1.5">
                                <span>{item.label}</span>
                                {item.hint && (
                                  <span className="text-slate-400 font-normal">
                                    • {item.hint}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Quick collapse button for distraction-free reading/writing */}
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              title="Minimizar barra para modo foco"
              className="hidden lg:flex items-center justify-center p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              <ChevronDown className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
