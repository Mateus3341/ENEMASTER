import React, { useState, useMemo } from 'react';
import { 
  BookCheck, 
  TrendingUp, 
  Award, 
  Trash2, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  BarChart3,
  PenTool,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Trophy,
  History,
  FileText,
  Eye
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { EssayCorrectionResult } from '../types';
import { StudentBadgesSection } from './StudentBadgesSection';
import { calculateAchievements } from '../data/achievements';
import { useAuth } from '../contexts/AuthContext';
import { Cloud, ShieldCheck } from 'lucide-react';
import { EvolutionSkeleton } from './SavedDataSkeleton';
import { EssayReaderModal } from './EssayReaderModal';

interface StudentEvolutionViewProps {
  savedEssays: EssayCorrectionResult[];
  onSelectEssay: (essay: EssayCorrectionResult) => void;
  onDeleteEssay: (id: string) => void;
  onStartNewEssay: () => void;
  isLoading?: boolean;
}

type ChartViewMode = 'total' | 'competencies';
type EvolutionTab = 'overview' | 'badges' | 'history';

export const StudentEvolutionView: React.FC<StudentEvolutionViewProps> = ({ 
  savedEssays, 
  onSelectEssay, 
  onDeleteEssay,
  onStartNewEssay,
  isLoading = false
}) => {
  if (isLoading) {
    return <EvolutionSkeleton onStartNewEssay={onStartNewEssay} />;
  }

  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<EvolutionTab>('overview');
  const [chartMode, setChartMode] = useState<ChartViewMode>('total');
  const [viewingEssayModal, setViewingEssayModal] = useState<EssayCorrectionResult | null>(null);
  const total = savedEssays.length;

  const badges = useMemo(() => calculateAchievements(savedEssays), [savedEssays]);
  const unlockedBadgesCount = badges.filter(b => b.isUnlocked).length;

  // Prepare chronological data for Recharts (Oldest -> Newest)
  const chartData = useMemo(() => {
    // Clone and reverse so chronologically oldest is on the left, newest on the right
    const chronological = [...savedEssays].reverse();
    return chronological.map((essay, index) => ({
      index: index + 1,
      id: essay.id,
      label: `Redação #${index + 1}`,
      date: essay.date || 'Recente',
      theme: essay.theme,
      totalScore: essay.totalScore,
      c1: essay.competencies?.c1?.score ?? 0,
      c2: essay.competencies?.c2?.score ?? 0,
      c3: essay.competencies?.c3?.score ?? 0,
      c4: essay.competencies?.c4?.score ?? 0,
      c5: essay.competencies?.c5?.score ?? 0,
      essayRef: essay
    }));
  }, [savedEssays]);

  // Statistics calculation
  const stats = useMemo(() => {
    if (savedEssays.length === 0) return null;

    const scores = savedEssays.map(e => e.totalScore);
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const average = Math.round(scores.reduce((acc, s) => acc + s, 0) / scores.length);

    // First essay vs Latest essay
    const firstScore = savedEssays[savedEssays.length - 1].totalScore;
    const latestScore = savedEssays[0].totalScore;
    const diff = latestScore - firstScore;

    // Competency averages
    const compAverages = {
      c1: Math.round(savedEssays.reduce((acc, e) => acc + (e.competencies?.c1?.score ?? 0), 0) / savedEssays.length),
      c2: Math.round(savedEssays.reduce((acc, e) => acc + (e.competencies?.c2?.score ?? 0), 0) / savedEssays.length),
      c3: Math.round(savedEssays.reduce((acc, e) => acc + (e.competencies?.c3?.score ?? 0), 0) / savedEssays.length),
      c4: Math.round(savedEssays.reduce((acc, e) => acc + (e.competencies?.c4?.score ?? 0), 0) / savedEssays.length),
      c5: Math.round(savedEssays.reduce((acc, e) => acc + (e.competencies?.c5?.score ?? 0), 0) / savedEssays.length),
    };

    const compNames: Record<string, string> = {
      c1: 'C1 (Norma Culta)',
      c2: 'C2 (Repertório)',
      c3: 'C3 (Projeto de Texto)',
      c4: 'C4 (Coesão)',
      c5: 'C5 (Proposta de Intervenção)'
    };

    const sortedComps = Object.entries(compAverages).sort((a, b) => b[1] - a[1]);
    const bestComp = { key: sortedComps[0][0], name: compNames[sortedComps[0][0]], avg: sortedComps[0][1] };
    const worstComp = { key: sortedComps[sortedComps.length - 1][0], name: compNames[sortedComps[sortedComps.length - 1][0]], avg: sortedComps[sortedComps.length - 1][1] };

    return {
      highest,
      lowest,
      average,
      firstScore,
      latestScore,
      diff,
      compAverages,
      bestComp,
      worstComp
    };
  }, [savedEssays]);

  // Aggregate problems across all essays
  const frequentProblems = useMemo(() => {
    const counts: Record<string, number> = {};
    savedEssays.forEach(e => {
      e.top3Problems?.forEach(p => {
        if (p && p.trim()) {
          counts[p] = (counts[p] || 0) + 1;
        }
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [savedEssays]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
              <BookCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Perfil & Evolução do Estudante
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Acompanhe o histórico de notas, tendências por competência e galeria de medalhas de conquista.
            </p>
            {user ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <Cloud className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Sincronizado na Nuvem ({user.email || 'Conta Conectada'})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <ShieldCheck className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                Modo Local (Faça login para sincronizar no celular e PC)
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onStartNewEssay}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <PenTool className="w-4 h-4" />
          <span>Corrigir Nova Redação</span>
        </button>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Visão Geral & Gráficos</span>
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'badges'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Medalhas de Conquista</span>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
            activeTab === 'badges' ? 'bg-amber-800 text-white' : 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200'
          }`}>
            {unlockedBadgesCount}/{badges.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Histórico de Redações ({total})</span>
        </button>
      </div>

      {/* Tab 2: Badges Gallery */}
      {activeTab === 'badges' && (
        <StudentBadgesSection savedEssays={savedEssays} />
      )}

      {/* Tab 3: History list */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Histórico Completo de Redações Salvas</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total: {total} {total === 1 ? 'redação' : 'redações'}</span>
          </div>

          {total === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <PenTool className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nenhuma redação avaliada ainda</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Envie sua primeira redação no Corretor para construir seu histórico e desbloquear medalhas.
                </p>
              </div>
              <button
                onClick={onStartNewEssay}
                className="px-6 py-3 rounded-xl font-bold text-xs bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white transition-colors cursor-pointer shadow-xs"
              >
                Começar Agora
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedEssays.map((essay, idx) => (
                <div
                  key={essay.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {essay.date} • #{total - idx}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${
                        essay.totalScore >= 900 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' :
                        essay.totalScore >= 800 ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300' :
                        essay.totalScore >= 640 ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                      }`}>
                        {essay.totalScore} / 1000
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {essay.theme}
                    </h4>

                    {/* Competency small badges */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-100 dark:border-blue-900">
                        C1: {essay.competencies?.c1?.score ?? 0}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-100 dark:border-emerald-900">
                        C2: {essay.competencies?.c2?.score ?? 0}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold border border-amber-100 dark:border-amber-900">
                        C3: {essay.competencies?.c3?.score ?? 0}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold border border-purple-100 dark:border-purple-900">
                        C4: {essay.competencies?.c4?.score ?? 0}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 font-bold border border-pink-100 dark:border-pink-900">
                        C5: {essay.competencies?.c5?.score ?? 0}
                      </span>
                    </div>

                    {essay.essayText ? (
                      <div 
                        onClick={() => setViewingEssayModal(essay)}
                        className="cursor-pointer group/snippet bg-slate-50/70 dark:bg-slate-800/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                        title="Clique para ler a redação completa"
                      >
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 font-serif italic">
                          "{essay.essayText.substring(0, 150)}..."
                        </p>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 group-hover/snippet:underline mt-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ler redação completa</span>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setViewingEssayModal(essay)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>Ler Redação</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectEssay(essay)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Relatório Completo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteEssay(essay.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                      title="Excluir do histórico"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 1: Overview & Charts */}
      {activeTab === 'overview' && (
        <>
          {total === 0 ? (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <PenTool className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nenhuma redação avaliada ainda</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Envie sua primeira redação (digitada ou por foto) no Corretor para acompanhar seu histórico e começar a desbloquear medalhas de conquista!
                  </p>
                </div>
                <button
                  onClick={onStartNewEssay}
                  className="px-6 py-3 rounded-xl font-bold text-xs bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white transition-colors cursor-pointer shadow-xs"
                >
                  Começar Agora
                </button>
              </div>

              {/* Showcase badges even for new students */}
              <StudentBadgesSection savedEssays={savedEssays} />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Key Metrics Cards */}
              {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Média Geral */}
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                      <span>Média Geral</span>
                      <BarChart3 className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {stats.average} <span className="text-xs font-medium text-slate-400">/ 1000</span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Baseado em {total} {total === 1 ? 'redação corrigida' : 'redações corrigidas'}
                    </div>
                  </div>

                  {/* Card 2: Melhor Nota */}
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                      <span>Melhor Nota (Recorde)</span>
                      <Award className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                      {stats.highest} <span className="text-xs font-medium text-slate-400">pts</span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {stats.highest >= 900 ? '⭐ Faixa de Excelência (900+)' : stats.highest >= 800 ? 'Ótimo desempenho' : 'Em constante evolução'}
                    </div>
                  </div>

                  {/* Card 3: Evolução */}
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                      <span>Progresso Total</span>
                      {stats.diff >= 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-rose-500" />
                      )}
                    </div>
                    <div className={`text-2xl sm:text-3xl font-black ${stats.diff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>
                      {stats.diff > 0 ? `+${stats.diff}` : stats.diff} <span className="text-xs font-medium text-slate-400">pts</span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {total > 1 ? `Da 1ª (${stats.firstScore} pts) à última (${stats.latestScore} pts)` : 'Aguardando próxima redação'}
                    </div>
                  </div>

                  {/* Card 4: Medalhas Conquistadas */}
                  <div 
                    onClick={() => setActiveTab('badges')}
                    className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 dark:from-amber-950/30 dark:to-yellow-950/20 p-5 rounded-2xl border border-amber-200 dark:border-amber-800/80 shadow-2xs space-y-2 cursor-pointer hover:border-amber-400 dark:hover:border-amber-700 transition-all group"
                  >
                    <div className="flex items-center justify-between text-amber-800 dark:text-amber-300 text-xs font-semibold">
                      <span>Medalhas</span>
                      <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-900 dark:text-amber-200">
                      {unlockedBadgesCount} <span className="text-xs font-medium text-amber-700 dark:text-amber-400">/ {badges.length}</span>
                    </div>
                    <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                      <span>Ver galeria completa &rarr;</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Qualitative Evidence Evaluation Reminder */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-indigo-200/80 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold shrink-0">
                    ⚖️
                  </span>
                  <div>
                    <span className="font-extrabold text-indigo-950 dark:text-indigo-200 uppercase tracking-wide">
                      Avaliação Ponderada por Evidências Qualitativas
                    </span>
                    <p className="text-indigo-800 dark:text-indigo-300 mt-0.5 text-[11px]">
                      A nota 200 em cada competência não é atribuída por ausência de falhas, mas por comprovação ativa de maturidade textual.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('badges')}
                  className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] border border-indigo-200 dark:border-indigo-700 shrink-0 hover:bg-indigo-50 transition-colors cursor-pointer"
                >
                  Ver Conquistas &rarr;
                </button>
              </div>

              {/* Interactive Line Chart with Recharts */}
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <span>Gráfico de Evolução ao Longo do Tempo</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Visualização cronológica do desempenho nas {total} redações cadastradas.
                    </p>
                  </div>

                  {/* View Mode Selector */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700 self-start sm:self-auto">
                    <button
                      onClick={() => setChartMode('total')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        chartMode === 'total'
                          ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Nota Geral (0-1000)</span>
                    </button>
                    <button
                      onClick={() => setChartMode('competencies')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        chartMode === 'competencies'
                          ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Competências (C1 a C5)</span>
                    </button>
                  </div>
                </div>

                {/* Chart Canvas */}
                <div className="w-full h-72 sm:h-84 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartMode === 'total' ? (
                      <LineChart
                        data={chartData}
                        margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.4} vertical={false} />
                        <XAxis 
                          dataKey="label" 
                          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                          axisLine={{ stroke: '#475569' }}
                          tickLine={false}
                        />
                        <YAxis 
                          domain={[0, 1000]} 
                          ticks={[0, 200, 400, 600, 800, 900, 1000]}
                          tick={{ fill: '#94a3b8', fontSize: 11 }}
                          axisLine={{ stroke: '#475569' }}
                          tickLine={false}
                        />
                        <Tooltip content={<CustomTooltipTotal onSelectEssay={onSelectEssay} />} />
                        
                        {/* Reference Lines for Benchmark Scores */}
                        <ReferenceLine 
                          y={900} 
                          stroke="#10b981" 
                          strokeDasharray="4 4" 
                          label={{ value: 'Meta Nota 900+', fill: '#10b981', fontSize: 11, position: 'insideTopRight' }} 
                        />
                        <ReferenceLine 
                          y={800} 
                          stroke="#3b82f6" 
                          strokeDasharray="4 4" 
                          label={{ value: 'Meta 800+', fill: '#3b82f6', fontSize: 10, position: 'insideBottomRight' }} 
                        />

                        <Line
                          type="monotone"
                          dataKey="totalScore"
                          name="Nota Geral"
                          stroke="#6366f1"
                          strokeWidth={3.5}
                          dot={{ r: 5, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2 }}
                          activeDot={{ r: 7, fill: '#4338ca', stroke: '#c7d2fe', strokeWidth: 3 }}
                        />
                      </LineChart>
                    ) : (
                      <LineChart
                        data={chartData}
                        margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.4} vertical={false} />
                        <XAxis 
                          dataKey="label" 
                          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                          axisLine={{ stroke: '#475569' }}
                          tickLine={false}
                        />
                        <YAxis 
                          domain={[0, 200]} 
                          ticks={[0, 40, 80, 120, 160, 200]}
                          tick={{ fill: '#94a3b8', fontSize: 11 }}
                          axisLine={{ stroke: '#475569' }}
                          tickLine={false}
                        />
                        <Tooltip content={<CustomTooltipCompetencies onSelectEssay={onSelectEssay} />} />
                        <Legend 
                          wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 600 }} 
                        />

                        {/* Meta 200 (Nota Máxima na Competência) */}
                        <ReferenceLine 
                          y={200} 
                          stroke="#10b981" 
                          strokeDasharray="3 3" 
                          strokeOpacity={0.6}
                        />

                        <Line
                          type="monotone"
                          dataKey="c1"
                          name="C1: Norma Culta"
                          stroke="#3b82f6"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: '#3b82f6' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="c2"
                          name="C2: Repertório"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: '#10b981' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="c3"
                          name="C3: Projeto de Texto"
                          stroke="#f59e0b"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: '#f59e0b' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="c4"
                          name="C4: Coesão"
                          stroke="#8b5cf6"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: '#8b5cf6' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="c5"
                          name="C5: Proposta"
                          stroke="#ec4899"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: '#ec4899' }}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {/* Subtitle helper */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 inline-block"></span>
                    <span>Passe o cursor sobre os pontos para inspecionar os temas e notas detalhadas.</span>
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Total acumulado: {total} {total === 1 ? 'redação' : 'redações'}
                  </span>
                </div>
              </div>

              {/* Integrated Badges Gallery in Overview */}
              <StudentBadgesSection savedEssays={savedEssays} />

              {/* Recurrent Problems Section */}
              {frequentProblems.length > 0 && (
                <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/80 rounded-2xl p-5 sm:p-6 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-extrabold text-sm sm:text-base">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <span>Padrões de Dificuldade Recorrentes no seu Histórico</span>
                  </div>
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    Estes pontos foram apontados repetidamente pelo corretor nas suas redações e merecem atenção especial no rascunho:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {frequentProblems.map(([problem, count], idx) => (
                      <div 
                        key={idx} 
                        className="bg-white/90 dark:bg-slate-900/90 p-3 rounded-xl border border-amber-200/60 dark:border-amber-800/60 flex items-start gap-2.5 shadow-2xs"
                      >
                        <span className="text-xs font-black text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                          {count}x
                        </span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                          {problem}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal Interativo para Ler Redação Completa */}
      <EssayReaderModal 
        essay={viewingEssayModal}
        isOpen={!!viewingEssayModal}
        onClose={() => setViewingEssayModal(null)}
        onOpenFullReport={onSelectEssay}
      />
    </div>
  );
};

// Custom Tooltip for Total Score
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  onSelectEssay?: (essay: EssayCorrectionResult) => void;
}

const CustomTooltipTotal: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;

  return (
    <div className="bg-slate-900/95 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs max-w-xs space-y-2 backdrop-blur-xs">
      <div className="flex items-center justify-between gap-3 border-b border-slate-700 pb-1.5">
        <span className="font-bold text-indigo-300">{data.label}</span>
        <span className="text-[10px] text-slate-400">{data.date}</span>
      </div>
      
      <p className="text-slate-200 font-medium line-clamp-2 text-[11px] leading-tight">
        {data.theme}
      </p>

      <div className="pt-1 flex items-center justify-between">
        <span className="text-slate-400 text-[11px]">Nota Geral:</span>
        <span className={`font-black text-sm ${
          data.totalScore >= 900 ? 'text-emerald-400' :
          data.totalScore >= 800 ? 'text-blue-400' :
          data.totalScore >= 640 ? 'text-amber-400' : 'text-rose-400'
        }`}>
          {data.totalScore} pts
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1 pt-1 text-[10px] text-center border-t border-slate-800">
        <div><span className="text-slate-400 block">C1</span><span className="font-bold">{data.c1}</span></div>
        <div><span className="text-slate-400 block">C2</span><span className="font-bold">{data.c2}</span></div>
        <div><span className="text-slate-400 block">C3</span><span className="font-bold">{data.c3}</span></div>
        <div><span className="text-slate-400 block">C4</span><span className="font-bold">{data.c4}</span></div>
        <div><span className="text-slate-400 block">C5</span><span className="font-bold">{data.c5}</span></div>
      </div>
    </div>
  );
};

// Custom Tooltip for Competencies
const CustomTooltipCompetencies: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;

  return (
    <div className="bg-slate-900/95 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs max-w-xs space-y-2 backdrop-blur-xs">
      <div className="flex items-center justify-between gap-3 border-b border-slate-700 pb-1.5">
        <span className="font-bold text-indigo-300">{data.label}</span>
        <span className="text-[10px] text-slate-400">{data.date}</span>
      </div>
      
      <p className="text-slate-200 font-medium line-clamp-1 text-[11px]">
        {data.theme}
      </p>

      <div className="space-y-1 pt-1 text-[11px]">
        <div className="flex items-center justify-between text-blue-300">
          <span>C1 (Norma Culta):</span>
          <span className="font-bold">{data.c1} / 200</span>
        </div>
        <div className="flex items-center justify-between text-emerald-300">
          <span>C2 (Repertório & Tema):</span>
          <span className="font-bold">{data.c2} / 200</span>
        </div>
        <div className="flex items-center justify-between text-amber-300">
          <span>C3 (Projeto de Texto):</span>
          <span className="font-bold">{data.c3} / 200</span>
        </div>
        <div className="flex items-center justify-between text-purple-300">
          <span>C4 (Coesão Textual):</span>
          <span className="font-bold">{data.c4} / 200</span>
        </div>
        <div className="flex items-center justify-between text-pink-300">
          <span>C5 (Proposta de Intervenção):</span>
          <span className="font-bold">{data.c5} / 200</span>
        </div>
      </div>

      <div className="pt-1.5 border-t border-slate-800 flex justify-between font-black text-xs">
        <span className="text-slate-300">Total:</span>
        <span className="text-indigo-300">{data.totalScore} pts</span>
      </div>
    </div>
  );
};


