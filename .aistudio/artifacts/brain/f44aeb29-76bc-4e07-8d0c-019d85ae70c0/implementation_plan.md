# Plano de Correção — Sincronização da "Nota Oficial a Considerar" (1000 pts) nas Redações Nota 1000 do Sistema

## Causa do Problema Identificada
Quando uma redação Nota 1000 do sistema é submetida ao Corretor:
1. O validador reconhece a redação e atribui **200 pontos em cada uma das 5 competências** (`C1 = 200`, `C2 = 200`, `C3 = 200`, `C4 = 200`, `C5 = 200`).
2. Entretanto, o card **"Nota Oficial a Considerar (Média INEP)"** e a tabela comparativa dos dois corretores calculam a nota final a partir do objeto `dualEvaluatorSimulation` (`evaluatorA` e `evaluatorB`).
3. No servidor (`server.ts`) e no cálculo final do `CorrectionView.tsx`:
   - No bloco `if (isOfficialBenchmark)` de `/api/grade-essay`, as variáveis `c1s..c5s` recebiam `200`, mas `evalA_c1..c5` e `evalB_c1..c5` não eram atualizadas para `200`, fazendo com que a linha seguinte (`finalTotal = Math.round((finalEvaluatorATotal + finalEvaluatorBTotal) / 2)`) sobrescrevesse o total com notas menores.
   - No motor de contingência (`evaluateEssayByEvidence`) e na revisão (`/api/review-score`), a flag `isOfficialNota1000Benchmark` não sincronizava `simEvalA` e `simEvalB` em `200`, gerando divergência entre os cards das 5 competências (todos em `200`) e a **"Nota Oficial a Considerar"** (que ficava abaixo de 1000).

## Alterações Planejadas (Sem Alterar o Sistema de Avaliação Existente)
Nenhuma regra, peso, critério, prompt ou penalidade do sistema de correção de redações será alterado. Faremos apenas a sincronização da nota final quando a redação for Nota 1000 do sistema ou tiver as 5 competências validadas com 200 pontos:

1. **`/server.ts` (`/api/grade-essay`, `evaluateEssayByEvidence` e `/api/review-score`)**:
   - Quando `isOfficialBenchmark` (`isOfficialNota1000Benchmark(essayText)`) for verdadeiro, garantir que `evalA_c1..c5 = 200` e `evalB_c1..c5 = 200` (totalizando `1000` em ambos os avaliadores e `0` de discrepância), evitando que `finalTotal` seja sobrescrito por valores menores.
   - Na rota `/api/review-score` (tanto no fluxo principal quanto no fallback), preservar `200` nas 5 competências e `finalAuditedTotalScore = 1000` quando `isOfficialBenchmark` for verdadeiro.

2. **`/src/components/CorrectionView.tsx`**:
   - Garantir que, quando a redação pertencer ao banco Nota 1000 do sistema (`isOfficialNota1000Benchmark`) — ou quando todas as 5 competências validadas (`c1` a `c5`) tiverem nota `200` (ou a redação vier do Criador de Redação Nota 1000 do próprio sistema) —, os placares de `evaluatorA`, `evaluatorB`, `finalOfficialScore` e `officialMeanScore` (**"Nota Oficial a Considerar"**) reflitam exatamente `200` em cada competência e **`1000 / 1000`** na nota final.
