import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  DollarSign,
  Users,
  Hotel,
  Clock,
  CheckCircle,
  IndianRupee,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  Legend,
} from "recharts";

import { useVendorDashboardStats } from "@/hooks/vendor/useVendorDashboardStats";
import type {
  VendorDashboardStatsDto,
  VendorDashboardPeriod,
} from "@/types/api/vendor-dashboard";

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  prefix?: string;
}

const VendorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const [period, setPeriod] = useState<VendorDashboardPeriod>("monthly");
  const { data, isLoading, error, refetch } = useVendorDashboardStats({
    period,
  });
  const stats: VendorDashboardStatsDto | undefined = data?.dashboardStats;

  const bookingStatusData = stats
    ? [
        {
          name: "Completed",
          value: stats.bookingStatusDistribution["completed"] || 0,
          color: "#10B981",
        },
        {
          name: "Applied",
          value: stats.bookingStatusDistribution["applied"] || 0,
          color: "#3B82F6",
        },
        {
          name: "Cancelled",
          value: stats.bookingStatusDistribution["cancelled"] || 0,
          color: "#EF4444",
        },
      ]
    : [];

  const recentBookings = stats?.recentBookings || [];

  const revenueData = (stats?.revenueTrend || []).map((p) => ({
  date: p.date,              
  revenue: p.revenue,          
  adminCommission: p.adminCommission, 
  vendorShare: p.vendorShare, 
}));
  const revenueBreakdownData = (stats?.revenueBreakdownByPackage || [])
    .slice(0, 8)
    .map((p) => ({ name: p.packageName, value: p.revenue }));
  const profitVsCommissionData = (stats?.profitVsCommissionByTrip || []).slice(
    0,
    8
  );
  const paymentModeData = (stats?.paymentModeDistribution || []).map((d) => ({
    name: d.mode,
    value: d.amount,
  }));

  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    color,
    prefix = "",
  }) => (
    <motion.div
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">
        {prefix}
        {value}
      </h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">
          Failed to load dashboard.{" "}
          <button className="text-blue-600" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // datasets prepared above

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={stats?.totalRevenue?.toLocaleString() || 0}
          change={0}
          icon={IndianRupee}
          color="bg-green-500"
          prefix="₹"
        />
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          change={0}
          icon={Calendar}
          color="bg-blue-500"
        />
        <StatCard
          title="Confirmed Bookings"
          value={stats?.confirmedBookings || 0}
          change={0}
          icon={CheckCircle}
          color="bg-emerald-500"
        />
        <StatCard
          title="Cancelled Bookings"
          value={stats?.cancelledBookings || 0}
          change={0}
          icon={Clock}
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Packages"
          value={stats?.totalPackages || 0}
          change={0}
          icon={Hotel}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Travellers"
          value={stats?.totalTravellers || 0}
          change={0}
          icon={Users}
          color="bg-yellow-500"
        />
        <StatCard
          title="Vendor Revenue"
          value={stats?.totalVendorRevenue?.toLocaleString() || 0}
          change={0}
          icon={DollarSign}
          color="bg-teal-500"
          prefix="₹"
        />
        <StatCard
          title="Refunded Amount"
          value={stats?.totalRefundedAmount?.toLocaleString() || 0}
          change={0}
          icon={DollarSign}
          color="bg-rose-500"
          prefix="₹"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Revenue Overview</h3> 
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }}
                labelStyle={{ fontWeight: "bold", color: "#111" }}
                formatter={(value, name) => [`₹${Number(value).toFixed(2)}`, name]}
                labelFormatter={(label) => `Date: ${label}`}
              />

              <Legend />

              {/* Total Revenue */}
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAdmin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVendor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Total Revenue Area */}
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                fill="url(#colorRevenue)"
                strokeWidth={2}
                name="Total Revenue"
              />

              {/* Admin Commission Area */}
              <Area
                type="monotone"
                dataKey="adminCommission"
                stroke="#F59E0B"
                fill="url(#colorAdmin)"
                strokeWidth={2}
                name="Admin Commission"
              />

              {/* Vendor Share Area */}
              <Area
                type="monotone"
                dataKey="vendorShare"
                stroke="#10B981"
                fill="url(#colorVendor)"
                strokeWidth={2}
                name="Vendor Share"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Booking Status */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-4">Booking Status</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Revenue breakdown & Payment modes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue breakdown by package */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-4">
            Revenue Breakdown (Top Packages)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueBreakdownData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {revenueBreakdownData.map((entry, index) => (
                  <Cell
                    key={`rb-${index}`}
                    fill={
                      [
                        "#3B82F6",
                        "#10B981",
                        "#F59E0B",
                        "#EF4444",
                        "#8B5CF6",
                        "#06B6D4",
                        "#F43F5E",
                        "#84CC16",
                      ][index % 8]
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString()}`,
                  "Revenue",
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Payment mode distribution */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-4">
            Payment Mode Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentModeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {paymentModeData.map((entry, index) => (
                  <Cell
                    key={`pm-${index}`}
                    fill={
                      ["#EF4444","#10B981","#3B82F6", "#F59E0B"][index % 4]
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString()}`,
                  "Amount",
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Profit vs Commission */}
      <motion.div
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold mb-4">
          Profit vs Commission (Top Trips)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={profitVsCommissionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="tripName"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis />
            <Tooltip
              formatter={(value) => [
                `₹${Number(value).toLocaleString()}`,
                "Amount",
              ]}
            />
            <Legend />
            <Bar dataKey="vendorShare" name="Vendor Share" fill="#10B981" />
            <Bar
              dataKey="adminCommission"
              name="Admin Commission"
              fill="#F59E0B"
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Bookings */}
      <motion.div
        className="bg-white rounded-2xl shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Bookings</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-700">
                  Guest
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">
                  Trip
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">
                  Date
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">
                  Amount
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr
                  key={booking.bookingId}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users size={16} className="text-blue-600" />
                      </div>
                      <span className="font-medium">
                        {booking.travelerName}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{booking.tripName}</td>
                  <td className="p-4 text-gray-600">
                    {new Date(booking.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-medium">
                    ₹{booking.amount?.toLocaleString?.() || booking.amount}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status === "confirmed" ? (
                        <CheckCircle size={12} className="mr-1" />
                      ) : (
                        <Clock size={12} className="mr-1" />
                      )}
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="lg:ml-64">
          <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">Welcome back! Here's your business overview</p>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="period-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Period:
                </label>
                <select
                  id="period-filter"
                  value={period}
                  onChange={(e) =>
                    setPeriod(e.target.value as VendorDashboardPeriod)
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;
