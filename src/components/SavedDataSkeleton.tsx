import React from 'react';
import { 
  Loader2, 
  Database, 
  BarChart3, 
  BookCheck, 
  PenTool, 
  Sparkles, 
  FileText, 
  Layers, 
  Calendar,
  Cloud
} from 'lucide-react';

/**
 * Reusable animated top banner displaying 'Carregando dados...' status
 * with glowing pulse and shimmer animation.
 */
export const LoadingDataBanner: React.FC<{
  title?: string;
  subtitle?: string;
}> = ({
  title = 'Carregando dados...',
  subtitle = 'Sincronizando redações salvas, histórico pedagógico e rascunhos...'
}) => {
  return (
    <div 
      id="saved-data-loading-banner"
      role="status"
      aria-live="polite"
      className="relative overflow-hidden rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/80 p-4 sm:p-5 shadow-xs transition-colors"
    >
      {/* Background Animated Shimmer Effect */}
      <div 
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-indigo-500/10 to-transparent pointer-events-none" 
      />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-sm shrink-0">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-indigo-950 dark:text-indigo-100 tracking-tight">
                {title}
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-200/80 dark:bg-indigo-900/80 text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">
                Sincronizando
              </span>
            </div>
            <p className="text-xs text-indigo-800/80 dark:text-indigo-300/80 mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-[11px] font-medium text-indigo-700 dark:text-indigo-400">
          <Cloud className="w-3.5 h-3.5 animate-pulse text-indigo-500" />
          <span>Banco de Dados Seguro</span>
        </div>
      </div>

      {/* Pulsing Loading Progress Indicator Line */}
      <div className="w-full bg-indigo-200/60 dark:bg-indigo-900/60 h-1 rounded-full mt-3 overflow-hidden">
        <div className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse w-2/3" />
      </div>
    </div>
  );
};

