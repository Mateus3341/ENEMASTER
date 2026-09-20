/**
 * Cache and Data Management for ENEMASTER
 * Garante que dados locais, rascunhos pesados, logs e caches sejam expurgados
 * ao sair da conta ou reiniciar o aplicativo, prevenindo sobrecarga de armazenamento.
 */

export const APP_CACHE_PREFIXES = ['enem_', 'enemaster_'];

export const PERSISTENT_KEYS = [
  'enemaster_theme', // Preferência visual do usuário (escuro / claro)
];

export interface ClearCacheOptions {
  keepTheme?: boolean;
  preserveUserEssays?: boolean; // Salva avaliações corrigidas de usuários mesmo ao reiniciar ou sair
  reload?: boolean;
}

export interface CacheMetrics {
  totalKeys: number;
  clearedKeys: string[];
  approxBytesFreed: number;
  kbFreed: number;
  preservedKeys: string[];
}

/**
 * Retorna se uma chave do localStorage contém redações e avaliações salvas de usuários
 */
export function isSavedEssaysKey(key: string): boolean {
  return key.startsWith('enem_saved_essays_');
}

/**
 * Calcula o tamanho aproximado em bytes ocupado pelas chaves do app no localStorage
 * e separa o que é cache temporário expurgável do que são avaliações salvas preservadas.
 */
export function getAppStorageMetrics(): { 
  totalKeys: number; 
  bytes: number; 
  kb: number; 
  keys: string[];
  savedEssaysCount: number;
  savedEssaysBytes: number;
  ephemeralBytes: number;
  ephemeralKb: number;
} {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { 
      totalKeys: 0, 
      bytes: 0, 
      kb: 0, 
      keys: [],
      savedEssaysCount: 0,
      savedEssaysBytes: 0,
      ephemeralBytes: 0,
      ephemeralKb: 0
    };
  }

  let totalBytes = 0;
  let savedEssaysBytes = 0;
  let ephemeralBytes = 0;
  let savedEssaysCount = 0;
  const appKeys: string[] = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      const isAppKey = APP_CACHE_PREFIXES.some(prefix => key.startsWith(prefix));
      if (isAppKey) {
        appKeys.push(key);
        const val = localStorage.getItem(key) || '';
        const itemBytes = (key.length + val.length) * 2;
        totalBytes += itemBytes;

        if (isSavedEssaysKey(key)) {
          savedEssaysBytes += itemBytes;
          try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) {
              savedEssaysCount += parsed.length;
            }
          } catch {}
        } else if (key !== 'enemaster_theme') {
          ephemeralBytes += itemBytes;
        }
      }
    }
  } catch (e) {
    console.debug('Erro ao inspecionar métricas do storage:', e);
  }

  return {
    totalKeys: appKeys.length,
    bytes: totalBytes,
    kb: Math.round(totalBytes / 1024),
    keys: appKeys,
    savedEssaysCount,
    savedEssaysBytes,
    ephemeralBytes,
    ephemeralKb: Math.max(0, Math.round(ephemeralBytes / 1024)),
  };
}

/**
 * Apaga dados temporários, rascunhos de digitação, histórico de sessões de chat,
 * tarefas em segundo plano e logs de IA sem NUNCA afetar as avaliações salvas
 * corrigidas de usuários.
 */
export function clearAllAppDataAndCache(options: ClearCacheOptions = { keepTheme: true, preserveUserEssays: true }): CacheMetrics {
  const metrics: CacheMetrics = {
    totalKeys: 0,
    clearedKeys: [],
    approxBytesFreed: 0,
    kbFreed: 0,
    preservedKeys: [],
  };

  if (typeof window === 'undefined') return metrics;

  const shouldPreserveEssays = options.preserveUserEssays !== false;
  const shouldKeepTheme = options.keepTheme !== false;

  try {
    // 1. Coletar e remover apenas chaves de cache efêmero do localStorage
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      // Preservar preferência de tema visual se solicitado
      if (shouldKeepTheme && key === 'enemaster_theme') {
        metrics.preservedKeys.push(key);
        continue;
      }

      // REGRA FUNDAMENTAL: NUNCA apagar avaliações e redações salvas de usuários com login!
      if (shouldPreserveEssays && isSavedEssaysKey(key)) {
        metrics.preservedKeys.push(key);
        continue;
      }

      const isAppKey = APP_CACHE_PREFIXES.some(prefix => key.startsWith(prefix));
      if (isAppKey) {
        const val = localStorage.getItem(key) || '';
        metrics.approxBytesFreed += (key.length + val.length) * 2;
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(k => {
      try {
        localStorage.removeItem(k);
        metrics.clearedKeys.push(k);
      } catch {}
    });

    metrics.totalKeys = metrics.clearedKeys.length;
    metrics.kbFreed = Math.round(metrics.approxBytesFreed / 1024);

    // 2. Limpar SessionStorage temporário
    try {
      sessionStorage.clear();
    } catch {}

    // 3. Limpar Cache Storage efêmero do navegador / Service Worker
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName).catch(() => {});
        });
      }).catch(() => {});
    }

    // 4. Notificar componentes do aplicativo em execução
    window.dispatchEvent(new CustomEvent('enemaster:cache-cleared', { detail: metrics }));

    console.info(`[Enemaster CacheManager] ${metrics.totalKeys} itens de cache apagados (${metrics.kbFreed} KB liberados). Avaliações de redação e tema mantidos 100% seguros.`);
  } catch (err) {
    console.warn('[Enemaster CacheManager] Falha ao limpar cache:', err);
  }

  return metrics;
}

/**
 * Reinicia o aplicativo: limpa os caches temporários sem afetar redações salvas e recarrega.
 */
export function restartAppAndClean(options: ClearCacheOptions = { keepTheme: true, preserveUserEssays: true, reload: true }): void {
  // Limpa os dados de cache preservando avaliações salvas
  clearAllAppDataAndCache({
    keepTheme: options.keepTheme !== false,
    preserveUserEssays: true
  });

  // Marca no sessionStorage para mostrar feedback de reinicialização após recarregar
  try {
    sessionStorage.setItem('enemaster_just_restarted', 'true');
  } catch {}

  if (options.reload !== false) {
    window.location.href = window.location.origin + window.location.pathname;
  }
}

/**
 * Registra listeners de ciclo de vida para garantir que sessões finalizadas
 * não acumulem lixo de dados no cache.
 */
export function initAutoCacheCleanup(): void {
  if (typeof window === 'undefined') return;

  // Ao fechar ou recarregar a janela, se o cache estiver muito grande (> 3MB),
  // expurga logs antigos e rascunhos temporários para não sobrecarregar o dispositivo.
  window.addEventListener('pagehide', () => {
    try {
      const metrics = getAppStorageMetrics();
      if (metrics.bytes > 3 * 1024 * 1024) {
        // Expurgo de segurança apenas de logs e rascunhos pesados
        localStorage.removeItem('enem_correction_audit_logs_v1');
        localStorage.removeItem('enemaster_bg_tasks_v1');
        localStorage.removeItem('enem_creation_focus_draft_v1');
      }
    } catch {}
  });
}
