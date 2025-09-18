// "use client";

// import type { AdvancePayment, FullPayment } from "@/types/bookingType";
// import { motion } from "framer-motion";
// import { CreditCard, CheckCircle, Clock } from "lucide-react";

// interface PaymentDetailsGridProps {
//   advancePayment: AdvancePayment | null;
//   fullPayment: FullPayment | null;
// }

// const formatDate = (date: string | Date | null | undefined) => {
//   if (!date) return "N/A";
//   const d = typeof date === "string" ? new Date(date) : date;
//   return d.toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// const formatCurrency = (amount: number) => {
//   return new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//   }).format(amount);
// };

// const PaymentCard = ({
//   title,
//   payment,
//   delay,
// }: {
//   title: string;
//   payment: AdvancePayment | FullPayment | null;
//   delay: number;
// }) => {
//   if (!payment) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay, duration: 0.5, ease: "easeOut" }}
//         className="bg-gray-50 border border-gray-200 rounded-xl p-6"
//       >
//         <h3 className="text-lg font-semibold text-gray-500 mb-2">{title}</h3>
//         <p className="text-gray-400">Not applicable</p>
//       </motion.div>
//     );
//   }

//   const isPaid = payment.paid;
//   const isOverdue =
//     !isPaid && payment.dueDate && new Date(payment.dueDate) < new Date();

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay, duration: 0.5, ease: "easeOut" }}
//       className={`border rounded-xl p-6 relative overflow-hidden ${
//         isPaid
//           ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
//           : isOverdue
//           ? "bg-gradient-to-br from-red-50 to-pink-50 border-red-200"
//           : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
//       }`}
//     >
//       {/* Status indicator */}
//       <div
//         className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
//           isPaid ? "bg-green-500" : isOverdue ? "bg-red-500" : "bg-blue-500"
//         }`}
//       />

//       <div className="flex items-start justify-between mb-4">
//         <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
//         <div
//           className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
//             isPaid
//               ? "bg-green-100 text-green-700"
//               : isOverdue
//               ? "bg-red-100 text-red-700"
//               : "bg-blue-100 text-blue-700"
//           }`}
//         >
//           {isPaid ? (
//             <CheckCircle className="w-4 h-4" />
//           ) : (
//             <Clock className="w-4 h-4" />
//           )}
//           {isPaid ? "Paid" : isOverdue ? "Overdue" : "Pending"}
//         </div>
//       </div>

//       <div className="space-y-3">
//         <div className="flex justify-between items-center">
//           <span className="text-gray-600">Amount:</span>
//           <span className="text-xl font-bold text-gray-800">
//             {formatCurrency(payment.amount)}
//           </span>
//         </div>

//         <div className="flex justify-between items-center">
//           <span className="text-gray-600">Due Date:</span>
//           <span
//             className={`font-medium ${
//               isOverdue && !isPaid ? "text-red-600" : "text-gray-800"
//             }`}
//           >
//             {formatDate(payment.dueDate)}
//           </span>
//         </div>

//         {isPaid && payment.paidAt && (
//           <div className="flex justify-between items-center">
//             <span className="text-gray-600">Paid At:</span>
//             <span className="font-medium text-green-600">
//               {formatDate(payment.paidAt)}
//             </span>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export function PaymentDetailsGrid({
//   advancePayment,
//   fullPayment,
// }: PaymentDetailsGridProps) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.3, duration: 0.6 }}
//       className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6"
//     >
//       <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//         <CreditCard className="h-6 w-6 text-[#2CA4BC]" />
//         Payment Information
//       </h2>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <PaymentCard
//           title="Advance Payment"
//           payment={advancePayment}
//           delay={0.5}
//         />
//         <PaymentCard title="Full Payment" payment={fullPayment} delay={0.6} />
//       </div>
//     </motion.div>
//   );
// }


"use client";

import type { AdvancePayment, FullPayment } from "@/types/bookingType";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle, Clock, ArrowRight, Wallet } from "lucide-react";

interface PaymentDetailsGridProps {
  advancePayment: AdvancePayment | null;
  fullPayment: FullPayment | null;
  onPayAdvance?: () => void;
  onPayRemaining?: () => void;
  isProcessingPayment?: boolean;
}

