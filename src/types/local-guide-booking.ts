export type QuoteStatus = "pending" | "accepted" | "declined" | "expired";

export interface QuoteLocation {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface Quote {
  quoteId: string;
  guideChatRoomId: string;
  sessionDate: string; // ISO date string
  sessionTime: string; // HH:mm format
  hours: number;
  hourlyRate: number;
  totalAmount: number;
  location?: QuoteLocation;
  notes?: string;
  status: QuoteStatus;
  expiresAt: string; // ISO date string
  createdAt: string; // ISO date string
  createdBy: string; // guideId
  guideName?: string; // Guide's name (for display)
  guideProfileImage?: string; // Guide's profile image (for display)
}

export interface CreateQuoteRequest {
  guideChatRoomId: string;
  sessionDate: string; // ISO date string
  sessionTime: string; // HH:mm format
  hours: number;
  location?: QuoteLocation;
  notes?: string;
}

export interface QuoteMessagePayload {
  quoteId: string;
  sessionDate: string;
  sessionTime: string;
  hours: number;
  hourlyRate: number;
  totalAmount: number;
  location?: QuoteLocation;
  notes?: string;
  status: QuoteStatus;
  expiresAt: string;
}

export type LocalGuideBookingStatus =
  | "QUOTE_ACCEPTED"
  | "ADVANCE_PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FULLY_PAID"
  | "CANCELLED";

export type LocalGuidePaymentFilter =
  | "advance_due"
  | "advance_overdue"
  | "full_due"
  | "full_paid";

export interface LocalGuideBooking {
  _id: string;
  bookingId: string;
  travellerId: string;
  guideId: string;
  guideProfileId: string;
  quoteId: string;
  guideChatRoomId: string;
  sessionDate: string;
  sessionTime: string;
  hours: number;
  hourlyRate: number;
  totalAmount: number;
  location?: QuoteLocation;
  notes?: string;
  status: LocalGuideBookingStatus;
  advancePayment: {
    amount: number;
    paid: boolean;
    dueDate: string;
    paidAt?: string | null;
  };
  fullPayment: {
    amount: number;
    paid: boolean;
    dueDate?: string | null;
    paidAt?: string | null;
  };
  serviceCompletedAt?: string;
  completionNotes?: string;
  completionRating?: number; // 1-5 rating
  cancelledAt?: string;
  cancellationRequest?: {
    requestedAt: string;
    reason: string;
    calculatedRefund?: number;
    approvedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
  guideName?: string;
  guideProfileImage?: string;
  travellerName?: string;
  travellerProfileImage?: string;
}

export interface LocalGuideBookingsQuery {
  category?: "pending" | "completed";
  status?: LocalGuideBookingStatus;
  paymentStatus?: LocalGuidePaymentFilter;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface LocalGuideBookingListResponse {
  bookings: LocalGuideBooking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    pendingCount: number;
    completedCount: number;
  };
}

