import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookMarked, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  Copy, 
  Check, 
  Star, 
  GraduationCap, 
  Scale, 
  Layers, 
  BookOpen, 
  PenTool, 
  Target, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  HelpCircle, 
  RotateCcw, 
  Zap, 
  ExternalLink,
  Flame,
  Award,
  Compass
} from 'lucide-react';
import { GlossaryTerm, GlossaryCategory } from '../types';
import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES, GLOSSARY_FLASHCARDS } from '../data/glossaryData';
import { EnemasterMascot } from './EnemasterMascot';

interface GlossaryViewProps {
  onAskProfessor?: (concept: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

const STORAGE_KEYS = {
  FAVORITES: 'enem_glossary_favorites_v1',
  MASTERED: 'enem_glossary_mastered_v1',
};

export const GlossaryView: React.FC<GlossaryViewProps> = ({ 
  onAskProfessor,
  onNavigateToTab
}) => {
  // Navigation / View mode: 'dicionario' | 'flashcards' | 'matriz_competencias'
  const [activeMode, setActiveMode] = useState<'dicionario' | 'flashcards' | 'matriz_competencias'>('dicionario');

  // Filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'mastered' | 'warnings'>('all');

  // Expanded card state
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Local storage persistence for Favorites & Mastered
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  const [mastered, setMastered] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MASTERED);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MASTERED, JSON.stringify(mastered));
    } catch {}
  }, [mastered]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleMastered = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMastered(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleCopyText = (id: string, text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Flashcards Interactive State
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [flashcardScores, setFlashcardScores] = useState<{ [key: string]: boolean }>({});

  // Filtered terms
  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'all' && item.difficultyLevel !== selectedDifficulty) {
        return false;
      }

      // Special status filters
      if (filterType === 'favorites' && !favorites.includes(item.id)) {
        return false;
      }
      if (filterType === 'mastered' && !mastered.includes(item.id)) {
        return false;
      }
      if (filterType === 'warnings' && !item.commonMistakeWarning) {
        return false;
      }

      // Search text filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTerm = item.term.toLowerCase().includes(q);
        const matchesShort = item.shortDefinition.toLowerCase().includes(q);
        const matchesFull = item.fullDefinition.toLowerCase().includes(q);
        const matchesAuthor = item.authorOrSource?.toLowerCase().includes(q);
        const matchesExample = item.practicalExample?.toLowerCase().includes(q);
        const matchesRepertoire = item.repertoireApplication?.toLowerCase().includes(q);
        const matchesTag = item.competencyTag?.toLowerCase().includes(q);

        return matchesTerm || matchesShort || matchesFull || matchesAuthor || matchesExample || matchesRepertoire || matchesTag;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, filterType, favorites, mastered]);

  // Flashcards count and progress
  const flashcardTotal = GLOSSARY_FLASHCARDS.length;
  const flashcardCurrent = GLOSSARY_FLASHCARDS[currentCardIndex];
  const answeredCount = Object.keys(flashcardScores).length;
  const correctCount = Object.values(flashcardScores).filter(Boolean).length;

  const handleNextFlashcard = (isKnown: boolean) => {
    setFlashcardScores(prev => ({ ...prev, [flashcardCurrent.id]: isKnown }));
    setIsCardFlipped(false);
    if (currentCardIndex < flashcardTotal - 1) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const handleResetFlashcards = () => {
    setCurrentCardIndex(0);
    setIsCardFlipped(false);
    setFlashcardScores({});
  };

  const getCategoryIcon = (catId: GlossaryCategory) => {
    switch (catId) {
      case 'geral': return ShieldCheck;
      case 'c1': return CheckCircle2;
      case 'c2': return Sparkles;
      case 'c3': return Target;
      case 'c4': return Layers;
      case 'c5': return PenTool;
      case 'filosofia_sociologia': return GraduationCap;
      case 'legislacao': return Scale;
      case 'literatura_cultura': return BookOpen;
      default: return BookMarked;
    }
  };

  const getCompetencyBadgeColor = (tag?: string) => {
    switch (tag) {
      case 'C1': return 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'C2': return 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'C3': return 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'C4': return 'bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      case 'C5': return 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default: return 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner with Mascot & Quick Stats */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/80 rounded-2xl border border-indigo-100 dark:border-indigo-900 shrink-0">
            <EnemasterMascot size="lg" variant="avatar" mood="scholar" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Glossário Oficial & Repertório Sociocultural
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-black tracking-wider uppercase shadow-2xs">
                Matriz INEP 2025
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Guia definitivo com terminologias técnicas dos corretores, regras de cada competência e conceitos filosóficos, legislativos e literários para alavancar sua <strong>Nota 1000</strong>.
            </p>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap sm:flex-nowrap">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center min-w-[76px]">
            <span className="block text-xs font-black text-indigo-600 dark:text-indigo-400">{GLOSSARY_TERMS.length}</span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Termos</span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center min-w-[76px]">
            <span className="block text-xs font-black text-emerald-600 dark:text-emerald-400">{mastered.length}</span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Dominados</span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center min-w-[76px]">
            <span className="block text-xs font-black text-amber-500 dark:text-amber-400">{favorites.length}</span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Salvos</span>
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs (Dicionário / Flashcards / Matriz das 5 Competências) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveMode('dicionario')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeMode === 'dicionario'
              ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>Enciclopédia de Termos ({filteredTerms.length})</span>
        </button>

        <button
          onClick={() => setActiveMode('flashcards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeMode === 'flashcards'
              ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Flashcards de Fixação ({flashcardTotal})</span>
        </button>

        <button
          onClick={() => setActiveMode('matriz_competencias')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeMode === 'matriz_competencias'
              ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Matriz Sintética das 5 Competências</span>
        </button>
      </div>

      {/* MODE 1: ENCICLOPÉDIA / DICIONÁRIO DE TERMOS */}
      {activeMode === 'dicionario' && (
        <div className="space-y-5 animate-fade-in">
          {/* Search & Category Filter Section */}
          <div className="bg-slate-50/90 dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 space-y-4 shadow-2xs">
            {/* Search Input and Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Pesquisar por conceito, filósofo, artigo de lei, competência ou termo INEP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-xs sm:text-sm outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-2xs transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* Status Filters: All, Favorites, Mastered, Warnings */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    filterType === 'all'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Todos
                </button>

                <button
                  onClick={() => setFilterType('favorites')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                    filterType === 'favorites'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${filterType === 'favorites' ? 'fill-white' : 'text-amber-500'}`} />
                  <span>Salvos ({favorites.length})</span>
                </button>

                <button
                  onClick={() => setFilterType('mastered')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                    filterType === 'mastered'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Dominados ({mastered.length})</span>
                </button>

                <button
                  onClick={() => setFilterType('warnings')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                    filterType === 'warnings'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  <span>Alertas de Erros</span>
                </button>
              </div>
            </div>

            {/* Categories Pills Grid */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Filtrar por Área / Competência:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {GLOSSARY_CATEGORIES.map(cat => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{cat.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Exibindo <strong>{filteredTerms.length}</strong> de {GLOSSARY_TERMS.length} conceitos
            </span>
            {(searchQuery || selectedCategory !== 'all' || filterType !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setFilterType('all');
                  setSelectedDifficulty('all');
                }}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
              >
                Resetar Filtros
              </button>
            )}
          </div>

          {/* Cards Grid */}
          {filteredTerms.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Nenhum conceito encontrado</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Tente buscar por termos mais genéricos como "Constituição", "Bauman", "Conectivos", "Crase" ou "C5".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setFilterType('all');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
              >
                Limpar Busca
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTerms.map((item) => {
                const isExpanded = expandedCardId === item.id;
                const isFav = favorites.includes(item.id);
                const isMast = mastered.includes(item.id);
                const CategoryIcon = getCategoryIcon(item.category);

                return (
                  <div
                    key={item.id}
                    className={`bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden relative shadow-2xs ${
                      isMast
                        ? 'border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/10'
                        : isExpanded
                        ? 'border-indigo-300 dark:border-indigo-700 shadow-md ring-2 ring-indigo-200 dark:ring-indigo-900/60'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Card Top Header */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Competency Tag */}
                          {item.competencyTag && (
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black border uppercase tracking-wider ${getCompetencyBadgeColor(item.competencyTag)}`}>
                              {item.competencyTag}
                            </span>
                          )}

                          {/* Difficulty Level */}
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                            item.difficultyLevel === 'Nota 1000'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                              : item.difficultyLevel === 'Avançado'
                              ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}>
                            {item.difficultyLevel}
                          </span>

                          {/* Mastered Badge */}
                          {isMast && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Dominado</span>
                            </span>
                          )}
                        </div>

                        {/* Top Right Quick Actions: Favorite & Mastered */}
                        <div className="flex items-center gap-1">
                          {/* Mark as Mastered button */}
                          <button
                            type="button"
                            onClick={(e) => toggleMastered(item.id, e)}
                            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                              isMast
                                ? 'bg-emerald-600 border-emerald-700 text-white shadow-2xs'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                            }`}
                            title={isMast ? 'Remover dos dominados' : 'Marcar como conceito dominado'}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Favorite button */}
                          <button
                            type="button"
                            onClick={(e) => toggleFavorite(item.id, e)}
                            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                              isFav
                                ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-2xs'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500'
                            }`}
                            title={isFav ? 'Remover dos favoritos' : 'Salvar para revisar'}
                          >
                            <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-slate-900' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Term Title & Author / Source */}
                      <div>
                        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                          {item.term}
                        </h2>
                        {item.authorOrSource && (
                          <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                            {item.authorOrSource}
                          </p>
                        )}
                      </div>

                      {/* Short Definition */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {item.shortDefinition}
                      </p>

                      {/* Expanded View Details */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3.5 text-xs animate-fade-in">
                          {/* Full Definition */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                              Explicação Conceitual Completa:
                            </span>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                              {item.fullDefinition}
                            </p>
                          </div>

                          {/* INEP Criteria Context */}
                          {item.inepCriteriaContext && (
                            <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 space-y-1">
                              <span className="text-[10.5px] font-black text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                <span>Como a Banca do INEP Avalia:</span>
                              </span>
                              <p className="text-[11.5px] text-blue-950 dark:text-blue-200 leading-relaxed">
                                {item.inepCriteriaContext}
                              </p>
                            </div>
                          )}

                          {/* Practical Application / Model Text */}
                          {item.practicalExample && (
                            <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 space-y-1.5 relative group">
                              <div className="flex items-center justify-between">
                                <span className="text-[10.5px] font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                  <span>Exemplo Prático na Redação:</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => handleCopyText(`ex-${item.id}`, item.practicalExample || '', e)}
                                  className="text-[10.5px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                                  title="Copiar exemplo"
                                >
                                  {copiedId === `ex-${item.id}` ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span className="text-emerald-600">Copiado!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copiar Modelo</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <p className="text-[11.5px] text-slate-800 dark:text-slate-200 italic font-medium leading-relaxed bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                                {item.practicalExample}
                              </p>
                            </div>
                          )}

                          {/* Common Mistake Warning */}
                          {item.commonMistakeWarning && (
                            <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 space-y-1">
                              <span className="text-[10.5px] font-black text-rose-900 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                <span>Alerta de Perda de Pontos (O que Evitar):</span>
                              </span>
                              <p className="text-[11.5px] text-rose-950 dark:text-rose-200 leading-relaxed">
                                {item.commonMistakeWarning}
                              </p>
                            </div>
                          )}

                          {/* Related Terms Chips */}
                          {item.relatedTerms && item.relatedTerms.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                                Conceitos Relacionados:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {item.relatedTerms.map((rt, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setSearchQuery(rt)}
                                    className="text-[10.5px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors cursor-pointer"
                                  >
                                    #{rt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Bottom Footer Controls */}
                    <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedCardId(isExpanded ? null : item.id)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Recolher detalhes' : 'Ver explicação & modelos'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {/* Consult in Professor IA Button */}
                      {onAskProfessor && (
                        <button
                          type="button"
                          onClick={() => onAskProfessor(item.term)}
                          className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                          title="Perguntar ao Professor IA sobre este conceito"
                        >
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span className="hidden sm:inline">Perguntar ao Professor IA</span>
                          <span className="sm:hidden">Professor IA</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODE 2: FLASHCARDS DE FIXAÇÃO INTERATIVOS */}
      {activeMode === 'flashcards' && (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
          {/* Progress header */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Cartão {currentCardIndex + 1} de {flashcardTotal}
              </span>
              <p className="text-sm font-black text-slate-900 dark:text-white">
                Fixação de Matriz e Repertório
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Acertos: {correctCount} / {answeredCount}
              </span>
              <button
                onClick={handleResetFlashcards}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                title="Reiniciar Desafio"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Flashcard Flip Card */}
          <div 
            onClick={() => setIsCardFlipped(!isCardFlipped)}
            className="min-h-[280px] sm:min-h-[320px] bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between relative cursor-pointer select-none shadow-lg border border-indigo-800/60 transition-transform active:scale-[0.99] group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-800/80 border border-indigo-600 text-indigo-200">
                {flashcardCurrent.category}
              </span>
              <span className="text-xs font-medium text-indigo-300 flex items-center gap-1 group-hover:text-white">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Clique para {isCardFlipped ? 'ver pergunta' : 'revelar resposta'}</span>
              </span>
            </div>

            {/* Question / Answer Content */}
            <div className="my-auto py-6">
              {isCardFlipped ? (
                <div className="space-y-2 animate-fade-in">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block">
                    Gabarito Oficial INEP / Resposta:
                  </span>
                  <p className="text-base sm:text-lg font-bold text-emerald-100 leading-relaxed">
                    {flashcardCurrent.answer}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 animate-fade-in">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 block">
                    Pergunta da Matriz:
                  </span>
                  <p className="text-lg sm:text-xl font-black text-white leading-snug">
                    {flashcardCurrent.question}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Hint */}
            <div className="text-center text-[11px] text-indigo-300 font-medium border-t border-indigo-800/60 pt-3">
              {isCardFlipped ? 'Avalie seu conhecimento abaixo:' : 'Pense na resposta e toque no cartão para conferir'}
            </div>
          </div>

          {/* Action Buttons for Know / Don't Know */}
          {isCardFlipped && (
            <div className="grid grid-cols-2 gap-3 animate-fade-in">
              <button
                type="button"
                onClick={() => handleNextFlashcard(false)}
                className="py-3 px-4 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Preciso Revisar</span>
              </button>

              <button
                type="button"
                onClick={() => handleNextFlashcard(true)}
                className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Acertei com Certeza!</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: MATRIZ SINTÉTICA DAS 5 COMPETÊNCIAS */}
      {activeMode === 'matriz_competencias' && (
        <div className="space-y-5 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Guia Rápido dos Termos Obrigatórios por Competência
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Cada competência da redação do ENEM possui exigências técnicas inegociáveis para a nota máxima (200 pontos).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {/* C1 */}
            <div className="p-5 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider">
                  Comp. 1
                </span>
                <h3 className="text-sm font-black text-emerald-950 dark:text-emerald-100">
                  Norma Culta & Sintaxe
                </h3>
                <ul className="text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5 font-medium">
                  <li>• Paralelismo sintático</li>
                  <li>• Zero truncamento</li>
                  <li>• Zero justaposição</li>
                  <li>• Crase perfeita</li>
                  <li>• Regência sem "implicar em"</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('c1');
                  setActiveMode('dicionario');
                }}
                className="w-full py-1.5 rounded-xl bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 cursor-pointer"
              >
                Ver Termos da C1
              </button>
            </div>

            {/* C2 */}
            <div className="p-5 rounded-3xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-600 text-white uppercase tracking-wider">
                  Comp. 2
                </span>
                <h3 className="text-sm font-black text-amber-950 dark:text-amber-100">
                  Repertório & Tema
                </h3>
                <ul className="text-xs text-amber-900 dark:text-amber-200 space-y-1.5 font-medium">
                  <li>• Repertório Legitimado</li>
                  <li>• Repertório Pertinente</li>
                  <li>• Repertório Produtivo</li>
                  <li>• Abordagem completa</li>
                  <li>• Evitar tangenciamento</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('c2');
                  setActiveMode('dicionario');
                }}
                className="w-full py-1.5 rounded-xl bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-700 hover:bg-amber-50 cursor-pointer"
              >
                Ver Termos da C2
              </button>
            </div>

            {/* C3 */}
            <div className="p-5 rounded-3xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-600 text-white uppercase tracking-wider">
                  Comp. 3
                </span>
                <h3 className="text-sm font-black text-purple-950 dark:text-purple-100">
                  Projeto & Argumentação
                </h3>
                <ul className="text-xs text-purple-900 dark:text-purple-200 space-y-1.5 font-medium">
                  <li>• Projeto Estratégico</li>
                  <li>• Tópico frasal nos D\'s</li>
                  <li>• Causa e Consequência</li>
                  <li>• Zero lacuna argumentativa</li>
                  <li>• Marca de autoria crítica</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('c3');
                  setActiveMode('dicionario');
                }}
                className="w-full py-1.5 rounded-xl bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-300 dark:border-purple-700 hover:bg-purple-50 cursor-pointer"
              >
                Ver Termos da C3
              </button>
            </div>

            {/* C4 */}
            <div className="p-5 rounded-3xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/60 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-cyan-600 text-white uppercase tracking-wider">
                  Comp. 4
                </span>
                <h3 className="text-sm font-black text-cyan-950 dark:text-cyan-100">
                  Coesão & Conectivos
                </h3>
                <ul className="text-xs text-cyan-900 dark:text-cyan-200 space-y-1.5 font-medium">
                  <li>• Conectivo inter no D2</li>
                  <li>• Conectivo inter na Concl.</li>
                  <li>• Conectivos intraparágrafos</li>
                  <li>• Coesão referencial rica</li>
                  <li>• Zero repetição lexical</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('c4');
                  setActiveMode('dicionario');
                }}
                className="w-full py-1.5 rounded-xl bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-300 text-xs font-bold border border-cyan-300 dark:border-cyan-700 hover:bg-cyan-50 cursor-pointer"
              >
                Ver Termos da C4
              </button>
            </div>

            {/* C5 */}
            <div className="p-5 rounded-3xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-600 text-white uppercase tracking-wider">
                  Comp. 5
                </span>
                <h3 className="text-sm font-black text-rose-950 dark:text-rose-100">
                  Proposta de Intervenção
                </h3>
                <ul className="text-xs text-rose-900 dark:text-rose-200 space-y-1.5 font-medium">
                  <li>• Agente (GOMIFES)</li>
                  <li>• Ação prática (Infinitivo)</li>
                  <li>• Modo/Meio ("por meio de")</li>
                  <li>• Efeito ("a fim de")</li>
                  <li>• Detalhamento substantivo</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('c5');
                  setActiveMode('dicionario');
                }}
                className="w-full py-1.5 rounded-xl bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-300 dark:border-rose-700 hover:bg-rose-50 cursor-pointer"
              >
                Ver Termos da C5
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
