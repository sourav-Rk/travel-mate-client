"use client"

import { Plane, MapPin, Camera, Mountain, Compass, Globe } from "lucide-react"
import LoginHero from "@/components/common/LoginHero"
import LoginForm from "@/components/auth/Login"


export default function VendorLogin() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden animate-fade-in">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Travel Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Plane className="absolute top-20 left-20 w-8 h-8 text-blue-400/30 animate-bounce delay-300 opacity-0 animate-float-in" style={{animationDelay: '0.5s'}} />
        <MapPin className="absolute top-40 right-32 w-6 h-6 text-teal-400/30 animate-bounce delay-700 opacity-0 animate-float-in" style={{animationDelay: '0.7s'}} />
        <Camera className="absolute bottom-40 left-32 w-7 h-7 text-purple-400/30 animate-bounce delay-1000 opacity-0 animate-float-in" style={{animationDelay: '0.9s'}} />
        <Mountain className="absolute bottom-20 right-20 w-8 h-8 text-green-400/30 animate-bounce delay-500 opacity-0 animate-float-in" style={{animationDelay: '1.1s'}} />
        <Compass className="absolute top-1/3 left-1/4 w-6 h-6 text-orange-400/30 animate-bounce delay-800 opacity-0 animate-float-in" style={{animationDelay: '1.3s'}} />
        <Globe className="absolute bottom-1/3 right-1/4 w-7 h-7 text-indigo-400/30 animate-bounce delay-200 opacity-0 animate-float-in" style={{animationDelay: '1.5s'}} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          <div className="opacity-0 animate-slide-in-left">
            <LoginHero userType="vendor"/>
          </div>
          <div className="opacity-0 animate-slide-in-right">
            <LoginForm
              userType="vendor"
            />
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-in-left {
          from { 
            opacity: 0;
            transform: translateX(-50px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-right {
          from { 
            opacity: 0;
            transform: translateX(50px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float-in {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out 0.3s both;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out 0.5s both;
        }
        
        .animate-float-in {
          animation: float-in 0.6s ease-out both;
        }
      `}</style>
    </div>
  )
}