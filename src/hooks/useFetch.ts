// src/hooks/useFetch.ts
'use client';

import { useState, useEffect, useRef } from 'react'; // Added useRef for tracking first render

// Define loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Define a generic interface for API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T; // Data is optional and generic
  message?: string; // Optional error/status message
}

// --- Combined State Interface ---
interface FetchState<T> {
  data: T | null;
  error: Error | null;
  status: LoadingState;
}

// Generic hook for data fetching with loading states
// The hook itself is generic over the expected data type T
export function useFetch<T>(url: string | null, options?: RequestInit) { // Allow URL to be null to prevent fetching initially
  // Use useRef to track if this is the first render to reduce unnecessary log spam
  const isInitialRender = useRef(true);
  
  if (isInitialRender.current) {
    console.log('[useFetch] Hook initialized. URL:', url);
    isInitialRender.current = false;
  }

  // --- Use single state object ---
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    status: 'idle',
  });

  // Store previous URL to prevent unnecessary fetches
  const prevUrlRef = useRef(url);
  
  // Properly memoize options by creating a stable reference
  const optionsRef = useRef(options);
  
  // Only update the options ref if they've actually changed
  if (JSON.stringify(optionsRef.current) !== JSON.stringify(options)) {
    optionsRef.current = options;
  }

  // Force an effect trigger for debugging
  const initialFetchRef = useRef(true);

  useEffect(() => {
    console.log('[useFetch] useEffect entering. URL:', url, 'Initial fetch:', initialFetchRef.current);
    
    // Skip effect if URL hasn't changed and not first render
    if (prevUrlRef.current === url && url !== null && !initialFetchRef.current) {
      console.log('[useFetch] useEffect skipped - URL unchanged and not first render');
      return;
    }
    
    // Reset initial fetch flag
    initialFetchRef.current = false;
    
    prevUrlRef.current = url;
    console.log('[useFetch] useEffect triggered. URL:', url);

    const fetchData = async () => {
      console.log('[useFetch] fetchData started. URL:', url);

      if (!url) {
        console.log('[useFetch] URL is null, setting state to idle/null.');
        // --- Update combined state ---
        setState({ data: null, error: null, status: 'idle' });
        return;
      }

      console.log('[useFetch] Resetting state and setting status to loading.');
      // --- Update combined state ---
      setState({ data: null, error: null, status: 'loading' });

      try {
        console.log('[useFetch] Attempting fetch to URL:', url);
        // Use a full URL with origin for fetching from relative paths
        const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
        console.log('[useFetch] Full URL for fetch:', fullUrl);
        
        const response = await fetch(fullUrl, {
          ...optionsRef.current,
          credentials: 'include' as RequestCredentials,
        });
        console.log('[useFetch] Fetch completed. URL:', url, 'Status:', response.status);

        let result: ApiResponse<T>;
        try {
          console.log('[useFetch] Attempting response.json(). URL:', url);
          result = await response.json() as ApiResponse<T>;
          console.log('[useFetch] response.json() successful. URL:', url);
        } catch (jsonError) {
          console.error('[useFetch] response.json() FAILED. URL:', url, 'Error:', jsonError);
          throw new Error(`Request failed with status ${response.status} and non-JSON response.`);
        }

        if (!response.ok) {
          const errorMessage = result?.message || response.statusText || `HTTP error! Status: ${response.status}`;
          console.warn('[useFetch] Response not OK. Status:', response.status, 'URL:', url, 'Throwing error:', errorMessage);
          throw new Error(errorMessage);
        }

        console.log('[useFetch] Response OK. Checking result.success. URL:', url);
        if (result.success) {
          console.log('[useFetch] result.success is true. URL:', url);
          if (result.data !== undefined) {
            console.log('[useFetch] Setting state data and status=success. URL:', url);
            // --- Update combined state ---
            setState({ data: result.data, error: null, status: 'success' });
          } else {
            console.warn(`[useFetch] Fetch successful (result.success=true) but result.data is undefined. Setting state data=null, status=success. URL: ${url}`);
            // --- Update combined state ---
            setState({ data: null, error: null, status: 'success' });
          }
        } else {
          const apiErrorMessage = result.message || 'API returned success: false';
          console.warn('[useFetch] result.success is false. URL:', url, 'Throwing error:', apiErrorMessage);
          throw new Error(apiErrorMessage);
        }
      } catch (err) {
        console.error(`[useFetch] CATCH block error for URL ${url}:`, err);
        const error = err instanceof Error ? err : new Error('Unknown fetch error occurred');
        console.log('[useFetch] Setting state error and status=error. URL:', url);
        // --- Update combined state ---
        setState({ data: null, error: error, status: 'error' });
      }
    };

    fetchData();

  }, [url]); // Only depend on url, not on stringified options

  // Reduced verbosity of log when returning state
  console.log(
    '[useFetch] Returning state for URL:', url,
    { status: state.status }
  );

  // --- Return combined state values ---
  return { data: state.data, error: state.error, status: state.status, isLoading: state.status === 'loading' };
}


