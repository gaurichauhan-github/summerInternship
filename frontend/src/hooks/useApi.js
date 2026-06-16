import { useCallback, useState } from 'react';

export function useApi(asyncFunction) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (...args) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await asyncFunction(...args);
        setData(response);
        return response;
      } catch (apiError) {
        setError(apiError);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFunction]
  );

  return { data, error, execute, isLoading };
}
