import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Copy, 
  Check, 
  FileText, 
  ShieldCheck,
  Calendar,
  Sparkles,
  User,
  Quote
} from 'lucide-react';
import { NOTA_1000_SAMPLES } from '../data/officialData';

interface Nota1000ExamplesViewProps {
  onSendToCorrection: (text: string, theme: string) => void;
}

const AVAILABLE_YEARS = ['Todos', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];

export const Nota1000ExamplesView: React.FC<Nota1000ExamplesViewProps> = ({ onSendToCorrection }) => {
  const [selectedYear, setSelectedYear] = useState<string>('Todos');
  const [selectedSampleId, setSelectedSampleId] = useState<string>(NOTA_1000_SAMPLES[0].id);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const filteredSamples = useMemo(() => {
    if (selectedYear === 'Todos') return NOTA_1000_SAMPLES;
    return NOTA_1000_SAMPLES.filter(s => s.year === selectedYear);
  }, [selectedYear]);

  // Se a redação selecionada não estiver nos filtrados, seleciona a primeira da lista filtrada
  const currentSample = useMemo(() => {
    const found = filteredSamples.find(s => s.id === selectedSampleId);
    return found || filteredSamples[0] || NOTA_1000_SAMPLES[0];
  }, [filteredSamples, selectedSampleId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSample.fullText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const wordCount = useMemo(() => {
    return currentSample.fullText.trim().split(/\s+/).length;
  }, [currentSample]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                <Award className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Banco de Redações Nota 1000 (2018 – 2025)
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              Acervo oficial com redações reais das Cartilhas do INEP e Cartilhas de Redação Nota 1000, com comentários analíticos das 5 competências.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{NOTA_1000_SAMPLES.length} Modelos Oficiais</span>
            </span>
          </div>
        </div>
      </div>

      {/* Year Filter Buttons */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <Calendar className="w-4 h-4" />
          <span>Filtrar por Edição do ENEM (2018 – 2025):</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {AVAILABLE_YEARS.map(yr => (
            <button
              key={yr}
              id={`filter-year-${yr}`}
              onClick={() => {
                setSelectedYear(yr);
                const matching = yr === 'Todos' ? NOTA_1000_SAMPLES : NOTA_1000_SAMPLES.filter(s => s.year === yr);
                if (matching.length > 0) {
                  setSelectedSampleId(matching[0].id);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedYear === yr
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {yr === 'Todos' ? 'Todas as Edições' : `ENEM ${yr}`}
            </button>
          ))}
        </div>
      </div>

      {/* Sample Selector Cards / Tabs for the Selected Year */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {filteredSamples.map(s => (
          <button
            key={s.id}
            id={`sample-tab-${s.id}`}
            onClick={() => setSelectedSampleId(s.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold text-left whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              currentSample.id === s.id
                ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-500/30'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
              {s.year}
            </span>
            <span>{s.author.split('(')[0].trim()}</span>
          </button>
        ))}
      </div>

      {/* Main Selected Essay Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Essay Content */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 text-xs font-black">
                  NOTA 1000 (ENEM {currentSample.year})
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <User className="w-3.5 h-3.5" />
                  {currentSample.author}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">• {wordCount} palavras</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-2">
                {currentSample.theme}
              </h2>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                id="btn-copy-sample-text"
                onClick={handleCopy}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copySuccess ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copySuccess ? 'Copiado!' : 'Copiar'}</span>
              </button>

              <button
                id="btn-send-to-correction"
                onClick={() => onSendToCorrection(currentSample.fullText, currentSample.theme)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <FileText className="w-4 h-4" />
                <span>Auditar no Corretor</span>
              </button>
            </div>
          </div>

          {/* Paragraphs */}
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block">
                1. Introdução (Contextualização + Tese)
              </span>
              <p className="font-serif text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed text-justify">
                {currentSample.paragraphs.intro}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block">
                2. Desenvolvimento 1 (Causa 1 + Repertório Produtivo)
              </span>
              <p className="font-serif text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed text-justify">
                {currentSample.paragraphs.d1}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block">
                3. Desenvolvimento 2 (Operador Interparágrafo + Causa 2)
              </span>
              <p className="font-serif text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed text-justify">
                {currentSample.paragraphs.d2}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block">
                4. Conclusão (Proposta de Intervenção com 5 Elementos)
              </span>
              <p className="font-serif text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed text-justify">
                {currentSample.paragraphs.conclusion}
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Official INEP Commentary */}
        <div className="space-y-6">
          <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-2xl p-6 shadow-sm space-y-4 border border-slate-800 dark:border-slate-700">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Por que esta redação tirou 1000?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentSample.officialCommentary}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <Quote className="w-4 h-4 text-indigo-500" />
              <h4>Repertórios Socioculturais deste texto:</h4>
            </div>
            <div className="space-y-2">
              {currentSample.repertoriosHighlighted.map((rep, i) => (
                <div key={i} className="p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-950 dark:text-indigo-200 font-medium">
                  • {rep}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
