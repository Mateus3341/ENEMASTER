import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  FileText, 
  ExternalLink, 
  Calendar, 
  Award, 
  BookOpen, 
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { EssayCorrectionResult } from '../types';

interface EssayReaderModalProps {
  essay: EssayCorrectionResult | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenFullReport?: (essay: EssayCorrectionResult) => void;
}

export const EssayReaderModal: React.FC<EssayReaderModalProps> = ({
  essay,
  isOpen,
  onClose,
  onOpenFullReport
}) => {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !essay) return null;

  const rawText = (essay.essayText || '').trim();
  const paragraphs = rawText
    ? rawText.split(/\n\s*\n+/).map(p => p.trim()).filter(Boolean)
    : [];

  const wordCount = rawText ? rawText.split(/\s+/).filter(Boolean).length : 0;
  const paragraphCount = paragraphs.length;
  const estimatedLines = Math.min(30, Math.max(1, Math.round(wordCount / 14)));

  const handleCopy = () => {
    if (!rawText) return;
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 900) return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
    if (score >= 800) return 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700';
    if (score >= 640) return 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700';
    return 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700';
  };

  const getParagraphLabel = (idx: number, total: number) => {
    if (total === 4) {
      if (idx === 0) return 'Parágrafo 1 • Introdução & Tese';
      if (idx === 1) return 'Parágrafo 2 • Desenvolvimento 1 (D1)';
      if (idx === 2) return 'Parágrafo 3 • Desenvolvimento 2 (D2)';
      if (idx === 3) return 'Parágrafo 4 • Conclusão & Proposta (C5)';
    }
    if (idx === 0) return 'Parágrafo 1 • Introdução';
    if (idx === total - 1) return `Parágrafo ${idx + 1} • Conclusão`;
    return `Parágrafo ${idx + 1} • Desenvolvimento ${idx}`;
  };

  const textClasses = {
    sm: 'text-xs sm:text-sm leading-relaxed',
    base: 'text-sm sm:text-base leading-relaxed',
    lg: 'text-base sm:text-lg leading-loose'
  }[fontSize];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {essay.date}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${getScoreColor(essay.totalScore)}`}>
                  {essay.totalScore} / 1000 pts
                </span>
                {essay.isHandwrittenOcr && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Manuscrito • OCR
                  </span>
                )}
              </div>

              <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-slate-100 leading-snug">
                {essay.theme}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              title="Fechar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Competency badges row */}
          {essay.competencies && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-100 dark:border-blue-900">
                C1: {essay.competencies.c1?.score ?? 0}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-100 dark:border-emerald-900">
                C2: {essay.competencies.c2?.score ?? 0}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold border border-amber-100 dark:border-amber-900">
                C3: {essay.competencies.c3?.score ?? 0}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold border border-purple-100 dark:border-purple-900">
                C4: {essay.competencies.c4?.score ?? 0}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 font-bold border border-pink-100 dark:border-pink-900">
                C5: {essay.competencies.c5?.score ?? 0}
              </span>
            </div>
          )}

          {/* Reading Controls & Statistics Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold">
                <strong>{paragraphCount}</strong> {paragraphCount === 1 ? 'parágrafo' : 'parágrafos'}
              </span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold">
                <strong>{wordCount}</strong> palavras
              </span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold hidden sm:inline">
                ~{estimatedLines}/30 linhas
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Font size control */}
              <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setFontSize('sm')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${fontSize === 'sm' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
                  title="Fonte pequena"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('base')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${fontSize === 'base' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
                  title="Fonte média"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('lg')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${fontSize === 'lg' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
                  title="Fonte grande"
                >
                  A+
                </button>
              </div>

              {/* Copy button */}
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Essay Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 font-serif">
          {paragraphs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500 font-sans space-y-2">
              <FileText className="w-10 h-10 mx-auto opacity-40" />
              <p>Texto original da redação não encontrado neste registro.</p>
            </div>
          ) : (
            paragraphs.map((pText, idx) => (
              <div 
                key={idx}
                className="group relative pl-4 sm:pl-6 border-l-2 border-indigo-200 dark:border-indigo-900 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
              >
                <div className="font-sans text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1.5 select-none flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
                  <span>{getParagraphLabel(idx, paragraphs.length)}</span>
                </div>
                <p className={`${textClasses} text-slate-800 dark:text-slate-100 whitespace-pre-line text-justify`}>
                  {pText}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Fechar Visualizador
          </button>

          {onOpenFullReport && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFullReport(essay);
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>Abrir Análise e Relatório Completo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
