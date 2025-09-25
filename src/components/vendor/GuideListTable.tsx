"use client"

import type * as React from "react"
import { useState, useCallback, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, CheckCircle, Clock, Plus } from "lucide-react" // Added Plus icon
import { cn } from "@/lib/utils"
import _ from "lodash"
import { useAllGuidesQuery } from "@/hooks/vendor/useGuide"
import { getAllGuides } from "@/services/vendor/vendorService"
import Pagination from "../Pagination"
import { Spinner } from "../Spinner"
import { useNavigate } from "react-router-dom"

type GuideStatus = "all" | "verified" | "pending"

export function GuideListTable() {
  const [guides, setGuides] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<GuideStatus>("all")
  const [currentPage,setCurrentPage] = useState(1)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const limit = 5;

  const debouncedSearch = useCallback(
    _.debounce((query) => {
      setDebouncedSearchTerm(query)
    }, 500),
    [],
  )

  const { data, isLoading } = useAllGuidesQuery(getAllGuides, page, limit, debouncedSearchTerm, filterStatus)

  useEffect(() => {
    if (!data) return
    setGuides(data.users)
    setTotalPages(data.totalPages)
    setCurrentPage(data.currentPage)
  }, [data, filterStatus,page])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    debouncedSearch(e.target.value)
  }

  const handleAddGuide = () => {
     navigate("/vendor/guide/add");
  }

  const viewGuideDetails = (id : any) => {
     navigate(`/vendor/guide/${id}`);
  }

  if (isLoading) return <Spinner />

  return (
    <div className="p-4 md:p-6 lg:p-8 lg:ml-64">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl border border-[#2CA4BC]/10">
        <div className="p-6 border-b border-[#2CA4BC]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1a5f6b]">Guide Management</h1>
            <p className="text-gray-600 text-sm">View and manage your agency's guides.</p>
          </div>
          {/* Add Guide Button */}
          <Button
            onClick={handleAddGuide}
            className="bg-[#2CA4BC] text-white hover:bg-[#1a5f6b] transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Guide
          </Button>
        </div>
        <div className="p-6 flex flex-col sm:flex-row items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search guides by name or email..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2CA4BC] focus:border-transparent w-full"
            />
          </div>
          {/* Filter Buttons */}
          <div className="flex gap-2 w-full sm:w-auto justify-center">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              className={cn(
                "px-4 py-2 rounded-lg transition-colors",
                filterStatus === "all"
                  ? "bg-[#2CA4BC] text-white hover:bg-[#2CA4BC]/90"
                  : "border-[#2CA4BC]/30 text-[#1a5f6b] hover:bg-[#2CA4BC]/10 hover:text-[#2CA4BC]",
              )}
            >
              All
            </Button>
            <Button
              variant={filterStatus === "verified" ? "default" : "outline"}
              onClick={() => setFilterStatus("verified")}
              className={cn(
                "px-4 py-2 rounded-lg transition-colors",
                filterStatus === "verified"
                  ? "bg-[#2CA4BC] text-white hover:bg-[#2CA4BC]/90"
                  : "border-[#2CA4BC]/30 text-[#1a5f6b] hover:bg-[#2CA4BC]/10 hover:text-[#2CA4BC]",
              )}
            >
              <CheckCircle className="h-4 w-4 mr-2" /> Verified
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              onClick={() => setFilterStatus("pending")}
              className={cn(
                "px-4 py-2 rounded-lg transition-colors",
                filterStatus === "pending"
                  ? "bg-[#2CA4BC] text-white hover:bg-[#2CA4BC]/90"
                  : "border-[#2CA4BC]/30 text-[#1a5f6b] hover:bg-[#2CA4BC]/10 hover:text-[#2CA4BC]",
              )}
            >
              <Clock className="h-4 w-4 mr-2" /> Pending
            </Button>
          </div>
        </div>
        {/* Guides Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#2CA4BC]/10">
              <TableRow className="border-[#2CA4BC]/20">
                <TableHead className="w-[60px] text-[#1a5f6b]">Image</TableHead>
                <TableHead className="min-w-[150px] text-[#1a5f6b]">Name</TableHead>
                <TableHead className="min-w-[180px] text-[#1a5f6b]">Email</TableHead>
                <TableHead className="min-w-[120px] text-[#1a5f6b]">Phone</TableHead>
                <TableHead className="min-w-[100px] text-[#1a5f6b]">Status</TableHead>
                <TableHead className="min-w-[80px] text-[#1a5f6b]">Gender</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guides.length > 0 ? (
                guides.map((guide: any) => (
                  <TableRow onClick={() =>viewGuideDetails(guide._id)} key={guide._id} className="cursor-pointer border-[#2CA4BC]/5 hover:bg-[#2CA4BC]/5">
                    <TableCell>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={guide.profileImage || "/placeholder.svg"} alt={guide.firstName} />
                        <AvatarFallback className="bg-[#2CA4BC] text-white">
                          {guide.firstName[0]}
                          {guide.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium text-[#1a5f6b]">
                      {guide.firstName} {guide.lastName}
                    </TableCell>
                    <TableCell className="text-gray-700">{guide.email}</TableCell>
                    <TableCell className="text-gray-700">{guide.phone}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-semibold",
                          guide.status === "verified"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-yellow-100 text-yellow-700 border border-yellow-200",
                        )}
                      >
                        {guide.status === "verified" ? "Verified" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700">{guide.gender}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                    No guides found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* Enhanced Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  )
}
