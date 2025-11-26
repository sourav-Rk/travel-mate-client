import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BadgeFiltersProps {
  filters: {
    isActive?: boolean;
    category?: string;
  };
  onFiltersChange: (filters: { isActive?: boolean; category?: string }) => void;
}

export function BadgeFilters({ filters, onFiltersChange }: BadgeFiltersProps) {
  const handleCategoryChange = (value: string) => {
    onFiltersChange({
      ...filters,
      category: value === "all" ? undefined : value,
    });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      isActive: value === "all" ? undefined : value === "active",
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.category || filters.isActive !== undefined;

  return (
    <div className="flex flex-wrap gap-2 w-full md:w-auto">
      <Select value={filters.category || "all"} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-full md:w-[140px] bg-white border-slate-200">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="service">Service</SelectItem>
          <SelectItem value="content">Content</SelectItem>
          <SelectItem value="engagement">Engagement</SelectItem>
          <SelectItem value="achievement">Achievement</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.isActive === undefined ? "all" : filters.isActive ? "active" : "inactive"}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-full md:w-[140px] bg-white border-slate-200">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="border-slate-200 hover:bg-slate-50 w-full md:w-auto"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}

