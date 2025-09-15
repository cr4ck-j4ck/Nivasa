"use client"

import { useEffect, useState } from "react"
import { Home, Key, MapPin, CheckCircle } from "lucide-react"

export default function NivasaLoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [showHouse, setShowHouse] = useState(false)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 300)

    const houseTimeout = setTimeout(() => {
      setShowHouse(true)
    }, 1500)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(houseTimeout)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-red-200 via-pink-300 to-orange-300"
        style={{
          background: "linear-gradient(135deg, #f77491 0%, #ffa3b8 35%, #fa466f 100%)",
        }}
      />

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-8 h-8 text-white/30">
          <Home className="w-full h-full" />
        </div>
        <div className="absolute top-40 right-32 w-6 h-6 text-white/20">
          <MapPin className="w-full h-full" />
        </div>
        <div className="absolute bottom-32 left-40 w-7 h-7 text-white/25">
          <Key className="w-full h-full" />
        </div>
        <div className="absolute bottom-20 right-20 w-5 h-5 text-white/30">
          <CheckCircle className="w-full h-full" />
        </div>
        <div className="absolute top-1/3 left-1/4 w-4 h-4 text-white/20">
          <MapPin className="w-full h-full" />
        </div>
        <div className="absolute top-2/3 right-1/3 w-6 h-6 text-white/25">
          <Home className="w-full h-full" />
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-particles"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          >
            <div className="w-2 h-2 bg-white/40 rounded-full" />
          </div>
        ))}
      </div>

      {/* Logo - Top Left */}
      <div className="absolute top-8 left-8 flex items-center gap-3">
        <div className="relative">
          <Home className="w-8 h-8 text-white" />
          <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-white" />
        </div>
        <span className="text-white font-bold text-xl">Nivasa.site</span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8">
        {/* Central Animation */}
        <div className="relative mb-12">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Key Animation */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
                showHouse ? "opacity-0 scale-0" : "opacity-100 scale-100"
              }`}
            >
              <Key className="w-16 h-16 text-white animate-key-to-house animate-pulse-glow" />
            </div>

            {/* House Animation */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
                showHouse ? "opacity-100 scale-100" : "opacity-0 scale-0"
              }`}
            >
              <Home className="w-20 h-20 text-white animate-pulse-glow" />
            </div>
          </div>

          {/* Particle Effects around central icon */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full animate-float-particles"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `rotate(${i * 30}deg) translateY(-60px)`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "10s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4 mb-12">
          <h1 className="text-8xl font-bold text-white text-balance drop-shadow-lg BonheurRoyale">Unlocking Your Dashboard</h1>
          <p className="text-5xl text-white/90 font-medium StoryScript">Preparing your Nivasa insights...</p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 max-w-md">
          <div className="relative h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-white to-white/80 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
          <div className="mt-3 text-center">
            <span className="text-white/80 text-sm font-medium">{Math.round(Math.min(progress, 100))}% Complete</span>
          </div>
        </div>
      </div>

      {/* Tagline - Bottom Right */}
      <div className="absolute bottom-8 right-8">
        <p className="text-white/80 text-sm italic font-medium">Your Home, Away from Home</p>
      </div>
    </div>
  )
}
