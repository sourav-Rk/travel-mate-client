"use client"

import type React from "react"

import { useCallback, useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Star,
  MoreHorizontal,
  Send,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from "react-router-dom"
import { useGetPackagesQuery, useUpdatePackageStatusMutation, type PackageDetails } from "@/hooks/vendor/usePackage"
import { getAllPackages } from "@/services/vendor/vendorService"
import Pagination from "@/components/Pagination"
import { Spinner } from "@/components/Spinner"
import _ from "lodash"
import toast from "react-hot-toast"

type PackageStatus = "all" | "active" | "ongoing" | "draft" | "completed" | "blocked"
type PackageCategory = "all" | "nature" | "beach" | "adventure" | "heritage" | "cultural"

export function PackagesTable() {
  const navigate = useNavigate()
  const [packages, setPackage] = useState<PackageDetails[]>()
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<PackageStatus>("all")
  const [categoryFilter, setCategoryFilter] = useState<PackageCategory>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const limit = 5;

  const {mutate : updateStatus}= useUpdatePackageStatusMutation();

  const { data, isLoading } = useGetPackagesQuery(
    getAllPackages,
    page,
    limit,
    debouncedSearchTerm,
    statusFilter,
    categoryFilter,
    "vendor",
  )

  const debouncedSearch = useCallback(
    _.debounce((query) => {
      setDebouncedSearchTerm(query)
    }, 500),
    [],
  )

  useEffect(() => {
    if (!data) return
    setPackage(data.packages)
    setCurrentPage(data.currentPage)
    setTotalPages(data.totalPages)
  }, [data, categoryFilter, statusFilter])

  if (isLoading) return <Spinner />;

  const handleUpdatePackageStatus = (packageId : string,status:string) => {
      updateStatus({packageId,status},{
        onSuccess :(response) => {
           toast.success(response.message);
        },
        onError : (error : any) => {
          toast.error(error?.response.data.message);
        }
      })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    debouncedSearch(e.target.value)
  }

  const navigateToAddPackage = () => {
    navigate("/vendor/packages/add")
  }

  const handleViewPackage = (id: string) => {
    navigate(`/vendor/packages/${id}`)
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return { label: "Active", className: "bg-green-100 text-green-800 border-green-200" }
      case "inactive":
        return { label: "Inactive", className: "bg-red-100 text-red-800 border-red-200" }
      case "draft":
        return { label: "Draft", className: "bg-yellow-100 text-yellow-800 border-yellow-200" }
      default:
        return { label: "Unknown", className: "bg-gray-100 text-gray-800 border-gray-200" }
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      nature: "bg-green-50 text-green-700 border-green-200",
      beach: "bg-blue-50 text-blue-700 border-blue-200",
      adventure: "bg-orange-50 text-orange-700 border-orange-200",
      heritage: "bg-purple-50 text-purple-700 border-purple-200",
      cultural: "bg-pink-50 text-pink-700 border-pink-200",
    }
    return colors[category as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  return (
    <div className="lg:ml-64 p-4 md:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-[#2CA4BC]/5 to-[#1a5f6b]/5">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold">Package Management</CardTitle>
                <p className="text-white/90 mt-1">Manage your travel packages and bookings</p>
              </div>
              <Button
                onClick={navigateToAddPackage}
                className="bg-white text-[#1a5f6b] hover:bg-white/90 shadow-lg"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Package
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-[#2CA4BC]/20 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#2CA4BC]/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-[#2CA4BC]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-xl font-bold text-[#1a5f6b]">₹4,23,000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#2CA4BC]/20 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-xl font-bold text-[#1a5f6b]">147</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#2CA4BC]/20 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Packages</p>
                  <p className="text-xl font-bold text-[#1a5f6b]">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#2CA4BC]/20 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Rating</p>
                  <p className="text-xl font-bold text-[#1a5f6b]">4.6</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-[#2CA4BC]/20 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search packages by name, title, or tags..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={statusFilter} onValueChange={(value: PackageStatus) => setStatusFilter(value)}>
                  <SelectTrigger className="w-full sm:w-[140px] focus:border-[#2CA4BC] focus:ring-[#2CA4BC]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={(value: PackageCategory) => setCategoryFilter(value)}>
                  <SelectTrigger className="w-full sm:w-[140px] focus:border-[#2CA4BC] focus:ring-[#2CA4BC]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="nature">Nature</SelectItem>
                    <SelectItem value="beach">Beach</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="heritage">Heritage</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Packages Table */}
        <Card className="border-[#2CA4BC]/20 shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#2CA4BC]/10">
                  <TableRow className="border-[#2CA4BC]/20 hover:bg-[#2CA4BC]/5">
                    <TableHead className="w-[300px] text-[#1a5f6b] font-semibold">Package</TableHead>
                    <TableHead className="text-[#1a5f6b] font-semibold">Category</TableHead>
                    <TableHead className="text-[#1a5f6b] font-semibold">Duration</TableHead>
                    <TableHead className="text-[#1a5f6b] font-semibold">Price</TableHead>
                    <TableHead className="text-[#1a5f6b] font-semibold">Status</TableHead>
                    <TableHead className="text-[#1a5f6b] font-semibold">Bookings</TableHead>
                    <TableHead className="text-[#1a5f6b] font-semibold">Rating</TableHead>
                    <TableHead className="w-[100px] text-[#1a5f6b] font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages?.map((pkg) => {
                    const statusConfig = getStatusConfig(pkg?.status)
                    return (
                      <TableRow
                        key={pkg._id}
                        className={`border-[#2CA4BC]/10 hover:bg-[#2CA4BC]/5 transition-colors ${
                          pkg.isBlocked ? "bg-red-50/50 opacity-60 hover:bg-red-100/50" : ""
                        }`}
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-16 rounded-lg">
                              <AvatarImage
                                src={pkg.images[0] || "/placeholder.svg"}
                                alt={pkg.packageName}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-[#2CA4BC]/10 text-[#1a5f6b] rounded-lg">
                                {pkg.packageName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-[#1a5f6b] truncate">{pkg.packageName}</p>
                              <p className="text-sm text-gray-600 truncate">{pkg.title}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3 text-gray-400" />
                                <p className="text-xs text-gray-500 truncate">{pkg.meetingPoint}</p>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getCategoryColor(pkg.category)}>
                            {pkg.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium text-[#1a5f6b]">
                              {pkg.duration.days}D/{pkg.duration.nights}N
                            </p>
                            <p className="text-gray-500">Max {pkg.maxGroupSize} people</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-semibold text-[#1a5f6b]">₹{pkg.price.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">per person</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant="outline" className={statusConfig.className}>
                              {statusConfig.label}
                            </Badge>
                            {pkg.isBlocked && (
                              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 text-xs">
                                🚫 Blocked
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-[#1a5f6b]">{""}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium text-[#1a5f6b]">{"N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => handleViewPackage(pkg._id)} className="cursor-pointer">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Package
                              </DropdownMenuItem>
                              {pkg.status === "draft" && (
                                <DropdownMenuItem onClick={() => handleUpdatePackageStatus(pkg._id,"active")} className="cursor-pointer text-green-600">
                                  <Send className="h-4 w-4 mr-2" />
                                  Publish Package
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="cursor-pointer text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Package
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {packages?.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-500 text-lg">No packages found</p>
                <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  )
}
