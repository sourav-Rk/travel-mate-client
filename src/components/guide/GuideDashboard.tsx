"use client"

import { LogOut, User } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "../Spinner"
import { useLogout } from "@/hooks/auth/useLogout"
import { logoutGuide } from "@/services/auth/authService"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { guideLogout } from "@/store/slices/guideSlice"
import { useNavigate } from "react-router-dom"



export default function GuideDashboard() {
  // useActionState for the logout action

  const dispatch = useDispatch();
  const navigate = useNavigate();

   const {mutate : logoutAdminMutate,isPending} = useLogout(logoutGuide);
  const handleLogout = ()=>{
    logoutAdminMutate(undefined,{
      onSuccess :(response) =>{
        toast.success(`${response.message}`);
        dispatch(guideLogout())
        navigate("/guide")
      },
      onError : (error : any) =>{
        toast.error(error)
      }
    })
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay : 0.5 } },
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div initial="hidden" animate="visible" variants={cardVariants} className="w-full max-w-md mx-auto">
        <Card className="shadow-xl border-none bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center">
            <User className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-3xl font-extrabold text-gray-900 dark:text-gray-50">Welcome, Guide!</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Your dashboard awaits. Manage your tours and connect with travelers.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              This is a basic guide dashboard. Here you can see your upcoming bookings, manage your profile, and add new
              tour offerings.
            </p>
            <form action={handleLogout} className="w-full">
              <Button
                type="submit"
                className="w-full py-2 px-4 rounded-md text-lg font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 flex items-center justify-center gap-2"
                disabled={isPending}
              >
                {isPending && <Spinner className="h-5 w-5" />}
                {isPending ? "Logging out..." : "Logout"}
                {!isPending && <LogOut className="h-5 w-5" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
