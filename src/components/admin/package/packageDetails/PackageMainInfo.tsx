"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Star, Clock, Calendar } from "lucide-react";

interface PackageMainInfoProps {
  packageName: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  duration: { days: number; nights: number };
  maxGroupSize: number;
  price: number;
  meetingPoint: string;
  status: string;
  startDate: Date;
  endDate: Date;
}

export function PackageMainInfo({
  packageName,
  title,
  description,
  category,
  tags,
  duration,
  maxGroupSize,
  price,
  meetingPoint,
  status,
  startDate,
  endDate,
}: PackageMainInfoProps) {
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="border-black shadow-2xl bg-white backdrop-blur-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-300"
              >
                {category}
              </Badge>
              <Badge
                variant="outline"
                className={
                  status === "active"
                    ? "bg-green-50 text-green-700 border-green-300"
                    : "bg-red-50 text-red-700 border-red-300"
                }
              >
                {status}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{packageName}</h1>
            <p className="text-lg text-gray-700">{title}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-3 rounded-lg bg-white border border-black">
              <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Duration</p>
              <p className="font-semibold text-gray-900 text-sm">
                {duration.days}D/{duration.nights}N
              </p>
            </div>

            <div className="text-center p-3 rounded-lg bg-white border border-black">
              <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Group Size</p>
              <p className="font-semibold text-gray-900 text-sm">
                Max {maxGroupSize}
              </p>
            </div>

            <div className="text-center p-3 rounded-lg bg-white border border-black">
              <MapPin className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Meeting Point</p>
              <p className="font-semibold text-gray-900 text-xs truncate">
                {meetingPoint}
              </p>
            </div>

            <div className="text-center p-3 rounded-lg bg-white border border-black">
              <Star className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Price</p>
              <p className="font-semibold text-gray-900 text-sm">
                ₹{price.toLocaleString()}
              </p>
            </div>

            <div className="text-center p-3 rounded-lg bg-white border border-black">
              <Calendar className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Start Date</p>
              <p className="font-semibold text-gray-900 text-xs">
                {formatDate(startDate)}
              </p>
            </div>

            <div className="text-center p-3 rounded-lg bg-white border border-black">
              <Calendar className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">End Date</p>
              <p className="font-semibold text-gray-900 text-xs">
                {formatDate(endDate)}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Highlights
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-300"
                  >
                    <Star className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
