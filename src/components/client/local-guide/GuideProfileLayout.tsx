"use client"

import { ProfileHeader } from "./ProfileHeader"
import { ProfileTabs } from "./ProfileTabs"
import { VerificationStatusFallback } from "./VerificationStatusFallback"
import type { LocalGuideProfile } from "@/types/local-guide"

interface GuideProfileLayoutProps {
  profile: LocalGuideProfile
  onUpdate?: () => void
}

export function GuideProfileLayout({ profile, onUpdate }: GuideProfileLayoutProps) {
  const handleEditProfile = () => {
    const editTab = document.querySelector('[value="edit"]') as HTMLElement
    if (editTab) {
      editTab.click()
    }
  }


  const isVerified = profile.verificationStatus === "verified"
  const showFallback =
    profile.verificationStatus === "rejected" ||
    profile.verificationStatus === "pending" ||
    profile.verificationStatus === "reviewing"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <ProfileHeader profile={profile} onEditProfile={isVerified ? handleEditProfile : undefined} />
        {showFallback ? (
          <VerificationStatusFallback profile={profile} />
        ) : (
          isVerified && <ProfileTabs profile={profile} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  )
}

