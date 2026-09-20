import React, { useState, useEffect } from 'react';
import { WifiOff, CheckCircle2, X } from 'lucide-react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CorrectionView } from './components/CorrectionView';
import { CreationView } from './components/CreationView';
import { ThemeGeneratorView } from './components/ThemeGeneratorView';
import { RepertoireHunterView } from './components/RepertoireHunterView';
import { StudyCompetenciesView } from './components/StudyCompetenciesView';
import { PracticeTrainerView } from './components/PracticeTrainerView';
import { Nota1000ExamplesView } from './components/Nota1000ExamplesView';
import { ProfessorChatView } from './components/ProfessorChatView';
import { GlossaryView } from './components/GlossaryView';
import { StudentEvolutionView } from './components/StudentEvolutionView';
import { EnemasterFloatingMascot } from './components/EnemasterMascot';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FloatingNav } from './components/FloatingNav';
import { BackgroundTasksBanner } from './components/BackgroundTasksBanner';
import { EnemasterLogo } from './components/EnemasterLogo';
import { ErrorBoundary } from './components/ErrorBoundary';
import { EssayCorrectionResult } from './types';
import { useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/LoginScreen';
import { RestartAppModal } from './components/RestartAppModal';
import { initAutoCacheCleanup } from './lib/cacheManager';
import { 
  saveEssayToFirestore, 
  deleteEssayFromFirestore, 
  loadUserEssaysFromFirestore,
  subscribeUserEssays,
  syncLocalEssaysToCloud
} from './lib/firestoreStorage';
import { 
  testFirebaseConnection, 
  trackSiteVisit, 
  subscribeGlobalStats, 
  AppGlobalStats 
} from './lib/firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const { user, isLoading } = useAuth();
  const [globalStats, setGlobalStats] = useState<AppGlobalStats>({
    totalVisits: 0,
    uniqueVisitors: 0,
    totalUniqueUsers: 0,
    totalLoginEvents: 0,
    totalEssaysSubmitted: 0,
    lastActiveAt: null,
  });
  
  const [isGuestMode, setIsGuestMode] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('enem_guest_mode') === 'true';
    } catch {
      return false;
    }
  });

  // Network status detection for Workbox offline experience
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Reset guest mode if user logs in
  useEffect(() => {
    if (user) {
      sessionStorage.removeItem('enem_guest_mode');
    }
  }, [user]);

  // Restart modal & cache notification states
  const [isRestartModalOpen, setIsRestartModalOpen] = useState<boolean>(false);
  const [cacheNotification, setCacheNotification] = useState<string | null>(null);

  // Initialize automatic cache hygiene & listen to restart feedback
  useEffect(() => {
    initAutoCacheCleanup();

    // Check if the app just restarted
    try {
      if (sessionStorage.getItem('enemaster_just_restarted') === 'true') {
        sessionStorage.removeItem('enemaster_just_restarted');
        setCacheNotification('Aplicativo reiniciado com sucesso! Todos os dados de cache foram limpos e o app está pronto para novo uso.');
      }
    } catch {}

    // Global listener for cache purge (from Logout, Restart or clean button)
    const handleCacheCleared = () => {
      // IMPORTANTE: As avaliações salvas corrigidas de cada usuário com login NUNCA são apagadas!
      // Elas permanecem 100% preservadas e carregadas tanto no dashboard quanto na nuvem.
      setCorrectionInitialResult(null);
      setCorrectionInitialTheme('');
      setCreationInitialTheme('');
      setHunterInitialTheme('');
      setProfessorEssayContext('');
      setProfessorThemeContext('');
      setActiveTab('dashboard');
    };

    window.addEventListener('enemaster:cache-cleared', handleCacheCleared);
    return () => window.removeEventListener('enemaster:cache-cleared', handleCacheCleared);
  }, []);

  // Auto-dismiss cache notification after 6 seconds
  useEffect(() => {
    if (!cacheNotification) return;
    const timer = setTimeout(() => {
      setCacheNotification(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [cacheNotification]);

  // Test connection to Firestore on boot and track anonymous visits
  useEffect(() => {
    testFirebaseConnection();
    trackSiteVisit();

    // Listen to real-time visitor and usage counters from Firestore
    const unsubscribe = subscribeGlobalStats((stats) => {
      setGlobalStats(stats);
    });

    return () => unsubscribe();
  }, []);

  // --- Global Theme State (Light / Dark) for Night Study Sessions ---
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const storedTheme = localStorage.getItem('enemaster_theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {}
    return 'light';
  });

  // Apply dark mode class to HTML document and save preference
  useEffect(() => {
    try {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('enemaster_theme', theme);
    } catch (e) {
      console.error('Failed to persist theme', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const [savedEssays, setSavedEssays] = useState<EssayCorrectionResult[]>(() => {
    try {
      const stored = localStorage.getItem('enem_saved_essays_v1');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isSavedDataLoading, setIsSavedDataLoading] = useState<boolean>(true);

  // Real-time bidirectional Firestore essay sync & automatic guest essay migration
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    // Safety fallback: ensure skeleton transitions away within 1200ms max
    const safetyFallbackTimer = setTimeout(() => {
      setIsSavedDataLoading(false);
    }, 1200);

    if (!user?.uid) {
      // If user logs out or is guest, load local cache
      try {
        const localGuest = localStorage.getItem('enem_saved_essays_v1');
        setSavedEssays(localGuest ? JSON.parse(localGuest) : []);
      } catch {
        setSavedEssays([]);
      }
      // Small graceful buffer to show skeleton animation and avoid white screen flashes
      timer = setTimeout(() => {
        setIsSavedDataLoading(false);
      }, 350);
      return () => {
        if (timer) clearTimeout(timer);
        clearTimeout(safetyFallbackTimer);
      };
    }

    // 1. First, check user-scoped local cache for instant zero-latency display
    let hasLocalCache = false;
    try {
      const userCached = localStorage.getItem(`enem_saved_essays_${user.uid}`);
      if (userCached) {
        const parsed = JSON.parse(userCached);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          setSavedEssays(parsed);
          hasLocalCache = true;
        }
      }
    } catch (err) {
      console.debug('Cache read note:', err);
    }

    if (hasLocalCache) {
      timer = setTimeout(() => {
        setIsSavedDataLoading(false);
      }, 300);
    }

    // 2. Migrate any existing local guest essays into this user's cloud account
    try {
      const localGuest = localStorage.getItem('enem_saved_essays_v1');
      if (localGuest) {
        const parsedGuest = JSON.parse(localGuest);
        if (Array.isArray(parsedGuest) && parsedGuest.length > 0) {
          syncLocalEssaysToCloud(user.uid, parsedGuest);
        }
      }
    } catch (err) {
      console.debug('Migration note:', err);
    }

    // 3. Subscribe in real-time to Firestore. Any essay created on mobile, tablet or PC
    // is instantly reflected on all open devices with zero manual refresh.
    const unsubscribe = subscribeUserEssays(
      user.uid,
      (remoteEssays) => {
        setSavedEssays(remoteEssays);
        setIsSavedDataLoading(false);
        try {
          localStorage.setItem(`enem_saved_essays_${user.uid}`, JSON.stringify(remoteEssays));
          localStorage.setItem('enem_saved_essays_v1', JSON.stringify(remoteEssays));
        } catch {}
      },
      (error) => {
        console.warn('Real-time essay subscription error:', error);
        setIsSavedDataLoading(false);
      }
    );

    return () => {
      unsubscribe();
      if (timer) clearTimeout(timer);
      clearTimeout(safetyFallbackTimer);
    };
  }, [user?.uid]);

  const [correctionInitialTheme, setCorrectionInitialTheme] = useState<string>('');
  const [correctionInitialResult, setCorrectionInitialResult] = useState<EssayCorrectionResult | null>(null);
  const [creationInitialTheme, setCreationInitialTheme] = useState<string>('');
  const [hunterInitialTheme, setHunterInitialTheme] = useState<string>('');
  const [professorEssayContext, setProfessorEssayContext] = useState<string>('');
  const [professorThemeContext, setProfessorThemeContext] = useState<string>('');

  // Persist saved essays locally with user-scoped and global keys
  useEffect(() => {
    try {
      if (savedEssays.length > 0) {
        localStorage.setItem('enem_saved_essays_v1', JSON.stringify(savedEssays));
        if (user?.uid) {
          localStorage.setItem(`enem_saved_essays_${user.uid}`, JSON.stringify(savedEssays));
        }
      }
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [savedEssays, user?.uid]);

  const handleSaveEssay = async (essay: EssayCorrectionResult) => {
    setSavedEssays((prev) => [essay, ...prev.filter(e => e.id !== essay.id)]);
    
    // Also persist to Firestore if user is authenticated
    if (user?.uid) {
      try {
        await saveEssayToFirestore(user.uid, essay);
      } catch (err) {
        console.warn('Could not sync essay to Firestore:', err);
      }
    }
  };

  const handleDeleteEssay = async (id: string) => {
    setSavedEssays((prev) => prev.filter((e) => e.id !== id));
    
    // Also delete from Firestore if user is authenticated
    if (user?.uid) {
      try {
        await deleteEssayFromFirestore(user.uid, id);
      } catch (err) {
        console.warn('Could not delete essay from Firestore:', err);
      }
    }
  };

  const handleSelectThemeForCorrection = (theme: string) => {
    setCorrectionInitialTheme(theme);
    setCorrectionInitialResult(null);
    setActiveTab('correction');
  };

  const handleSendToCorrection = (text: string, theme: string) => {
    setCorrectionInitialTheme(theme);
    setCorrectionInitialResult(null);
    setActiveTab('correction');
  };

  const handleSendToCreation = (theme: string) => {
    setCreationInitialTheme(theme);
    setActiveTab('creation');
  };

  const handleSendToHunter = (theme: string) => {
    setHunterInitialTheme(theme);
    setActiveTab('repertoire_hunter');
  };

  const handleSendToPractice = (repertoire: string, theme: string) => {
    setActiveTab('practice');
  };

  const handleAskProfessorAboutEssay = (essayText: string, theme: string, resultSummary: string) => {
    setProfessorEssayContext(`${essayText}\n\n[Resumo da Avaliação: ${resultSummary}]`);
    setProfessorThemeContext(theme);
    setActiveTab('professor');
  };

  const handleAskProfessorAboutConcept = (concept: string) => {
    setProfessorEssayContext(`[Dúvida do Glossário]: Gostaria de entender detalhadamente o conceito "${concept}", como ele é avaliado na matriz do INEP e exemplos práticos de repertório ou aplicação na redação nota 1000.`);
    setProfessorThemeContext(`Conceito: ${concept}`);
    setActiveTab('professor');
  };

  // Show sleek loader while checking initial auth status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white selection:bg-indigo-500">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center animate-pulse">
              <div className="w-6 h-6 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin"></div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-black tracking-tight text-white">ENEM <span className="text-indigo-400">MASTER</span></span>
            <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">Carregando ambiente de estudos...</span>
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated and has not chosen guest mode, show the Dedicated Login Screen
  if (!user && !isGuestMode) {
    return (
      <LoginScreen 
        stats={globalStats}
        onContinueAsGuest={() => {
          setIsGuestMode(true);
          try {
            sessionStorage.setItem('enem_guest_mode', 'true');
          } catch {}
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900/60 dark:selection:text-indigo-200 transition-colors duration-200">
      {/* Top Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigateToLogin={() => {
          setIsGuestMode(false);
          try {
            sessionStorage.removeItem('enem_guest_mode');
          } catch {}
        }}
        onOpenRestartModal={() => setIsRestartModalOpen(true)}
      />

      {/* Floating Navigation Dock for PC & Tablets */}
      <FloatingNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedEssays.length}
      />

      {/* Main View Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-28 sm:pb-12">
        {/* Active background tasks alert banner */}
        <BackgroundTasksBanner activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Cache cleared / restarted notification banner */}
        {cacheNotification && (
          <div className="mb-4 px-4 py-3 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-300/60 dark:border-emerald-700/60 text-emerald-950 dark:text-emerald-200 flex items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="font-semibold">{cacheNotification}</p>
            </div>
            <button
              type="button"
              onClick={() => setCacheNotification(null)}
              className="p-1 rounded-lg hover:bg-emerald-200/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 transition-colors"
              aria-label="Fechar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {!isOnline && (
          <div className="mb-5 px-4 py-3 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-700/60 text-amber-950 dark:text-amber-200 flex items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-200/60 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 shrink-0">
                <WifiOff className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold">
                  Modo Offline Ativo
                </p>
                <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80 mt-0.5">
                  Você pode consultar suas {savedEssays.length} redações salvas, notas, critérios das 5 competências, repertórios e glossário sem internet.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 uppercase tracking-wider">
              Offline Ready
            </span>
          </div>
        )}

        <ErrorBoundary 
          key={activeTab}
          variant="full-page"
          fallbackTitle="Instabilidade temporária na seção de estudos"
          fallbackMessage="Não se preocupe: seus rascunhos, notas e redações continuam intactos no seu navegador. Você pode tentar recarregar esta seção ou retornar ao painel inicial."
          recoveryActionLabel="Recarregar esta Seção"
          onNavigateHome={() => setActiveTab('dashboard')}
        >
          {activeTab === 'dashboard' && (
            <DashboardView 
              setActiveTab={setActiveTab}
              savedEssays={savedEssays}
              onSelectThemeForCorrection={handleSelectThemeForCorrection}
              isLoading={isSavedDataLoading}
            />
          )}

          {activeTab === 'themes' && (
            <ThemeGeneratorView 
              onSendToCorrection={(theme) => handleSelectThemeForCorrection(theme)}
              onSendToCreation={handleSendToCreation}
              onSendToRepertoireHunter={handleSendToHunter}
            />
          )}

          {activeTab === 'repertoire_hunter' && (
            <RepertoireHunterView 
              initialTheme={hunterInitialTheme}
              onSendToCreation={handleSendToCreation}
              onSendToCorrection={(theme) => handleSelectThemeForCorrection(theme)}
              onSendToPractice={handleSendToPractice}
            />
          )}

          {activeTab === 'correction' && (
            <CorrectionView 
              initialTheme={correctionInitialTheme}
              initialCorrectionResult={correctionInitialResult}
              savedEssays={savedEssays}
              onSaveEssay={handleSaveEssay}
              onAskProfessorAboutEssay={handleAskProfessorAboutEssay}
              isLoading={isSavedDataLoading}
            />
          )}

          {activeTab === 'creation' && (
            <CreationView 
              initialTheme={creationInitialTheme}
              onSendToCorrection={handleSendToCorrection}
              isDataLoading={isSavedDataLoading}
            />
          )}

          {activeTab === 'study' && (
            <StudyCompetenciesView />
          )}

          {activeTab === 'practice' && (
            <PracticeTrainerView />
          )}

          {activeTab === 'examples' && (
            <Nota1000ExamplesView 
              onSendToCorrection={handleSendToCorrection}
            />
          )}

          {activeTab === 'professor' && (
            <ProfessorChatView 
              essayContext={professorEssayContext}
              themeContext={professorThemeContext}
            />
          )}

          {activeTab === 'glossary' && (
            <GlossaryView 
              onAskProfessor={handleAskProfessorAboutConcept}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'evolution' && (
            <StudentEvolutionView 
              savedEssays={savedEssays}
              onSelectEssay={(essay) => {
                setCorrectionInitialTheme(essay.theme);
                setCorrectionInitialResult(essay);
                setActiveTab('correction');
              }}
              onDeleteEssay={handleDeleteEssay}
              onStartNewEssay={() => {
                setCorrectionInitialTheme('');
                setCorrectionInitialResult(null);
                setActiveTab('correction');
              }}
              isLoading={isSavedDataLoading}
            />
          )}
        </ErrorBoundary>
      </main>

      {/* Floating Interactive Mascot Widget */}
      <EnemasterFloatingMascot />

      {/* Dedicated Mobile Bottom Navigation Dock */}
      <MobileBottomNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedEssays.length}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenRestartModal={() => setIsRestartModalOpen(true)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <EnemasterLogo variant="horizontal" size="sm" showSlogan={true} />
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4 text-center sm:text-right">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>Matriz Oficial INEP 2018–2025</span>
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <p className="text-slate-400 dark:text-slate-500">
              Redação ENEM Nota 1000 — com Mestre Corujito.
            </p>
          </div>
        </div>
      </footer>
      {/* Restart & Cache Clean Modal */}
      <RestartAppModal 
        isOpen={isRestartModalOpen}
        onClose={() => setIsRestartModalOpen(false)}
        onSuccessNotification={(msg) => setCacheNotification(msg)}
      />
    </div>
  );
}
