import React from 'react';
import { 
  Sun,
  Moon,
  RotateCcw
} from 'lucide-react';
import { EnemasterLogoIcon } from './EnemasterLogo';
import { UserAuthWidget } from './UserAuthWidget';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavigateToLogin?: () => void;
  onOpenRestartModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  setActiveTab, 
  theme, 
  onToggleTheme,
  onNavigateToLogin,
  onOpenRestartModal
}) => {
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-2">
          {/* Official Brand Logo */}
          <div 
            id="brand-logo-btn"
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-1.5 sm:gap-3.5 cursor-pointer group select-none min-w-0 shrink"
          >
            {/* New Official Logo Emblem */}
            <div className="relative p-0.5 sm:p-1 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs group-hover:scale-105 group-hover:border-indigo-300 dark:group-hover:border-indigo-600 transition-all flex items-center justify-center shrink-0 w-8 h-8 sm:w-12 sm:h-12">
              <EnemasterLogoIcon className="w-6 h-6 sm:w-10 sm:h-10" />
            </div>

            {/* Typography & Slogan */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 sm:gap-2">
                <h1 className="text-base sm:text-2xl lg:text-3xl font-black tracking-tight flex items-center leading-none whitespace-nowrap">
                  <span className="font-black text-slate-950 dark:text-white drop-shadow-xs">ENEM</span>
                  <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 dark:from-cyan-400 dark:via-cyan-300 dark:to-indigo-300 ml-1">MASTER</span>
                </h1>
                <span className="hidden md:inline-flex items-center px-2.5 py-0.5 text-[11px] font-black bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 dark:from-indigo-500/20 dark:to-cyan-500/20 text-indigo-700 dark:text-cyan-300 border border-indigo-300/80 dark:border-cyan-400/40 rounded-full shadow-2xs whitespace-nowrap">
                  NOTA 1000
                </span>
              </div>
              <p className="hidden sm:block text-[9px] sm:text-xs text-slate-500 dark:text-slate-400 font-extrabold tracking-[0.18em] sm:tracking-[0.2em] uppercase mt-0.5 sm:mt-1 whitespace-nowrap">
                ESCREVA • CORRIJA • EVOLUA
              </p>
            </div>
          </div>

          {/* Right Controls: Theme Switcher & Firebase User Auth */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Reiniciar App & Limpar Cache Button */}
            {onOpenRestartModal && (
              <button
                id="header-restart-app-btn"
                type="button"
                onClick={onOpenRestartModal}
                title="Reiniciar aplicativo e limpar dados/cache temporário"
                aria-label="Reiniciar aplicativo e limpar dados de cache"
                className="flex items-center justify-center gap-1.5 sm:gap-2 w-8 h-8 sm:w-auto p-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] sm:text-xs font-bold transition-all cursor-pointer shadow-xs group shrink-0 whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-cyan-400 group-hover:-rotate-90 transition-transform duration-300 shrink-0" />
                <span className="hidden lg:inline">Reiniciar</span>
              </button>
            )}

            {/* Global Theme Toggle Button */}
            <button
              id="global-theme-toggle-btn"
              type="button"
              onClick={onToggleTheme}
              title={isDark ? 'Mudar para Tema Claro' : 'Ativar Modo Noturno (Estudos Noturnos)'}
              aria-label="Alternar tema claro e escuro"
              className="flex items-center gap-1.5 sm:gap-2 w-8 h-8 sm:w-auto p-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] sm:text-xs font-bold transition-all cursor-pointer shadow-xs group justify-center whitespace-nowrap"
            >
              <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
                {isDark ? (
                  <Moon className="w-4 h-4 text-amber-300 transition-transform duration-300 group-hover:-rotate-12" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 group-hover:rotate-45" />
                )}
              </div>
              <span className="hidden md:inline">
                {isDark ? 'Modo Noturno' : 'Modo Claro'}
              </span>
            </button>

            {/* Firebase Auth & Global Database Users Counter */}
            <UserAuthWidget 
              onNavigateToLogin={onNavigateToLogin} 
              onOpenRestartModal={onOpenRestartModal} 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

