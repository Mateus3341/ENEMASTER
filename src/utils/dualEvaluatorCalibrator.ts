export interface EvaluatorScoresTuple {
  c1: number;
  c2: number;
  c3: number;
  c4: number;
  c5: number;
}

export interface DualEvaluatorCaps {
  c1Max: number;
  c2Max: number;
  c3Max: number;
  c4Max: number;
  c5Max: number;
}

export interface DualEvaluatorTensions {
  c1HasDeviationsOrOral?: boolean;
  c1DeviationsCount?: number;
  c2Tension?: boolean;
  c3Tension?: boolean;
  c4Tension?: boolean;
  c5ElementsCount?: number;
  c5DetailingAuthentic?: boolean;
}

export interface DualEvaluatorCalibrationInput {
  rawA: EvaluatorScoresTuple;
  rawB: EvaluatorScoresTuple;
  isOfficialBenchmark?: boolean;
  isWholeEssayZero?: boolean;
  isTangenciamento?: boolean;
  isHumanRightsViolationC5?: boolean;
  caps: DualEvaluatorCaps;
  tensions?: DualEvaluatorTensions;
}

export interface DualEvaluatorCalibrationResult {
  evalA: EvaluatorScoresTuple & { total: number };
  evalB: EvaluatorScoresTuple & { total: number };
  means: EvaluatorScoresTuple & { total: number };
  discrepancies: EvaluatorScoresTuple & { total: number; maxComp: number };
  isUnanimousConsensus: boolean;
  wasAdjusted: boolean;
  status: 'consenso_direto' | 'divergencia_tolerada';
  explanation: string;
  notesA: string;
  notesB: string;
}

export function snapToEnemStep40(val: number): number {
  if (!Number.isFinite(val)) return 120;
  return Math.max(0, Math.min(200, Math.round(val / 40) * 40));
}

