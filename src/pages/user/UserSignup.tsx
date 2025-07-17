"use client";

import { Plane, MapPin, Camera, Mountain } from "lucide-react";
import SignupHero from "@/components/common/SignupHero";
import SignupForm from "@/components/auth/Signup";

export default function UserSignup() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse opacity-0 animate-fade-float" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse opacity-0 animate-fade-float-reverse" style={{ animationDelay: '0.6s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse opacity-0 animate-fade-drift" style={{ animationDelay: '0.9s' }}></div>
        
        {/* Clouds */}
        <div className="absolute top-10 left-1/4 w-32 h-16 bg-white/20 rounded-full blur-sm opacity-0 animate-cloud-move" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-32 right-1/4 w-24 h-12 bg-white/15 rounded-full blur-sm opacity-0 animate-cloud-move-reverse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Travel Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Plane className="absolute top-20 left-20 w-8 h-8 text-blue-400/40 opacity-0 animate-plane-journey" style={{ animationDelay: '1.2s' }} />
        <MapPin className="absolute top-40 right-32 w-6 h-6 text-teal-400/40 opacity-0 animate-pin-drop" style={{ animationDelay: '1.5s' }} />
        <Camera className="absolute bottom-40 left-32 w-7 h-7 text-purple-400/40 opacity-0 animate-camera-snap" style={{ animationDelay: '1.8s' }} />
        <Mountain className="absolute bottom-20 right-20 w-8 h-8 text-green-400/40 opacity-0 animate-mountain-rise" style={{ animationDelay: '2.1s' }} />
        
        {/* Twinkling elements */}
        <div className="absolute top-1/3 left-10 w-2 h-2 bg-yellow-400/60 rounded-full opacity-0 animate-twinkle" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-1/3 right-10 w-2 h-2 bg-pink-400/60 rounded-full opacity-0 animate-twinkle" style={{ animationDelay: '3s' }}></div>
      </div>



      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          <div className="opacity-0 animate-slide-in-left mb-44 ">
            <SignupHero />
          </div>
          <div className="opacity-0 animate-slide-in-right">
            <SignupForm userType="client" />
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeFloat {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes floatReverse { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(20px); } }
        @keyframes drift { 0%, 100% { transform: translate(-50%, -50%); } 50% { transform: translate(-55%, -45%); } }
        @keyframes cloudMove { 0% { opacity: 0; transform: translateX(-50px); } 50% { opacity: 1; } 100% { opacity: 0.7; transform: translateX(50px); } }
        @keyframes cloudMoveReverse { 0% { opacity: 0; transform: translateX(50px); } 50% { opacity: 1; } 100% { opacity: 0.7; transform: translateX(-50px); } }
        @keyframes planeJourney { 0% { opacity: 0; transform: translateX(-30px) rotate(-10deg); } 100% { opacity: 0.8; transform: translateX(15px) rotate(5deg); } }
        @keyframes pinDrop { 0% { opacity: 0; transform: translateY(-20px) scale(0.5); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.8; transform: scale(1); } }
        @keyframes cameraSnap { 0% { opacity: 0; transform: scale(0.8); } 30% { opacity: 1; transform: scale(1.2); filter: brightness(1.5); } 100% { opacity: 0.8; transform: scale(1); } }
        @keyframes mountainRise { 0% { opacity: 0; transform: translateY(20px) scale(0.8); } 100% { opacity: 0.8; transform: scale(1); } }
        @keyframes twinkle { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1.5); } }

        @keyframes slideInLeft { 0% { opacity: 0; transform: translateX(-50px); } 100% { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { 0% { opacity: 0; transform: translateX(50px); } 100% { opacity: 1; transform: translateX(0); } }

        .animate-fade-float { animation: fadeFloat 0.8s ease-out forwards, float 6s ease-in-out 1s infinite; }
        .animate-fade-float-reverse { animation: fadeFloat 0.8s ease-out forwards, floatReverse 8s ease-in-out 1s infinite; }
        .animate-fade-drift { animation: fadeFloat 0.8s ease-out forwards, drift 10s ease-in-out 1s infinite; }
        .animate-cloud-move { animation: cloudMove 15s linear infinite; }
        .animate-cloud-move-reverse { animation: cloudMoveReverse 18s linear infinite; }
        .animate-plane-journey { animation: planeJourney 2s ease-out forwards, float 4s ease-in-out 2s infinite; }
        .animate-pin-drop { animation: pinDrop 1.5s ease-out forwards, bounce 2s ease-in-out 2s infinite; }
        .animate-camera-snap { animation: cameraSnap 1.8s ease-out forwards, pulse 4s ease-in-out 2s infinite; }
        .animate-mountain-rise { animation: mountainRise 1.2s ease-out forwards, bounce 3s ease-in-out 2s infinite; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }

        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out 0.2s forwards; }
        .animate-slide-in-right { animation: slideInRight 0.8s ease-out 0.4s forwards; }
      `}</style>
    </div>
  );
}


