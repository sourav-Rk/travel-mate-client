"use client"
import { Link } from 'react-router-dom';

import { motion } from "framer-motion"
import { Plane } from "lucide-react" // Still using Lucide React for icons

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function MainNav() {
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  }

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
      className="flex items-center justify-between px-8 py-4 bg-white/90 backdrop-blur-md shadow-sm fixed w-full z-50 top-0 border-b border-gray-100 dark:bg-gray-900/90 dark:border-gray-800"
    >
      <motion.div variants={navItemVariants} className="flex items-center space-x-2">
        <Plane className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        <Link to="/" className="text-xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
          TravelMate
        </Link>
      </motion.div>

      <div className="flex items-center space-x-4">
        <motion.div variants={navItemVariants}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                User
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-50"
            >
              <DropdownMenuItem asChild>
                <Link to="/login" className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  Login
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/signup" className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  Sign Up
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        <motion.div variants={navItemVariants}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Vendor
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-50"
            >
              <DropdownMenuItem asChild>
                <Link to="/vendor" className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  Login
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/vendor/signup" className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  Sign Up
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        <motion.div variants={navItemVariants}>
          <Button
            asChild
            variant="ghost"
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Link to="/guide">Guide Login</Link>
          </Button>
        </motion.div>
      </div>
    </motion.nav>
  )
}
