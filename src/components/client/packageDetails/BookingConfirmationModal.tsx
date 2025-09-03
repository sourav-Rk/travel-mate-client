"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Users, CreditCard, X, AlertCircle } from "lucide-react";
import type { TravelPackage } from "@/types/packageType";


interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: TravelPackage | undefined;
  onConfirmBooking: () => void;
  isLoading?: boolean;
  mutationMessage: { type: "success" | "error" | null; content: string };
}

export default function BookingConfirmationModal({
  isOpen,
  onClose,
  packageData,
  onConfirmBooking,
  isLoading = false,
  mutationMessage,
}: BookingConfirmationModalProps) {
  const handleConfirmBooking = () => {
    onConfirmBooking();
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Date not specified";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!packageData) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Confirm Your Booking
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {/* Package Overview */}
            <Card className="border-[#2CA4BC]/20">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {packageData.packageName}
                    </h3>
                    <p className="text-gray-600 mb-3">{packageData.title}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-[#2CA4BC] text-white">
                        {packageData.category}
                      </Badge>
                      {packageData.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-[#2CA4BC] text-[#2CA4BC]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <img
                      src={packageData.images?.[0] || "/placeholder.svg"}
                      alt={packageData.packageName}
                      className="w-full md:w-32 h-24 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Trip Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Essential Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#2CA4BC]" />
                    Trip Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">
                      {packageData.duration.days}D/{packageData.duration.nights}
                      N
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-semibold">
                      {formatDate(packageData.startDate)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-semibold">
                      {formatDate(packageData.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Group Size:</span>
                    <span className="font-semibold">
                      Max {packageData.maxGroupSize} people
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#2CA4BC]" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Package Price:</span>
                    <span className="text-2xl font-bold text-[#2CA4BC]">
                      ₹{packageData.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">per person</div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-[#2CA4BC]">
                      ₹{packageData.price.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Inclusions Preview */}
            {packageData.inclusions && packageData.inclusions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#2CA4BC]" />
                    What's Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-2">
                    {packageData.inclusions
                      .slice(0, 6)
                      .map((inclusion, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="w-2 h-2 bg-[#2CA4BC] rounded-full"></div>
                          <span>{inclusion}</span>
                        </div>
                      ))}
                    {packageData.inclusions.length > 6 && (
                      <div className="text-sm text-gray-500 md:col-span-2">
                        +{packageData.inclusions.length - 6} more inclusions...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Important Notice */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Important:</p>
                    <p>
                      By confirming this booking, you agree to our terms and
                      conditions. You will receive a confirmation email with
                      payment instructions and further details about your trip.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-300 bg-transparent"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmBooking}
                className="flex-1 bg-[#2CA4BC] hover:bg-[#2CA4BC]/90 text-white"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {isLoading && (
        <div className="text-center py-4">
          <div className="w-6 h-6 border-2 border-[#2CA4BC] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Processing your booking...</p>
        </div>
      )}

      {mutationMessage.type === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">Error: {mutationMessage.content}</p>
          </div>
        </div>
      )}
    </>
  );
}
