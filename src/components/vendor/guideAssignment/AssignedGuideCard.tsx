import { useEffect, useState } from "react";
import {
  User,
  Phone,
  Globe,
  Award,
  Star,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { IGuide } from "@/types/User";
import { useGuideDetailsQuery } from "@/hooks/vendor/useGuide";



const AssignedGuideCard = ({id ,className=""}:{id : string;className : ""}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [guide,setGuide] = useState<IGuide>();

  const {data,} = useGuideDetailsQuery(id);

  useEffect(() => {
    if(data){
      setGuide(data.user)
    }
  },[data,id])

  const calculateAge = (dob: string) => {
    if (dob === "N/A") return "N/A";
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1;
      }
      return age;
    } catch {
      return "N/A";
    }
  };

  const getExperienceLevel = (years: number) => {
    if (years >= 10) return { level: "Expert", color: "text-purple-600", bg: "bg-purple-100" };
    if (years >= 5) return { level: "Senior", color: "text-blue-600", bg: "bg-blue-100" };
    if (years >= 2) return { level: "Experienced", color: "text-green-600", bg: "bg-green-100" };
    return { level: "Junior", color: "text-orange-600", bg: "bg-orange-100" };
  };

  const experience = getExperienceLevel(+guide?.yearOfExperience!);

  return (
    <div className={`relative ${className}`}>
      {/* Main Card */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/50"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2CA4BC]/10 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-full blur-xl"></div>

        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-[#2CA4BC] via-[#2CA4BC] to-[#238A9F] text-white p-6">
          {/* Decorative Elements */}
          <div className="absolute top-2 right-4 opacity-20">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-white/30"></div>
              <div className="w-2 h-2 rounded-full bg-white/20"></div>
              <div className="w-1 h-1 rounded-full bg-white/10"></div>
            </div>
          </div>

          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-6 h-6 border-2 border-white/30 rounded-full"></div>
            <div className="absolute bottom-4 right-6 w-4 h-4 border border-white/20 rotate-45"></div>
          </div>

          {/* Guide Info Header */}
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                <div className="relative p-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                  {guide?.profileImage  &&
                    <img
                      src={guide.profileImage}
                      alt={guide.firstName[0]}
                      className="h-16 w-16 object-cover rounded-full border-2 border-white/30"
                    />
                  }
                </div>
                {/* Status Indicator */}
                <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white shadow-lg ${
                  guide?.isAvailable ? 'bg-green-400' : 'bg-orange-400'
                }`}></div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  {guide?.firstName} {guide?.lastName || ""}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    <UserCheck className="h-3 w-3 mr-1" />
                    Your Guide
                  </Badge>
                  <Badge className={`${experience.bg} ${experience.color} border-0`}>
                    <Star className="h-3 w-3 mr-1" />
                    {experience.level}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <Badge
              className={`px-3 py-1.5 text-sm font-medium rounded-full border ${
                guide?.isAvailable
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-orange-100 text-orange-700 border-orange-200"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${
                  guide?.isAvailable ? "bg-green-500" : "bg-orange-500"
                }`}></div>
                {guide?.isAvailable ? "Available" : "On Trip"}
              </div>
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative p-6 space-y-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Experience */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Experience</p>
                  <p className="text-lg font-bold text-gray-900">{guide?.yearOfExperience} Years</p>
                </div>
              </div>
            </div>

            {/* Gender & Age */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Profile</p>
                  <p className="text-lg font-bold text-gray-900">
                    {guide?.gender}
                  </p>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Globe className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">Languages</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {guide?.languageSpoken.slice(0, 2).map((language, index) => (
                      <span key={index} className="text-sm font-semibold text-gray-900">
                        {language}{index < Math.min(guide?.languageSpoken.length - 1, 1) ? "," : ""}
                      </span>
                    ))}
                    {guide?.languageSpoken.length! > 2 && (
                      <span className="text-sm text-gray-500">+{guide?.languageSpoken.length! - 2}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              // onClick={() => onCall?.(guide!.phone)}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#2CA4BC] to-[#238A9F] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#2CA4BC]/30 hover:scale-[1.02] transition-all duration-300 group"
            >
              <Phone className="h-5 w-5 group-hover:animate-pulse" />
              <span>Call Guide</span>
            </button>
            
            <button
              // onClick={() => onMessage?.(guide._id!)}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-[#2CA4BC] text-[#2CA4BC] font-semibold rounded-xl hover:bg-[#2CA4BC] hover:text-white hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
            >
              <MessageCircle className="h-5 w-5 group-hover:animate-pulse" />
              <span>Message</span>
            </button>
          </div>

          {/* Expandable Details */}
          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-xl transition-colors duration-300 group"
            >
              <span className="font-semibold text-gray-900 group-hover:text-[#2CA4BC]">
                View Complete Profile
              </span>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500 group-hover:text-[#2CA4BC] transition-colors duration-300" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500 group-hover:text-[#2CA4BC] transition-colors duration-300" />
              )}
            </button>

            {isExpanded && (
              <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                {/* Contact Details */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#2CA4BC]" />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Email</p>
                      <p className="text-sm font-semibold text-gray-900">{guide?.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Primary Phone</p>
                      <p className="text-sm font-semibold text-gray-900">{guide?.phone}</p>
                    </div>
                    {guide?.alternatePhone && guide.alternatePhone !== "N/A" && (
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Alternate Phone</p>
                        <p className="text-sm font-semibold text-gray-900">{guide.alternatePhone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Date of Birth</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {guide?.dob.toString() !== "N/A" 
                          ? new Date(guide?.dob!).toLocaleDateString() 
                          : "Not provided"
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Languages Detailed */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-purple-600" />
                    Languages Spoken
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {guide?.languageSpoken.map((language, index) => (
                      <Badge
                        key={index}
                        className="bg-white text-purple-700 border border-purple-300 hover:bg-purple-100 transition-colors px-3 py-1 rounded-lg text-sm font-medium shadow-sm"
                      >
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                {/* {guide && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      About Your Guide
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{guide.bio}</p>
                  </div>
                )} */}

                {/* Documents */}
                {/* {guide.documents && guide.documents.length > 0 && (
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-orange-600" />
                      Verification Documents
                    </h4>
                    <div className="space-y-2">
                      {guide.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg">
                          <span className="text-sm font-medium text-gray-900">{doc.type}</span>
                          <Badge className={doc.s ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                            {doc.verified ? "Verified" : "Pending"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedGuideCard;