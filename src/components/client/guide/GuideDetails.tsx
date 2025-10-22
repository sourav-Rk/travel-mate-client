import React from 'react';
import { Phone, MessageCircle, MapPin, Award, Users, Languages } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { GuideDetailsForClientDto } from '@/types/api/client';
import { useNavigate } from 'react-router-dom';

interface GuideDetailsComponentProps {
  guide: GuideDetailsForClientDto;
  bookingId : string;
  onMessageGuide?: () => void;
  onCallGuide?: (phoneNumber: string) => void;
  className?: string;
}

const GuideDetailsComponent: React.FC<GuideDetailsComponentProps> = ({
  guide,
  bookingId,
  onMessageGuide,
  onCallGuide,
  className = "",
}) => {
  
  const navigate = useNavigate();

  const handleCall = (phoneNumber: string) => {
    if (onCallGuide) {
      onCallGuide(phoneNumber);
    } else {
      // Default behavior - open phone dialer
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const handleMessage = () => {
     navigate(`/pvt/guide-chat/${guide._id}/${bookingId}`)
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#2CA4BC] to-[#238A9F] rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 ml-96">Your Tour Guide</h1>
        </div>
        <p className="text-gray-600 ml-96">Connect with your assigned guide for this trip</p>
      </div>

      {/* Main Content Container - Aligned with Sidebar */}
      <div className="md:ml-80 md:pl-8">
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg border border-slate-200/60 max-w-4xl">
          {/* Simplified Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/20"></div>
          
          {/* Main Content */}
          <div className="relative z-10 p-4 sm:p-6 lg:p-8">
            {/* Guide Profile Section */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 mb-8">
              {/* Avatar Section */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 relative">
                  <Avatar className="w-full h-full border-3 border-white shadow-md">
                    <AvatarImage 
                      src={guide.profileImage || ""} 
                      alt={`${guide.firstName} ${guide.lastName}`}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-[#2CA4BC] to-[#238A9F] text-white text-xl sm:text-2xl font-bold">
                      {guide.firstName.charAt(0)}{guide.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Guide Badge */}
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2">
                    <Badge className="bg-[#2CA4BC] hover:bg-[#238A9F] text-white px-2 py-1 text-xs font-medium shadow-md">
                      <Award className="w-3 h-3 mr-1" />
                      Guide
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Guide Information */}
              <div className="flex-1 text-center lg:text-left w-full">
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {guide.firstName} {guide.lastName}
                  </h2>
                  <p className="text-[#2CA4BC] font-medium text-base sm:text-lg">Professional Tour Guide</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                  <div className="text-center p-3 bg-white rounded-lg border border-slate-200/50 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center justify-center mb-1">
                      <Award className="w-4 h-4 text-[#2CA4BC] mb-1 sm:mb-0 sm:mr-1" />
                      <span className="text-sm font-bold text-gray-900">{guide.yearOfExperience}</span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Years Exp.</p>
                  </div>
                  
                  <div className="text-center p-3 bg-white rounded-lg border border-slate-200/50 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center justify-center mb-1">
                      <Users className="w-4 h-4 text-blue-600 mb-1 sm:mb-0 sm:mr-1" />
                      <span className="text-sm font-bold text-gray-900">{guide.totalTrips}+</span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Trips Led</p>
                  </div>
                  
                  <div className="text-center p-3 bg-white rounded-lg border border-slate-200/50 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center justify-center mb-1">
                      <Languages className="w-4 h-4 text-green-600 mb-1 sm:mb-0 sm:mr-1" />
                      <span className="text-sm font-bold text-gray-900">{guide.languageSpoken.length}</span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Languages</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleMessage}
                    className="flex-1 bg-[#2CA4BC] hover:bg-[#238A9F] text-white px-4 sm:px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Message Guide
                  </Button>
                  
                  <Button
                    onClick={() => handleCall(guide.phone)}
                    variant="outline"
                    className="flex-1 border-2 border-[#2CA4BC] text-[#2CA4BC] hover:bg-[#2CA4BC] hover:text-white px-4 sm:px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Call Guide
                  </Button>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {guide.bio && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-1.5 h-6 bg-[#2CA4BC] rounded-full mr-3"></div>
                  About Your Guide
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-slate-200/50">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{guide.bio}</p>
                </div>
              </div>
            )}

            {/* Languages Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-1.5 h-6 bg-[#2CA4BC] rounded-full mr-3"></div>
                Languages Spoken
              </h3>
              <div className="flex flex-wrap gap-2">
                {guide.languageSpoken.map((language, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-blue-100 transition-colors duration-200"
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-slate-200/50">
                <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                  <Phone className="w-4 h-4 text-[#2CA4BC] mr-2" />
                  Primary Contact
                </h4>
                <p className="text-gray-700 font-medium text-sm sm:text-base">{guide.phone}</p>
              </div>
              
              {guide.alternatePhone && (
                <div className="bg-gray-50 rounded-lg p-4 border border-slate-200/50">
                  <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                    <Phone className="w-4 h-4 text-gray-600 mr-2" />
                    Alternate Contact
                  </h4>
                  <p className="text-gray-700 font-medium text-sm sm:text-base mb-2">{guide.alternatePhone}</p>
                  <Button
                    onClick={() => handleCall(guide.alternatePhone)}
                    variant="ghost"
                    size="sm"
                    className="text-[#2CA4BC] hover:text-[#238A9F] hover:bg-[#2CA4BC]/10 p-0 h-auto font-medium text-sm"
                  >
                    Call Alternate
                  </Button>
                </div>
              )}
            </div>

            {/* Support Note */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium text-center flex items-center justify-center flex-wrap">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Your guide will be available throughout your trip for assistance and support</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDetailsComponent;