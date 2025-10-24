import { useToast } from "./use-toast";
import { useCallback } from "react";

interface ErrorHandlerOptions {
  title?: string;
  showToast?: boolean;
  logToConsole?: boolean;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback(
    (error: unknown, options: ErrorHandlerOptions = {}) => {
      const {
        title = "Error",
        showToast = true,
        logToConsole = true,
      } = options;

      // Log to console
      if (logToConsole) {
        console.error(title, error);
      }

      // Extract error message
      let message = "An unexpected error occurred";
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === "string") {
        message = error;
      } else if (error && typeof error === "object" && "message" in error) {
        message = String(error.message);
      }

      // Show toast notification
      if (showToast) {
        toast({
          title,
          description: message,
          variant: "destructive",
        });
      }

      // Here you could send to error tracking service
      // trackError({ title, message, error });

      return message;
    },
    [toast]
  );

  return { handleError };
};
