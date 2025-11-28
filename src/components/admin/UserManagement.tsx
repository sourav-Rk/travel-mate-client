"use client";

import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Users, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import _ from "lodash";
import { useAllUsersQuery } from "@/hooks/admin/useAllUsers";
import { getAllUsers } from "@/services/admin/admin.service";
import { Button } from "../ui/button";
import { Spinner } from "../Spinner";
import Pagination from "../Pagination";
import { useUpdateUserStatusMutation } from "@/hooks/admin/useUpdateUserStatus";
import toast from "react-hot-toast";
import ConfirmationModal from "../modals/ConfirmationModal";
import { ApiError } from "@/types/api/api";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string;
  isBlocked: boolean;
  createdAt: string;
}

export type UserList = User[];

export default function UserManagement() {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState<{
    type: string;
    id: string;
  } | null>(null);
  const [users, setUsers] = useState<User[]>();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const limit = 5;

  const { mutate: updateStatus } = useUpdateUserStatusMutation();

  const debouncedSearch = useCallback(
    _.debounce((query) => {
      setDebouncedSearchTerm(query);
    }, 500),
    []
  );

  const { data, isLoading } = useAllUsersQuery<UserList>(
    getAllUsers,
    page,
    limit,
    "client",
    debouncedSearchTerm,
    activeFilter
  );

  useEffect(() => {
    if (!data) return;
    setUsers(data.users);
    setTotalPages(data.totalPages);
  }, [data, activeFilter]);

  if (isLoading) return <Spinner />;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleBlockUser = (userType: string, userId: string) => {
    setIsUpdating(userId);
    updateStatus(
      { userType, userId },
      {
        onSuccess: (response) => {
          toast.success(`${response.message}`);
          setIsUpdating(null);
        },
        onError: (error: ApiError) => {
          toast.error(error?.response?.data.message || "Failed to block");
          setIsUpdating(null);
        },
      }
    );
  };

  const confirmBlock = () => {
    if (userToBlock) {
      handleBlockUser(userToBlock?.type, userToBlock?.id);
    }
  };

  const getStatusBadge = (isBlocked: boolean) => {
    return (
      <Badge
        variant="outline"
        className={cn(
          "font-medium border-0 text-xs px-2 py-1",
          isBlocked
            ? "bg-red-100 text-red-700 hover:bg-red-200"
            : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
        )}
      >
        {isBlocked ? "Blocked" : "Active"}
      </Badge>
    );
  };

  return (
    <div className="ml-0 lg:ml-64 min-h-screen bg-slate-50 transition-all duration-300">
      <div className="p-4 lg:p-8 pt-16 lg:pt-8 space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                User Management
              </h1>
              <p className="text-slate-600 text-lg">
                Manage and monitor all registered users
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Users Table */}
        <Card className="border-0 shadow-lg bg-white rounded-xl overflow-hidden">
          <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-slate-900 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">
                    Users Directory
                  </CardTitle>
                  <p className="text-sm text-slate-600 mt-1">
                    Comprehensive user management system
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 lg:items-center">
                {/* Enhanced Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search users by name, email, or phone..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-11 pr-4 py-2 w-full sm:w-80 border-slate-300 focus:border-slate-900 focus:ring-slate-900 rounded-lg"
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
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                )}
              >
                All Users
              </Button>
              <Button
                variant={activeFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("active")}
                className={cn(
                  "rounded-lg font-medium transition-all",
                  activeFilter === "active"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                )}
              >
                Active
              </Button>
              <Button
                variant={activeFilter === "blocked" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("blocked")}
                className={cn(
                  "rounded-lg font-medium transition-all",
                  activeFilter === "blocked"
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-md"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                )}
              >
                Blocked
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-200 bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="w-16 font-bold text-slate-700 py-4 text-center">
                      Sl.No
                    </TableHead>
                    <TableHead className="font-bold text-slate-700 text-center">
                      User Details
                    </TableHead>
                    <TableHead className="font-bold text-slate-700 text-center hidden sm:table-cell">
                      Contact
                    </TableHead>
                    <TableHead className="font-bold text-slate-700 text-center hidden md:table-cell">
                      Phone
                    </TableHead>
                    <TableHead className="font-bold text-slate-700 text-center">
                      Status
                    </TableHead>
                    <TableHead className="font-bold text-slate-700 text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                            <Users className="h-8 w-8 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-lg font-medium text-slate-900">
                              No users found
                            </p>
                            <p className="text-slate-600">
                              Try adjusting your search or filter criteria
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users?.map((user, index) => (
                      <TableRow
                        key={user._id}
                        className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-b-0"
                      >
                        <TableCell className="font-semibold text-slate-700 py-6 text-center">
                          {(page - 1) * limit + index + 1}
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 ring-2 ring-slate-100">
                              <AvatarImage
                                src={user.profileImage || "/placeholder.svg"}
                                alt={user.firstName}
                              />
                              <AvatarFallback className="bg-slate-900 text-white font-semibold">
                                {user.firstName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-slate-900 text-base truncate">
                                {`${user.firstName} ${user.lastName}`}
                              </p>
                              <p className="text-sm text-slate-600 sm:hidden mt-1 truncate">
                                {user.email}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                Joined{" "}
                                {new Date(user.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell py-6">
                          <p className="font-medium text-slate-900 truncate">
                            {user.email}
                          </p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell py-6">
                          <p className="text-slate-700 font-medium">
                            {user.phone || "N/A"}
                          </p>
                        </TableCell>
                        <TableCell className="py-6 text-center">
                          <div className="flex justify-center">
                            {getStatusBadge(user.isBlocked)}
                          </div>
                        </TableCell>
                        <TableCell className="py-6 text-center">
                          <div className="flex items-center justify-center">
                            <Switch
                              checked={!user.isBlocked}
                              onCheckedChange={() => {
                                setUserToBlock(() => ({
                                  type: "client",
                                  id: user._id,
                                }));
                                setIsConfirmationModalOpen(true);
                              }}
                              disabled={isUpdating === user._id}
                              className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-slate-300"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Pagination */}
        <div className="flex justify-center">
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
          title="Confirm Action"
          message="Are you sure you want to change this user's status? This action will affect their access to the platform."
          confirmText="Yes, Continue"
          cancelText="Cancel"
          type="danger"
          isLoading={isUpdating !== null}
        />
      </div>
    </div>
  );
}
