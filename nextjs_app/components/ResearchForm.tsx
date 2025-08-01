"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2, Building2, Users, Search } from "lucide-react";

interface ResearchFormProps {
  onSubmit: (data: { companies: string[]; positions: string[] }) => void;
  isLoading: boolean;
}

export default function ResearchForm({
  onSubmit,
  isLoading,
}: ResearchFormProps) {
  // State for managing companies and positions arrays
  const [companies, setCompanies] = useState<string[]>([""]);
  const [positions, setPositions] = useState<string[]>([""]);

  /**
   * Handles adding a new empty field to either companies or positions
   */
  const addField = (type: "companies" | "positions") => {
    if (type === "companies") {
      setCompanies([...companies, ""]);
    } else {
      setPositions([...positions, ""]);
    }
  };

  /**
   * Handles removing a field from either companies or positions
   */
  const removeField = (type: "companies" | "positions", index: number) => {
    if (type === "companies" && companies.length > 1) {
      setCompanies(companies.filter((_, i) => i !== index));
    } else if (type === "positions" && positions.length > 1) {
      setPositions(positions.filter((_, i) => i !== index));
    }
  };

  /**
   * Handles updating a specific field value
   */
  const updateField = (
    type: "companies" | "positions",
    index: number,
    value: string
  ) => {
    if (type === "companies") {
      const newCompanies = [...companies];
      newCompanies[index] = value;
      setCompanies(newCompanies);
    } else {
      const newPositions = [...positions];
      newPositions[index] = value;
      setPositions(newPositions);
    }
  };

  /**
   * Handles form submission - filters out empty values and calls parent onSubmit
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty strings and trim whitespace
    const filteredCompanies = companies
      .filter((c) => c.trim() !== "")
      .map((c) => c.trim());
    const filteredPositions = positions
      .filter((p) => p.trim() !== "")
      .map((p) => p.trim());

    // Validate that we have at least one company and position
    if (filteredCompanies.length === 0 || filteredPositions.length === 0) {
      alert("Please add at least one company and one position");
      return;
    }

    onSubmit({
      companies: filteredCompanies,
      positions: filteredPositions,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      {/* Form Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Start Your Research
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Add companies and positions to research. Our AI agents will find the
          latest blog articles and interviews.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Companies Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Companies
              </h3>
              <span className="text-sm text-gray-500">
                ({companies.filter((c) => c.trim()).length})
              </span>
            </div>

            {companies.map((company, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={company}
                  onChange={(e) =>
                    updateField("companies", index, e.target.value)
                  }
                  placeholder={`Company ${
                    index + 1
                  } (e.g., Apple, Google, Microsoft)`}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  disabled={isLoading}
                />
                {companies.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeField("companies", index)}
                    className="px-3 py-3 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => addField("companies")}
              className="w-full py-3 border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-all duration-200"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          </div>

          {/* Positions Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Positions
              </h3>
              <span className="text-sm text-gray-500">
                ({positions.filter((p) => p.trim()).length})
              </span>
            </div>

            {positions.map((position, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={position}
                  onChange={(e) =>
                    updateField("positions", index, e.target.value)
                  }
                  placeholder={`Position ${
                    index + 1
                  } (e.g., CEO, CTO, VP Engineering)`}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  disabled={isLoading}
                />
                {positions.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeField("positions", index)}
                    className="px-3 py-3 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => addField("positions")}
              className="w-full py-3 border-dashed border-2 border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20 transition-all duration-200"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Position
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="submit"
            size="lg"
            disabled={
              isLoading ||
              companies.filter((c) => c.trim()).length === 0 ||
              positions.filter((p) => p.trim()).length === 0
            }
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                AI Agents Researching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Start Research ({companies.filter((c) => c.trim()).length}{" "}
                companies × {positions.filter((p) => p.trim()).length}{" "}
                positions)
              </>
            )}
          </Button>

          {/* Research scope preview */}
          {companies.filter((c) => c.trim()).length > 0 &&
            positions.filter((p) => p.trim()).length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  This will research{" "}
                  <span className="font-semibold text-blue-600">
                    {companies.filter((c) => c.trim()).length} companies
                  </span>{" "}
                  ×{" "}
                  <span className="font-semibold text-purple-600">
                    {positions.filter((p) => p.trim()).length} positions
                  </span>{" "}
                  ={" "}
                  {companies.filter((c) => c.trim()).length *
                    positions.filter((p) => p.trim()).length}{" "}
                  total combinations
                  <br />
                  Expected results:{" "}
                  <span className="font-semibold">
                    {companies.filter((c) => c.trim()).length *
                      positions.filter((p) => p.trim()).length *
                      6}{" "}
                    items
                  </span>{" "}
                  (3 blogs + 3 interviews per combination)
                </p>
              </div>
            )}
        </div>
      </form>
    </div>
  );
}