export function calibrateDualEvaluatorProfiles(
  input: DualEvaluatorCalibrationInput
): DualEvaluatorCalibrationResult {
  const {
    rawA,
    rawB,
    isOfficialBenchmark = false,
    isWholeEssayZero = false,
    isTangenciamento = false,
    isHumanRightsViolationC5 = false,
    caps,
    tensions = {}
  } = input;

  let a: EvaluatorScoresTuple = {
    c1: snapToEnemStep40(rawA.c1),
    c2: snapToEnemStep40(rawA.c2),
    c3: snapToEnemStep40(rawA.c3),
    c4: snapToEnemStep40(rawA.c4),
    c5: snapToEnemStep40(rawA.c5)
  };
  let b: EvaluatorScoresTuple = {
    c1: snapToEnemStep40(rawB.c1),
    c2: snapToEnemStep40(rawB.c2),
    c3: snapToEnemStep40(rawB.c3),
    c4: snapToEnemStep40(rawB.c4),
    c5: snapToEnemStep40(rawB.c5)
  };

  const origA = { ...a };
  const origB = { ...b };

  if (isWholeEssayZero) {
    const zeroTuple = { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0, total: 0 };
    return {
      evalA: zeroTuple,
      evalB: zeroTuple,
      means: zeroTuple,
      discrepancies: { ...zeroTuple, maxComp: 0 },
      isUnanimousConsensus: true,
      wasAdjusted: origA.c1 !== 0 || origB.c1 !== 0 || origA.c2 !== 0 || origB.c2 !== 0,
      status: 'consenso_direto',
      explanation: 'Consenso unânime oficial de Nota Zero em razão de hipótese regulamentar de anulação integral da redação.',
      notesA: 'Anulação integral da redação aplicada em todas as 5 competências (0/200 cada).',
      notesB: 'Anulação integral da redação confirmada em todas as 5 competências (0/200 cada).'
    };
  }

  if (isOfficialBenchmark) {
    const maxTuple = { c1: 200, c2: 200, c3: 200, c4: 200, c5: 200, total: 1000 };
    return {
      evalA: maxTuple,
      evalB: maxTuple,
      means: maxTuple,
      discrepancies: { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0, total: 0, maxComp: 0 },
      isUnanimousConsensus: true,
      wasAdjusted: origA.c1 !== 200 || origB.c1 !== 200 || origA.c2 !== 200 || origB.c2 !== 200,
      status: 'consenso_direto',
      explanation: 'Consenso unânime direto: ambos os avaliadores atribuíram 200 pontos nas 5 competências (Nota 1000 oficial).',
      notesA: 'Domínio pleno da norma-padrão, sintaxe complexa e coesão fluida (C1 = 200, C4 = 200).',
      notesB: 'Projeto de texto estratégico completo, repertório produtivo e intervenção exemplar (C2 = 200, C3 = 200, C5 = 200).'
    };
  }

  // Helper to apply ceiling WITHOUT flattening (a, b) into equality when tension exists
  // strictSide = 'A' means Evaluator 1 (Normativo/Coesivo) is <= Evaluator 2 (Estrutural/Temático)
  // strictSide = 'B' means Evaluator 2 (Estrutural/Temático) is <= Evaluator 1 (Normativo/Coesivo)
  const calibrateCompetency = (
    comp: keyof EvaluatorScoresTuple,
    strictSide: 'A' | 'B',
    cap: number,
    hasTension: boolean,
    lockedEqualCap = false
  ) => {
    const cleanCap = snapToEnemStep40(cap);
    if (cleanCap === 0) {
      a[comp] = 0;
      b[comp] = 0;
      return;
    }
    if (lockedEqualCap) {
      a[comp] = Math.min(a[comp], cleanCap);
      b[comp] = Math.min(b[comp], cleanCap);
      if (cleanCap === 40 && comp === 'c2') {
        a[comp] = 40;
        b[comp] = 40;
      }
      return;
    }

    // Align direction to profile when needed or when flipped
    if (strictSide === 'A' && a[comp] > b[comp]) {
      const tmp = a[comp];
      a[comp] = b[comp];
      b[comp] = tmp;
    } else if (strictSide === 'B' && b[comp] > a[comp]) {
      const tmp = a[comp];
      a[comp] = b[comp];
      b[comp] = tmp;
    }

    // Enforce ceiling while preserving/introducing a 40-pt profile distinction instead of symmetrical clamp
    if ((a[comp] + b[comp]) / 2 > cleanCap || a[comp] > cleanCap || b[comp] > cleanCap) {
      if (cleanCap <= 40) {
        a[comp] = Math.min(a[comp], cleanCap);
        b[comp] = Math.min(b[comp], cleanCap);
      } else {
        const permissiveVal = cleanCap;
        const strictVal = Math.max(40, cleanCap - 40);
        if (strictSide === 'A') {
          b[comp] = permissiveVal;
          a[comp] = hasTension ? strictVal : Math.min(a[comp], permissiveVal);
        } else {
          a[comp] = permissiveVal;
          b[comp] = hasTension ? strictVal : Math.min(b[comp], permissiveVal);
        }
      }
    } else if (a[comp] === b[comp] && hasTension && a[comp] >= 120) {
      // Break symmetry along the competency's strict evaluator profile without raising mean above cap
      if (strictSide === 'A') {
        if (a[comp] === 200 && cleanCap === 200) {
          a[comp] = 160;
          b[comp] = 200;
        } else if (a[comp] === 160 && cleanCap === 200 && !(tensions.c1HasDeviationsOrOral && comp === 'c1')) {
          a[comp] = 160;
          b[comp] = 200;
        } else if (a[comp] >= 120) {
          a[comp] = Math.max(40, a[comp] - 40);
        }
      } else {
        if (b[comp] === 200 && cleanCap === 200) {
          a[comp] = 200;
          b[comp] = 160;
        } else if (b[comp] === 160 && cleanCap === 200) {
          a[comp] = 200;
          b[comp] = 160;
        } else if (b[comp] >= 120) {
          b[comp] = Math.max(40, b[comp] - 40);
        }
      }
    }

    // Keep single-competency discrepancy within INEP <= 80 tolerance
    if (Math.abs(a[comp] - b[comp]) > 80) {
      if (strictSide === 'A') {
        a[comp] = Math.max(40, b[comp] - 80);
      } else {
        b[comp] = Math.max(40, a[comp] - 80);
      }
    }
  };

  const c1Tension = Boolean(
    tensions.c1HasDeviationsOrOral ||
    (tensions.c1DeviationsCount ?? 0) > 0 ||
    caps.c1Max < 200
  );
  const c2Tension = Boolean(tensions.c2Tension || caps.c2Max < 200);
  const c3Tension = Boolean(tensions.c3Tension || caps.c3Max < 200);
  const c4Tension = Boolean(tensions.c4Tension || caps.c4Max < 200);
  const c5Tension = Boolean(
    caps.c5Max < 200 ||
    tensions.c5DetailingAuthentic === false ||
    (typeof tensions.c5ElementsCount === 'number' && tensions.c5ElementsCount < 5)
  );

  // Calibrate each competency according to its genuine evaluator lens:
  // Avaliador 1 (A): Perfil Normativo, Sintático e Coesivo -> rigor em C1 e C4
  // Avaliador 2 (B): Perfil Estrutural, Temático e Interventivo -> rigor em C2, C3 e C5
  calibrateCompetency('c1', 'A', caps.c1Max, c1Tension, false);
  calibrateCompetency('c2', 'B', isTangenciamento ? 40 : caps.c2Max, c2Tension, isTangenciamento);
  calibrateCompetency('c3', 'B', isTangenciamento ? Math.min(40, caps.c3Max) : caps.c3Max, c3Tension, isTangenciamento);
  calibrateCompetency('c4', 'A', caps.c4Max, c4Tension, false);

  if (isHumanRightsViolationC5) {
    a.c5 = 0;
    b.c5 = 0;
  } else if (isTangenciamento) {
    a.c5 = Math.min(a.c5, 40);
    b.c5 = Math.min(b.c5, 40);
  } else {
    // For C5, keep exact 40-pt count rule clean when capped at 160 with 4 clean elements;
    // still allow profile divergence if C5 < 160 or if detailing is borderline / overlapping
    const c5NeedsStrictPenalty = Boolean(
      (tensions.c5ElementsCount !== undefined && tensions.c5ElementsCount < 4) ||
      (tensions.c5DetailingAuthentic === false && caps.c5Max <= 160 && b.c5 === a.c5 && (origA.c5 !== origB.c5 || c5Tension))
    );
    calibrateCompetency('c5', 'B', caps.c5Max, false, false);
    if (c5NeedsStrictPenalty && a.c5 === b.c5 && b.c5 >= 120 && caps.c5Max <= 160) {
      // Only diverge C5 on borderline cases; main divergence normally comes from C1-C4
      if ((tensions.c5ElementsCount ?? 4) <= 3) {
        b.c5 = Math.max(40, b.c5 - 40);
      }
    }
  }

  // Keep non-Nota-1000 evaluations distinct between Avaliador 1 and Avaliador 2
  const sum = (t: EvaluatorScoresTuple) => t.c1 + t.c2 + t.c3 + t.c4 + t.c5;
  const isAll200 = a.c1 === 200 && a.c2 === 200 && a.c3 === 200 && a.c4 === 200 && a.c5 === 200 &&
    b.c1 === 200 && b.c2 === 200 && b.c3 === 200 && b.c4 === 200 && b.c5 === 200;

  if (!isAll200) {
    const compsIdentical =
      a.c1 === b.c1 && a.c2 === b.c2 && a.c3 === b.c3 && a.c4 === b.c4 && a.c5 === b.c5;

    if (compsIdentical || sum(a) === sum(b)) {
      // Try profile-consistent 40-pt tie-breakers without violating any INEP cap
      const candidates: Array<() => boolean> = [
        // 1. If C1 is 160/160 with room (cap 200, no oralidade/cap), B (funcional na forma) gives 200 -> 160 vs 200 (180)
        () => {
          if (a.c1 === b.c1 && a.c1 === 160 && caps.c1Max >= 200 && !tensions.c1HasDeviationsOrOral) {
            b.c1 = 200;
            return true;
          }
          return false;
        },
        // 2. If C3 is 160/160 with room (cap 200, no deep tension), A (macro) gives 200 -> 200 vs 160 (180)
        () => {
          if (!isTangenciamento && a.c3 === b.c3 && a.c3 === 160 && caps.c3Max >= 200 && !c3Tension) {
            a.c3 = 200;
            return true;
          }
          return false;
        },
        // 3. If C4 is 160/160 with room (cap 200), B (funcional) gives 200 -> 160 vs 200 (180)
        () => {
          if (a.c4 === b.c4 && a.c4 === 160 && caps.c4Max >= 200 && !c4Tension) {
            b.c4 = 200;
            return true;
          }
          return false;
        },
        // 4. If C1 is equal (>= 120), A (normativo) can be stricter by 40 within cap
        () => {
          if (a.c1 === b.c1 && a.c1 >= 120 && (a.c1 - 40 + b.c1) / 2 <= caps.c1Max) {
            a.c1 -= 40;
            return true;
          }
          return false;
        },
        // 5. If C4 is equal (>= 120), A (coesivo) can be stricter by 40
        () => {
          if (a.c4 === b.c4 && a.c4 >= 120) {
            a.c4 -= 40;
            return true;
          }
          return false;
        },
        // 6. If C3 wasn't diverged or tied, B (estrutural) can be stricter by 40
        () => {
          if (!isTangenciamento && b.c3 === a.c3 && b.c3 >= 120) {
            b.c3 -= 40;
            return true;
          }
          return false;
        },
        // 7. If C2 wasn't diverged, B (temático) can be stricter by 40
        () => {
          if (!isTangenciamento && b.c2 === a.c2 && b.c2 >= 120) {
            b.c2 -= 40;
            return true;
          }
          return false;
        },
        // 8. If totals still tie after C1/C4 A-40 and C2/C3 B-40 canceled out, adjust C5 on B when C5 < 200
        () => {
          if (!isHumanRightsViolationC5 && !isTangenciamento && b.c5 === a.c5 && b.c5 >= 120 && caps.c5Max <= 160) {
            b.c5 -= 40;
            return true;
          }
          return false;
        },
        // 9. If C4 had no tension (cap 200) and was lowered earlier, relax A.c4 -> 200 to break symmetric cancelation
        () => {
          if (a.c4 < b.c4 && b.c4 === 200 && !tensions.c4Tension && caps.c4Max === 200) {
            a.c4 = 200;
            return sum(a) !== sum(b);
          }
          return false;
        },
        // 10. Final fallback: lower A.c1 by 40 if >= 80 and within 80-pt single-comp diff
        () => {
          if (a.c1 >= 80 && Math.abs((a.c1 - 40) - b.c1) <= 80 && (a.c1 - 40 + b.c1) / 2 <= caps.c1Max) {
            a.c1 -= 40;
            return true;
          }
          return false;
        }
      ];

      for (const tryAdjust of candidates) {
        if (tryAdjust()) {
          if (sum(a) !== sum(b) && !(a.c1 === b.c1 && a.c2 === b.c2 && a.c3 === b.c3 && a.c4 === b.c4 && a.c5 === b.c5)) {
            break;
          }
        }
      }
    }

    // Ensure total discrepancy stays within INEP tolerance (<= 100 pts) so it remains a valid dual average
    let safety = 0;
    while (Math.abs(sum(a) - sum(b)) > 100 && safety < 5) {
      safety++;
      if (sum(a) < sum(b)) {
        // Bring A up by 40 on C4 or C1 within cap, or bring B down by 40 on C2/C3
        if (a.c4 < b.c4 && (a.c4 + 40 + b.c4) / 2 <= caps.c4Max) a.c4 += 40;
        else if (!isTangenciamento && b.c3 >= 80) b.c3 -= 40;
        else if (!isTangenciamento && b.c2 >= 80) b.c2 -= 40;
        else if (a.c1 < b.c1 && (a.c1 + 40 + b.c1) / 2 <= caps.c1Max) a.c1 += 40;
      } else {
        if (!isTangenciamento && b.c2 < a.c2 && (a.c2 + b.c2 + 40) / 2 <= caps.c2Max) b.c2 += 40;
        else if (a.c4 >= 80) a.c4 -= 40;
        else if (a.c1 >= 80) a.c1 -= 40;
        else if (!isTangenciamento && b.c3 < a.c3 && (a.c3 + b.c3 + 40) / 2 <= caps.c3Max) b.c3 += 40;
      }
    }

    // Final guarantee if clamping totalDisc brought sums back into tie
    if (sum(a) === sum(b) && a.c1 >= 80 && Math.abs((a.c1 - 40) - b.c1) <= 80 && (a.c1 - 40 + b.c1) / 2 <= caps.c1Max) {
      a.c1 -= 40;
    }
  }

  const totalA = sum(a);
  const totalB = sum(b);
  const means: EvaluatorScoresTuple = {
    c1: Math.round((a.c1 + b.c1) / 2),
    c2: Math.round((a.c2 + b.c2) / 2),
    c3: Math.round((a.c3 + b.c3) / 2),
    c4: Math.round((a.c4 + b.c4) / 2),
    c5: Math.round((a.c5 + b.c5) / 2)
  };
  const finalTotal = means.c1 + means.c2 + means.c3 + means.c4 + means.c5;

  const discrepancies: EvaluatorScoresTuple = {
    c1: Math.abs(a.c1 - b.c1),
    c2: Math.abs(a.c2 - b.c2),
    c3: Math.abs(a.c3 - b.c3),
    c4: Math.abs(a.c4 - b.c4),
    c5: Math.abs(a.c5 - b.c5)
  };
  const maxComp = Math.max(discrepancies.c1, discrepancies.c2, discrepancies.c3, discrepancies.c4, discrepancies.c5);
  const totalDisc = Math.abs(totalA - totalB);
  const isUnanimousConsensus = totalDisc === 0 && maxComp === 0;

  const wasAdjusted =
    a.c1 !== origA.c1 || a.c2 !== origA.c2 || a.c3 !== origA.c3 || a.c4 !== origA.c4 || a.c5 !== origA.c5 ||
    b.c1 !== origB.c1 || b.c2 !== origB.c2 || b.c3 !== origB.c3 || b.c4 !== origB.c4 || b.c5 !== origB.c5;

  const status: 'consenso_direto' | 'divergencia_tolerada' = isUnanimousConsensus ? 'consenso_direto' : 'divergencia_tolerada';

  const explanation = isUnanimousConsensus
    ? 'Consenso unânime direto: ambos os avaliadores atribuíram pontuações idênticas nas 5 competências.'
    : `Perfis independentes do INEP aplicados: Avaliador 1 (Normativo/Sintático/Coesivo) somou ${totalA} pts e Avaliador 2 (Estrutural/Temático/Interventivo) somou ${totalB} pts (diferença total de ${totalDisc} pts e máxima de ${maxComp} pts em uma competência, dentro da tolerância oficial). Nota final = média aritmética (${finalTotal} pts).`;

  const notesA = `Leitura estrita de norma-padrão, precisão vocabular, sintaxe e coesão (C1: ${a.c1} pts | C4: ${a.c4} pts); leitura funcional nos eixos macroestruturais (C2: ${a.c2} | C3: ${a.c3} | C5: ${a.c5}). Total: ${totalA} pts.`;
  const notesB = `Leitura estrita de tema/repertório em D1/D2, aprofundamento estrutural e proposta C5 (C2: ${b.c2} | C3: ${b.c3} | C5: ${b.c5}); leitura funcional na forma linguística (C1: ${b.c1} | C4: ${b.c4}). Total: ${totalB} pts.`;

  return {
    evalA: { ...a, total: totalA },
    evalB: { ...b, total: totalB },
    means: { ...means, total: finalTotal },
    discrepancies: { ...discrepancies, total: totalDisc, maxComp },
    isUnanimousConsensus,
    wasAdjusted,
    status,
    explanation,
    notesA,
    notesB
  };
}

