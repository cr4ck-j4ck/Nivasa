import { Eye, MoreHorizontal, Star } from "lucide-react";
import { listings } from "./Data/listing";

const ListingsTab = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
        <button className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors">
          Add New Listing
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{listing.title}</h3>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{listing.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2">{listing.type}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  {listing.price}/night
                </span>
                <span className="text-sm text-gray-500">
                  {listing.reviews} reviews
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingsTab;
