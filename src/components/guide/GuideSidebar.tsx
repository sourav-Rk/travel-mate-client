"use client"

import * as React from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { User, Calendar, Users, Star, Bell, MessageCircle, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useLogout } from "@/hooks/auth/useLogout"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { logoutUser } from "@/store/slices/userSlice"

interface GuideSidebarProps {
  guide?: {
    name: string
    avatar?: string
    initials?: string
  }
  className?: string
}

const navigationItems = [
  {
    title: "Assigned Trips",
    href: "/guide/assigned-trips",
    icon: Calendar,
  },
  {
    title: "Groups",
    href: "/guide/groups",
    icon: Users,
  },
  {
    title: "Reviews",
    href: "/guide/reviews",
    icon: Star,
  },
  {
    title: "Notifications",
    href: "/guide/notifications",
    icon: Bell,
  },
  {
    title: "Messages",
    href: "/guide/messages",
    icon: MessageCircle,
  },
  {
    title: "Profile",
    href: "/guide/profile",
    icon: User,
  },
]

export function GuideSidebar({
  guide = {
    name: "Alex Guide",
    avatar: "/placeholder.svg?height=80&width=80&text=Alex+Guide",
    initials: "AG",
  },
  className,
}: GuideSidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen);

  
  const dispatch = useDispatch();
  const navigate = useNavigate();

   const {mutate : logoutAdminMutate} = useLogout();
  const handleLogout = ()=>{
    logoutAdminMutate(undefined,{
      onSuccess :(response) =>{
        toast.success(`${response.message}`);
        dispatch(logoutUser())
        navigate("/guide/login")
      },
      onError : (error : any) =>{
        toast.error(error)
      }
    })
  }


  const SidebarContent = () => (
    <div className="flex h-full w-full flex-col bg-white text-[#1a5f6b]">
      {/* Header Section */}
      <div className="flex flex-col items-center p-6 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2CA4BC] text-white shadow-lg p-1">
            <img src="/Travel_Mate_Logo.png" alt="Travel Mate Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a5f6b] tracking-wide">Travel Mate</h1>
        </div>


        {/* Guide Info Section */}
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="h-20 w-20 border-4 border-white shadow-lg ring-2 ring-[#2CA4BC]/30">
            <AvatarImage src={guide.avatar || "/placeholder.svg"} alt={guide.name} />
            <AvatarFallback className="bg-[#2CA4BC] text-white text-lg font-semibold">{guide.initials}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-lg font-semibold text-[#1a5f6b]">{guide.name}</p>
            <p className="text-sm text-[#2CA4BC]/80">Certified Guide</p>
          </div>
        </div>
      </div>
      {/* Separator now within a px-4 wrapper to align with content */}
      <div className="px-4">
        <Separator className="bg-border" />
      </div>
      {/* Navigation Section */}
       <nav className="flex-1 px-4 py-6 overflow-y-auto sidebar-scroll">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:shadow-sm hover:scale-[1.02]",
                  isActive
                    ? "bg-[#2CA4BC] text-white shadow-md"
                    : "text-[#1a5f6b] hover:bg-[#2CA4BC]/10 hover:text-[#2CA4BC]",
                )
              }
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      {/* Logout Section */}
      <div className="p-4">
        {/* Separator now without mx-4, letting parent padding handle alignment */}
        <Separator className="mb-4 bg-border" />
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#1a5f6b] hover:bg-red-50 hover:text-red-600 hover:shadow-sm transition-all duration-200"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  )

  return (
   <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white border border-[#2CA4BC]/20"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-5 w-5 text-[#2CA4BC]" /> : <Menu className="h-5 w-5 text-[#2CA4BC]" />}
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex h-screen w-64 flex-col border-r border-border shadow-sm fixed left-0 top-0", // Subtle shadow
          className,
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 transform transition-transform duration-300 ease-in-out md:hidden shadow-lg", // Subtle shadow
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
