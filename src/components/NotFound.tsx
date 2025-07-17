"use client"

import { Button } from "@/components/ui/button"
import { Frown } from "lucide-react"

export default function NotFoundPage() {
  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="space-y-4">
        <Frown className="mx-auto h-24 w-24 text-gray-400" />
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">404</h1>
        <p className="text-xl text-gray-600">Page Not Found</p>
        <p className="text-gray-500">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button onClick={handleGoBack} className="mt-6">
          Go Back
        </Button>
      </div>
    </div>
  )
}
