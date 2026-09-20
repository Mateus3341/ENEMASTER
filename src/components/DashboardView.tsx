import React, { useMemo } from 'react';
import { 
  PenTool, 
  Sparkles, 
  BookOpen, 
  BarChart3, 
  Award, 
  GraduationCap, 
  Target, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Flame,
  ShieldCheck,
  Library,
  BookCheck,
  Calendar,
  Compass,
  Zap,
  Trophy
} from 'lucide-react';
import { EssayCorrectionResult } from '../types';
import { HISTORICAL_THEMES } from '../data/officialData';
import { calculateAchievements } from '../data/achievements';
import { InteractiveCompetencyGuide } from './InteractiveCompetencyGuide';
import { WelcomeOnboardingCard } from './WelcomeOnboardingCard';
import { WeeklyGoalProgressBar } from './WeeklyGoalProgressBar';
import { DashboardSkeleton } from './SavedDataSkeleton';

interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
  savedEssays: EssayCorrectionResult[];
  onSelectThemeForCorrection: (theme: string) => void;
  isLoading?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  setActiveTab, 
  savedEssays, 
  onSelectThemeForCorrection,
  isLoading = false
}) => {
  // Badges Calculation
  const badges = useMemo(() => calculateAchievements(savedEssays), [savedEssays]);
  const unlockedBadges = badges.filter(b => b.isUnlocked);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Compute Stats
  const totalEssays = savedEssays.length;

  const avgScore = totalEssays > 0 
    ? Math.round(savedEssays.reduce((acc, curr) => acc + curr.totalScore, 0) / totalEssays) 
    : 0;
  const maxScore = totalEssays > 0 
    ? Math.max(...savedEssays.map(e => e.totalScore)) 
    : 0;

  // Compute strongest & weakest competencies or default baseline
  let compAverages = { 
    c1: totalEssays > 0 ? 0 : 0, 
    c2: totalEssays > 0 ? 0 : 0, 
    c3: totalEssays > 0 ? 0 : 0, 
    c4: totalEssays > 0 ? 0 : 0, 
    c5: totalEssays > 0 ? 0 : 0 
  };

  if (totalEssays > 0) {
    compAverages = { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0 };
    savedEssays.forEach(e => {
      compAverages.c1 += e.competencies.c1.score;
      compAverages.c2 += e.competencies.c2.score;
      compAverages.c3 += e.competencies.c3.score;
      compAverages.c4 += e.competencies.c4.score;
      compAverages.c5 += e.competencies.c5.score;
    });
    compAverages.c1 = Math.round(compAverages.c1 / totalEssays);
    compAverages.c2 = Math.round(compAverages.c2 / totalEssays);
    compAverages.c3 = Math.round(compAverages.c3 / totalEssays);
    compAverages.c4 = Math.round(compAverages.c4 / totalEssays);
    compAverages.c5 = Math.round(compAverages.c5 / totalEssays);
  }

  // Calculate gauge circle stroke
  const strokeDashoffset = totalEssays > 0 ? 440 - (440 * (avgScore / 1000)) : 440;

  // Last feedback snippet
  const lastFeedback = totalEssays > 0 && savedEssays[0].top3Problems && savedEssays[0].top3Problems.length > 0
    ? `"${savedEssays[0].top3Problems[0]}"`
    : '"Faça o upload ou digite seu 1º texto na aba Corretor para desbloquear o diagnóstico detalhado por competência!"';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-14">
      {/* Onboarding Welcome Card only when user has 0 essays */}
      {totalEssays === 0 && (
        <WelcomeOnboardingCard 
          setActiveTab={setActiveTab}
          onSelectThemeForCorrection={onSelectThemeForCorrection}
        />
      )}

      {/* Weekly Goal Progress Bar */}
      <WeeklyGoalProgressBar 
        savedEssays={savedEssays}
        setActiveTab={setActiveTab}
      />

      {/* Bento Grid Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
        
        {/* Bento Box 1: Circular Score Gauge */}
        <div className="md:col-span-6 lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-between text-center min-h-0 sm:min-h-[380px] transition-colors">
          <div className="w-full flex justify-between items-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <span>Diagnóstico Geral</span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border border-transparent dark:border-slate-700">
              INEP 2025
            </span>
          </div>

          <div className="relative my-3 sm:my-4">
            <svg viewBox="0 0 160 160" className="w-32 h-32 sm:w-40 sm:h-40 transform -rotate-90">
              <circle 
                cx="80" 
                cy="80" 
                r="70" 
                stroke="currentColor" 
                strokeWidth="10" 
                fill="transparent" 
                className="text-slate-100 dark:text-slate-800"
              />
              <circle 
                cx="80" 
                cy="80" 
                r="70" 
                stroke="currentColor" 
                strokeWidth="10" 
                fill="transparent" 
                strokeDasharray="440" 
                strokeDashoffset={strokeDashoffset} 
                strokeLinecap="round"
                className="text-indigo-600 dark:text-indigo-400 transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{avgScore}</span>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Média Geral</span>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              {avgScore >= 900 ? 'Nível Excelente (900+)' : avgScore >= 800 ? 'Muito Bom Desempenho' : 'Em Desenvolvimento'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              {totalEssays > 0 
                ? `Baseado em ${totalEssays} redação(ões) analisadas com a matriz oficial.`
                : 'Foque nas Competências C3 e C5 para atingir os 1000 pontos.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full mt-3 sm:mt-4">
            <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-700/80 text-left">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Redações</p>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{totalEssays > 0 ? totalEssays : 0}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-700/80 text-left">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Maior Nota</p>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{maxScore > 0 ? `${maxScore} pts` : '--'}</p>
            </div>
          </div>
        </div>

        {/* Bento Box 2: Featured Indigo Action Card */}
        <div className="md:col-span-6 lg:col-span-5 bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-900 dark:to-indigo-950 rounded-2xl sm:rounded-[2rem] p-4.5 sm:p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-xs border border-transparent dark:border-indigo-800/60 min-h-0 sm:min-h-[380px]">
          <div className="relative z-10 space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/40 dark:bg-indigo-800/60 text-indigo-100 text-xs font-semibold backdrop-blur-xs border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Inteligência Artificial Pedagógica</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">Inicie sua Prática</h2>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed max-w-sm">
              Envie seu texto para correção instantânea nas 5 competências do INEP ou gere redações completas de alto nível.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:gap-2.5 relative z-10 mt-4 sm:mt-5">
            <button 
              id="bento-btn-generate-theme"
              onClick={() => setActiveTab('themes')}
              className="w-full py-2.5 sm:py-3 px-3.5 sm:px-4 bg-white/95 text-indigo-900 hover:bg-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-sm transition-transform active:scale-[0.99] cursor-pointer"
            >
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>Gerador de Temas INEP (Novo)</span>
            </button>

            <button 
              id="bento-btn-correct"
              onClick={() => setActiveTab('correction')}
              className="w-full py-2.5 sm:py-3 px-3.5 sm:px-4 bg-indigo-500/80 hover:bg-indigo-500 dark:bg-indigo-700/80 dark:hover:bg-indigo-700 text-white border border-indigo-400/50 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-sm transition-transform active:scale-[0.99] cursor-pointer"
            >
              <PenTool className="w-4 h-4 text-indigo-200" />
              <span>Corrigir Redação (Texto / Foto)</span>
            </button>

            <button 
              id="bento-btn-create"
              onClick={() => setActiveTab('creation')}
              className="w-full py-2.5 sm:py-3 px-3.5 sm:px-4 bg-indigo-700/80 hover:bg-indigo-700 dark:bg-indigo-800/80 dark:hover:bg-indigo-800 text-white border border-indigo-500/50 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-transform active:scale-[0.99] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Criador de Redações Nota 1000</span>
            </button>
          </div>

          {/* Decorative soft circles */}
          <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-indigo-400 dark:bg-indigo-600 rounded-full opacity-20 pointer-events-none"></div>
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-indigo-300 dark:bg-indigo-500 rounded-full opacity-10 pointer-events-none"></div>
        </div>

        {/* Bento Box 3: Temporal Evolution & Feedback */}
        <div className="md:col-span-12 lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col justify-between min-h-0 sm:min-h-[380px] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Evolução Temporal</h3>
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-end gap-2 h-28 px-1">
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-lg transition-all" style={{ height: '60%' }}></div>
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-lg transition-all" style={{ height: '72%' }}></div>
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-lg transition-all" style={{ height: '65%' }}></div>
                <div className="flex-1 bg-indigo-200 dark:bg-indigo-900/60 rounded-t-lg transition-all" style={{ height: '85%' }}></div>
                <div className="flex-1 bg-indigo-600 dark:bg-indigo-500 rounded-t-lg transition-all" style={{ height: '94%' }}></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 px-1">
                <span>SIM 1</span>
                <span>SIM 2</span>
                <span>SIM 3</span>
                <span>SIM 4</span>
                <span className="text-indigo-600 dark:text-indigo-400">ATUAL</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>Último Diagnóstico:</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-3 font-serif">
              {lastFeedback}
            </p>
            <button 
              onClick={() => setActiveTab('evolution')}
              className="mt-3 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Ver histórico completo</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Bento Box 4: Performance by Competency */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2rem] p-4 sm:p-7 shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-5">
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Desempenho por Competência</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Critérios oficiais de 0 a 200 pontos</p>
            </div>
            <span className="self-start sm:self-auto text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 px-3 py-1 rounded-full">
              Matriz INEP
            </span>
          </div>

          <div className="space-y-4">
            {/* C1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-bold">
                <span className="text-slate-800 dark:text-slate-200">C1: Domínio da Norma Escrita</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{compAverages.c1}/200</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-700" 
                  style={{ width: `${(compAverages.c1 / 200) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* C2 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-bold">
                <span className="text-slate-800 dark:text-slate-200">C2: Compreensão do Tema & Repertório</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{compAverages.c2}/200</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
                  style={{ width: `${(compAverages.c2 / 200) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* C3 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-bold">
                <span className="text-slate-800 dark:text-slate-200">C3: Projeto de Texto & Autoria</span>
                <span className={`${compAverages.c3 < 160 ? 'text-amber-600 dark:text-amber-400' : 'text-indigo-600 dark:text-indigo-400'} font-extrabold`}>
                  {compAverages.c3}/200
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${compAverages.c3 < 160 ? 'bg-amber-500' : 'bg-indigo-600 dark:bg-indigo-500'} rounded-full transition-all duration-700`}
                  style={{ width: `${(compAverages.c3 / 200) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* C4 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-bold">
                <span className="text-slate-800 dark:text-slate-200">C4: Coesão & Conectivos</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{compAverages.c4}/200</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-700" 
                  style={{ width: `${(compAverages.c4 / 200) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* C5 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-bold">
                <span className="text-slate-800 dark:text-slate-200">C5: Proposta de Intervenção (5 Elementos)</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{compAverages.c5}/200</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-700" 
                  style={{ width: `${(compAverages.c5 / 200) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Módulos com pontuação abaixo de 160 requerem treino de reescrita.</span>
            <button 
              onClick={() => setActiveTab('study')}
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Guia das Competências</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Bento Box 5: Knowledge Base & Quick Access */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-7 shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-colors">
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Base de Conhecimento</h3>
            
            <div className="space-y-3">
              <div 
                id="kb-item-badges"
                onClick={() => setActiveTab('evolution')}
                className="p-3 bg-amber-500/10 dark:bg-amber-950/40 hover:bg-amber-500/20 dark:hover:bg-amber-900/40 rounded-2xl border border-amber-300/60 dark:border-amber-700/60 hover:border-amber-400 flex items-center gap-3 cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold text-base group-hover:scale-105 transition-transform shadow-xs">
                  <Trophy className="w-5 h-5 text-amber-100" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200 group-hover:text-amber-900">Medalhas de Conquista</p>
                    <span className="text-[10px] font-black bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-1.5 py-0.2 rounded-full">
                      {unlockedBadges.length}/{badges.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-amber-800 dark:text-amber-400 uppercase font-semibold">Conquistas e marcos de escrita</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 group-hover:text-amber-800 transition-transform group-hover:translate-x-0.5" />
              </div>

              <div 
                id="kb-item-glossary"
                onClick={() => setActiveTab('glossary')}
                className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50/50 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 hover:border-indigo-200 flex items-center gap-3 cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-xl flex items-center justify-center font-bold text-base group-hover:scale-105 transition-transform">
                  📚
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-900 dark:group-hover:text-indigo-300">Glossário & Repertório</p>
                    <span className="text-[9px] font-black px-1.5 py-0.2 bg-indigo-600 text-white rounded-md uppercase">Novo</span>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Terminologias do INEP e Repertórios</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
              </div>

              <div 
                id="kb-item-examples"
                onClick={() => setActiveTab('examples')}
                className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-amber-50/50 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 hover:border-amber-200 flex items-center gap-3 cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-xl flex items-center justify-center font-black text-lg group-hover:scale-105 transition-transform">
                  ★
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-900 dark:group-hover:text-amber-300">Redações Nota 1000</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Exemplos reais comentados</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-amber-600 transition-transform group-hover:translate-x-0.5" />
              </div>

              <div 
                id="kb-item-study"
                onClick={() => setActiveTab('study')}
                className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50/50 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 hover:border-indigo-200 flex items-center gap-3 cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-xl flex items-center justify-center font-bold text-base group-hover:scale-105 transition-transform">
                  §
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-900 dark:group-hover:text-indigo-300">Cartilha do Participante</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Critérios e Níveis 0 a 5</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
              </div>

              <div 
                id="kb-item-themes"
                onClick={() => setActiveTab('themes')}
                className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-purple-50/50 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 hover:border-purple-200 flex items-center gap-3 cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-xl flex items-center justify-center font-bold text-base group-hover:scale-105 transition-transform">
                  🧭
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-900 dark:group-hover:text-purple-300">Gerador de Temas INEP</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Propostas inéditas & Coletâneas</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-purple-600 transition-transform group-hover:translate-x-0.5" />
              </div>

              <div 
                id="kb-item-practice"
                onClick={() => setActiveTab('practice')}
                className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50/50 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 hover:border-emerald-200 flex items-center gap-3 cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl flex items-center justify-center font-bold text-base group-hover:scale-105 transition-transform">
                  🎯
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-900 dark:group-hover:text-emerald-300">Treino de Trechos</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Diagnóstico de falhas sintáticas</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('study')}
            className="mt-4 w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-2xl font-bold text-xs transition-colors cursor-pointer"
          >
            Acessar Biblioteca Pedagógica
          </button>
        </div>
      </div>

      {/* Interactive Step-by-Step 5 Competencies Guide with Mestre Corujito */}
      <InteractiveCompetencyGuide 
        onNavigateToStudy={() => setActiveTab('study')}
        onNavigateToPractice={() => setActiveTab('study')}
        onNavigateToCorrection={() => setActiveTab('correction')}
        currentScores={{
          c1: compAverages.c1,
          c2: compAverages.c2,
          c3: compAverages.c3,
          c4: compAverages.c4,
          c5: compAverages.c5
        }}
      />

      {/* Bento Grid Third Row: Historical Themes */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Temas Oficiais do ENEM (2018–2025)</h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[10px] font-black">
                Inclui 2025
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Selecione um tema para carregar diretamente no Corretor ou no Criador de Redações</p>
          </div>
          <button 
            onClick={() => {
              onSelectThemeForCorrection('');
              setActiveTab('correction');
            }} 
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 inline-flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Usar tema livre</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {HISTORICAL_THEMES.slice(0, 8).map((theme) => (
            <div
              key={theme.year}
              id={`theme-preset-card-${theme.year}`}
              onClick={() => {
                onSelectThemeForCorrection(theme.title);
                setActiveTab('correction');
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                theme.year === '2025' 
                  ? 'border-indigo-300 dark:border-indigo-700 bg-gradient-to-b from-indigo-50/80 to-white dark:from-indigo-950/50 dark:to-slate-800/90 shadow-2xs hover:border-indigo-500 ring-1 ring-indigo-200 dark:ring-indigo-800'
                  : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 hover:bg-indigo-50/60 dark:hover:bg-slate-750 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full transition-colors ${
                    theme.year === '2025'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200/80 text-slate-800 dark:bg-slate-700 dark:text-slate-200 group-hover:bg-indigo-600 group-hover:text-white'
                  }`}>
                    ENEM {theme.year}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Escrever &rarr;
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-indigo-950 dark:group-hover:text-indigo-200">
                  {theme.title}
                </p>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-1 border-t border-slate-200/40 dark:border-slate-700/40 pt-1.5">
                Eixo: {theme.axis}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
