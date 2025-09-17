
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Shield, Star, Check, Heart, Home } from "lucide-react";
import type { GuestCount, PricingBreakdown, BookingData } from "../../@Types/booking";
import type { IlistingObj,IfullListing } from "@/@Types/interfaces";
import { Calendar02 } from "@/Components/Calendar02";
import reserveStore from "@/Store/Reserve";
import { useShallow } from "zustand/react/shallow";
import type { IBookingDates } from "@/@Types/interfaces";
import "../Listings/ShowPage/reserve.css";

interface DatesStepProps {
  checkIn: Date | null;
  checkOut: Date | null;
  setBookingDates: (toUpdate: Partial<IBookingDates>) => void;
  guests: GuestCount;
  onGuestChange: (type: keyof GuestCount, increment: boolean) => void;
  pricing: PricingBreakdown | null;
  promoCode: string;
  setPromoCode: (code: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  onContinue: () => void;
  loading: boolean;
  listing: IlistingObj | IfullListing;
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
  setBookingDates,
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
  
  // Local state for calendar UI (similar to reserve component)
  const [showCalendar, setShowCalendar] = useState(false);
  const [focusInput, setFocusInput] = useState<"input1" | "input2" | null>(null);
  const [blurSecondInput, setBlurSecondInput] = useState(false);
  
  const inputRef = useRef<(HTMLDivElement | null)[]>([]);
  const calRef = useRef<HTMLDivElement | null>(null);
  const dateDiv = useRef<HTMLDivElement | null>(null);
  
  // Get store functions for calendar
  const { setDate, setShowCalendar: setStoreShowCalendar, setFocusInput: setStoreFocusInput, date: selectedDate } = reserveStore(useShallow(state => ({
    setDate: state.setDate,
    setShowCalendar: state.setShowCalendar,
    setFocusInput: state.setFocusInput,
    date: state.date
  })));
  
  useEffect(() => {
    if (focusInput && showCalendar) {
      setBlurSecondInput(checkIn ? false : true);
    }
  }, [focusInput, showCalendar, checkIn]);

  // Convert selected date to checkIn/checkOut based on focusInput
  useEffect(() => {
    if (selectedDate) {
      if (focusInput === "input1") {
        // Setting check-in date
        setBookingDates({
          checkIn: selectedDate,
          checkOut: null // Reset checkout when changing checkin
        });
        // Move to checkout input
        setFocusInput("input2");
        setStoreFocusInput("input2");
        setBlurSecondInput(false);
      } else if (focusInput === "input2" && checkIn) {
        // Setting check-out date
        if (selectedDate > checkIn) {
          setBookingDates({
            checkOut: selectedDate
          });
          // Close calendar after selecting checkout
          setShowCalendar(false);
          setStoreShowCalendar(false);
          setFocusInput(null);
          setStoreFocusInput(null);
        } else {
          // If selected date is before checkin, set it as new checkin
          setBookingDates({
            checkIn: selectedDate,
            checkOut: null
          });
          setFocusInput("input2");
          setStoreFocusInput("input2");
        }
      }
      // Clear the selected date after processing
      setDate(undefined);
    }
  }, [selectedDate, focusInput, checkIn, setBookingDates, setDate, setFocusInput, setStoreFocusInput, setShowCalendar, setStoreShowCalendar]);
  
  useEffect(() => {
    const func1 = (e: KeyboardEvent) => {
      if (e.code === "Escape" && showCalendar) {
        setShowCalendar(false);
        setStoreShowCalendar(false); // Sync with store
        setFocusInput(null);
        setStoreFocusInput(null); // Sync with store
      }
    };
    const func2 = (e: MouseEvent) => {
      if (
        calRef.current &&
        dateDiv.current &&
        showCalendar &&
        !dateDiv.current.contains(e.target as Node) &&
        !calRef.current.contains(e.target as Node)
      ) {
        setShowCalendar(false);
        setStoreShowCalendar(false); // Sync with store
        setFocusInput(null);
        setStoreFocusInput(null); // Sync with store
      }
    };

    document.addEventListener("keydown", func1);
    document.addEventListener("click", func2);

    return () => {
      document.removeEventListener("keydown", func1);
      document.removeEventListener("click", func2);
    };
  }, [showCalendar]);
  
  function formatDate(date?: Date | null): string {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function handleRowClick(e: React.MouseEvent<HTMLDivElement>) {
    if (inputRef.current[0]?.contains(e.target as Node)) {
      setFocusInput("input1");
      setStoreFocusInput("input1"); // Sync with store
    } else {
      const focusTarget = checkIn ? "input2" : "input1";
      setFocusInput(focusTarget);
      setStoreFocusInput(focusTarget); // Sync with store
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left Column - Date & Guest Selection */}
      <div className="space-y-6">
        {/* Date Selection - Same as Reserve Component */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Select dates</h3>
            {checkIn && checkOut && (
              <div className="ml-auto flex items-center gap-1 text-green-600 text-sm">
                <Check className="w-4 h-4" />
                <span>Dates selected</span>
              </div>
            )}
          </div>
          
          {/* Date Inputs */}
          <div
            className="md:flex relative dateInputs"
            onClick={(e) => {
              setShowCalendar(true);
              setStoreShowCalendar(true); // Sync with store
              handleRowClick(e);
            }}
            ref={dateDiv}
          >
            {/* Check-in */}
            <div
              className={`${focusInput === "input1" ? "border-2 border-blue-500" : "border border-gray-300"
                } p-3 rounded-l-xl cursor-pointer md:w-1/2 bg-white hover:border-gray-400 transition-colors`}
              ref={(el) => { (inputRef.current[0] = el!) }}
              id="input1"
            >
              <p className="text-xs font-medium text-gray-700 mb-1">CHECK-IN</p>
              <input
                type="text"
                readOnly
                value={formatDate(checkIn)}
                placeholder="Add Date"
                className="cursor-pointer outline-none w-full text-sm"
              />
            </div>

            {/* Check-out */}
            <div
              className={`${focusInput === "input2" ? "border-2 border-blue-500" : "border border-gray-300 md:border-l-0"
                } p-3 rounded-r-xl ${blurSecondInput ? "bg-gray-50 opacity-60" : "bg-white"} cursor-pointer md:w-1/2 hover:border-gray-400 transition-colors`}
              ref={(el) => { (inputRef.current[1] = el!) }}
              id="input2"
            >
              <p className="text-xs font-medium text-gray-700 mb-1">CHECKOUT</p>
              <input
                type="text"
                placeholder="Add Date"
                className="cursor-pointer outline-none w-full text-sm"
                readOnly
                value={formatDate(checkOut)}
              />
            </div>
          </div>

          {/* Calendar */}
          {showCalendar && (
            <div
              className="relative mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-lg"
              ref={calRef}
            >
              <div className="mb-4">
                <p className="font-semibold text-lg">Select Dates</p>
                <p className="text-sm text-gray-600">
                  Add your travel dates for exact pricing
                </p>
              </div>

              <Calendar02 />

              <div className="flex w-full justify-end mt-4 gap-3">
                <button
                  className="text-sm underline text-gray-600 hover:text-gray-800 font-medium"
                  onClick={() => {
                    setDate(undefined);
                    setBookingDates({
                      checkIn: null,
                      checkOut: null
                    });
                    setFocusInput("input1");
                    setStoreFocusInput("input1"); // Sync with store
                    setBlurSecondInput(true);
                  }}
                >
                  Clear dates
                </button>
                <button
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  onClick={() => {
                    setShowCalendar(false);
                    setStoreShowCalendar(false); // Sync with store
                    setFocusInput(null);
                    setStoreFocusInput(null); // Sync with store
                    setBlurSecondInput(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
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
            <div className="ml-auto text-sm text-gray-600">
              {totalGuests} guest{totalGuests !== 1 ? 's' : ''}
              {guests.infants > 0 && `, ${guests.infants} infant${guests.infants !== 1 ? 's' : ''}`}
              {guests.pets > 0 && `, ${guests.pets} pet${guests.pets !== 1 ? 's' : ''}`}
            </div>
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
                src={booking.listing.gallery["Bedroom 1"][0]}
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