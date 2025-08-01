"use client";

import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onHome?: () => void;
  showRetry?: boolean;
  showHome?: boolean;
}

export default function ErrorDisplay({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  onHome,
  showRetry = true,
  showHome = true,
}: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 max-w-lg mx-auto text-center">
      {/* Error Icon */}
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>

      {/* Error Message */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {message}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {showRetry && onRetry && (
          <Button
            onClick={onRetry}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}

        {showHome && onHome && (
          <Button
            onClick={onHome}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        )}
      </div>

      {/* Help Text */}
      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>If the problem persists:</p>
        <ul className="text-left space-y-1">
          <li>• Check your internet connection</li>
          <li>• Make sure the backend server is running</li>
          <li>• Try refreshing the page</li>
        </ul>
      </div>
    </div>
  );
}

// Network Error Component
export function NetworkError({
  onRetry,
  onHome,
}: {
  onRetry?: () => void;
  onHome?: () => void;
}) {
  return (
    <ErrorDisplay
      title="Network Error"
      message="Unable to connect to the research service. Please check if the backend is running on port 3001."
      onRetry={onRetry}
      onHome={onHome}
    />
  );
}

// API Error Component
export function ApiError({
  error,
  onRetry,
  onHome,
}: {
  error?: string;
  onRetry?: () => void;
  onHome?: () => void;
}) {
  return (
    <ErrorDisplay
      title="Research Failed"
      message={
        error ||
        "The AI research process encountered an error. This might be due to API limits or network issues."
      }
      onRetry={onRetry}
      onHome={onHome}
    />
  );
}
