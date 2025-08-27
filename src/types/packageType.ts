export interface PackageFormData {
  basicDetails: {
    packageName: string
    title: string
    slug: string
    description: string
    category: string
    tags: string[]
    meetingPoint: string
    images: File[]
    maxGroupSize: number
    price: number
    cancellationPolicy: string
    termsAndConditions: string
    startDate: Date | null
    endDate: Date | null
    duration: { days: number; nights: number }
    inclusions: string[]
    exclusions: string[]
  }
  itinerary: Array<{
    dayNumber: number
    title: string
    description: string
    accommodation: string
    transfers: string[]
    meals: { breakfast: boolean; lunch: boolean; dinner: boolean }
    activities: Array<{
      name: string
      dayNumber: number
      description: string
      duration: string
      category: string
      priceIncluded: boolean
    }>
  }>
}


export interface BasicDetails {
  packageName: string;
  title: string;
  slug?: string;
  description: string;
  category: string;
  maxGroupSize: number;
  price: number;
  tags: string[];
  startDate: Date | null;
  endDate: Date | null;
  duration: { days: number; nights: number };
  meetingPoint: string;
  images: (File | string)[];
  inclusions: string[];
  exclusions: string[];
  cancellationPolicy: string;
  termsAndConditions: string;
}


// Activity inside each day
export interface Activity {
  _id ?: string;
  name: string;
  description: string;
  duration: string;
  category: string;
  priceIncluded: boolean;
}

// Meals info
export interface Meals {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

// Each day of the itinerary
export interface Day {
  _id ?: string;
  dayNumber: number;
  title: string;
  description: string;
  activityDetails: Activity[];
  transfers: string[];
  meals: Meals;
  accommodation: string | null;
}

// Itinerary details containing multiple days
export interface ItineraryDetails {
  days: Day[];
}

// Duration info
export interface Duration {
  days: number;
  nights: number;
}

// Main Package interface
export interface TravelPackage {
  _id: string;
  agencyId: string;
  packageName: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  status: "active" | "inactive" | "draft" | "completed";
  meetingPoint: string;
  images: string[];
  maxGroupSize: number;
  price: number;
  cancellationPolicy: string;
  termsAndConditions: string;
  startDate: Date;
  endDate: Date;
  duration: Duration;
  exclusions: string[];
  inclusions: string[];
  createdAt: Date;
  itineraryDetails: ItineraryDetails;
  itineraryId : string;
}

//day dto edit
export interface DayDto {
  dayNumber: number;
  title: string;
  description: string;
  activities: string[]; 
  transfers: string[];
  meals: Meals;
  _id: string;
}