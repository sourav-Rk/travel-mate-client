// UpcomingBookingsTabs Component
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Loader,
  CheckCircle,
  Filter,
  Search,
} from 'lucide-react';
import type { LucideIcon } from "lucide-react";

import AppliedBookings from './AppliedBookings';
import ConfirmedBookings from './ConfirmedBookings';
import type { BookingListDTO } from '@/types/bookingType';
import Advance_Pending_Booking from './AdvancePendingBookings';
// import AdvancePaidBookings from './AdvancePaidBookings';
// import AdvancePendingBookings from './AdvancePendingBookings';



type status = 'applied'  | 'confirmed' | 'advance_paid' | 'advance_pending' | 'completed' | 'cancelled';

interface TabData {
  key: string;
  label: string;
  icon: LucideIcon;
  count: number;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  component: React.ComponentType<{ bookings: BookingListDTO[]; searchQuery: string }>;
}

interface UpcomingBookingsTabsProps {
  bookings?: BookingListDTO[];
}

const UpcomingBookingsTabs: React.FC<UpcomingBookingsTabsProps> = ({ bookings = [] }) => {
  const [activeTab, setActiveTab] = useState<string>('applied');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter bookings by status and search query
  const filterBookings = (status: string): BookingListDTO[] => {
    return bookings
      .filter(booking => booking.status === status)
      .filter(booking => 
        searchQuery === '' || 
        booking.package?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
  };

  const tabs: TabData[] = [
    {
      key: 'applied',
      label: 'Applied',
      icon: Clock,
      count: filterBookings('applied').length,
      color: 'blue',
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      component: AppliedBookings
    },
    {
      key: 'advance_pending',
      label: 'Advance_Pending',
      icon: Loader,
      count: filterBookings('advance_pending').length,
      color: 'orange',
      bgColor: 'bg-orange-500',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      component: Advance_Pending_Booking
    },
    {
      key: 'confirmed',
      label: 'Confirmed',
      icon: CheckCircle,
      count: filterBookings('confirmed').length,
      color: 'green',
      bgColor: 'bg-green-500',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
      component: ConfirmedBookings
    },
    // {
    //   key: 'advance_paid',
    //   label: 'Advance Paid',
    //   icon: CheckCircle,
    //   count: filterBookings('advance_paid').length,
    //   color: 'emerald',
    //   bgColor: 'bg-emerald-500',
    //   textColor: 'text-emerald-600',
    //   borderColor: 'border-emerald-200',
    //   component: AdvancePaidBookings
    // },
    // {
    //   key: 'advance_pending',
    //   label: 'Advance Pending',
    //   icon: AlertCircle,
    //   count: filterBookings('advance_pending').length,
    //   color: 'yellow',
    //   bgColor: 'bg-yellow-500',
    //   textColor: 'text-yellow-600',
    //   borderColor: 'border-yellow-200',
    //   component: AdvancePendingBookings
    // }
  ];

  const activeTabData = tabs.find(tab => tab.key === activeTab);
  const ActiveComponent = activeTabData?.component;
  const filteredBookings = filterBookings(activeTab);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              Upcoming Bookings
            </h2>
            <p className="text-gray-600">
              Manage and track your upcoming travel bookings
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 lg:min-w-96">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#2CA4BC]/20 focus:border-[#2CA4BC] transition-all duration-300"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-2 shadow-lg border border-white/20">
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex-1 min-w-32 px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium ${
                    isActive
                      ? `bg-gradient-to-r ${tab.bgColor} text-white shadow-lg shadow-${tab.color}-500/25`
                      : `text-gray-600 hover:bg-gray-50 hover:${tab.textColor}`
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.textColor} ${tab.key === 'pending' && isActive ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline truncate">{tab.label}</span>
                  <span className="sm:hidden truncate">{tab.label.split(' ')[0]}</span>
                  {tab.count > 0 && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-semibold min-w-5 h-5 flex items-center justify-center ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : `bg-${tab.color}-100 ${tab.textColor}`
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 rounded-xl border-2 border-white/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {ActiveComponent && (
            <ActiveComponent 
              bookings={filteredBookings} 
              searchQuery={searchQuery}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            {activeTabData && <activeTabData.icon className={`w-8 h-8 ${activeTabData.textColor}`} />}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No {activeTabData?.label.toLowerCase()} bookings found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchQuery 
              ? `No bookings match your search "${searchQuery}"`
              : `You don't have any ${activeTabData?.label.toLowerCase()} bookings at the moment.`
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default UpcomingBookingsTabs;