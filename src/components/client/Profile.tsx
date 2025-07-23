"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, Users, FileText, Edit3, KeyRound, CheckCircle, AlertCircle, Camera } from "lucide-react"
import { useEffect, useState } from "react"
import type { Client } from "@/services/client/client.service"
import { useClientProfileQuery } from "@/hooks/client/useClientProfile"
import { Spinner } from "../Spinner"
import { useNavigate } from "react-router-dom"


export function ProfilePage() {
  const navigate = useNavigate();
  const [client,setClient] = useState<Client>();
  const {data,isLoading} = useClientProfileQuery();

  useEffect(() =>{
    if(!data) return;
    setClient(data.client);
  });

  if(isLoading) return <Spinner/>


  // Calculate profile completion
  const calculateCompletion = () => {
    const fields = [
      client?.firstName,
      client?.lastName,
      client?.email,
      client?.phone,
      client?.gender,
      client?.bio,
      client?.profileImage,
    ]

    const filledFields = fields.filter((field) => field && field.trim() !== "").length
    return Math.round((filledFields / fields.length) * 100)
  }

  const completionPercentage = calculateCompletion()
  const isProfileComplete = completionPercentage === 100

  const handleEditProfile = () => {
     navigate("/profile-edit")
  }

  const handleResetPassword = () => {
     navigate("/change-password")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Profile Overview
          </h1>
          <p className="text-slate-600 text-sm md:text-base">Manage your personal information and account settings</p>
        </div>

        {/* Profile Completion Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {isProfileComplete ? (
                  <CheckCircle className="h-6 w-6 text-green-300" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-yellow-300" />
                )}
                <div>
                  <h3 className="font-semibold text-lg">
                    {isProfileComplete ? "Profile Complete!" : "Complete Your Profile"}
                  </h3>
                  <p className="text-blue-100 text-sm">
                    {isProfileComplete
                      ? "All information has been provided"
                      : "Add missing information to complete your profile"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{completionPercentage}%</div>
                <div className="text-blue-100 text-xs">Complete</div>
              </div>
            </div>
            <Progress value={completionPercentage} className="h-2 bg-blue-400" />
          </CardContent>
        </Card>

        {/* Main Profile Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Image */}
              <div className="relative">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-white shadow-lg">
                  <AvatarImage src={client?.profileImage || "/placeholder.svg"} alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl md:text-2xl font-bold">
                    {client?.firstName[0]}
                    {client?.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-slate-100 rounded-full p-2 shadow-md">
                  <Camera className="h-4 w-4 text-slate-600" />
                </div>
              </div>

              {/* Basic Info */}
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                  {client?.firstName} {client?.lastName}
                </h2>
                <p className="text-slate-600 mb-4">{client?.email}</p>
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified Account
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Email</p>
                      <p className="text-slate-900 font-medium">{client?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Phone</p>
                      <p className="text-slate-900 font-medium">
                        {client?.phone || <span className="text-slate-400 italic">Not provided</span>}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Personal Information
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Gender</p>
                    <p className="text-slate-900 font-medium">
                      {client?.gender || <span className="text-slate-400 italic">Not specified</span>}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Bio Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                About Me
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-slate-700 leading-relaxed">
                  {client?.bio || (
                    <span className="text-slate-400 italic">No bio provided. Tell others about yourself!</span>
                  )}
                </p>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleEditProfile}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                onClick={handleResetPassword}
                variant="outline"
                className="flex-1 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 bg-transparent"
                size="lg"
              >
                <KeyRound className="h-4 w-4 mr-2" />
                Reset Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}
