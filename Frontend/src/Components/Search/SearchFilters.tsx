import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Search } from 'lucide-react';

interface SearchFiltersProps {
  initialFilters: {
    city?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
  onFilterChange: (filters: {
    city?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  initialFilters,
  onFilterChange
}) => {
  const [filters, setFilters] = useState({
    city: initialFilters.city || '',
    checkIn: initialFilters.checkIn || '',
    checkOut: initialFilters.checkOut || '',
    guests: initialFilters.guests || ''
  });

  // Update local state when initial filters change
  useEffect(() => {
    setFilters({
      city: initialFilters.city || '',
      checkIn: initialFilters.checkIn || '',
      checkOut: initialFilters.checkOut || '',
      guests: initialFilters.guests || ''
    });
  }, [initialFilters]);

  const handleInputChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleClear = () => {
    const clearedFilters = {
      city: '',
      checkIn: '',
      checkOut: '',
      guests: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City Input */}
        <div className="space-y-2">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              id="city"
              value={filters.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Enter city name"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d93553] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Check-in Date */}
        <div className="space-y-2">
          <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700">
            Check-in
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              id="checkIn"
              value={filters.checkIn}
              onChange={(e) => handleInputChange('checkIn', e.target.value)}
              min={today}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d93553] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700">
            Check-out
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              id="checkOut"
              value={filters.checkOut}
              onChange={(e) => handleInputChange('checkOut', e.target.value)}
              min={filters.checkIn || today}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d93553] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
            Guests
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              id="guests"
              value={filters.guests}
              onChange={(e) => handleInputChange('guests', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d93553] focus:border-transparent outline-none transition-all appearance-none bg-white"
            >
              <option value="">Any number</option>
              <option value="1">1 guest</option>
              <option value="2">2 guests</option>
              <option value="3">3 guests</option>
              <option value="4">4 guests</option>
              <option value="5">5 guests</option>
              <option value="6">6 guests</option>
              <option value="7">7 guests</option>
              <option value="8">8 guests</option>
              <option value="9">9+ guests</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          Clear all
        </button>
        
        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2 bg-[#d93553] text-white rounded-lg hover:bg-[#fe3b5f] transition-colors font-medium"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.city || filters.checkIn || filters.checkOut || filters.guests) && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {filters.city && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#d93553] text-white">
                City: {filters.city}
              </span>
            )}
            {filters.checkIn && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Check-in: {new Date(filters.checkIn).toLocaleDateString()}
              </span>
            )}
            {filters.checkOut && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Check-out: {new Date(filters.checkOut).toLocaleDateString()}
              </span>
            )}
            {filters.guests && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {filters.guests} {filters.guests === '1' ? 'guest' : 'guests'}
              </span>
            )}
          </div>
        </div>
      )}
    </form>
  );
};

export default SearchFilters;