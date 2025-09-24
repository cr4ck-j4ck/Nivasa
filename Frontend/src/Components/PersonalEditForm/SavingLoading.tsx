import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Pen,
  Sparkles,
  CheckCircle,
  Save,
  Heart
} from 'lucide-react';

interface SavingLoadingProps {
  onComplete: () => void;
  isComplete?: boolean; // New prop to indicate when operation is actually complete
}

const SavingLoading: React.FC<SavingLoadingProps> = ({ onComplete, isComplete = false }) => {
  const [progress, setProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [saved, setSaved] = useState<boolean>(false);

  const loadingSteps: string[] = [
    "Validating your information...",
    "Uploading avatar...",
    "Saving to database...",
    "Updating your profile..."
  ];

  useEffect(() => {
    // If operation is complete, immediately jump to 100% and show success
    if (isComplete && !saved) {
      setProgress(100);
      setCurrentStep(loadingSteps.length - 1);
      setSaved(true);
      setTimeout(onComplete, 1000); // Show success for 1s then complete
      return;
    }

    // Normal progress simulation when operation is not complete
    if (!isComplete && !saved) {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          // Don't go beyond 90% until operation is actually complete
          if (prev >= 90) {
            return 90;
          }
          return prev + 1.5; // Slower progress
        });
      }, 150);

      const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          const nextStep = prev + 1;
          // Don't go to last step until operation is complete
          if (nextStep >= loadingSteps.length - 1) {
            return loadingSteps.length - 2;
          }
          return nextStep;
        });
      }, 1200);

      return () => {
        clearInterval(progressInterval);
        clearInterval(stepInterval);
      };
    }
  }, [isComplete, saved, onComplete, loadingSteps.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 flex items-center justify-center p-6 relative overflow-hidden w-full">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="bg-rose-100 bg-opacity-10"></div>
      </div>

      <div className="text-center max-w-lg w-full z-10">
        {/* Animated Save Icon */}
        <div className="relative mb-12">
          <div className="relative">
            {/* Pulsing Background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 bg-rose-100 rounded-full animate-pulse opacity-40"></div>
              <div className="absolute w-32 h-32 bg-pink-100 rounded-full animate-ping opacity-30"></div>
              <div className="absolute w-24 h-24 bg-rose-200 rounded-full animate-bounce opacity-50"></div>
            </div>

            {/* Central Save Icon */}
            <div className="relative z-10 w-24 h-24 mx-auto bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3">
              <div className="relative">
                {saved ? (
                  <CheckCircle className="w-12 h-12 text-white animate-pulse" />
                ) : (
                  <Save className="w-12 h-12 text-white animate-pulse" />
                )}
                <Heart className="w-6 h-6 text-red-200 absolute -top-1 -right-1 animate-bounce" fill="currentColor" />
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-48">
                {[User, Mail, Pen].map((Icon, index) => (
                  <div
                    key={index}
                    className="absolute animate-spin"
                    style={{
                      top: `${50 + 30 * Math.cos(index * 2 * Math.PI / 3)}%`,
                      left: `${50 + 30 * Math.sin(index * 2 * Math.PI / 3)}%`,
                      animationDuration: `${6 + index}s`,
                      animationDirection: index % 2 === 0 ? 'normal' : 'reverse',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform">
                      <Icon
                        className={`w-5 h-5 ${
                          progress > (index + 1) * 30 ? 'text-green-500' : 'text-rose-300'
                        }`}
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
                  className="absolute w-4 h-4 text-yellow-400 animate-ping"
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
            {saved ? "Profile Updated!" : "Saving Profile"}
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
            <Save className="w-4 h-4" />
            <span className="text-sm">Securing your information</span>
          </div>
          <p className="text-gray-500 text-sm">{saved ? "Your changes have been saved successfully" : "Please wait while we update your profile"}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full blur-sm opacity-60"></div>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600 font-medium">
            {progress.toFixed(0)}% complete
          </div>
        </div>

        {/* Loading Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-3 text-lg font-medium text-gray-800 mb-6 min-h-[32px]">
            <Save className="w-5 h-5 text-rose-500 animate-spin" />
            <span className="transition-all duration-500 ease-in-out">
              {saved ? "Profile updated successfully!" : loadingSteps[currentStep]}
            </span>
          </div>

          <div className="flex justify-center space-x-3">
            {loadingSteps.map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-500 mb-1 ${
                    saved ? 'bg-green-500 scale-125 shadow-lg' :
                    index === currentStep
                      ? 'bg-rose-500 scale-125 shadow-lg'
                      : index < currentStep
                        ? 'bg-rose-400 scale-110'
                        : 'bg-gray-300'
                  }`}
                />
                {index === currentStep && !saved && (
                  <div className="w-1 h-4 bg-gradient-to-b from-rose-500 to-transparent rounded-full animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="mb-8">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <h3 className="font-semibold text-green-800">Success!</h3>
                  <p className="text-sm text-green-600">Your profile has been updated successfully.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Animated Loading Dots */}
        {!saved && (
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
        )}

        {/* Encouraging Message */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2 font-medium">
            {saved ? "Redirecting to dashboard..." : "Almost done..."}
          </p>
          <p className="text-xs text-gray-500">
            {saved ? "✨ Your profile looks great!" : "Keeping your data safe and secure ✨"}
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
            <Heart className="w-4 h-4 text-rose-300" />
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

export default SavingLoading;