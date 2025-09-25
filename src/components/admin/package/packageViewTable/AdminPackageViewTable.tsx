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
  Trash2,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Star,
  MoreHorizontal,
  Package,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetPackagesQuery, type PackageDetails } from "@/hooks/vendor/usePackage"
import _ from "lodash"
import { getAllPackages } from "@/services/admin/admin.service"
import Pagination from "@/components/Pagination"
import { Spinner } from "@/components/Spinner"
import { useNavigate } from "react-router-dom"
import { useUpdatePackageBlockMutation } from "@/hooks/admin/usePackage"
import toast from "react-hot-toast"
import ConfirmationModal from "@/components/modals/ConfirmationModal"


type PackageStatus = "all" | "active" | "inactive" | "draft" | "ongoing"
type PackageCategory = "all" | "nature" | "beach" | "adventure" | "heritage" | "cultural"

export function AdminPackagesView() {
  const navigate = useNavigate()
  const [packages, setPackage] = useState<PackageDetails[]>();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [packageToBlock, setPackageToBlock] = useState<{id: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<PackageStatus>("all")
  const [categoryFilter, setCategoryFilter] = useState<PackageCategory>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const limit = 5;

  const {mutate : updateBlock} = useUpdatePackageBlockMutation();

  const { data, isLoading } = useGetPackagesQuery(
    getAllPackages,
    page,
    limit,
    debouncedSearchTerm,
    statusFilter,
    categoryFilter,
    "admin",
  )

  useEffect(() => {
    if (!data) return
    setPackage(data.packages)
    setCurrentPage(data.currentPage)
    setTotalPages(data.totalPages)
  }, [data, categoryFilter, statusFilter])

  const debouncedSearch = useCallback(
    _.debounce((query) => {
      setDebouncedSearchTerm(query)
    }, 500),
    [],
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    debouncedSearch(e.target.value)
  }

  const handleViewPackageDetails = (packageId: string) => {
    navigate(`/admin/ad_pvt/packages/${packageId}`)
  }

  const handleUpdateBlock = (packageId : string) => {
    setIsUpdating(packageId);
      updateBlock(packageId,{
        onSuccess : (response) => {
          toast.success(response?.message);
          setIsUpdating(null)
        },
        onError : (error : any) => {
          toast.error(error?.response?.data.message);
          setIsUpdating(null)
        }
      })
  }

  const confirmBlock = () => {
    if(packageToBlock){
      handleUpdateBlock(packageToBlock?.id);
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return { label: "Active", className: "bg-green-900/20 text-green-400 border-green-400/30" }
      case "completed":
        return { label: "Active", className: "bg-green-900/20 text-green-400 border-green-400/30" }
      case "ongoing":
        return { label: "Ongoing", className: "bg-blue-900/20 text-blue-700 border-green-400/30" }
      case "cancelled":
        return { label: "Cancelled", className: "bg-red-900/20 text-red-400 border-red-400/30" }
      case "applications_closed":
        return { label: "Applications closed", className: "bg-red-900/20 text-red-400 border-red-400/30" }
      case "draft":
        return { label: "Draft", className: "bg-yellow-900/20 text-yellow-400 border-yellow-400/30" }
      default:
        return { label: "Unknown", className: "bg-slate-700 text-slate-300 border-slate-600" }
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      nature: "bg-green-900/20 text-green-400 border-green-400/30",
      beach: "bg-blue-900/20 text-blue-400 border-blue-400/30",
      adventure: "bg-orange-900/20 text-orange-400 border-orange-400/30",
      heritage: "bg-purple-900/20 text-purple-400 border-purple-400/30",
      cultural: "bg-pink-900/20 text-pink-400 border-pink-400/30",
    }
    return colors[category as keyof typeof colors] || "bg-slate-700 text-slate-300 border-slate-600"
  }

  if (isLoading) return <Spinner />

  return (
    <div className="lg:ml-64 p-4 md:p-6 lg:p-8 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-gray-200 shadow-xl bg-white">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Package className="h-8 w-8 text-blue-600" />
                  Package Management
                </CardTitle>
                <p className="text-gray-600 mt-1">Manage and monitor all travel packages</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-gray-200 shadow-lg bg-white hover:bg-gray-50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-xl font-bold text-gray-900">₹4,23,000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-lg bg-white hover:bg-gray-50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-xl font-bold text-gray-900">147</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-lg bg-white hover:bg-gray-50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Packages</p>
                  <p className="text-xl font-bold text-gray-900">
                    {packages?.filter((p) => p.status === "active").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-lg bg-white hover:bg-gray-50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Rating</p>
                  <p className="text-xl font-bold text-gray-900">4.6</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-gray-200 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search packages by name, title, or tags..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={statusFilter} onValueChange={(value: PackageStatus) => setStatusFilter(value)}>
                  <SelectTrigger className="w-full sm:w-[140px] bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">
                      All Status
                    </SelectItem>
                    <SelectItem value="active" className="text-gray-900 hover:bg-gray-100">
                      Active
                    </SelectItem>
                    <SelectItem value="ongoing" className="text-gray-900 hover:bg-gray-100">
                      Ongoing
                    </SelectItem>
                    <SelectItem value="draft" className="text-gray-900 hover:bg-gray-100">
                      Draft
                    </SelectItem>
                    <SelectItem value="blocked" className="text-gray-900 hover:bg-gray-100">
                      Blocked
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={(value: PackageCategory) => setCategoryFilter(value)}>
                  <SelectTrigger className="w-full sm:w-[140px] bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">
                      All Categories
                    </SelectItem>
                    <SelectItem value="nature" className="text-gray-900 hover:bg-gray-100">
                      Nature
                    </SelectItem>
                    <SelectItem value="beach" className="text-gray-900 hover:bg-gray-100">
                      Beach
                    </SelectItem>
                    <SelectItem value="adventure" className="text-gray-900 hover:bg-gray-100">
                      Adventure
                    </SelectItem>
                    <SelectItem value="heritage" className="text-gray-900 hover:bg-gray-100">
                      Heritage
                    </SelectItem>
                    <SelectItem value="cultural" className="text-gray-900 hover:bg-gray-100">
                      Cultural
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Packages Table */}
        <Card className="border-gray-200 shadow-lg bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="border-gray-200 hover:bg-gray-100">
                    <TableHead className="w-[300px] text-gray-700 font-semibold">Package</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Category</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Duration</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Price</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Group Size</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Rating</TableHead>
                    <TableHead className="w-[100px] text-gray-700 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages?.map((pkg) => {
                    const statusConfig = getStatusConfig(pkg.status)
                    return (
                      <TableRow  key={pkg._id}
                        className={`border-[#2CA4BC]/10 hover:bg-[#2CA4BC]/5 transition-colors ${
                          pkg.isBlocked ? "bg-red-100/100 opacity-60 hover:bg-red-100/50" : ""
                        }`}>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-16 rounded-lg">
                              <AvatarImage
                                src={pkg.images[0] || "/placeholder.svg"}
                                alt={pkg.packageName}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-gray-200 text-gray-700 rounded-lg">
                                {pkg.packageName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-900 truncate">{pkg.packageName}</p>
                              <p className="text-sm text-gray-600 truncate">{pkg.title}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3 text-gray-500" />
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
                            <p className="font-medium text-gray-900">
                              {pkg.duration.days}D/{pkg.duration.nights}N
                            </p>
                            <p className="text-gray-600">Max {pkg.maxGroupSize} people</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-semibold text-gray-900">₹{pkg.price.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">per person</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusConfig.className}>
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-gray-900">{pkg.maxGroupSize}</p>
                          <p className="text-xs text-gray-600">max capacity</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium text-gray-900">4.5</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white border-gray-200">
                              <DropdownMenuItem
                                onClick={() => handleViewPackageDetails(pkg.packageId!)}
                                className="cursor-pointer text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                  setPackageToBlock({id : pkg?._id})
                                  setIsConfirmationModalOpen(true);
                                }} className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="h-4 w-4 mr-2" />
                                {pkg.isBlocked ? "Unblock package" : "Block Package"}
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
                <p className="text-gray-600 text-lg">No packages found</p>
                <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
       <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={() => {
            confirmBlock()
            setPackageToBlock(null)
          }}
          title="Confirm Action"
          message="Are you sure you want to change this packages's status? This action will affect their access to the platform."
          confirmText="Yes, Continue"
          cancelText="Cancel"
          type="danger"
          isLoading={isUpdating !== null}
        />
    </div>
  )
}
