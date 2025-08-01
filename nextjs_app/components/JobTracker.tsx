"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

interface JobStatus {
  job_id: string;
  status: "STARTED" | "COMPLETE" | "ERROR";
  result: unknown;
  events: Array<{
    timestamp: string;
    data: string;
  }>;
}

interface JobTrackerProps {
  jobId: string | null;
  onComplete: (result: unknown) => void;
}

export default function JobTracker({ jobId, onComplete }: JobTrackerProps) {
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  /**
   * Polls the backend API to get job status updates
   */
  const pollJobStatus = useCallback(async () => {
    if (!jobId) return;

    try {
      const response = await fetch(`http://localhost:3001/api/crew/${jobId}`);
      if (response.ok) {
        const status: JobStatus = await response.json();
        console.log("Job status response:", status); // Debug log
        setJobStatus(status);

        // If job is complete, stop polling and notify parent
        if (status.status === "COMPLETE") {
          setIsPolling(false);
          console.log("Job complete, result:", status.result); // Debug log
          onComplete(status.result);
        } else if (status.status === "ERROR") {
          setIsPolling(false);
        }
      }
    } catch (error) {
      console.error("Error polling job status:", error);
    }
  }, [jobId, onComplete]);

  /**
   * Set up polling when jobId changes
   */
  useEffect(() => {
    if (jobId && !isPolling) {
      setIsPolling(true);
      setJobStatus(null);

      // Poll immediately, then every 2 seconds
      pollJobStatus();
      const interval = setInterval(pollJobStatus, 2000);

      return () => clearInterval(interval);
    }
  }, [jobId, isPolling, pollJobStatus]);

  /**
   * Continue polling while job is in progress
   */
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPolling && jobId) {
      interval = setInterval(pollJobStatus, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPolling, jobId, pollJobStatus]);

  if (!jobId) return null;

  /**
   * Formats timestamp for display
   */
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  /**
   * Gets status icon based on job status
   */
  const getStatusIcon = () => {
    switch (jobStatus?.status) {
      case "COMPLETE":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "ERROR":
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
    }
  };

  /**
   * Gets status color classes
   */
  const getStatusColor = () => {
    switch (jobStatus?.status) {
      case "COMPLETE":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20";
      case "ERROR":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20";
      default:
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20";
    }
  };

  return (
    <div
      className={`max-w-4xl mx-auto p-6 rounded-2xl shadow-xl border transition-all duration-300 ${getStatusColor()}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {getStatusIcon()}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Research Progress
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Job ID:{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs">
              {jobId}
            </code>
          </p>
        </div>
        <div className="ml-auto">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              jobStatus?.status === "COMPLETE"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : jobStatus?.status === "ERROR"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            }`}
          >
            {jobStatus?.status || "STARTING"}
          </span>
        </div>
      </div>

      {/* Status Message */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {jobStatus?.status === "COMPLETE" && (
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              Research completed successfully!
            </span>
          </div>
        )}
        {jobStatus?.status === "ERROR" && (
          <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">
              Research failed: {String(jobStatus.result)}
            </span>
          </div>
        )}
        {(!jobStatus || jobStatus.status === "STARTED") && (
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium">
              AI agents are researching companies and positions...
            </span>
          </div>
        )}
      </div>

      {/* Events Timeline */}
      {jobStatus?.events && jobStatus.events.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Activity Timeline
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {jobStatus.events.map((event, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {event.data}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatTimestamp(event.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Indicators */}
      {(!jobStatus || jobStatus.status === "STARTED") && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Research in progress...</span>
            <span>This may take 1-3 minutes</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse"
              style={{
                width: "100%",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Success Actions */}
      {jobStatus?.status === "COMPLETE" && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => onComplete(jobStatus.result)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Results
          </button>
        </div>
      )}
    </div>
  );
}
