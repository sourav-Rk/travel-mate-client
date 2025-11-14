import { useState, useEffect } from "react";
import { PostCard } from "./PostCard";
import { PostFilters } from "./PostFilters";
import { VolunteerPostMobileProfile } from "./VolunteerPostMobileProfile";
import Pagination from "@/components/Pagination";
import { useVolunteerPosts, useSearchVolunteerPosts } from "@/hooks/volunteer-post/useVolunteerPost";
import type { PostCategory } from "@/types/volunteer-post";
import { Loader2 } from "lucide-react";
import { useClientAuth } from "@/hooks/auth/useAuth";

interface PostListProps {
  initialFilters?: {
    category?: PostCategory;
    offersGuideService?: boolean;
  };
}

export function PostList({ initialFilters }: PostListProps) {
  const { isLoggedIn } = useClientAuth();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [category, setCategory] = useState<PostCategory | "all">(
    initialFilters?.category || "all"
  );
  const [offersGuideService, setOffersGuideService] = useState<boolean | "all">(
    initialFilters?.offersGuideService !== undefined
      ? initialFilters.offersGuideService
      : "all"
  );
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "views" | "likes">("newest");

  const limit = 10;

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  const shouldSearch = debouncedSearchTerm.trim().length > 0;

  const { data: postsData, isLoading: isLoadingPosts } = useVolunteerPosts(
    shouldSearch
      ? undefined
      : {
          page,
          limit,
          category: category !== "all" ? category : undefined,
          offersGuideService:
            offersGuideService !== "all" ? offersGuideService : undefined,
          sortBy,
          status: "published",
        },
    !shouldSearch
  );

  const {
    data: searchData,
    isLoading: isLoadingSearch,
  } = useSearchVolunteerPosts(
    {
      searchTerm: debouncedSearchTerm.trim(),
      page,
      limit,
      category: category !== "all" ? category : undefined,
      offersGuideService:
        offersGuideService !== "all" ? offersGuideService : undefined,
      sortBy,
    },
    shouldSearch
  );

  const data = shouldSearch ? searchData : postsData;
  const isLoading = shouldSearch ? isLoadingSearch : isLoadingPosts;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, category, offersGuideService, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCategory("all");
    setOffersGuideService("all");
    setSortBy("newest");
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#2CA4BC]" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Failed to load posts</p>
      </div>
    );
  }

  const posts = data.posts || [];
  const total = data.total || 0;
  const totalPages = data.totalPages || 0;
  const currentPage = data.currentPage || 1;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mobile Profile Accordion */}
      {isLoggedIn && (
        <div className="lg:hidden">
          <VolunteerPostMobileProfile />
        </div>
      )}

      {/* Filters */}
      <PostFilters
        searchTerm={searchTerm}
        category={category}
        offersGuideService={offersGuideService}
        sortBy={sortBy}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategory}
        onGuideServiceChange={setOffersGuideService}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-slate-600">
          {total} {total === 1 ? "post" : "posts"} found
        </p>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200 shadow-sm">
          <p className="text-slate-600 text-lg mb-2">No posts found</p>
          <p className="text-slate-500 text-sm">
            Try adjusting your filters or search term
          </p>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {posts.map((post, index) => (
            <PostCard key={post._id} post={post} index={index} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}