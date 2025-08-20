"use client"

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


type PackageStatus = "all" | "active" | "inactive" | "draft"
type PackageCategory = "all" | "nature" | "beach" | "adventure" | "heritage" | "cultural"

export function AdminPackagesView() {
  const navigate = useNavigate();
  const [packages,setPackage] = useState<PackageDetails[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<PackageStatus>("all")
  const [categoryFilter, setCategoryFilter] = useState<PackageCategory>("all")
  const [currentPage, setCurrentPage] = useState(1);
  const [page,setPage] = useState(1);
  const [totalPages,setTotalPages] = useState(0);
  const limit =5;

   const {data,isLoading} = useGetPackagesQuery(getAllPackages,page,limit,debouncedSearchTerm,statusFilter,categoryFilter,"admin");

    useEffect(() =>{
       if(!data) return;
       setPackage(data.packages);
       setCurrentPage(data.currentPage);
       setTotalPages(data.totalPages);
     },[data,categoryFilter,statusFilter]);

   const debouncedSearch = useCallback(
      _.debounce((query) => {
          setDebouncedSearchTerm(query)
      },500),
      []
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
      debouncedSearch(e.target.value)
    }

    const handleViewPackageDetails = (packageId : string) => {
       navigate(`/admin/ad_pvt/packages/${packageId}`)
    }

  

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return { label: "Active", className: "bg-green-900/20 text-green-400 border-green-400/30" }
      case "inactive":
        return { label: "Inactive", className: "bg-red-900/20 text-red-400 border-red-400/30" }
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

  if(isLoading) return <Spinner/>

  return (
    <div className="lg:ml-64 p-4 md:p-6 lg:p-8 min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-slate-800 shadow-xl bg-slate-900">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                  <Package className="h-8 w-8 text-purple-400" />
                  Package Management
                </CardTitle>
                <p className="text-slate-400 mt-1">Manage and monitor all travel packages</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-800 shadow-lg bg-slate-900 hover:bg-slate-800/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <DollarSign className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Revenue</p>
                  <p className="text-xl font-bold text-white">₹4,23,000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 shadow-lg bg-slate-900 hover:bg-slate-800/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <Users className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Bookings</p>
                  <p className="text-xl font-bold text-white">147</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 shadow-lg bg-slate-900 hover:bg-slate-800/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Active Packages</p>
                  <p className="text-xl font-bold text-white">{packages?.filter((p) => p.status === "active").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 shadow-lg bg-slate-900 hover:bg-slate-800/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-600/20 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Avg. Rating</p>
                  <p className="text-xl font-bold text-white">4.6</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-slate-800 shadow-lg bg-slate-900">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search packages by name, title, or tags..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={statusFilter} onValueChange={(value: PackageStatus) => setStatusFilter(value)}>
                  <SelectTrigger className="w-full sm:w-[140px] bg-slate-800 border-slate-700 text-white focus:border-purple-400 focus:ring-purple-400">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all" className="text-white hover:bg-slate-700">
                      All Status
                    </SelectItem>
                    <SelectItem value="active" className="text-white hover:bg-slate-700">
                      Active
                    </SelectItem>
                    <SelectItem value="inactive" className="text-white hover:bg-slate-700">
                      Inactive
                    </SelectItem>
                    <SelectItem value="draft" className="text-white hover:bg-slate-700">
                      Draft
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={(value: PackageCategory) => setCategoryFilter(value)}>
                  <SelectTrigger className="w-full sm:w-[140px] bg-slate-800 border-slate-700 text-white focus:border-purple-400 focus:ring-purple-400">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all" className="text-white hover:bg-slate-700">
                      All Categories
                    </SelectItem>
                    <SelectItem value="nature" className="text-white hover:bg-slate-700">
                      Nature
                    </SelectItem>
                    <SelectItem value="beach" className="text-white hover:bg-slate-700">
                      Beach
                    </SelectItem>
                    <SelectItem value="adventure" className="text-white hover:bg-slate-700">
                      Adventure
                    </SelectItem>
                    <SelectItem value="heritage" className="text-white hover:bg-slate-700">
                      Heritage
                    </SelectItem>
                    <SelectItem value="cultural" className="text-white hover:bg-slate-700">
                      Cultural
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Packages Table */}
        <Card className="border-slate-800 shadow-lg bg-slate-900">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-800/50">
                  <TableRow className="border-slate-700 hover:bg-slate-800/30">
                    <TableHead className="w-[300px] text-slate-300 font-semibold">Package</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Category</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Duration</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Price</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Status</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Group Size</TableHead>
                    <TableHead className="text-slate-300 font-semibold">Rating</TableHead>
                    <TableHead className="w-[100px] text-slate-300 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages?.map((pkg) => {
                    const statusConfig = getStatusConfig(pkg.status)
                    return (
                      <TableRow key={pkg._id} className="border-slate-700 hover:bg-slate-800/30 transition-colors">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-16 rounded-lg">
                              <AvatarImage
                                src={pkg.images[0] || "/placeholder.svg"}
                                alt={pkg.packageName}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-slate-700 text-slate-300 rounded-lg">
                                {pkg.packageName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-white truncate">{pkg.packageName}</p>
                              <p className="text-sm text-slate-400 truncate">{pkg.title}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3 text-slate-500" />
                                <p className="text-xs text-slate-500 truncate">{pkg.meetingPoint}</p>
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
                            <p className="font-medium text-white">
                              {pkg.duration.days}D/{pkg.duration.nights}N
                            </p>
                            <p className="text-slate-400">Max {pkg.maxGroupSize} people</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-semibold text-white">₹{pkg.price.toLocaleString()}</p>
                          <p className="text-xs text-slate-400">per person</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusConfig.className}>
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-white">{pkg.maxGroupSize}</p>
                          <p className="text-xs text-slate-400">max capacity</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="font-medium text-white">4.5</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-slate-800 border-slate-700">
                              <DropdownMenuItem onClick={() => handleViewPackageDetails(pkg._id)} className="cursor-pointer text-slate-300 hover:text-white hover:bg-slate-700">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-slate-300 hover:text-white hover:bg-slate-700">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Package
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-900/20">
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
                <div className="text-slate-600 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-slate-400 text-lg">No packages found</p>
                <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
         />
    </div>
  )
}
