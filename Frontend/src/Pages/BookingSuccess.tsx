import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import {
  CheckCircle,
  Calendar,
  MapPin,
  Users,
  Home,
  Mail,
  Phone,
  Download,
  Share2,
  ArrowRight,
  Sparkles,
  Heart,
  Gift
} from "lucide-react";
import axios from "axios";

interface BookingDetails {
  _id: string;
  bookingId: string;
  listing: {
    title: string;
    gallery: Record<string, string[]>;
    location: {
      address: {
        city: string;
        state: string;
        country: string;
        street: string;
      };
    };
    host: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      profilePicture?: string;
    };
    amenities: string[];
  };
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  pricing: {
    total: number;
    breakdown: {
      basePrice: number;
      nights: number;
      subtotal: number;
      cleaningFee: number;
      serviceFee: number;
      taxes: number;
      discount: number;
    };
  };
  status: string;
  createdAt: string;
}

const BookingSuccess: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to get first image from gallery
  const getFirstImageFromGallery = (gallery: Record<string, string[]>): string => {
    // Try to get from "Bedroom 1" first
    if (gallery["Bedroom 1"] && gallery["Bedroom 1"].length > 0) {
      return gallery["Bedroom 1"][0];
    }
    // If no "Bedroom 1", get the first image from any room
    const firstRoomKey = Object.keys(gallery)[0];
    if (firstRoomKey && gallery[firstRoomKey].length > 0) {
      return gallery[firstRoomKey][0];
    }
    // Fallback to placeholder
    return "/placeholder-image.jpg";
  };

  const fetchBookingDetails = React.useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/bookings/${bookingId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setBooking(response.data.booking);
      } else {
        setError("Booking not found");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      setError("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
      triggerCelebration();
    }
  }, [bookingId, fetchBookingDetails]);

  const triggerCelebration = () => {
    // Initial confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6']
    });

    // Delayed second burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        shapes: ['star'],
        colors: ['#FFD700', '#FFA500', '#FF69B4']
      });
    }, 500);

    // Final sparkle effect
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.8 },
        shapes: ['circle'],
        colors: ['#00FFFF', '#FF00FF', '#FFFF00']
      });
    }, 1000);
  };

  const downloadItinerary = () => {
    // Generate and download PDF itinerary
    const itineraryData = {
      booking: booking,
      generatedAt: new Date().toISOString()
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(itineraryData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `booking-${booking?.bookingId}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const shareBooking = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${booking?.listing.title} booking`,
          text: `I just booked an amazing stay at ${booking?.listing.title}!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Booking link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              rotate: 0,
              scale: 0
            }}
            animate={{
              y: -100,
              rotate: 360,
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatDelay: Math.random() * 5 + 3
            }}
            className="absolute"
          >
            <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full opacity-70" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 10
            }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              
              {/* Sparkle effects around the check */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: Math.cos(i * 45 * Math.PI / 180) * 40,
                    y: Math.sin(i * 45 * Math.PI / 180) * 40
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.5 + i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 4
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Your <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              {booking.listing.title}
            </span> getaway is set!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-xl text-gray-600 mb-2"
          >
            {checkInDate.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} - {checkOutDate.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-lg text-gray-500"
          >
            Booking ID: <span className="font-mono font-semibold">{booking.bookingId}</span>
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {/* Property Image */}
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5 }}
                  src={getFirstImageFromGallery(booking.listing.gallery)}
                  alt={booking.listing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{booking.listing.title}</h3>
                  <p className="flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {booking.listing.location.address.city}, {booking.listing.location.address.state}
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Booking Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-semibold">{nights} nights</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Guests</p>
                        <p className="font-semibold">
                          {booking.guests.adults + booking.guests.children} guests
                          {booking.guests.infants > 0 && `, ${booking.guests.infants} infants`}
                          {booking.guests.pets > 0 && `, ${booking.guests.pets} pets`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Home className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-semibold text-sm">
                          {booking.listing.location.address.street}<br />
                          {booking.listing.location.address.city}, {booking.listing.location.address.state}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Host Information */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Your Host</h4>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                      {booking.listing.host.profilePicture ? (
                        <img
                          src={booking.listing.host.profilePicture}
                          alt={`${booking.listing.host.firstName} ${booking.listing.host.lastName}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold">
                          {booking.listing.host.firstName[0]}{booking.listing.host.lastName[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {booking.listing.host.firstName} {booking.listing.host.lastName}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {booking.listing.host.email}
                        </div>
                        {booking.listing.host.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {booking.listing.host.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities Preview */}
                {booking.listing.amenities.length > 0 && (
                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">What's included</h4>
                    <div className="flex flex-wrap gap-2">
                      {booking.listing.amenities.slice(0, 6).map((amenity, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                      {booking.listing.amenities.length > 6 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          +{booking.listing.amenities.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="space-y-6"
          >
            {/* Price Summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    ${booking.pricing.breakdown.basePrice} × {booking.pricing.breakdown.nights} nights
                  </span>
                  <span>${booking.pricing.breakdown.subtotal}</span>
                </div>
                
                {booking.pricing.breakdown.cleaningFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cleaning fee</span>
                    <span>${booking.pricing.breakdown.cleaningFee}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span>${booking.pricing.breakdown.serviceFee}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span>${booking.pricing.breakdown.taxes}</span>
                </div>
                
                {booking.pricing.breakdown.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${booking.pricing.breakdown.discount}</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total paid</span>
                    <span className="text-green-600">${booking.pricing.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadItinerary}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5" />
                <span>Download Itinerary</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={shareBooking}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Booking</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard')}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span>View Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Gift className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">What's Next?</h3>
              </div>
              
              <div className="space-y-2 text-sm text-yellow-700">
                <p>✉️ Check your email for confirmation details</p>
                <p>📱 Download our mobile app for easy check-in</p>
                <p>🗺️ Explore local recommendations from your host</p>
                <p>⭐ Leave a review after your stay</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Explore More Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready for your next adventure?</h2>
          <p className="text-gray-600 mb-6">Discover more amazing places to stay</p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Heart className="w-5 h-5" />
            <span>Explore More Stays</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingSuccess;