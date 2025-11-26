import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

import { useBadges } from "@/hooks/admin/useBadges";
import { BadgeList } from "@/components/admin/badge/BadgeList";
import { BadgeFilters } from "@/components/admin/badge/BadgeFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/Pagination";

export default function BadgeManagementPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [filters, setFilters] = useState<{
    isActive?: boolean;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }>({});

  // Debounce search query
  const debouncedSearch = useCallback(
    _.debounce((query: string) => {
      setDebouncedSearchQuery(query);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, statusFilter, categoryFilter]);

  // Update filters when debounced search query, page, or filter changes
  useEffect(() => {
    setFilters({
      isActive: statusFilter,
      category: categoryFilter,
      search: debouncedSearchQuery.trim() || undefined,
      page,
      limit,
    });
  }, [debouncedSearchQuery, page, limit, statusFilter, categoryFilter]);

  const { data, isLoading, isError } = useBadges(filters);
  const badges = data?.badges || [];
  const currentPage = data?.currentPage || 1;
  const totalPages = data?.totalPages || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="ml-0 lg:ml-64 min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 transition-all duration-300"
    >
      <div className="p-4 lg:p-8 pt-16 lg:pt-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                  Badge Management
                </h1>
                <p className="text-slate-600 text-sm lg:text-base">
                  Create and manage badges for local guides
                </p>
              </div>
              <Button
                onClick={() => navigate("/admin/ad_pvt/badges/create")}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Badge
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search badges by name, description, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <BadgeFilters
                filters={{ isActive: statusFilter, category: categoryFilter }}
                onFiltersChange={(newFilters) => {
                  setStatusFilter(newFilters.isActive);
                  setCategoryFilter(newFilters.category);
                }}
              />
            </div>
          </div>
        </div>

        {/* Badge List */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          </div>
        ) : isError ? (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 lg:p-12 text-center">
            <p className="text-red-600 font-medium text-lg">Failed to load badges</p>
            <p className="text-red-500 text-sm mt-1">Please try again later</p>
          </div>
        ) : badges.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 lg:p-12 text-center">
            <div className="text-5xl lg:text-6xl mb-4">🏆</div>
            <h3 className="text-lg lg:text-xl font-semibold text-slate-900 mb-2">
              {debouncedSearchQuery ? "No badges found" : "No badges yet"}
            </h3>
            <p className="text-slate-600 mb-6 text-sm lg:text-base">
              {debouncedSearchQuery
                ? "Try adjusting your search or filters"
                : "Create your first badge to get started"}
            </p>
            {!debouncedSearchQuery && (
              <Button
                onClick={() => navigate("/admin/ad_pvt/badges/create")}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Badge
              </Button>
            )}
          </div>
        ) : (
          <>
            <BadgeList badges={badges} />
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

