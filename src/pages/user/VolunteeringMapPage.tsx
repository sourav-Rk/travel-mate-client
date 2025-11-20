import { MapContainer } from "@/components/map/MapContainer";
import { motion } from "framer-motion";
import { MapPin, Compass, Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function VolunteeringMapPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/50"
    >
      {/* Header Section */}
      <div className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/volunteer-posts")}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Posts
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-[#2CA4BC] to-[#1a5f6b] rounded-xl shadow-md">
                  <Compass className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                  Explore on Map
                </h1>
              </div>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
                Discover local guides and volunteer posts near you. Browse by location, search by area, or find guides within your preferred distance.
              </p>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
                <Users className="w-4 h-4 text-[#2CA4BC]" />
                <span className="text-xs sm:text-sm font-medium text-slate-700">
                  Guides
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-100">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="text-xs sm:text-sm font-medium text-slate-700">
                  Posts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <MapContainer />
      </div>
    </motion.div>
  );
}
