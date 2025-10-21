"use client"

import type React from "react"

import { useCallback, useEffect, useState } from "react"
import _ from "lodash"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Search, Filter } from "lucide-react"
import { useAllUsersQuery } from "@/hooks/admin/useAllUsers"
import { getAllUsers } from "@/services/admin/admin.service"
import Pagination from "@/components/Pagination"
import { Spinner } from "@/components/Spinner"
import { useNavigate } from "react-router-dom"
import { useUpdateUserStatusMutation } from "@/hooks/admin/useUpdateUserStatus"
import toast from "react-hot-toast"
import ConfirmationModal from "@/components/modals/ConfirmationModal"
import { VendorTable } from "./VendorTable"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type VendorStatus = "pending" | "verified" | "rejected" | "reviewing"

export interface Vendor {
  _id: string
  agencyName: string
  firstName: string
  lastName: string
  email: string
  phone: string
  profileImage: string
  status: VendorStatus
  isBlocked?: boolean
}

export type VendorList = Vendor[]

export default function VendorManagement() {
  const navigate = useNavigate()
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [userToBlock, setUserToBlock] = useState<{ type: string; id: string } | null>(null)
  const [activeFilter, setActiveFilter] = useState<VendorStatus | "all">("all")
  const [vendors, setVendors] = useState<VendorList>()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const limit = 5

  const { mutate: updateStatus } = useUpdateUserStatusMutation()

  const debouncedSearch = useCallback(
    _.debounce((query) => {
      setDebouncedSearchTerm(query)
    }, 500),
    [],
  )

  const { data, isLoading } = useAllUsersQuery<VendorList>(
    getAllUsers,
    page,
    limit,
    "vendor",
    debouncedSearchTerm,
    activeFilter,
  )

  useEffect(() => {
    if (!data) return
    setVendors(data?.users as VendorList)
    setTotalPages(data.totalPages)
  }, [data])

  const handleBlock = (userType: string, userId: string) => {
    setIsUpdating(userId)
    updateStatus(
      { userType, userId },
      {
        onSuccess: (response) => {
          toast.success(`${response.message}`)
          setIsUpdating(null)
        },
        onError: (error: any) => {
          toast.error(error?.response?.data.message || "failed to block")
          setIsUpdating(null)
        },
      },
    )
  }

  const confirmBlock = () => {
    if (userToBlock) {
      toggleVendorStatus(userToBlock?.id)
      handleBlock(userToBlock?.type, userToBlock?.id)
    }
  }

  const toggleVendorStatus = (vendorId: string) => {
    setVendors((prevVendors) =>
      prevVendors?.map((vendor) => (vendor._id === vendorId ? { ...vendor, isBlocked: !vendor.isBlocked } : vendor)),
    )
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    debouncedSearch(e.target.value)
  }


  const handleView = (userId: string) => {
    navigate(`/admin/ad_pvt/vendor/${userId}`)
  }

  if (isLoading) return <Spinner size="xl" />


  return (
    <div className="ml-0 lg:ml-64 min-h-screen bg-slate-50 transition-all duration-300">
      <div className="p-4 lg:p-8 pt-16 lg:pt-8 space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Vendor Management</h1>
              <p className="text-slate-600 text-lg">Manage and monitor all vendor accounts</p>
            </div>           
          </div>
        </div>

        {/* Enhanced Vendors Table */}
        <Card className="border-0 shadow-lg bg-white rounded-xl overflow-hidden">
          <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-slate-900 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">Vendor Directory</CardTitle>
                  <p className="text-sm text-slate-600 mt-1">Comprehensive vendor management system</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 lg:items-center">
                {/* Enhanced Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search vendors by name, email, or agency..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-11 pr-4 py-2 w-full sm:w-80 border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 rounded-lg outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Filter Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Filter className="h-4 w-4" />
                <span>Filter by:</span>
              </div>
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("all")}
                className={cn(
                  "rounded-lg font-medium transition-all",
                  activeFilter === "all"
                    ? "bg-slate-900 hover:bg-slate-800 text-white shadow-md"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50",
                )}
              >
                All Vendors 
              </Button>
              <Button
                variant={activeFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("pending")}
                className={cn(
                  "rounded-lg font-medium transition-all",
                  activeFilter === "pending"
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white shadow-md"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50",
                )}
              >
                Pending 
              </Button>
              <Button
                variant={activeFilter === "verified" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("verified")}
                className={cn(
                  "rounded-lg font-medium transition-all",
                  activeFilter === "verified"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50",
                )}
              >
                Verified 
              </Button>
              <Button
                variant={activeFilter === "rejected" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("rejected")}
                className={cn(
                  "rounded-lg font-medium transition-all",
                  activeFilter === "rejected"
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-md"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50",
                )}
              >
                Rejected
              </Button>
              <Button
                variant={activeFilter === "reviewing" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("reviewing")}
                className={cn(
                  "rounded-lg font-medium transition-all",
                  activeFilter === "reviewing"
                    ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50",
                )}
              >
                Reviewing 
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="bg-white rounded-xl overflow-hidden">
              <VendorTable
                vendors={vendors}
                page={page}
                limit={limit}
                isUpdating={isUpdating}
                setUserToBlock={setUserToBlock}
                setIsConfirmationModalOpen={setIsConfirmationModalOpen}
                handleView={handleView}
              />
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Pagination */}
        <div className="flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>

        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={() => {
            confirmBlock()
            setUserToBlock(null)
          }}
          title="Confirm Action"
          message="Are you sure you want to change this vendor's status? This action will affect their access to the platform."
          confirmText="Yes, Continue"
          cancelText="Cancel"
          type="danger"
          isLoading={isUpdating !== null}
        />
      </div>
    </div>
  )
}
