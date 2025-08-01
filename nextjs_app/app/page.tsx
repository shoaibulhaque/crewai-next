"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ResearchForm from "@/components/ResearchForm";
import JobTracker from "@/components/JobTracker";
import ResultsDisplay from "@/components/ResultsDisplay";
import { ToastContainer, useToast } from "@/components/Toast";
import NoSSR from "@/components/NoSSR";
import { ArrowLeft } from "lucide-react";

// Define the research results interface
interface ResearchResults {
  positions: Array<{
    company: string;
    position: string;
    name: string;
    blog_articles_urls: string[];
    youtube_interview_urls: Array<{
      name: string;
      urls: string;
    }>;
  }>;
}

export default function Home() {
  // Hydration safety
  const [mounted, setMounted] = useState(false);

  // State management for the entire research flow
  const [currentView, setCurrentView] = useState<
    "home" | "form" | "tracking" | "results"
  >("home");
  const [jobId, setJobId] = useState<string | null>(null);
  const [researchResults, setResearchResults] =
    useState<ResearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Toast notifications
  const { toasts, addToast, removeToast } = useToast();

  // Ensure component is mounted to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Handles starting a new research job
   */
  const handleStartResearch = async (data: {
    companies: string[];
    positions: string[];
  }) => {
    setIsLoading(true);

    try {
      // Show starting toast
      addToast({
        type: "info",
        title: "Starting Research",
        message: `Researching ${data.companies.length} companies and ${data.positions.length} positions...`,
      });

      // Call the backend API to start research
      const response = await fetch("http://127.0.0.1:3001/api/crew", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companies: data.companies,
          positions: data.positions,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setJobId(result.job_id);
        setCurrentView("tracking");

        addToast({
          type: "success",
          title: "Research Started",
          message:
            "AI agents are now researching your companies and positions.",
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error starting research:", error);

      addToast({
        type: "error",
        title: "Research Failed to Start",
        message: "Please check if the backend is running on port 3001.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles research completion
   */
  const handleResearchComplete = (results: unknown) => {
    console.log("Research completed with results:", results); // Debug log
    console.log("Results type:", typeof results); // Debug log
    console.log("Results structure:", JSON.stringify(results, null, 2)); // Debug log

    setResearchResults(results as ResearchResults);
    setCurrentView("results");

    addToast({
      type: "success",
      title: "Research Complete!",
      message: "Your AI-powered research has finished successfully.",
    });
  };

  /**
   * Resets to home view for a new search
   */
  const handleNewSearch = () => {
    setCurrentView("home");
    setJobId(null);
    setResearchResults(null);
    setIsLoading(false);
  };

  /**
   * Goes back to form view
   */
  const handleBackToForm = () => {
    setCurrentView("form");
    setJobId(null);
  };

  return (
    <>
      {!mounted ? (
        // Show minimal loading state until mounted to prevent hydration issues
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
          {/* Home/Landing View */}
          {currentView === "home" && (
            <section className="flex items-center justify-center px-4 py-24 lg:py-32">
              <div className="mx-auto max-w-screen-xl text-center">
                {/* App Icon */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                      <svg
                        className="w-12 h-12 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Main Heading */}
                <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white md:text-6xl lg:text-7xl">
                  AI Company &{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Position Research
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="mb-8 text-xl font-normal text-gray-600 dark:text-gray-300 sm:px-16 xl:px-48 leading-relaxed">
                  Instantly gather the latest blogs and interviews for any
                  company and role.
                  <br />
                  <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Powered by autonomous AI agents that deliver real,
                    up-to-date insights.
                  </span>
                </p>

                {/* Feature highlights */}
                <div className="mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                  <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mb-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 text-center">
                      Structured JSON results
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mb-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 text-center">
                      YouTube interviews
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
                    <div className="w-3 h-3 bg-green-500 rounded-full mb-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 text-center">
                      Real-time data
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
                    <div className="w-3 h-3 bg-pink-500 rounded-full mb-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 text-center">
                      Fast & reliable
                    </span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    onClick={() => setCurrentView("form")}
                    className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    Get Started Free
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-4 text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    Watch Demo
                  </Button>
                </div>

                {/* Trust indicators */}
                <div className="mt-12 flex flex-col items-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Trusted by professionals worldwide
                  </p>
                  <div className="flex items-center space-x-8 opacity-60">
                    <div className="w-8 h-8 bg-gray-400 rounded"></div>
                    <div className="w-8 h-8 bg-gray-400 rounded"></div>
                    <div className="w-8 h-8 bg-gray-400 rounded"></div>
                    <div className="w-8 h-8 bg-gray-400 rounded"></div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Research Form View */}
          {currentView === "form" && (
            <section className="px-4 py-12">
              {/* Back to Home Button */}
              <div className="max-w-4xl mx-auto mb-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentView("home")}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </div>

              <ResearchForm
                onSubmit={handleStartResearch}
                isLoading={isLoading}
              />
            </section>
          )}

          {/* Job Tracking View */}
          {currentView === "tracking" && (
            <section className="px-4 py-12">
              {/* Back to Form Button */}
              <div className="max-w-4xl mx-auto mb-6">
                <Button
                  variant="outline"
                  onClick={handleBackToForm}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Form
                </Button>
              </div>

              <JobTracker jobId={jobId} onComplete={handleResearchComplete} />
            </section>
          )}

          {/* Results View */}
          {currentView === "results" && researchResults && (
            <section className="px-4 py-12">
              <ResultsDisplay
                results={researchResults}
                onNewSearch={handleNewSearch}
              />
            </section>
          )}
        </div>
      )}

      {/* Toast Notifications - only show when mounted */}
      <NoSSR>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </NoSSR>
    </>
  );
}
