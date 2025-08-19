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
          welcomeText:
            "Welcome back, adventurer! Continue exploring amazing destinations and creating unforgettable memories around the world.",
          statsColors: ["text-blue-600", "text-teal-600", "text-green-600"],
        };
       case "vendor":
        return {
          titleGradient: "from-teal-600 via-teal-600 to-teal-500", // Changed to solid cyan-700
          welcomeText:
            "Welcome back, partner! Continue managing your services and connecting with travelers worldwide.",
          welcomeTextColor: "text-gray-600", // Set to gray-600 for consistency
          statsColors: ["text-cyan-600", "text-cyan-600", "text-cyan-600"], // Changed to solid cyan-600
        }
  case "admin":
  return {
       titleGradient: "text-white", // ✅ Pure white text
    welcomeText:
      "Welcome back, administrator! Continue overseeing the platform and ensuring smooth operations.",
      welcomeTextColor : "text-white",
    statsColors: ["text-yellow-400", "text-yellow-400", "text-yellow-400"],
  };

      case "guide":
        return {
          titleGradient: "from-teal-600 via-teal-600 to-teal-500", // Changed to solid cyan-700
          welcomeText:
            "Welcome back, partner! Continue managing your services and connecting with travelers worldwide.",
          welcomeTextColor: "text-gray-600", // Set to gray-600 for consistency
          statsColors: ["text-cyan-600", "text-cyan-600", "text-cyan-600"], // Changed to solid cyan-600
        }
      default:
        return {
          titleGradient: "from-blue-600 via-teal-600 to-green-600",
          welcomeText:
            "Welcome back, adventurer! Continue exploring amazing destinations and creating unforgettable memories around the world.",
          statsColors: ["text-blue-600", "text-teal-600", "text-green-600"],
        };
    }
  };

  const theme = getThemeConfig();
  const navigate = useNavigate();

  return (
    <div className="hidden lg:block space-y-6">
      <div className="space-y-4">
        <h1
          onClick={() => navigate("/")}
          className={`text-5xl font-bold bg-gradient-to-r ${theme.titleGradient} bg-clip-text text-transparent cursor-pointer`}
        >
          Travel Mate
        </h1>
        <p className={`text-xl leading-relaxed ${theme.welcomeTextColor}`}>
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
          <p className="text-sm opacity-90">
            Your next adventure is just a click away
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="text-center">
          <div
            className={`text-2xl font-bold ${theme.statsColors[0]} transition-colors`}
          >
            24/7
          </div>
          <div className="text-sm text-gray-600">Support</div>
        </div>
        <div className="text-center">
          <div
            className={`text-2xl font-bold ${theme.statsColors[1]} transition-colors`}
          >
            100%
          </div>
          <div className="text-sm text-gray-600">Secure</div>
        </div>
        <div className="text-center">
          <div
            className={`text-2xl font-bold ${theme.statsColors[2]} transition-colors`}
          >
            5★
          </div>
          <div className="text-sm text-gray-600">Rated Service</div>
        </div>
      </div>

      {/* Recent Activity Preview */}

    </div>
  );
}
