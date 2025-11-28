"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { INotificationEntity, NotificationResponse } from "@/types/notificationType"
import { useEffect } from "react"
import { Menu, Bell, LogOut, User, Home, Compass,InfoIcon, UserCircle, MessageSquare } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion } from "framer-motion"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useClientAuth } from "@/hooks/auth/useAuth"

import toast from "react-hot-toast"
import { useLogout } from "@/hooks/auth/useLogout"
import { useGetNotifications, useMarkAllNotificationsRead, useMarkNotificationRead } from "@/hooks/notification/useNotification"
import { getNotificationsClient, markAllNotificationReadClient, markNotificationReadClient } from "@/services/client/client.service"
import { NotificationModal } from "../NotificationModal"
import { logoutUser } from "@/store/slices/userSlice"
import { useUnreadInstructions } from "@/hooks/guideInstructions/useInstructions"
import { GuideInstructionModal } from "../client/GuideInstructionsModal"

const navItems = [
  { name: "Holidays", href: "/packages", icon: Home },
  { name: "Volunteering", href: "/volunteering", icon: Compass },
  { name: "About", href: "/about", icon: InfoIcon },
]

const loginRoles = [
  { name: "User", href: "/login", description: "Book packages and explore" },
  { name: "Vendor", href: "/vendor", description: "Manage your business" },
  { name: "Guide", href: "/guide/login", description: "Lead adventures" },
]

interface Client {
  firstName: string
  lastName?: string
  email: string
  profileImage?: string
}

interface ClientHeaderProps {
  client?: Client
}

