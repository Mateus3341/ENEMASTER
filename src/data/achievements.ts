import { EssayCorrectionResult, AchievementBadge } from '../types';

export function calculateAchievements(savedEssays: EssayCorrectionResult[]): AchievementBadge[] {
  const totalEssays = savedEssays.length;
  const scores = savedEssays.map(e => e.totalScore);
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;

  // Chronological first and latest
  const chronological = [...savedEssays].reverse();
  const firstScore = chronological.length > 0 ? chronological[0].totalScore : 0;
  const latestScore = savedEssays.length > 0 ? savedEssays[0].totalScore : 0;
  const scoreDiff = totalEssays >= 2 ? Math.max(0, latestScore - firstScore) : 0;

  // Competency 200 counts and max competencies
  const hasC1_200 = savedEssays.some(e => (e.competencies?.c1?.score ?? 0) >= 200);
  const hasC2_200 = savedEssays.some(e => (e.competencies?.c2?.score ?? 0) >= 200);
  const hasC3_200 = savedEssays.some(e => (e.competencies?.c3?.score ?? 0) >= 200);
  const hasC4_200 = savedEssays.some(e => (e.competencies?.c4?.score ?? 0) >= 200);
  const hasC5_200 = savedEssays.some(e => (e.competencies?.c5?.score ?? 0) >= 200);

  const maxC1 = savedEssays.reduce((max, e) => Math.max(max, e.competencies?.c1?.score ?? 0), 0);
  const maxC2 = savedEssays.reduce((max, e) => Math.max(max, e.competencies?.c2?.score ?? 0), 0);
  const maxC3 = savedEssays.reduce((max, e) => Math.max(max, e.competencies?.c3?.score ?? 0), 0);
  const maxC4 = savedEssays.reduce((max, e) => Math.max(max, e.competencies?.c4?.score ?? 0), 0);
  const maxC5 = savedEssays.reduce((max, e) => Math.max(max, e.competencies?.c5?.score ?? 0), 0);

  // Check if any single essay has all 5 competencies >= 160 (or >= 200)
  const essayWithAllCompsHigh = savedEssays.find(e => 
    (e.competencies?.c1?.score ?? 0) >= 160 &&
    (e.competencies?.c2?.score ?? 0) >= 160 &&
    (e.competencies?.c3?.score ?? 0) >= 160 &&
    (e.competencies?.c4?.score ?? 0) >= 160 &&
    (e.competencies?.c5?.score ?? 0) >= 160
  );

  // Check how many competencies have reached 160+ at least once across all essays
  const highCompsCount = [
    maxC1 >= 160,
    maxC2 >= 160,
    maxC3 >= 160,
    maxC4 >= 160,
    maxC5 >= 160
  ].filter(Boolean).length;

  // Solid essays with >= 700 pts
  const solidEssaysCount = savedEssays.filter(e => e.totalScore >= 700).length;

  // Find unlock dates where possible
  const getUnlockDate = (condition: boolean, essayFinder?: () => EssayCorrectionResult | undefined) => {
    if (!condition) return undefined;
    if (essayFinder) {
      const found = essayFinder();
      if (found?.date) return found.date;
    }
    return savedEssays[0]?.date || 'Conquistado';
  };

  const badges: AchievementBadge[] = [
    {
      id: 'badge-first-essay',
      title: 'Primeiros Passos',
      category: 'volume',
      description: 'Conclua e salve sua 1ª redação corrigida com a matriz oficial do INEP.',
      iconType: 'sparkles',
      rarity: 'bronze',
      isUnlocked: totalEssays >= 1,
      progress: Math.min(100, Math.round((totalEssays / 1) * 100)),
      currentValue: totalEssays,
      targetValue: 1,
      unit: 'redação',
      unlockedAtDate: getUnlockDate(totalEssays >= 1, () => chronological[0]),
      requirementText: '1 redação corrigida'
    },
    {
      id: 'badge-5-essays',
      title: 'Rumo à Consistência',
      category: 'volume',
      description: 'Pratique com consistência e conclua 5 redações completas.',
      iconType: 'target',
      rarity: 'prata',
      isUnlocked: totalEssays >= 5,
      progress: Math.min(100, Math.round((totalEssays / 5) * 100)),
      currentValue: totalEssays,
      targetValue: 5,
      unit: 'redações',
      unlockedAtDate: getUnlockDate(totalEssays >= 5, () => chronological[4]),
      requirementText: '5 redações corrigidas'
    },
    {
      id: 'badge-10-themes',
      title: '10 Temas Concluídos',
      category: 'volume',
      description: 'Construa um repertório vasto concluindo 10 propostas de redação.',
      iconType: 'trophy',
      rarity: 'ouro',
      isUnlocked: totalEssays >= 10,
      progress: Math.min(100, Math.round((totalEssays / 10) * 100)),
      currentValue: totalEssays,
      targetValue: 10,
      unit: 'redações',
      unlockedAtDate: getUnlockDate(totalEssays >= 10, () => chronological[9]),
      requirementText: '10 redações corrigidas'
    },
    {
      id: 'badge-20-marathon',
      title: 'Maratonista Nota 1000',
      category: 'volume',
      description: 'Alcançou o patamar de alto rendimento com 20 redações analisadas.',
      iconType: 'flame',
      rarity: 'diamante',
      isUnlocked: totalEssays >= 20,
      progress: Math.min(100, Math.round((totalEssays / 20) * 100)),
      currentValue: totalEssays,
      targetValue: 20,
      unit: 'redações',
      unlockedAtDate: getUnlockDate(totalEssays >= 20, () => chronological[19]),
      requirementText: '20 redações corrigidas'
    },
    {
      id: 'badge-score-800',
      title: 'Clube dos 800+',
      category: 'score',
      description: 'Conquiste uma pontuação de 800+ pontos em uma redação.',
      iconType: 'award',
      rarity: 'prata',
      isUnlocked: highestScore >= 800,
      progress: Math.min(100, Math.round((highestScore / 800) * 100)),
      currentValue: highestScore,
      targetValue: 800,
      unit: 'pontos',
      unlockedAtDate: getUnlockDate(highestScore >= 800, () => savedEssays.find(e => e.totalScore >= 800)),
      requirementText: 'Nota mínima de 800 pts'
    },
    {
      id: 'badge-score-900',
      title: 'Elite Nota 900+',
      category: 'score',
      description: 'Supere a barreira dos 900 pontos e entre no top 5% dos candidatos do Brasil.',
      iconType: 'star',
      rarity: 'ouro',
      isUnlocked: highestScore >= 900,
      progress: Math.min(100, Math.round((highestScore / 900) * 100)),
      currentValue: highestScore,
      targetValue: 900,
      unit: 'pontos',
      unlockedAtDate: getUnlockDate(highestScore >= 900, () => savedEssays.find(e => e.totalScore >= 900)),
      requirementText: 'Nota mínima de 900 pts'
    },
    {
      id: 'badge-score-1000',
      title: 'Gabarito Perfeito 1000',
      category: 'score',
      description: 'Conquiste a pontuação máxima histórica de 1000 pontos no ENEM.',
      iconType: 'trophy',
      rarity: 'diamante',
      isUnlocked: highestScore >= 1000,
      progress: Math.min(100, Math.round((highestScore / 1000) * 100)),
      currentValue: highestScore,
      targetValue: 1000,
      unit: 'pontos',
      unlockedAtDate: getUnlockDate(highestScore >= 1000, () => savedEssays.find(e => e.totalScore >= 1000)),
      requirementText: 'Nota máxima de 1000 pts'
    },
    {
      id: 'badge-all-competencies',
      title: 'Domínio das 5 Competências',
      category: 'competency',
      description: 'Demonstrou alto desempenho em todas as 5 competências simultaneamente (mínimo de 160 pts em cada).',
      iconType: 'shield',
      rarity: 'ouro',
      isUnlocked: Boolean(essayWithAllCompsHigh),
      progress: Math.min(100, Math.round((highCompsCount / 5) * 100)),
      currentValue: highCompsCount,
      targetValue: 5,
      unit: 'competências com 160+ pts',
      unlockedAtDate: getUnlockDate(Boolean(essayWithAllCompsHigh), () => essayWithAllCompsHigh),
      requirementText: '>= 160 pts em C1, C2, C3, C4 e C5'
    },
    {
      id: 'badge-c1-master',
      title: 'Guardião da Norma Culta (C1)',
      category: 'competency',
      description: 'Gabaritou a Competência 1 atingindo a pontuação máxima de 200 pontos.',
      iconType: 'book',
      rarity: 'ouro',
      isUnlocked: hasC1_200,
      progress: Math.min(100, Math.round((maxC1 / 200) * 100)),
      currentValue: maxC1,
      targetValue: 200,
      unit: 'pts em C1',
      unlockedAtDate: getUnlockDate(hasC1_200, () => savedEssays.find(e => (e.competencies?.c1?.score ?? 0) >= 200)),
      requirementText: '200 pts na Competência 1'
    },
    {
      id: 'badge-c2-master',
      title: 'Enciclopédia de Repertórios (C2)',
      category: 'competency',
      description: 'Alcançou 200 pontos na Competência 2 com repertório sociocultural legítimo e produtivo.',
      iconType: 'sparkles',
      rarity: 'ouro',
      isUnlocked: hasC2_200,
      progress: Math.min(100, Math.round((maxC2 / 200) * 100)),
      currentValue: maxC2,
      targetValue: 200,
      unit: 'pts em C2',
      unlockedAtDate: getUnlockDate(hasC2_200, () => savedEssays.find(e => (e.competencies?.c2?.score ?? 0) >= 200)),
      requirementText: '200 pts na Competência 2'
    },
    {
      id: 'badge-c3-master',
      title: 'Arquiteto Argumentativo (C3)',
      category: 'competency',
      description: 'Alcançou 200 pontos na Competência 3 com projeto de texto estratégico e sem lacunas.',
      iconType: 'target',
      rarity: 'ouro',
      isUnlocked: hasC3_200,
      progress: Math.min(100, Math.round((maxC3 / 200) * 100)),
      currentValue: maxC3,
      targetValue: 200,
      unit: 'pts em C3',
      unlockedAtDate: getUnlockDate(hasC3_200, () => savedEssays.find(e => (e.competencies?.c3?.score ?? 0) >= 200)),
      requirementText: '200 pts na Competência 3'
    },
    {
      id: 'badge-c4-master',
      title: 'Mestre da Coesão Textual (C4)',
      category: 'competency',
      description: 'Alcançou 200 pontos na Competência 4 com conectivos variados e sem repetições.',
      iconType: 'zap',
      rarity: 'ouro',
      isUnlocked: hasC4_200,
      progress: Math.min(100, Math.round((maxC4 / 200) * 100)),
      currentValue: maxC4,
      targetValue: 200,
      unit: 'pts em C4',
      unlockedAtDate: getUnlockDate(hasC4_200, () => savedEssays.find(e => (e.competencies?.c4?.score ?? 0) >= 200)),
      requirementText: '200 pts na Competência 4'
    },
    {
      id: 'badge-c5-master',
      title: 'Interventor Supremo (C5)',
      category: 'competency',
      description: 'Gabaritou a proposta de intervenção com todos os 5 elementos oficiais válidos.',
      iconType: 'check',
      rarity: 'ouro',
      isUnlocked: hasC5_200,
      progress: Math.min(100, Math.round((maxC5 / 200) * 100)),
      currentValue: maxC5,
      targetValue: 200,
      unit: 'pts em C5',
      unlockedAtDate: getUnlockDate(hasC5_200, () => savedEssays.find(e => (e.competencies?.c5?.score ?? 0) >= 200)),
      requirementText: '200 pts na Competência 5'
    },
    {
      id: 'badge-evolution-growth',
      title: 'Salto de Desempenho',
      category: 'mastery',
      description: 'Evoluiu em +80 pontos em relação ao resultado da sua primeira redação.',
      iconType: 'flame',
      rarity: 'prata',
      isUnlocked: scoreDiff >= 80,
      progress: Math.min(100, Math.round((scoreDiff / 80) * 100)),
      currentValue: scoreDiff,
      targetValue: 80,
      unit: 'pts de ganho',
      unlockedAtDate: getUnlockDate(scoreDiff >= 80),
      requirementText: 'Aumento de +80 pts no histórico'
    },
    {
      id: 'badge-solid-trio',
      title: 'Base Consolidada',
      category: 'mastery',
      description: 'Alcançou pontuação acima de 700 pontos em pelo menos 3 redações.',
      iconType: 'shield',
      rarity: 'bronze',
      isUnlocked: solidEssaysCount >= 3,
      progress: Math.min(100, Math.round((solidEssaysCount / 3) * 100)),
      currentValue: solidEssaysCount,
      targetValue: 3,
      unit: 'redações 700+',
      unlockedAtDate: getUnlockDate(solidEssaysCount >= 3),
      requirementText: '3 redações com 700+ pts'
    }
  ];

  return badges;
}
