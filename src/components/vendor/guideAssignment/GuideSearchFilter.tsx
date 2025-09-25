"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Users } from "lucide-react";
import { debounce } from "lodash";

export interface SearchFilters {
  searchTerm: string;
  availability?: "free" | "inTrip";
  languages: string[];
  minExperience?: number;
  maxExperience?: number;
  gender?: string;
}

interface GuidesSearchFilterProps {
  onFiltersChange: (filters: SearchFilters) => void;
  availableLanguages: string[];
  totalGuides: number;
  filteredCount: number;
}

export function GuidesSearchFilter({
  onFiltersChange,
  availableLanguages,
  totalGuides,
  filteredCount,
}: GuidesSearchFilterProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    availability: undefined,
    languages: [],
    minExperience: undefined,
    maxExperience: undefined,
    gender: undefined,
  });

  const [showFilters, setShowFilters] = useState(false);

  const debouncedUpdateFilters = useMemo(
    () =>
      debounce((newFilters: SearchFilters) => {
        onFiltersChange(newFilters);
      }, 500),
    [onFiltersChange]
  );

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    if (newFilters.searchTerm !== undefined) {
      debouncedUpdateFilters(updatedFilters);
    } else {
      onFiltersChange(updatedFilters);
    }
  };

  const clearAllFilters = () => {
    const cleared: SearchFilters = {
      searchTerm: "",
      availability: undefined,
      languages: [],
      minExperience: undefined,
      maxExperience: undefined,
      gender: undefined,
    };
    setFilters(cleared);
    onFiltersChange(cleared);
  };

  const activeFiltersCount =
    (filters.availability ? 1 : 0) +
    (filters.gender ? 1 : 0) +
    filters.languages.length +
    (filters.searchTerm ? 1 : 0) +
    (filters.minExperience !== undefined || filters.maxExperience !== undefined
      ? 1
      : 0);

  return (
    <Card className="border-0 shadow-lg mb-6">
      <CardContent className="p-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search guides by name or email..."
            value={filters.searchTerm}
            onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            className="pl-10 h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Toggle & Results */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 h-10"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="bg-blue-600 text-white ml-1 px-2 py-0.5 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>
                Showing {filteredCount} of {totalGuides} guides
              </span>
            </div>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="border-t pt-4 space-y-6">
            {/* Gender (radio-like) */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Gender</h4>
              <div className="flex gap-2">
                {["male", "female", "other"].map((g) => (
                  <Button
                    key={g}
                    variant={filters.gender === g ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      updateFilters({
                        gender: filters.gender === g ? undefined : g,
                      })
                    }
                    className={
                      filters.gender === g
                        ? "bg-purple-600 hover:bg-purple-700"
                        : ""
                    }
                  >
                    {g}
                  </Button>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {availableLanguages.map((lang) => (
                  <Button
                    key={lang}
                    variant={
                      filters.languages.includes(lang) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      updateFilters({
                        languages: filters.languages.includes(lang)
                          ? filters.languages.filter((l) => l !== lang)
                          : [...filters.languages, lang],
                      })
                    }
                    className={
                      filters.languages.includes(lang)
                        ? "bg-blue-600 hover:bg-blue-700"
                        : ""
                    }
                  >
                    {lang}
                  </Button>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Years of Experience
              </h4>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minExperience ?? ""}
                  onChange={(e) =>
                    updateFilters({
                      minExperience: e.target.value
                        ? +e.target.value
                        : undefined,
                    })
                  }
                  className="w-20 h-8"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxExperience ?? ""}
                  onChange={(e) =>
                    updateFilters({
                      maxExperience: e.target.value
                        ? +e.target.value
                        : undefined,
                    })
                  }
                  className="w-20 h-8"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
