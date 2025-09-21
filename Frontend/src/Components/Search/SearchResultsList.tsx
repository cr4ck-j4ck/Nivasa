import { useState } from "react";
import { type  IlistingObj } from "@/@Types/interfaces";
import { Heart, Star, Users, Bed, Bath, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/Components/ui/button";

interface SearchResultsListProps {
  listings: IlistingObj[];
  selectedListing: IlistingObj | null;
  onListingClick: (listingId: string) => void;
  onListingHover: (listing: IlistingObj | null) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  } | null;
  onPageChange: (page: number) => void;
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({
  listings,
  selectedListing,
  onListingClick,
  onListingHover,
  pagination,
  onPageChange
}) => {
  const [likedListings, setLikedListings] = useState<Set<string>>(new Set());

  const handleLikeToggle = (listingId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newLikedListings = new Set(likedListings);
    if (newLikedListings.has(listingId)) {
      newLikedListings.delete(listingId);
    } else {
      newLikedListings.add(listingId);
    }
    setLikedListings(newLikedListings);
  };

  const getMainImage = (listing: IlistingObj): string => {
    if (listing.gallery && Object.keys(listing.gallery).length > 0) {
      const firstRoom = Object.values(listing.gallery)[0];
      if (firstRoom && firstRoom.length > 0) {
        return firstRoom[0];
      }
    }
    return '/placeholder-property.jpg';
  };

  const formatPrice = (listing: IlistingObj): string => {
    const weekdayPrice = listing.pricing?.weekdayPrice || 0;
    return `₹${weekdayPrice.toLocaleString()}`;
  };

  return (
    <div className="h-[80vh] flex flex-col min-w-full">
      {/* Results List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {listings.map((listing) => (
          <div
            key={listing._id}
            id={`listing-${listing._id}`}
            className={`bg-white rounded-lg shadow-sm border transition-all duration-200 cursor-pointer hover:shadow-md ${
              selectedListing?._id === listing._id 
                ? 'ring-2 ring-[#d93553] border-[#d93553]' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onListingClick(listing._id)}
            onMouseEnter={() => onListingHover(listing)}
            onMouseLeave={() => onListingHover(null)}
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="relative w-full sm:w-80 h-48 sm:h-56 flex-shrink-0">
                <img
                  src={getMainImage(listing)}
                  alt={listing.title}
                  className="w-full h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-property.jpg';
                  }}
                />
                
                {/* Like Button */}
                <button
                  onClick={(e) => handleLikeToggle(listing._id, e)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      likedListings.has(listing._id) || listing.isLiked
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 sm:p-6">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {listing.title}
                      </h3>
                      <div className="flex items-center space-x-1 ml-4">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {listing.location?.address?.city}, {listing.location?.address?.state}
                      </span>
                    </div>

                    {/* Room Type */}
                    <p className="text-sm text-gray-600 mb-3">{listing.roomType}</p>

                    {/* Capacity */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{listing.capacity?.guests} guests</span>
                      </div>
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{listing.capacity?.bedrooms} bedrooms</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{listing.capacity?.bathrooms} bathrooms</span>
                      </div>
                    </div>

                    {/* Amenities Preview */}
                    {listing.amenities && listing.amenities.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {listing.amenities.slice(0, 3).map((amenity, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {amenity}
                            </span>
                          ))}
                          {listing.amenities.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              +{listing.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-xl font-bold text-gray-900">
                        {formatPrice(listing)}
                      </span>
                      <span className="text-gray-600 ml-1">/ night</span>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onListingClick(listing._id);
                      }}
                      className="bg-[#d93553] hover:bg-[#fe3b5f] text-white"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-700">
            Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
            {pagination.totalCount} results
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                const isCurrentPage = pageNum === pagination.currentPage;
                
                return (
                  <Button
                    key={pageNum}
                    variant={isCurrentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className={isCurrentPage ? "bg-[#d93553] hover:bg-[#fe3b5f]" : ""}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              {pagination.totalPages > 5 && (
                <>
                  <span className="text-gray-500">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.totalPages)}
                  >
                    {pagination.totalPages}
                  </Button>
                </>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="flex items-center"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultsList;