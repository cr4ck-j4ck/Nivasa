
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  X,
  Calendar,
  Users,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Check,
  Heart
} from "lucide-react";
import confetti from "canvas-confetti";
import axios from "axios";
import { useNavigate } from "react-router-dom";


interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    _id: string;
    title: string;
    images: string[];
    location: {
      address: {
        city: string;
        state: string;
        country: string;
      };
    };
    pricing: {
      basePrice: number;
      cleaningFee?: number;
      serviceFee?: number;
    };
    amenities: string[];
    host: {
      firstName: string;
      lastName: string;
      profilePicture?: string;
    };
    maxGuests: number;
    rating?: number;
    reviewCount?: number;
  };
}

interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface PriceBreakdown {
  basePrice: number;
  nights: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number;
  discount: number;
  total: number;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, listing }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState<GuestCounts>({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0
  });
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Animation variants
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 100
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 300,
        duration: 0.6
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 100,
      transition: {
        duration: 0.3
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: { duration: 0.2 }
    }
  };


  const calculatePricing = useCallback(async () => {
    if (!checkIn || !checkOut) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/bookings/pricing`,
        {
          params: {
            listingId: listing._id,
            checkIn: checkIn.toISOString(),
            checkOut: checkOut.toISOString(),
            guests: guests.adults + guests.children,
          }
        }
      );

      if (response.data.success) {
        setPriceBreakdown(response.data.pricing);
        if (response.data.pricing.discount > 0) {
          triggerConfetti();
        }
      }
    } catch (error) {
      console.error("Error calculating pricing:", error);
    }
  }, [checkIn, checkOut, listing._id, guests.adults, guests.children]);

  // Calculate pricing when dates or guests change
  useEffect(() => {
    if (checkIn && checkOut) {
      calculatePricing();
    }
  }, [checkIn, checkOut, calculatePricing]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0EA5E9', '#FCD34D', '#10B981']
    });
  };

  const triggerSparkles = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      shapes: ['star'],
      colors: ['#FFD700', '#FFA500', '#FF69B4']
    });
  };

  const updateGuestCount = (type: keyof GuestCounts, increment: boolean) => {
    setGuests(prev => {
      const newCount = increment ? prev[type] + 1 : Math.max(0, prev[type] - 1);
      
      // Ensure at least 1 adult
      if (type === 'adults' && newCount < 1) return prev;
      
      // Check max guests limit
      const totalGuests = type === 'adults' || type === 'children' 
        ? (prev.adults + prev.children + (increment ? 1 : -1))
        : prev.adults + prev.children;
      
      if (totalGuests > listing.maxGuests && increment) return prev;

      return { ...prev, [type]: newCount };
    });

    // Trigger haptic feedback animation
    triggerSparkles();
  };

  const handleBooking = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/bookings/new`,
        {
          listingId: listing._id,
          checkIn: checkIn?.toISOString(),
          checkOut: checkOut?.toISOString(),
          guests: guests,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        triggerConfetti();
        setCurrentStep(3); // Move to success step
        setTimeout(() => {
            navigate(`/booking-success/${response.data.booking.bookingId}`);
        }, 2000);
      } else {
        setError(response.data.message || "Booking failed. Please try again.");
      }
    } catch (error) {
        const errorMessage =
        error instanceof Error &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : "Booking failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 2) {
        handleBooking();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Step 1: Date Selection
  const DateSelectionStep = () => (
    <motion.div
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="inline-block mb-4"
        >
          <Calendar className="w-12 h-12 text-blue-500" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">When would you like to stay?</h3>
        <p className="text-gray-600">Select your check-in and check-out dates</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Check-in</label>
          <div className="relative">
            <DatePicker
              selected={checkIn}
              onChange={(date) => setCheckIn(date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={new Date()}
              placeholderText="Select check-in date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              calendarClassName="shadow-xl border-0 rounded-xl"
              dayClassName={(date) => 
                date.getTime() === checkIn?.getTime() || date.getTime() === checkOut?.getTime()
                  ? "bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  : "hover:bg-blue-100 rounded-full transition-colors"
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Check-out</label>
          <div className="relative">
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              selectsEnd
              startDate={checkIn}
              endDate={checkOut}
              minDate={checkIn || new Date()}
              placeholderText="Select check-out date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              calendarClassName="shadow-xl border-0 rounded-xl"
              dayClassName={(date) => 
                date.getTime() === checkIn?.getTime() || date.getTime() === checkOut?.getTime()
                  ? "bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  : "hover:bg-blue-100 rounded-full transition-colors"
              }
            />
          </div>
        </div>
      </div>

      {checkIn && checkOut && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 p-4 rounded-lg"
        >
          <p className="text-blue-800 font-medium">
            {Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights
          </p>
          <p className="text-blue-600 text-sm">
            {checkIn.toLocaleDateString()} - {checkOut.toLocaleDateString()}
          </p>
        </motion.div>
      )}
    </motion.div>
  );

  // Step 2: Guest Selection
  const GuestSelectionStep = () => (
    <motion.div
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="inline-block mb-4"
        >
          <Users className="w-12 h-12 text-green-500" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Who's coming?</h3>
        <p className="text-gray-600">Add guests to your reservation</p>
      </div>

      <div className="space-y-4">
        {[
          { key: 'adults', label: 'Adults', description: 'Ages 13 or above', icon: Users },
          { key: 'children', label: 'Children', description: 'Ages 2-12', icon: Users },
          { key: 'infants', label: 'Infants', description: 'Under 2', icon: Heart },
          { key: 'pets', label: 'Pets', description: 'Bringing a service animal?', icon: Heart }
        ].map(({ key, label, description, icon: Icon }) => (
          <motion.div
            key={key}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => updateGuestCount(key as keyof GuestCounts, false)}
                disabled={guests[key as keyof GuestCounts] === 0 || (key === 'adults' && guests.adults === 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              
              <span className="w-8 text-center font-medium">
                {guests[key as keyof GuestCounts]}
              </span>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => updateGuestCount(key as keyof GuestCounts, true)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          This place has a maximum of {listing.maxGuests} guests, not including infants.
        </p>
      </div>
    </motion.div>
  );

  // Step 3: Confirmation
  const ConfirmationStep = () => (
    <motion.div
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <motion.div
          animate={{ rotateY: [0, 180, 360] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className="inline-block mb-4"
        >
          <Check className="w-12 h-12 text-green-500" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
        <p className="text-gray-600">You will be redirected shortly.</p>
      </div>
    </motion.div>
  );


  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          ref={modalRef}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              {currentStep > 1 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevStep}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
              )}
              
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {currentStep === 1 && "Select dates"}
                  {currentStep === 2 && "Add guests & Confirm"}
                  {currentStep === 3 && "Confirmed"}
                </h2>
                <p className="text-sm text-gray-500">Step {currentStep} of 2</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: "50%" }}
                animate={{ width: `${(currentStep / 2) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <AnimatePresence mode="wait">
              {currentStep === 1 && <DateSelectionStep />}
              {currentStep === 2 && <GuestSelectionStep />}
              {currentStep === 3 && <ConfirmationStep />}
            </AnimatePresence>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-600 text-sm">{error}</p>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              {priceBreakdown && currentStep < 3 && (
                <div className="text-left">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-bold text-gray-900">${priceBreakdown.total}</p>
                </div>
              )}
              
              <div className="flex space-x-3 ml-auto">
                {currentStep < 3 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextStep}
                    disabled={
                      (currentStep === 1 && (!checkIn || !checkOut)) ||
                      (currentStep === 2 && guests.adults === 0) ||
                      loading
                    }
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {loading ? "Booking..." : currentStep === 2 ? "Confirm Booking" : "Continue"}
                    <ChevronRight className="w-4 h-4 ml-2 inline" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
