// "use client"

// export default function LoginHero() {
//   return (
//     <div className="hidden lg:block space-y-6">
//       <div className="space-y-4">
//         <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
//           Travel Mate
//         </h1>
//         <p className="text-xl text-gray-600 leading-relaxed">
//           Welcome back, adventurer! Continue exploring amazing destinations and creating unforgettable memories around
//           the world.
//         </p>
//       </div>

//       <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
//         <img
//           src="/neom-eOWabmCNEdg-unsplash.jpg"
//           alt="Welcome back to Travel Mate"
//           className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
//         <div className="absolute bottom-6 left-6 text-white">
//           <h3 className="text-2xl font-semibold mb-2">Continue Your Journey</h3>
//           <p className="text-sm opacity-90">Your next adventure is just a click away</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-3 gap-4 pt-4">
//         <div className="text-center">
//           <div className="text-2xl font-bold text-blue-600">24/7</div>
//           <div className="text-sm text-gray-600">Support</div>
//         </div>
//         <div className="text-center">
//           <div className="text-2xl font-bold text-teal-600">100%</div>
//           <div className="text-sm text-gray-600">Secure</div>
//         </div>
//         <div className="text-center">
//           <div className="text-2xl font-bold text-green-600">5★</div>
//           <div className="text-sm text-gray-600">Rated Service</div>
//         </div>
//       </div>

//       {/* Recent Activity Preview */}
//       <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
//         <h4 className="font-semibold text-gray-800 mb-3">Recent Destinations</h4>
//         <div className="space-y-2">
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
//               <span className="text-white text-xs font-bold">🏔️</span>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-800">kulu manali</p>
//               <p className="text-xs text-gray-600">Mountain Adventure</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
//               <span className="text-white text-xs font-bold">🏖️</span>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-800">Goa</p>
//               <p className="text-xs text-gray-600">Beach Paradise</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
//               <span className="text-white text-xs font-bold">🌸</span>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-800">Rajasthan</p>
//               <p className="text-xs text-gray-600">Cultural Experience</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client";

import { useNavigate } from "react-router-dom";

interface LoginHeroProps {
  userType: "client" | "vendor" | "admin" | "guide";
}