const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const PaymentCard = ({
  title,
  payment,
  delay,
  showPayButton,
  payButtonText,
  onPayClick,
  isProcessingPayment,
}: {
  title: string;
  payment: AdvancePayment | FullPayment | null;
  delay: number;
  showPayButton?: boolean;
  payButtonText?: string;
  onPayClick?: () => void;
  isProcessingPayment?: boolean;
}) => {
  if (!payment) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-2xl p-6 relative overflow-hidden"
      >
        {/* Decorative background pattern */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-100/50 to-transparent rounded-full -translate-y-6 translate-x-6"></div>
        
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-gray-500 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            {title}
          </h3>
          <p className="text-gray-400 font-medium">Not applicable</p>
        </div>
      </motion.div>
    );
  }

  const isPaid = payment.paid;
  const isOverdue =
    !isPaid && payment.dueDate && new Date(payment.dueDate) < new Date();

  const cardStyles = isPaid
    ? "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-200 shadow-green-100/50"
    : isOverdue
    ? "bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 border-red-200 shadow-red-100/50"
    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-blue-100/50";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={`border rounded-2xl p-6 relative overflow-hidden shadow-lg ${cardStyles}`}
    >
      {/* Decorative elements */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-8 translate-x-8 ${
        isPaid 
          ? "bg-gradient-to-br from-green-200/30 to-transparent" 
          : isOverdue 
          ? "bg-gradient-to-br from-red-200/30 to-transparent"
          : "bg-gradient-to-br from-blue-200/30 to-transparent"
      }`}></div>

      {/* Status indicator */}
      <div className={`absolute top-4 right-4 w-3 h-3 rounded-full shadow-sm ${
        isPaid ? "bg-green-500" : isOverdue ? "bg-red-500" : "bg-blue-500"
      }`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isPaid ? "bg-green-500" : isOverdue ? "bg-red-500" : "bg-blue-500"
            }`}></div>
            {title}
          </h3>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
            isPaid
              ? "bg-green-100 text-green-700 border border-green-200"
              : isOverdue
              ? "bg-red-100 text-red-700 border border-red-200"
              : "bg-blue-100 text-blue-700 border border-blue-200"
          }`}>
            {isPaid ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Clock className="w-4 h-4" />
            )}
            {isPaid ? "Paid" : isOverdue ? "Overdue" : "Pending"}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl border border-white/40">
            <span className="text-gray-600 font-medium">Amount:</span>
            <span className="text-2xl font-bold text-gray-800">
              {formatCurrency(payment.amount)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/40 rounded-xl">
            <span className="text-gray-600 font-medium">Due Date:</span>
            <span className={`font-semibold ${
              isOverdue && !isPaid ? "text-red-600" : "text-gray-800"
            }`}>
              {formatDate(payment.dueDate)}
            </span>
          </div>

          {isPaid && payment.paidAt && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="flex justify-between items-center p-3 bg-green-100/60 rounded-xl border border-green-200/50"
            >
              <span className="text-green-700 font-medium">Paid At:</span>
              <span className="font-semibold text-green-700">
                {formatDate(payment.paidAt)}
              </span>
            </motion.div>
          )}

          {/* Payment Button */}
          {showPayButton && onPayClick && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="pt-4 border-t border-white/40"
            >
              <button
                onClick={onPayClick}
                disabled={isProcessingPayment}
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                  isProcessingPayment
                    ? "bg-gray-400 cursor-not-allowed"
                    : isOverdue
                    ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-red-200"
                    : "bg-gradient-to-r from-[#2CA4BC] to-[#238A9F] hover:from-[#238A9F] hover:to-[#1f7a8a] shadow-teal-200"
                } disabled:transform-none disabled:shadow-none`}
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    <span className="text-sm sm:text-base">{payButtonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export function PaymentDetailsGrid({
  advancePayment,
  fullPayment,
  onPayAdvance,
  onPayRemaining,
  isProcessingPayment = false,
}: PaymentDetailsGridProps) {
  // Determine payment button logic
  const showAdvancePayButton = !!(advancePayment && !advancePayment.paid && onPayAdvance);
  const showRemainingPayButton = 
   !!( advancePayment?.paid && 
    fullPayment && 
    !fullPayment.paid && 
    onPayRemaining)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="bg-gradient-to-br from-white via-white to-blue-50/20 border border-gray-200/60 shadow-2xl rounded-3xl p-6 md:p-8 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#2CA4BC]/5 to-transparent rounded-full -translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-400/5 to-transparent rounded-full translate-x-12 translate-y-12"></div>

      <div className="relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-[#2CA4BC]/10 to-blue-400/10 rounded-2xl">
              <CreditCard className="h-6 w-6 text-[#2CA4BC]" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Payment Information
            </h2>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-[#2CA4BC] to-blue-400 rounded-full ml-12"></div>
        </motion.div>

        {/* Payment Cards Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
          <PaymentCard
            title="Advance Payment"
            payment={advancePayment}
            delay={0.5}
            showPayButton={showAdvancePayButton}
            payButtonText="Pay Advance"
            onPayClick={onPayAdvance}
            isProcessingPayment={isProcessingPayment}
          />
          <PaymentCard
            title="Full Payment"
            payment={fullPayment}
            delay={0.6}
            showPayButton={showRemainingPayButton}
            payButtonText="Pay Remaining Amount"
            onPayClick={onPayRemaining}
            isProcessingPayment={isProcessingPayment}
          />
        </div>

        {/* Payment Summary Footer */}
        {(advancePayment || fullPayment) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-8 p-4 md:p-6 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200/60"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">
                  {formatCurrency(
                    (advancePayment?.amount || 0) + (fullPayment?.amount || 0)
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
                  advancePayment?.paid && fullPayment?.paid
                    ? "bg-green-100 text-green-700"
                    : advancePayment?.paid
                    ? "bg-blue-100 text-blue-700"
                    : "bg-orange-100 text-orange-700"
                }`}>
                  {advancePayment?.paid && fullPayment?.paid
                    ? "Fully Paid"
                    : advancePayment?.paid
                    ? "Partially Paid"
                    : "Payment Pending"}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}