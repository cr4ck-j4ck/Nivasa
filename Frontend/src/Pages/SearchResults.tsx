import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Nav from "@/Layout/Nav";
import SearchResultsList from "@/Components/Search/SearchResultsList";
import SearchResultsMap from "@/Components/Search/SearchResultsMap";
import SearchFilters from "@/Components/Search/SearchFilters";
import CustomAlert from "@/Components/CustomAlert";
import globalStore from "@/Store/Global";
import { searchListings } from "@/Services/listingService";
import { type IlistingObj } from "@/@Types/interfaces";
import { Loader2, MapPin, List, Filter } from "lucide-react";

interface SearchParams {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  page?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

const SearchResults = (): React.JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const mainPageMsg = globalStore((state) => state.mainPageMsg);
  const setMainPageMsg = globalStore((state) => state.setMainPageMsg);

  const [listings, setListings] = useState<IlistingObj[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedListing, setSelectedListing] = useState<IlistingObj | null>(null);

  // Extract search parameters
  const city = searchParams.get('city') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '';
  const page = searchParams.get('page') || '1';

  // Fetch search results
  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: SearchParams = {};
      if (city) params.city = city;
      if (checkIn) params.checkIn = checkIn;
      if (checkOut) params.checkOut = checkOut;
      if (guests) params.guests = guests;
      if (page) params.page = page;

      const response = await searchListings(params);
      
      if (response.success) {
        setListings(response.listings);
        setPagination(response.pagination);
      } else {
        setError('Failed to fetch search results');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [city, checkIn, checkOut, guests, page]);

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  // Handle filter changes
  const handleFilterChange = (filters: SearchParams) => {
    const newParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        newParams.set(key, value);
      }
    });
    
    // Reset to page 1 when filters change
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  // Handle listing selection from map
  const handleListingSelect = (listing: IlistingObj) => {
    setSelectedListing(listing);
    // Scroll to the listing in the list view
    const listingElement = document.getElementById(`listing-${listing._id}`);
    if (listingElement) {
      listingElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Handle listing click to navigate to details
  const handleListingClick = (listingId: string) => {
    window.open(`/room/${listingId}`, '_blank');
  };

  if (loading) {
    return (
      <>
        <Nav position="fixed top-0" />
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#d93553]" />
            <p className="text-gray-600">Searching for properties...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav position="fixed top-0" />
      <div className="pt-24 min-h-screen bg-gray-50 w-full">
        {mainPageMsg && (
          <CustomAlert
            title="Search"
            message={mainPageMsg}
            variant="success"
            setFunc={() => setMainPageMsg(null)}
          />
        )}

        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Search Header */}
        <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {city ? `Properties in ${city}` : 'Search Results'}
                </h1>
                {pagination && (
                  <span className="text-gray-600">
                    {pagination.totalCount} properties found
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="hidden md:flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <List className="h-4 w-4" />
                    <span>List</span>
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'map'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Map</span>
                  </button>
                </div>

                {/* Filters Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Search Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <SearchFilters
                  initialFilters={{
                    city,
                    checkIn,
                    checkOut,
                    guests
                  }}
                  onFilterChange={handleFilterChange}
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto sm:px-6 lg:px-8 py-6 px-4">
          {listings.length === 0 && !loading ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or explore different locations.
              </p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 bg-[#d93553] text-white rounded-lg hover:bg-[#fe3b5f] transition-colors"
              >
                Back to Home
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)] min-w-full">
              {/* List View */}
              <div className={`${viewMode === 'map' ? 'hidden lg:block' : ''}`}>
                <SearchResultsList
                  listings={listings}
                  selectedListing={selectedListing}
                  onListingClick={handleListingClick}
                  onListingHover={setSelectedListing}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </div>

              {/* Map View */}
              <div className={`${viewMode === 'list' ? 'hidden lg:block' : ''} h-[75vh]`}>
                <SearchResultsMap
                  listings={listings}
                  selectedListing={selectedListing}
                  onListingSelect={handleListingSelect}
                  onListingClick={handleListingClick}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResults;