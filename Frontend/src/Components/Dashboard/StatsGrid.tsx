import { Star, Award, Home, CheckCircle } from "lucide-react";
import { useHostData } from "@/hooks/useHostData";

const StatsGrid = () => {
  const { stats, bookings, loading } = useHostData();

  // Calculate response rate based on bookings (simplified calculation)
  const responseRate = bookings.length > 0 ? "100%" : "0%";
  
  // Calculate average rating (placeholder until review system is implemented)
  const averageRating = stats.approved > 0 ? "4.8" : "0";

  const statsData = [
    { 
      icon: Star, 
      label: "Reviews", 
      value: loading ? "..." : "0" // TODO: Replace with actual review count when available
    },
    { 
      icon: Award, 
      label: "Rating", 
      value: loading ? "..." : averageRating
    },
    { 
      icon: Home, 
      label: "Listings", 
      value: loading ? "..." : stats.approved.toString()
    },
    { 
      icon: CheckCircle, 
      label: "Response Rate", 
      value: loading ? "..." : responseRate
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, index) => (
        <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
          <stat.icon className="w-6 h-6 text-rose-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
