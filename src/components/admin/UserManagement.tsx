"use client"

import React, { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Users, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import _ from "lodash";
import { useAllUsersQuery } from "@/hooks/admin/useAllUsers"
import { getAllUsers } from "@/services/admin/admin.service"
import { Button } from "../ui/button"
import { Spinner } from "../Spinner"
import Pagination from "../Pagination"
import { useUpdateUserStatusMutation } from "@/hooks/admin/useUpdateUserStatus"
import toast from "react-hot-toast"
import ConfirmationModal from "../modals/ConfirmationModal"

interface User {
  _id: string
  firstName : string;
  lastName : string;
  email: string
  phone: string
  profileImage: string
  isBlocked: boolean
  createdAt: string
}

export type UserList = User[];

export default function UserManagement() {
 
  const[isConfirmationModalOpen,setIsConfirmationModalOpen] = useState(false);
  const[userToBlock,setUserToBlock] = useState<{type : string;id:string} | null>(null);
 
  const [users, setUsers] = useState<User[]>()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [debouncedSearchTerm,setDebouncedSearchTerm] = useState("")
  const [searchTerm, setSearchTerm] = useState("");
  const [page,setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeFilter,setActiveFilter] = useState("all")
  const limit = 5;
  const {mutate : updateStatus} = useUpdateUserStatusMutation();
  
  const debouncedSearch = useCallback(
    _.debounce((query) =>{
        setDebouncedSearchTerm(query)
    },500),
    []
  )

  const {data,isLoading} = useAllUsersQuery<UserList>(
    getAllUsers,
    page,
    limit,
    "client",
    debouncedSearchTerm,
    activeFilter
  );

  useEffect(()=>{
    if(!data) return;
    setUsers(data.users);
    setTotalPages(data.totalPages);
  },[data,activeFilter]);

  if(isLoading) return <Spinner/>

  const handleSearch = (e : React.ChangeEvent<HTMLInputElement>) =>{
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  }

  const handleBlockUser = (userType : string, userId : any) =>{
    setIsUpdating(userId);
    updateStatus({userType,userId},{
       onSuccess : (response) =>{
         toast.success(`${response.message}`);
         setIsUpdating(null)
       },
       onError :(error : any) =>{
         toast.error(error);
         setIsUpdating(null)
       }
    })
  }
  
  const confirmBlock = () =>{
    if(userToBlock){
      handleBlockUser(userToBlock?.type,userToBlock?.id)
    }
  }
  

  const getStatusBadge = (isBlocked: boolean) => {
    return (
      <Badge
        variant="outline"
        className={cn(
          "font-medium",
          isBlocked ? "bg-red-100 text-red-800 border-red-200" : "bg-green-100 text-green-800 border-green-200",
        )}
      >
        {isBlocked ? "Blocked" : "Active"}
      </Badge>
    )
  }

  return (
    <div className="ml-0 lg:ml-64 min-h-screen bg-gray-50 transition-all duration-300">
      <div className="p-4 lg:p-6 pt-16 lg:pt-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage and monitor all registered users</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{users?.length} users</span>
          </div>
        </div>

        {/* Users Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b bg-gray-50/50 px-6 py-4">
            <CardTitle className="text-lg font-semibold">Users</CardTitle>
                <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </CardHeader>
           <div className="flex flex-wrap gap-2 mb-6 ml-4">
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("all")}
              >
                All 
              </Button>
              <Button
                variant={activeFilter === "blocked" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("blocked")}
              >
                Blocked
              </Button>
              <Button
                variant={activeFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("active")}
              >
                Active
              </Button>
            </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b bg-gray-50/30">
                    <TableHead className="w-16 font-semibold">Sl.No</TableHead>
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold hidden sm:table-cell">Email</TableHead>
                    <TableHead className="font-semibold hidden md:table-cell">Phone</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No users found matching your search
                      </TableCell>
                    </TableRow>
                  ) : (
                    users?.map((user, index) => (
                      <TableRow key={user._id} className="hover:bg-gray-50/50">
                        <TableCell className="font-medium">{(page - 1) * limit + index + 1}</TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.firstName} />
                              <AvatarFallback className="bg-blue-100 text-blue-700">
                                {user.firstName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{`${user.firstName} ${user.lastName}`}</p>
                              <p className="text-sm text-gray-600 sm:hidden">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <p className="text-sm font-medium text-gray-900">{user.email}</p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <p className="text-sm text-gray-700">{user.phone}</p>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.isBlocked)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <Switch
                              checked={!user.isBlocked}
                              onCheckedChange={() =>{
                                setUserToBlock(() => ({type : "client",id : user._id}));
                                setIsConfirmationModalOpen(true)
                              }}
                              disabled={isUpdating === user._id}
                              className="data-[state=checked]:bg-green-600"
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
        <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        />
        <ConfirmationModal
         isOpen={isConfirmationModalOpen}
         onClose={() => setIsConfirmationModalOpen(false)}
         onConfirm={() => {
          confirmBlock();
          setUserToBlock(null)
         }}
         title="Action"
         message="Are you sure you want to perform this action?"
         confirmText="Yes, I'm sure"
         cancelText="No, cancel"
         type="danger"
         isLoading={isUpdating !==null}
        />
      </div>
    </div>
  )
}
