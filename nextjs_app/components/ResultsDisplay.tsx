"use client";

import { useState } from "react";
import {
  ExternalLink,
  FileText,
  Video,
  Building2,
  User,
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
} from "lucide-react";

// Type definitions based on the actual backend API response
interface YoutubeInterview {
  url: string;
  title: string;
}

interface PersonInfo {
  name: string;
  blog_articles: string[];
  youtube_interviews: YoutubeInterview[];
}

interface PositionInfo {
  company: string;
  position: string;
  name: string;
  blog_articles: string[];
  youtube_interviews: YoutubeInterview[];
}

interface ApiResponse {
  result: string; // JSON string that needs to be parsed
  status: string;
  job_id: string;
  events: any[];
}

interface ResearchResults {
  positions: PositionInfo[];
}

interface ResultsDisplayProps {
  results: any; // Changed to any to handle the actual API response structure
  onNewSearch: () => void;
}

export default function ResultsDisplay({
  results,
  onNewSearch,
}: ResultsDisplayProps) {
  // State for managing expanded cards
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Early return if no results
  if (!results) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Results Available
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            No research results to display. Please start a new search.
          </p>
          <button
            onClick={onNewSearch}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
          >
            Start New Search
          </button>
        </div>
      </div>
    );
  }

  // Parse the actual API response structure
  const positionsData: PositionInfo[] = [];

  try {
    let resultData = null;

    // Check if results has the API response structure with a result field
    if (results && typeof results === "object" && results.result) {
      let resultString = results.result;

      // Remove markdown code block formatting if present
      if (resultString.startsWith("```json\n")) {
        resultString = resultString
          .replace(/^```json\n/, "")
          .replace(/\n```$/, "");
      }

      // Parse the JSON string in the result field
      resultData = JSON.parse(resultString);
    } else if (typeof results === "string") {
      // Handle case where results is directly a JSON string
      let resultString = results;
      if (resultString.startsWith("```json\n")) {
        resultString = resultString
          .replace(/^```json\n/, "")
          .replace(/\n```$/, "");
      }
      resultData = JSON.parse(resultString);
    }

    if (resultData) {
      // Transform the nested structure to flat array
      for (const [company, positions] of Object.entries(resultData)) {
        if (positions && typeof positions === "object") {
          for (const [position, personData] of Object.entries(positions)) {
            // Handle the case where personData is an object with blog_articles and youtube_interviews
            if (
              personData &&
              typeof personData === "object" &&
              !Array.isArray(personData)
            ) {
              const person = personData as any;
              positionsData.push({
                company,
                position,
                name: person.name || "Unknown",
                blog_articles:
                  person.blog_articles?.map((item: any) =>
                    typeof item === "string"
                      ? item
                      : item.url || item.title || "Unknown"
                  ) || [],
                youtube_interviews:
                  person.youtube_interviews?.map((item: any) => ({
                    url: item.url || "",
                    title: item.title || "Unknown",
                  })) || [],
              });
            } else if (Array.isArray(personData)) {
              // Handle array of people for this position
              for (const person of personData) {
                positionsData.push({
                  company,
                  position,
                  name: person.name || "Unknown",
                  blog_articles:
                    person.blog_articles?.map((item: any) =>
                      typeof item === "string"
                        ? item
                        : item.url || item.title || "Unknown"
                    ) || [],
                  youtube_interviews:
                    person.youtube_interviews?.map((item: any) => ({
                      url: item.url || "",
                      title: item.title || "Unknown",
                    })) || [],
                });
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error parsing results:", error);
  }

  /**
   * Toggles the expanded state of a result card
   */
  const toggleCard = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  /**
   * Expand all cards
   */
  const expandAll = () => {
    const allIds = positionsData.map((_, index) => index.toString());
    setExpandedCards(new Set(allIds));
  };

  /**
   * Collapse all cards
   */
  const collapseAll = () => {
    setExpandedCards(new Set());
  };

  /**
   * Safely handles external link clicks
   */
  const handleLinkClick = (url: string) => {
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error opening link:", error);
    }
  };

  /**
   * Gets summary statistics
   */
  const getStats = () => {
    if (!positionsData || positionsData.length === 0) {
      return {
        totalPositions: 0,
        totalBlogs: 0,
        totalVideos: 0,
        uniqueCompanies: 0,
      };
    }

    const totalPositions = positionsData.length;
    const totalBlogs = positionsData.reduce(
      (sum, pos) => sum + (pos.blog_articles?.length || 0),
      0
    );
    const totalVideos = positionsData.reduce(
      (sum, pos) => sum + (pos.youtube_interviews?.length || 0),
      0
    );
    const uniqueCompanies = new Set(positionsData.map((pos) => pos.company))
      .size;

    return { totalPositions, totalBlogs, totalVideos, uniqueCompanies };
  };

  const stats = getStats();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Summary Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Research Results
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Your AI-powered research is complete! Here are the latest
              insights.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={expandAll}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Collapse All
            </button>
            <button
              onClick={onNewSearch}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
            >
              <RefreshCw className="w-4 h-4" />
              New Search
            </button>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.uniqueCompanies}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              Companies
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.totalPositions}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">
              Positions
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.totalBlogs}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              Blog Articles
            </div>
          </div>
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.totalVideos}
            </div>
            <div className="text-sm text-red-700 dark:text-red-300">
              Video Interviews
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-4">
        {positionsData && positionsData.length > 0 ? (
          positionsData.map((position, index) => {
            const cardId = index.toString();
            const isExpanded = expandedCards.has(cardId);

            return (
              <div
                key={cardId}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                {/* Card Header - Always Visible */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => toggleCard(cardId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {position.company}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <User className="w-4 h-4" />
                          <span className="font-medium">
                            {position.position}
                          </span>
                          {position.name && position.name !== "MISSING" && (
                            <span className="text-sm">• {position.name}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Quick Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          <span>{position.blog_articles.length}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Video className="w-4 h-4" />
                          <span>{position.youtube_interviews.length}</span>
                        </div>
                      </div>

                      {/* Expand/Collapse Icon */}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Content - Expandable */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      {/* Blog Articles Section */}
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                          <FileText className="w-5 h-5 text-green-600" />
                          Blog Articles ({position.blog_articles.length})
                        </h4>

                        {position.blog_articles.length > 0 ? (
                          <div className="space-y-3">
                            {position.blog_articles.map(
                              (url: string, urlIndex: number) => (
                                <div
                                  key={urlIndex}
                                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                                >
                                  <button
                                    onClick={() => handleLinkClick(url)}
                                    className="flex items-start gap-3 w-full text-left"
                                  >
                                    <ExternalLink className="w-4 h-4 text-green-600 mt-1 flex-shrink-0 group-hover:text-green-700" />
                                    <div className="flex-1">
                                      <p className="text-sm text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                                        {url === "MISSING"
                                          ? "No article found"
                                          : url}
                                      </p>
                                      {url !== "MISSING" && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                          Click to open in new tab
                                        </p>
                                      )}
                                    </div>
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No blog articles found</p>
                          </div>
                        )}
                      </div>

                      {/* YouTube Interviews Section */}
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                          <Video className="w-5 h-5 text-red-600" />
                          YouTube Interviews (
                          {position.youtube_interviews.length})
                        </h4>

                        {position.youtube_interviews.length > 0 ? (
                          <div className="space-y-3">
                            {position.youtube_interviews.map(
                              (video: YoutubeInterview, videoIndex: number) => (
                                <div
                                  key={videoIndex}
                                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                                >
                                  <button
                                    onClick={() => handleLinkClick(video.url)}
                                    className="flex items-start gap-3 w-full text-left"
                                  >
                                    <Video className="w-4 h-4 text-red-600 mt-1 flex-shrink-0 group-hover:text-red-700" />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                                        {video.title === "MISSING"
                                          ? "No interview found"
                                          : video.title}
                                      </p>
                                      {video.title !== "MISSING" && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                          {video.url}
                                        </p>
                                      )}
                                    </div>
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <Video className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No interviews found</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Results Found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The research didn&apos;t return any results. Try different
              companies or positions.
            </p>
            <button
              onClick={onNewSearch}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
            >
              Start New Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
