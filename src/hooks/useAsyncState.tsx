import { useState, useCallback } from "react";
import { useErrorHandler } from "./useErrorHandler";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export const useAsyncState = <T,>(initialData: T | null = null) => {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });
  const { handleError } = useErrorHandler();

  const execute = useCallback(
    async (asyncFunction: () => Promise<T>, errorTitle = "Error") => {
      setState({ data: state.data, loading: true, error: null });
      
      try {
        const result = await asyncFunction();
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState({ data: state.data, loading: false, error: err });
        handleError(error, { title: errorTitle });
        throw error;
      }
    },
    [handleError, state.data]
  );

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
  };
};
