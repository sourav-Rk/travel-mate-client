import React from 'react';

interface CancellationRequest {
  requestedAt: string;
  reason: string;
  calculatedRefund: number;
  approvedAt?: string;
}

interface CancellationDetailsProps {
  status: string;
  cancelledAt?: string;
  refundAmount?: number;
  cancellationRequest?: CancellationRequest;
}

const CancellationDetails: React.FC<CancellationDetailsProps> = ({
  status,
  cancelledAt,
  refundAmount,
  cancellationRequest,
}) => {
  // Only show if status is cancelled or cancellation_requested
  if (status !== 'cancelled' && status !== 'cancellation_requested') {
    return null;
  }

  const isCancelled = status === 'cancelled';
  const isPending = status === 'cancellation_requested';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getReasonLabel = (reason: string) => {
    const reasonMap: Record<string, string> = {
      'schedule-conflict': 'Schedule Conflict',
      'personal-emergency': 'Personal Emergency',
      'weather-conditions': 'Weather Conditions',
      'health-issues': 'Health Issues',
      'other': 'Other',
    };
    return reasonMap[reason] || reason;
  };

  return (
    <div className="bg-white border-2 border-red-200 shadow-xl rounded-2xl overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-4 ${isCancelled ? 'bg-red-50' : 'bg-yellow-50'}`}>
        <div className="flex items-center gap-3">
          {isCancelled ? (
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          ) : (
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
          <div>
            <h2 className={`text-xl font-bold ${isCancelled ? 'text-red-900' : 'text-yellow-900'}`}>
              {isCancelled ? 'Booking Cancelled' : 'Cancellation Pending'}
            </h2>
            <p className={`text-sm ${isCancelled ? 'text-red-600' : 'text-yellow-600'}`}>
              {isCancelled ? 'Your booking has been cancelled' : 'Awaiting approval for cancellation'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Cancellation Request Info */}
        {cancellationRequest && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Cancellation Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Requested Date */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Requested On</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(cancellationRequest.requestedAt)}
                </p>
              </div>

              {/* Cancellation Reason */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Reason</p>
                <p className="font-semibold text-gray-900">
                  {getReasonLabel(cancellationRequest.reason)}
                </p>
              </div>

              {/* Calculated Refund */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-600 mb-1">Calculated Refund</p>
                <p className="font-bold text-xl text-blue-900">
                  {formatCurrency(cancellationRequest.calculatedRefund)}
                </p>
              </div>

              {/* Approved Date (if cancelled) */}
              {isCancelled && cancellationRequest.approvedAt && (
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <p className="text-sm text-green-600 mb-1">Approved On</p>
                  <p className="font-semibold text-green-900">
                    {formatDate(cancellationRequest.approvedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Refund Information (only for cancelled bookings) */}
        {isCancelled && refundAmount !== undefined && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
            <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-900">Refund Amount</h3>
                  <p className="text-3xl font-bold text-green-700 mt-1">
                    {formatCurrency(refundAmount)}
                  </p>
                </div>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg border border-green-300 self-start">
                <p className="text-xs text-green-600 font-medium">REFUND STATUS</p>
                <p className="text-sm font-bold text-green-700">Processing</p>
              </div>
            </div>
            <p className="text-sm text-green-700 mt-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Refund will be processed to your original payment method within 5-7 business days
            </p>
          </div>
        )}

        {/* Cancelled Date (only for cancelled bookings) */}
        {isCancelled && cancelledAt && (
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium text-gray-600">Cancellation Date</p>
            </div>
            <p className="font-semibold text-gray-900 ml-7">
              {formatDate(cancelledAt)}
            </p>
          </div>
        )}

        {/* Pending Status Message */}
        {isPending && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-yellow-900">Cancellation Under Review</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Your cancellation request is being reviewed by our team. You will be notified once it's processed. 
                  The refund amount shown is an estimate based on our cancellation policy.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancellationDetails;