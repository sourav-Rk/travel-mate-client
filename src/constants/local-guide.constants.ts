export const GUIDE_SPECIALTIES = {
  FOOD: "food",
  CULTURE: "culture",
  HISTORY: "history",
  ADVENTURE: "adventure",
  NIGHTLIFE: "nightlife",
  SHOPPING: "shopping",
  NATURE: "nature",
  PHOTOGRAPHY: "photography",
  FAMILY_FRIENDLY: "family-friendly",
} as const;

export type GuideSpecialty = typeof GUIDE_SPECIALTIES[keyof typeof GUIDE_SPECIALTIES];

export const VERIFICATION_STATUS = {
  PENDING: "pending",
  REVIEWING: "reviewing",
  VERIFIED: "verified",
  REJECTED: "rejected",
} as const;

export type VerificationStatusType =
  typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS];

