import { useState, useRef, useCallback, useEffect } from 'react';

export interface UseAiProgressOptions {
  steps?: string[];
  estimatedDurationMs?: number;
  autoStart?: boolean;
}

export function useAiProgress(options: UseAiProgressOptions = {}) {
  const {
    steps = [
      'Iniciando processamento com Inteligência Artificial...',
      'Analisando parâmetros e contexto dissertativo...',
      'Estruturando dados e critérios de avaliação...',
      'Finalizando geração de alta performance...'
    ],
    // Calibração mais realista e gradual para os tempos de IA
    estimatedDurationMs = 7000,
  } = options;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startProgress = useCallback(() => {
    setIsLoading(true);
    setProgress(3);
    setCurrentStepIndex(0);
    startTimeRef.current = Date.now();

    if (timerRef.current) clearInterval(timerRef.current);

    const totalSteps = steps.length;
    // Tick frequente para movimento contínuo e orgânico
    const intervalMs = 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const elapsed = Date.now() - startTimeRef.current;
        const totalEstimated = Math.max(estimatedDurationMs, 4000);

        let calculated: number;

        // Progressão fluida que reflete o tempo real:
        // - Fase 1 (0% a 70% do tempo estimado): avança proporcionalmente até ~75%
        // - Fase 2 (70% a 100% do tempo estimado): desacelera suavemente até ~90%
        // - Fase 3 (tempo além do estimado): continua avançando gradativamente de forma assintótica
        //   (91%, 92%, 93%, 94%, 95%, 96%, 97%, 98%...) em micro-passos contínuos, NUNCA congelando fixo nos 95%.
        if (elapsed <= totalEstimated * 0.7) {
          const ratio = elapsed / (totalEstimated * 0.7);
          calculated = Math.round(3 + ratio * 72); // 3% -> 75%
        } else if (elapsed <= totalEstimated) {
          const extraTime = elapsed - totalEstimated * 0.7;
          const extraRatio = extraTime / (totalEstimated * 0.3);
          calculated = Math.round(75 + extraRatio * 15); // 75% -> 90%
        } else {
          // Passou do tempo estimado (espera real da rede/IA):
          // Continua avançando vagarosamente até 98%, refletindo atividade contínua
          const overtimeSec = (elapsed - totalEstimated) / 1000;
          // Ganha ~1% a cada 2.5 segundos de overtime, até o teto suave de 98%
          const overtimeBonus = Math.min(Math.floor(overtimeSec / 2.5), 8);
          calculated = Math.min(90 + overtimeBonus, 98);
        }

        // Garante que o progresso sempre seja monotônico crescente
        const nextVal = Math.max(prev, calculated);

        // Atualiza a etapa proporcionalmente ao progresso atual
        const stepIdx = Math.min(
          Math.floor((nextVal / 100) * totalSteps),
          totalSteps - 1
        );
        setCurrentStepIndex(stepIdx);

        return nextVal;
      });
    }, intervalMs);
  }, [steps, estimatedDurationMs]);

  const completeProgress = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setProgress(100);
    setCurrentStepIndex(steps.length - 1);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
      setCurrentStepIndex(0);
    }, 500);
  }, [steps.length]);

  const resetProgress = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsLoading(false);
    setProgress(0);
    setCurrentStepIndex(0);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    isLoading,
    progress,
    currentStepIndex,
    currentStep: steps[currentStepIndex] || steps[0],
    steps,
    startProgress,
    completeProgress,
    resetProgress,
  };
}
