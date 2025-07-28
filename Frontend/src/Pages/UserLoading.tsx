import { useState, useEffect } from 'react';
import { 
  Home, 
  Star, 
  Heart, 
  MapPin, 
  User,
  Award,
  Globe
} from 'lucide-react';

const LoadingUser = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const loadingSteps = [
    "Loading your profile...",
    "Fetching your listings...",
    "Gathering reviews...",
    "Finalizing details..."
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 200);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % loadingSteps.length);
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="min-h-full pt-20 bg-gradient-to-br from-rose-300 via-white to-orange-300 flex items-center justify-center p-6 w-full">
      <div className="text-center max-w-md w-full">
        {/* Animated Logo/Icon Area */}
        <div className="relative mb-8">
          {/* Floating Background Circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-rose-100 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute w-24 h-24 bg-orange-100 rounded-full animate-ping opacity-40"></div>
            <div className="absolute w-16 h-16 bg-rose-200 rounded-full animate-bounce opacity-80"></div>
          </div>
          
          {/* Central Icon with Rotation */}
          <div className="relative z-10 w-20 h-20 mx-auto bg-gradient-to-r from-rose-400 to-orange-100 rounded-2xl flex items-center justify-center shadow-lg ">
            <img src="/Nivasa-removebg-preview.png" alt="" />
          </div>
          
          {/* Orbiting Icons */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-40 h-40">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-spin" style={{animationDuration: '8s'}}>
                <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center transform -rotate-12">
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 animate-spin" style={{animationDuration: '6s', animationDirection: 'reverse'}}>
                <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                  <Heart className="w-4 h-4 text-rose-500" />
                </div>
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-spin" style={{animationDuration: '10s'}}>
                <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 animate-spin" style={{animationDuration: '7s', animationDirection: 'reverse'}}>
                <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                  <User className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="mb-8">
          <h1 className="text-4xl pt-4 pb-2 font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Nivasa
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Globe className="w-4 h-4" />
            <span className="text-sm">Belong anywhere</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {progress}% complete
          </div>
        </div>

        {/* Loading Steps */}
        <div className="mb-8">
          <div className="text-lg font-medium text-gray-800 mb-4 min-h-[28px] transition-all duration-500 ease-in-out">
            {loadingSteps[currentStep]}
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-center space-x-2">
            {loadingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-rose-500 scale-125' 
                    : index < currentStep 
                      ? 'bg-rose-300' 
                      : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Floating Feature Cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Award, label: "Superhost", color: "from-purple-400 to-purple-600" },
            { icon: Star, label: "Reviews", color: "from-yellow-400 to-yellow-600" },
            { icon: Home, label: "Listings", color: "from-blue-400 to-blue-600" }
          ].map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-3 shadow-sm animate-bounce opacity-80"
              style={{ 
                animationDelay: `${index * 0.2}s`,
                animationDuration: '2s'
              }}
            >
              <div className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <item.icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-xs text-gray-600 font-medium">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Loading Dots Animation */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>

        {/* Subtle Help Text */}
        <div className="mt-8 text-xs text-gray-500">
          <p>Preparing your personalized experience...</p>
        </div>
      </div>
      
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating Shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-rose-100 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-orange-100 rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-yellow-100 rounded-full opacity-25 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-purple-100 rounded-full opacity-20 animate-float" style={{animationDelay: '0.5s'}}></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-rose-200 to-transparent rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-orange-200 to-transparent rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingUser;