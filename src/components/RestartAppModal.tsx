import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  Trash2, 
  X, 
  Sparkles, 
  ShieldCheck, 
  HardDrive, 
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { getAppStorageMetrics, restartAppAndClean, clearAllAppDataAndCache } from '../lib/cacheManager';
import { useAuth } from '../contexts/AuthContext';

interface RestartAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNotification?: (message: string) => void;
}

export const RestartAppModal: React.FC<RestartAppModalProps> = ({
  isOpen,
  onClose,
  onSuccessNotification
}) => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(() => getAppStorageMetrics());
  const [keepTheme, setKeepTheme] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMetrics(getAppStorageMetrics());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFullRestart = () => {
    setIsProcessing(true);
    setTimeout(() => {
      restartAppAndClean({ keepTheme, reload: true });
    }, 300);
  };

  const handleCleanWithoutReload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const result = clearAllAppDataAndCache({ keepTheme });
      setIsProcessing(false);
      onClose();
      if (onSuccessNotification) {
        onSuccessNotification(`Cache apagado com sucesso! ${result.kbFreed} KB liberados. O app está pronto para novo uso.`);
      }
    }, 350);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="restart-modal-title"
    >
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          aria-label="Fechar"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-xs">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h3 id="restart-modal-title" className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Reiniciar App & Limpar Cache
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Liberar memória e começar com o app limpo
            </p>
          </div>
        </div>

        {/* Storage Metrics Badge */}
        <div className="space-y-2 mb-4">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <HardDrive className="w-4 h-4 text-indigo-500" />
              <span>Cache temporário expurgável:</span>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {metrics.ephemeralKb} KB
            </span>
          </div>

          {metrics.savedEssaysCount > 0 && (
            <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Avaliações corrigidas salvas:</span>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200">
                {metrics.savedEssaysCount} redações (Protegidas)
              </span>
            </div>
          )}
        </div>

        {/* Explanatory Content */}
        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p>
              <strong>O que será limpo:</strong> Rascunhos temporários não enviados, histórico de chat local, tarefas secundárias e logs pesados de IA.
            </p>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong>Garantia de segurança:</strong> As <strong>avaliações salvas e notas corrigidas</strong> de cada usuário com login <strong>NÃO são afetadas</strong>. Elas permanecem 100% salvas e disponíveis mesmo se você reiniciar o aplicativo ou desconectar sua conta.
            </p>
          </div>

          {/* Keep Theme Checkbox */}
          <label className="flex items-center gap-2.5 pt-1 text-slate-700 dark:text-slate-300 font-medium cursor-pointer select-none">
            <input 
              type="checkbox"
              checked={keepTheme}
              onChange={(e) => setKeepTheme(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
            />
            <span>Preservar preferência de tema visual (claro / escuro)</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="w-full sm:w-1/3 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer text-center"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleCleanWithoutReload}
            disabled={isProcessing}
            title="Limpa todo o cache sem recarregar a página"
            className="w-full sm:w-1/3 py-2.5 px-3 rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-xs font-bold transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar Agora</span>
          </button>

          <button
            type="button"
            onClick={handleFullRestart}
            disabled={isProcessing}
            className="w-full sm:w-1/3 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-extrabold shadow-md hover:shadow-indigo-500/20 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-3.5 h-3.5" />
            )}
            <span>Reiniciar App</span>
          </button>
        </div>
      </div>
    </div>
  );
};
