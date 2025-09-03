"use client"

import { useEffect, useState } from "react"

interface Ribbon {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  scale: number
  delay: number
}

export default function CelebrationAnimation() {
  const [ribbons, setRibbons] = useState<Ribbon[]>([])

  const colors = [
    "#2CA4BC", // Primary teal
    "#FFD700", // Gold
    "#FF6B6B", // Coral
    "#4ECDC4", // Light teal
    "#45B7D1", // Blue
    "#96CEB4", // Mint
    "#FFEAA7", // Light yellow
    "#DDA0DD", // Plum
  ]

  useEffect(() => {
    // Generate ribbons
    const newRibbons: Ribbon[] = []
    for (let i = 0; i < 50; i++) {
      newRibbons.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.8,
        delay: Math.random() * 2,
      })
    }
    setRibbons(newRibbons)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Success Message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center animate-bounce border-4 border-[#2CA4BC]">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-[#2CA4BC] mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600">Get ready for an amazing adventure!</p>
        </div>
      </div>

      {/* Ribbon Confetti */}
      {ribbons.map((ribbon) => (
        <div
          key={ribbon.id}
          className="absolute w-3 h-8 opacity-90 animate-pulse"
          style={{
            left: `${ribbon.x}%`,
            top: `${ribbon.y}%`,
            backgroundColor: ribbon.color,
            transform: `rotate(${ribbon.rotation}deg) scale(${ribbon.scale})`,
            animationDelay: `${ribbon.delay}s`,
            animationDuration: "3s",
            borderRadius: "2px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        />
      ))}

      {/* Floating Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute w-2 h-2 bg-[#2CA4BC] rounded-full animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Sparkle Effects */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute text-2xl animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: "2s",
          }}
        >
          ✨
        </div>
      ))}

      {/* Gradient Overlay for Extra Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2CA4BC]/10 via-transparent to-[#2CA4BC]/10 animate-pulse" />
    </div>
  )
}
