import React, { useState, useRef, useEffect } from 'react';
import { 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  ChevronDown,
  User as UserIcon,
  Sparkles,
  Cloud,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';

interface UserAuthWidgetProps {
  onNavigateToLogin?: () => void;
  onOpenRestartModal?: () => void;
}

export const UserAuthWidget: React.FC<UserAuthWidgetProps> = ({ 
  onNavigateToLogin,
  onOpenRestartModal 
}) => {
  const { user, profile, isLoading, signOut, loginError } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Estudante');
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2 relative" ref={dropdownRef}>
      {/* Login Error Notification if present */}
      {loginError && (
        <div className="absolute right-0 top-12 z-50 p-3 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 rounded-2xl shadow-xl text-xs text-rose-800 dark:text-rose-200 max-w-xs animate-in fade-in zoom-in-95">
          <p className="font-semibold">{loginError}</p>
        </div>
      )}

      {/* Authenticated User Profile Button */}
      {user ? (
        <div className="relative">
          <button
            id="user-profile-menu-btn"
            type="button"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-1.5 sm:gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/90 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-slate-800 dark:text-slate-100 text-[11px] sm:text-xs font-bold transition-all cursor-pointer shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 whitespace-nowrap"
          >
            <div className="relative">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={displayName} 
                  className="w-7 h-7 rounded-full border border-indigo-300 dark:border-indigo-600 object-cover shadow-2xs" 
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center text-xs font-extrabold shadow-2xs">
                  {userInitial}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" title="Conectado à nuvem"></span>
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="max-w-[120px] truncate text-slate-900 dark:text-white font-bold leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Cloud className="w-2.5 h-2.5" /> Sincronizado
              </span>
            </div>

            <ChevronDown className={`w-3.5 h-3.5 text-indigo-500 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* User Profile Dropdown */}
          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={displayName} 
                    className="w-11 h-11 rounded-full border-2 border-indigo-400 object-cover" 
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center text-base font-extrabold shadow-sm">
                    {userInitial}
                  </div>
                )}
                <div className="overflow-hidden flex-1">
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {user.email || 'Conta vinculada'}
                  </p>
                </div>
              </div>

              <div className="py-3 space-y-2 text-xs">
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Armazenamento:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Nuvem Firestore
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40">
                  <span className="text-[11px] text-indigo-700 dark:text-indigo-300 font-medium">Sessões de Estudo:</span>
                  <span className="font-extrabold text-indigo-900 dark:text-indigo-200">
                    {profile?.totalLogins || 1} {profile?.totalLogins === 1 ? 'acesso' : 'acessos'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 mt-2">
                {onOpenRestartModal && (
                  <button
                    id="header-dropdown-restart-btn"
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenRestartModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Reiniciar & Limpar Cache</span>
                  </button>
                )}

                <button
                  id="header-logout-btn"
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    signOut();
                  }}
                  title="Encerra a sessão. Suas redações avaliadas e corrigidas permanecem 100% salvas na sua conta."
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-bold text-xs transition-colors cursor-pointer border border-rose-200/80 dark:border-rose-900/60"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Desconectar Conta</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Guest / Not logged in State: Highly Visible Auth Trigger */
        <div className="flex items-center gap-2">
          <button
            id="auth-modal-open-btn"
            type="button"
            disabled={isLoading}
            onClick={() => {
              if (onNavigateToLogin) {
                onNavigateToLogin();
              } else {
                setShowAuthModal(true);
              }
            }}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-[11px] sm:text-xs shadow-md hover:shadow-indigo-500/25 transition-all cursor-pointer group active:scale-98 whitespace-nowrap"
            title="Ir para a página de login para entrar com E-mail ou Google"
          >
            <LogIn className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
            <span className="hidden sm:inline">Entrar / Cadastrar</span>
            <span className="sm:hidden">Entrar</span>
          </button>
        </div>
      )}

      {/* Interactive Auth Modal (Email/Password + Google + Forgot Password) */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};
