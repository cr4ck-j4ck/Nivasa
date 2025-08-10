// @ts-nocheck

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, Home, Shield } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";

interface EmailVerificationSuccessProps {
  userEmail?: string;
  onRedirect?: () => void;
  redirectDelay?: number;
}

export default function EmailVerificationSuccess({
  userEmail = "user@example.com",
  onRedirect,
  redirectDelay = 8,
}: EmailVerificationSuccessProps) {
  const [countdown, setCountdown] = useState(redirectDelay);
  const [isComplete, setIsComplete] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsComplete(true);
          clearInterval(timer);
          // Simulate redirect
          setTimeout(() => {
            onRedirect?.();
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onRedirect]);

  const checkmarkVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.8, ease: "easeInOut" },
        opacity: { duration: 0.3 },
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-fit w-full bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-xl relative z-10"
      >
        <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-2xl overflow-hidden">
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="relative mx-auto w-24 h-24">
                {/* Outer Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                  variants={pulseVariants}
                  animate="pulse"
                />

                {/* Inner Circle */}
                <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                  {/* Animated Checkmark */}
                  <svg
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      d="M7 13l3 3 7-7"
                      stroke="#059669"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      variants={checkmarkVariants}
                      initial="hidden"
                      animate="visible"
                    />
                  </svg>
                </div>

                {/* Floating particles */}
                <div className="absolute left-4 top-10">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-green-400 rounded-full"
                      style={{
                        top: `${
                          15 + Math.sin((i * 60 * Math.PI) / 180) * 70
                        }px`, // ⬅️ increased radius
                        left: `${
                          27 + Math.cos((i * 60 * Math.PI) / 180) * 70
                        }px`, // ⬅️ increased radius
                      }}
                      animate={{
                        y: [-10, -20, -10],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div variants={itemVariants} className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Email Verified! ✅
              </h1>
              <p className="text-gray-600 text-lg">
                Your email has been successfully verified
              </p>
            </motion.div>

            {/* Email Display */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">
                    {userEmail}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Security Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full">
                <Shield className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600 font-medium">
                  Secure Verification
                </span>
              </div>
            </motion.div>

            {/* Countdown Section */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-4 border border-pink-200">
                <p className="text-gray-700 mb-3">
                  You are being redirected to Login in
                </p>

                <div className="flex items-center justify-center space-x-2">
                  <div className="relative">
                    <motion.div
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center"
                      animate={{
                        scale: countdown > 0 ? [1, 1.1, 1] : 1,
                      }}
                      transition={{
                        duration: 1,
                        repeat: countdown > 0 ? Number.POSITIVE_INFINITY : 0,
                      }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={countdown}
                          className="text-2xl font-bold text-white"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 1.5, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {countdown}
                        </motion.span>
                      </AnimatePresence>
                    </motion.div>

                    {/* Progress Ring */}
                    <svg className="absolute inset-0 w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                        fill="none"
                      />
                      <motion.circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 1 }}
                        animate={{ pathLength: countdown / redirectDelay }}
                        transition={{ duration: 1, ease: "linear" }}
                      />
                    </svg>
                  </div>
                  <span className="text-gray-600">seconds</span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="space-y-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => {
                    onRedirect?.();
                  }}
                  className="w-full h-12 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-medium text-lg shadow-lg transition-all duration-200"
                  disabled={isComplete}
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go to Login Page Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>

            </motion.div>

            {/* Footer */}
            <motion.div
              variants={itemVariants}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <p className="text-sm text-gray-500">
                Welcome to{" "}
                <span className="font-semibold text-pink-600">Nivasa</span> -
                Your journey starts now!
              </p>
            </motion.div>
          </CardContent>
        </Card>

        {/* Completion Animation */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center"
                >
                  <ArrowRight className="w-8 h-8 text-white" />
                </motion.div>
                <p className="text-lg font-semibold text-gray-900">
                  Redirecting...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
