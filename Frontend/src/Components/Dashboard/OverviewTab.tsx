import { Star, Globe, MessageSquare, TrendingUp, Calendar, Home, Users } from "lucide-react";
import { useHostData } from "@/hooks/useHostData";
import UserStore from "@/Store/UserStore";

const OverviewTab = () => {
  const { reviews, bookings, stats, loading } = useHostData();
  const userData = UserStore(state => state.user);

  // Calculate hosting duration (simplified - from user creation date)
  const getHostingDuration = () => {
    if (!userData?.createdAt) return "New host";
    const createdDate = new Date(userData.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return "New host";
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months hosting`;
    return `${Math.floor(diffDays / 365)}+ years hosting`;
  };

  // Calculate completed stays from bookings
  const completedStays = bookings.filter(booking => booking.status === 'completed').length;

  // Calculate positive feedback percentage
  const positiveReviews = reviews.filter(review => review.rating >= 4).length;
  const positiveFeedbackRate = reviews.length > 0 ? Math.round((positiveReviews / reviews.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading overview...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Recent Reviews */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Reviews</h2>
        {reviews.length === 0 ? (
          <div className="border border-gray-200 rounded-lg p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600">
              Oops! You haven't received any reviews yet. Once guests stay at your properties, their reviews will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {reviews.slice(0, 2).map((review, index) => (
                <div key={review.id || index} className="border border-gray-200 rounded-lg p-6">
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
              Show all {reviews.length} reviews
            </button>
          </>
        )}
      </div>

      {/* Hosting Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Hosting Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg">
            <div className="text-3xl font-bold text-rose-600 mb-2">
              {completedStays}
            </div>
            <div className="text-gray-700">Completed stays</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {getHostingDuration().includes('years') ? getHostingDuration().split(' ')[0] : '0'}
              {getHostingDuration().includes('months') ? 'M' : getHostingDuration().includes('years') ? '+' : ''}
            </div>
            <div className="text-gray-700">
              {getHostingDuration().includes('New') ? 'New host' : 'Years hosting'}
            </div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {positiveFeedbackRate}%
            </div>
            <div className="text-gray-700">Positive feedback</div>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Speaks {userData?.bio ? "English" : "Not specified"}
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Response rate: {bookings.length > 0 ? "100%" : "0%"}
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Responds {bookings.length > 0 ? "within an hour" : "Not available"}
        </div>
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          {stats.approved} active listings
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          {bookings.length} total bookings
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Member since {userData?.createdAt ? new Date(userData.createdAt).getFullYear() : "Recently"}
        </div>
      </div>
    </>
  );
};

export default OverviewTab;
