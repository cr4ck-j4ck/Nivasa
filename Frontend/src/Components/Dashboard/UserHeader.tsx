import { Award, Calendar, CheckCircle, Edit3, MapPin, Settings } from "lucide-react";
import UserStore from "@/Store/UserStore";


const UserHeader = () => {
  const userData = UserStore(state => state.user)
  if(!userData){
    return <h1>kuch nahi hai yaha</h1>
  }
  return (
    <div className="flex flex-col lg:flex-row gap-8 mb-8">
      {/* Left: Avatar and Superhost */}
      <div className="flex-shrink-0">
        <div className="relative">
          <img
            src={userData.avatar}
            alt={userData.fullName}
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
          {userData.superhost && (
            <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Award className="w-3 h-3" />
              Superhost
            </div>
          )}
        </div>
      </div>

      {/* Right: Name, Location, Buttons */}
      <div className="flex-grow">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{userData.firstName} {userData.lastName}</h1>
              {userData.verified && <CheckCircle className="w-6 h-6 text-blue-500" />}
            </div>
            <div className="flex items-center gap-4 text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {userData.location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {userData.createdAt}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
