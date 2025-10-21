// "use client";

// import  { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   ArrowLeft,
//   User,
//   Calendar,
//   Package,
//   Mail,
//   Clock,
//   AlertCircle,
//   DollarSign,
//   MessageSquare,
//   CreditCard,
//   CalendarClock,
//   Wallet,
//   Phone,
//   CheckCircle,
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { cn } from "@/lib/utils";
// // import { useGetCancellationBookingDetails, useProcessCancellationbooking } from "@/hooks/vendor/useCancellationbooking!s";
// import type { CancelledBookingDetailsWithUserAndPackageDetailsDto } from "@/types/cancellationType";
// import { useParams } from "react-router-dom";
// import { useGetCancellationBookingDetails } from "@/hooks/vendor/useCancellationRequests";

// interface CancellationbookingRequest {
//   onBack: () => void;
//   onProcessed: () => void;
// }

// export default function CancellationbookingView({ 
//   onBack, 
//   onProcessed 
// }: CancellationbookingRequest) {
//    const params = useParams()
//   const bookingId = (params as any)?.bookingId ?? (params as any)?.id ?? (params as any)?.booking_id ?? ""
//   if(!bookingId) return <div>No bookingId</div>
//   const [isProcessing, setIsProcessing] = useState(false);

//   const [booking,setBooking] = useState<CancelledBookingDetailsWithUserAndPackageDetailsDto>()
//   // const processMutation = useProcessCancellationbooking!();
//   const {data,isLoading} = useGetCancellationBookingDetails(bookingId);

//   console.log(data)

//   useEffect(() =>{
//   if(data) setBooking(data?.data);
//   },[data,bookingId])

//   const formatDate = (dateString: Date | string | undefined): string => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const formatCurrency = (amount: number | undefined): string => {
//     if (!amount) return "₹0";
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//     }).format(amount);
//   };

//   const getStatusBadge = (status: string) => {
//     const variants = {
//       pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
//       confirmed: "bg-blue-100 text-blue-700 border-blue-200",
//       cancelled: "bg-red-100 text-red-700 border-red-200",
//       completed: "bg-green-100 text-green-700 border-green-200",
//     };

//     return (
//       <Badge className={cn("px-3 py-1 rounded-full text-sm font-semibold border", variants[status.toLowerCase() as keyof typeof variants] || "bg-gray-100 text-gray-700")}>
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </Badge>
//     );
//   };

//   // const handleApproveRefund = async () => {
//   //   setIsProcessing(true);
//   //   try {
//   //     await processMutation.mutateAsync({
//   //       booking!Id: booking!._id,
//   //       payload: {
//   //         status: 'approve',
//   //       },
//   //     });
//   //     onProcessed();
//   //   } catch (error) {
//   //     console.error("Failed to process refund:", error);
//   //   } finally {
//   //     setIsProcessing(false);
//   //   }
//   // };

