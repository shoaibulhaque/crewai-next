"use client";

import { Loader2, Bot, Search, FileText, Video } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  showSteps?: boolean;
}

export default function LoadingSpinner({
  message = "Loading...",
  showSteps = false,
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      {/* Main Loading Spinner */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Bot className="w-8 h-8 text-blue-600 animate-bounce" />
        </div>
      </div>

      {/* Loading Message */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {message}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Please wait while our AI agents work their magic...
        </p>
      </div>

      {/* AI Process Steps */}
      {showSteps && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
          <div className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-3">
              <Search className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Searching
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              Finding companies and positions
            </p>
          </div>

          <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Analyzing
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              Gathering blog articles
            </p>
          </div>

          <div className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mb-3">
              <Video className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Collecting
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              Finding video interviews
            </p>
          </div>
        </div>
      )}

      {/* Animated Progress Dots */}
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
        <div
          className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
    </div>
  );
}

// Simple inline loading spinner for buttons
export function InlineLoader({
  className = "w-4 h-4",
}: {
  className?: string;
}) {
  return <Loader2 className={`animate-spin ${className}`} />;
}
