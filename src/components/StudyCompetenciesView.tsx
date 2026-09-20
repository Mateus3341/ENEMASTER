import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Lightbulb, 
  Scale, 
  FileText,
  ChevronRight,
  Award,
  Sparkles,
  Layers,
  Calculator,
  HelpCircle
} from 'lucide-react';
import { OFFICIAL_COMPETENCIES_INFO } from '../data/officialData';

interface EvidenceItem {
  id: string;
  label: string;
  weight: number;
  description: string;
  isExceptionalTrigger?: boolean;
}

const COMPETENCY_EVIDENCE_MAP: Record<number, {
  pillars: { name: string; weightPercent: number; focus: string }[];
  evidenceChecklist: EvidenceItem[];
  exceptional200Condition: string;
}> = {
  1: {
    pillars: [
      { name: 'Estrutura Sintática & Períodos Complexos', weightPercent: 35, focus: 'Orações subordinadas, intercaladas e inversões sintáticas maduras' },
      { name: 'Vocabulário Erudito & Registro Culto', weightPercent: 35, focus: 'Precisão lexical, ausência de informalidade e de "o mesmo" anafórico' },
      { name: 'Controle Estrito de Desvios', weightPercent: 30, focus: 'Máximo 2 desvios leves e nenhuma falha sintática recorrente' }
    ],
    exceptional200Condition: 'Exige comprovação ativa de períodos complexos bem pontuados, vocabulário refinado e no máximo 2 desvios leves (sem reincidência). A simples ausência de erros graves pontua no máximo 160.',
    evidenceChecklist: [
      { id: 'c1-syntax-complex', label: 'Períodos complexos maduros com subordinação e intercalações bem pontuadas', weight: 40, description: 'Demonstra domínio sintático além de períodos simples e curtos', isExceptionalTrigger: true },
      { id: 'c1-vocab-erudite', label: 'Vocabulário formal culto, preciso e sem vícios de linguagem', weight: 35, description: 'Sem expressões coloquiais, sem "fazer com que", sem "o mesmo" como anafórico', isExceptionalTrigger: true },
      { id: 'c1-punct-mastery', label: 'Emprego correto de vírgulas em adjuntos adverbiais e orações explicativas', weight: 30, description: 'Ausência de vírgula entre sujeito e verbo ou antes de conjunções indevidas' },
      { id: 'c1-low-deviations', label: 'No máximo 2 desvios gramaticais/ortográficos em todo o texto', weight: 35, description: 'Rigor ortográfico e de concordância verbal/nominal', isExceptionalTrigger: true },
      { id: 'c1-no-truncation', label: 'Ausência de truncamento ou justa posição de períodos', weight: 30, description: 'Nenhum período quebrado ou emendado sem conectivo' },
      { id: 'c1-crase-regencia', label: 'Domínio de regência verbal/nominal e uso preciso da crase', weight: 30, description: 'Regências cultas corretas (implicar sem "em", visar a, aspirar a)' }
    ]
  },
  2: {
    pillars: [
      { name: 'Compreensão Integral do Tema', weightPercent: 35, focus: 'Abordagem de todas as palavras-chave e do recorte social sem tangenciamento' },
      { name: 'Repertório Sociocultural Legitimado', weightPercent: 35, focus: 'Alusões históricas, filósofos, sociólogos, dados ou legislação oficial' },
      { name: 'Produtividade Argumentativa Efetiva', weightPercent: 30, focus: 'Articulação direta e indispensável entre a alusão e a tese' }
    ],
    exceptional200Condition: 'Exige pelo menos 1 repertório legitimado pelas áreas do saber com uso 100% PRODUTIVO (que sustenta a tese). Citar frases decoradas de filósofos sem conexão orgânica limita a nota a 160 ou 120.',
    evidenceChecklist: [
      { id: 'c2-full-theme', label: 'Cobertura integral de todas as palavras-chave do tema', weight: 40, description: 'Não tangencia nem foca apenas em um aspecto parcial da proposta', isExceptionalTrigger: true },
      { id: 'c2-rep-legit', label: 'Presença de repertório legitimado por área do saber reconhecida', weight: 35, description: 'Filosofia, Sociologia, Literatura, História, Legislação, Dados estatísticos' },
      { id: 'c2-rep-productive', label: 'Repertório com uso estritamente PRODUTIVO articulado à tese', weight: 45, description: 'O repertório sustenta o argumento, não é um mero adereço estético decorado', isExceptionalTrigger: true },
      { id: 'c2-dissertative-type', label: 'Atendimento perfeito à tipologia dissertativo-argumentativa em 4 parágrafos', weight: 30, description: 'Introdução, 2 Desenvolvimentos e Conclusão equilibrados' },
      { id: 'c2-critical-depth', label: 'Reflexão sociopolítica aprofundada sobre a realidade brasileira', weight: 25, description: 'Compreensão dos impactos estruturais no contexto nacional' },
      { id: 'c2-no-senso-comum', label: 'Superação de argumentos clichês do senso comum', weight: 25, description: 'Perspectiva analítica original e madura' }
    ]
  },
  3: {
    pillars: [
      { name: 'Projeto de Texto Estratégico Bipartido', weightPercent: 35, focus: 'Tese com 2 direcionamentos claros na introdução e cumpridos em D1/D2' },
      { name: 'Encadeamento Lógico Causa-Efeito', weightPercent: 35, focus: 'Relações de causa, consequência e impacto sem saltos ou lacunas' },
      { name: 'Autoria Crítica & Não-Exposição', weightPercent: 30, focus: 'Posicionamento autoral assertivo, sem tom puramente informativo' }
    ],
    exceptional200Condition: 'Exige projeto de texto estratégico com progressão temática irrefutável e fortes marcas de autoria crítica. Apresentar dados sem desdobramento analítico limita o texto ao padrão expositivo (120 a 160).',
    evidenceChecklist: [
      { id: 'c3-bipartite-thesis', label: 'Tese explícita na introdução com dois núcleos direcionadores (D1 e D2)', weight: 40, description: 'Projeto de texto antecipa os argumentos que serão aprofundados', isExceptionalTrigger: true },
      { id: 'c3-causal-depth', label: 'Desdobramento analítico completo de causa, efeito e impacto social', weight: 40, description: 'Explica o porquê do problema e quais são suas consequências concretas', isExceptionalTrigger: true },
      { id: 'c3-author-voice', label: 'Marcas autorais de juízo de valor e posicionamento crítico assertivo', weight: 35, description: 'Uso de operadores axiológicos (nefasto, urgente, negligência, imperativo)' },
      { id: 'c3-no-logical-gap', label: 'Ausência de contradições ou lacunas argumentativas entre parágrafos', weight: 30, description: 'Todas as afirmações são justificadas com evidências' },
      { id: 'c3-thematic-progression', label: 'Progressão temática constante sem repetição circular de ideias', weight: 30, description: 'Cada parágrafo acrescenta nova camada de reflexão' },
      { id: 'c3-circular-closing', label: 'Fechamento de parágrafos com conclusão crítica sobre a tese', weight: 25, description: 'Retomada de síntese ao final de cada desenvolvimento' }
    ]
  },
  4: {
    pillars: [
      { name: 'Operadores Interparágrafos Estratégicos', weightPercent: 35, focus: 'Ao menos 2 operadores expressivos iniciando D1, D2 ou Conclusão' },
      { name: 'Coesão Intraparágrafo e Diversificação', weightPercent: 35, focus: 'Conectivos diversificados ligando todos os períodos internos' },
      { name: 'Precisão Semântica & Sem Repetições', weightPercent: 30, focus: 'Uso de anafóricos sofisticados sem repetir "além disso" ou "onde"' }
    ],
    exceptional200Condition: 'Exige operadores interparágrafos autênticos em posições estratégicas e repertório coesivo variado em todas as orações. A repetição de conectivos padrão rebaixa a nota para 120 ou 160.',
    evidenceChecklist: [
      { id: 'c4-inter-operators', label: 'Mínimo de 2 operadores interparágrafos expressivos (D1/D2 e Conclusão)', weight: 45, description: 'Ex: "Em primeiro plano,", "Outrossim,", "Sob esse viés,", "Infere-se, portanto,"', isExceptionalTrigger: true },
      { id: 'c4-intra-cohesion', label: 'Presença de recursos coesivos dentro de todos os períodos internos', weight: 35, description: 'Nenhum período solto ou justaposto sem elemento de transição', isExceptionalTrigger: true },
      { id: 'c4-varied-connectives', label: 'Amplo repertório de conectivos sem repetições viciosas', weight: 35, description: 'Alternância de conjunções causais, consecutivas, conformativas e conclusivas' },
      { id: 'c4-anaphora-mastery', label: 'Uso de mecanismos de coesão referencial (pronomes, hiperônimos, sinônimos)', weight: 30, description: 'Evita repetição exaustiva das palavras do tema' },
      { id: 'c4-semantic-precision', label: 'Conexão semântica precisa (sem conectivos em desacordo com o sentido)', weight: 30, description: 'Ex: não usar "onde" para ideias abstratas ou "contudo" para somas' },
      { id: 'c4-period-balance', label: 'Equilíbrio rítmico entre orações coordenadas e subordinadas', weight: 25, description: 'Texto fluido, sem períodos excessivamente longos ou entrecortados' }
    ]
  },
  5: {
    pillars: [
      { name: '5 Elementos Oficiais Completos', weightPercent: 40, focus: 'Agente, Ação, Meio/Modo, Efeito e Detalhamento presentes e válidos' },
      { name: 'Detalhamento Substantivo e Específico', weightPercent: 30, focus: 'Explicação adicional que torna a proposta concreta e exequível' },
      { name: 'Articulação com a Tese & Direitos Humanos', weightPercent: 30, focus: 'Resolução das causas apontadas e respeito irrestrito aos Direitos Humanos' }
    ],
    exceptional200Condition: 'Cada um dos 5 elementos válidos vale exatamente 40 pontos. A nota 200 exige os 5 elementos com detalhamento substantivo e respeito inegociável aos Direitos Humanos. Propostas genéricas ("a sociedade deve se conscientizar") não pontuam.',
    evidenceChecklist: [
      { id: 'c5-agent', label: '1. AGENTE: Órgão público ou instituição legítima responsável pela ação', weight: 40, description: 'Ex: Ministério da Educação, Poder Judiciário, Secretarias de Saúde (não nulo)', isExceptionalTrigger: true },
      { id: 'c5-action', label: '2. AÇÃO: Ação prática, afirmativa e não vaga para mitigar o problema', weight: 40, description: 'O QUE será feito (verbo de ação concreto, não "precisa se conscientizar")', isExceptionalTrigger: true },
      { id: 'c5-medium', label: '3. MEIO / MODO: O instrumento ou caminho prático de execução', weight: 40, description: 'COMO será feito (geralmente introduzido por "por meio de", "mediante")', isExceptionalTrigger: true },
      { id: 'c5-effect', label: '4. FINALIDADE / EFEITO: O impacto social pretendido pela medida', weight: 40, description: 'PARA QUE será feito (introduzido por "a fim de", "com o intuito de")', isExceptionalTrigger: true },
      { id: 'c5-detail', label: '5. DETALHAMENTO: Explicação adicional de um dos 4 elementos acima', weight: 40, description: 'Explicitação de função do agente, exemplo de ação ou desdobramento do meio', isExceptionalTrigger: true },
      { id: 'c5-human-rights', label: 'Respeito irrestrito aos Direitos Humanos (requisito eliminatório)', weight: 0, description: 'Violação zera a competência 5 imediatamente' }
    ]
  }
};

