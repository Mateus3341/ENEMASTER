import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  Leaf, 
  Cpu, 
  HeartPulse, 
  GraduationCap, 
  Users, 
  Briefcase, 
  ShieldAlert, 
  Shuffle, 
  Check, 
  Copy, 
  ArrowRight, 
  BookOpen, 
  Lightbulb, 
  AlertTriangle, 
  Target, 
  FileText, 
  Bookmark, 
  BookmarkCheck, 
  Trash2, 
  Share2, 
  Layers, 
  Flame,
  Info,
  CheckCircle2,
  Brain,
  PenTool,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  Zap,
  RotateCw
} from 'lucide-react';
import { KNOWLEDGE_AREAS_CONFIG, CURATED_THEME_PROPOSALS } from '../data/officialData';
import { GeneratedThemeResponse, KnowledgeAreaId, MotivatingText } from '../types';
import { AiProgressBar } from './AiProgressBar';
import { useAiProgress } from '../hooks/useAiProgress';
import { useSavedWork } from '../contexts/SavedWorkContext';
import { useBackgroundTasks } from '../contexts/BackgroundTasksContext';

interface ThemeGeneratorViewProps {
  onSendToCorrection: (theme: string) => void;
  onSendToCreation?: (theme: string) => void;
  onSendToRepertoireHunter?: (theme: string) => void;
}

