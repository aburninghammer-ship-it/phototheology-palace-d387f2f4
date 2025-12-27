import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { clearPwaUpdateCooldown, hardReloadApp, PWA_UPDATE_COOLDOWN_KEY } from "@/lib/pwa";
import { toast } from "sonner";

type SWSnapshot = {
  supported: boolean;
  controller: boolean;
  scope: string | null;
  activeScript: string | null;
  waitingScript: string | null;
  installingScript: string | null;
  cacheNames: string[];
  cooldownRaw: string | null;
};

function getDisplayMode(): string {
  try {
    // iOS standalone uses navigator.standalone
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isIOSStandalone = Boolean((navigator as any).standalone);
    if (isIOSStandalone) return "standalone (iOS)";

    const dm = window.matchMedia?.("(display-mode: standalone)").matches
      ? "standalone"
      : window.matchMedia?.("(display-mode: fullscreen)").matches
        ? "fullscreen"
        : window.matchMedia?.("(display-mode: minimal-ui)").matches
          ? "minimal-ui"
          : "browser";

    return dm;
  } catch {
    return "unknown";
  }
}

async function readSnapshot(): Promise<SWSnapshot> {
  const supported = "serviceWorker" in navigator;
  const controller = supported ? Boolean(navigator.serviceWorker.controller) : false;

  let scope: string | null = null;
  let activeScript: string | null = null;
  let waitingScript: string | null = null;
  let installingScript: string | null = null;

  if (supported) {
    const reg = await navigator.serviceWorker.getRegistration();
    scope = reg?.scope ?? null;
    activeScript = reg?.active?.scriptURL ?? null;
    waitingScript = reg?.waiting?.scriptURL ?? null;
    installingScript = reg?.installing?.scriptURL ?? null;
  }

  let cacheNames: string[] = [];
  if ("caches" in window) {
    try {
      cacheNames = await caches.keys();
    } catch {
      cacheNames = [];
    }
  }

  let cooldownRaw: string | null = null;
  try {
    cooldownRaw = localStorage.getItem(PWA_UPDATE_COOLDOWN_KEY);
  } catch {
    cooldownRaw = null;
  }

  return {
    supported,
    controller,
    scope,
    activeScript,
    waitingScript,
    installingScript,
    cacheNames,
    cooldownRaw,
  };
}

export default function Version() {
  const [snapshot, setSnapshot] = useState<SWSnapshot | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const canonical = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/version`;
  }, []);

  const buildId = useMemo(() => {
    // Prefer explicit version if provided, else fall back to build time
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const v = (import.meta as any).env?.VITE_APP_VERSION as string | undefined;
    return v || __APP_BUILD_TIME__;
  }, []);

  const refresh = useCallback(async () => {
    setIsChecking(true);
    try {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        await reg?.update();
      }
      const next = await readSnapshot();
      setSnapshot(next);
      toast.success("Checked for updates");
    } catch {
      const next = await readSnapshot();
      setSnapshot(next);
      toast.message("Checked (some info may be unavailable)");
    } finally {
      setIsChecking(false);
    }
  }, []);

  const clearCooldown = useCallback(() => {
    clearPwaUpdateCooldown();
    toast.success("Update cooldown cleared");
    void refresh();
  }, [refresh]);

  const forceUpdate = useCallback(async () => {
    toast.message("Force updating…");
    await hardReloadApp();
  }, []);

  useEffect(() => {
    void (async () => {
      const next = await readSnapshot();
      setSnapshot(next);
    })();
  }, []);

  return (
    <>
      <Helmet>
        <title>App Version & Updates | Phototheology</title>
        <meta
          name="description"
          content="Check the current app version, build time, and update status for the Phototheology PWA."
        />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <main className="min-h-[calc(100vh-var(--app-header-height,0px))] bg-background text-foreground">
        <section className="max-w-3xl mx-auto px-4 py-10">
          <header className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold">App Version & Updates</h1>
            <p className="text-muted-foreground">
              If your <span className="font-medium text-foreground">Palace</span> edits arent showing on the live app,
              compare the build info here between the two places.
            </p>
          </header>

          <div className="mt-6 grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Build</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">Build ID</span>
                  <Badge variant="outline" className="font-mono max-w-[70%] truncate">
                    {buildId}
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">URL</span>
                  <span className="text-sm font-mono max-w-[70%] truncate">{typeof window !== "undefined" ? window.location.href : ""}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">Display mode</span>
                  <Badge variant="secondary">{getDisplayMode()}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Update / Cache Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Button onClick={() => void refresh()} disabled={isChecking}>
                    {isChecking ? "Checking" : "Check for updates"}
                  </Button>
                  <Button variant="outline" onClick={clearCooldown} disabled={isChecking}>
                    Clear update cooldown
                  </Button>
                  <Button variant="destructive" onClick={() => void forceUpdate()} disabled={isChecking}>
                    Force update (hard reload)
                  </Button>
                </div>

                <Separator />

                <div className="grid gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">Service worker supported</span>
                    <Badge variant={snapshot?.supported ? "default" : "secondary"}>
                      {snapshot?.supported ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">Controlled by SW</span>
                    <Badge variant={snapshot?.controller ? "default" : "secondary"}>
                      {snapshot?.controller ? "Yes" : "No"}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">SW scope</div>
                    <div className="text-sm font-mono break-all">{snapshot?.scope ?? ""}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">SW active</div>
                    <div className="text-sm font-mono break-all">{snapshot?.activeScript ?? ""}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">SW waiting</div>
                    <div className="text-sm font-mono break-all">{snapshot?.waitingScript ?? ""}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">SW installing</div>
                    <div className="text-sm font-mono break-all">{snapshot?.installingScript ?? ""}</div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">Cache names</span>
                      <Badge variant="outline">{snapshot?.cacheNames.length ?? 0}</Badge>
                    </div>
                    <ul className="space-y-1">
                      {(snapshot?.cacheNames ?? []).slice(0, 12).map((name) => (
                        <li key={name} className="text-xs font-mono text-muted-foreground break-all">
                          {name}
                        </li>
                      ))}
                      {(snapshot?.cacheNames?.length ?? 0) > 12 && (
                        <li className="text-xs text-muted-foreground">…and more</li>
                      )}
                    </ul>
                  </div>

                  <Separator />

                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Update cooldown (raw)</div>
                    <div className="text-sm font-mono break-all">{snapshot?.cooldownRaw ?? "(none)"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What to send me</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Open <span className="font-mono text-foreground">/version</span> in both places (your editor preview and your
                  live app), then tell me the <span className="font-medium text-foreground">Build ID</span> and whether
                  <span className="font-medium text-foreground"> SW waiting</span> is populated.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
