"use client"

import { useClientAuth } from "@/hooks/auth/useAuth"
import { useLocalGuideProfileQuery } from "@/hooks/local-guide/useLocalGuideVerification"
import { Spinner } from "@/components/Spinner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface VerificationCheckProps {
  children: React.ReactNode
}

export function VerificationCheck({ children }: VerificationCheckProps) {
  const { isLoggedIn } = useClientAuth()
  const navigate = useNavigate()
  const { data: profile, isLoading } = useLocalGuideProfileQuery(isLoggedIn)

  // If not logged in or no profile, show children (they'll be handled by other guards)
  if (!isLoggedIn || !profile) {
    return <>{children}</>
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  // Check if verification is pending
  if (profile.verificationStatus === "pending") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent flex items-center justify-center p-4">
        <Card className="border-slate-200 shadow-xl max-w-md w-full">
          <CardContent className="p-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-amber-100 rounded-full">
                <Clock className="h-12 w-12 text-amber-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">
              Verification in Progress
            </h2>
            <p className="text-slate-600 mb-6 text-center">
              Your local guide profile is currently under review by our admin team. 
              Please wait for verification to be completed before you can access this page.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Verification typically takes 24-48 hours
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Return to Home
              </Button>
              <Button
                onClick={() => navigate("/pvt/local-guide/profile")}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              >
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If verified or other status, show the children
  return <>{children}</>
}