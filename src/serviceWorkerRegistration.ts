// Utility to clean up service workers and purge stale cache safely across all browsers
export function register() {
  if (typeof window === 'undefined') return;

  try {
    if ('serviceWorker' in navigator && typeof navigator.serviceWorker.getRegistrations === 'function') {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().catch(() => {});
        }
      }).catch((err) => {
        console.debug('[SW] Cleanup note:', err);
      });
    }

    if ('caches' in window && typeof window.caches?.keys === 'function') {
      window.caches.keys().then((keys) => {
        for (const key of keys) {
          window.caches.delete(key).catch(() => {});
        }
      }).catch(() => {});
    }
  } catch (err) {
    console.debug('[SW] Safe registration skip:', err);
  }
}

export function unregister() {
  if (typeof window === 'undefined') return;

  try {
    if ('serviceWorker' in navigator && typeof navigator.serviceWorker.getRegistrations === 'function') {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().catch(() => {});
        }
      }).catch(() => {});
    }
  } catch {}
}

export function skipWaitingAndReload() {
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}
