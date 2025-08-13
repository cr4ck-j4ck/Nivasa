import React, { useState } from "react";
import {
  Home,
  Building2,
  Warehouse,
  Utensils,
  Ship,
  Bus,
  Landmark,
  Castle,
  Mountain,
  Package,
  Columns3,
  Square,
  Tent,
  Sprout,
  Tractor,
  Hotel,
  Building,
  Sailboat,
  Store,
  School,
  MapPin,
  TreePine,
  Wind
} from "lucide-react";

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  "House": Home,
  "Flat/apartment": Building2,
  "Barn": Warehouse,
  "Bed & breakfast": Utensils,
  "Boat": Ship,
  "Campervan/motorhome": Bus,
  "Casa particular": Landmark,
  "Castle": Castle,
  "Cave": Mountain,
  "Container": Package,
  "Cycladic home": Columns3,
  "Dammuso": Square,
  "Dome": Tent,
  "Earth home": Sprout,
  "Farm": Tractor,
  "Guest house": Hotel,
  "Hotel": Building,
  "Houseboat": Sailboat,
  "Kezhan": Store,
  "Minsu": School,
  "Riad": Landmark,
  "Ryokan": MapPin,
  "Shepherd's hut": Warehouse,
  "Tent": Tent,
  "Tiny home": Home,
  "Tower": Building2,
  "Tree house": TreePine,
  "Trullo": Landmark,
  "Windmill": Wind,
  "Yurt": Tent
};



// Enhanced Card component
interface PlaceTypeCardProps {
  label: string;
  Icon: React.ElementType;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

const PlaceTypeCard: React.FC<PlaceTypeCardProps> = ({ label, Icon, isSelected, onClick, index }) => {
  return (
    <div
      className="relative overflow-hidden p-5 group"
      style={{ 
        animationDelay: `${index * 0.08}s`,
        animation: 'slideInUp 0.6s ease-out forwards'
      }}
    >
      <button 
        className={`
          relative flex flex-col items-center justify-center gap-3 
          rounded-xl p-6 w-full h-32
          transition-all duration-300 ease-out
          transform hover:scale-105 hover:-translate-y-1
          shadow-sm hover:shadow-xl
          ${isSelected 
            ? 'border-2 border-rose-500 bg-gradient-to-br from-rose-50 to-pink-50 shadow-lg' 
            : 'border border-gray-200 bg-white hover:border-gray-300'
          }
          group-hover:bg-gradient-to-br group-hover:from-gray-50 group-hover:to-blue-50
        `}
        onClick={onClick}
        style={{
          animationName: isSelected ? 'pump' : undefined,
          animationDuration: '0.4s',
          animationTimingFunction: 'ease-in-out',
        }}
      >
        {/* Subtle background glow effect */}
        <div className={`
          absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300
          ${isSelected ? 'opacity-100' : 'group-hover:opacity-50'}
          bg-gradient-to-br from-rose-100/50 via-pink-50/30 to-purple-50/20
        `} />
        
        {/* Animated border on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-o-500 opacity duration-300 blur-sm" />
        
        {/* Icon with animation */}
        <div className="relative z-10">
          <Icon 
            className={`
              w-8 h-8 transition-all duration-300
              ${isSelected 
                ? 'text-rose-600 transform scale-110' 
                : 'text-gray-600 group-hover:text-red-600'
              }
            `}
            style={{
              animationName: isSelected ? 'iconPump' : undefined,
              animationDuration: '0.4s',
              animationTimingFunction: 'ease-in-out',
            }}
          />
        </div>
        
        {/* Label */}
        <span className={`
          text-sm font-medium text-center leading-tight relative z-10
          transition-colors duration-300
          ${isSelected 
            ? 'text-rose-700' 
            : 'text-gray-700 group-hover:text-gray-900'
          }
        `}>
          {label}
        </span>
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-rose-500 rounded-full shadow-sm animate-pulse" />
        )}
      </button>
    </div>
  );
};

// Main component
const PlaceType: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const placeTypes = [
    "House", "Flat/apartment", "Barn", "Bed & breakfast", "Boat", "Cabin",
    "Campervan/motorhome", "Casa particular", "Castle", "Cave", "Container",
    "Cycladic home", "Dammuso", "Dome", "Earth home", "Farm", "Guest house",
    "Hotel", "Houseboat", "Kezhan", "Minsu", "Riad", "Ryokan", "Shepherd's hut",
    "Tent", "Tiny home", "Tower", "Tree house", "Trullo", "Windmill", "Yurt"
  ];

  const handleCardClick = (type: string) => {
    setSelectedType(type === selectedType ? null : type);
  };

  return (
    <div className="min-h-fit pb-80 bg-gradient-to-br p-6 w-full">
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes pump {
          0% { transform: scale(1); }
          25% { transform: scale(1.05); }
          50% { transform: scale(0.98); }
          75% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        
        @keyframes iconPump {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.2) rotate(3deg); }
          50% { transform: scale(1.1) rotate(-2deg); }
          75% { transform: scale(1.15) rotate(1deg); }
          100% { transform: scale(1.1) rotate(0deg); }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out;
        }
      `}</style>
      
      {/* Enhanced Heading */}
      <div className="text-center mb-12 animate-fade-in-down">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent mb-4">
          Which of these best describes your place?
        </h1>

      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto">
        {placeTypes.map((type, index) => {
          const Icon = iconMap[type] || Home;
          return (
            <PlaceTypeCard 
              key={type} 
              label={type} 
              Icon={Icon} 
              isSelected={selectedType === type}
              onClick={() => handleCardClick(type)}
              index={index}
            />
          );
        })}
      </div>
      
      {/* Selection Summary */}
      {selectedType && (
        <div className="fixed bottom-40 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-xl border px-8 py-4 animate-fade-in-down">
          <p className="text-lg text-gray-700">
            Selected: <span className="font-semibold text-rose-600">{selectedType}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default PlaceType;