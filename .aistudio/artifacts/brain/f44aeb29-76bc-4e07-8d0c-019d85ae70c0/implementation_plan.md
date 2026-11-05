# Simplificação e Clareza Visual dos Resultados (Corretor & Treino de Trechos)

Reformulação da apresentação dos resultados no **Corretor Especializado** e no **Treino de Trechos** para tornar a leitura direta, visual e de fácil compreensão para o estudante — destacando claramente o que ele acertou, o que errou, as citações originais ao lado de suas respectivas melhorias e um Log de Auditoria enriquecido com mais evidências textuais — **sem alterar absolutamente nada no motor de avaliação e cálculo de notas**.

## User Review & Critical Decisions

> [!IMPORTANT]
> As decisões abaixo refletem fielmente suas orientações e confirmações:

- **Decisão Confirmada 1 — Intocabilidade do Motor de Avaliação e Topo/Fundo do Corretor**:
  - O motor de correção, cálculo de notas, validadores e chamadas de IA permanecem **100% inalterados**.
  - No Corretor Especializado, os cartões de notas no topo (Avaliador 1, Avaliador 2, Nota Oficial), a tabela comparativa inicial das 5 competências, o cartão da redação enviada e o chat com o Professor IA no rodapé permanecem exatamente como estão.
- **Decisão Confirmada 2 — Simplificação Direta das 5 Competências (Corretor e Treino de Trechos)**:
  - Remoção dos quadros técnicos confusos (*"Interface AvaliacaoCompetencia"*, *"Regra Anti-Default 200"*, *"Soma Ponderada de Evidências Coletadas"* com pesos percentuais e micro-log repetido dentro de cada competência).
  - Novo layout direto em cada competência:
    1. **Resumo Direto (Por que você tirou esta nota)**: Explicação simples do desempenho na competência.
    2. **O que você acertou vs. O que precisa melhorar**: Dois blocos claros lado a lado (quando aplicável) mostrando os pontos positivos e o que causou desconto.
    3. **No seu texto: Onde errou e Como melhorar (Antes → Depois)**: Citações diretas da redação do aluno ao lado da sugestão de melhoria prática, com destaque visual imediato para que o aluno entenda sem esforço.
    4. **Passo prático para chegar aos 200 pontos**: Orientação direta de ação (mantendo também a tabela de desvios gramaticais na C1 e o checklist visual dos 5 elementos na C5).
- **Decisão Confirmada 3 — Log de Auditoria Mais Claro e com Mais Evidências do Texto**:
  - Manutenção do painel do **Log de Auditoria**, porém com linguagem mais clara sobre **o motivo exato da nota atribuída** e exibição de **todas as evidências e citações extraídas da redação** para aquela competência (trecho principal + citações complementares + desvios/elementos auditados).
- **Decisão Confirmada 4 — Curva Estatística Simplificada + Remoção da Segunda Tabela Duplicada de Duplo Avaliador**:
  - Manutenção da **Curva Estatística de Alto Desempenho**, mas com textos simplificados e fáceis de entender (sem jargões como *"Gating de Nota"* ou *"Portas de Evidência"* complexas).
  - Remoção do bloco redundante de *"Simulação de Auditoria com Duplo Avaliador"* no meio da página (já exibido na tabela principal do topo).
- **Decisão Confirmada 5 — Atualização do Benchmarking (Cartilha 2025/2026 e Ocultação do Perfil Correlato)**:
  - Remoção do quadro **"Perfil Correlato na Cartilha"** para que o usuário não veja essa classificação técnica.
  - Atualização da referência da Cartilha Oficial para **2025/2026** (`Cartilha Oficial do Participante INEP 2025/2026`).

---

## 1. Overview & Core Concept