export function ClientHeader({ client }: ClientHeaderProps) {
  const [activeItem, setActiveItem] = useState("Dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false)
  const [notifications, setNotifications] = useState<INotificationEntity[]>([])

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { isLoggedIn, clientInfo } = useClientAuth()
  const { mutate: logoutClientMutate } = useLogout();
  const { mutate: markRead } = useMarkNotificationRead(markNotificationReadClient);
  const { mutate: markAllRead } = useMarkAllNotificationsRead(markAllNotificationReadClient);
  
  // Instruction notifications hook
  const {
    allInstructions,
    showModal: showInstructionModal,
    closeModal: closeInstructionModal,
    markAsRead: markInstructionAsRead,
    markAllAsRead: markAllInstructionsAsRead,
  } = useUnreadInstructions()

  const { data: notifData, isLoading: notifLoading } = useGetNotifications<NotificationResponse>(
    ["notifications-client"],
    getNotificationsClient,
    {
      enabled: isLoggedIn
    }
  );

  useEffect(() => {
    if (notifData) setNotifications(notifData.notifications || [])
  }, [notifData])

  const unreadNotifCount = notifications?.filter((n) => !n.isRead)?.length || 0
  const unreadInstructionCount = allInstructions?.filter((ins) => !ins.readBy.includes(clientInfo?.id)).length || 0;


  const handleMarkRead = async (id: string) => {
    markRead(id, {
      onSuccess: (response) => {
        console.log(response.message)
      },
      onError: (error: any) => {
        console.log(error)
      }
    })
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)))
  }

  const handleMarkAllRead = async () => {
    markAllRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const logout = () => {
    logoutClientMutate(undefined, {
      onSuccess: (response) => {
        toast.success(`${response.message}`)
        dispatch(logoutUser());
        navigate("/")
      },
      onError: (error: any) => {
        toast.error(error)
      },
    })
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-[70] w-full bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button onClick={() => navigate("/home")} className="flex items-center space-x-3 group">
              <div className="w-14 h-8 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <img src="/Travel_Mate_Logo.png" alt="Travel Mate" />
              </div>
              <span className="hidden sm:block text-xl font-bold text-gray-900">Travel Mate</span>
            </button>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.name
              return (
                <motion.button
                  key={item.name}
                  onClick={() => {
                    setActiveItem(item.name)
                    navigate(item.href)
                  }}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive ? "text-indigo-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-indigo-50 rounded-lg -z-10"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {isLoggedIn && clientInfo?.id && (
              <>
                {/* Instruction Notifications */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsInstructionModalOpen(true)}
                  >
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    {unreadInstructionCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-blue-500 text-white text-[10px] leading-5 text-center font-semibold">
                        {unreadInstructionCount > 99 ? "99+" : unreadInstructionCount}
                      </span>
                    )}
                  </Button>
                </motion.div>

                {/* Regular Notifications */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsNotifOpen(true)}
                  >
                    <Bell className="w-5 h-5 text-gray-600" />
                    {unreadNotifCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] leading-5 text-center font-semibold">
                        {unreadNotifCount > 99 ? "99+" : unreadNotifCount}
                      </span>
                    )}
                  </Button>
                </motion.div>
              </>
            )}

            {isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={client?.profileImage || "/placeholder.svg"} />
                      <AvatarFallback className="bg-indigo-500 text-white text-sm">
                        {clientInfo?.firstName?.charAt(0) || clientInfo?.lastName?.charAt(0) || clientInfo?.email?.charAt(0)?.toUpperCase() || '?'}
                        {clientInfo?.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:block text-sm font-medium text-gray-700">{clientInfo?.firstName}</span>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {clientInfo?.firstName} {clientInfo?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{clientInfo?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/pvt/profile")} className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {!isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    <UserCircle className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm font-medium">Login</span>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Choose Your Role</p>
                      <p className="text-xs text-gray-500">Select how you want to access Travel Mate</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {loginRoles.map((role) => (
                    <DropdownMenuItem
                      key={role.name}
                      onClick={() => navigate(role.href)}
                      className="cursor-pointer flex flex-col items-start p-3 hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-2 w-full">
                        <UserCircle className="w-4 h-4 text-indigo-600" />
                        <span className="font-medium text-gray-900">{role.name}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-6">{role.description}</p>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-6">
                  <div className="flex items-center space-x-3 pb-4 border-b">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">TM</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Travel Mate</h3>
                      <p className="text-sm text-gray-500">
                        {isLoggedIn ? "Welcome back!" : "Explore amazing destinations"}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Notification Icons */}
                  {isLoggedIn && (
                    <div className="flex space-x-2 pb-4 border-b">
                      <Button
                        variant="outline"
                        className="flex-1 relative"
                        onClick={() => {
                          setIsInstructionModalOpen(true)
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Instructions
                        {unreadInstructionCount > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-blue-500 text-white text-[8px] leading-4 text-center font-semibold">
                            {unreadInstructionCount}
                          </span>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 relative"
                        onClick={() => {
                          setIsNotifOpen(true)
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                        {unreadNotifCount > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[8px] leading-4 text-center font-semibold">
                            {unreadNotifCount}
                          </span>
                        )}
                      </Button>
                    </div>
                  )}

                  <nav className="flex flex-col space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <motion.button
                          key={item.name}
                          onClick={() => {
                            navigate(item.href)
                            setIsMobileMenuOpen(false)
                          }}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-gray-900">{item.name}</span>
                        </motion.button>
                      )
                    })}
                  </nav>

                  <div className="pt-4 border-t">
                    {isLoggedIn ? (
                      <motion.button
                        onClick={() => {
                          navigate("/pvt/profile")
                          setIsMobileMenuOpen(false)
                        }}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
                        whileHover={{ x: 4 }}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={client?.profileImage || "/placeholder.svg"} />
                          <AvatarFallback className="bg-indigo-500 text-white text-sm">
                            {clientInfo?.firstName?.charAt(0)}
                            {clientInfo?.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">
                            {clientInfo?.firstName} {clientInfo?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">View Profile</p>
                        </div>
                      </motion.button>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-900 px-3">Login as:</p>
                        {loginRoles.map((role) => (
                          <motion.button
                            key={role.name}
                            onClick={() => {
                              navigate(role.href)
                              setIsMobileMenuOpen(false)
                            }}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
                            whileHover={{ x: 4 }}
                          >
                            <UserCircle className="w-5 h-5 text-indigo-600" />
                            <div>
                              <p className="font-medium text-gray-900">{role.name}</p>
                              <p className="text-xs text-gray-500">{role.description}</p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Regular Notifications Modal */}
      <NotificationModal
        open={isNotifOpen}
        onOpenChange={setIsNotifOpen}
        notifications={notifications}
        isLoading={notifLoading}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
      />

      {/* Guide Instructions Modal */}
      <GuideInstructionModal
        allInstructions={allInstructions}
        isOpen={isInstructionModalOpen || showInstructionModal}
        onClose={() => {
          setIsInstructionModalOpen(false)
          closeInstructionModal()
        }}
        onMarkAsRead={markInstructionAsRead}
        onMarkAllAsRead={markAllInstructionsAsRead}
      />
    </motion.header>
  )
}

export function ClientHeaderWithNotifications(props: ClientHeaderProps) {
  return (
    <>
      <ClientHeader {...props} />
    </>
  )
}