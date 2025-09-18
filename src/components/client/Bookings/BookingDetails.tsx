import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  DollarSign,
} from 'lucide-react';

interface AdvancePayment {
  amount: number;
  dueDate:  Date|string;
  paid: boolean;
  paidAt?: string | Date;
}

interface FullPayment {
  amount: number;
  dueDate: string | Date;
  paid: boolean;
  paidAt?: string | Date;
}

interface BookingDetailsProps {
  _id: string;
  bookingId : string;
  packageId: string;
  userId: string;
  isWaitlisted: boolean;
  status: string;
  advancePayment: AdvancePayment | null;
  fullPayment: FullPayment | null;
}

const getStatusConfig = (status: string, isWaitlisted: boolean) => {
  if (isWaitlisted) {
    return {
      label: 'Waitlisted',
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Clock,
      bgGradient: 'from-amber-50 to-orange-50'
    };
  }

  switch (status.toLowerCase()) {
    case 'confirmed':
      return {
        label: 'Confirmed',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        bgGradient: 'from-green-50 to-emerald-50'
      };
    case 'pending':
      return {
        label: 'Pending',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Clock,
        bgGradient: 'from-blue-50 to-indigo-50'
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: AlertCircle,
        bgGradient: 'from-red-50 to-pink-50'
      };
    default:
      return {
        label: status,
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: Package,
        bgGradient: 'from-gray-50 to-slate-50'
      };
  }
};

const formatDate = (date: string | Date) => {
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
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

const PaymentCard: React.FC<{
  title: string;
  payment: AdvancePayment | FullPayment | null;
  delay: number;
}> = ({ title, payment, delay }) => {
  if (!payment) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5, ease: "easeOut" }}
        className="bg-gray-50 border border-gray-200 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-500 mb-2">{title}</h3>
        <p className="text-gray-400">Not applicable</p>
      </motion.div>
    );
  }

  const isPaid = payment.paid;
  const isOverdue = !isPaid && new Date(payment.dueDate) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={`border rounded-xl p-6 relative overflow-hidden ${
        isPaid 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
          : isOverdue
          ? 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200'
          : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
      }`}
    >
      {/* Status indicator */}
      <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
        isPaid ? 'bg-green-500' : isOverdue ? 'bg-red-500' : 'bg-blue-500'
      }`} />
      
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
          isPaid 
            ? 'bg-green-100 text-green-700' 
            : isOverdue
            ? 'bg-red-100 text-red-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {isPaid ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          {isPaid ? 'Paid' : isOverdue ? 'Overdue' : 'Pending'}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount:</span>
          <span className="text-xl font-bold text-gray-800">{formatCurrency(payment.amount)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Due Date:</span>
          <span className={`font-medium ${isOverdue && !isPaid ? 'text-red-600' : 'text-gray-800'}`}>
            {formatDate(payment.dueDate)}
          </span>
        </div>
        
        {isPaid && payment.paidAt && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Paid At:</span>
            <span className="font-medium text-green-600">{formatDate(payment.paidAt)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const BookingDetailsView: React.FC<BookingDetailsProps> = ({
  _id,
  bookingId,
  packageId,
  userId,
  isWaitlisted,
  status,
  advancePayment,
  fullPayment
}) => {
  const statusConfig = getStatusConfig(status, isWaitlisted);
  const StatusIcon = statusConfig.icon;

  const totalAmount = (advancePayment?.amount || 0) + (fullPayment?.amount || 0);
  const paidAmount = (advancePayment?.paid ? advancePayment.amount : 0) + 
                    (fullPayment?.paid ? fullPayment.amount : 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="lg:ml-64 p-4 md:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white border border-gray-200 shadow-xl rounded-2xl overflow-hidden"
        >
          <div className={`bg-gradient-to-r ${statusConfig.bgGradient} p-6 border-b border-gray-200`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Package className="h-8 w-8 text-blue-600" />
                  Booking Details
                </h1>
                <p className="text-gray-600 mt-1">Booking ID: {bookingId}</p>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig.color}`}>
                <StatusIcon className="w-5 h-5" />
                {statusConfig.label}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Paid Amount</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(paidAmount)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Amount</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(pendingAmount)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Package ID</p>
                <p className="text-sm font-bold text-gray-900 truncate">{packageId}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Payment Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-blue-600" />
            Payment Information
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PaymentCard 
              title="Advance Payment" 
              payment={advancePayment} 
              delay={0.5}
            />
            <PaymentCard 
              title="Full Payment" 
              payment={fullPayment} 
              delay={0.6}
            />
          </div>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-blue-600" />
            Additional Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">User ID:</span>
                <span className="font-medium text-gray-800 font-mono text-sm">{userId}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Booking Status:</span>
                <span className={`font-medium px-2 py-1 rounded text-sm ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Waitlist Status:</span>
                <span className={`font-medium px-2 py-1 rounded text-sm ${
                  isWaitlisted ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                }`}>
                  {isWaitlisted ? 'Waitlisted' : 'Confirmed Slot'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-medium text-gray-800 font-mono text-sm">{bookingId}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Progress</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round((paidAmount / totalAmount) * 100)}% Complete</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(paidAmount / totalAmount) * 100}%` }}
                transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-green-600 font-medium">Paid: {formatCurrency(paidAmount)}</span>
              <span className="text-amber-600 font-medium">Remaining: {formatCurrency(pendingAmount)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};