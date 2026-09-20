import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  X, 
  Copy, 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  GraduationCap, 
  Lightbulb, 
  RefreshCw,
  Layers,
  HelpCircle,
  Zap
} from 'lucide-react';
import { SynonymResponse, SynonymItem } from '../types';
import { AiProgressBar } from './AiProgressBar';
import { useAiProgress } from '../hooks/useAiProgress';
import { CURATED_OFFLINE_SYNONYMS } from '../data/curatedSynonyms';

interface SynonymDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWord?: string;
  contextSentence?: string;
  theme?: string;
  themeTitle?: string;
  onReplaceInDraft?: (oldWord: string, newWord: string) => void;
}

const QUICK_SEARCH_CHIPS = [
  { word: 'coisa', desc: 'Vaguidade lexical' },
  { word: 'problema', desc: 'Repetição excessiva' },
  { word: 'fazer', desc: 'Ação genérica' },
  { word: 'ajudar', desc: 'Assistencialismo' },
  { word: 'muito', desc: 'Intensidade informal' },
  { word: 'mostrar', desc: 'Verbo comum' },
  { word: 'ruim', desc: 'Oralidade' },
  { word: 'importante', desc: 'Clichê' },
  { word: 'mudar', desc: 'Ação superficial' },
  { word: 'sociedade', desc: 'Generalização' },
  { word: 'grande', desc: 'Imprecisão' },
  { word: 'governo', desc: 'Agente sem detalhamento' },
  { word: 'ter', desc: 'Uso coloquial no lugar de haver' },
  { word: 'hoje em dia', desc: 'Marca de oralidade' },
  { word: 'ver', desc: 'Construção pessoal' },
  { word: 'bom', desc: 'Adjetivo vago' },
];

// In-memory client cache to make repeated searches instant
const clientSynonymCache = new Map<string, SynonymResponse>();

