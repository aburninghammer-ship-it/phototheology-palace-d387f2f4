// Centralized helpers for forcing PWA updates / clearing stale caches

export const PWA_UPDATE_COOLDOWN_KEY = "pwa_update_cooldown";

export function clearPwaUpdateCooldown(): void {
  try {
    localStorage.removeItem(PWA_UPDATE_COOLDOWN_KEY);
  } catch {
    // ignore
  }
}

export async function hardReloadApp(): Promise<void> {
  try {
    // Unregister all service workers
    if ("serviceWorker" in navigator) {
      const sw = navigator.serviceWorker;

      const registrations =
        typeof sw.getRegistrations === "function"
          ? await sw.getRegistrations()
          : [await sw.getRegistration()].filter(
              (r): r is ServiceWorkerRegistration => Boolean(r)
            );

      await Promise.allSettled(registrations.map((r) => r.unregister()));
    }

    // Clear all caches
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
    }
  } finally {
    // Force a full navigation (bypasses SW + adds cache-busting query param)
    const url = new URL(window.location.href);
    url.searchParams.set("t", String(Date.now()));
    window.location.replace(url.toString());
  }
}
