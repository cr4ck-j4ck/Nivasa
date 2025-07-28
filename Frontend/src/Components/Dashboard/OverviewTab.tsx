import { Star, Globe, MessageSquare, TrendingUp } from "lucide-react";
import userData from "./Data/UserData";
import { reviews } from "./Data/review";

const OverviewTab = () => {
  return (
    <>
      {/* Recent Reviews */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Reviews</h2>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-6">
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
        <button className="mt-4 text-rose-600 hover:text-rose-700 font-medium">
          Show all {userData.totalReviews} reviews
        </button>
      </div>

      {/* Hosting Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Hosting Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg">
            <div className="text-3xl font-bold text-rose-600 mb-2">
              {userData.completedStays}
            </div>
            <div className="text-gray-700">Completed stays</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">5+</div>
            <div className="text-gray-700">Years hosting</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
            <div className="text-gray-700">Positive feedback</div>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Speaks {userData.languages.join(", ")}
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Response rate: {userData.responseRate}
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Responds {userData.responseTime}
        </div>
      </div>
    </>
  );
};

export default OverviewTab;
