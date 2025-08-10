import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Home, 
  Star, 
  MapPin, 
  Sparkles,
  Globe,
  Bookmark,
  Search
} from 'lucide-react';

const WishlistLoading: React.FC = () => {
  const [progress, setProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [heartBeats, setHeartBeats] = useState<number>(0);
  
  const loadingSteps: string[] = [
    "Finding your saved homes...",
    "Loading your favorites...",
    "Gathering wishlist details...",
    "Almost ready..."
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1.5;
      });
    }, 150);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % loadingSteps.length);
    }, 1200);

    const heartInterval = setInterval(() => {
      setHeartBeats(prev => prev + 1);
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearInterval(heartInterval);
    };
  }, [loadingSteps.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 flex items-center justify-center p-6 relative overflow-hidden w-full">
      {/* Background Pattern */}
<div className="absolute inset-0 opacity-5">
  <div className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e11d48' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]`}></div>
</div>

      <div className="text-center max-w-lg w-full z-10">
        {/* Animated Heart Collection */}
        <div className="relative mb-12">
          {/* Main Heart Container */}
          <div className="relative">
            {/* Pulsing Background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 bg-rose-100 rounded-full animate-pulse opacity-40"></div>
              <div className="absolute w-32 h-32 bg-pink-100 rounded-full animate-ping opacity-30"></div>
              <div className="absolute w-24 h-24 bg-rose-200 rounded-full animate-bounce opacity-50"></div>
            </div>
            
            {/* Central Wishlist Icon */}
            <div className="relative z-10 w-24 h-24 mx-auto bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3">
              <div className="relative">
                <Bookmark className="w-12 h-12 text-white animate-pulse" />
                <Heart className="w-6 h-6 text-red-200 absolute -top-1 -right-1 animate-bounce" fill="currentColor" />
              </div>
            </div>
            
            {/* Floating Hearts */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-48">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className="absolute animate-spin"
                    style={{
                      top: `${50 + 40 * Math.cos(index * Math.PI / 3)}%`,
                      left: `${50 + 40 * Math.sin(index * Math.PI / 3)}%`,
                      animationDuration: `${8 + index}s`,
                      animationDirection: index % 2 === 0 ? 'normal' : 'reverse',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform">
                      <Heart 
                        className={`w-5 h-5 ${
                          heartBeats % 6 === index ? 'text-red-500 animate-pulse' : 'text-rose-300'
                        }`}
                        fill={heartBeats % 6 === index ? 'currentColor' : 'none'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sparkle Effects */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <Sparkles
                  key={i}
                  className={`absolute w-4 h-4 text-yellow-400 animate-ping`}
                  style={{
                    top: `${20 + (i * 10)}%`,
                    left: `${15 + (i * 8)}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Brand Section */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 bg-clip-text text-transparent mb-3">
            Your Wishlist
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
            <Globe className="w-4 h-4" />
            <span className="text-sm">Curating your dream homes</span>
          </div>
          <p className="text-gray-500 text-sm">Loading your saved favorites from around the world</p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-8">
          <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Moving Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-pulse"></div>
              {/* Progress Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full blur-sm opacity-60"></div>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600 font-medium">
            {progress.toFixed(0)}% complete
          </div>
        </div>

        {/* Loading Steps with Icons */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-3 text-lg font-medium text-gray-800 mb-6 min-h-[32px]">
            <Search className="w-5 h-5 text-rose-500 animate-spin" />
            <span className="transition-all duration-500 ease-in-out">
              {loadingSteps[currentStep]}
            </span>
          </div>
          
          {/* Enhanced Step Indicators */}
          <div className="flex justify-center space-x-3">
            {loadingSteps.map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-500 mb-1 ${
                    index === currentStep 
                      ? 'bg-rose-500 scale-125 shadow-lg' 
                      : index < currentStep 
                        ? 'bg-rose-400 scale-110' 
                        : 'bg-gray-300'
                  }`}
                />
                {index === currentStep && (
                  <div className="w-1 h-4 bg-gradient-to-b from-rose-500 to-transparent rounded-full animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { 
              icon: Heart, 
              title: "Saved Homes", 
              desc: "Your favorites",
              color: "from-red-400 to-rose-500",
              delay: "0s" 
            },
            { 
              icon: Home, 
              title: "Dream Places", 
              desc: "Perfect matches",
              color: "from-blue-400 to-blue-500",
              delay: "0.2s" 
            },
            { 
              icon: Star, 
              title: "Top Rated", 
              desc: "5-star properties",
              color: "from-yellow-400 to-orange-500",
              delay: "0.4s" 
            },
            { 
              icon: MapPin, 
              title: "Locations", 
              desc: "Worldwide",
              color: "from-green-400 to-emerald-500",
              delay: "0.6s" 
            }
          ].map((item, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce border border-rose-100"
              style={{ 
                animationDelay: item.delay,
                animationDuration: '2s'
              }}
            >
              <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm font-semibold text-gray-800 mb-1">{item.title}</div>
              <div className="text-xs text-gray-600">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Animated Loading Dots */}
        <div className="flex justify-center space-x-2 mb-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1.2s'
              }}
            />
          ))}
        </div>

        {/* Encouraging Message */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2 font-medium">
            Preparing your personalized collection...
          </p>
          <p className="text-xs text-gray-500">
            Great taste takes time to curate ✨
          </p>
        </div>
      </div>
      
      {/* Enhanced Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating Hearts */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Heart className={`w-${3 + Math.floor(Math.random() * 3)} h-${3 + Math.floor(Math.random() * 3)} text-rose-300`} />
          </div>
        ))}
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/6 left-1/6 w-64 h-64 bg-gradient-radial from-rose-200/30 to-transparent rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/6 right-1/6 w-80 h-80 bg-gradient-radial from-pink-200/20 to-transparent rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-2/3 left-1/3 w-48 h-48 bg-gradient-radial from-orange-200/25 to-transparent rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default WishlistLoading;