import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  ShieldCheck, 
  LifeBuoy,
  FileText
} from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
  onNavigateHome?: () => void;
  showHomeButton?: boolean;
  variant?: 'full-page' | 'inline' | 'modal';
  recoveryActionLabel?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copiedDetails: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
    copiedDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('EneMaster ErrorBoundary interceptou um erro de renderização:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public resetBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copiedDetails: false,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleCopyError = () => {
    const errorText = `[EneMaster Error Report]\nTimestamp: ${new Date().toISOString()}\nMensagem: ${this.state.error?.message || 'Sem mensagem'}\nStack: ${this.state.error?.stack || 'Sem stack'}\nComponent Stack: ${this.state.errorInfo?.componentStack || 'N/A'}`;
    navigator.clipboard.writeText(errorText);
    this.setState({ copiedDetails: true });
    setTimeout(() => {
      this.setState({ copiedDetails: false });
    }, 2500);
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const {
      fallbackTitle = 'Opa! Algo inesperado aconteceu nesta seção.',
      fallbackMessage = 'Fique tranquilo: seus rascunhos, notas e redações salvas continuam seguros. Vamos restaurar o aplicativo para você continuar seus estudos.',
      showHomeButton = true,
      onNavigateHome,
      variant = 'inline',
      recoveryActionLabel = 'Tentar Novamente'
    } = this.props;

    const isFullPage = variant === 'full-page';

    return (
      <div 
        id="enemaster-error-boundary-card"
        className={`w-full transition-all duration-200 ${
          isFullPage
            ? 'min-h-[60vh] flex items-center justify-center p-4 sm:p-8'
            : 'my-4'
        }`}
      >
        <div className="w-full max-w-2xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-700/70 p-6 sm:p-8 shadow-xl shadow-amber-500/5 space-y-6">
          {/* Header Icon + Reassurance */}
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-300/60 dark:border-amber-700/60 shrink-0">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Proteção de Sessão Ativa</span>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {fallbackTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {fallbackMessage}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              id="error-boundary-retry-btn"
              type="button"
              onClick={this.resetBoundary}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{recoveryActionLabel}</span>
            </button>

            {showHomeButton && onNavigateHome && (
              <button
                id="error-boundary-home-btn"
                type="button"
                onClick={() => {
                  this.resetBoundary();
                  onNavigateHome();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                <Home className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Voltar ao Início</span>
              </button>
            )}

            <button
              id="error-boundary-reload-btn"
              type="button"
              onClick={this.handleReload}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold transition-all cursor-pointer ml-auto"
              title="Recarregar página inteira"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recarregar Página</span>
            </button>
          </div>

          {/* Collapsible Technical Details (for support & debugging) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
              className="flex items-center justify-between w-full py-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5 text-[11px]">
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>Ver detalhes técnicos do erro</span>
              </span>
              {this.state.showDetails ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {this.state.showDetails && (
              <div className="mt-3 p-3.5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-2 border border-slate-800">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                  <span className="text-amber-400 font-bold">Relatório do Erro:</span>
                  <button
                    type="button"
                    onClick={this.handleCopyError}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-sans font-bold transition-colors cursor-pointer"
                  >
                    {this.state.copiedDetails ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copiar Detalhes</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  <p className="text-rose-400 font-bold">{this.state.error?.name}: {this.state.error?.message}</p>
                  {this.state.error?.stack && (
                    <pre className="text-[10px] text-slate-400 whitespace-pre-wrap font-mono leading-tight">
                      {this.state.error.stack.split('\n').slice(0, 5).join('\n')}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

