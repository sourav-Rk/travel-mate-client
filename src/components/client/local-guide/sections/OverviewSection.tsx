"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Award,
  DollarSign,
  Star,
  Users,
  Sparkles,
  Globe,
  TrendingUp,
  Target,
} from "lucide-react"
import type { LocalGuideProfile } from "@/types/local-guide"

interface OverviewSectionProps {
  profile: LocalGuideProfile
}


export function OverviewSection({ profile }:OverviewSectionProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Bio Section - Hero Style */}
      {profile.bio && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-[#F5F1E8]/30 to-[#2CA4BC]/5 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#2CA4BC]/10 to-transparent rounded-full blur-3xl transform translate-x-32 -translate-y-32 group-hover:scale-150 transition-transform duration-700"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold">
              <div className="p-2 bg-gradient-to-br from-[#2CA4BC] to-[#1a5f6b] rounded-xl shadow-lg">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-[#1a5f6b] to-[#2CA4BC] bg-clip-text text-transparent">
                About Me
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base lg:text-lg">
              {profile.bio}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid - Premium Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-[#F5F1E8]/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2CA4BC]/0 to-[#2CA4BC]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="pt-6 relative">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <p className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {profile.stats.totalSessions}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Total Sessions
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-[#F5F1E8]/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="pt-6 relative">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-white fill-white" />
              </div>
              <p className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {profile.stats.averageRating.toFixed(1)}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Avg Rating
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-[#F5F1E8]/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="pt-6 relative">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <p className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {profile.stats.totalRatings}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Total Reviews
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-[#F5F1E8]/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="pt-6 relative">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <p className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                ₹{profile.stats.totalEarnings.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Total Earnings
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Location - Spans 1 column */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-[#F5F1E8]/40 to-white hover:shadow-2xl transition-all duration-300 group lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl font-bold">
              <div className="p-2 bg-gradient-to-br from-[#2CA4BC] to-[#1a5f6b] rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="text-gray-800">Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1 p-3 bg-gradient-to-r from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent rounded-lg">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                City
              </p>
              <p className="text-slate-900 font-bold text-base sm:text-lg">
                {profile.location.city}
              </p>
            </div>
            <div className="space-y-1 p-3 bg-gradient-to-r from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent rounded-lg">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                State
              </p>
              <p className="text-slate-900 font-bold text-base sm:text-lg">
                {profile.location.state}
              </p>
            </div>
            <div className="space-y-1 p-3 bg-gradient-to-r from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent rounded-lg">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                Country
              </p>
              <p className="text-slate-900 font-bold text-base sm:text-lg">
                {profile.location.country}
              </p>
            </div>
            {profile.location.formattedAddress && (
              <div className="space-y-1 p-3 bg-gradient-to-r from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent rounded-lg">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                  Address
                </p>
                <p className="text-slate-700 text-sm sm:text-base">
                  {profile.location.formattedAddress}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column - Languages, Specialties, Pricing */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Languages */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-[#F5F1E8]/40 to-white hover:shadow-2xl transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl font-bold">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-800">Languages</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {profile.languages && profile.languages.length > 0 ? (
                  profile.languages.map((lang, index) => (
                    <Badge
                      key={index}
                      className="bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white border-0 px-4 py-2 text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      {lang}
                    </Badge>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">No languages specified</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Specialties and Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Specialties */}
            {profile.specialties && profile.specialties.length > 0 && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-[#F5F1E8]/40 to-white hover:shadow-2xl transition-all duration-300 group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl font-bold">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gray-800">Specialties</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.specialties.map((specialty, index) => (
                      <Badge
                        key={index}
                        className="bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 border-0 px-3 py-1.5 text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pricing */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-[#F5F1E8]/40 to-white hover:shadow-2xl transition-all duration-300 group overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#2CA4BC]/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-3 text-lg sm:text-xl font-bold">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-800">Pricing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-2 text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                    Hourly Rate
                  </p>
                  <p className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] bg-clip-text text-transparent">
                    ₹{profile.hourlyRate}
                  </p>
                  <p className="text-sm sm:text-base text-slate-600 font-semibold">
                    per hour
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}