//   const isRefundPending = booking!.status === 'cancelled' && !booking!.cancellationRequest?.approvedAt;
//   const isRefundApproved = booking!?.cancellationRequest?.approvedAt;

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: -20 }}
//       className="lg:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50"
//     >
//       <div className="space-y-6 max-w-7xl mx-auto">
//         {/* Header */}
//         <Card className="border-[#2CA4BC]/20 shadow-lg">
//           <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#2CA4BC]/5">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <div className="flex items-center gap-4">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={onBack}
//                   className="text-[#2CA4BC] hover:bg-[#2CA4BC]/10"
//                 >
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Back
//                 </Button>
//                 <div>
//                   <CardTitle className="text-[#1a5f6b] flex items-center gap-3 flex-wrap">
//                     <AlertCircle className="w-6 h-6" />
//                     <span>Cancellation Details</span>
//                   </CardTitle>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Booking ID: <span className="font-mono font-semibold">{booking!.bookingId}</span>
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 flex-wrap">
//                 {getStatusBadge(booking!.status)}
//                 {booking!.isWaitlisted && (
//                   <Badge className="bg-purple-100 text-purple-700 border-purple-200">
//                     Waitlisted
//                   </Badge>
//                 )}
//                 {isRefundPending && (
//                   <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
//                     Refund Pending
//                   </Badge>
//                 )}
//                 {isRefundApproved && (
//                   <Badge className="bg-green-100 text-green-700 border-green-200">
//                     Refund Approved
//                   </Badge>
//                 )}
//               </div>
//             </div>
//           </CardHeader>
//         </Card>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Customer Information */}
//             <Card className="border-[#2CA4BC]/20 shadow-md">
//               <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/5 to-transparent">
//                 <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
//                   <User className="w-5 h-5" />
//                   Customer Information
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="pt-6">
//                 <div className="flex items-start gap-4">
//                   <Avatar className="h-16 w-16 border-2 border-[#2CA4BC]/20">
//                     <AvatarImage src={booking!.user?.email} alt={booking!.user?.firstName} />
//                     <AvatarFallback className="bg-gradient-to-br from-[#2CA4BC] to-[#1a5f6b] text-white text-lg font-semibold">
//                       {booking!.user?.firstName?.[0]}
//                       {booking!.user?.lastName?.[0]}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1 space-y-3">
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-900">
//                         {booking!.user?.firstName} {booking!.user?.lastName}
//                       </h3>
//                       <p className="text-sm text-gray-500">
//                         <span className="font-medium">Gender:</span> {booking!.user?.gender}
//                       </p>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                       <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg p-2">
//                         <Mail className="w-4 h-4 text-[#2CA4BC] flex-shrink-0" />
//                         <span className="text-gray-700 truncate">{booking!.user?.email}</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg p-2">
//                         <Phone className="w-4 h-4 text-[#2CA4BC] flex-shrink-0" />
//                         <span className="text-gray-700">{booking!.user?.phone}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Package Details */}
//             <Card className="border-[#2CA4BC]/20 shadow-md">
//               <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/5 to-transparent">
//                 <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
//                   <Package className="w-5 h-5" />
//                   Package Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="pt-6">
//                 <div className="space-y-4">
//                   <div className="bg-gradient-to-r from-[#2CA4BC]/10 to-transparent rounded-lg p-4">
//                     <h4 className="text-lg font-bold text-gray-900 mb-1">
//                       {booking!.package?.packageName || booking!.package?.title}
//                     </h4>
//                     <p className="text-sm text-gray-600">
//                       Package ID: <span className="font-mono">{booking!.package?.packageId || booking!.packageId}</span>
//                     </p>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="bg-gray-50 rounded-lg p-4 space-y-1">
//                       <div className="flex items-center gap-2 text-[#2CA4BC] mb-2">
//                         <Calendar className="w-4 h-4" />
//                         <span className="text-sm font-semibold">Start Date</span>
//                       </div>
//                       <p className="text-gray-900 font-medium">{formatDate(booking!.package?.startDate)}</p>
//                     </div>
                    
//                     <div className="bg-gray-50 rounded-lg p-4 space-y-1">
//                       <div className="flex items-center gap-2 text-[#2CA4BC] mb-2">
//                         <CalendarClock className="w-4 h-4" />
//                         <span className="text-sm font-semibold">End Date</span>
//                       </div>
//                       <p className="text-gray-900 font-medium">{formatDate(booking!.package?.endDate)}</p>
//                     </div>

//                     <div className="bg-gray-50 rounded-lg p-4 space-y-1">
//                       <div className="flex items-center gap-2 text-[#2CA4BC] mb-2">
//                         <DollarSign className="w-4 h-4" />
//                         <span className="text-sm font-semibold">Package Price</span>
//                       </div>
//                       <p className="text-gray-900 font-bold text-lg">{formatCurrency(booking!.package?.price)}</p>
//                     </div>

