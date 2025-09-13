import { motion } from "framer-motion";
import { Upload, Image, MapPin, Home, CheckCircle } from "lucide-react";

interface LoadingScreenProps {
  currentStep: string;
}

const LoadingScreen = ({ currentStep }: LoadingScreenProps) => {
  const steps = [
    { id: "uploading", label: "Uploading images", icon: Upload },
    { id: "processing", label: "Processing images", icon: Image },
    { id: "location", label: "Setting location", icon: MapPin },
    { id: "creating", label: "Creating listing", icon: Home },
    { id: "finalizing", label: "Finalizing details", icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
      >
        {/* Main Loading Animation */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <div className="w-full h-full border-4 border-gray-200 border-t-black rounded-full"></div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-800 mb-2"
          >
            Creating Your Listing
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            Please wait while we set up your property...
          </motion.p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? "bg-gray-100 border-l-4 border-black" 
                    : isCompleted 
                    ? "bg-green-50 border-l-4 border-green-500" 
                    : "bg-gray-50"
                }`}
              >
                <motion.div
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                  className={`p-2 rounded-full ${
                    isActive 
                      ? "bg-black text-white" 
                      : isCompleted 
                      ? "bg-green-500 text-white" 
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <Icon size={16} />
                </motion.div>
                
                <span className={`font-medium ${
                  isActive 
                    ? "text-black" 
                    : isCompleted 
                    ? "text-green-700" 
                    : "text-gray-500"
                }`}>
                  {step.label}
                </span>
                
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto"
                  >
                    <CheckCircle size={16} className="text-green-500" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-gray-800 to-black h-2 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;