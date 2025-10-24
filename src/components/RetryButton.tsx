import { useState } from "react";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";

interface RetryButtonProps {
  onRetry: () => Promise<void> | void;
  children?: React.ReactNode;
}

export const RetryButton = ({ onRetry, children = "Retry" }: RetryButtonProps) => {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  };

  return (
    <Button
      onClick={handleRetry}
      disabled={retrying}
      variant="outline"
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`} />
      {children}
    </Button>
  );
};
