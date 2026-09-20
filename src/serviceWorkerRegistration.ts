// Utility to clean up service workers and purge stale cache
export function register() {
  if (typeof window === 'undefined') return;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    }).catch((err) => {
      console.debug('[SW] Cleanup note:', err);
    });

    if ('caches' in window) {
      caches.keys().then((keys) => {
        for (const key of keys) {
          caches.delete(key);
        }
      }).catch(() => {});
    }
  }
}

export function unregister() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }
}

export function skipWaitingAndReload() {
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}
