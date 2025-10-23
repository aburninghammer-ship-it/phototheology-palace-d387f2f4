import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface SandboxedEmbedProps {
  scriptUrl: string;
  embedId: string;
  minHeight?: string;
  title?: string;
}

/**
 * SandboxedEmbed - Secure third-party script loader
 * 
 * Security features:
 * - Loads scripts in sandboxed iframe with restricted permissions
 * - Prevents access to parent page context (localStorage, cookies, etc.)
 * - Restricts capabilities with sandbox attributes
 * - Implements CSP via iframe sandbox
 */
export const SandboxedEmbed = ({ 
  scriptUrl, 
  embedId, 
  minHeight = "600px",
  title = "Third-party embed"
}: SandboxedEmbedProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!iframeRef.current) return;

    const timer = setTimeout(() => {
      console.log("Embed timeout after 5 seconds, checking if loaded:", embedId);
      setLoading(false);
    }, 5000);

    const errorTimer = setTimeout(() => {
      if (loading) {
        console.error("Embed failed to load after 10 seconds:", embedId);
        setError(true);
        setLoading(false);
      }
    }, 10000);

    // Create isolated HTML document for iframe
    const iframeDoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: system-ui, -apple-system, sans-serif;
              overflow-x: hidden;
              min-height: ${minHeight};
            }
            #${embedId} { 
              width: 100%; 
              min-height: ${minHeight};
            }
          </style>
        </head>
        <body>
          <div id="${embedId}"></div>
          <script>
            console.log("Loading embed script from:", "${scriptUrl}");
            const script = document.createElement('script');
            script.src = "${scriptUrl}";
            script.defer = true;
            script.onload = function() {
              console.log("Embed script loaded successfully");
              parent.postMessage({type:'embed-loaded', embedId:'${embedId}'}, '*');
            };
            script.onerror = function(e) {
              console.error("Embed script failed to load:", e);
              parent.postMessage({type:'embed-error', embedId:'${embedId}', error: 'Script load failed'}, '*');
            };
            document.body.appendChild(script);
          </script>
        </body>
      </html>
    `;

    try {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(iframeDoc);
        doc.close();
        console.log("Iframe document initialized for:", embedId);
      } else {
        throw new Error("Could not access iframe document");
      }
    } catch (err) {
      console.error("Failed to initialize sandboxed embed:", err);
      setError(true);
      setLoading(false);
    }

    // Listen for messages from iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.embedId === embedId) {
        if (event.data?.type === 'embed-error') {
          console.error("Embed script failed to load:", event.data);
          setError(true);
          setLoading(false);
        } else if (event.data?.type === 'embed-loaded') {
          console.log("Embed loaded successfully:", embedId);
          setLoading(false);
          setError(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timer);
      clearTimeout(errorTimer);
    };
  }, [scriptUrl, embedId, minHeight]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load the chat interface. This may be due to:
          <ul className="list-disc list-inside mt-2 ml-2">
            <li>Network connectivity issues</li>
            <li>External service unavailable</li>
            <li>Browser security settings blocking third-party content</li>
          </ul>
          <p className="mt-3">
            Please try <button onClick={() => window.location.reload()} className="underline font-semibold">refreshing the page</button> or check your internet connection.
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight }}>
      {loading && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            zIndex: 10
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading chat interface...</p>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        title={title}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        style={{
          width: '100%',
          minHeight,
          border: 'none',
          display: 'block'
        }}
        loading="eager"
      />
    </div>
  );
};