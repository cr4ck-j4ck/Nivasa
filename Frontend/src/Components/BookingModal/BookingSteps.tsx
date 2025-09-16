import React from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Shield, Star, Check, Heart, Home } from "lucide-react";
import DatePicker from "react-datepicker";
import type { GuestCount, PricingBreakdown, BookingListing, BookingData } from "../../@Types/booking";

interface DatesStepProps {
  checkIn: Date | null;
  checkOut: Date | null;
  setCheckIn: (date: Date | null) => void;
  setCheckOut: (date: Date | null) => void;
  guests: GuestCount;
  onGuestChange: (type: keyof GuestCount, increment: boolean) => void;
  pricing: PricingBreakdown | null;
  promoCode: string;
  setPromoCode: (code: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  onContinue: () => void;
  loading: boolean;
  listing: BookingListing;
  sparkleRef: React.RefObject<HTMLDivElement | null>;
}

interface ReviewStepProps {
  booking: BookingData;
  onConfirm: () => void;
  onBack: () => void;
  loading: boolean;
}

interface SuccessStepProps {
  booking: BookingData;
  onClose: () => void;
}

export const DatesStep: React.FC<DatesStepProps> = ({
  checkIn,
  checkOut,
  setCheckIn,
  setCheckOut,
  guests,
  onGuestChange,
  pricing,
  promoCode,
  setPromoCode,
  notes,
  setNotes,
  onContinue,
  loading,
  listing,
  sparkleRef
}) => {
  const totalGuests = guests.adults + guests.children;

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left Column - Date & Guest Selection */}
      <div className="space-y-6">
        {/* Date Picker */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Select dates</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
              <DatePicker
                selected={checkIn}
                onChange={setCheckIn}
                selectsStart
                startDate={checkIn}
                endDate={checkOut}
                minDate={new Date()}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholderText="Add date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
              <DatePicker
                selected={checkOut}
                onChange={setCheckOut}
                selectsEnd
                startDate={checkIn}
                endDate={checkOut}
                minDate={checkIn || new Date()}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholderText="Add date"
              />
            </div>
          </div>
        </motion.div>

        {/* Guest Selector */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Guests</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(guests).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div>
                  <p className="font-medium capitalize">{type}</p>
                  <p className="text-sm text-gray-500">
                    {type === 'adults' && 'Ages 13 or above'}
                    {type === 'children' && 'Ages 2-12'}
                    {type === 'infants' && 'Under 2'}
                    {type === 'pets' && 'Bringing a service animal?'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-50"
                    onClick={() => onGuestChange(type as keyof GuestCount, false)}
                    disabled={count === 0 || (type === 'adults' && count === 1)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    -
                  </motion.button>
                  <span className="w-8 text-center">{count}</span>
                  <motion.button
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-50"
                    onClick={() => onGuestChange(type as keyof GuestCount, true)}
                    disabled={totalGuests >= listing.maxGuests && (type === 'adults' || type === 'children')}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    +
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Promo Code */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700">Promo code</label>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter promo code"
          />
        </motion.div>

        {/* Notes */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700">Special requests</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="Any special requests for your stay?"
          />
        </motion.div>
      </div>

      {/* Right Column - Pricing */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        {pricing && (
          <div className="bg-gradient-to-br from-blue-50 to-yellow-50 p-6 rounded-2xl border border-blue-100">
            <h3 className="text-lg font-semibold mb-4">Price breakdown</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>${listing.pricing.weekdayPrice} × {pricing.nights} nights</span>
                <span>${pricing.basePrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Cleaning fee</span>
                <span>${pricing.cleaningFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>${pricing.serviceFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>${pricing.taxes}</span>
              </div>
              {pricing.discount > 0 && (
                <motion.div
                  className="flex justify-between text-green-600"
                  ref={sparkleRef}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                >
                  <span>Discount</span>
                  <span>-${pricing.discount}</span>
                </motion.div>
              )}
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <motion.span
                  key={pricing.totalPrice}
                  initial={{ scale: 1.2, color: "#10B981" }}
                  animate={{ scale: 1, color: "#000000" }}
                  transition={{ duration: 0.3 }}
                >
                  ${pricing.totalPrice}
                </motion.span>
              </div>
            </div>
          </div>
        )}

        {/* Reserve Button */}
        <motion.button
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-yellow-400 text-white font-semibold rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onContinue}
          disabled={!checkIn || !checkOut || !pricing || loading}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 20px 40px rgba(14, 165, 233, 0.3)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating booking...
            </div>
          ) : (
            "Continue to payment"
          )}
        </motion.button>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            <span>Secure payment</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>Trusted host</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const ReviewStep: React.FC<ReviewStepProps> = ({ booking, onConfirm, onBack, loading }) => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          Review your booking
        </h2>
        <motion.button
          onClick={onBack}
          className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </motion.button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Booking Details */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Property Card */}
          <div className="p-6 border border-gray-200 rounded-2xl bg-gradient-to-br from-white to-gray-50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-500" />
              Your destination
            </h3>
            
            <div className="flex gap-4 mb-4">
              <motion.img
                src={booking.listing.images[0]}
                alt={booking.listing.title}
                className="w-20 h-20 rounded-xl object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{booking.listing.title}</h4>
                <p className="text-gray-600 flex items-center gap-1">
                  📍 {booking.listing.location.address.city}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{booking.listing.rating || 4.8}</span>
                  <span className="text-sm text-gray-500">({booking.listing.reviewCount || 124} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="p-6 border border-gray-200 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              Trip details
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-medium">{booking.checkIn.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-medium">{booking.checkOut.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{booking.pricing.nights} nights</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Guests:</span>
                <span className="font-medium">{booking.guests.adults + booking.guests.children} guests</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Summary */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-6 border border-gray-200 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50">
            <h3 className="text-lg font-semibold mb-4">Payment summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>${booking.listing.pricing.weekdayPrice} × {booking.pricing.nights} nights</span>
                <span>${booking.pricing.basePrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Cleaning fee</span>
                <span>${booking.pricing.cleaningFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>${booking.pricing.serviceFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>${booking.pricing.taxes}</span>
              </div>
              {booking.pricing.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${booking.pricing.discount}</span>
                </div>
              )}
              <hr className="border-gray-200" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${booking.pricing.totalPrice}</span>
              </div>
            </div>
          </div>

          <motion.button
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-400 text-white font-semibold rounded-2xl shadow-lg disabled:opacity-50"
            onClick={onConfirm}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Confirming booking...
              </div>
            ) : (
              "Confirm booking"
            )}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const SuccessStep: React.FC<SuccessStepProps> = ({ booking, onClose }) => {
  return (
    <motion.div
      className="text-center space-y-6"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", damping: 15 }}
      >
        <Check className="w-12 h-12 text-green-500" />
      </motion.div>

      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking confirmed!</h2>
        <p className="text-gray-600">Your reservation has been successfully created</p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
        <h3 className="font-semibold mb-4">Booking details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Booking ID:</span>
            <span className="font-mono">{booking._id}</span>
          </div>
          <div className="flex justify-between">
            <span>Property:</span>
            <span>{booking.listing.title}</span>
          </div>
          <div className="flex justify-between">
            <span>Dates:</span>
            <span>{booking.checkIn.toLocaleDateString()} - {booking.checkOut.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Total paid:</span>
            <span className="font-semibold">${booking.pricing.totalPrice}</span>
          </div>
        </div>
      </div>

      <motion.button
        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl shadow-lg"
        onClick={onClose}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Close
      </motion.button>
    </motion.div>
  );
};