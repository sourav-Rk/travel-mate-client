"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Wallet, CreditCard, Calendar, Star, FileText, Award } from "lucide-react"
import type { LocalGuideProfile } from "@/types/local-guide"

interface EarningsSectionProps {
  profile: LocalGuideProfile
}

export function EarningsSection({ profile }: EarningsSectionProps) {
  const stats = profile.stats

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Total Earnings - Hero Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-[#6ed96e] to-[#65c664] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-white/90">
            <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            Total Earnings
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
                  ₹{stats.totalEarnings.toLocaleString()}
                </span>
                <span className="text-sm sm:text-base text-white/80 mb-1">lifetime</span>
              </div>
              <p className="text-sm sm:text-base text-white/90 mt-2">
                Earnings from all completed sessions
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/30">
              <p className="text-xs text-white/80">This Month</p>
              <p className="text-xl sm:text-2xl font-bold text-white">₹{Math.round(stats.totalEarnings * 0.15).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Hourly Rate */}
        <Card className="border-0 shadow-md bg-gradient-to-r from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <div className="p-2 bg-gradient-to-br from-[#2CA4BC] to-[#1a5f6b] rounded-lg">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              Hourly Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] bg-clip-text text-transparent">
                ₹{profile.hourlyRate}
              </span>
              <span className="text-sm sm:text-base text-slate-600">per hour</span>
            </div>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Your current hourly rate for guide services
            </p>
          </CardContent>
        </Card>

        {/* Average Session Earnings */}
        <Card className="border-0 shadow-md bg-gradient-to-r from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              Average Session Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                ₹
                {stats.completedSessions > 0
                  ? Math.round(stats.totalEarnings / stats.completedSessions).toLocaleString()
                  : "0"}
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Average earnings per completed session
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Session Statistics */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Calendar className="h-5 w-5 text-[#2CA4BC]" />
            Session Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:shadow-md transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-2">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {stats.totalSessions}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">Total Sessions</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:shadow-md transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-2">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                {stats.completedSessions}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">Completed</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:shadow-md transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full mb-2">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
                {stats.totalSessions - stats.completedSessions}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">Pending</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:shadow-md transition-shadow duration-300 col-span-2 lg:col-span-1">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full mb-2">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                {stats.totalSessions > 0
                  ? Math.round(
                      (stats.completedSessions / stats.totalSessions) * 100
                    )
                  : 0}
                %
              </p>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Award className="h-5 w-5 text-[#2CA4BC]" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-200/50 hover:border-[#2CA4BC]/30 transition-colors duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <span className="text-sm sm:text-base font-medium text-slate-700">
                  Average Rating
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  {stats.averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-slate-500">/ 5.0</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-200/50 hover:border-[#2CA4BC]/30 transition-colors duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <span className="text-sm sm:text-base font-medium text-slate-700">
                  Total Ratings
                </span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                {stats.totalRatings}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-200/50 hover:border-[#2CA4BC]/30 transition-colors duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <span className="text-sm sm:text-base font-medium text-slate-700">
                  Total Posts
                </span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                {stats.totalPosts}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm sm:text-base text-slate-700">
            Earnings are processed after each completed session. Payments are typically
            transferred to your registered account within 3-5 business days.
          </p>
          <div className="p-4 sm:p-5 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm rounded-xl border border-blue-200/50 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-2xl">💡</div>
              <div>
                <p className="text-sm sm:text-base font-medium text-slate-800 mb-1">
                  Pro Tip
                </p>
                <p className="text-xs sm:text-sm text-slate-600">
                  Complete more sessions to increase your total earnings and improve
                  your profile visibility. Higher ratings also attract more bookings!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}