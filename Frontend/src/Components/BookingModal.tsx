import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import axios from "axios";
import confetti from "canvas-confetti";
import { DatesStep, ReviewStep, SuccessStep } from "./BookingModal/BookingSteps";
import type { GuestCount, PricingBreakdown, BookingStep } from "../@Types/booking";
import type { Variants } from "framer-motion";
import type { IlistingObj,IfullListing } from "@/@Types/interfaces";
import reserveStore from "@/Store/Reserve";
import { useShallow } from "zustand/react/shallow";
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: IlistingObj | IfullListing;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, listing }) => {
  const [step, setStep] = useState<BookingStep>('dates');
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string>("");
  const [promoCode, setPromoCode] = useState("");
  const [notes, setNotes] = useState("");
  
  // Get dates and guests from reserveStore
  const { bookingDates, setBookingDates, guests: storeGuests, setGuests: setStoreGuests } = reserveStore(useShallow(state => ({
    bookingDates: state.bookingDates,
    setBookingDates: state.setBookingDates,
    guests: state.guests,
    setGuests: state.setGuests
  })));
  
  const { checkIn, checkOut } = bookingDates;
  
  const controls = useAnimation();
  const sparkleRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Particle animation for sparkles
  const createSparkles = useCallback(() => {
    if (sparkleRef.current) {
      const rect = sparkleRef.current.getBoundingClientRect();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: ['#0EA5E9', '#FCD34D', '#F59E0B', '#10B981'],
        shapes: ['star'],
        scalar: 0.8,
      });
    }
  }, []);

  // Particle explosion animation
  const createParticleExplosion = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0EA5E9', '#FCD34D', '#F59E0B', '#10B981'],
    });
  }, []);

  const calculatePricing = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/bookings/calculate-pricing`, {
        params: {
          listingId: listing._id,
          checkIn: checkIn?.toISOString(),
          checkOut: checkOut?.toISOString(),
          guests: JSON.stringify(storeGuests),
          promoCode: promoCode || undefined,
        },
      });

      if (response.data.success) {
        setPricing(response.data.pricing);
        if (response.data.pricing.discount > 0) {
          createSparkles();
        }
      }
    } catch (error) {
      console.error("Error calculating pricing:", error);
    }
  }, [listing._id, checkIn, checkOut, storeGuests, promoCode, createSparkles]);

  // Calculate pricing when dates or guests change
  useEffect(() => {
    if (checkIn && checkOut) {
      calculatePricing();
    }
  }, [checkIn, checkOut, storeGuests, calculatePricing]);

  // Reset step when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('dates');
    }
  }, [isOpen]);

  const handleGuestChange = (type: keyof GuestCount, increment: boolean) => {
    const newCount = increment ? storeGuests[type] + 1 : Math.max(0, storeGuests[type] - 1);
    if (type === 'adults' && newCount === 0) return; // At least 1 adult required
    
    const totalGuests = type === 'adults' ? newCount : storeGuests.adults + (type === 'children' ? newCount : storeGuests.children);
    // TODO instead of 10, use listing.capacity.totalGuests if available
    if (totalGuests > 10 && increment) return;
    
    setStoreGuests({ [type]: newCount });
  };

  const handleContinueToReview = () => {
    if (!checkIn || !checkOut || !pricing) return;
    
    setStep('review');
    
    // Animate transition
    controls.start({
      x: -100,
      opacity: 0,
      transition: { duration: 0.3 }
    }).then(() => {
      controls.start({
        x: 0,
        opacity: 1,
        transition: { duration: 0.3 }
      });
    });
    
    createParticleExplosion();
  };

  const handleConfirmBooking = async () => {
    if (!checkIn || !checkOut || !pricing) return;
    
    setLoading(true);
    try {
      // Create booking
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/bookings`,
        {
          listingId: listing._id,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          guests: storeGuests,
          promoCode: promoCode || undefined,
          notes: notes || undefined,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setBookingId(response.data.booking._id);
        setStep('success');
        
        // Trigger celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        createParticleExplosion();
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      const errorMessage = error instanceof Error && 'response' in error && 
        typeof error.response === 'object' && error.response !== null &&
        'data' in error.response && typeof error.response.data === 'object' &&
        error.response.data !== null && 'message' in error.response.data
        ? String(error.response.data.message)
        : "Failed to create booking";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Modal animations
  const modalVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 100,
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
      transition: { duration: 0.3 }
    }
  };

  const waveVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 1.5, ease: "easeInOut" }
    }
  };

  const sparkleVariants: Variants = {
    initial: { scale: 0, rotate: 0 },
    animate: { 
      scale: [0, 1, 0], 
      rotate: [0, 180, 360],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop with blur */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Wave SVG Background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 800">
          <motion.path
            d="M0,400 Q300,200 600,400 T1200,400 L1200,800 L0,800 Z"
            fill="url(#waveGradient)"
            variants={waveVariants}
            initial="hidden"
            animate="visible"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#FCD34D" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Modal Content */}
        <motion.div
          ref={modalRef}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-100">
            <motion.button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>
            
            <div className="flex items-center gap-4">
              <motion.div
                className="w-16 h-16 rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={listing.gallery["Bedroom 1"][0] || listing.gallery["Living Room"][0] || listing.gallery["Exterior"][0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{listing.title}</h2>
                <p className="text-gray-600">{listing.location.address.city}, {listing.location.address.state}</p>
              </div>
            </div>

            {/* Floating sparkles */}
            <div className="absolute top-2 right-16">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${i * 20}px`,
                    top: `${i * 10}px`,
                  }}
                  variants={sparkleVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: i * 0.2 }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <motion.div
              animate={controls}
              className="space-y-6"
            >
              {step === 'dates' && (
                <DatesStep
                  checkIn={checkIn}
                  checkOut={checkOut}
                  setBookingDates={setBookingDates}
                  guests={storeGuests}
                  onGuestChange={handleGuestChange}
                  pricing={pricing}
                  promoCode={promoCode}
                  setPromoCode={setPromoCode}
                  notes={notes}
                  setNotes={setNotes}
                  onContinue={handleContinueToReview}
                  loading={loading}
                  listing={listing}
                  sparkleRef={sparkleRef}
                />
              )}

              {step === 'review' && (
                <ReviewStep
                  booking={{
                    listing,
                    checkIn: checkIn!,
                    checkOut: checkOut!,
                    guests: storeGuests,
                    pricing: pricing!,
                    promoCode,
                    notes
                  }}
                  onConfirm={handleConfirmBooking}
                  onBack={() => setStep('dates')}
                  loading={loading}
                />
              )}

              {step === 'success' && (
                <SuccessStep
                  booking={{
                    _id: bookingId,
                    listing,
                    checkIn: checkIn!,
                    checkOut: checkOut!,
                    guests: storeGuests,
                    pricing: pricing!,
                  }}
                  onClose={onClose}
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;