- **What It Does**: Substitui jargões internos de engenharia de prompt e tabelas de pesos matemáticos por explicações pedagógicas diretas, comparativos visuais *"Como você escreveu"* vs. *"Como escrever melhor"* e justificativas transparentes baseadas em trechos reais da redação do aluno.
- **Target Audience / Persona**: Estudantes que acabaram de corrigir uma redação completa ou um parágrafo no Treino de Trechos e querem bater o olho no resultado e saber imediatamente onde perderam nota e como reescrever melhor.
- **Key Value**: Redução drástica da carga cognitiva — o aluno entende seus acertos, erros e correções em segundos, sem precisar decifrar termos técnicos internos do sistema.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Leitura Rápida por Competência (C1 a C5)**: Ao expandir uma competência no Corretor ou visualizar as competências ativas no Treino de Trechos, o estudante vê três blocos limpos:
     - *Por que você recebeu esta nota* (explicação direta).
     - *Citações do seu texto & Melhorias práticas* (cartões visuais comparando o trecho citado da redação e a forma corrigida/melhorada).
     - *Como alcançar 200 pontos nesta competência*.
  2. **Consulta ao Log de Auditoria**: O estudante visualiza para cada competência todas as citações extraídas do seu texto (não apenas uma frase isolada) e uma explicação direta do motivo da nota e do que faltou para a nota máxima.
  3. **Benchmarking Cartilha 2025/2026**: O cartão de Benchmarking exibe a edição **2025/2026**, o que falta para alcançar a faixa 900+/1000 e o enquadramento nas 5 competências, sem exibir o *"Perfil Correlato na Cartilha"*.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Design editorial limpo com cartões de comparação *Antes (Rosa suave) → Depois (Esmeralda suave)* para que os erros e suas correções saltem aos olhos instantaneamente.
  - *Color Palette & Mood*: Respeito estrito ao tema claro/escuro existente (`slate-900`/`white`), usando `rose` para trechos com problema, `emerald` para trechos corrigidos/acertos e `indigo`/`amber` para orientações de melhoria.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Comparativo Visual "No Seu Texto → Como Melhorar" dentro das Competências**
  - *Chosen Approach*: Consolidar as citações extraídas da competência, os desvios da C1 e as reescritas pedagógicas em cartões visuais claros para que o aluno veja o trecho exato do seu texto e a melhoria correspondente sem precisar procurar em vários blocos diferentes.
  - *Why*: O usuário pediu explicitamente que as citações do erro e suas respectivas melhoras fiquem mais visíveis e exijam menos esforço mental para entender.

- **Decision 2: Enriquecimento de Evidências no Log de Auditoria**
  - *Chosen Approach*: Combinar no Log de Auditoria a citação principal (`evidenceQuoteFromStudent`), as citações adicionais coletadas na competência (`evidenceSnippets`), e os trechos específicos de desvios/elementos para mostrar múltiplos trechos reais da redação junto a uma explicação clara do motivo da nota.
  - *Why*: Atende diretamente ao pedido de colocar mais evidências do texto no Log de Auditoria e explicar o motivo da nota de forma mais clara.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌──────────────────────────────────────────────────────────────────────────┐
│              Motor de Avaliação & Notas (100% INALTERADO)                │
│     • Mesmas rotas, mesmos cálculos, mesmas notas e mesmas estruturas    │
└───────────────────┬──────────────────────────────────┬───────────────────┘
                    │                                  │
                    ▼                                  ▼
┌──────────────────────────────────────┐  ┌────────────────────────────────┐
│   Corretor Especializado (UI Output) │  │   Treino de Trechos (UI Output)│
│                                      │  │                                │
│ 1. Topo, Tabela Inicial e Redação    │  │ 1. Notas e Resumo do Trecho    │
│    (Mantidos idênticos)              │  │    (Mantidos idênticos)        │
│ 2. Detalhamento C1-C5 Simplificado:  │  │ 2. Competências Simplificadas: │
│    • Motivo simples da nota          │  │    • Motivo claro da nota      │
│    • O que acertou / O que errou     │  │    • Citação do texto e        │
│    • Citação do erro → Melhoria      │  │      O que melhorar            │
│    • Como chegar aos 200 pts         │  │    • Como chegar aos 200 pts   │
│ 3. Log de Auditoria Enriquecido:     │  └────────────────────────────────┘
│    • Múltiplas evidências do texto   │
│    • Motivo da nota em linguagem     │
│      clara e direta                  │
│ 4. Curva Estatística Simplificada    │
│ 5. Benchmarking Cartilha 2025/2026   │
│    (Sem "Perfil Correlato")          │
│ 6. Professor IA no Fundo (Idêntico)  │
└──────────────────────────────────────┘
```

- **Data Model & State**:
  - Nenhuma alteração nos tipos de saída da API ou na lógica de validação de notas (`scoreValidator.ts` e rotas de correção em `server.ts` permanecem intocados).
  - Atualização das referências textuais da Cartilha para `2025/2026` e reorganização exclusiva da camada de apresentação JSX nos componentes de visualização do resultado.