//                     <div className="bg-gray-50 rounded-lg p-4 space-y-1">
//                       <div className="flex items-center gap-2 text-red-500 mb-2">
//                         <Clock className="w-4 h-4" />
//                         <span className="text-sm font-semibold">Cancelled On</span>
//                       </div>
//                       <p className="text-gray-900 font-medium">{formatDate(booking!.cancelledAt)}</p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Payment Details */}
//             <Card className="border-[#2CA4BC]/20 shadow-md">
//               <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/5 to-transparent">
//                 <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
//                   <CreditCard className="w-5 h-5" />
//                   Payment Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="pt-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Advance Payment */}
//                   {booking!.advancePayment && (
//                     <div className={cn(
//                       "rounded-lg p-4 border-2",
//                       booking!.advancePayment.paid 
//                         ? "bg-green-50 border-green-200" 
//                         : "bg-yellow-50 border-yellow-200"
//                     )}>
//                       <div className="flex items-center justify-between mb-3">
//                         <h4 className="font-semibold text-gray-900">Advance Payment</h4>
//                         <Badge className={booking!.advancePayment.paid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
//                           {booking!.advancePayment.paid ? "Paid" : "Pending"}
//                         </Badge>
//                       </div>
//                       <div className="space-y-2">
//                         <div className="flex justify-between text-sm">
//                           <span className="text-gray-600">Amount:</span>
//                           <span className="font-bold text-gray-900">{formatCurrency(booking!.advancePayment.amount)}</span>
//                         </div>
//                         <div className="flex justify-between text-sm">
//                           <span className="text-gray-600">Due Date:</span>
//                           <span className="font-medium text-gray-700">{formatDate(booking!.advancePayment.dueDate)}</span>
//                         </div>
//                         {booking!.advancePayment.paidAt && (
//                           <div className="flex justify-between text-sm">
//                             <span className="text-gray-600">Paid On:</span>
//                             <span className="font-medium text-gray-700">{formatDate(booking!.advancePayment.paidAt)}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Full Payment */}
//                   {booking!.fullPayment && (
//                     <div className={cn(
//                       "rounded-lg p-4 border-2",
//                       booking!.fullPayment.paid 
//                         ? "bg-green-50 border-green-200" 
//                         : "bg-yellow-50 border-yellow-200"
//                     )}>
//                       <div className="flex items-center justify-between mb-3">
//                         <h4 className="font-semibold text-gray-900">Full Payment</h4>
//                         <Badge className={booking!.fullPayment.paid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
//                           {booking!.fullPayment.paid ? "Paid" : "Pending"}
//                         </Badge>
//                       </div>
//                       <div className="space-y-2">
//                         <div className="flex justify-between text-sm">
//                           <span className="text-gray-600">Amount:</span>
//                           <span className="font-bold text-gray-900">{formatCurrency(booking!.fullPayment.amount)}</span>
//                         </div>
//                         {booking!.fullPayment.dueDate && (
//                           <div className="flex justify-between text-sm">
//                             <span className="text-gray-600">Due Date:</span>
//                             <span className="font-medium text-gray-700">{formatDate(booking!.fullPayment.dueDate)}</span>
//                           </div>
//                         )}
//                         {booking!.fullPayment.paidAt && (
//                           <div className="flex justify-between text-sm">
//                             <span className="text-gray-600">Paid On:</span>
//                             <span className="font-medium text-gray-700">{formatDate(booking!.fullPayment.paidAt)}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Cancellation Reason */}
//             {booking!.cancellationRequest!?.reason && (
//               <Card className="border-[#2CA4BC]/20 shadow-md">
//                 <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/5 to-transparent">
//                   <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
//                     <MessageSquare className="w-5 h-5" />
//                     Cancellation Reason
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="pt-6">
//                   <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
//                     <p className="text-gray-800 leading-relaxed">{booking!.cancellationRequest!.reason}</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Refund Summary */}
//             <Card className="border-[#2CA4BC]/20 shadow-md sticky top-6">
//               <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-50">
//                 <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
//                   <Wallet className="w-5 h-5" />
//                   Refund Summary
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="pt-6 space-y-6">
//                 <div className="text-center">
//                   <div className="text-4xl font-bold text-green-600 mb-2">
//                     {formatCurrency(booking!.cancellationRequest!?.calculatedRefund)}
//                   </div>
//                   <p className="text-sm text-gray-600 font-medium">Calculated Refund Amount</p>
//                 </div>
                
