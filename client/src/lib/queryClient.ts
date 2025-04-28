import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  options: {
    retries?: number;
    retryDelay?: number;
    timeout?: number;
  } = {},
): Promise<Response> {
  // Set defaults for options
  const retries = options.retries ?? (process.env.NODE_ENV === 'production' ? 3 : 0);
  const retryDelay = options.retryDelay ?? 1000;
  const timeout = options.timeout ?? 30000; // 30 seconds timeout

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= retries) {
    try {
      // Calculate exponential backoff delay
      if (attempt > 0) {
        const delay = Math.min(retryDelay * Math.pow(2, attempt - 1), 30000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const res = await fetch(url, {
        method,
        headers: {
          ...(data ? { "Content-Type": "application/json" } : {}),
          // Add cache control for GET requests
          ...(method.toUpperCase() === 'GET' && process.env.NODE_ENV === 'production' 
            ? { 'Cache-Control': 'no-cache' } 
            : {})
        },
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include",
        signal: controller.signal,
        // Improve network reliability in production
        ...(process.env.NODE_ENV === 'production' ? { 
          keepalive: true,
          mode: 'cors',
          redirect: 'follow',
        } : {})
      });

      // Clear timeout since request succeeded
      clearTimeout(timeoutId);

      await throwIfResNotOk(res);
      return res;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry certain error types
      if (
        error instanceof DOMException && error.name === 'AbortError' ||
        lastError.message.includes('404') ||
        lastError.message.includes('401') ||
        lastError.message.includes('403')
      ) {
        clearTimeout(timeoutId);
        throw lastError;
      }
      
      // If this was the last attempt, throw the error
      if (attempt >= retries) {
        clearTimeout(timeoutId);
        throw lastError;
      }
      
      // Otherwise, increment attempt counter and retry
      attempt++;
    }
  }

  // This should never happen due to the while loop, but TypeScript requires a return
  clearTimeout(timeoutId);
  throw lastError || new Error('Unknown error occurred');
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeout = process.env.NODE_ENV === 'production' ? 20000 : 30000; // 20 seconds timeout in production
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const isProduction = process.env.NODE_ENV === 'production';
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
        signal: controller.signal,
        // Production specific optimizations
        ...(isProduction ? {
          // Cache control
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          // Better connection handling
          keepalive: true,
          mode: 'cors',
          redirect: 'follow'
        } : {})
      });

      // Clear the timeout since request completed
      clearTimeout(timeoutId);

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      
      // Parse the JSON data
      const data = await res.json();
      
      // Add timestamp for tracking data freshness (useful for debugging stale data)
      if (isProduction && typeof data === 'object' && data !== null) {
        (data as any)._fetchedAt = new Date().toISOString();
      }
      
      return data;
    } catch (error) {
      // Clear the timeout to avoid memory leaks
      clearTimeout(timeoutId);
      
      // Improve error reporting in production
      if (process.env.NODE_ENV === 'production') {
        console.error(`API fetch error for ${queryKey[0]}:`, error);
        
        // For timeout errors, provide a more user-friendly message
        if (error instanceof DOMException && error.name === 'AbortError') {
          throw new Error(`Request timeout: The server took too long to respond`);
        }
      }
      
      throw error;
    }
  };

// Define a custom retry function for production
const customRetry = (failureCount: number, error: Error) => {
  // Don't retry for specific error types like 404, 401, etc.
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes('404') || message.includes('401') || message.includes('403')) {
      return false;
    }
  }
  
  // In production, retry network requests up to 3 times
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction && failureCount < 3;
};

// Initialize optimized QueryClient with performance settings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      // Reduce unnecessary refetches for better performance
      refetchOnWindowFocus: false,
      // Optimize cache settings to avoid excessive network requests
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      // Implement aggressive prefetching for faster user experience
      refetchOnMount: true,
      // Custom retry strategy with optimized settings
      retry: customRetry,
      retryDelay: attemptIndex => Math.min(500 * 2 ** attemptIndex, 10000),
      // Handle errors gracefully without breaking the UI
      useErrorBoundary: false,
      // Enable structural sharing for optimal render performance
      structuralSharing: true,
    },
    mutations: {
      // Optimize mutation retry settings
      retry: customRetry,
      retryDelay: attemptIndex => Math.min(500 * 2 ** attemptIndex, 10000),
    },
  },
});
