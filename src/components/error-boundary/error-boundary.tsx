"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { logger } from "@/lib/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error("React Error Boundary caught an error", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[300px] items-center justify-center p-8">
          <div className="text-center space-y-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Something went wrong</h2>
              <p className="mt-2 text-sm text-slate-500">
                We encountered an unexpected error. Please try again.
              </p>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-4 text-left text-xs text-slate-400">
                  <summary className="cursor-pointer">Error details</summary>
                  <pre className="mt-2 overflow-auto rounded bg-slate-100 p-2">{this.state.error.stack}</pre>
                </details>
              )}
            </div>
            <Button onClick={this.handleRetry} className="mt-4 gap-2">
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}