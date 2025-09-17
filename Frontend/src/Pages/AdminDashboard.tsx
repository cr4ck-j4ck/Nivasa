import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Home,
  MapPin,
  Calendar,
  AlertTriangle,
  Eye
} from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import axios from "axios";

interface PendingListing {
  _id: string;
  title: string;
  description: string;
  propertyType: string;
  typeOfPlace: string;
  createdAt: string;
  images: string[];
  location: {
    address: {
      city: string;
      street?: string;
      state?: string;
    };
  };
  host: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const AdminDashboard: React.FC = () => {
  const [listings, setListings] = useState<PendingListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState<string | null>(null);

  const fetchPendingListings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/admin/pending?page=${currentPage}&limit=10`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setListings(response.data.listings);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching pending listings:", error);
      alert("Failed to fetch pending listings. Make sure you have admin access.");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchPendingListings();
  }, [fetchPendingListings]);

  const handleApprove = async (listingId: string) => {
    try {
      setProcessingId(listingId);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_API}/api/admin/listings/${listingId}/status`,
        { status: "approved" },
        { withCredentials: true }
      );

      if (response.data.success) {
        setListings(prev => prev.filter(listing => listing._id !== listingId));
        alert("Listing approved successfully!");
      }
    } catch (error) {
      console.error("Error approving listing:", error);
      alert("Failed to approve listing");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (listingId: string) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      setProcessingId(listingId);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_API}/api/admin/listings/${listingId}/status`,
        { 
          status: "rejected",
          rejectionReason: rejectionReason
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setListings(prev => prev.filter(listing => listing._id !== listingId));
        setShowRejectionModal(null);
        setRejectionReason("");
        alert("Listing rejected successfully!");
      }
    } catch (error) {
      console.error("Error rejecting listing:", error);
      alert("Failed to reject listing");
    } finally {
      setProcessingId(null);
    }
  };

  const ListingCard = ({ listing }: { listing: PendingListing }) => (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Images */}
          <div className="space-y-2">
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              {listing.images[0] ? (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Home className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            {listing.images.length > 1 && (
              <div className="flex gap-1 overflow-x-auto">
                {listing.images.slice(1, 4).map((img, idx) => (
                  <div key={idx} className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                {listing.images.length > 4 && (
                  <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-xs text-gray-500">+{listing.images.length - 4}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                  {listing.title}
                </h3>
                <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Pending
                </Badge>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                {listing.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>{listing.propertyType} • {listing.typeOfPlace}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.location.address.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{listing.host.firstName} {listing.host.lastName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Submitted {new Date(listing.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Host Contact */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Host Contact:</strong> {listing.host.email}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`/room/${listing._id}`, '_blank')}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              
              <Button
                size="sm"
                onClick={() => handleApprove(listing._id)}
                disabled={processingId === listing._id}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {processingId === listing._id ? "Approving..." : "Approve"}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowRejectionModal(listing._id)}
                disabled={processingId === listing._id}
                className="border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Admin Dashboard - Nivasa</title>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Review and manage pending listings</p>
        </motion.div>

        {/* Content */}
        {listings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No pending listings</h3>
              <p className="text-gray-600">All listings have been reviewed!</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-6">
              {listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold">Reject Listing</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this listing. This will be sent to the host.
            </p>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
              rows={4}
            />
            
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectionModal(null);
                  setRejectionReason("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleReject(showRejectionModal)}
                disabled={!rejectionReason.trim() || processingId === showRejectionModal}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {processingId === showRejectionModal ? "Rejecting..." : "Reject Listing"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;