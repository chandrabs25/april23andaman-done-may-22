import { useState, useCallback } from 'react';

export interface SubmitResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface UseSubmitReturn<T = any> {
  submit: (url: string, method?: string, body?: any, options?: RequestInit) => Promise<SubmitResponse<T>>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useSubmit<T = any>(): UseSubmitReturn<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (
    url: string,
    method: string = 'POST',
    body?: any,
    options: RequestInit = {}
  ): Promise<SubmitResponse<T>> => {
    setIsLoading(true);
    setError(null);

    try {
      const requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      // Add body for POST, PUT, PATCH requests
      if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
        requestOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, requestOptions);
      
      let data: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const errorMessage = (data as any)?.message || (data as any)?.error || `HTTP error! status: ${response.status}`;
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
          message: errorMessage
        };
      }

      return {
        success: true,
        data: data,
        message: (data as any)?.message
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    submit,
    isLoading,
    error,
    reset
  };
} 