/**
 * Skeleton screen matching DashboardView structure
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-14 animate-pulse" aria-busy="true">
      {/* Loading Notice Banner */}
      <LoadingDataBanner 
        title="Carregando dados..."
        subtitle="Carregando suas redações analisadas, metas semanais e diagnósticos oficiais..."
      />

      {/* Weekly Goal Progress Bar Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-48" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-24" />
        </div>
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full w-full" />
      </div>

      {/* Bento Grid Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Box 1: Circular Score Gauge Skeleton */}
        <div className="md:col-span-6 lg:col-span-4 bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-between text-center min-h-[380px]">
          <div className="w-full flex justify-between items-center">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-24" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-16" />
          </div>

          {/* Fake Circular Gauge */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border-8 border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center">
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-20 mb-1" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-md w-14" />
            </div>
          </div>

          <div className="space-y-2 w-full flex flex-col items-center">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-40" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-md w-56" />
          </div>

          <div className="grid grid-cols-2 gap-3 w-full mt-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-md w-14 mb-2" />
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-md w-10" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-md w-16 mb-2" />
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-md w-14" />
            </div>
          </div>
        </div>

        {/* Box 2: Featured Action Card Skeleton */}
        <div className="md:col-span-6 lg:col-span-5 bg-slate-900 dark:bg-slate-900 rounded-[2rem] p-7 sm:p-8 border border-slate-800 flex flex-col justify-between min-h-[380px]">
          <div className="space-y-3">
            <div className="h-5 bg-slate-800 rounded-full w-36" />
            <div className="h-8 bg-slate-800 rounded-lg w-52" />
            <div className="h-4 bg-slate-800/70 rounded-md w-full max-w-sm" />
            <div className="h-4 bg-slate-800/70 rounded-md w-3/4" />
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <div className="h-12 bg-slate-800 rounded-2xl w-full" />
            <div className="h-12 bg-slate-800 rounded-2xl w-full" />
          </div>
        </div>

        {/* Box 3: Stat Badges Skeleton */}
        <div className="md:col-span-12 lg:col-span-3 bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col justify-between min-h-[380px]">
          <div className="space-y-3">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-28" />
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-36" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-md w-full" />
          </div>

          <div className="space-y-2.5 my-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0" />
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-md w-20" />
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-md w-32" />
                </div>
              </div>
            ))}
          </div>

          <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
        </div>
      </div>

      {/* Bottom Row Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-44" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(c => (
              <div key={c} className="space-y-1.5">
                <div className="flex justify-between">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-28" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-12" />
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full w-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-40" />
          <div className="space-y-3">
            {[1, 2, 3].map(e => (
              <div key={e} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-md w-1/3" />
                </div>
                <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-lg w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton screen matching StudentEvolutionView structure
 */
export const EvolutionSkeleton: React.FC<{
  onStartNewEssay?: () => void;
}> = ({ onStartNewEssay }) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-pulse" aria-busy="true">
      {/* Loading Notice Banner */}
      <LoadingDataBanner 
        title="Carregando dados..."
        subtitle="Carregando histórico de notas, gráficos analíticos e medalhas do estudante..."
      />

      {/* Header Skeleton */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-lg w-64" />
          </div>
          <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-md w-80 max-w-full" />
        </div>

        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-44 shrink-0" />
      </div>

      {/* Sub-nav Tabs Skeleton */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-44" />
        <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-44" />
        <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-44" />
      </div>

      {/* 4 Metric Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Média Geral' },
          { label: 'Melhor Nota' },
          { label: 'Progresso Total' },
          { label: 'Competência Forte' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-24" />
              <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-24" />
            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-md w-32" />
          </div>
        ))}
      </div>

      {/* Main Chart Box Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1.5">
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-52" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-md w-72" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-28" />
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-32" />
          </div>
        </div>

        {/* Chart Canvas Area Placeholder */}
        <div className="h-64 sm:h-80 w-full bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 flex flex-col justify-between border border-dashed border-slate-200 dark:border-slate-800">
          <div className="flex justify-between">
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-md w-12" />
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-md w-12" />
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full w-full" />
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full w-full" />
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full w-full" />
          <div className="flex justify-around pt-2 border-t border-slate-200 dark:border-slate-700">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-2 bg-slate-200 dark:bg-slate-700 rounded-md w-14" />
            ))}
          </div>
        </div>
      </div>

      {/* Essays History Grid Skeleton */}
      <div className="space-y-4">
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-44" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
              <div className="flex justify-between">
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-28" />
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-20" />
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(c => (
                  <div key={c} className="h-4 bg-slate-100 dark:bg-slate-800 rounded-md w-12" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton screen matching CorrectionView editor & audit structure
 */
export const CorrectionSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-pulse" aria-busy="true">
      {/* Loading Notice Banner */}
      <LoadingDataBanner 
        title="Carregando dados..."
        subtitle="Carregando rascunhos de texto, histórico de auditoria e configurações de correção..."
      />

      {/* Theme selection skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-40" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-md w-28" />
        </div>
        <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
      </div>

      {/* Editor & Actions Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-36" />
            <div className="flex gap-2">
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-20" />
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-24" />
            </div>
          </div>

          {/* Fake Lines in Textarea */}
          <div className="space-y-3 py-4 min-h-[340px]">
            <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-md w-full" />
            <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-md w-11/12" />
            <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-md w-full" />
            <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-md w-4/5" />
            <div className="h-4" />
            <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-md w-full" />
            <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-md w-10/12" />
            <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-md w-full" />
            <div className="h-4" />
            <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-md w-3/4" />
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-32" />
            <div className="h-11 bg-slate-900 dark:bg-indigo-600 rounded-xl w-48" />
          </div>
        </div>

        {/* Side Panel Skeleton */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-36" />
            <div className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded-xl w-full" />
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-44" />
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton screen matching CreationView structure
 */
export const CreationSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-pulse" aria-busy="true">
      {/* Loading Notice Banner */}
      <LoadingDataBanner 
        title="Carregando dados..."
        subtitle="Carregando modelos de redação gerados, focos temáticos e rascunhos salvos..."
      />

      {/* Creation Config Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-52" />
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-md w-28" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </div>
        <div className="h-11 bg-slate-900 dark:bg-indigo-600 rounded-xl w-full max-w-xs" />
      </div>

      {/* Generated Paper Preview Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1.5">
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-60" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-md w-36" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-lg w-24" />
            <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-lg w-28" />
          </div>
        </div>

        <div className="space-y-4 py-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2 mx-auto mb-6" />
          {[1, 2, 3, 4].map(p => (
            <div key={p} className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-md w-24 mb-2" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-md w-full" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-md w-11/12" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-md w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
