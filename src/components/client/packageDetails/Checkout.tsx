// "use client"

// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { CalendarDays, MapPin, Clock, Users, Shield, CreditCard, Star, Sparkles } from "lucide-react"
// import { useGetPackageDetailsQuery } from "@/hooks/client/useClientPackage"
// import { useParams } from "react-router-dom"
// import { useGetBookingDetailsClient } from "@/hooks/client/useBooking"
// import type { BookingDetailsDto } from "@/types/bookingType"
// import { usePayAdvanceAmount } from "@/hooks/client/usePayment"
// import toast from "react-hot-toast";
// import {loadStripe} from '@stripe/stripe-js'

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// interface CheckoutData {
//   _id: string
//   packageName: string
//   title: string
//   startDate: string
//   endDate: string
//   duration: {days : number,nights : number}
//   price: number
//   advanceAmount: number
//   MaxGroupSize: number
//   images: string[]
//   meetingPoint : string
// }

// export function Checkout() {
//   const { bookingId,packageId } = useParams<{ bookingId : string,packageId: string }>();
//   console.log(bookingId,"-->booking id kjoi")
//   if (!packageId) return <div>No PackageId</div>;
//   if (!bookingId) return <div>No Booking</div>;
//   const [isLoading, setIsLoading] = useState(false)
//   const [packageData, setPackageData] = useState<CheckoutData>();
//   const [bookingDetails,setBookingDetails] = useState<BookingDetailsDto>()
//   const { data } = useGetPackageDetailsQuery(packageId);
//   const { data: bookingData } = useGetBookingDetailsClient(bookingId);
//   const {mutate : payAdvanceAmount} = usePayAdvanceAmount()

//       useEffect(() => {
//         if (!packageId) return;
//         if (!data) return;
//         setPackageData(data.packages);
//       }, [packageId, data]);

//       useEffect(() => {
//     if (bookingData) {
//       setBookingDetails(bookingData.bookingDetails);
//       console.log(bookingData);
//     }
//   }, [bookingData]);

//   const handlePayment = async () => {
//      setIsLoading(true);
//      payAdvanceAmount({bookingId,amount : bookingData?.bookingDetails.advancePayment?.amount ?? 0},{
//       onSuccess : async (response) => {
//         toast.success(response.message);
//         const {sessionId} = response.data;
//         const stripe = await stripePromise;
//         console.log(stripe);
//         if(stripe){
//           await stripe.redirectToCheckout({sessionId : sessionId});
//         }

