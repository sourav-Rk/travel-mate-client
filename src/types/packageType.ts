// Duration info
export interface Duration {
  days: number;
  nights: number;
}

// Meals info
export interface Meals {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

// Activity inside each day
export interface Activity {
  _id?: string;
  name: string;
  description: string;
  duration: string;
  category: string;
  priceIncluded: boolean;
}


// Each day of the itinerary
export interface Day {
  _id?: string;
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


// Base package fields shared between all variants
export interface BasePackage {
  _id: string;
  packageId?: string;
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
  minGroupSize?: number;
  price: number;
  duration: { days: number; nights: number };
  inclusions: string[];
  exclusions: string[];
  cancellationPolicy: string;
  termsAndConditions: string;
  startDate: Date | null;
  endDate: Date | null;
}


//Vendor-side / simplified details
export interface PackageDetails extends BasePackage {
  agencyId?:string;
  isBlocked: boolean;
  guideId?: string;
}

export interface TravelPackage extends BasePackage {
  agencyId: string;
  createdAt: Date;
  itineraryDetails: ItineraryDetails;
  itineraryId: string;
  status: "active" | "inactive" | "draft" | "completed";
}


export type UnifiedPackage = PackageDetails | TravelPackage;



// Form Data
export interface PackageFormData {
  basicDetails: Omit<BasePackage, "_id" | "status" | "images"> & {
    images: File[];
  };
  itinerary: Array<{
    dayNumber: number;
    title: string;
    description: string;
    accommodation: string;
    transfers: string[];
    meals: Meals;
    activities: Activity[];
  }>;
}

// Vendor listing
interface IDuration {
  _id?: string;
  days: number;
  nights: number;
}
export interface PackageListingVendorDto {
  _id?: string;
  packageId: string;
  packageName: string;
  title: string;
  images: string[];
  meetingPoint: string;
  category: string;
  duration: IDuration;
  maxGroupSize: number;
  price: number;
  status: string;
  isBlocked: boolean;
  guideId?: string;
  startDate?: string;
  endDate?: string;
}


// User listing
export interface PackageListingUserSideDto {
  _id: string;
  packageId?: string;
  packageName: string;
  title: string;
  meetingPoint: string;
  category: string;
  description: string;
  tags: string[];
  maxGroupSize: number;
  duration: Duration;
  price: number;
  images: string[];
}

export interface BasicDetails {
  packageName: string;
  title: string;
  slug?: string;
  description: string;
  category: string;
  maxGroupSize: number;
  minGroupSize: number;
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




// export interface PackageListingUserSideDto {
//   _id: string;
//   packageId ?: string;
//   packageName: string;
//   title: string;
//   meetingPoint: string;
//   category: string;
//   description: string;
//   tags: string[];
//   maxGroupSize: number;
//   duration: {
//     days: number;
//     nights: number;
//   };
//   price: number;
//   images: string[];
// }






// export  interface PackageDetails extends BasePackage {
//   isBlocked: boolean;
//   guideId?: string;
// }


// export interface PackageDetails {
//   _id: string;
//   packageId?: string;
//   packageName: string;
//   title: string;
//   slug: string;
//   description: string;
//   category: string;
//   maxGroupSize: number;
//   minGroupSize ?: number;
//   price: number;
//   tags: string[];
//   startDate: Date | null;
//   endDate: Date | null;
//   duration: { days: number; nights: number };
//   meetingPoint: string;
//   images: string[];
//   inclusions: string[];
//   exclusions: string[];
//   cancellationPolicy: string;
//   termsAndConditions: string;
//   status: string;
//   isBlocked: boolean;
//   guideId?: string;
// }



// export interface TravelPackage extends BasePackage {
//   agencyId: string;
//   createdAt: Date;
//   itineraryDetails: ItineraryDetails;
//   itineraryId: string;
//   status: "active" | "inactive" | "draft" | "completed";
// }



// export interface PackageFormData {
//   basicDetails: {
//     packageName: string;
//     title: string;
//     slug: string;
//     description: string;
//     category: string;
//     tags: string[];
//     meetingPoint: string;
//     images: File[];
//     maxGroupSize: number;
//     minGroupSize: number;
//     price: number;
//     cancellationPolicy: string;
//     termsAndConditions: string;
//     startDate: Date | null;
//     endDate: Date | null;
//     duration: { days: number; nights: number };
//     inclusions: string[];
//     exclusions: string[];
//   };
//   itinerary: Array<{
//     dayNumber: number;
//     title: string;
//     description: string;
//     accommodation: string;
//     transfers: string[];
//     meals: { breakfast: boolean; lunch: boolean; dinner: boolean };
//     activities: Array<{
//       name: string;
//       dayNumber: number;
//       description: string;
//       duration: string;
//       category: string;
//       priceIncluded: boolean;
//     }>;
//   }>;
// }


// Main Package interface
// export interface TravelPackage {
//   _id: string;
//   packageId?: string;
//   agencyId: string;
//   packageName: string;
//   title: string;
//   slug: string;
//   description: string;
//   category: string;
//   tags: string[];
//   status: "active" | "inactive" | "draft" | "completed";
//   meetingPoint: string;
//   images: string[];
//   maxGroupSize: number;
//   price: number;
//   cancellationPolicy: string;
//   termsAndConditions: string;
//   startDate: Date;
//   endDate: Date;
//   duration: Duration;
//   exclusions: string[];
//   inclusions: string[];
//   createdAt: Date;
//   itineraryDetails: ItineraryDetails;
//   itineraryId: string;
//   minGroupSize: number;
// }