// Hook for submitting data with loading states
// T = Type of data expected in the RESPONSE
// R = Type of data being SUBMITTED (request payload)
export function useSubmit<T, R = any>(initialUrl: string) {
  // Use useRef to track if this is the first render
  const isInitialRender = useRef(true);
  
  if (isInitialRender.current) {
    console.log('[useSubmit] Hook initialized. Initial URL:', initialUrl);
    isInitialRender.current = false;
  }
  
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<LoadingState>('idle');

  const submit = async (payload: R, method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST', overrideUrl?: string): Promise<{ success: boolean; data?: T | null; error?: string }> => {
    const targetUrl = overrideUrl || initialUrl;

    console.log('[useSubmit] submit function called. Target URL:', targetUrl, 'Method:', method);
    setStatus('loading');
    setData(null);
    setError(null);

    if (!targetUrl) {
        console.error('[useSubmit] No URL provided (initial or override). Aborting submission.');
        setError(new Error('No URL specified for submission.'));
        setStatus('error');
        return { success: false, error: 'No URL specified for submission.' };
    }

    try {
      const fetchOptions = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: method !== 'DELETE' ? JSON.stringify(payload) : undefined,
        credentials: 'include' as RequestCredentials,
      };
      console.log('[useSubmit] Attempting fetch. URL:', targetUrl);
      const response = await fetch(targetUrl, fetchOptions);
      console.log('[useSubmit] Fetch completed. URL:', targetUrl, 'Status:', response.status);

      let result: ApiResponse<T>;

      try {
        console.log('[useSubmit] Attempting response.json(). URL:', targetUrl);
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            console.log('[useSubmit] Received 204 No Content or empty body. Assuming success.');
            result = { success: true };
        } else {
            result = await response.json() as ApiResponse<T>;
        }
        console.log('[useSubmit] response.json() successful or handled empty. URL:', targetUrl);
      } catch (jsonError) {
        console.error("[useSubmit] response.json() FAILED. URL:", targetUrl, "Error:", jsonError);
        throw new Error(`Request failed with status ${response.status} and non-JSON response.`);
      }

      console.log('[useSubmit] Checking response.ok and result.success. URL:', targetUrl);
      if (response.ok && (result.success === undefined || result.success === true)) {
        console.log('[useSubmit] Response OK and result.success is true/undefined. URL:', targetUrl);
        if (result.data !== undefined) {
          console.log('[useSubmit] Setting data and status=success. URL:', targetUrl);
          setData(result.data);
          setStatus('success');
          return { success: true, data: result.data };
        } else {
          setData(null);
          setStatus('success');
          console.warn(`[useSubmit] Submit successful (result.success=true/undefined) but result.data is undefined. Setting data=null, status=success. URL: ${targetUrl}`);
          return { success: true, data: null };
        }
      } else {
        const errorMessage = result.message || `API Error: Status ${response.status}, Success Flag: ${result.success}`;
        console.warn('[useSubmit] Response NOT OK or result.success is false. URL:', targetUrl, 'Throwing error:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('[useSubmit] CATCH block error. URL:', targetUrl, 'Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown submit error occurred';
      console.log('[useSubmit] Setting error state and status=error. URL:', targetUrl);
      setError(new Error(errorMessage));
      setStatus('error');
      return { success: false, error: errorMessage };
    }
  };

  const reset = () => {
    console.log('[useSubmit] reset function called.');
    setData(null);
    setError(null);
    setStatus('idle');
  };

  return { submit, data, error, status, isLoading: status === 'loading', reset };
}