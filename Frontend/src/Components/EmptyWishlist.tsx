import { useState, useEffect } from "react"
import { Button } from "@/Components/ui/button"
import { Heart, Home, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
export function EmptyWishlist() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true)

    // Generate floating particles
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full bg-primary/20 animate-drift"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div
        className={`text-center max-w-2xl mx-auto transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Animated House Illustration */}
        <div className="relative mb-12">
          <div className="relative inline-block">
            {/* House Container */}
            <div className="relative w-64 h-64 mx-auto animate-float">
              {/* House Base */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-24 bg-card rounded-lg shadow-2xl border border-border/50">
                {/* Door */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-12 bg-black/80 rounded-t-lg">
                  <div className="absolute top-3 right-1 w-1 h-1 bg-primary-foreground rounded-full" />
                </div>

                {/* Windows */}
                <div className="absolute top-3 left-3 w-4 h-4 bg-secondary/60 rounded border border-border/30" />
                <div className="absolute top-3 right-3 w-4 h-4 bg-secondary/60 rounded border border-border/30" />
              </div>

              {/* Roof */}
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-20 border-r-20 border-b-16 border-l-transparent border-r-transparent border-b-black/90" />

              {/* Chimney */}
              <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 translate-x-6 w-3 h-8 bg-muted rounded-t" />

              {/* Floating Key */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-x-4">
                <div className="w-6 h-6 text-primary animate-bounce">
                  <Home className="w-full h-full" />
                </div>
              </div>
            </div>

            {/* Sparkle Effects */}
            <div
              className="absolute top-4 left-8 w-3 h-3 text-primary animate-sparkle"
              style={{ animationDelay: "0s" }}
            >
              <Sparkles className="w-full h-full" />
            </div>
            <div
              className="absolute top-12 right-12 w-2 h-2 text-secondary animate-sparkle"
              style={{ animationDelay: "1s" }}
            >
              <Sparkles className="w-full h-full" />
            </div>
            <div
              className="absolute bottom-16 left-4 w-4 h-4 text-accent animate-sparkle"
              style={{ animationDelay: "2s" }}
            >
              <Sparkles className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* Hero Text */}
        <div
          className={`space-y-6 transition-all duration-1000 delay-300 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground text-balance">
            Your <em className="text-primary">Dream Getaways</em> Await
          </h1>

          <p className="font-sans text-xl text-muted-foreground leading-relaxed text-pretty max-w-lg mx-auto">
            No favorites yet? Let's fill this space with sunsets, stories, and secret spots. Start exploring Nivasa's
            hidden gems.
          </p>

          <p className="font-sans text-base text-muted-foreground/80 flex items-center justify-center gap-2">
            Tap a <Heart className="w-4 h-4 text-primary fill-current" /> on any listing to save it here
          </p>
        </div>

        {/* Call to Action */}
        <div
          className={`mt-12 transition-all duration-1000 delay-500 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Button
            size="lg"
            className="font-serif text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            onClick={() => { navigate("/") }}
          >
            Discover Stays
            <Sparkles className="ml-2 w-5 h-5 group-hover:animate-spin transition-transform duration-300" />
          </Button>
        </div>
      </div>

      {/* Bottom Navigation Hint */}
      <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-4 text-muted-foreground/60 text-sm">
          <div className="w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center">
            <Home className="w-4 h-4" />
          </div>
          <span className="font-sans">Nivasa</span>
        </div>
      </div>
    </div>
  )
}
