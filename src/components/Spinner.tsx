
"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  variant?: "plane" | "compass" | "globe" | "wave"
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-24 h-24",
  xl: "w-32 h-32",
}

export function Spinner({ size = "md", className, variant = "wave" }: LoadingSpinnerProps) {
  if (variant === "plane") {
    return (
      <div className={cn("fixed inset-0 flex items-center justify-center bg-white/80 z-50", className)}>
        <div className={cn("relative", sizeClasses[size])}>
          {/* Circular path */}
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
          
          {/* Plane icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-1/2 h-1/2 text-indigo-600 animate-pulse"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
        </div>
      </div>
    )
  }

  if (variant === "compass") {
    return (
      <div className={cn("fixed inset-0 flex items-center justify-center bg-white/80 z-50", className)}>
        <div className={cn("relative", sizeClasses[size])}>
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
          
          {/* Rotating compass points */}
          <div className="absolute inset-0 animate-spin">
            <div className="absolute top-0 left-1/2 w-1 h-1/3 -ml-0.5 bg-gradient-to-b from-red-500 to-transparent"></div>
            <div className="absolute bottom-0 left-1/2 w-1 h-1/3 -ml-0.5 bg-gradient-to-t from-indigo-500 to-transparent"></div>
          </div>
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === "globe") {
    return (
      <div className={cn("fixed inset-0 flex items-center justify-center bg-white/80 z-50", className)}>
        <div className={cn("relative", sizeClasses[size])}>
          {/* Globe base */}
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
          
          {/* Latitude lines */}
          <div className="absolute inset-0 flex flex-col justify-around p-2 animate-pulse">
            <div className="w-full h-0.5 bg-indigo-300 rounded opacity-40"></div>
            <div className="w-full h-0.5 bg-indigo-300 rounded opacity-40"></div>
          </div>
          
          {/* Rotating longitude */}
          <div className="absolute inset-0 animate-spin">
            <div className="absolute inset-0 border-4 border-transparent border-l-indigo-600 border-r-indigo-600 rounded-full"></div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === "wave") {
    return (
      <div className={cn("fixed inset-0 flex items-center justify-center bg-white/80 z-50", className)}>
        <div className={cn("flex space-x-1", sizeClasses[size])}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-blue-400 to-indigo-600 rounded-full animate-wave"
              style={{
                animationDelay: `${i * 0.1}s`,
                height: '100%'
              }}
            ></div>
          ))}
        </div>
        <style>{`
          @keyframes wave {
            0%, 100% { transform: scaleY(0.3); }
            50% { transform: scaleY(1); }
          }
          .animate-wave {
            animation: wave 1s ease-in-out infinite;
          }
        `}</style>
      </div>
    )
  }

  return null
}
