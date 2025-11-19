import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { PostCategory } from "@/types/volunteer-post";

interface PostFiltersProps {
  searchTerm: string;
  category: PostCategory | "all";
  offersGuideService: boolean | "all";
  sortBy: "newest" | "oldest" | "views" | "likes";
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: PostCategory | "all") => void;
  onGuideServiceChange: (value: boolean | "all") => void;
  onSortChange: (value: "newest" | "oldest" | "views" | "likes") => void;
  onClearFilters: () => void;
}

const POST_CATEGORIES: { value: PostCategory | "all"; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "hidden-spots", label: "Hidden Spots" },
  { value: "restaurants", label: "Restaurants" },
  { value: "safety", label: "Safety" },
  { value: "culture", label: "Culture" },
  { value: "stays", label: "Stays" },
  { value: "transportation", label: "Transportation" },
  { value: "shopping", label: "Shopping" },
  { value: "entertainment", label: "Entertainment" },
  { value: "nature", label: "Nature" },
  { value: "history", label: "History" },
  { value: "other", label: "Other" },
];

export function PostFilters({
  searchTerm,
  category,
  offersGuideService,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onGuideServiceChange,
  onSortChange,
  onClearFilters,
}: PostFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters =
    searchTerm ||
    category !== "all" ||
    offersGuideService !== "all" ||
    sortBy !== "newest";

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6 shadow-sm">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search posts by title, description, or tags..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2.5 border-slate-300 focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 border-slate-300 hover:bg-[#2CA4BC]/5 hover:border-[#2CA4BC]"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-slate-600 hover:text-[#2CA4BC]"
          >
            <X className="w-4 h-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Category
            </label>
            <Select
              value={category}
              onValueChange={(value) =>
                onCategoryChange(value as PostCategory | "all")
              }
            >
              <SelectTrigger className="border-slate-300 focus:border-[#2CA4BC]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POST_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Guide Service Filter */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Guide Service
            </label>
            <Select
              value={
                offersGuideService === "all"
                  ? "all"
                  : offersGuideService
                  ? "true"
                  : "false"
              }
              onValueChange={(value) => {
                if (value === "all") {
                  onGuideServiceChange("all");
                } else {
                  onGuideServiceChange(value === "true");
                }
              }}
            >
              <SelectTrigger className="border-slate-300 focus:border-[#2CA4BC]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="true">With Guide Service</SelectItem>
                <SelectItem value="false">Without Guide Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Sort By
            </label>
            <Select
              value={sortBy}
              onValueChange={(value) =>
                onSortChange(value as "newest" | "oldest" | "views" | "likes")
              }
            >
              <SelectTrigger className="border-slate-300 focus:border-[#2CA4BC]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="views">Most Views</SelectItem>
                <SelectItem value="likes">Most Likes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Active Filters Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200">
          {searchTerm && (
            <Badge
              variant="secondary"
              className="bg-[#2CA4BC]/10 text-[#1a5f6b] border-[#2CA4BC]/20"
            >
              Search: {searchTerm}
              <button
                onClick={() => onSearchChange("")}
                className="ml-2 hover:text-[#2CA4BC]"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {category !== "all" && (
            <Badge
              variant="secondary"
              className="bg-[#2CA4BC]/10 text-[#1a5f6b] border-[#2CA4BC]/20"
            >
              Category: {category.replace("-", " ")}
              <button
                onClick={() => onCategoryChange("all")}
                className="ml-2 hover:text-[#2CA4BC]"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {offersGuideService !== "all" && (
            <Badge
              variant="secondary"
              className="bg-[#2CA4BC]/10 text-[#1a5f6b] border-[#2CA4BC]/20"
            >
              {offersGuideService ? "With Guide" : "Without Guide"}
              <button
                onClick={() => onGuideServiceChange("all")}
                className="ml-2 hover:text-[#2CA4BC]"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {sortBy !== "newest" && (
            <Badge
              variant="secondary"
              className="bg-[#2CA4BC]/10 text-[#1a5f6b] border-[#2CA4BC]/20"
            >
              Sort: {sortBy}
              <button
                onClick={() => onSortChange("newest")}
                className="ml-2 hover:text-[#2CA4BC]"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}








