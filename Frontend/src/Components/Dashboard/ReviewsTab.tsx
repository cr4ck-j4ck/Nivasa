import { Star } from "lucide-react";
import userData from "./Data/UserData";
import { reviews } from "./Data/review";

const ReviewsTab = () => {
  // Optionally duplicate data to simulate more reviews (like original file did)
  const allReviews = reviews.concat(reviews);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          All Reviews ({userData.totalReviews})
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-lg font-bold">{userData.rating}</span>
            <span className="text-gray-600">overall rating</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {allReviews.map((review, index) => (
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
    </div>
  );
};

export default ReviewsTab;