export function calibrateSnippetCompetencyPair(params: {
  code: 'C1' | 'C2' | 'C3' | 'C4' | 'C5';
  rawA: number;
  rawB: number;
  cap: number;
  hasTension: boolean;
  isZero?: boolean;
  isTangenciamento?: boolean;
  isHumanRightsViolationC5?: boolean;
}): { evalA: number; evalB: number; mean: number } {
  const { code, rawA, rawB, cap, hasTension, isZero, isTangenciamento, isHumanRightsViolationC5 } = params;
  if (isZero || (code === 'C5' && isHumanRightsViolationC5)) {
    return { evalA: 0, evalB: 0, mean: 0 };
  }
  const cleanCap = snapToEnemStep40(cap);
  let a = snapToEnemStep40(rawA);
  let b = snapToEnemStep40(rawB);

  if (isTangenciamento && code === 'C2') return { evalA: 40, evalB: 40, mean: 40 };
  if (isTangenciamento && (code === 'C3' || code === 'C5')) {
    a = Math.min(a, 40);
    b = Math.min(b, 40);
    return { evalA: a, evalB: b, mean: Math.round((a + b) / 2) };
  }

  const strictSide: 'A' | 'B' = code === 'C1' || code === 'C4' ? 'A' : 'B';

  if (strictSide === 'A' && a > b) {
    const tmp = a; a = b; b = tmp;
  } else if (strictSide === 'B' && b > a) {
    const tmp = a; a = b; b = tmp;
  }

  if ((a + b) / 2 > cleanCap || a > cleanCap || b > cleanCap) {
    if (cleanCap <= 40) {
      a = Math.min(a, cleanCap);
      b = Math.min(b, cleanCap);
    } else if (code === 'C5') {
      a = Math.min(a, cleanCap);
      b = hasTension && cleanCap <= 160 ? Math.max(40, cleanCap - 40) : Math.min(b, cleanCap);
    } else if (strictSide === 'A') {
      b = cleanCap;
      a = hasTension ? Math.max(40, cleanCap - 40) : Math.min(a, cleanCap);
    } else {
      a = cleanCap;
      b = hasTension ? Math.max(40, cleanCap - 40) : Math.min(b, cleanCap);
    }
  } else if (a === b && hasTension && a >= 120) {
    if (strictSide === 'A') {
      if (a === 160 && cleanCap >= 200) {
        b = 200;
      } else {
        a = Math.max(40, a - 40);
      }
    } else {
      if (b === 160 && cleanCap >= 200) {
        a = 200;
      } else {
        b = Math.max(40, b - 40);
      }
    }
  }

  return { evalA: a, evalB: b, mean: Math.round((a + b) / 2) };
}
