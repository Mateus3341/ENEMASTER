import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  PenTool, 
  Search, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  UserCheck,
  Compass,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { EnemasterLogoIcon } from './EnemasterLogo';
import { EnemasterMascot } from './EnemasterMascot';
import { useAuth } from '../contexts/AuthContext';
import { AppGlobalStats } from '../lib/firebase';
import { Users } from 'lucide-react';

interface LoginScreenProps {
  onContinueAsGuest: () => void;
  stats?: AppGlobalStats;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onContinueAsGuest, stats }) => {
  const { 
    signInGoogle, 
    signInEmail, 
    signUpEmail, 
    resetPassword, 
    isLoading, 
    loginError, 
    authSuccessMessage,
    clearAuthError 
  } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formValidation, setFormValidation] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    clearAuthError();
    setFormValidation(null);
    try {
      await signInGoogle();
    } catch (e) {
      console.warn('Google login attempt:', e);
    }
  };

  const handleTabSwitch = (mode: 'login' | 'register') => {
    clearAuthError();
    setFormValidation(null);
    setAuthMode(mode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormValidation(null);
    clearAuthError();

    if (!email || !email.includes('@')) {
      setFormValidation('Por favor, digite um e-mail válido.');
      return;
    }

    if (authMode === 'forgot') {
      try {
        await resetPassword(email);
      } catch {
        // Handled in AuthContext
      }
      return;
    }

    if (!password || password.length < 6) {
      setFormValidation('A senha precisa conter ao menos 6 caracteres.');
      return;
    }

    if (authMode === 'register') {
      if (password !== confirmPassword) {
        setFormValidation('As senhas digitadas não coincidem.');
        return;
      }
      try {
        await signUpEmail(email, password, name.trim() || undefined);
      } catch {
        // Handled in AuthContext
      }
    } else {
      try {
        await signInEmail(email, password);
      } catch {
        // Handled in AuthContext
      }
    }
  };

  const highlights = [
    {
      icon: <PenTool className="w-4 h-4 text-indigo-400" />,
      text: "Correção rigorosa nas 5 competências oficiais do INEP"
    },
    {
      icon: <Search className="w-4 h-4 text-emerald-400" />,
      text: "Caçador de repertórios filosóficos e sociológicos legitimados"
    },
    {
      icon: <Compass className="w-4 h-4 text-amber-400" />,
      text: "Validador dos 5 elementos da Proposta de Intervenção (C5)"
    },
    {
      icon: <Award className="w-4 h-4 text-cyan-400" />,
      text: "Histórico permanente de notas sincronizado na nuvem"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-y-auto font-sans p-4 sm:p-6 lg:p-8">
      {/* Decorative ambient background glow */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[400px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[400px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      {/* Top Header Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-2xl bg-white/10 border border-white/20 shadow-xs">
            <EnemasterLogoIcon size={36} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 leading-none">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">ENEM</span>
              <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-cyan-200 tracking-tight">MASTER</span>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 rounded-full ml-1">
                NOTA 1000
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-extrabold tracking-[0.2em] uppercase mt-1">
              ESCREVA • CORRIJA • EVOLUA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Matriz Oficial INEP 2025</span>
          </span>
        </div>
      </header>

      {/* Center Main Stage (Split Hero & Auth Form) */}
      <main className="max-w-6xl w-full mx-auto py-8 sm:py-12 my-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Value Proposition, Mascot & Badges */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl relative group">
                <EnemasterMascot size="md" variant="hero" mood="scholar" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>Mestre Corujito • IA Especialista</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
              Sua redação corrigida com a precisão dos <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300">avaliadores do ENEM</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Escreva na folha oficial, receba diagnósticos detalhados por competência, desvios gramaticais comentados e sugestões práticas de repertórios legitimados.
            </p>

            {/* Feature bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-2">
              {highlights.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left"
                >
                  <div className="p-1 rounded-lg bg-white/10 shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <span className="text-xs text-slate-200 font-medium leading-snug">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Prominent, Centered Dedicated Auth Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl relative">
              
              {/* Header inside Card */}
              <div className="mb-5">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {authMode === 'login' && 'Acessar sua Conta'}
                  {authMode === 'register' && 'Criar Conta Gratuita'}
                  {authMode === 'forgot' && 'Recuperar Senha'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {authMode === 'login' && 'Entre com seu e-mail ou conta Google para sincronizar suas redações.'}
                  {authMode === 'register' && 'Cadastre-se em segundos para salvar suas correções e notas.'}
                  {authMode === 'forgot' && 'Informe seu e-mail cadastrado para redefinir sua senha.'}
                </p>
              </div>

              {/* Tab Selector: Login vs Register */}
              {authMode !== 'forgot' && (
                <div className="flex p-1 bg-white/10 rounded-2xl mb-5">
                  <button
                    id="hero-tab-login-btn"
                    type="button"
                    onClick={() => handleTabSwitch('login')}
                    className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                      authMode === 'login'
                        ? 'bg-white text-slate-950 shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Entrar
                  </button>
                  <button
                    id="hero-tab-register-btn"
                    type="button"
                    onClick={() => handleTabSwitch('register')}
                    className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                      authMode === 'register'
                        ? 'bg-white text-slate-950 shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Criar Conta
                  </button>
                </div>
              )}

              {/* Fast Google Login Button */}
              {authMode !== 'forgot' && (
                <div className="space-y-4 mb-4">
                  <button
                    id="google-main-login-action-btn"
                    type="button"
                    disabled={isLoading}
                    onClick={handleGoogleLogin}
                    className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-white/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.35 7.34 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.65 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>{isLoading ? 'Conectando...' : 'Continuar com Google'}</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="h-px bg-white/20 flex-1"></div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ou com e-mail e senha</span>
                    <div className="h-px bg-white/20 flex-1"></div>
                  </div>
                </div>
              )}

              {/* Error and validation alerts */}
              {(formValidation || loginError) && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formValidation || loginError}</span>
                </div>
              )}

              {authSuccessMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{authSuccessMessage}</span>
                </div>
              )}

              {/* Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Nome do Estudante (opcional)
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="form-name-input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Ana Clara"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Endereço de E-mail
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="form-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                {authMode !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-300">
                        Senha
                      </label>
                      {authMode === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            clearAuthError();
                            setFormValidation(null);
                            setAuthMode('forgot');
                          }}
                          className="text-[11px] font-bold text-cyan-300 hover:underline cursor-pointer"
                        >
                          Esqueceu a senha?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="form-password-input"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="form-confirm-password-input"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repita a senha criada"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                    </div>
                  </div>
                )}

                <button
                  id="form-submit-auth-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-black text-xs sm:text-sm shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {isLoading ? (
                    <span>Processando...</span>
                  ) : authMode === 'login' ? (
                    <>
                      <span>Entrar na Minha Conta</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : authMode === 'register' ? (
                    <>
                      <span>Cadastrar e Iniciar Estudos</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Enviar Link de Recuperação</span>
                      <Mail className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Return to login link in forgot password mode */}
              {authMode === 'forgot' && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      clearAuthError();
                      setFormValidation(null);
                      setAuthMode('login');
                    }}
                    className="text-xs font-bold text-cyan-300 hover:underline cursor-pointer"
                  >
                    ← Voltar para a tela de login
                  </button>
                </div>
              )}

              {/* Guest mode fallback */}
              <div className="pt-4 mt-4 border-t border-white/10 flex flex-col items-center gap-2">
                <button
                  id="guest-mode-action-btn"
                  type="button"
                  onClick={onContinueAsGuest}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Experimentar sem conta (Visitante)</span>
                </button>
                <p className="text-[10px] text-slate-400 leading-snug text-center">
                  Faça login para manter suas redações salvas na nuvem mesmo ao trocar de dispositivo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto pt-4 pb-2 border-t border-white/10 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left relative z-10">
        <p className="text-left">© 2026 ENEM Master • Matriz de Correção Oficial INEP</p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Gratuito para Estudantes
          </span>
        </div>
      </footer>
    </div>
  );
};
