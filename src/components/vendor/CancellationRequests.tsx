"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  IndianRupee,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CancellationRequestsTable } from "./CancellationRequestsTable";
import { CancellationRequestView } from "./CancellationRequestView";
import { useGetCancellationRequestStats } from "@/hooks/vendor/useCancellationRequests";
import type { CancellationRequestDto, CancellationRequestsListDto } from "@/types/cancellationType";

export function CancellationRequests() {
  const [selectedRequest, setSelectedRequest] = useState<CancellationRequestsListDto | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');

  const { data: statsData, isLoading: statsLoading } = useGetCancellationRequestStats();

  const handleViewDetails = (request: CancellationRequestsListDto) => {
    setSelectedRequest(request);
    setViewMode('details');
  };

  const handleBackToList = () => {
    setSelectedRequest(null);
    setViewMode('list');
  };

  const handleRequestProcessed = () => {
    // Refresh the list or go back to list
    setViewMode('list');
    setSelectedRequest(null);
  };

  const stats = statsData?.data;

  if (viewMode === 'details' && selectedRequest) {
    return (
      <CancellationRequestView
        request={selectedRequest}
        onBack={handleBackToList}
        onProcessed={handleRequestProcessed}
      />
    );
  }

  return (
    <div className="lg:ml-64">
      <div className="min-h-screen bg-gradient-to-br from-[#2CA4BC]/5 via-[#2CA4BC]/10 to-cyan-50 p-4 md:p-6 lg:p-8 pt-16 lg:pt-4">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1a5f6b] to-[#2CA4BC] bg-clip-text text-transparent">
              Cancellation Requests
            </h1>
            <p className="text-slate-600 text-sm md:text-base">
              Manage customer cancellation requests and refunds
            </p>
          </motion.div>

          {/* Stats Cards */}
          {!statsLoading && stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <Card className="border-[#2CA4BC]/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Requests</p>
                      <p className="text-2xl font-bold text-[#1a5f6b]">{stats.total}</p>
                    </div>
                    <div className="w-12 h-12 bg-[#2CA4BC]/10 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-[#2CA4BC]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Approved</p>
                      <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Rejected</p>
                      <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Total Refund Amount */}
          {!statsLoading && stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-[#2CA4BC]/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Financial Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <IndianRupee className="w-5 h-5 text-green-600" />
                        <span className="text-lg font-bold text-green-600">
                          {stats.totalRefundAmount.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-green-700">Total Refund Amount</p>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-lg font-bold text-blue-600">
                          {stats.approved}
                        </span>
                      </div>
                      <p className="text-sm text-blue-700">Approved Refunds</p>
                    </div>
                    
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-lg font-bold text-orange-600">
                          {stats.pending}
                        </span>
                      </div>
                      <p className="text-sm text-orange-700">Pending Approvals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Main Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CancellationRequestsTable onViewDetails={handleViewDetails} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

