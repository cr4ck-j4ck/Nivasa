// components/Amenities.tsx
import React, { useState } from "react";
import {
  Wifi,
  Tv,
  CookingPot,
  WashingMachine as Washer ,
  ParkingCircle,
  ParkingCircleOff,
  Snowflake,
  Briefcase,
  WavesLadder as SwimmingPool,
  Heater as HotTub,
  LayoutGrid,
  Columns4 as Grill,
  Sun,
  Flame,
  Joystick,
  Landmark,
  Piano,
  Dumbbell,
  Waves,
  Umbrella,
  MountainSnow,
  ShowerHead,
  AlarmClock,
  BriefcaseMedical as FirstAidKit,
  FireExtinguisher,
  ShieldAlert,
} from "lucide-react";


interface AmenityCardProps {
  label: string;
  Icon: React.ElementType;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

const AmenityCard: React.FC<AmenityCardProps> = ({
  label,
  Icon,
  isSelected,
  onClick,
  index,
}) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    onClick();
    setTimeout(() => setClicked(false), 400);
  };

  return (
    <div
      className="relative overflow-hidden p-4 group"
      style={{
        animationDelay: `${index * 0.05}s`,
        animation: "slideInUp 0.4s ease-out forwards",
      }}
    >
      <button
  onClick={handleClick}
  className={`relative flex flex-col items-center justify-center w-full h-28 p-4 rounded-xl border text-center transition-all duration-300 ease-in-out
  ${
    isSelected
      ? "border-rose-500 bg-rose-50 shadow-lg"
      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
  }
  ${clicked ? "animate-pump" : ""}
  overflow-hidden
`}
>
        <Icon
          className={`w-6 h-6 mb-2 transition-transform duration-300 ${
            isSelected ? "text-rose-600 scale-110" : "text-gray-600"
          } ${clicked ? "animate-iconPump" : ""}`}
        />
        <span
          className={`text-sm font-medium ${
            isSelected ? "text-rose-700" : "text-gray-700"
          }`}
        >
          {label}
        </span>
        {isSelected && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-rose-500 rounded-full shadow animate-pulse" />
        )}
      </button>
    </div>
  );
};

const Amenities: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleAmenity = (amenity: string) => {
    setSelected((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  const sections = [
    {
      title: "What about these guest favourites?",
      items: [
        { label: "Wifi", icon: Wifi },
        { label: "TV", icon: Tv },
        { label: "Kitchen", icon: CookingPot },
        { label: "Washing machine", icon: Washer },
        { label: "Free parking on premises", icon: ParkingCircle },
        { label: "Paid parking on premises", icon: ParkingCircleOff },
        { label: "Air conditioning", icon: Snowflake },
        { label: "Dedicated workspace", icon: Briefcase },
      ],
    },
    {
      title: "Do you have any standout amenities?",
      items: [
        { label: "Pool", icon: SwimmingPool },
        { label: "Hot tub", icon: HotTub },
        { label: "Patio", icon: LayoutGrid },
        { label: "BBQ grill", icon: Grill },
        { label: "Outdoor dining area", icon: Sun },
        { label: "Firepit", icon: Flame },
        { label: "Pool table", icon: Joystick },
        { label: "Indoor fireplace", icon: Landmark },
        { label: "Piano", icon: Piano },
        { label: "Exercise equipment", icon: Dumbbell },
        { label: "Lake access", icon: Waves },
        { label: "Beach access", icon: Umbrella },
        { label: "Ski-in/out", icon: MountainSnow },
        { label: "Outdoor shower", icon: ShowerHead },
      ],
    },
    {
      title: "Do you have any of these safety items?",
      items: [
        { label: "Smoke alarm", icon: AlarmClock },
        { label: "First aid kit", icon: FirstAidKit },
        { label: "Fire extinguisher", icon: FireExtinguisher },
        { label: "Carbon monoxide alarm", icon: ShieldAlert },
      ],
    },
  ];

  return (
    <div className="min-h-fit p-8 min-w-[60vw] relative top-100 pb-60">
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.96);
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
        .animate-pump {
          animation: pump 0.4s ease-in-out;
        }
        .animate-iconPump {
          animation: iconPump 0.4s ease-in-out;
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out;
        }
      `}</style>

      <h1 className="text-5xl md:text-5xl tracking-tight ChoosePropertyHead font-bold text-center text-zinc-900 mb-14 animate-fade-in-down">
        Tell guests what your place has to offer
      </h1>

      {sections.map((section, i) => (
        <div key={i} className="mb-16 relative">
          <h2 className="text-xl md:text-2xl font-semibold text-zinc-800 mb-6">
            {section.title}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {section.items.map((item, index) => (
              <AmenityCard
                key={item.label}
                label={item.label}
                Icon={item.icon}
                isSelected={selected.includes(item.label)}
                onClick={() => toggleAmenity(item.label)}
                index={index}
              />
            ))}
          </div>
        </div>
      ))}

    </div>
  );
};

export default Amenities;
