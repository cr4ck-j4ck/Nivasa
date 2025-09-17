import { Eye, MoreHorizontal, Star, Clock, CheckCircle, XCircle, AlertCircle, Home } from "lucide-react";
import { useHostData } from "@/hooks/useHostData";
import { Link } from "react-router-dom";
import { getFirstImageFromGallery } from "@/utils/galleryUtils";

const ListingsTab = () => {
  const { listings, loading, error } = useHostData();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'draft':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your listings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">Failed to load listings</p>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
        <Link 
          to="/become-host"
          className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
        >
          Add New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No listings yet</h3>
          <p className="text-gray-600 mb-6">
            Oops! You haven't created any listings yet. Start hosting by adding your first property.
          </p>
          <Link 
            to="/become-host"
            className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors inline-flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={getFirstImageFromGallery(listing.gallery)}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(listing.status)}`}>
                    {getStatusIcon(listing.status)}
                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <Link 
                    to={`/room/${listing._id}`}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 truncate">{listing.title}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{listing.propertyType}</p>
                <p className="text-gray-500 text-xs mb-2">{listing.location.address.city}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{listing.pricing.weekdayPrice}/night
                  </span>
                  <span className="text-sm text-gray-500">
                    0 reviews
                  </span>
                </div>
                {listing.status === 'rejected' && listing.rejectionReason && (
                  <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                    <strong>Rejection reason:</strong> {listing.rejectionReason}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingsTab;
