import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  User,
  Star,
  Download,
  MessageCircle,
  Home,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Filter,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input"
import axios from "axios";

interface Booking {
  _id: string;
  bookingId: string;
  listing: {
    _id: string;
    title: string;
    images: string[];
    location: {
      address: {
        city: string;
        state: string;
      };
    };
  };
  checkIn: string;
  checkOut: string;
  totalGuests: number;
  nights: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  priceBreakdown: {
    basePrice: number;
    cleaningFee: number;
    serviceFee: number;
    taxes: number;
  };
}

type FilterType = "all" | "upcoming" | "past" | "cancelled";

const UserDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/bookings/user?page=${currentPage}&limit=10&status=${filter}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setBookings(response.data.bookings);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      case "completed":
        return <Star className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.listing.location.address.city
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    const isUpcoming = checkInDate > new Date();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
        className="group"
      >
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-4 gap-0">
              {/* Image */}
              <div className="relative h-48 md:h-full overflow-hidden">
                {booking.listing.images[0] ? (
                  <motion.img
                    src={booking.listing.images[0]}
                    alt={booking.listing.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    whileHover={{ scale: 1.05 }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <Home className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <Badge
                    className={`${getStatusColor(
                      booking.status
                    )} flex items-center gap-1 shadow-lg`}
                  >
                    {getStatusIcon(booking.status)}
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="md:col-span-3 p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {booking.listing.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {booking.listing.location.address.city},{" "}
                        {booking.listing.location.address.state}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{booking.totalPrice.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="font-medium">Check-in</p>
                      <p>{checkInDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="font-medium">Check-out</p>
                      <p>{checkOutDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="font-medium">Guests</p>
                      <p>{booking.totalGuests} guests</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="font-medium">Nights</p>
                      <p>{booking.nights} nights</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Booking ID: {booking.bookingId}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        window.open(`/room/${booking.listing._id}`, "_blank")
                      }
                      className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Eye className="w-4 h-4" />
                      View Property
                    </Button>

                    {booking.status === "confirmed" && isUpcoming && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Voucher
                      </Button>
                    )}

                    {booking.status === "completed" && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white flex items-center gap-2"
                      >
                        <Star className="w-4 h-4" />
                        Write Review
                      </Button>
                    )}

                    {booking.status === "confirmed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Contact Host
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <title>My Bookings - Nivasa</title>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-600">Manage your travel reservations</p>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between"
        >
          <div className="flex flex-wrap gap-2">
            {["all", "upcoming", "past", "cancelled"].map((filterOption) => (
              <Button
                key={filterOption}
                size="sm"
                variant={filter === filterOption ? "default" : "outline"}
                onClick={() => setFilter(filterOption as FilterType)}
                className={`${
                  filter === filterOption
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "hover:bg-blue-50"
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </Button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-80"
            />
          </div>
        </motion.div>

        {/* Bookings List */}
        <AnimatePresence mode="wait">
          {filteredBookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="p-12 text-center bg-gradient-to-br from-white to-gray-50">
                <CardContent>
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No bookings found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Start planning your next adventure!"}
                  </p>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    Explore Properties
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BookingCard booking={booking} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-2 mt-8"
          >
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="hover:bg-blue-50"
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-sm text-gray-600 flex items-center">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="hover:bg-blue-50"
            >
              Next
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