export const SynonymDictionaryModal: React.FC<SynonymDictionaryModalProps> = ({
  isOpen,
  onClose,
  initialWord = '',
  contextSentence = '',
  theme = '',
  themeTitle = '',
  onReplaceInDraft,
}) => {
  const effectiveTheme = theme || themeTitle || '';
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<SynonymResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [copiedWord, setCopiedWord] = useState<string | null>(null);
  const [replacedSuccessWord, setReplacedSuccessWord] = useState<string | null>(null);
  const activeAbortControllerRef = useRef<AbortController | null>(null);

  const synonymProgress = useAiProgress({
    steps: [
      'Consultando vocabulário culto na Matriz C1...',
      'Analisando regência, semântica e sofisticação...',
      'Mapeando exemplos em parágrafos nota 1000...',
      'Consolidando lista de alternativas formais...'
    ],
    estimatedDurationMs: 4500,
  });

  // Fetch when modal opens or initialWord changes
  useEffect(() => {
    if (isOpen && initialWord && initialWord.trim()) {
      const clean = initialWord.trim().replace(/^[^\wáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+|[^\wáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+$/g, '');
      if (clean) {
        setSearchTerm(clean);
        fetchSynonyms(clean, contextSentence);
      }
    } else if (isOpen && (!data || !searchTerm)) {
      setSearchTerm('coisa');
      fetchSynonyms('coisa', '');
    }
  }, [isOpen, initialWord]);

  // Handle ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const fetchSynonyms = async (wordToQuery: string, sentenceCtx: string = '', forceAi: boolean = false) => {
    const cleanWord = wordToQuery.trim().replace(/^[^\wáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+|[^\wáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+$/g, '');
    if (!cleanWord) return;

    const lowerWord = cleanWord.toLowerCase();
    const cacheKey = `${lowerWord}_${(sentenceCtx || '').trim().slice(0, 30)}_${(effectiveTheme || '').trim().slice(0, 30)}`;

    // 1. Instant Cache Check (0ms latency)
    if (!forceAi && clientSynonymCache.has(cacheKey)) {
      setData(clientSynonymCache.get(cacheKey)!);
      setIsLoading(false);
      setErrorMsg('');
      return;
    }

    // 2. Instant Curated Dictionary Check (0ms latency for common words when without custom sentence context)
    if (!forceAi && !sentenceCtx && CURATED_OFFLINE_SYNONYMS[lowerWord]) {
      const curatedResult = CURATED_OFFLINE_SYNONYMS[lowerWord];
      clientSynonymCache.set(cacheKey, curatedResult);
      setData(curatedResult);
      setIsLoading(false);
      setErrorMsg('');
      return;
    }

    // Cancel any ongoing fetch to avoid race conditions and stale requests
    if (activeAbortControllerRef.current) {
      activeAbortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    activeAbortControllerRef.current = abortController;

    setIsLoading(true);
    setErrorMsg('');
    setReplacedSuccessWord(null);
    synonymProgress.startProgress();

    try {
      const res = await fetch('/api/synonyms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
        body: JSON.stringify({
          word: cleanWord,
          contextSentence: sentenceCtx,
          theme: effectiveTheme,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Erro ao consultar dicionário de sinônimos.');
      }

      // Save to client cache
      clientSynonymCache.set(cacheKey, json);
      synonymProgress.completeProgress();
      setData(json);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      synonymProgress.resetProgress();
      
      // Fallback: If network fails, check if we have a curated entry
      if (CURATED_OFFLINE_SYNONYMS[lowerWord]) {
        setData(CURATED_OFFLINE_SYNONYMS[lowerWord]);
      } else {
        setErrorMsg(err.message || 'Não foi possível carregar os sinônimos.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchSynonyms(searchTerm.trim(), '');
    }
  };

  const handleCopy = (wordToCopy: string) => {
    navigator.clipboard.writeText(wordToCopy);
    setCopiedWord(wordToCopy);
    setTimeout(() => setCopiedWord(null), 2000);
  };

  const handleReplace = (newWord: string) => {
    if (onReplaceInDraft && data) {
      onReplaceInDraft(data.baseWord, newWord);
      setReplacedSuccessWord(newWord);
      setTimeout(() => setReplacedSuccessWord(null), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/80 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">
                  Dicionário de Sinônimos Formais
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Competência 1 ENEM
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Substitua palavras informais, repetitivas ou vagas por vocábulos eruditos de alto padrão dissertativo.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fechar (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Quick Chips Bar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
          <form onSubmit={handleManualSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite uma palavra para buscar sinônimos formais (ex: problema, fazer, coisa)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchTerm.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>Consultar IA</span>
            </button>
          </form>

          {/* Quick Selection Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mr-1">
              Mais consultadas na C1:
            </span>
            {QUICK_SEARCH_CHIPS.map((chip) => (
              <button
                key={chip.word}
                type="button"
                onClick={() => {
                  setSearchTerm(chip.word);
                  fetchSynonyms(chip.word, '');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  data?.baseWord.toLowerCase() === chip.word.toLowerCase()
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {chip.word}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isLoading ? (
            <div className="py-8">
              <AiProgressBar
                isLoading={isLoading}
                progress={synonymProgress.progress}
                currentStepIndex={synonymProgress.currentStepIndex}
                steps={synonymProgress.steps}
                title={`Consultando Sinônimos Formais para "${searchTerm}"...`}
                subtitle="Classificando vocabulário culto, regência e prevenção de desvios na C1"
                accentColor="indigo"
                variant="card"
              />
            </div>
          ) : data ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Word Header Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/60 via-slate-50/50 to-white dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-900 border border-indigo-100 dark:border-slate-700/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl font-serif font-black text-indigo-950 dark:text-indigo-200 tracking-tight">
                      "{data.baseWord}"
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {data.grammaticalClass}
                    </span>
                  </div>

                  {data.isAiGenerated ? (
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> IA Gramatical C1
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Instantâneo (0ms)
                      </span>
                      <button
                        type="button"
                        onClick={() => fetchSynonyms(data.baseWord, contextSentence, true)}
                        className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Reanalisar com IA para gerar novos sinônimos customizados"
                      >
                        <Sparkles className="w-3 h-3" /> Refinar com IA
                      </button>
                    </div>
                  )}
                </div>

                {/* Why avoid & C1 value */}
                {data.avoidReasonC1 && (
                  <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Diagnóstico na Competência 1: </strong>
                      <span>{data.avoidReasonC1}</span>
                    </div>
                  </div>
                )}

                {/* Master grammar / regency tip */}
                {data.c1GrammarTip && (
                  <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 text-xs text-indigo-950 dark:text-indigo-200 flex items-start gap-2.5">
                    <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Dica de Regência / Gramática C1: </strong>
                      <span>{data.c1GrammarTip}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Replaced notice if triggered */}
              {replacedSuccessWord && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Substituído com sucesso no rascunho por "{replacedSuccessWord}"!</span>
                </div>
              )}

              {/* List of Synonyms */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Sinônimos Recomendados ({data.synonyms.length})</span>
                  </h4>
                  {onReplaceInDraft && (
                    <span className="text-[11px] text-slate-400">
                      Clique em "Substituir" para trocar direto na sua redação
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {data.synonyms.map((syn, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs transition-all space-y-3"
                    >
                      {/* Top Row: Word & Formality Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg font-serif font-black text-slate-900 dark:text-white">
                            {syn.word}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            syn.formalityLevel === 'Erudito / Alto Padrão'
                              ? 'bg-purple-50 dark:bg-purple-950/70 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'
                              : syn.formalityLevel === 'Técnico / Jurídico / Filosófico'
                              ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                              : 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                          }`}>
                            {syn.formalityLevel}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5">
                          {onReplaceInDraft && (
                            <button
                              type="button"
                              onClick={() => handleReplace(syn.word)}
                              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Substituir a palavra selecionada no rascunho"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Substituir no Rascunho</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleCopy(syn.word)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                            title="Copiar Sinônimo"
                          >
                            {copiedWord === syn.word ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Explanation */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        <strong className="text-slate-900 dark:text-slate-100 font-semibold">Quando aplicar: </strong>
                        {syn.contextExplanation}
                      </p>

                      {/* Example in ENEM sentence */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs font-serif text-slate-800 dark:text-slate-200 italic leading-relaxed">
                        <span className="font-sans not-italic text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                          Exemplo de Período Nota 1000:
                        </span>
                        "{syn.exampleSentence}"
                      </div>

                      {/* Grammatical notes */}
                      {syn.grammaticalNotes && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <span className="font-bold text-slate-700 dark:text-slate-300">Regência & Sintaxe:</span>
                          <span>{syn.grammaticalNotes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Related formal expressions */}
              {data.relatedExpressions && data.relatedExpressions.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Locuções e Expressões Cultas Associadas:</span>
                  </h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {data.relatedExpressions.map((expr, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleCopy(expr)}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:border-indigo-400 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Clique para copiar"
                      >
                        <span>{expr}</span>
                        <Copy className="w-3 h-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/40 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <GraduationCap className="w-4 h-4 text-amber-500" />
            <span>Matriz Oficial do INEP — Padrão Culto e Precisão Lexical (C1)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
