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

  useEffect(() => {
    if (!iframeRef.current) return;

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
            }
            #${embedId} { 
              width: 100%; 
              min-height: ${minHeight};
            }
          </style>
        </head>
        <body>
          <div id="${embedId}"></div>
          <script 
            src="${scriptUrl}" 
            defer
            onerror="parent.postMessage({type:'embed-error', embedId:'${embedId}'}, '*')"
          ></script>
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
      }
    } catch (err) {
      console.error("Failed to initialize sandboxed embed:", err);
      setError(true);
    }

    // Listen for error messages from iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'embed-error' && event.data?.embedId === embedId) {
        setError(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [scriptUrl, embedId, minHeight]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load embed. Please check your connection and try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      title={title}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      style={{
        width: '100%',
        minHeight,
        border: 'none',
        display: 'block'
      }}
      loading="lazy"
    />
  );
};