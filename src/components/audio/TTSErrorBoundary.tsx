import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, VolumeX } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary for TTS components
 * Catches errors in Text-to-Speech components and provides fallback UI
 */
export class TTSErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console
    console.error('[TTSErrorBoundary] Caught TTS error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call optional reset callback
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'An unexpected error occurred';
      const fallbackMessage = this.props.fallbackMessage ||
        'Audio narration is temporarily unavailable.';

      return (
        <Card className="border-destructive/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <VolumeX className="h-5 w-5 text-destructive" />
              Audio Unavailable
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {fallbackMessage}
              </AlertDescription>
            </Alert>

            {/* Show technical error details in development */}
            {process.env.NODE_ENV === 'development' && (
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                  Technical Details (Development Only)
                </summary>
                <pre className="mt-2 p-2 bg-muted rounded text-[10px] overflow-auto">
                  {errorMessage}
                  {this.state.errorInfo && (
                    <>
                      {'\n\nComponent Stack:\n'}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}

            <div className="flex gap-2">
              <Button
                onClick={this.handleReset}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              If this problem persists, try:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Refreshing the page</li>
              <li>Checking your internet connection</li>
              <li>Using a different browser</li>
              <li>Clearing your browser cache</li>
            </ul>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based wrapper for easier use in functional components
 */
export const withTTSErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallbackMessage?: string
) => {
  return (props: P) => (
    <TTSErrorBoundary fallbackMessage={fallbackMessage}>
      <Component {...props} />
    </TTSErrorBoundary>
  );
};
