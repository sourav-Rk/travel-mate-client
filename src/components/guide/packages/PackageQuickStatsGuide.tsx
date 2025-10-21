"use client";

import { Calendar, Users, IndianRupee } from "lucide-react";
import type { TravelPackage } from "@/types/packageType";

interface PackageQuickStatsProps {
  packageData: TravelPackage;
}

export function PackageQuickStats({ packageData }: PackageQuickStatsProps) {
  const stats = [
    {
      icon: Calendar,
      label: "Duration",
      value: `${packageData.duration.days}D/${packageData.duration.nights}N`,
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Users,
      label: "Max Group",
      value: `${packageData.maxGroupSize}`,
      color: "from-green-500 to-green-600",
    },
    {
      icon: IndianRupee,
      label: "Price",
      value: `₹${packageData.price.toLocaleString()}`,
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Calendar,
      label: "start Date",
      value: new Date(packageData.startDate!).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: Calendar,
      label: "End Date",
      value: new Date(packageData.endDate!).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      color: "from-yellow-500 to-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="group relative bg-white border border-[#2CA4BC]/30 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
            />
            <div className="relative z-10">
              <Icon className="h-6 w-6 text-[#2CA4BC] mb-3 group-hover:scale-110 transition-transform duration-300" />
              <p className="text-xs text-gray-500 mb-1 font-medium">
                {stat.label}
              </p>
              <p className="text-sm font-bold text-[#1a5f6b] group-hover:text-[#2CA4BC] transition-colors duration-300">
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
