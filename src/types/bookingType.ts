export interface ClientBookingDetailDto {
  _id: string;
  packageId: string;
  status:
    | "applied"
    | "pending"
    | "confirmed"
    | "completed"
    | "waitlisted"
    | "cancelled"
    | "expired"
    | "advance_pending"
    | "advance_paid";
}

// booking.dto.ts
export interface BookingListDTO {
  id: string;
  userId: string;
  status: string;
  isWaitlisted: boolean;
  advancePayment?: {
    amount: number;
    paid: boolean;
    dueDate?: Date;
    paidAt?: Date;
  };
  fullPayment?: {
    amount: number;
    paid: boolean;
    dueDate?: Date;
    paidAt?: Date;
  };
  package?: {
    id: string;
    images?: string;
    name: string;
    price: number;
    meetingPoint: string;
    startDate: Date;
    endDate: Date;
    duration: { days: number; nights: number };
  } | null;
  createdAt: Date;
}

//booking list vendor side
export interface BookingListVendorDto {
  _id: string;
  status: string;
  isWaitlisted: boolean;
  cancelledAt?: Date;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  } | null;
}

export interface BookingDetailsDto {
  _id?: string
  userId: string
  packageId: string
  status: string 
  advancePayment?: {
    amount: number
    paid: boolean
    dueDate: Date
    paidAt: Date | null
  } | null
  fullPayment?: {
    amount: number
    paid: boolean
    dueDate: Date | null
    paidAt: Date | null
  } | null
  isWaitlisted?: boolean
  appliedAt?: Date
  cancelledAt?: Date
}