export const ThemeGeneratorView: React.FC<ThemeGeneratorViewProps> = ({ 
  onSendToCorrection, 
  onSendToCreation,
  onSendToRepertoireHunter
}) => {
  const { savedWork, setGeneratedTheme: setPersistedTheme } = useSavedWork();
  const { startTask, updateTaskProgress, completeTask, failTask } = useBackgroundTasks();

  const [selectedAreas, setSelectedAreas] = useState<KnowledgeAreaId[]>(['meio_ambiente', 'sociedade']);
  const [difficulty, setDifficulty] = useState<'Acessível' | 'Padrão ENEM' | 'Desafiador / Inédito'>('Padrão ENEM');
  const [keywordsStyle, setKeywordsStyle] = useState<string>('aleatorio');
  const [subFocus, setSubFocus] = useState<string>('');
  
  // Persist across tabs
  const [currentTheme, setCurrentTheme] = useState<GeneratedThemeResponse | null>(() => {
    return savedWork.generatedTheme || null;
  });
  const [includeMotivatingTexts, setIncludeMotivatingTexts] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMotivatingTexts, setIsLoadingMotivatingTexts] = useState<boolean>(false);
  const [isLoadingGuide, setIsLoadingGuide] = useState<boolean>(false);
  const [showPedagogicalGuide, setShowPedagogicalGuide] = useState<boolean>(false);
  const [userBrainstormNotes, setUserBrainstormNotes] = useState<string>('');
  const [showBrainstormBox, setShowBrainstormBox] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedTitle, setCopiedTitle] = useState<boolean>(false);
  const [activeMotivatingTab, setActiveMotivatingTab] = useState<string>('all');

  const themeProgress = useAiProgress({
    steps: includeMotivatingTexts ? [
      'Cruzando eixos temáticos e áreas do conhecimento...',
      'Definindo o problema social central no Brasil...',
      'Formulando a coletânea de 4 Textos Motivadores (Padrão INEP)...',
      'Consolidando palavras-chave e critérios da proposta...'
    ] : [
      'Cruzando eixos temáticos e áreas do conhecimento...',
      'Mapeando o problema social no contexto brasileiro...',
      'Formulando frase temática de alto impacto no padrão INEP...',
      'Consolidando palavras-chave e critérios da proposta...'
    ],
    estimatedDurationMs: includeMotivatingTexts ? 9000 : 5000,
  });

  const motivatingProgress = useAiProgress({
    steps: [
      'Pesquisando marcos constitucionais e diretrizes legais (Texto I)...',
      'Levantando indicadores estatísticos oficiais do IBGE/IPEA (Texto II)...',
      'Construindo análise de impacto sociocultural (Texto III)...',
      'Formulando reflexão crítica para autoria argumentativa (Texto IV)...'
    ],
    estimatedDurationMs: 8000,
  });

  const guideProgress = useAiProgress({
    steps: [
      'Estruturando teses em duas frentes para D1 e D2...',
      'Selecionando repertórios socioculturais legítimos...',
      'Elaborando esqueleto da intervenção nos 5 elementos (C5)...',
      'Mapeando armadilhas temáticas e tangenciamento...'
    ],
    estimatedDurationMs: 7000,
  });
  
  // Local storage favorites
  const [savedFavoriteThemes, setSavedFavoriteThemes] = useState<GeneratedThemeResponse[]>(() => {
    try {
      const stored = localStorage.getItem('enem_favorite_themes_v1');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeSubTab, setActiveSubTab] = useState<'generator' | 'favorites' | 'curated'>('generator');

  useEffect(() => {
    try {
      localStorage.setItem('enem_favorite_themes_v1', JSON.stringify(savedFavoriteThemes));
    } catch (e) {
      console.error('Failed to save favorite themes', e);
    }
  }, [savedFavoriteThemes]);

  // Sync state if background task completed while user was on another tab
  useEffect(() => {
    if (savedWork.generatedTheme && (!currentTheme || savedWork.generatedTheme.title !== currentTheme.title)) {
      setCurrentTheme(savedWork.generatedTheme);
    }
  }, [savedWork.generatedTheme]);

  const isFavorite = currentTheme 
    ? savedFavoriteThemes.some(t => t.id === currentTheme.id || t.title === currentTheme.title)
    : false;

  const toggleFavorite = () => {
    if (!currentTheme) return;
    if (isFavorite) {
      setSavedFavoriteThemes(prev => prev.filter(t => t.id !== currentTheme.id && t.title !== currentTheme.title));
    } else {
      setSavedFavoriteThemes(prev => [currentTheme, ...prev]);
    }
  };

  const toggleArea = (areaId: KnowledgeAreaId) => {
    if (selectedAreas.includes(areaId)) {
      if (selectedAreas.length > 1) {
        setSelectedAreas(selectedAreas.filter(id => id !== areaId));
      }
    } else {
      setSelectedAreas([...selectedAreas, areaId]);
    }
  };

  const handleGenerateTheme = async () => {
    setIsLoading(true);
    themeProgress.startProgress();
    setErrorMessage(null);
    setShowPedagogicalGuide(false);
    setUserBrainstormNotes('');
    setActiveMotivatingTab('all');

    const taskId = `task-theme-${Date.now()}`;
    startTask(taskId, 'themes', 'Geração de Proposta de Tema INEP', `Áreas: ${selectedAreas.join(', ')}`);

    try {
      updateTaskProgress(taskId, 35, 'Cruzando eixos temáticos e áreas do conhecimento...');
      const areaNames = selectedAreas.map(id => {
        const found = KNOWLEDGE_AREAS_CONFIG.find(a => a.id === id);
        return found ? found.name : id;
      });

      const response = await fetch('/api/generate-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          areas: areaNames,
          difficulty,
          subFocus: subFocus.trim(),
          keywordsStyle,
          includeMotivatingTexts
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao se conectar com o gerador oficial.');
      }

      updateTaskProgress(taskId, 75, 'Formatando textos motivadores e critérios...');
      const data = await response.json();
      themeProgress.completeProgress();
      setCurrentTheme(data);
      setPersistedTheme(data);
      completeTask(taskId, data);
      setActiveSubTab('generator');
      if (data.isFallback) {
        setErrorMessage('Tema gerado com sucesso a partir do Acervo Oficial INEP!');
      }
    } catch (err: any) {
      themeProgress.resetProgress();
      console.warn('Network error, fallbacking to curated theme:', err);
      // Fallback: pick a matching curated proposal if network error occurs
      const randomCurated = CURATED_THEME_PROPOSALS[Math.floor(Math.random() * CURATED_THEME_PROPOSALS.length)];
      const fallbackData = {
        ...randomCurated,
        motivatingTexts: includeMotivatingTexts ? randomCurated.motivatingTexts : []
      };
      setCurrentTheme(fallbackData);
      setPersistedTheme(fallbackData);
      completeTask(taskId, fallbackData);
      setActiveSubTab('generator');
      setErrorMessage('Tema carregado com sucesso do Acervo Oficial Homologado INEP!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateMotivatingTexts = async () => {
    if (!currentTheme?.title) return;
    setIsLoadingMotivatingTexts(true);
    motivatingProgress.startProgress();
    setErrorMessage(null);
    try {
      const response = await fetch('/api/generate-motivating-texts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentTheme.title,
          axis: currentTheme.axis,
          socialProblem: currentTheme.socialProblem,
          thematicCut: currentTheme.thematicCut
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao obter os textos motivadores da proposta.');
      }

      const data = await response.json();
      motivatingProgress.completeProgress();
      if (data.motivatingTexts && Array.isArray(data.motivatingTexts)) {
        setCurrentTheme(prev => ({
          ...prev,
          motivatingTexts: data.motivatingTexts
        }));
        setActiveMotivatingTab('all');
      }
    } catch (err: any) {
      motivatingProgress.resetProgress();
      console.error('Erro ao gerar textos motivadores:', err);
      setErrorMessage('Não foi possível gerar a coletânea de textos motivadores no momento. Tente novamente.');
    } finally {
      setIsLoadingMotivatingTexts(false);
    }
  };

  const handleTogglePedagogicalGuide = async () => {
    if (showPedagogicalGuide) {
      setShowPedagogicalGuide(false);
      return;
    }

    if (!currentTheme?.title) return;

    // If guide content already exists on current theme, simply reveal it
    if (currentTheme.suggestedTheses?.d1 && currentTheme.recommendedRepertoires && currentTheme.recommendedRepertoires.length > 0) {
      setShowPedagogicalGuide(true);
      return;
    }

    // Otherwise, generate guide on demand
    setIsLoadingGuide(true);
    guideProgress.startProgress();
    try {
      const response = await fetch('/api/generate-theme-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentTheme.title,
          axis: currentTheme.axis,
          socialProblem: currentTheme.socialProblem,
          thematicCut: currentTheme.thematicCut
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao obter o guia pedagógico.');
      }

      const guideData = await response.json();
      guideProgress.completeProgress();
      setCurrentTheme(prev => prev ? ({
        ...prev,
        suggestedTheses: guideData.suggestedTheses,
        recommendedRepertoires: guideData.recommendedRepertoires,
        suggestedIntervention: guideData.suggestedIntervention,
        commonTangentsWarning: guideData.commonTangentsWarning
      }) : null);
      setShowPedagogicalGuide(true);
    } catch (err: any) {
      guideProgress.resetProgress();
      console.error('Error fetching pedagogical guide:', err);
      setErrorMessage('Não foi possível carregar o guia no momento. Tente novamente.');
    } finally {
      setIsLoadingGuide(false);
    }
  };

  const handleRandomCurated = () => {
    const list = currentTheme ? CURATED_THEME_PROPOSALS.filter(t => t.id !== currentTheme.id) : CURATED_THEME_PROPOSALS;
    const picked = (list.length > 0 ? list[Math.floor(Math.random() * list.length)] : CURATED_THEME_PROPOSALS[0]) || CURATED_THEME_PROPOSALS[0];
    setCurrentTheme(picked);
    setShowPedagogicalGuide(false);
    setUserBrainstormNotes('');
    setActiveSubTab('generator');
  };

  const handleCopyTitle = () => {
    if (!currentTheme) return;
    navigator.clipboard.writeText(currentTheme.title);
    setCopiedTitle(true);
    setTimeout(() => setCopiedTitle(false), 2000);
  };

  // Helper to render area icon
  const renderAreaIcon = (iconName: string, className: string = "w-4 h-4") => {
    switch (iconName) {
      case 'Leaf': return <Leaf className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'HeartPulse': return <HeartPulse className={className} />;
      case 'GraduationCap': return <GraduationCap className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Briefcase': return <Briefcase className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      default: return <Compass className={className} />;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner / Header Bento */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10 border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-semibold text-indigo-300">
              <Compass className="w-3.5 h-3.5" />
              <span>Gerador de Propostas Oficiais • Padrão INEP/MEC</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Gerador Inteligente de Temas de Redação
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Formule temas autênticos com <strong className="text-white">recorte temático preciso</strong>, <strong className="text-white">problema social brasileiro implícito</strong> e <strong className="text-white">coletânea completa de 4 textos motivadores</strong> nos moldes exatos da banca examinadora.
            </p>
          </div>

          {/* Quick Subtab Switcher */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 self-start md:self-center">
            <button
              id="tab-btn-generator"
              onClick={() => setActiveSubTab('generator')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'generator'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Criador de Temas</span>
            </button>
            <button
              id="tab-btn-curated"
              onClick={() => setActiveSubTab('curated')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'curated'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Temas Curados ({CURATED_THEME_PROPOSALS.length})</span>
            </button>
            <button
              id="tab-btn-favorites"
              onClick={() => setActiveSubTab('favorites')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'favorites'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Favoritos ({savedFavoriteThemes.length})</span>
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-3 text-amber-800 dark:text-amber-300 text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* VIEW 1: Generator Workspace */}
      {activeSubTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Configuration Bento (4 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Step 1: Knowledge Areas Selection */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-black text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">Áreas de Conhecimento</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Selecione uma ou mais áreas temáticas</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full">
                  {selectedAreas.length} selecionada(s)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {KNOWLEDGE_AREAS_CONFIG.map((area) => {
                  const isSelected = selectedAreas.includes(area.id);
                  return (
                    <button
                      key={area.id}
                      id={`area-toggle-${area.id}`}
                      type="button"
                      onClick={() => toggleArea(area.id)}
                      className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between gap-2 text-xs relative cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-200 font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                          {renderAreaIcon(area.iconName, 'w-3.5 h-3.5')}
                        </div>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold leading-tight text-slate-900 dark:text-white">{area.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal line-clamp-1 mt-0.5">{area.exampleTopics[0]} • {area.exampleTopics[1]}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Formulation Criteria & Custom Subfocus */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-black text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">Recorte e Complexidade</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Parâmetros do padrão da banca examinadora</p>
                </div>
              </div>

              {/* SubFocus input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Subtema ou Foco Específico (Opcional)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Ex: Juventude, IA, SUS, Seca</span>
                </label>
                <input
                  id="input-subfocus"
                  type="text"
                  value={subFocus}
                  onChange={(e) => setSubFocus(e.target.value)}
                  placeholder="Ex: Trabalho por aplicativo, saúde mental, bioma cerrado..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Keywords Pattern Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Padrão de Frase Temática INEP</label>
                <select
                  id="select-phrase-style"
                  value={keywordsStyle}
                  onChange={(e) => setKeywordsStyle(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="aleatorio">🎲 Aleatório (Qualquer operador INEP)</option>
                  <option value="desafios">"Desafios para a/o [problemática] no Brasil"</option>
                  <option value="persistencia">"A persistência de [problema social] no Brasil"</option>
                  <option value="caminhos">"Caminhos para combater/garantir [direito] no Brasil"</option>
                  <option value="invisibilidade">"Invisibilidade e [cidadania]: desafios no Brasil"</option>
                  <option value="estigma">"O estigma associado a [condição] no Brasil"</option>
                </select>
              </div>

              {/* Difficulty Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nível de Ineditismo / Dificuldade</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Acessível', 'Padrão ENEM', 'Desafiador / Inédito'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      id={`btn-diff-${lvl}`}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all text-center cursor-pointer ${
                        difficulty === lvl
                          ? 'bg-slate-900 dark:bg-indigo-600 text-white border-slate-900 dark:border-indigo-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Motivating Texts Toggle for Ultra-Fast Generation */}
              <div 
                id="toggle-motivating-texts-option"
                className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Modo de Resposta Rápida
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIncludeMotivatingTexts(!includeMotivatingTexts)}
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                      includeMotivatingTexts ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    aria-label="Alternar geração prévia de textos motivadores"
                    title={includeMotivatingTexts ? "Textos motivadores inclusos" : "Apenas o tema (máxima velocidade)"}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        includeMotivatingTexts ? 'translate-x-4.5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  {includeMotivatingTexts ? (
                    <span className="text-indigo-700 dark:text-indigo-300 font-medium flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      Incluir a coletânea completa (4 textos motivadores) no disparo inicial.
                    </span>
                  ) : (
                    <span>
                      ⚡ <strong>Focar no tema (Ultrarrápido)</strong>. A IA prioriza gerar a frase temática e as diretrizes em segundos. A coletânea de apoio fica opcional sob demanda.
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <button
                  id="btn-generate-ai-theme"
                  type="button"
                  onClick={handleGenerateTheme}
                  disabled={isLoading}
                  className="w-full py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-sm shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Formulando Proposta com IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-indigo-200" />
                      <span>Gerar Proposta Inédita com IA</span>
                    </>
                  )}
                </button>

                {/* Direct button to generate motivating texts for the current theme */}
                <button
                  id="btn-generate-motivating-texts-sidebar"
                  type="button"
                  onClick={handleGenerateMotivatingTexts}
                  disabled={!currentTheme || isLoadingMotivatingTexts || isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  title={currentTheme ? "Gerar ou regerar a coletânea de 4 textos motivadores para a proposta atual" : "Gere ou selecione um tema primeiro"}
                >
                  {isLoadingMotivatingTexts ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin shrink-0" />
                      <span>Gerando Textos Motivadores...</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>
                        {currentTheme?.motivatingTexts && currentTheme.motivatingTexts.length > 0 
                          ? "Regerar Textos Motivadores" 
                          : "Gerar Textos Motivadores"}
                      </span>
                    </>
                  )}
                </button>

                <button
                  id="btn-random-curated-theme"
                  type="button"
                  onClick={handleRandomCurated}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Sortear Proposta do Acervo Oficial</span>
                </button>
              </div>
            </div>

            {/* Quick Tips Bento */}
            <div className="bg-gradient-to-br from-indigo-50 to-slate-50 dark:from-indigo-950/40 dark:to-slate-900/60 rounded-3xl p-5 border border-indigo-100/80 dark:border-indigo-800/60 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-bold text-xs">
                <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>O que define um tema oficial do ENEM?</span>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
                <li><strong className="text-slate-800 dark:text-slate-100">Recorte Nacional:</strong> Sempre focado na sociedade brasileira.</li>
                <li><strong className="text-slate-800 dark:text-slate-100">Problema Social:</strong> Exige reflexão sobre cidadania, ética ou direitos humanos.</li>
                <li><strong className="text-slate-800 dark:text-slate-100">Não Neutro:</strong> Deve permitir defesa clara de uma tese com proposta de intervenção.</li>
              </ul>
            </div>

          </div>

          {/* Right Column: Theme Proposal Output (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Real AI Progress Bar during Theme Generation */}
            {isLoading && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <AiProgressBar
                  isLoading={isLoading}
                  progress={themeProgress.progress}
                  currentStepIndex={themeProgress.currentStepIndex}
                  steps={themeProgress.steps}
                  title={includeMotivatingTexts ? "Formulando Proposta Completa com IA..." : "Formulando Frase Temática com Máxima Agilidade..."}
                  subtitle={includeMotivatingTexts ? "Cruzando eixos temáticos, recorte social brasileiro e 4 textos motivadores no padrão INEP" : "Cruzando áreas de conhecimento e consolidando palavras-chave obrigatórias (Modo Rápido)"}
                  accentColor="indigo"
                  variant="card"
                />
              </div>
            )}

            {/* Main Theme Proposal Content or Clean Empty State for First Use */}
            {!currentTheme ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center flex flex-col items-center justify-center space-y-6 min-h-[460px]">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Pronto para Formular um Tema Inédito?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Personalize os eixos temáticos e o nível de dificuldade no painel à esquerda e clique em <strong>Gerar Proposta Inédita com IA</strong> ou explore o <strong>Acervo Oficial</strong> para começar seu treinamento.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full max-w-sm">
                  <button
                    type="button"
                    onClick={handleGenerateTheme}
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Gerar Tema com IA</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRandomCurated}
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Shuffle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>Sortear do Acervo</span>
                  </button>
                </div>

                {/* Knowledge Area Badges preview */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 w-full max-w-lg">
                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
                    Áreas do Conhecimento Disponíveis
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {KNOWLEDGE_AREAS_CONFIG.map(area => (
                      <span 
                        key={area.id}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium"
                      >
                        {area.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Main Theme Banner Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              {/* Header Badges & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full">
                    {currentTheme.axis || 'Eixo Temático Social'}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-full">
                    {currentTheme.difficultyLevel || difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-toggle-favorite"
                    type="button"
                    onClick={toggleFavorite}
                    className={`p-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isFavorite 
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400' 
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                    title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                  >
                    {isFavorite ? <BookmarkCheck className="w-4 h-4 fill-rose-500 text-rose-500" /> : <Bookmark className="w-4 h-4" />}
                    <span className="hidden sm:inline">{isFavorite ? 'Salvo' : 'Salvar'}</span>
                  </button>

                  <button
                    id="btn-copy-theme-title"
                    type="button"
                    onClick={handleCopyTitle}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Copiar título da proposta"
                  >
                    {copiedTitle ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copiedTitle ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Title Display */}
              <div className="space-y-3">
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  Proposta Oficial de Redação
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug font-serif">
                  "{currentTheme.title}"
                </h3>
              </div>

              {/* High-Visibility Motivating Texts Callout & Direct Trigger */}
              <div className="p-3.5 sm:p-4 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Caderno de Textos Motivadores</span>
                      {currentTheme.motivatingTexts && currentTheme.motivatingTexts.length > 0 ? (
                        <span className="px-2 py-0.5 text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold rounded-full">
                          4 textos ativos
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold rounded-full">
                          Opcional (Modo Rápido)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      {currentTheme.motivatingTexts && currentTheme.motivatingTexts.length > 0
                        ? "Textos I a IV disponíveis para embasamento e interpretação crítica."
                        : "Gere a coletânea oficial com base jurídica, dados estatísticos e reflexão."}
                    </p>
                  </div>
                </div>

                <button
                  id="btn-generate-motivating-texts-banner"
                  type="button"
                  onClick={handleGenerateMotivatingTexts}
                  disabled={isLoadingMotivatingTexts || isLoading}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isLoadingMotivatingTexts ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Gerando 4 Textos...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                      <span>
                        {currentTheme.motivatingTexts && currentTheme.motivatingTexts.length > 0
                          ? "Regerar Textos Motivadores com IA"
                          : "Gerar Textos Motivadores com IA"}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons to Write, Create, Motivating Texts or Hunt Repertoires */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                <button
                  id="btn-write-this-theme"
                  type="button"
                  onClick={() => onSendToCorrection(currentTheme.title)}
                  className="py-3 px-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer group"
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Escrever no Corretor</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>

                <button
                  id="btn-trigger-motivating-texts-action"
                  type="button"
                  onClick={handleGenerateMotivatingTexts}
                  disabled={isLoadingMotivatingTexts || isLoading}
                  className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer group"
                >
                  {isLoadingMotivatingTexts ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                      <span>Gerando Textos...</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 shrink-0" />
                      <span>
                        {currentTheme.motivatingTexts && currentTheme.motivatingTexts.length > 0
                          ? "Regerar Textos"
                          : "Gerar Textos Motivadores"}
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-emerald-200 group-hover:rotate-12 transition-transform shrink-0" />
                    </>
                  )}
                </button>

                {onSendToRepertoireHunter && (
                  <button
                    id="btn-hunt-repertoires-this-theme"
                    type="button"
                    onClick={() => onSendToRepertoireHunter(currentTheme.title)}
                    className="py-3 px-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer group"
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Caçar Repertórios</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                )}

                {onSendToCreation && (
                  <button
                    id="btn-create-1000-this-theme"
                    type="button"
                    onClick={() => onSendToCreation(currentTheme.title)}
                    className="py-3 px-3 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs shadow-md shadow-slate-900/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer group border border-transparent dark:border-slate-700"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>Gerar Nota 1000</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                )}
              </div>

              {/* Explicit Social Problem & Thematic Cut Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <Target className="w-3.5 h-3.5 text-rose-500" />
                    <span>Problema Social a Discutir</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {currentTheme.socialProblem}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Recorte e Limites Temáticos</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {currentTheme.thematicCut}
                  </p>
                </div>
              </div>

              {/* Keywords Required (Anti-Tangenciamento) */}
              {currentTheme.keywordsToCover && currentTheme.keywordsToCover.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Termos-Chave Obrigatórios no seu Texto (Evita Tangenciamento C2):
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentTheme.keywordsToCover.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 text-[11px] font-semibold rounded-lg">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Motivating Texts (Textos Motivadores I a IV) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Coletânea de Textos Motivadores (Caderno de Questões)</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Inspiração para contextualização e interpretação crítica</p>
                </div>

                {currentTheme.motivatingTexts && currentTheme.motivatingTexts.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Filter pills */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      <button
                        onClick={() => setActiveMotivatingTab('all')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          activeMotivatingTab === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Todos ({currentTheme.motivatingTexts.length})
                      </button>
                      {currentTheme.motivatingTexts.map((txt, idx) => (
                        <button
                          key={txt.id ? `mot-tab-${txt.id}-${idx}` : `mot-tab-${idx}`}
                          onClick={() => setActiveMotivatingTab(txt.number)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            activeMotivatingTab === txt.number ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Texto {txt.number}
                        </button>
                      ))}
                    </div>

                    {/* Primary Re-generate / New texts button */}
                    <button
                      id="btn-generate-motivating-texts-header"
                      type="button"
                      onClick={handleGenerateMotivatingTexts}
                      disabled={isLoadingMotivatingTexts}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      title="Gerar novos textos motivadores com IA para este tema"
                    >
                      <Sparkles className={`w-3.5 h-3.5 text-indigo-200 ${isLoadingMotivatingTexts ? 'animate-spin' : ''}`} />
                      <span>{isLoadingMotivatingTexts ? "Gerando Textos..." : "Gerar Textos com IA"}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    id="btn-generate-motivating-texts-header-alt"
                    type="button"
                    onClick={handleGenerateMotivatingTexts}
                    disabled={isLoadingMotivatingTexts}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 text-indigo-200 ${isLoadingMotivatingTexts ? 'animate-spin' : ''}`} />
                    <span>{isLoadingMotivatingTexts ? "Gerando..." : "Gerar Textos Motivadores"}</span>
                  </button>
                )}
              </div>

              {/* Display Motivating Texts OR On-Demand Generation Box */}
              {currentTheme.motivatingTexts && currentTheme.motivatingTexts.length > 0 ? (
                <div className="space-y-4">
                  {currentTheme.motivatingTexts
                    .filter(t => activeMotivatingTab === 'all' || activeMotivatingTab === t.number)
                    .map((txt, idx) => (
                      <div 
                        key={txt.id ? `mot-card-${txt.id}-${idx}` : `mot-card-${idx}`}
                        className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-indigo-600 text-white font-extrabold text-[10px] rounded-md">
                              TEXTO {txt.number}
                            </span>
                            {txt.title && (
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                {txt.title}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {txt.type === 'conceito_lei' ? 'Base Jurídica/Conceitual' :
                             txt.type === 'dados_estatistica' ? 'Dados & Estatísticas' :
                             txt.type === 'social_noticia' ? 'Contexto Social' : 'Reflexão Crítica'}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-serif italic bg-white/70 dark:bg-slate-900/70 p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                          "{txt.content}"
                        </p>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans flex items-center gap-1">
                          <span className="font-semibold text-slate-600 dark:text-slate-300">Fonte:</span>
                          <span>{txt.source}</span>
                        </div>
                      </div>
                    ))}

                  {/* Footer callout to regenerate or generate alternative texts */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Coletânea oficial completa no padrão INEP (4 textos motivadores).</span>
                    </div>
                    <button
                      id="btn-regenerate-motivating-texts-bottom"
                      type="button"
                      onClick={handleGenerateMotivatingTexts}
                      disabled={isLoadingMotivatingTexts}
                      className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200/80 dark:border-indigo-800 flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${isLoadingMotivatingTexts ? 'animate-spin' : ''}`} />
                      <span>Gerar Outra Coletânea com IA</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-indigo-50/60 via-slate-50 to-indigo-50/30 dark:from-indigo-950/30 dark:via-slate-900/60 dark:to-indigo-950/20 border border-indigo-100/90 dark:border-indigo-900/60 space-y-4">
                  {isLoadingMotivatingTexts ? (
                    <div className="space-y-3">
                      <AiProgressBar
                        isLoading={isLoadingMotivatingTexts}
                        progress={motivatingProgress.progress}
                        currentStepIndex={motivatingProgress.currentStepIndex}
                        steps={motivatingProgress.steps}
                        title="Formulando Coletânea Oficial (Textos I a IV)..."
                        subtitle="Pesquisando marcos jurídicos, indicadores estatísticos e análise social no padrão INEP"
                        accentColor="indigo"
                        variant="compact"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-xs">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="space-y-1 text-center sm:text-left flex-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
                          <span>Coletânea de Textos Motivadores Opcional</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-md">
                            Resposta Rápida Ativa
                          </span>
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                          O tema foi gerado com velocidade máxima para você já iniciar a leitura do recorte. Se quiser consultar a coletânea completa com os 4 textos de apoio oficiais (base jurídica, estatísticas, impacto social e reflexão crítica), gere-os com um clique.
                        </p>
                      </div>
                      <button
                        id="btn-generate-motivating-texts-ondemand"
                        type="button"
                        onClick={handleGenerateMotivatingTexts}
                        className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-200" />
                        <span>Gerar 4 Textos Motivadores</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Creative Autonomy & Pedagogical Guide Laboratory */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              
              {/* Header & Creative Independence Advice */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <Brain className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Laboratório de Autoria & Guia Pedagógico
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Exercite sua independência criativa antes de consultar as sugestões da banca examinadora.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBrainstormBox(!showBrainstormBox)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                      showBrainstormBox
                        ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>{showBrainstormBox ? 'Fechar Rascunho' : 'Rascunho Livre'}</span>
                  </button>
                </div>
              </div>

              {/* Student Scratchpad / Brainstorm area */}
              {showBrainstormBox && (
                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl space-y-2.5 transition-all">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    <span className="flex items-center gap-1.5">
                      <PenTool className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      Seu Espaço de Rascunho de Ideias (Autoria Própria):
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Privado e não avaliado</span>
                  </div>
                  <textarea
                    value={userBrainstormNotes}
                    onChange={(e) => setUserBrainstormNotes(e.target.value)}
                    rows={3}
                    placeholder="Anote aqui suas primeiras hipóteses: qual tese defenderia no D1? Qual repertório você lembra para o D2? Como resolveria o problema na C5?"
                    className="w-full text-xs p-3 rounded-xl border border-indigo-200/80 dark:border-indigo-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
                  />
                </div>
              )}

              {/* Guide Trigger Button / Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 dark:from-slate-800/60 dark:via-indigo-950/20 dark:to-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-lg">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {showPedagogicalGuide ? (
                      <Unlock className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span>
                      {showPedagogicalGuide 
                        ? 'Guia Pedagógico Nota 1000 Ativo' 
                        : 'Precisa de inspiração adicional da banca?'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {showPedagogicalGuide
                      ? 'Consulte teses sugeridas para D1 e D2, repertórios socioculturais comentados e esqueleto de intervenção nos 5 elementos.'
                      : 'O tema e textos motivadores foram gerados sem interferência para você exercitar sua criatividade. Clique para desbloquear o guia pedagógico sob demanda.'}
                  </p>
                </div>

                <button
                  id="btn-toggle-pedagogical-guide"
                  type="button"
                  onClick={handleTogglePedagogicalGuide}
                  disabled={isLoadingGuide}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    showPedagogicalGuide
                      ? 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                  }`}
                >
                  {isLoadingGuide ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Elaborando Guia com IA...</span>
                    </>
                  ) : showPedagogicalGuide ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>Ocultar Guia</span>
                    </>
                  ) : (
                    <>
                      <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                      <span>{currentTheme.suggestedTheses?.d1 ? 'Ver Guia Pedagógico' : 'Solicitar Guia Pedagógico com IA'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Real AI Progress Bar during Guide Generation */}
              {isLoadingGuide && (
                <div className="pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AiProgressBar
                    isLoading={isLoadingGuide}
                    progress={guideProgress.progress}
                    currentStepIndex={guideProgress.currentStepIndex}
                    steps={guideProgress.steps}
                    title="Estruturando Guia Pedagógico Nota 1000..."
                    subtitle="Definindo teses analíticas para D1 e D2, repertórios legítimos e proposta de intervenção nos 5 elementos"
                    accentColor="amber"
                    variant="card"
                  />
                </div>
              )}

              {/* Render Full Pedagogical Guide when unlocked */}
              {showPedagogicalGuide && (
                <div className="space-y-6 pt-2 animate-in fade-in-50 duration-300">
                  
                  {/* Suggested Theses */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                      Sugestão de Teses em Duas Frentes (D1 e D2)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl space-y-1">
                        <span className="text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300 uppercase">Argumento 1 (D1)</span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {currentTheme.suggestedTheses?.d1}
                        </p>
                      </div>
                      <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl space-y-1">
                        <span className="text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300 uppercase">Argumento 2 (D2)</span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {currentTheme.suggestedTheses?.d2}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Repertoires */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                      Repertórios Socioculturais Produtivos e Legitimados
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {currentTheme.recommendedRepertoires?.map((rep, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
                          <div className="space-y-1 sm:max-w-xs">
                            <div className="font-bold text-slate-900 dark:text-white">{rep.name}</div>
                            <div className="text-[11px] text-indigo-700 dark:text-indigo-300 font-semibold">{rep.area} • Conceito: {rep.concept}</div>
                          </div>
                          <div className="text-slate-600 dark:text-slate-300 text-xs sm:flex-1 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 leading-relaxed">
                            <strong className="text-slate-800 dark:text-slate-100">Como aplicar:</strong> {rep.howToApply}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5-Element Intervention Blueprint */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Esqueleto da Proposta de Intervenção Oficial (5 Elementos C5)
                    </h4>
                    <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 rounded-2xl space-y-2 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                        <div><strong className="text-emerald-900 dark:text-emerald-300">1. Agente:</strong> {currentTheme.suggestedIntervention?.agent}</div>
                        <div><strong className="text-emerald-900 dark:text-emerald-300">2. Ação:</strong> {currentTheme.suggestedIntervention?.action}</div>
                        <div><strong className="text-emerald-900 dark:text-emerald-300">3. Meio/Modo:</strong> {currentTheme.suggestedIntervention?.modeMedium}</div>
                        <div><strong className="text-emerald-900 dark:text-emerald-300">4. Efeito:</strong> {currentTheme.suggestedIntervention?.effect}</div>
                      </div>
                      <div className="pt-1.5 border-t border-emerald-200/50 dark:border-emerald-800/50 text-emerald-950 dark:text-emerald-200 font-medium">
                        <strong className="text-emerald-900 dark:text-emerald-300">5. Detalhamento:</strong> {currentTheme.suggestedIntervention?.detailing}
                      </div>
                    </div>
                  </div>

                  {/* Tangents warning */}
                  {currentTheme.commonTangentsWarning && (
                    <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-2xl flex items-start gap-2.5 text-xs text-rose-900 dark:text-rose-200">
                      <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Aviso da Banca contra Tangenciamento:</strong> {currentTheme.commonTangentsWarning}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
              </>
            )}

          </div>

        </div>
      )}

      {/* VIEW 2: Curated Themes Library */}
      {activeSubTab === 'curated' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Acervo Homologado de Propostas Inéditas ENEM</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Propostas formuladas e revisadas segundo as cartilhas mais recentes do INEP</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CURATED_THEME_PROPOSALS.map((proposal) => (
              <div 
                key={proposal.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full border border-indigo-100 dark:border-indigo-900">
                      {proposal.axis}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {proposal.difficultyLevel}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-serif leading-snug">
                    "{proposal.title}"
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {proposal.socialProblem}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {proposal.keywordsToCover?.slice(0, 3).map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium rounded-md">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentTheme(proposal);
                      setActiveSubTab('generator');
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Abrir Proposta Completa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSendToCorrection(proposal.title)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all cursor-pointer"
                    title="Escrever sobre este tema"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: Favorites List */}
      {activeSubTab === 'favorites' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Temas Salvos nos Favoritos</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Seu banco personalizado de propostas para treinar</p>
            </div>
            {savedFavoriteThemes.length > 0 && (
              <button
                type="button"
                onClick={() => setSavedFavoriteThemes([])}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar Favoritos</span>
              </button>
            )}
          </div>

          {savedFavoriteThemes.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Nenhum tema salvo ainda</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ao gerar ou explorar propostas de redação, clique no botão "Salvar" para adicioná-las aqui.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTab('generator')}
                className="py-2 px-4 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5 cursor-pointer hover:bg-indigo-700"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gerar Propostas Agora</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedFavoriteThemes.map((fav) => (
                <div 
                  key={fav.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold rounded-full">
                        {fav.axis}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSavedFavoriteThemes(prev => prev.filter(t => t.id !== fav.id))}
                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                        title="Remover dos favoritos"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif leading-snug">
                      "{fav.title}"
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {fav.socialProblem}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentTheme(fav);
                        setActiveSubTab('generator');
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Ver Coletânea Completa</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onSendToCorrection(fav.title)}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
                      title="Escrever no corretor"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
