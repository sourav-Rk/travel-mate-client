
import { useState } from "react"
import {
  FileText,
  CheckCircle,
  Calendar,
  DollarSign,
  Edit3,
} from "lucide-react"
import { OverviewSection } from "./sections/OverviewSection"
import { VerificationSection } from "./sections/VerificationSection"
import { AvailabilitySection } from "./sections/AvailabilitySection"
import { EarningsSection } from "./sections/EarningsSection"
import { EditProfileSection } from "./sections/EditProfileSection"
import { LocalGuideProfile } from "@/types/local-guide"

interface ProfileTabsProps {
  profile: LocalGuideProfile
  onUpdate?: () => void
}

export function ProfileTabs({ profile, onUpdate }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { value: "overview", label: "Overview", icon: FileText },
    { value: "verification", label: "Verification", icon: CheckCircle },
    { value: "availability", label: "Availability", icon: Calendar },
    { value: "earnings", label: "Earnings", icon: DollarSign },
    { value: "edit", label: "Edit Profile", icon: Edit3 },
  ]

  return (
    <div className="w-full">
      {/* Tab List with warm gradient theme */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5F1E8]/60 via-[#F5F1E8]/40 to-transparent rounded-xl blur-sm"></div>
        <div className="relative grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 h-auto p-1.5 sm:p-2 bg-gradient-to-r from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent backdrop-blur-sm rounded-xl shadow-lg border border-white/50">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/50 ${
                  isActive 
                    ? "bg-white shadow-md text-amber-700 font-semibold" 
                    : "text-neutral-700"
                }`}
              >
                <Icon className="h-4 w-4 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4 sm:mt-6">
        {activeTab === "overview" && <OverviewSection profile={profile} />}
        {activeTab === "verification" && <VerificationSection profile={profile} />}
        {activeTab === "availability" && <AvailabilitySection profile={profile} onUpdate={onUpdate} />}
        {activeTab === "earnings" && <EarningsSection profile={profile} />}
        {activeTab === "edit" && <EditProfileSection profile={profile} onUpdate={onUpdate} />}
      </div>
    </div>
  )
}