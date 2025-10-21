"use client"

import type React from "react"
import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  Store,
  MapPin,
  FileText,
  Wallet,
  Award,
  BarChart3,
  LogOut,
  Menu,
  X,
  MoreHorizontal,
} from "lucide-react"
import { useLogout } from "@/hooks/auth/useLogout"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logoutUser } from "@/store/slices/userSlice"

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  path: string
  color: string
}

const AdminSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [activeItem, setActiveItem] = useState<string>("dashboard")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { mutate: logoutAdminMutate } = useLogout()

  const handleLogout = () => {
    logoutAdminMutate(undefined, {
      onSuccess: (response) => {
        toast.success(`${response.message}`)
        dispatch(logoutUser())
        navigate("/admin")
      },
      onError: (error: any) => {
        toast.error(error)
      },
    })
  }

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin/ad_pvt", color: "text-purple-400" },
    { id: "users", label: "User Management", icon: Users, path: "/admin/ad_pvt/users", color: "text-blue-400" },
    { id: "vendors", label: "Vendor Management", icon: Store, path: "/admin/ad_pvt/vendors", color: "text-orange-400" },
    { id: "trips", label: "Trips", icon: MapPin, path: "/admin/ad_pvt/packages", color: "text-red-400" },
    { id: "reports", label: "Reports", icon: FileText, path: "/reports", color: "text-pink-400" },
    { id: "wallet", label: "Wallet", icon: Wallet, path: "/admin/ad_pvt/wallet", color: "text-green-400" },
    { id: "badges", label: "Badges", icon: Award, path: "/badges", color: "text-yellow-400" },
    { id: "analytics", label: "Analytics", icon: BarChart3, path: "/analytics", color: "text-cyan-400" },
  ]

  const handleItemClick = (itemId: string, path: string): void => {
    setActiveItem(itemId)
    navigate(path)
    setIsOpen(false) // Close mobile menu on item click
  }

  const toggleSidebar = (): void => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-slate-800 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div className="lg:hidden fixed  bg-opacity-50 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 shadow-lg transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Header - User Profile Section */}
        <div className="border-b border-slate-800 p-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center">
              <span className="text-white font-medium text-sm">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-slate-400">System Administrator</p>
            </div>
            <button className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md flex items-center justify-center transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation Label */}
        <div className="px-6 py-4 flex-shrink-0">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Navigation</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id, item.path)}
                className={`w-full flex items-center px-3 py-2.5 text-left rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-slate-800 text-white shadow-sm border-l-2 border-purple-400"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon
                  size={18}
                  className={`mr-3 transition-colors ${
                    isActive ? "text-purple-400" : `${item.color} group-hover:text-white`
                  }`}
                />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 text-left rounded-lg text-slate-300 hover:text-white hover:bg-red-900/20 transition-all duration-200 group"
          >
            <LogOut size={18} className="mr-3 text-red-400 group-hover:text-red-300" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default AdminSidebar
