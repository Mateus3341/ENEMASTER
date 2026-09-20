import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Dice5, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Star, 
  Bookmark, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Lightbulb, 
  RefreshCw, 
  HelpCircle,
  ExternalLink,
  Flame,
  Award
} from 'lucide-react';
import { OFFICIAL_ENEM_TIPS, OfficialTip } from '../data/officialTips';

interface EnemasterMascotProps {
  variant?: 'icon' | 'hero' | 'avatar' | 'card' | 'badge';
  mood?: 'happy' | 'scholar' | 'celebrating' | 'thinking';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeechBubble?: boolean;
  customMessage?: string;
  className?: string;
  onClick?: () => void;
}

export const EnemasterMascot: React.FC<EnemasterMascotProps> = ({
  variant = 'hero',
  mood = 'happy',
  size = 'md',
  showSpeechBubble = false,
  customMessage,
  className = '',
  onClick
}) => {
  // Dimension mapping
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32 sm:w-40 sm:h-40'
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`} onClick={onClick}>
      {/* Mascot SVG */}
      <div className={`${sizeClasses[size]} relative transition-transform duration-300 hover:scale-105`}>
        <svg 
          viewBox="0 0 120 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          {/* Defs for gradients & filters */}
          <defs>
            <linearGradient id="bodyGrad" x1="60" y1="25" x2="60" y2="105" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4338CA" />
              <stop offset="0.5" stopColor="#6366F1" />
              <stop offset="1" stopColor="#3730A3" />
            </linearGradient>

            <linearGradient id="bellyGrad" x1="60" y1="55" x2="60" y2="98" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEF08A" />
              <stop offset="1" stopColor="#FDE047" />
            </linearGradient>

            <linearGradient id="capGrad" x1="60" y1="10" x2="60" y2="35" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E1B4B" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>

            <linearGradient id="goldGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FBBF24" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>

            <linearGradient id="wingGrad" x1="0" y1="0" x2="30" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3730A3" />
              <stop offset="1" stopColor="#312E81" />
            </linearGradient>
          </defs>

          {/* Ears / Tuft Feathers */}
          <path d="M36 40 L24 22 C28 32 34 38 38 42 Z" fill="#3730A3" />
          <path d="M84 40 L96 22 C92 32 86 38 82 42 Z" fill="#3730A3" />

          {/* Body */}
          <ellipse cx="60" cy="68" rx="38" ry="36" fill="url(#bodyGrad)" />

          {/* Wings */}
          <path d="M22 60 C18 72 24 88 32 92 C28 84 26 72 26 62 Z" fill="url(#wingGrad)" />
          <path d="M98 60 C102 72 96 88 88 92 C92 84 94 72 94 62 Z" fill="url(#wingGrad)" />

          {/* Belly */}
          <ellipse cx="60" cy="74" rx="24" ry="22" fill="url(#bellyGrad)" />
          
          {/* Feather markings on belly */}
          <path d="M52 68 Q60 72 68 68" stroke="#CA8A04" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M48 76 Q60 81 72 76" stroke="#CA8A04" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M54 84 Q60 88 66 84" stroke="#CA8A04" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Big Owl Eye Patches */}
          <circle cx="45" cy="54" r="16" fill="#FFFFFF" />
          <circle cx="75" cy="54" r="16" fill="#FFFFFF" />

          {/* Eye Outline / Golden Scholarly Glasses */}
          <circle cx="45" cy="54" r="15" stroke="url(#goldGrad)" strokeWidth="3" fill="none" />
          <circle cx="75" cy="54" r="15" stroke="url(#goldGrad)" strokeWidth="3" fill="none" />
          <path d="M60 54 L60 52" stroke="url(#goldGrad)" strokeWidth="3" strokeLinecap="round" />
          <path d="M58 53 Q60 50 62 53" stroke="url(#goldGrad)" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Irises & Pupils */}
          <circle cx="46" cy="54" r="9" fill="#0F172A" />
          <circle cx="74" cy="54" r="9" fill="#0F172A" />

          {/* Eye Sparkles */}
          <circle cx="43" cy="51" r="3.5" fill="#FFFFFF" />
          <circle cx="48" cy="57" r="1.5" fill="#FFFFFF" />
          <circle cx="71" cy="51" r="3.5" fill="#FFFFFF" />
          <circle cx="76" cy="57" r="1.5" fill="#FFFFFF" />

          {/* Beak */}
          <polygon points="60,60 54,67 66,67" fill="url(#goldGrad)" />
          <polygon points="60,72 55,67 65,67" fill="#D97706" />

          {/* Cute Rosy Cheeks */}
          <ellipse cx="32" cy="62" rx="4" ry="2.5" fill="#F43F5E" opacity="0.35" />
          <ellipse cx="88" cy="62" rx="4" ry="2.5" fill="#F43F5E" opacity="0.35" />

          {/* Graduation Cap (Capelo) */}
          <g>
            {/* Cap Base */}
            <path d="M48 26 C48 24 72 24 72 26 L70 32 C70 34 50 34 50 32 Z" fill="#1E1B4B" />
            {/* Diamond Board */}
            <polygon points="60,10 94,22 60,32 26,22" fill="url(#capGrad)" stroke="#312E81" strokeWidth="1" />
            <polygon points="60,11 91,22 60,30 29,22" fill="#1E1B4B" />
            {/* Button */}
            <circle cx="60" cy="21" r="2.5" fill="url(#goldGrad)" />
            {/* Golden Tassel / Cord */}
            <path d="M60 21 Q76 22 80 32 Q82 38 84 44" stroke="#FBBF24" strokeWidth="2" fill="none" strokeLinecap="round" />
            <polygon points="84,43 81,49 87,49" fill="#F59E0B" />
          </g>

          {/* Golden Feather Quill on Wing (Mascot holding a quill) */}
          <g transform="translate(80, 52) rotate(15)">
            <path d="M4 0 C12 -6 20 -2 22 14 C16 12 12 10 6 8 L0 26 L2 6 Z" fill="url(#goldGrad)" opacity="0.95" />
            <path d="M6 0 L0 26" stroke="#B45309" strokeWidth="1" />
          </g>

          {/* Feet / Paws */}
          <ellipse cx="48" cy="103" rx="6" ry="3.5" fill="#D97706" />
          <ellipse cx="72" cy="103" rx="6" ry="3.5" fill="#D97706" />
          <circle cx="44" cy="104" r="2.5" fill="#F59E0B" />
          <circle cx="52" cy="104" r="2.5" fill="#F59E0B" />
          <circle cx="68" cy="104" r="2.5" fill="#F59E0B" />
          <circle cx="76" cy="104" r="2.5" fill="#F59E0B" />
        </svg>

        {/* Small floating sparkles badge */}
        {mood === 'celebrating' && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 text-amber-950 rounded-full flex items-center justify-center shadow-sm animate-bounce">
            <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
          </div>
        )}
      </div>

      {/* Speech Bubble / Motivational Card */}
      {showSpeechBubble && (
        <div className="ml-3 sm:ml-4 bg-white px-4 py-2.5 rounded-2xl border border-indigo-100 shadow-md shadow-indigo-100/50 text-slate-800 relative animate-fade-in max-w-xs sm:max-w-sm">
          <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-8 border-r-white"></div>
          <div className="flex items-center gap-1.5 text-indigo-600 font-extrabold text-[11px] uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Mestre Enemaster</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
            {customMessage || "Rumo à Redação Nota 1000! Treine hoje e domine as 5 competências do INEP."}
          </p>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// Interactive Floating Helper Widget - Dicas Gerais, Aleatórias e Infinitas
// =========================================================================
export const EnemasterFloatingMascot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentTip, setCurrentTip] = useState<OfficialTip>(() => {
    return OFFICIAL_ENEM_TIPS[Math.floor(Math.random() * OFFICIAL_ENEM_TIPS.length)];
  });
  
  const [allTips, setAllTips] = useState<OfficialTip[]>(() => OFFICIAL_ENEM_TIPS);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('enem_favorite_tips');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<'tips' | 'favorites'>('tips');
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Filter pool based on selected category
  const filteredTips = useMemo(() => {
    if (activeTab === 'favorites') {
      return allTips.filter(t => favorites.includes(t.id));
    }
    if (selectedCategory === 'all') return allTips;
    return allTips.filter(t => t.category === selectedCategory);
  }, [allTips, selectedCategory, activeTab, favorites]);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('enem_favorite_tips', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Handle Autoplay timer
  useEffect(() => {
    if (isAutoPlay && isOpen) {
      autoPlayRef.current = setInterval(() => {
        handleRandomTip();
      }, 12000);
    } else if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlay, isOpen, filteredTips, currentTip]);

  // Toggle favorite
  const handleToggleFavorite = (tipId: string) => {
    setFavorites(prev => 
      prev.includes(tipId) ? prev.filter(id => id !== tipId) : [...prev, tipId]
    );
  };

  // Pick a random tip from current category
  const handleRandomTip = () => {
    if (filteredTips.length === 0) return;
    const available = filteredTips.filter(t => t.id !== currentTip.id);
    const chosen = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : filteredTips[0];
    setCurrentTip(chosen);
    // Stop speech if speaking
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Sequential Next Tip
  const handleNextTip = () => {
    if (filteredTips.length === 0) return;
    const currentIndex = filteredTips.findIndex(t => t.id === currentTip.id);
    const nextIndex = (currentIndex + 1) % filteredTips.length;
    setCurrentTip(filteredTips[nextIndex]);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Sequential Previous Tip
  const handlePrevTip = () => {
    if (filteredTips.length === 0) return;
    const currentIndex = filteredTips.findIndex(t => t.id === currentTip.id);
    const prevIndex = (currentIndex - 1 + filteredTips.length) % filteredTips.length;
    setCurrentTip(filteredTips[prevIndex]);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Generate a brand new, infinite AI Tip based on official documents
  const handleGenerateAiTip = async () => {
    setIsGeneratingAi(true);
    try {
      const response = await fetch('/api/generate-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          currentTipId: currentTip.id
        })
      });

      if (response.ok) {
        const newTip: OfficialTip = await response.json();
        setAllTips(prev => [newTip, ...prev.filter(t => t.id !== newTip.id)]);
        setCurrentTip(newTip);
      } else {
        handleRandomTip();
      }
    } catch (err) {
      console.warn('Fallback to curated database tip on AI generation failure:', err);
      handleRandomTip();
    } finally {
      setIsGeneratingAi(false);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Text-To-Speech for audio tip listening
  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `Dica de ${currentTip.categoryLabel}. ${currentTip.title}. ${currentTip.highlightText}. ${currentTip.explanation}. ${currentTip.keyTakeaway}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Copy Tip to clipboard
  const handleCopyTip = () => {
    const fullText = `💡 [${currentTip.categoryLabel}] ${currentTip.title}\n📜 Fonte: ${currentTip.sourceDoc}\n\n👉 Regra: ${currentTip.highlightText}\n\n📝 Explicação: ${currentTip.explanation}\n\n⭐ Conselho: ${currentTip.keyTakeaway}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCurrentFavorite = favorites.includes(currentTip.id);

  const categories = [
    { id: 'all', label: 'Todas as Dicas', icon: '✨' },
    { id: 'c1', label: 'C1: Gramática & Sintaxe', icon: '✍️' },
    { id: 'c2', label: 'C2: Repertórios & Tema', icon: '🏛️' },
    { id: 'c3', label: 'C3: Projeto de Texto', icon: '🎯' },
    { id: 'c4', label: 'C4: Coesão & Conectivos', icon: '🔗' },
    { id: 'c5', label: 'C5: Proposta (5 Elementos)', icon: '⭐' },
    { id: 'nota1000', label: 'Segredos Nota 1000', icon: '💎' },
    { id: 'repertorio_express', label: 'Repertório Express', icon: '⚡' },
    { id: 'armadilhas', label: 'Armadilhas Fatais', icon: '🛑' }
  ];

  return (
    <div className="fixed bottom-20 right-3.5 sm:bottom-6 sm:right-6 z-45 select-none">
      {/* Tip Dialog Card Modal */}
      {isOpen && (
        <div className="mb-3 w-[92vw] sm:w-[440px] max-h-[85vh] flex flex-col bg-white/98 backdrop-blur-xl rounded-3xl border border-indigo-200/90 shadow-2xl shadow-indigo-900/20 text-slate-800 animate-fade-in overflow-hidden">
          
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 p-4 text-white flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-1 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                <EnemasterMascot size="sm" variant="avatar" mood="scholar" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black tracking-tight text-white flex items-center gap-1">
                    <span>Mestre Enemaster</span>
                  </h3>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400 text-indigo-950 font-black tracking-wider uppercase shadow-xs">
                    INEP Oficial
                  </span>
                </div>
                <p className="text-[11px] text-indigo-200 font-medium">Dicas Oficiais, Aleatórias & Infinitas</p>
              </div>
            </div>

            <div className="flex items-center gap-1 relative z-10">
              {/* Text-to-speech button */}
              <button
                onClick={handleToggleSpeak}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  isSpeaking ? 'bg-amber-400 text-indigo-950 animate-pulse' : 'text-indigo-200 hover:text-white hover:bg-white/10'
                }`}
                title={isSpeaking ? 'Pausar áudio' : 'Ouvir dica com voz'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button 
                onClick={() => {
                  setIsOpen(false);
                  if (window.speechSynthesis) window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }}
                className="p-1.5 rounded-full text-indigo-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Fechar dicas"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-tabs: Dicas vs Favoritas */}
          <div className="bg-slate-100/90 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-xl">
              <button
                onClick={() => setActiveTab('tips')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
                  activeTab === 'tips'
                    ? 'bg-white text-indigo-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Explorar Dicas ({allTips.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('favorites');
                  if (favorites.length > 0) {
                    const firstFav = allTips.find(t => t.id === favorites[0]);
                    if (firstFav) setCurrentTip(firstFav);
                  }
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
                  activeTab === 'favorites'
                    ? 'bg-white text-amber-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${favorites.length > 0 ? 'text-amber-500 fill-amber-400' : ''}`} />
                <span>Favoritas ({favorites.length})</span>
              </button>
            </div>

            {/* Autoplay Toggle */}
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                isAutoPlay 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-white text-slate-500 border-slate-200 hover:text-slate-700'
              }`}
              title="Trocar dicas automaticamente a cada 12 segundos"
            >
              {isAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isAutoPlay ? 'Auto-Play ON' : 'Auto'}</span>
            </button>
          </div>

          {/* Category Filter Horizontal Scroll */}
          {activeTab === 'tips' && (
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200/80 overflow-x-auto no-scrollbar flex items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    const matching = cat.id === 'all' 
                      ? allTips 
                      : allTips.filter(t => t.category === cat.id);
                    if (matching.length > 0) {
                      setCurrentTip(matching[0]);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200/70'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Scrollable Tip Content Area */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-800">
            {activeTab === 'favorites' && favorites.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <Star className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-xs font-bold text-slate-700">Nenhuma dica favoritada</h4>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Clique no ícone de estrela nas dicas para salvá-las e revisá-las antes de escrever sua redação.
                </p>
              </div>
            ) : (
              <>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${currentTip.badgeColor} flex items-center gap-1 shadow-2xs`}>
                    <span>{currentTip.icon}</span>
                    <span>{currentTip.categoryLabel}</span>
                  </span>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
                      {currentTip.sourceDoc}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                    {currentTip.title}
                  </h3>
                </div>

                {/* Highlight Quote Box */}
                <div className="bg-gradient-to-r from-indigo-50/90 to-purple-50/70 border-l-4 border-indigo-600 p-3 rounded-r-2xl shadow-2xs">
                  <p className="text-xs sm:text-sm font-bold text-indigo-950 leading-relaxed">
                    "{currentTip.highlightText}"
                  </p>
                </div>

                {/* Deep Explanation */}
                <div className="space-y-1">
                  <h5 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Critério Técnico do Avaliador</span>
                  </h5>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentTip.explanation}
                  </p>
                </div>

                {/* Practical Example (Before & After) */}
                {currentTip.practicalExample && (
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 space-y-2 text-xs">
                    <div className="text-[11px] font-black text-slate-800 uppercase tracking-wider flex items-center justify-between">
                      <span>Exemplo de Aplicação Prática</span>
                      <span className="text-[9px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-bold">Matriz INEP</span>
                    </div>

                    {currentTip.practicalExample.incorrect && (
                      <div className="bg-rose-50/80 border border-rose-200/80 p-2 rounded-xl text-rose-900 space-y-0.5">
                        <span className="text-[10px] font-black text-rose-700 uppercase flex items-center gap-1">
                          <span>❌ Evite (Desvio / Perda de Nota)</span>
                        </span>
                        <p className="font-mono text-[11px] italic">{currentTip.practicalExample.incorrect}</p>
                      </div>
                    )}

                    <div className="bg-emerald-50/80 border border-emerald-200/80 p-2 rounded-xl text-emerald-950 space-y-0.5">
                      <span className="text-[10px] font-black text-emerald-700 uppercase flex items-center gap-1">
                        <span>✅ Padrão Nota 1000 (Recomendado)</span>
                      </span>
                      <p className="font-mono text-[11px] font-medium">{currentTip.practicalExample.correct}</p>
                    </div>

                    <p className="text-[10.5px] text-slate-500 pt-0.5">
                      <strong className="text-slate-700">Por quê:</strong> {currentTip.practicalExample.why}
                    </p>
                  </div>
                )}

                {/* Repertoire Bonus Box */}
                {currentTip.repertoireBonus && (
                  <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-2xl p-3.5 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Repertório C2 Homologado</span>
                      </div>
                      <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full text-indigo-200 font-bold">
                        {currentTip.repertoireBonus.author}
                      </span>
                    </div>
                    <p className="text-[11px] text-indigo-100 italic">
                      {currentTip.repertoireBonus.application}
                    </p>
                  </div>
                )}

                {/* Key Takeaway */}
                <div className="bg-amber-50/80 border border-amber-200/80 p-2.5 rounded-2xl flex items-start gap-2 text-xs text-amber-950">
                  <Flame className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-[11px] block text-amber-900">Conselho de Ouro:</span>
                    <span className="text-[11.5px] text-amber-900 leading-snug">{currentTip.keyTakeaway}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Footer & Navigation Toolbar */}
          <div className="p-3 sm:p-4 bg-slate-100/90 border-t border-slate-200 space-y-2.5">
            {/* Primary Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              {/* Random Tip Button */}
              <button
                id="enemaster-random-tip-btn"
                onClick={handleRandomTip}
                className="py-2 px-3 bg-white hover:bg-slate-50 text-indigo-950 font-bold text-xs rounded-2xl border border-indigo-200 shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                title="Sortear outra dica aleatória da base oficial"
              >
                <Dice5 className="w-4 h-4 text-indigo-600" />
                <span>Dica Aleatória</span>
              </button>

              {/* AI Infinite Tip Button */}
              <button
                id="enemaster-ai-infinite-tip-btn"
                onClick={handleGenerateAiTip}
                disabled={isGeneratingAi}
                className="py-2 px-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs rounded-2xl shadow-sm shadow-indigo-500/20 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                title="Gerar uma dica inédita e exclusiva em tempo real com IA"
              >
                {isGeneratingAi ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Gerando...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Dica Inédita (IA)</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Tools & Stepper */}
            <div className="flex items-center justify-between pt-0.5 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                {/* Previous */}
                <button
                  onClick={handlePrevTip}
                  className="p-1.5 rounded-xl bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Dica anterior"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Next */}
                <button
                  onClick={handleNextTip}
                  className="p-1.5 rounded-xl bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Próxima dica"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <span className="text-[10px] font-bold text-slate-400 ml-1">
                  {filteredTips.findIndex(t => t.id === currentTip.id) + 1} de {filteredTips.length}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Favorite */}
                <button
                  onClick={() => handleToggleFavorite(currentTip.id)}
                  className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                    isCurrentFavorite
                      ? 'bg-amber-50 border-amber-300 text-amber-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                  title={isCurrentFavorite ? 'Remover dos favoritos' : 'Favoritar dica'}
                >
                  <Star className={`w-3.5 h-3.5 ${isCurrentFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                </button>

                {/* Copy */}
                <button
                  onClick={handleCopyTip}
                  className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Copiar dica completa"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[10px] text-emerald-700 font-bold">Copiado!</span>
                    </>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Mascot Button */}
      <button
        id="enemaster-floating-mascot-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center p-2 bg-white hover:bg-slate-50 rounded-full border-2 border-indigo-300 hover:border-indigo-500 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
        title="Dicas Oficiais, Aleatórias e Infinitas de Redação"
      >
        <EnemasterMascot size="md" variant="avatar" mood={isOpen ? 'celebrating' : 'scholar'} />
        
        {/* Active glowing badge */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white items-center justify-center text-[8px] font-black text-amber-950">
            💡
          </span>
        </span>
      </button>
    </div>
  );
};