//         setIsLoading(false);
//       },
//       onError : (error : any) => {
//         toast.error(error?.response.data.message);
//         setIsLoading(false)
//       }
//      })
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     })
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//       <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
//           <div className="text-center mb-10 animate-in fade-in duration-700">
//         <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#2CA4BC] via-teal-600 to-cyan-500 bg-clip-text text-transparent">
//           Advance Payment for {packageData?.packageName}
//         </h1>
//         <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
//           Secure your spot by paying the advance amount today and get ready for an unforgettable journey!
//         </p>
//       </div>
//         <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
//           <div className="lg:col-span-3 space-y-6">
//             <Card className="overflow-hidden animate-in slide-in-from-left-5 duration-700 shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
//               <div className="relative">
//                 <img
//                   src={packageData?.images[0] || "/placeholder.svg"}
//                   alt={packageData?.packageName}
//                   className="w-full h-48 sm:h-64 lg:h-72 object-cover"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
//                 <div className="absolute bottom-4 left-4 right-4">
//                   <div className="flex items-center space-x-2 text-white">
//                     <Sparkles className="w-4 h-4" />
//                     <span className="text-sm font-medium">Premium Experience</span>
//                   </div>
//                 </div>
//               </div>
//               <CardHeader className="pb-4">
//                 <div className="space-y-3">
//                   <CardTitle className="text-2xl sm:text-3xl font-bold text-balance bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
//                     {packageData?.packageName}
//                   </CardTitle>
//                   <p className="text-slate-600 dark:text-slate-400 text-pretty leading-relaxed">
//                     {packageData?.title}
//                   </p>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
//                     <div className="w-10 h-10 bg-gradient-to-br from-[#2CA4BC] to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//                       <CalendarDays className="w-5 h-5 text-white" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-slate-900 dark:text-white">Start Date</p>
//                       <p className="text-sm text-slate-600 dark:text-slate-400">
//                         {formatDate(packageData?.startDate ?? "")}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
//                     <div className="w-10 h-10 bg-gradient-to-br from-[#2CA4BC] to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//                       <CalendarDays className="w-5 h-5 text-white" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-slate-900 dark:text-white">End Date</p>
//                       <p className="text-sm text-slate-600 dark:text-slate-400">{formatDate(packageData?.endDate ?? "")}</p>
//                     </div>
//                   </div>
//                   <div className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
//                     <div className="w-10 h-10 bg-gradient-to-br from-[#2CA4BC] to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//                       <Clock className="w-5 h-5 text-white" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-slate-900 dark:text-white">Duration</p>
//                       <p className="text-sm text-slate-600 dark:text-slate-400">{packageData?.duration.days} Days/{packageData?.duration.nights} Nights</p>
//                     </div>
//                   </div>
//                   <div className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
//                     <div className="w-10 h-10 bg-gradient-to-br from-[#2CA4BC] to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//                       <Users className="w-5 h-5 text-white" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-slate-900 dark:text-white">Group Size</p>
//                       <p className="text-sm text-slate-600 dark:text-slate-400">Max {packageData?.MaxGroupSize} people</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center space-x-4 p-5 bg-gradient-to-r from-[#2CA4BC]/10 via-teal-50/50 to-cyan-50/30 dark:from-[#2CA4BC]/20 dark:via-slate-800 dark:to-slate-800/50 rounded-xl border border-[#2CA4BC]/20 dark:border-[#2CA4BC]/30 shadow-sm">
//                   <div className="w-12 h-12 bg-gradient-to-br from-[#2CA4BC] to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
//                     <MapPin className="w-6 h-6 text-white"/>
//                   </div>
//                   <div>
//                       <p className="text-sm font-semibold text-slate-900 dark:text-white">Meeting Point</p>
//                       <p className="text-sm text-slate-600 dark:text-slate-400">{packageData?.meetingPoint} people</p>
//                     </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="animate-in slide-in-from-left-5 duration-1000 shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
//               <CardContent className="pt-6">
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
//                   <div className="group flex flex-col items-center space-y-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 hover:scale-105">
//                     <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
//                       <Shield className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-slate-900 dark:text-white">Secure Payment</p>
//                     </div>
//                   </div>
//                   <div className="group flex flex-col items-center space-y-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 hover:scale-105">
//                     <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
//                       <CreditCard className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-slate-900 dark:text-white">Money Back Guarantee</p>
//                       <p className="text-xs text-slate-500 dark:text-slate-400">100% refund policy</p>
//                     </div>
//                   </div>
//                   <div className="group flex flex-col items-center space-y-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 hover:scale-105">
//                     <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
//                       <Star className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-slate-900 dark:text-white">5000+ Happy Travelers</p>
//                       <p className="text-xs text-slate-500 dark:text-slate-400">Trusted worldwide</p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="lg:col-span-2 space-y-6">
//             <Card className="sticky top-24 animate-in slide-in-from-right-5 duration-700 shadow-2xl border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
//               <CardHeader className="pb-4">
//                 <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
//                   Payment Summary
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
//                     <span className="text-slate-600 dark:text-slate-400">Package Price</span>
//                     <span className="font-semibold text-lg text-slate-900 dark:text-white">
//                       ₹{packageData?.price.toLocaleString()}
//                     </span>
//                   </div>
//                   <Separator className="bg-slate-200 dark:bg-slate-700" />
//                   <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-[#2CA4BC]/10 to-teal-50/50 dark:from-[#2CA4BC]/20 dark:to-slate-800/50 border border-[#2CA4BC]/20">
//                     <div>
//                       <span className="text-slate-700 dark:text-slate-300 font-medium">Advance Amount</span>
//                       <p className="text-xs text-slate-500 dark:text-slate-400">(30% of total)</p>
//                     </div>
//                     <span className="font-bold text-xl text-[#2CA4BC]">
//                       ₹{Math.floor(bookingData?.bookingDetails.advancePayment?.amount ?? 0).toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 px-3">
//                     <span>Remaining Amount</span>
//                     <span>₹{Math.floor((packageData?.price ?? 0) - (bookingDetails?.advancePayment?.amount ?? 0)).toLocaleString()}</span>
//                   </div>
//                   <Separator className="bg-slate-200 dark:bg-slate-700" />
//                   <div className="flex justify-between text-xl font-bold p-3 rounded-lg bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-100 dark:to-white text-white dark:text-slate-900">
//                     <span>Pay Now</span>
//                     <span>₹{Math.floor(bookingDetails?.advancePayment?.amount ?? 0).toLocaleString()}</span>
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-5 rounded-xl border border-amber-200/50 dark:border-amber-800/50 shadow-sm">
//                   <div className="flex items-start space-x-3">
//                     <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
//                       <Sparkles className="w-4 h-4 text-white" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">Secure your spot!</p>
//                       <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
//                         Pay the remaining amount 7 days before departure. Free cancellation up to 48 hours.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <Button
//                   onClick={handlePayment}
//                   disabled={isLoading}
//                   className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#2CA4BC] to-teal-600 hover:from-[#2CA4BC]/90 hover:to-teal-600/90 text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl border-0 rounded-xl"
//                 >
//                   {isLoading ? (
//                     <div className="flex items-center space-x-3">
//                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                       <span>Processing Payment...</span>
//                     </div>
//                   ) : (
//                     <div className="flex items-center space-x-3">
//                       <CreditCard className="w-5 h-5" />
//                       <span>Pay Advance Amount</span>
//                     </div>
//                   )}
//                 </Button>

