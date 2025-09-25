"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Filter, Calendar, MapPin, Delete, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TripCard } from "./TripCard";
import type { GuidePackageListingTableDto } from "@/types/api/guide";
import { useGetAssignedPackagesQuery } from "@/hooks/guide/useGuidePackage";
import Pagination from "@/components/Pagination";
import { getAssignedPackages } from "@/services/guide/guide.service";
import _ from "lodash"
import { useNavigate } from "react-router-dom";

export function AssignedTripsList() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<GuidePackageListingTableDto[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 5;

  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data } = useGetAssignedPackagesQuery(
    getAssignedPackages,
    page,
    limit,
    debouncedSearchTerm,
    statusFilter
  );

   const debouncedSearch = useCallback(
      _.debounce((query) => {
        setDebouncedSearchTerm(query)
      }, 500),
      [],
    )
  

  useEffect(() => {
    if (data) {
      setTrips(data.packages);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    }
  }, [data, page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value)
      debouncedSearch(e.target.value)
    }

    const handleClearSearch = () => {
      setDebouncedSearchTerm("");
      setSearchTerm("");
    }

  const getStatusCounts = () => {
    return trips?.reduce((acc, trip) => {
      acc[trip.status] = (acc[trip.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50 md:ml-64">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1a5f6b] mb-2">
                Assigned Trips
              </h1>
              <p className="text-gray-600">
                Manage and view your assigned travel packages
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                <Calendar className="h-3 w-3 mr-1" />
                {statusCounts?.confirmed || 0} Confirmed
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1">
                <Calendar className="h-3 w-3 mr-1" />
                {statusCounts?.pending || 0} Pending
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                <Calendar className="h-3 w-3 mr-1" />
                {statusCounts?.completed || 0} Completed
              </Badge>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search trips by name or title..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-10 border-gray-200 focus:border-[#2CA4BC] focus:ring-[#2CA4BC]/20"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
            {/* Filters */}
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] border-gray-200">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="applications_closed">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

            </div>
          </div>
        </div>

        {/* Trips Grid */}
        {trips?.length! > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips!.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No trips found
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "You don't have any assigned trips yet"}
            </p>
          </div>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        onPageChange={setPage}
        totalPages={totalPages}
      />
    </div>
  );
}
