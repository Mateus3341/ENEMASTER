import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Copy,
  Check,
  BookOpen,
  GraduationCap,
  Lightbulb,
  AlertTriangle,
  Send,
  Layers,
  FileText,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { MasterDevelopmentTip } from '../types';
import { AiProgressBar } from './AiProgressBar';
import { useAiProgress } from '../hooks/useAiProgress';

interface MasterTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  tip: MasterDevelopmentTip | null;
  isLoading: boolean;
  themeTitle: string;
  onRefresh: () => void;
  onInsertIntoDraft?: (text: string) => void;
}

export const MasterTipModal: React.FC<MasterTipModalProps> = ({
  isOpen,
  onClose,
  tip,
  isLoading,
  themeTitle,
  onRefresh,
  onInsertIntoDraft,
}) => {
  const [activeCompTab, setActiveCompTab] = useState<'all' | 'c1' | 'c2' | 'c3' | 'c4' | 'c5'>('all');
  const [copiedSection, setCopiedSection] = useState<string>('');

  const masterTipProgress = useAiProgress({
    steps: [
      'Mapeando problema central e blindagem anti-tangenciamento...',
      'Selecionando repertórios socioculturais legitimados e produtivos...',
      'Estruturando teses bipartidas e tópicos frasais para D1 e D2...',
      'Formulando operadores argumentativos e conectivos interparágrafos...',
      'Construindo intervenção padrão INEP nos 5 elementos...',
      'Consolidando esqueleto estratégico do Mestre...'
    ],
    estimatedDurationMs: 8000,
  });

  useEffect(() => {
    if (isLoading) {
      masterTipProgress.startProgress();
    } else {
      masterTipProgress.completeProgress();
    }
  }, [isLoading]);

  if (!isOpen) return null;

  const handleCopyText = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(''), 2500);
  };

  const handleCopyFullSkeleton = () => {
    if (!tip) return;
    const skeleton = `### ESQUELETO ESTRATÉGICO NOTA 1000 - ${tip.theme}

[ANÁLISE TEMÁTICA]
• Problema Central: ${tip.thematicAnalysis.coreProblem}
• Palavras-Chave Obrigatórias: ${tip.thematicAnalysis.keywordsToCover.join(', ')}
• Alerta de Tangenciamento: ${tip.thematicAnalysis.tangentRiskWarning}

[C1 - VOCABULÁRIO CULTO & SINTAXE]
• Termos-chave: ${tip.competencies.c1.formalVocabulary.join(', ')}
• Padrão sintático: ${tip.competencies.c1.syntacticPatterns.join(' | ')}

[C2 - REPERTÓRIOS LEGITIMADOS]
${tip.competencies.c2.repertoires.map((r, i) => `${i + 1}. ${r.name} (${r.area}): ${r.concept}\n   -> Como articular: ${r.articulationHook}`).join('\n')}

[C3 - PROJETO DE TEXTO & DESENVOLVIMENTO]
• D1 (${tip.competencies.c3.thesisD1.focus}):
  - Tópico Frasal: ${tip.competencies.c3.thesisD1.topicSentence}
  - Guia de Desenvolvimento: ${tip.competencies.c3.thesisD1.developmentGuide}
  - Pergunta norteadora: ${tip.competencies.c3.thesisD1.guidingQuestion}

• D2 (${tip.competencies.c3.thesisD2.focus}):
  - Tópico Frasal: ${tip.competencies.c3.thesisD2.topicSentence}
  - Guia de Desenvolvimento: ${tip.competencies.c3.thesisD2.developmentGuide}
  - Pergunta norteadora: ${tip.competencies.c3.thesisD2.guidingQuestion}

[C4 - OPERADORES ARGUMENTATIVOS & COESÃO]
• Início de Parágrafos: ${tip.competencies.c4.interparagraphConnectives.join(', ')}
• Conectivos Internos: ${tip.competencies.c4.intraparagraphConnectives.join(', ')}

[C5 - PROPOSTA DE INTERVENÇÃO COM 5 ELEMENTOS]
• Agente: ${tip.competencies.c5.interventionStructure.agent}
• Ação: ${tip.competencies.c5.interventionStructure.action}
• Meio/Modo: ${tip.competencies.c5.interventionStructure.modeMedium}
• Efeito: ${tip.competencies.c5.interventionStructure.effect}
• Detalhamento: ${tip.competencies.c5.interventionStructure.detailing}

Modelo Completo:
"${tip.competencies.c5.fullInterventionSample}"

Conselho do Mestre: ${tip.masterTakeaway}`;

    handleCopyText(skeleton, 'full_skeleton');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-transparent flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 mt-0.5">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Dica do Mestre • IA Especialista
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  Matriz Oficial INEP (5 Competências)
                </span>
                {tip?.isAiGenerated && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Gerada sob medida
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 mt-1.5 leading-snug">
                Sugestão de Desenvolvimento Estratégico
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium line-clamp-1 mt-0.5">
                Tema: <strong className="text-slate-800 dark:text-slate-200">"{themeTitle}"</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Regerar Dica do Mestre"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          {isLoading ? (
            <div className="py-6 space-y-4">
              <AiProgressBar
                isLoading={isLoading}
                progress={masterTipProgress.progress}
                currentStepIndex={masterTipProgress.currentStepIndex}
                steps={masterTipProgress.steps}
                title="O Mestre Enemaster está analisando o tema..."
                subtitle="Cruzando os critérios da matriz do INEP, repertórios de autoridade e esqueleto de intervenção"
                accentColor="amber"
                variant="card"
              />
            </div>
          ) : !tip ? (
            <div className="py-12 text-center text-slate-500">
              <p>Nenhuma dica disponível no momento. Clique no botão de atualizar.</p>
            </div>
          ) : (
            <>
              {/* Thematic Analysis Shield Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-800/80 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-extrabold text-xs uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Recorte Temático & Blindagem Anti-Tangenciamento</span>
                  </div>
                  <button
                    onClick={() => handleCopyText(tip.thematicAnalysis.coreProblem, 'core_problem')}
                    className="text-xs font-semibold text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSection === 'core_problem' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>Copiar Problema Central</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-serif text-slate-800 dark:text-slate-200 leading-relaxed">
                  <strong>Problema Central:</strong> {tip.thematicAnalysis.coreProblem}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900/60 space-y-1">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Palavras-Chave Obrigatórias no Texto:
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tip.thematicAnalysis.keywordsToCover.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[11px] font-semibold border border-amber-200 dark:border-amber-800">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900/60 space-y-1">
                    <span className="text-[11px] font-bold text-rose-800 dark:text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Alerta de Risco (O que NUNCA fazer):
                    </span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      {tip.thematicAnalysis.tangentRiskWarning}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs for Competencies */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100 dark:border-slate-800 select-none">
                {[
                  { id: 'all', label: 'Tudo (Visão Geral)' },
                  { id: 'c1', label: 'C1: Norma & Vocabulário' },
                  { id: 'c2', label: 'C2: Repertórios de Autoridade' },
                  { id: 'c3', label: 'C3: Projeto de Texto (D1 & D2)' },
                  { id: 'c4', label: 'C4: Coesão & Conectivos' },
                  { id: 'c5', label: 'C5: Proposta Nota 200' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCompTab(tab.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                      activeCompTab === tab.id
                        ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Competency 1: Norma Padrão & Sintaxe */}
              {(activeCompTab === 'all' || activeCompTab === 'c1') && (
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs">
                        C1
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                        {tip.competencies.c1.title}
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">Tolerância: máx. 2 desvios</span>
                  </div>

                  {/* Vocabulary Chips */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Vocabulário Formal & Específico para este Tema:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {tip.competencies.c1.formalVocabulary.map((word, i) => (
                        <button
                          key={i}
                          onClick={() => handleCopyText(word, `vocab_${i}`)}
                          title="Clique para copiar"
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-600 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>{word}</span>
                          {copiedSection === `vocab_${i}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-2.5 h-2.5 text-slate-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Syntactic Patterns */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Estruturas Sintáticas Recomendadas (Garante 200 pts):
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                      {tip.competencies.c1.syntacticPatterns.map((pat, i) => (
                        <li key={i}>{pat}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-200 font-medium">
                    💡 <strong>Dica de Ouro C1:</strong> {tip.competencies.c1.goldTip}
                  </div>
                </div>
              )}

              {/* Competency 2: Repertórios Socioculturais */}
              {(activeCompTab === 'all' || activeCompTab === 'c2') && (
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold text-xs">
                        C2
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                        {tip.competencies.c2.title}
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">3 Repertórios Legitimados</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {tip.competencies.c2.repertoires.map((rep, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{rep.name}</span>
                            <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-semibold text-[10px]">
                              {rep.area}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                            <strong>Conceito:</strong> {rep.concept}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                          <p className="text-blue-900 dark:text-blue-300 bg-blue-50/70 dark:bg-blue-950/40 p-2 rounded-lg text-[11px] border border-blue-100 dark:border-blue-900">
                            <strong>Gancho Produtivo:</strong> {rep.articulationHook}
                          </p>
                          <button
                            onClick={() => handleCopyText(`${rep.name} (${rep.area}): ${rep.concept} — Como articular: ${rep.articulationHook}`, `rep_${idx}`)}
                            className="w-full py-1.5 rounded-lg bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border text-slate-700 dark:text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            {copiedSection === `rep_${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedSection === `rep_${idx}` ? 'Copiado!' : 'Copiar Repertório'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 font-medium">
                    💡 <strong>Dica de Ouro C2:</strong> {tip.competencies.c2.goldTip}
                  </div>
                </div>
              )}

              {/* Competency 3: Projeto de Texto & Teses (D1 & D2) */}
              {(activeCompTab === 'all' || activeCompTab === 'c3') && (
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-xs">
                        C3
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                        {tip.competencies.c3.title}
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">Tese Bipartida (D1 + D2)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* D1 */}
                    <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300">
                          {tip.competencies.c3.thesisD1.focus}
                        </span>
                        <button
                          onClick={() => handleCopyText(tip.competencies.c3.thesisD1.topicSentence, 'd1_topic')}
                          className="text-xs font-semibold text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {copiedSection === 'd1_topic' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>Copiar</span>
                        </button>
                      </div>

                      <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 text-xs font-serif text-slate-800 dark:text-slate-200">
                        <strong>Tópico Frasal Sugerido:</strong> "{tip.competencies.c3.thesisD1.topicSentence}"
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        <strong>Desdobramento Crítico:</strong> {tip.competencies.c3.thesisD1.developmentGuide}
                      </p>

                      <div className="p-2.5 rounded-lg bg-amber-100/60 dark:bg-amber-950 text-[11px] text-amber-900 dark:text-amber-300">
                        ❓ <strong>Pergunta Norteadora:</strong> {tip.competencies.c3.thesisD1.guidingQuestion}
                      </div>
                    </div>

                    {/* D2 */}
                    <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300">
                          {tip.competencies.c3.thesisD2.focus}
                        </span>
                        <button
                          onClick={() => handleCopyText(tip.competencies.c3.thesisD2.topicSentence, 'd2_topic')}
                          className="text-xs font-semibold text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {copiedSection === 'd2_topic' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>Copiar</span>
                        </button>
                      </div>

                      <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 text-xs font-serif text-slate-800 dark:text-slate-200">
                        <strong>Tópico Frasal Sugerido:</strong> "{tip.competencies.c3.thesisD2.topicSentence}"
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        <strong>Desdobramento Crítico:</strong> {tip.competencies.c3.thesisD2.developmentGuide}
                      </p>

                      <div className="p-2.5 rounded-lg bg-amber-100/60 dark:bg-amber-950 text-[11px] text-amber-900 dark:text-amber-300">
                        ❓ <strong>Pergunta Norteadora:</strong> {tip.competencies.c3.thesisD2.guidingQuestion}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 font-medium">
                    💡 <strong>Dica de Ouro C3:</strong> {tip.competencies.c3.goldTip}
                  </div>
                </div>
              )}

              {/* Competency 4: Coesão & Conectivos */}
              {(activeCompTab === 'all' || activeCompTab === 'c4') && (
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs">
                        C4
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                        {tip.competencies.c4.title}
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">Mín. 2 operadores interparágrafos</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Conectivos Interparágrafos (D2 e Conclusão):
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                        {tip.competencies.c4.interparagraphConnectives.map((c, i) => (
                          <li key={i} className="font-mono bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Conectivos Intraparágrafos (No meio das orações):
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                        {tip.competencies.c4.intraparagraphConnectives.map((c, i) => (
                          <li key={i} className="font-mono bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                    💡 <strong>Dica de Ouro C4:</strong> {tip.competencies.c4.goldTip}
                  </div>
                </div>
              )}

              {/* Competency 5: Proposta de Intervenção Completa */}
              {(activeCompTab === 'all' || activeCompTab === 'c5') && (
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold text-xs">
                        C5
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                        {tip.competencies.c5.title}
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">5 Elementos Obrigatórios (40 x 5 = 200 pts)</span>
                  </div>

                  {/* 5 Elements Breakdown Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                      <span className="font-bold text-purple-900 dark:text-purple-300 block">1. Agente (Quem?):</span>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">{tip.competencies.c5.interventionStructure.agent}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                      <span className="font-bold text-purple-900 dark:text-purple-300 block">2. Ação (O que fará?):</span>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">{tip.competencies.c5.interventionStructure.action}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                      <span className="font-bold text-purple-900 dark:text-purple-300 block">3. Meio / Modo (Como fará?):</span>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">{tip.competencies.c5.interventionStructure.modeMedium}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                      <span className="font-bold text-purple-900 dark:text-purple-300 block">4. Efeito (Para que fim?):</span>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">{tip.competencies.c5.interventionStructure.effect}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50/80 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 space-y-1 sm:col-span-2">
                      <span className="font-bold text-purple-900 dark:text-purple-300 block">5. Detalhamento (Explicação de 1 elemento):</span>
                      <p className="text-purple-950 dark:text-purple-200 font-medium">{tip.competencies.c5.interventionStructure.detailing}</p>
                    </div>
                  </div>

                  {/* Ready-to-use Sample */}
                  <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                        Modelo Textual Completo da Proposta de Intervenção:
                      </span>
                      <button
                        onClick={() => handleCopyText(tip.competencies.c5.fullInterventionSample, 'c5_sample')}
                        className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSection === 'c5_sample' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>Copiar Proposta</span>
                      </button>
                    </div>
                    <p className="font-serif text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed">
                      "{tip.competencies.c5.fullInterventionSample}"
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/60 text-xs text-purple-900 dark:text-purple-200 font-medium">
                    💡 <strong>Dica de Ouro C5:</strong> {tip.competencies.c5.goldTip}
                  </div>
                </div>
              )}

              {/* Master's Final Takeaway */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-transparent border border-amber-300 dark:border-amber-700/60 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 shrink-0 mt-0.5">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    Palavra Final do Mestre Enemaster
                  </h4>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed">
                    "{tip.masterTakeaway}"
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 sm:px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyFullSkeleton}
              disabled={isLoading || !tip}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
            >
              {copiedSection === 'full_skeleton' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSection === 'full_skeleton' ? 'Esqueleto Copiado!' : 'Copiar Esqueleto Completo'}</span>
            </button>

            {onInsertIntoDraft && tip && (
              <button
                onClick={() => {
                  const draftOutline = `[PROJETO DE TEXTO: ${tip.theme}]\n\n` +
                    `1. INTRODUÇÃO:\n- Contexto: ${tip.competencies.c2.repertoires[0]?.name || 'Repertório'}\n` +
                    `- Tese D1: ${tip.competencies.c3.thesisD1.focus}\n` +
                    `- Tese D2: ${tip.competencies.c3.thesisD2.focus}\n\n` +
                    `2. DESENVOLVIMENTO 1:\n${tip.competencies.c3.thesisD1.topicSentence}\n\n` +
                    `3. DESENVOLVIMENTO 2:\n${tip.competencies.c3.thesisD2.topicSentence}\n\n` +
                    `4. CONCLUSÃO (C5):\n${tip.competencies.c5.fullInterventionSample}`;
                  onInsertIntoDraft(draftOutline);
                  onClose();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Maximize2 className="w-4 h-4 text-amber-300" />
                <span>Inserir no Modo Foco</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-slate-950 transition-colors cursor-pointer"
          >
            Fechar Guia
          </button>
        </div>
      </div>
    </div>
  );
};