//                 <div className="space-y-3 text-sm border-t pt-4">
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Package Price:</span>
//                     <span className="font-semibold">{formatCurrency(booking!.package?.price)}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Deductions:</span>
//                     <span className="font-semibold text-red-600">
//                       -{formatCurrency((booking!.package?.price || 0) - (booking!.cancellationRequest!?.calculatedRefund || 0))}
//                     </span>
//                   </div>
//                   <hr className="border-gray-200" />
//                   <div className="flex justify-between items-center font-bold text-base">
//                     <span>Final Refund:</span>
//                     <span className="text-green-600">{formatCurrency(booking!.cancellationRequest!?.calculatedRefund)}</span>
//                   </div>
//                 </div>

//                 {/* booking! Timeline */}
//                 <div className="border-t pt-4 space-y-3">
//                   <h4 className="font-semibold text-gray-900 flex items-center gap-2">
//                     <Clock className="w-4 h-4 text-[#2CA4BC]" />
//                     Timeline
//                   </h4>
                  
//                   {booking!.cancellationRequest!?.requestedAt && (
//                     <div className="flex items-start gap-3">
//                       <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium text-gray-900">booking! Submitted</p>
//                         <p className="text-xs text-gray-500">{formatDate(booking!.cancellationRequest.requestedAt)}</p>
//                       </div>
//                     </div>
//                   )}
                  
//                   {booking!.cancellationRequest!?.approvedAt && (
//                     <div className="flex items-start gap-3">
//                       <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium text-gray-900">Refund Approved</p>
//                         <p className="text-xs text-gray-500">{formatDate(booking!.cancellationRequest!.approvedAt)}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Action Button */}
//                 {isRefundPending && (
//                   <div className="border-t pt-4">
//                     <Button
//                       // onClick={handleApproveRefund}
//                       disabled={isProcessing}
//                       className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 text-base shadow-lg"
//                     >
//                       <CheckCircle className="w-5 h-5 mr-2" />
//                       {isProcessing ? 'Processing Refund...' : 'Approve Refund'}
//                     </Button>
//                     <p className="text-xs text-gray-500 text-center mt-3">
//                       This will process the refund to customer's account
//                     </p>
//                   </div>
//                 )}

//                 {isRefundApproved && (
//                   <div className="border-t pt-4">
//                     <div className="bg-green-50 rounded-lg p-4 text-center">
//                       <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
//                       <p className="text-sm font-semibold text-green-700">Refund Approved</p>
//                       <p className="text-xs text-green-600 mt-1">
//                         Processed on {formatDate(booking!.cancellationRequest!?.approvedAt)}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Calendar,
  Package,
  Mail,
  Clock,
  AlertCircle,
  DollarSign,
  MessageSquare,
  CreditCard,
  CalendarClock,
  Wallet,
  Phone,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { CancelledBookingDetailsWithUserAndPackageDetailsDto } from "@/types/cancellationType";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCancellationBookingDetails, useVerifyCancellationRequestMutation } from "@/hooks/vendor/useCancellationRequests";
import toast from "react-hot-toast";




