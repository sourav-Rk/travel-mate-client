export enum BOOKINGSTATUS {
  APPLIED = "applied",
  CONFIRMED = "confirmed",
  FULLY_PAID = "fully_paid",
  COMPLETED = "completed",
  WAITLISTED = "waitlisted",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  ADVANCE_PENDING = "advance_pending",
  CANCELLATION_REQUESTED = "cancellation_requested",
}

export interface ClientBookingDetailDto {
  _id: string;
  packageId: string;
  status: BOOKINGSTATUS;
  bookingId?: string;
  isWaitlisted?: boolean;
  cancelledAt?: Date;
}

// booking.dto.ts
export interface BookingListDTO {
  id: string;
  bookingId: string;
  userId: string;
  status: BOOKINGSTATUS;
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
    packageId?: { packageId: string };
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
  bookingId?: string;
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
  _id?: string;
  bookingId?: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    gender: string;
  };
  packageId: string;
  status: string;
  advancePayment?: {
    amount: number;
    paid: boolean;
    dueDate: Date;
    paidAt: Date | null;
  } | null;
  fullPayment?: {
    amount: number;
    paid: boolean;
    dueDate: Date | null;
    paidAt: Date | null;
  } | null;
  isWaitlisted?: boolean;
  appliedAt?: Date;
  cancelledAt?: Date;
}

// bookingTypes.ts
export interface AdvancePayment {
  amount: number;
  dueDate: Date | string | null;
  paid: boolean;
  paidAt?: string | Date | null; // allow null to be safe
}

export interface FullPayment {
  amount: number;
  dueDate: Date | string | null;
  paid: boolean;
  paidAt?: string | Date | null;
}

export interface CancellationRequest {
  requestedAt: string;
  reason: string;
  calculatedRefund: number;
  approvedAt?: string;
}

//booking dto for viewing the booking details
export interface BookingDetailsClientDto {
  _id: string;
  userId: string;
  bookingId: string;
  packageId: string;
  status: BOOKINGSTATUS;
  isWaitlisted: boolean;
  advancePayment?: AdvancePayment | null;
  fullPayment?: FullPayment | null;
  cancelledAt?: string;
  refundAmount?: number;
  cancellationRequest?: CancellationRequest;
}

export interface PaymentResponseDto {
  url: string;
  sessionId: string;
}

// "bookingDetails": {
//         "_id": "68d48106b6fb6c4aade59740",
//         "bookingId": "TRAVELMATE-20250925-0FEB30",
//         "packageId": "PKG-20250823-CZ9M6E",
//         "userId": "688c59092dc34942600f5b7f",
//         "isWaitlisted": false,
//         "status": "fully_paid",
//         "advancePayment": {
//             "amount": 7499,
//             "dueDate": "2025-09-29T23:41:29.833Z",
//             "paid": true,
//             "paidAt": "2025-09-25T05:09:41.901Z"
//         },
//         "fullPayment": {
//             "amount": 17500,
//             "dueDate": "2025-10-23T18:30:00.000Z",
//             "paid": true,
//             "paidAt": "2025-09-25T05:10:13.172Z"
//         }
//     }