//                 <p className="text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed px-2">
//                   By proceeding, you agree to our terms and conditions.
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, MapPin, Clock, Users, Shield, CreditCard, Star, Sparkles, CheckCircle } from "lucide-react"
import { useGetPackageDetailsQuery } from "@/hooks/client/useClientPackage"
import { useParams } from "react-router-dom"
import { useGetBookingDetailsClient } from "@/hooks/client/useBooking"
import type { BookingDetailsDto } from "@/types/bookingType"
import { usePayAdvanceAmount, usePayFullAmount } from "@/hooks/client/usePayment"
import toast from "react-hot-toast";
import {loadStripe} from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface CheckoutData {
  _id: string
  packageName: string
  title: string
  startDate: string
  endDate: string
  duration: {days : number,nights : number}
  price: number
  advanceAmount: number
  MaxGroupSize: number
  images: string[]
  meetingPoint : string
}

interface PaymentStatus {
  isAdvancePaid: boolean
  isFullPaymentPaid: boolean
  needsAdvancePayment: boolean
  needsFullPayment: boolean
  paymentType: 'advance' | 'full'
  paymentAmount: number
}

export function Checkout() {
  const { bookingId, packageId } = useParams<{ bookingId : string, packageId: string }>();
  
  if (!packageId) return <div>No PackageId</div>;
  if (!bookingId) return <div>No Booking</div>;
  
  const [isLoading, setIsLoading] = useState(false)
  const [packageData, setPackageData] = useState<CheckoutData>();
  const [bookingDetails, setBookingDetails] = useState<BookingDetailsDto>()
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    isAdvancePaid: false,
    isFullPaymentPaid: false,
    needsAdvancePayment: false,
    needsFullPayment: false,
    paymentType: 'advance',
    paymentAmount: 0
  })

  const { data } = useGetPackageDetailsQuery(packageId);
  const { data: bookingData } = useGetBookingDetailsClient(bookingId);
  const { mutate: payAdvanceAmount } = usePayAdvanceAmount();
  const {mutate : payFullAmount} = usePayFullAmount();

  useEffect(() => {
    if (!packageId) return;
    if (!data) return;
    setPackageData(data.packages);
  }, [packageId, data]);

  useEffect(() => {
    if (bookingData) {
      setBookingDetails(bookingData.bookingDetails);
      
      // Determine payment status
      const booking = bookingData.bookingDetails;
      const isAdvancePaid = booking.advancePayment?.paid || false;
      const isFullPaymentPaid = booking.fullPayment?.paid || false;
      
      let needsAdvancePayment = !isAdvancePaid;
      let needsFullPayment = isAdvancePaid && !isFullPaymentPaid;
      
      // If both are paid, no payment needed
      if (isAdvancePaid && isFullPaymentPaid) {
        needsAdvancePayment = false;
        needsFullPayment = false;
      }
      
      const paymentType = needsAdvancePayment ? 'advance' : 'full';
      const paymentAmount = needsAdvancePayment 
        ? (booking.advancePayment?.amount || 0)
        : (booking.fullPayment?.amount || 0);

      setPaymentStatus({
        isAdvancePaid,
        isFullPaymentPaid,
        needsAdvancePayment,
        needsFullPayment,
        paymentType,
        paymentAmount
      });
    }
  }, [bookingData]);

  const handlePayment = async () => {
    setIsLoading(true);
    const amount = paymentStatus.paymentAmount;

    if(paymentStatus.paymentType === 'advance'){
        payAdvanceAmount({bookingId, amount}, {
        onSuccess: async (response) => {
          toast.success(response.message);
          const {sessionId} = response.data;
          const stripe = await stripePromise;
          
          if(stripe){
            await stripe.redirectToCheckout({sessionId});
          }
          setIsLoading(false);
        },
        onError: (error : any) => {
          toast.error(error?.response?.data?.message || 'Payment failed');
          setIsLoading(false)
        }
      })
    }else if(paymentStatus.paymentType === 'full'){
         payFullAmount({bookingId, amount}, {
        onSuccess: async (response) => {
          toast.success(response.message);
          const {sessionId} = response.data;
          const stripe = await stripePromise;
          
          if(stripe){
            await stripe.redirectToCheckout({sessionId});
          }
          setIsLoading(false);
        },
        onError: (error : any) => {
          toast.error(error?.response?.data?.message || 'Payment failed');
          setIsLoading(false)
        }
      })
    }
    
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getPaymentTitle = () => {
    if (paymentStatus.isAdvancePaid && paymentStatus.isFullPaymentPaid) {
      return "Payment Complete"
    }
    return paymentStatus.paymentType === 'advance' 
      ? `Advance Payment for ${packageData?.packageName}` 
      : `Final Payment for ${packageData?.packageName}`
  }

  const getPaymentDescription = () => {
    if (paymentStatus.isAdvancePaid && paymentStatus.isFullPaymentPaid) {
      return "All payments have been completed successfully. Get ready for your amazing journey!"
    }
    return paymentStatus.paymentType === 'advance' 
      ? "Secure your spot by paying the advance amount today and get ready for an unforgettable journey!"
      : "Complete your booking by paying the remaining amount to confirm your trip!"
  }

  const getRemainingAmount = () => {
    if (!packageData || !bookingDetails) return 0;
    
    if (paymentStatus.paymentType === 'advance') {
      return packageData.price - (bookingDetails.advancePayment?.amount || 0);
    } else {
      return 0; // No remaining amount for full payment
    }
  }

  const getButtonText = () => {
    if (paymentStatus.isAdvancePaid && paymentStatus.isFullPaymentPaid) {
      return "Payment Completed"
    }
    return paymentStatus.paymentType === 'advance' 
      ? "Pay Advance Amount" 
      : "Pay Final Amount"
  }

  const isPaymentCompleted = paymentStatus.isAdvancePaid && paymentStatus.isFullPaymentPaid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        <div className="text-center mb-6 sm:mb-10 animate-in fade-in duration-700">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#2CA4BC] via-teal-600 to-cyan-500 bg-clip-text text-transparent px-4">
            {getPaymentTitle()}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
            {getPaymentDescription()}
          </p>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-3 space-y-6">
            <Card className="overflow-hidden animate-in slide-in-from-left-5 duration-700 shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <div className="relative">
                <img
                  src={packageData?.images[0] || "/placeholder.svg"}
                  alt={packageData?.packageName}
                  className="w-full h-48 sm:h-64 lg:h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center space-x-2 text-white">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">Premium Experience</span>
                  </div>
                </div>
                {isPaymentCompleted && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      <span>Paid</span>
                    </div>
                  </div>
                )}
              </div>
              <CardHeader className="pb-4">
                <div className="space-y-3">
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-balance bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    {packageData?.packageName}
                  </CardTitle>
                  <p className="text-slate-600 dark:text-slate-400 text-pretty leading-relaxed text-sm sm:text-base">
                    {packageData?.title}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="group flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#2CA4BC] to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">Start Date</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 break-words">
                        {formatDate(packageData?.startDate ?? "")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="group flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#2CA4BC] to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">End Date</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 break-words">
                        {formatDate(packageData?.endDate ?? "")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="group flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#2CA4BC] to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">Duration</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        {packageData?.duration.days} Days/{packageData?.duration.nights} Nights
                      </p>
                    </div>
                  </div>
                  
                  <div className="group flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#2CA4BC] to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">Group Size</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Max {packageData?.MaxGroupSize} people</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-5 bg-gradient-to-r from-[#2CA4BC]/10 via-teal-50/50 to-cyan-50/30 dark:from-[#2CA4BC]/20 dark:via-slate-800 dark:to-slate-800/50 rounded-xl border border-[#2CA4BC]/20 dark:border-[#2CA4BC]/30 shadow-sm">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#2CA4BC] to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white"/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">Meeting Point</p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 break-words">
                      {packageData?.meetingPoint}
                    </p>
                  </div>
                </div>

                {/* Payment Status Indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${
                    paymentStatus.isAdvancePaid 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        paymentStatus.isAdvancePaid 
                          ? 'bg-green-500' 
                          : 'bg-amber-500'
                      }`}>
                        {paymentStatus.isAdvancePaid ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <CreditCard className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${
                          paymentStatus.isAdvancePaid 
                            ? 'text-green-800 dark:text-green-200' 
                            : 'text-amber-800 dark:text-amber-200'
                        }`}>
                          Advance Payment
                        </p>
                        <p className={`text-xs ${
                          paymentStatus.isAdvancePaid 
                            ? 'text-green-600 dark:text-green-300' 
                            : 'text-amber-600 dark:text-amber-300'
                        }`}>
                          {paymentStatus.isAdvancePaid ? 'Completed' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-xl border ${
                    paymentStatus.isFullPaymentPaid 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : bookingDetails?.fullPayment 
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        paymentStatus.isFullPaymentPaid 
                          ? 'bg-green-500' 
                          : bookingDetails?.fullPayment
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                      }`}>
                        {paymentStatus.isFullPaymentPaid ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <CreditCard className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${
                          paymentStatus.isFullPaymentPaid 
                            ? 'text-green-800 dark:text-green-200' 
                            : bookingDetails?.fullPayment
                              ? 'text-amber-800 dark:text-amber-200'
                              : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          Final Payment
                        </p>
                        <p className={`text-xs ${
                          paymentStatus.isFullPaymentPaid 
                            ? 'text-green-600 dark:text-green-300' 
                            : bookingDetails?.fullPayment
                              ? 'text-amber-600 dark:text-amber-300'
                              : 'text-slate-500 dark:text-slate-500'
                        }`}>
                          {paymentStatus.isFullPaymentPaid 
                            ? 'Completed' 
                            : bookingDetails?.fullPayment 
                              ? 'Pending'
                              : 'Not due yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-in slide-in-from-left-5 duration-1000 shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                  <div className="group flex flex-col items-center space-y-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 hover:scale-105">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Secure Payment</p>
                    </div>
                  </div>
                  <div className="group flex flex-col items-center space-y-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 hover:scale-105">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Money Back Guarantee</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">100% refund policy</p>
                    </div>
                  </div>
                  <div className="group flex flex-col items-center space-y-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 hover:scale-105">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">5000+ Happy Travelers</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Trusted worldwide</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="sticky top-4 sm:top-24 animate-in slide-in-from-right-5 duration-700 shadow-2xl border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Package Price</span>
                    <span className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white">
                      ₹{packageData?.price.toLocaleString()}
                    </span>
                  </div>
                  
                  {paymentStatus.isAdvancePaid && (
                    <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <div>
                        <span className="text-sm sm:text-base text-green-700 dark:text-green-300 font-medium">Advance Paid</span>
                        <p className="text-xs text-green-600 dark:text-green-400">✓ Completed</p>
                      </div>
                      <span className="font-semibold text-base sm:text-lg text-green-600">
                        ₹{Math.floor(bookingDetails?.advancePayment?.amount ?? 0).toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  <Separator className="bg-slate-200 dark:bg-slate-700" />
                  
                  {!isPaymentCompleted && (
                    <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-[#2CA4BC]/10 to-teal-50/50 dark:from-[#2CA4BC]/20 dark:to-slate-800/50 border border-[#2CA4BC]/20">
                      <div>
                        <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium">
                          {paymentStatus.paymentType === 'advance' ? 'Advance Amount' : 'Final Amount'}
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {paymentStatus.paymentType === 'advance' ? '(30% of total)' : '(Remaining amount)'}
                        </p>
                      </div>
                      <span className="font-bold text-lg sm:text-xl text-[#2CA4BC]">
                        ₹{Math.floor(paymentStatus.paymentAmount).toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  {paymentStatus.paymentType === 'advance' && getRemainingAmount() > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400 px-3">
                      <span>Remaining Amount</span>
                      <span>₹{Math.floor(getRemainingAmount()).toLocaleString()}</span>
                    </div>
                  )}
                  
                  <Separator className="bg-slate-200 dark:bg-slate-700" />
                  
                  {isPaymentCompleted ? (
                    <div className="flex justify-between text-lg sm:text-xl font-bold p-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white">
                      <span>Total Paid</span>
                      <span>₹{Math.floor(packageData?.price ?? 0).toLocaleString()}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-lg sm:text-xl font-bold p-3 rounded-lg bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-100 dark:to-white text-white dark:text-slate-900">
                      <span>Pay Now</span>
                      <span>₹{Math.floor(paymentStatus.paymentAmount).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {!isPaymentCompleted && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 sm:p-5 rounded-xl border border-amber-200/50 dark:border-amber-800/50 shadow-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                          {paymentStatus.paymentType === 'advance' ? 'Secure your spot!' : 'Complete your booking!'}
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                          {paymentStatus.paymentType === 'advance' 
                            ? 'Pay the remaining amount 7 days before departure. Free cancellation up to 48 hours.'
                            : 'Final payment to confirm your trip. Safe travels await!'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isPaymentCompleted ? (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 sm:p-5 rounded-xl border border-green-200/50 dark:border-green-800/50 shadow-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-green-800 dark:text-green-200 mb-1">
                          Payment Complete!
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed">
                          Your booking is confirmed. Check your email for trip details and itinerary.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-gradient-to-r from-[#2CA4BC] to-teal-600 hover:from-[#2CA4BC]/90 hover:to-teal-600/90 text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl border-0 rounded-xl"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing Payment...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>{getButtonText()}</span>
                      </div>
                    )}
                  </Button>
                )}

                <p className="text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed px-2">
                  By proceeding, you agree to our terms and conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}