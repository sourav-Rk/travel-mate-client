import type { BOOKINGSTATUS } from "./bookingType";

export interface CancellationRequestDto {
  _id: string;
  bookingId: string;
  userId: string;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  package?: {
    _id: string;
    name: string;
    price: number;
    startDate: string;
    endDate?: string;
    images: string;
    meetingPoint: string;
  };
  cancellationReason: string;
  refundAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
  vendorNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CancellationRequestResponse {
  cancellationRequests: CancellationRequestDto[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export interface ProcessCancellationRequestPayload {
  status: 'approved' | 'rejected';
  vendorNotes?: string;
}

export interface ICancellationRequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  totalRefundAmount: number;
}

//------------------
export interface CancellationRequestsListDto{
  bookingId: string;
  status: BOOKINGSTATUS;
  refundAmount: number;
  cancellationReason : string;
  requestedAt : string;
  user: {
    userId : string;
    name: string;
    email: string;
    phone: string;
  };
  package: {
    packageId : string;
    packageName: string;
    title: string;
    startDate: Date;
    endDate: Date;
  };
}

//booking details dto for booking details view
export interface CancelledBookingDetailsWithUserAndPackageDetailsDto {
  _id: string;
  bookingId: string;
  packageId: string;
  status: BOOKINGSTATUS;
  isWaitlisted: boolean;
  cancelledAt?:Date;
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

  cancellationRequest?:{
    requestedAt: Date;
    reason:string;
    calculatedRefund:number;
    approvedAt?:Date;
  }

    user?: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    gender: string;
    email: string;
  };

  package?: {
    packageId?: string;
    packageName?: string;
    title?: string;
    startDate?: Date;
    endDate?: Date;
    price?: number;
  };
}
