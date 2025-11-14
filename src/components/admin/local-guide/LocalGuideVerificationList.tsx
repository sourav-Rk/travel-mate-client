
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  X,
  UserCheck,
  TrendingUp,
  Filter,
} from "lucide-react";
import { usePendingVerifications } from "@/hooks/local-guide/useLocalGuideVerification";
import { Spinner } from "@/components/Spinner";
import Pagination from "@/components/Pagination";
import type { LocalGuideProfile } from "@/types/local-guide";
import { cn } from "@/lib/utils";
import _ from "lodash";

export function LocalGuideVerificationList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState<
    "pending" | "reviewing" | "verified" | "rejected"
  >("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  const debouncedSearch = useCallback(
    _.debounce((query: string) => {
      setDebouncedSearchTerm(query);
    }, 500),
    []
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, status]);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  const { data, isLoading, refetch } = usePendingVerifications(
    page,
    limit,
    status,
    true,
    debouncedSearchTerm
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      reviewing: "bg-blue-50 text-blue-700 border-blue-200",
      verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
    };

    const icons: Record<string, React.ReactElement> = {
      pending: <Clock className="h-3.5 w-3.5" />,
      reviewing: <TrendingUp className="h-3.5 w-3.5" />,
      verified: <CheckCircle className="h-3.5 w-3.5" />,
      rejected: <XCircle className="h-3.5 w-3.5" />,
    };

    return (
      <Badge
        variant="outline"
        className={cn("flex items-center gap-1.5 px-3 py-1 font-medium", variants[status])}
      >
        {icons[status]}
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const profiles = data?.profiles || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-600 font-medium">Loading verifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-900 rounded-lg">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Local Guide Verifications
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Review and manage verification requests
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <Select value={status} onValueChange={(value) => {
                  setStatus(value as "pending" | "reviewing" | "verified" | "rejected");
                  setPage(1);
                }}>
                  <SelectTrigger className="w-full sm:w-[180px] pl-10 border-gray-300 focus:ring-gray-900 focus:border-gray-900">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="border-gray-300 hover:bg-gray-50"
              >
                <Loader2 className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by name, email, city, or state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-12 h-11 border-gray-300 focus:ring-gray-900 focus:border-gray-900"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {isLoading && debouncedSearchTerm && (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                )}
                {searchTerm && !isLoading && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="h-6 w-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
                    type="button"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total", value: data?.total || 0, bg: "bg-gray-900", icon: UserCheck },
            { label: "Pending", value: profiles.filter((p: LocalGuideProfile) => p.verificationStatus === "pending").length, bg: "bg-amber-500", icon: Clock },
            { label: "Verified", value: profiles.filter((p: LocalGuideProfile) => p.verificationStatus === "verified").length, bg: "bg-emerald-500", icon: CheckCircle },
            { label: "Rejected", value: profiles.filter((p: LocalGuideProfile) => p.verificationStatus === "rejected").length, bg: "bg-red-500", icon: XCircle },
          ].map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <Card key={idx} className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bg}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Table Card */}
        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-900 hover:bg-gray-900 border-b-0">
                    <TableHead className="text-white font-semibold text-sm py-4">Guide Details</TableHead>
                    <TableHead className="text-white font-semibold text-sm py-4">Location</TableHead>
                    <TableHead className="text-white font-semibold text-sm py-4">Status</TableHead>
                    <TableHead className="text-white font-semibold text-sm py-4">Requested</TableHead>
                    <TableHead className="text-white font-semibold text-sm py-4">Languages</TableHead>
                    <TableHead className="text-white font-semibold text-sm py-4">Rate</TableHead>
                    <TableHead className="text-white font-semibold text-sm py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <Eye className="h-8 w-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-gray-900 font-semibold text-lg">
                              No {status} verification requests found
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                              {debouncedSearchTerm
                                ? "Try adjusting your search criteria"
                                : "All verification requests have been processed"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    profiles.map((profile: LocalGuideProfile, idx: number) => (
                      <TableRow
                        key={profile._id}
                        className="hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                        onClick={() => navigate(`/admin/ad_pvt/local-guides/${profile._id}`)}
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-11 w-11 border-2 border-gray-200">
                              <AvatarImage
                                src={profile.userDetails?.profileImage || profile.profileImage}
                                alt={`${profile.userDetails?.firstName || ""} ${profile.userDetails?.lastName || ""}`.trim() || "Guide"}
                              />
                              <AvatarFallback className="bg-gray-900 text-white font-semibold text-sm">
                                {(profile.userDetails?.firstName?.[0] || profile.userDetails?.lastName?.[0] || "G").toUpperCase()}
                                {(profile.userDetails?.lastName?.[0] || "").toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-900 text-sm truncate" title={`${profile.userDetails?.firstName || ""} ${profile.userDetails?.lastName || ""}`.trim()}>
                                {profile.userDetails?.firstName && profile.userDetails?.lastName
                                  ? `${profile.userDetails.firstName} ${profile.userDetails.lastName}`
                                  : profile.userDetails?.firstName || profile.userDetails?.lastName || "Name not available"}
                              </p>
                              <p className="text-xs text-gray-500 truncate mt-0.5" title={profile.userDetails?.email || ""}>
                                {profile.userDetails?.email || "Not available"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {profile.location.city}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {profile.location.state}, {profile.location.country}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">{getStatusBadge(profile.verificationStatus)}</TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {formatDate(profile.verificationRequestedAt)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {profile.languages.slice(0, 2).map((lang, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs bg-gray-50 text-gray-700 border-gray-200"
                              >
                                {lang}
                              </Badge>
                            ))}
                            {profile.languages.length > 2 && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-gray-900 text-white border-gray-900"
                              >
                                +{profile.languages.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-gray-900 text-sm">
                              ₹{profile.hourlyRate}
                            </span>
                            <span className="text-xs text-gray-500">/hr</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/ad_pvt/local-guides/${profile._id}`);
                            }}
                            className="bg-gray-900 text-white border-gray-900 hover:bg-gray-800"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {data && data.totalPages > 0 && (
          <div className="flex flex-col items-center gap-4 pb-6">
            {data.total > 0 && (
              <div className="bg-white px-6 py-3 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-semibold text-gray-900">{profiles.length}</span> of <span className="font-semibold text-gray-900">{data.total}</span> {status} verification{data.total !== 1 ? "s" : ""}
                  {debouncedSearchTerm && (
                    <span className="text-gray-500"> matching <span className="font-semibold text-gray-700">"{debouncedSearchTerm}"</span></span>
                  )}
                </p>
              </div>
            )}
            {data.totalPages > 1 && (
              <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                <Pagination
                  currentPage={data.currentPage}
                  totalPages={data.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}