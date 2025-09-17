import { Star, MessageSquare } from "lucide-react";
import { useHostData } from "@/hooks/useHostData";

const ReviewsTab = () => {
  const { reviews, loading, error } = useHostData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">Failed to load reviews</p>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          All Reviews ({reviews.length})
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-lg font-bold">0</span>
            <span className="text-gray-600">overall rating</span>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600 mb-6">
            Oops! You haven't received any reviews yet. Once guests stay at your properties and leave reviews, they'll appear here.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <h4 className="font-medium text-blue-900 mb-2">Tips to get your first review:</h4>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• Provide excellent hospitality</li>
              <li>• Keep your property clean and well-maintained</li>
              <li>• Respond quickly to guest messages</li>
              <li>• Follow up with guests after their stay</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div
              key={`${review.id}-${index}`}
              className="border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={review.avatar}
                  alt={review.guest}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900">{review.guest}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
