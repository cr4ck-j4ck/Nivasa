import React, { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { CheckCircle, Home, Key, Plane, MapPin, Calendar, DollarSign, Sparkles } from "lucide-react";

interface BookingDetails {
  propertyName: string
  checkIn: string
  checkOut: string
  totalPrice: string
  propertyImage: string
  confirmationNumber: string
}

export function BookingSuccessPage() {
  const [showConfetti, setShowConfetti] = useState(false)
  const [showContent, setShowContent] = useState(false)

  // Mock booking details - in real app this would come from props/context
  const bookingDetails: BookingDetails = {
    propertyName: "Sunset Villa Paradise",
    checkIn: "Dec 15, 2024",
    checkOut: "Dec 22, 2024",
    totalPrice: "$2,450",
    propertyImage: "/placeholder.svg?key=u9iv9",
    confirmationNumber: "NVS-2024-789123",
  }

  useEffect(() => {
    document.body.style.background = "linear-gradient(135deg, #10B981 0%, #F59E0B 100%)"
    document.body.style.minHeight = "100vh"

    // Trigger confetti after component mounts
    const timer1 = setTimeout(() => setShowConfetti(true), 500)
    const timer2 = setTimeout(() => setShowContent(true), 1000)

    return () => {
      // Reset body background on cleanup
      document.body.style.background = ""
      document.body.style.minHeight = ""
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  const FloatingIcon = ({
    icon: Icon,
    delay = 0,
    position = "left",
  }: {
    icon: React.ComponentType<{ className?: string }>
    delay?: number
    position?: "left" | "right"
  }) => (
    <div
      className={`fixed ${position === "left" ? "left-10" : "right-10"} animate-floating-icons opacity-60 z-10`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${12 + Math.random() * 4}s`,
      }}
    >
      <Icon className="w-8 h-8 text-white/70" />
    </div>
  )

  const ConfettiPiece = ({ delay = 0, color = "bg-yellow-400" }: { delay?: number; color?: string }) => (
    <div
      className={`fixed w-3 h-3 ${color} animate-confetti-burst z-10`}
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${2 + Math.random() * 2}s`,
      }}
    />
  )

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Travel Icons */}
      <FloatingIcon icon={Plane} delay={0} position="left" />
      <FloatingIcon icon={MapPin} delay={2} position="right" />
      <FloatingIcon icon={Home} delay={4} position="left" />
      <FloatingIcon icon={Sparkles} delay={6} position="right" />
      <FloatingIcon icon={Key} delay={8} position="left" />

      {/* Confetti Burst */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {Array.from({ length: 50 }).map((_, i) => (
            <ConfettiPiece
              key={i}
              delay={Math.random() * 2}
              color={
                ["bg-yellow-400", "bg-green-400", "bg-blue-400", "bg-purple-400", "bg-pink-400", "bg-orange-400"][
                  Math.floor(Math.random() * 6)
                ]
              }
            />
          ))}
        </div>
      )}

      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 p-6 transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0"}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Home className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white drop-shadow-lg">Nivasa.site</span>
          </div>
          <div className="flex items-center space-x-6 text-white">
            <a href="#" className="hover:text-white/80 transition-colors drop-shadow-md">
              Dashboard
            </a>
            <a href="#" className="hover:text-white/80 transition-colors drop-shadow-md">
              Messages
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* Central Animation */}
          <div className="relative mb-12">
            {/* House Unlock Animation */}
            <div className="relative inline-block">
              <div className="w-32 h-32 mx-auto mb-8 relative">
                <Home className="w-32 h-32 text-white animate-house-unlock drop-shadow-2xl" />
                <Key className="absolute top-1/2 left-1/2 w-8 h-8 text-yellow-300 animate-key-insert drop-shadow-lg" />
              </div>

              {/* Progress Ring */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.3)" strokeWidth="4" fill="none" />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="176"
                    className="animate-progress-fill"
                  />
                </svg>
                <CheckCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>

          {/* Hero Text */}
          <div
            className={`transition-all duration-1000 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 animate-text-glow drop-shadow-2xl">
              Booking Confirmed! 🎉
            </h1>
            <p className="text-2xl md:text-3xl text-white mb-2 text-balance drop-shadow-lg">
              Your getaway to{" "}
              <span className="font-semibold text-yellow-200 drop-shadow-md">{bookingDetails.propertyName}</span> is
              secured
            </p>
            <p className="text-xl text-white mb-8 drop-shadow-md">
              from <span className="font-medium">{bookingDetails.checkIn}</span> to{" "}
              <span className="font-medium">{bookingDetails.checkOut}</span>
            </p>
            <p className="text-lg text-white/90 mb-12 drop-shadow-md">Confirmation email sent—check your inbox! ✨</p>
          </div>

          {/* Booking Summary Card */}
          <div
            className={`transition-all duration-1000 delay-500 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-8 mb-12 animate-glassmorphism-float">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={bookingDetails.propertyImage || "/placeholder.svg"}
                    alt={bookingDetails.propertyName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <div className="text-left space-y-4">
                  <h3 className="text-2xl font-bold text-white drop-shadow-lg">{bookingDetails.propertyName}</h3>

                  <div className="space-y-3 text-white">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5" />
                      <span className="drop-shadow-md">
                        {bookingDetails.checkIn} - {bookingDetails.checkOut}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5" />
                      <span className="text-2xl font-bold text-yellow-200 drop-shadow-lg">
                        {bookingDetails.totalPrice}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span className="font-mono text-sm drop-shadow-md">{bookingDetails.confirmationNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-8 py-4 text-lg animate-button-sparkle bg-size-200 hover:scale-105 transition-all duration-300 drop-shadow-lg"
            >
              <Calendar className="w-5 h-5 mr-2" />
              View Itinerary
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm hover:scale-105 transition-all duration-300 drop-shadow-md bg-transparent"
            >
              <Home className="w-5 h-5 mr-2" />
              Explore More Stays
            </Button>
          </div>

          {/* Bottom Tagline */}
          <div className={`mt-16 transition-all duration-1000 delay-1000 ${showContent ? "opacity-100" : "opacity-0"}`}>
            <p className="text-xl text-white font-script italic drop-shadow-lg">
              Your Home, Away from Home—Booked & Blessed ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