export const StudyCompetenciesView: React.FC = () => {
  const [selectedCompNum, setSelectedCompNum] = useState<number>(1);
  const [activeSubTab, setActiveSubTab] = useState<'guide' | 'simulator'>('guide');
  const [selectedEvidences, setSelectedEvidences] = useState<Record<string, boolean>>({});

  const selectedComp = OFFICIAL_COMPETENCIES_INFO.find(c => c.number === selectedCompNum) || OFFICIAL_COMPETENCIES_INFO[0];
  const compEvidenceData = COMPETENCY_EVIDENCE_MAP[selectedCompNum] || COMPETENCY_EVIDENCE_MAP[1];

  const handleToggleEvidence = (id: string) => {
    setSelectedEvidences(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Dynamic simulation score calculation based on weighted evidence
  const simulatedScore = useMemo(() => {
    if (selectedCompNum === 5) {
      // C5 is strict: 40 points per valid element
      let validElements = 0;
      if (selectedEvidences['c5-agent']) validElements++;
      if (selectedEvidences['c5-action']) validElements++;
      if (selectedEvidences['c5-medium']) validElements++;
      if (selectedEvidences['c5-effect']) validElements++;
      if (selectedEvidences['c5-detail']) validElements++;
      return validElements * 40;
    }

    const items = compEvidenceData.evidenceChecklist;
    const checkedItems = items.filter(it => selectedEvidences[it.id]);
    const exceptionalCount = checkedItems.filter(it => it.isExceptionalTrigger).length;

    const totalWeight = items.reduce((acc, it) => acc + it.weight, 0);
    const checkedWeight = checkedItems.reduce((acc, it) => acc + it.weight, 0);
    const ratio = totalWeight > 0 ? checkedWeight / totalWeight : 0;

    // Strict 200 rule: Requires all exceptional triggers plus high overall ratio
    if (ratio >= 0.85 && exceptionalCount >= 3) {
      return 200;
    } else if (ratio >= 0.65) {
      return 160;
    } else if (ratio >= 0.45) {
      return 120;
    } else if (ratio >= 0.25) {
      return 80;
    } else if (ratio > 0) {
      return 40;
    }
    return 0;
  }, [selectedCompNum, selectedEvidences, compEvidenceData]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                <BookOpen className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Matriz de Avaliação & Evidências Qualitativas (INEP)
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Guia oficial com sistema de pontuação ponderada. <strong>A Nota 200 não é o padrão</strong> e exige comprovação explícita de excelência.
            </p>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
            <button
              onClick={() => setActiveSubTab('guide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'guide'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guia Teórico Oficial</span>
            </button>
            <button
              onClick={() => setActiveSubTab('simulator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'simulator'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Simulador de Evidências</span>
            </button>
          </div>
        </div>
      </div>

      {/* Competency Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
        {OFFICIAL_COMPETENCIES_INFO.map((comp) => {
          const isSelected = comp.number === selectedCompNum;
          return (
            <button
              key={comp.number}
              id={`study-tab-comp-${comp.number}`}
              onClick={() => setSelectedCompNum(comp.number)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-2 ring-indigo-200 dark:ring-indigo-800 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  Comp {comp.number}
                </span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">0 a 200 pts</span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                {comp.title}
              </p>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: OFFICIAL GUIDE VIEW */}
      {/* ========================================================================= */}
      {activeSubTab === 'guide' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-8">
          {/* Title & Official Description */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 text-xs font-black">
                COMPETÊNCIA {selectedComp.number}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {selectedComp.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedComp.description}
            </p>
          </div>

          {/* New: Weighted Evidence Pillars Card */}
          <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-extrabold text-sm">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Pilares Ponderados de Evidência Qualitativa (INEP)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-200/80 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100 self-start sm:self-auto">
                Soma Ponderada
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {compEvidenceData.pillars.map((pillar, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{pillar.name}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      Peso {pillar.weightPercent}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {pillar.focus}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-indigo-200/60 dark:border-indigo-900 text-xs text-indigo-950 dark:text-indigo-200 flex items-start gap-2">
              <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong>Regra de Ouro da Nota 200:</strong> {compEvidenceData.exceptional200Condition}
              </div>
            </div>
          </div>

          {/* Level Grading Matrix Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Matriz Oficial de Níveis e Pontuação</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 font-bold">
                    <th className="p-3 w-20">Nível</th>
                    <th className="p-3 w-24">Pontos</th>
                    <th className="p-3">Descritor Oficial do INEP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedComp.levels.map((lvl) => (
                    <tr 
                      key={lvl.level}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        lvl.score === 200 ? 'bg-emerald-50/30 dark:bg-emerald-950/20' : lvl.score === 0 ? 'bg-rose-50/30 dark:bg-rose-950/20' : ''
                      }`}
                    >
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Nível {lvl.level}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded font-extrabold text-[11px] ${
                          lvl.score === 200 ? 'bg-emerald-600 text-white' :
                          lvl.score >= 160 ? 'bg-blue-600 text-white' :
                          lvl.score >= 120 ? 'bg-amber-500 text-white' :
                          lvl.score >= 80 ? 'bg-orange-500 text-white' : 'bg-rose-600 text-white'
                        }`}>
                          {lvl.score} pts
                        </span>
                      </td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        {lvl.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Common Traps / O que faz perder pontos */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-rose-800 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Erros Recorrentes & O que faz perder pontos</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedComp.commonMistakes.map((mistake, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-800/60 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ✕
                  </span>
                  <span className="leading-relaxed">{mistake}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Tips / Como garantir 200 pontos */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Estratégia Pedagógica para Atingir a Nota Máxima (200 pts)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedComp.keyTips.map((tip, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* INEP Warning Box */}
          <div className="p-5 rounded-xl bg-slate-900 text-white space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              <span>Aviso Fundamental dos Corretores do INEP</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedComp.number === 1 && "Na C1, a contagem de falhas é matemática: mais de 2 desvios ou mais de 1 falha de estrutura sintática (truncamento / justa posição) rebaixa a nota imediatamente para 160."}
              {selectedComp.number === 2 && "Na C2, 'repertório de bolso' decorado sem uso produtivo não eleva a nota a 200. O repertório DEVE ser legitimado pelas áreas do saber, pertinente ao tema e ter uso produtivo com a tese."}
              {selectedComp.number === 3 && "Na C3, não basta listar ideias. Todo argumento apresentado na tese deve ser aprofundado com desdobramento de causas e consequências críticas, demonstrando autoria genuína."}
              {selectedComp.number === 4 && "Na C4, é obrigatório haver ao menos dois operadores argumentativos interparágrafos expressivos conectando o D1/D2 ou Conclusão, além de diversificação vocabular intraparágrafo."}
              {selectedComp.number === 5 && "Na C5, cada um dos 5 elementos (Agente, Ação, Meio/Modo, Finalidade, Detalhamento) vale exatamente 40 pontos. O respeito aos Direitos Humanos é inegociável."}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: INTERACTIVE EVIDENCE SIMULATOR */}
      {/* ========================================================================= */}
      {activeSubTab === 'simulator' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 text-xs font-black">
                  AUDITORIA DINÂMICA
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Simulador de Evidências: Competência {selectedComp.number}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Marque os itens comprovados no seu rascunho para calcular a pontuação ponderada real:
              </p>
            </div>

            {/* Score Result Gauge */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nota Simulada</span>
                <span className={`text-2xl font-black ${
                  simulatedScore === 200 ? 'text-emerald-600 dark:text-emerald-400' :
                  simulatedScore >= 160 ? 'text-blue-600 dark:text-blue-400' :
                  simulatedScore >= 120 ? 'text-amber-500' : 'text-rose-600'
                }`}>
                  {simulatedScore} / 200
                </span>
              </div>
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white ${
                simulatedScore === 200 ? 'bg-emerald-600' :
                simulatedScore >= 160 ? 'bg-blue-600' :
                simulatedScore >= 120 ? 'bg-amber-500' : 'bg-rose-600'
              }`}>
                {simulatedScore === 200 ? '⭐' : simulatedScore >= 160 ? 'N4' : simulatedScore >= 120 ? 'N3' : 'N2'}
              </span>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Evidências Qualitativas Observadas no Texto:
            </h4>

            <div className="grid grid-cols-1 gap-2.5">
              {compEvidenceData.evidenceChecklist.map((item) => {
                const isChecked = !!selectedEvidences[item.id];
                return (
                  <label
                    key={item.id}
                    onClick={() => handleToggleEvidence(item.id)}
                    className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all cursor-pointer select-none ${
                      isChecked
                        ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/50 dark:border-indigo-700 ring-2 ring-indigo-200 dark:ring-indigo-800/60'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5 cursor-pointer"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className={`text-xs sm:text-sm font-bold ${isChecked ? 'text-indigo-950 dark:text-indigo-200' : 'text-slate-900 dark:text-slate-100'}`}>
                          {item.label}
                        </span>
                        {item.isExceptionalTrigger && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            Gatilho de Nota 200
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Diagnostic Note */}
          <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
            simulatedScore === 200 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200'
              : 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200'
          }`}>
            <p className="font-bold mb-1">
              {simulatedScore === 200 ? '🎉 Nível 5 Conquistado com Evidência Positiva:' : '💡 Diagnóstico da Banca Avaliadora:'}
            </p>
            <p>
              {simulatedScore === 200 
                ? 'Seu texto reuniu as evidências de maturidade necessárias para a nota máxima 200 nesta competência.'
                : `Com essa configuração de evidências, a nota estimada é de ${simulatedScore} pontos. Para avançar para os 200 pontos, garanta todos os "Gatilhos de Nota 200" e elimine qualquer falha de suporte argumentativo ou sintático.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
