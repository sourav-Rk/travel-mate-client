"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Store,
  TrendingUp,
  DollarSign,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

const statsCards = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Active Vendors",
    value: "156",
    change: "+8.2%",
    trend: "up",
    icon: Store,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Revenue",
    value: "$45,231",
    change: "-2.4%",
    trend: "down",
    icon: DollarSign,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Growth Rate",
    value: "23.1%",
    change: "+5.7%",
    trend: "up",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
]

const recentVendors = [
  {
    id: "1",
    name: "TechSolutions Inc",
    email: "contact@techsolutions.com",
    status: "pending",
    joinedDate: "2024-01-20",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Creative Designs",
    email: "hello@creativedesigns.com",
    status: "verified",
    joinedDate: "2024-01-19",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Digital Marketing Pro",
    email: "info@digitalmarketing.com",
    status: "reviewing",
    joinedDate: "2024-01-18",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Web Development Co",
    email: "team@webdev.com",
    status: "rejected",
    joinedDate: "2024-01-17",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
  verified: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  reviewing: { color: "bg-blue-100 text-blue-800", icon: Eye },
  rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
}

export default function AdminDashboard() {
  return (
    <div className="ml-0 lg:ml-64 min-h-screen bg-gray-50 transition-all duration-300">
      <div className="p-4 lg:p-6 pt-16 lg:pt-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
          </div>
          <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                        <span
                          className={`text-sm font-medium ml-1 ${
                            stat.trend === "up" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Vendors */}
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader className="border-b bg-gray-50/50">
              <CardTitle className="text-lg font-semibold">Recent Vendor Applications</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentVendors.map((vendor) => {
                  const StatusIcon = statusConfig[vendor.status as keyof typeof statusConfig].icon
                  return (
                    <div key={vendor.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={vendor.avatar || "/placeholder.svg"} alt={vendor.name} />
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {vendor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{vendor.name}</p>
                            <p className="text-sm text-gray-600">{vendor.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className={statusConfig[vendor.status as keyof typeof statusConfig].color}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                          </Badge>
                          <span className="text-sm text-gray-500">{vendor.joinedDate}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Platform Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Server Uptime</span>
                    <span className="font-medium">99.9%</span>
                  </div>
                  <Progress value={99.9} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">User Satisfaction</span>
                    <span className="font-medium">94.2%</span>
                  </div>
                  <Progress value={94.2} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Vendor Approval Rate</span>
                    <span className="font-medium">87.5%</span>
                  </div>
                  <Progress value={87.5} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900">5 Pending Approvals</p>
                  <p className="text-xs text-blue-700">Vendors waiting for review</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm font-medium text-yellow-900">12 Support Tickets</p>
                  <p className="text-xs text-yellow-700">Require immediate attention</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900">System Healthy</p>
                  <p className="text-xs text-green-700">All services running normally</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