export default function CancellationbookingView() {
  const params = useParams();
  const bookingId = (params as any)?.bookingId ?? (params as any)?.id ?? (params as any)?.booking_id ?? "";
  
  const [booking, setBooking] = useState<CancelledBookingDetailsWithUserAndPackageDetailsDto | null>(null);
  const navigate = useNavigate();
  
  const { data, isLoading, error } = useGetCancellationBookingDetails(bookingId);
  const {mutate : verifyCancellation,isPending} = useVerifyCancellationRequestMutation()

  useEffect(() => {
    if (data) {
      setBooking(data?.data);
    }
  }, [data]);


  const onProcessed = () =>{
     verifyCancellation(bookingId,{
      onSuccess : (response) =>{
        toast.success(response.message);
      },
      onError : (error : any) =>{
        toast.error(error?.response.data.message || "Failed to approve")
      }
     })
  }

  const onBack = () =>{
    navigate('/vendor/bookings/cancellations')
  }

  const formatDate = (dateString: Date | string | undefined): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number | undefined): string => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-700 border-blue-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
      completed: "bg-green-100 text-green-700 border-green-200",
    };

    return (
      <Badge className={cn("px-3 py-1 rounded-full text-sm font-semibold border", variants[status.toLowerCase() as keyof typeof variants] || "bg-gray-100 text-gray-700")}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Show loading state
  if (isLoading || !booking) {
    return (
      <div className="lg:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#2CA4BC] mx-auto mb-4" />
            <p className="text-gray-600">Loading cancellation details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !bookingId) {
    return (
      <div className="lg:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              {!bookingId ? "No Booking ID" : "Error Loading Details"}
            </h3>
            <p className="text-red-600 mb-4">
              {!bookingId 
                ? "Booking ID is missing from the URL" 
                : "Failed to load cancellation details. Please try again."}
            </p>
            <Button onClick={onBack} variant="outline">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isRefundPending = booking.status === 'cancellation_requested' && !booking.cancellationRequest?.approvedAt;
  const isRefundApproved = booking.cancellationRequest?.approvedAt;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="lg:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50"
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <Card className="border-[#2CA4BC]/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#2CA4BC]/5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="text-[#2CA4BC] hover:bg-[#2CA4BC]/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div>
                  <CardTitle className="text-[#1a5f6b] flex items-center gap-3 flex-wrap">
                    <AlertCircle className="w-6 h-6" />
                    <span>Cancellation Details</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Booking ID: <span className="font-mono font-semibold">{booking.bookingId}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {getStatusBadge(booking.status)}
                {booking.isWaitlisted && (
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                    Waitlisted
                  </Badge>
                )}
                {isRefundPending && (
                  <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                    Refund Pending
                  </Badge>
                )}
                {isRefundApproved && (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Refund Approved
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card className="border-[#2CA4BC]/20 shadow-md">
              <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/5 to-transparent">
                <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border-2 border-[#2CA4BC]/20">
                    <AvatarImage src={booking.user?.email} alt={booking.user?.firstName} />
                    <AvatarFallback className="bg-gradient-to-br from-[#2CA4BC] to-[#1a5f6b] text-white text-lg font-semibold">
                      {booking.user?.firstName?.[0]}
                      {booking.user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {booking.user?.firstName} {booking.user?.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Gender:</span> {booking.user?.gender}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg p-2">
                        <Mail className="w-4 h-4 text-[#2CA4BC] flex-shrink-0" />
                        <span className="text-gray-700 truncate">{booking.user?.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg p-2">
                        <Phone className="w-4 h-4 text-[#2CA4BC] flex-shrink-0" />
                        <span className="text-gray-700">{booking.user?.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Package Details */}
            <Card className="border-[#2CA4BC]/20 shadow-md">
              <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/5 to-transparent">
                <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Package Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-[#2CA4BC]/10 to-transparent rounded-lg p-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      {booking.package?.packageName || booking.package?.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Package ID: <span className="font-mono">{booking.package?.packageId || booking.packageId}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                      <div className="flex items-center gap-2 text-[#2CA4BC] mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-semibold">Start Date</span>
                      </div>
                      <p className="text-gray-900 font-medium">{formatDate(booking.package?.startDate)}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                      <div className="flex items-center gap-2 text-[#2CA4BC] mb-2">
                        <CalendarClock className="w-4 h-4" />
                        <span className="text-sm font-semibold">End Date</span>
                      </div>
                      <p className="text-gray-900 font-medium">{formatDate(booking.package?.endDate)}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                      <div className="flex items-center gap-2 text-[#2CA4BC] mb-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm font-semibold">Package Price</span>
                      </div>
                      <p className="text-gray-900 font-bold text-lg">{formatCurrency(booking.package?.price)}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                      <div className="flex items-center gap-2 text-red-500 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-semibold">Cancelled On</span>
                      </div>
                      <p className="text-gray-900 font-medium">{formatDate(booking.cancellationRequest?.requestedAt)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card className="border-[#2CA4BC]/20 shadow-md">
              <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/5 to-transparent">
                <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Advance Payment */}
                  {booking.advancePayment && (
                    <div className={cn(
                      "rounded-lg p-4 border-2",
                      booking.advancePayment.paid 
                        ? "bg-green-50 border-green-200" 
                        : "bg-yellow-50 border-yellow-200"
                    )}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Advance Payment</h4>
                        <Badge className={booking.advancePayment.paid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                          {booking.advancePayment.paid ? "Paid" : "Pending"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-bold text-gray-900">{formatCurrency(booking.advancePayment.amount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Due Date:</span>
                          <span className="font-medium text-gray-700">{formatDate(booking.advancePayment.dueDate)}</span>
                        </div>
                        {booking.advancePayment.paidAt && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Paid On:</span>
                            <span className="font-medium text-gray-700">{formatDate(booking.advancePayment.paidAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Full Payment */}
                  {booking.fullPayment && (
                    <div className={cn(
                      "rounded-lg p-4 border-2",
                      booking.fullPayment.paid 
                        ? "bg-green-50 border-green-200" 
                        : "bg-yellow-50 border-yellow-200"
                    )}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Full Payment</h4>
                        <Badge className={booking.fullPayment.paid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                          {booking.fullPayment.paid ? "Paid" : "Pending"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-bold text-gray-900">{formatCurrency(booking.fullPayment.amount)}</span>
                        </div>
                        {booking.fullPayment.dueDate && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Due Date:</span>
                            <span className="font-medium text-gray-700">{formatDate(booking.fullPayment.dueDate)}</span>
                          </div>
                        )}
                        {booking.fullPayment.paidAt && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Paid On:</span>
                            <span className="font-medium text-gray-700">{formatDate(booking.fullPayment.paidAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cancellation Reason */}
            {booking.cancellationRequest?.reason && (
              <Card className="border-[#2CA4BC]/20 shadow-md">
                <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/5 to-transparent">
                  <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Cancellation Reason
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                    <p className="text-gray-800 leading-relaxed">{booking.cancellationRequest.reason}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Refund Summary */}
            <Card className="border-[#2CA4BC]/20 shadow-md sticky top-6">
              <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-50">
                <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Refund Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {formatCurrency(booking.cancellationRequest?.calculatedRefund)}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Calculated Refund Amount</p>
                </div>
                
                <div className="space-y-3 text-sm border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Package Price:</span>
                    <span className="font-semibold">{formatCurrency(booking.package?.price)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Deductions:</span>
                    <span className="font-semibold text-red-600">
                      -{formatCurrency((booking.package?.price || 0) - (booking.cancellationRequest?.calculatedRefund || 0))}
                    </span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center font-bold text-base">
                    <span>Final Refund:</span>
                    <span className="text-green-600">{formatCurrency(booking.cancellationRequest?.calculatedRefund)}</span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="border-t pt-4 space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#2CA4BC]" />
                    Timeline
                  </h4>
                  
                  {booking.cancellationRequest?.requestedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Request Submitted</p>
                        <p className="text-xs text-gray-500">{formatDate(booking.cancellationRequest.requestedAt)}</p>
                      </div>
                    </div>
                  )}
                  
                  {booking.cancellationRequest?.approvedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Refund Approved</p>
                        <p className="text-xs text-gray-500">{formatDate(booking.cancellationRequest.approvedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {isRefundPending && (
                  <div className="border-t pt-4">
                    <Button
                      onClick={onProcessed}
                      disabled={isPending}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 text-base shadow-lg"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {isPending ? 'Processing Refund...' : 'Approve Refund'}
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-3">
                      This will process the refund to customer's account
                    </p>
                  </div>
                )}

                {isRefundApproved && (
                  <div className="border-t pt-4">
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-green-700">Refund Approved</p>
                      <p className="text-xs text-green-600 mt-1">
                        Processed on {formatDate(booking.cancellationRequest?.approvedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}