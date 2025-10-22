// application/dto/request/create-instruction.dto.ts
export interface CoordinatesDto {
  lat: number;
  lng: number;
}

export interface LocationDto {
  name: string;
  address: string;
  coordinates: CoordinatesDto;
}

export interface CreateInstructionDto {
  packageId: string;
  title: string;
  message: string;
  type: 'MEETING_POINT' | 'ITINERARY_UPDATE' | 'SAFETY_INFO' | 'REMINDER' | 'GENERAL';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  location?: LocationDto;
}

export type INSTRUCTION_PRIORITY = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type INSTRUCTION_TYPE =  
    | "MEETING_POINT"
    | "ITINERARY_UPDATE"
    | "SAFETY_INFO"
    | "REMINDER"
    | "GENERAL";

    
export interface IGuideInstructionDto {
  _id?: string;
  guideId: string;
  packageId: string;
  title: string;
  message: string;
  type:INSTRUCTION_TYPE;
  priority?: INSTRUCTION_PRIORITY;
  location?: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  sentAt?: Date;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
}


export interface GuideInstructionWithPackageDto {
  _id?: string;
  guideId: string;
  packageId: string;
  title: string;
  message: string;
  type:
    | "MEETING_POINT"
    | "ITINERARY_UPDATE"
    | "SAFETY_INFO"
    | "REMINDER"
    | "GENERAL";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  location?: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  sentAt?: Date;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
  packageDetails?: {
    packageName: string;
    title: string;
    startDate: Date;
    endDate: Date;
    meetingPoint?: string;
    thumbnail?: string;
  };
}
