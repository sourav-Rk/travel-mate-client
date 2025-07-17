
"use client";

import { useCallback, useEffect, useState } from "react";
import _ from "lodash";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useAllUsersQuery } from "@/hooks/admin/useAllUsers";
import { getAllUsers } from "@/services/admin/admin.service";
import Pagination from "@/components/Pagination";
import { Spinner } from "@/components/Spinner";
import { useNavigate } from "react-router-dom";
import { useUpdateUserStatusMutation } from "@/hooks/admin/useUpdateUserStatus";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { FilterButtons } from "./FilterButton";
import { SearchInput } from "./SearchInput";
import { VendorTable } from "./VendorTable";

type VendorStatus = "pending" | "verified" | "rejected" | "reviewing";

export interface Vendor {
  _id: string;
  agencyName: string;
  firstName: string;
  lastName : string;
  email: string;
  phone: string;
  profileImage: string;
  status: VendorStatus;
  isBlocked?: boolean;
}

export type VendorList = Vendor[];


export default function VendorManagement() {
  const navigate = useNavigate();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState<{type: string; id: string} | null>(null);
  const [activeFilter, setActiveFilter] = useState<VendorStatus | "all">("all");
  const [vendors, setVendors] = useState<VendorList>();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 5;

  const { mutate: updateStatus } = useUpdateUserStatusMutation();

  const debouncedSearch = useCallback(
    _.debounce((query) => {
      setDebouncedSearchTerm(query);
    }, 500),
    []
  );

  const { data, isLoading } = useAllUsersQuery<VendorList>(
    getAllUsers,
    page,
    limit,
    "vendor",
    debouncedSearchTerm,
    activeFilter
  );

  useEffect(() => {
    if (!data) return;
    setVendors(data?.users as VendorList);
    setTotalPages(data.totalPages);
  }, [data]);

  const handleBlock = (userType: string, userId: string) => {
    setIsUpdating(userId);
    updateStatus({ userType, userId }, {
      onSuccess: (response) => {
        toast.success(`${response.message}`);
        setIsUpdating(null);
      },
      onError: (error: any) => {
        toast.error(error);
        setIsUpdating(null);
      }
    });
  };

  const confirmBlock = () => {
    if (userToBlock) {
      toggleVendorStatus(userToBlock?.id);
      handleBlock(userToBlock?.type, userToBlock?.id);
    }
  };

  const toggleVendorStatus = (vendorId: string) => {
    setVendors(prevVendors =>
      prevVendors?.map(vendor =>
        vendor._id === vendorId
          ? { ...vendor, isBlocked: !vendor.isBlocked }
          : vendor
      )
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const getStatusCount = (status: VendorStatus | "all") => {
    if (status === "all") return vendors?.length;
    return vendors?.filter((vendor) => vendor.status === status).length;
  };

  const handleView = (userId: string) => {
    navigate(`/admin/ad_pvt/vendor/${userId}`);
  };

  if (isLoading) return <Spinner size="xl" />;

  return (
    <div className="lg:ml-64 min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="p-4 lg:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Management</h1>
          <p className="text-gray-600">Manage and monitor all vendor accounts</p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-950 to-blue-950 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              Vendor Directory
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <FilterButtons
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                getStatusCount={getStatusCount}
              />
              <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
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

            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>

            <ConfirmationModal
              isOpen={isConfirmationModalOpen}
              onClose={() => setIsConfirmationModalOpen(false)}
              onConfirm={() => {
                confirmBlock();
                setUserToBlock(null);
              }}
              title="Action"
              message="Are you sure you want to perform this action?"
              confirmText="Yes, I'm sure"
              cancelText="No, cancel"
              type="danger"
              isLoading={isUpdating !== null}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}