export default function LoginHero({ userType }: LoginHeroProps) {
  // Conditional styling based on userType - aligned with login form
  const getThemeConfig = () => {
    switch (userType) {
      case "client":
        return {
          titleGradient: "from-blue-600 via-teal-600 to-green-600",
          welcomeText: "Welcome back, adventurer! Continue exploring amazing destinations and creating unforgettable memories around the world.",
          statsColors: ["text-blue-600", "text-teal-600", "text-green-600"],
          recentTitle: "Recent Destinations",
          recentItems: [
            { emoji: "🏔️", name: "Kulu Manali", type: "Mountain Adventure", gradient: "from-blue-400 to-blue-600" },
            { emoji: "🏖️", name: "Goa", type: "Beach Paradise", gradient: "from-teal-400 to-teal-600" },
            { emoji: "🌸", name: "Rajasthan", type: "Cultural Experience", gradient: "from-green-400 to-green-600" }
          ]
        };
      case "vendor":
        return {
          titleGradient: "from-purple-600 via-pink-600 to-violet-600",
          welcomeText: "Welcome back, partner! Continue managing your services and connecting with travelers worldwide.",
          statsColors: ["text-purple-600", "text-pink-600", "text-violet-600"],
          recentTitle: "Recent Services",
          recentItems: [
            { emoji: "🏨", name: "Hotel Bookings", type: "Accommodation", gradient: "from-purple-400 to-purple-600" },
            { emoji: "🚗", name: "Car Rentals", type: "Transportation", gradient: "from-pink-400 to-pink-600" },
            { emoji: "🎯", name: "Tour Packages", type: "Experience", gradient: "from-violet-400 to-violet-600" }
          ]
        };
      case "admin":
        return {
          titleGradient: "from-red-600 via-orange-600 to-yellow-600",
          welcomeText: "Welcome back, administrator! Continue overseeing the platform and ensuring smooth operations.",
          statsColors: ["text-red-600", "text-orange-600", "text-yellow-600"],
          recentTitle: "Recent Activities",
          recentItems: [
            { emoji: "👥", name: "User Management", type: "System Control", gradient: "from-red-400 to-red-600" },
            { emoji: "📊", name: "Analytics", type: "Data Insights", gradient: "from-orange-400 to-orange-600" },
            { emoji: "⚙️", name: "Settings", type: "Configuration", gradient: "from-yellow-400 to-yellow-600" }
          ]
        };
      case "guide":
        return {
          titleGradient: "from-green-600 via-emerald-600 to-teal-600",
          welcomeText: "Welcome back, guide! Continue sharing your expertise and creating amazing experiences for travelers.",
          statsColors: ["text-green-600", "text-emerald-600", "text-teal-600"],
          recentTitle: "Recent Tours",
          recentItems: [
            { emoji: "🗺️", name: "City Walking Tours", type: "Urban Exploration", gradient: "from-green-400 to-green-600" },
            { emoji: "🏛️", name: "Historical Sites", type: "Cultural Heritage", gradient: "from-emerald-400 to-emerald-600" },
            { emoji: "🌄", name: "Nature Trails", type: "Adventure Guide", gradient: "from-teal-400 to-teal-600" }
          ]
        };
      default:
        return {
          titleGradient: "from-blue-600 via-teal-600 to-green-600",
          welcomeText: "Welcome back, adventurer! Continue exploring amazing destinations and creating unforgettable memories around the world.",
          statsColors: ["text-blue-600", "text-teal-600", "text-green-600"],
          recentTitle: "Recent Destinations",
          recentItems: [
            { emoji: "🏔️", name: "Kulu Manali", type: "Mountain Adventure", gradient: "from-blue-400 to-blue-600" },
            { emoji: "🏖️", name: "Goa", type: "Beach Paradise", gradient: "from-teal-400 to-teal-600" },
            { emoji: "🌸", name: "Rajasthan", type: "Cultural Experience", gradient: "from-green-400 to-green-600" }
          ]
        };
    }
  };

  const theme = getThemeConfig();
  const navigate = useNavigate();

  return (
    <div className="hidden lg:block space-y-6">
      <div className="space-y-4">
        <h1 onClick={() => navigate("/")}  className={`text-5xl font-bold bg-gradient-to-r ${theme.titleGradient} bg-clip-text text-transparent cursor-pointer`}>
          Travel Mate
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          {theme.welcomeText}
        </p>
      </div>

      <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
        <img
          src="/neom-eOWabmCNEdg-unsplash.jpg"
          alt="Welcome back to Travel Mate"
          className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h3 className="text-2xl font-semibold mb-2">Continue Your Journey</h3>
          <p className="text-sm opacity-90">Your next adventure is just a click away</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="text-center">
          <div className={`text-2xl font-bold ${theme.statsColors[0]} transition-colors`}>24/7</div>
          <div className="text-sm text-gray-600">Support</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${theme.statsColors[1]} transition-colors`}>100%</div>
          <div className="text-sm text-gray-600">Secure</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${theme.statsColors[2]} transition-colors`}>5★</div>
          <div className="text-sm text-gray-600">Rated Service</div>
        </div>
      </div>

      {/* Recent Activity Preview */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all duration-300 hover:bg-white/70">
        <h4 className="font-semibold text-gray-800 mb-3">{theme.recentTitle}</h4>
        <div className="space-y-2">
          {theme.recentItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 transition-all duration-200 hover:bg-white/30 rounded-lg p-2 -m-2">
              <div className={`w-8 h-8 bg-gradient-to-br ${item.gradient} rounded-full flex items-center justify-center shadow-sm`}>
                <span className="text-white text-xs font-bold">{item.emoji}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-600">{item.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}