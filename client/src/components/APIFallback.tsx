import { AlertOctagon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/lib/queryClient';

interface APIFallbackProps {
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  queryKey?: string | string[];
  emptyMessage?: string;
  isEmpty?: boolean;
  children?: React.ReactNode;
}

export default function APIFallback({
  isLoading = false,
  isError = false,
  error = null,
  queryKey,
  emptyMessage = "No data available",
  isEmpty = false,
  children
}: APIFallbackProps) {
  const handleRetry = () => {
    if (queryKey) {
      queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] });
    } else {
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center">
        <AlertOctagon className="h-8 w-8 text-destructive mb-4" />
        <h3 className="text-lg font-medium mb-2">Unable to load data</h3>
        <p className="text-muted-foreground mb-4">
          {error?.message || "There was an error loading the data. Please try again."}
        </p>
        <Button onClick={handleRetry} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  // Return the children when there's no fallback condition
  return <>{children}</>;
}