import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Sparkles, 
  Target, 
  BookOpen, 
  Zap, 
  CheckCircle2, 
  Trophy, 
  Flame, 
  Shield, 
  Star,
  Lock,
  Check,
  ChevronRight,
  Filter,
  Info
} from 'lucide-react';
import { AchievementBadge, EssayCorrectionResult } from '../types';
import { calculateAchievements } from '../data/achievements';

interface StudentBadgesSectionProps {
  savedEssays: EssayCorrectionResult[];
}

type BadgeFilter = 'all' | 'unlocked' | 'locked' | 'competency' | 'volume' | 'score';

export const StudentBadgesSection: React.FC<StudentBadgesSectionProps> = ({ savedEssays }) => {
  const [filter, setFilter] = useState<BadgeFilter>('all');
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);

  const badges = useMemo(() => {
    return calculateAchievements(savedEssays);
  }, [savedEssays]);

  const unlockedCount = badges.filter(b => b.isUnlocked).length;
  const totalCount = badges.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  // Find next closest medal in progress
  const nextBadge = useMemo(() => {
    const locked = badges.filter(b => !b.isUnlocked);
    if (locked.length === 0) return null;
    return [...locked].sort((a, b) => b.progress - a.progress)[0];
  }, [badges]);

  const filteredBadges = useMemo(() => {
    switch (filter) {
      case 'unlocked':
        return badges.filter(b => b.isUnlocked);
      case 'locked':
        return badges.filter(b => !b.isUnlocked);
      case 'competency':
        return badges.filter(b => b.category === 'competency');
      case 'volume':
        return badges.filter(b => b.category === 'volume');
      case 'score':
        return badges.filter(b => b.category === 'score');
      default:
        return badges;
    }
  }, [badges, filter]);

  const renderBadgeIcon = (iconType: AchievementBadge['iconType'], isUnlocked: boolean, rarity: AchievementBadge['rarity']) => {
    const iconClass = "w-6 h-6";
    switch (iconType) {
      case 'sparkles': return <Sparkles className={iconClass} />;
      case 'target': return <Target className={iconClass} />;
      case 'trophy': return <Trophy className={iconClass} />;
      case 'flame': return <Flame className={iconClass} />;
      case 'award': return <Award className={iconClass} />;
      case 'star': return <Star className={iconClass} />;
      case 'shield': return <Shield className={iconClass} />;
      case 'book': return <BookOpen className={iconClass} />;
      case 'zap': return <Zap className={iconClass} />;
      case 'check': return <CheckCircle2 className={iconClass} />;
      default: return <Award className={iconClass} />;
    }
  };

  const getRarityConfig = (rarity: AchievementBadge['rarity']) => {
    switch (rarity) {
      case 'diamante':
        return {
          label: 'Diamante',
          bgUnlocked: 'bg-gradient-to-br from-cyan-500/10 via-sky-500/20 to-blue-600/10 dark:from-cyan-950/40 dark:via-sky-900/30 dark:to-blue-950/40 border-cyan-300 dark:border-cyan-700/60 text-cyan-900 dark:text-cyan-100',
          iconBg: 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-cyan-500/30',
          pill: 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-200 border-cyan-200 dark:border-cyan-800',
          ring: 'ring-cyan-400/40'
        };
      case 'ouro':
        return {
          label: 'Ouro',
          bgUnlocked: 'bg-gradient-to-br from-amber-500/10 via-yellow-500/15 to-orange-500/10 dark:from-amber-950/40 dark:via-yellow-900/30 dark:to-orange-950/40 border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-100',
          iconBg: 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-amber-500/30',
          pill: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800',
          ring: 'ring-amber-400/40'
        };
      case 'prata':
        return {
          label: 'Prata',
          bgUnlocked: 'bg-gradient-to-br from-slate-200/50 via-slate-100 to-indigo-50/50 dark:from-slate-800/60 dark:via-slate-800/40 dark:to-indigo-950/30 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100',
          iconBg: 'bg-gradient-to-tr from-slate-500 to-slate-400 text-white shadow-slate-400/30',
          pill: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700',
          ring: 'ring-slate-300/50 dark:ring-slate-600/50'
        };
      case 'bronze':
      default:
        return {
          label: 'Bronze',
          bgUnlocked: 'bg-gradient-to-br from-amber-700/10 via-orange-600/10 to-amber-800/10 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-900/30 border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-100',
          iconBg: 'bg-gradient-to-tr from-amber-700 to-amber-600 text-white shadow-amber-700/30',
          pill: 'bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-200 border-orange-200 dark:border-orange-800',
          ring: 'ring-amber-500/30'
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-6 transition-colors">
      {/* Header with Total Medals & Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              <Trophy className="w-5 h-5" />
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Galeria de Medalhas de Conquista
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Conquistas desbloqueadas automaticamente conforme você pratica e domina as competências do ENEM.
          </p>
        </div>

        {/* Global Progress Pill */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 self-start md:self-auto">
          <div className="space-y-1 min-w-[120px]">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
              <span>{unlockedCount} de {totalCount} Conquistadas</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-indigo-600 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-black flex items-center gap-1.5 shadow-2xs">
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Nível: {unlockedCount >= 10 ? 'Mestre' : unlockedCount >= 5 ? 'Avançado' : unlockedCount >= 1 ? 'Praticante' : 'Iniciante'}</span>
          </div>
        </div>
      </div>

      {/* Next Milestone Banner (if not 100% complete) */}
      {nextBadge && (
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-amber-50 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-slate-800/60 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-indigo-100 dark:border-indigo-900">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                Próxima Conquista ao seu Alcance
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {nextBadge.title} — <span className="font-normal text-slate-600 dark:text-slate-400">{nextBadge.requirementText}</span>
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {nextBadge.currentValue} / {nextBadge.targetValue} {nextBadge.unit}
              </span>
              <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden mt-1">
                <div 
                  className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full" 
                  style={{ width: `${nextBadge.progress}%` }}
                ></div>
              </div>
            </div>
            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
              {nextBadge.progress}%
            </span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Todas ({badges.length})
        </button>
        <button
          onClick={() => setFilter('unlocked')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'unlocked'
              ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-2xs'
              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/60 dark:border-emerald-800/60'
          }`}
        >
          <Check className="w-3.5 h-3.5" />
          <span>Conquistadas ({unlockedCount})</span>
        </button>
        <button
          onClick={() => setFilter('locked')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'locked'
              ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Bloqueadas ({totalCount - unlockedCount})</span>
        </button>
        <button
          onClick={() => setFilter('competency')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'competency'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800/50'
          }`}
        >
          Competências C1-C5
        </button>
        <button
          onClick={() => setFilter('volume')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'volume'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Volume & Prática
        </button>
        <button
          onClick={() => setFilter('score')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'score'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Notas & Excelência
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const rarityCfg = getRarityConfig(badge.rarity);
          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                badge.isUnlocked
                  ? `${rarityCfg.bgUnlocked} shadow-xs hover:shadow-md hover:-translate-y-0.5`
                  : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Card Top */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl shadow-sm ${
                      badge.isUnlocked
                        ? `${rarityCfg.iconBg} ring-2 ${rarityCfg.ring}`
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                    }`}>
                      {badge.isUnlocked ? (
                        renderBadgeIcon(badge.iconType, badge.isUnlocked, badge.rarity)
                      ) : (
                        <Lock className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                          badge.isUnlocked ? rarityCfg.pill : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                        }`}>
                          {rarityCfg.label}
                        </span>
                        {badge.isUnlocked && (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            <Check className="w-3 h-3" />
                            <span>Desbloqueada</span>
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mt-1 leading-snug">
                        {badge.title}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Card Bottom / Progress */}
              <div className="pt-4 mt-3 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span>Requisito: {badge.requirementText}</span>
                  {badge.isUnlocked && badge.unlockedAtDate && (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">{badge.unlockedAtDate}</span>
                  )}
                </div>

                {!badge.isUnlocked && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      <span>Progresso</span>
                      <span>{badge.currentValue} / {badge.targetValue} ({badge.progress}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all"
                        style={{ width: `${badge.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Badge Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>

            {/* Medal Showcase */}
            <div className="text-center space-y-3">
              <div className="inline-block relative">
                <div className={`w-20 h-20 mx-auto rounded-3xl p-4 flex items-center justify-center shadow-lg ${
                  selectedBadge.isUnlocked 
                    ? getRarityConfig(selectedBadge.rarity).iconBg 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                }`}>
                  {selectedBadge.isUnlocked ? (
                    renderBadgeIcon(selectedBadge.iconType, true, selectedBadge.rarity)
                  ) : (
                    <Lock className="w-10 h-10" />
                  )}
                </div>
                {selectedBadge.isUnlocked && (
                  <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                )}
              </div>

              <div>
                <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg border inline-block mb-1.5 ${
                  selectedBadge.isUnlocked 
                    ? getRarityConfig(selectedBadge.rarity).pill 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}>
                  Medalha de {getRarityConfig(selectedBadge.rarity).label}
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                  {selectedBadge.title}
                </h3>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedBadge.description}
              </p>
            </div>

            {/* Requirement Breakdown */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Critério Oficial:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedBadge.requirementText}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Status Atual:</span>
                <span className={`font-black ${selectedBadge.isUnlocked ? 'text-emerald-700 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                  {selectedBadge.isUnlocked ? '✅ Conquistada!' : `${selectedBadge.currentValue} / ${selectedBadge.targetValue} ${selectedBadge.unit}`}
                </span>
              </div>
              {selectedBadge.unlockedAtDate && (
                <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/60 pt-2">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">Data da Conquista:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{selectedBadge.unlockedAtDate}</span>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Fechar Detalhes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
