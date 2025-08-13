import React, { useState } from "react";
import { Home, DoorOpen, Users } from "lucide-react";

interface Option {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
}

const PlaceTypeSelector: React.FC = () => {
  const [selected, setSelected] = useState<string>("room");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const options: Option[] = [
    {
      id: "entire",
      title: "An entire place",
      description: "Guests have the whole place to themselves.",
      icon: <Home className="w-7 h-7" />,
      accent: "bg-emerald-500"
    },
    {
      id: "room",
      title: "A room",
      description: "Guests have their own room in a home, plus access to shared spaces.",
      icon: <DoorOpen className="w-7 h-7" />,
      accent: "bg-violet-500"
    },
    {
      id: "shared",
      title: "A shared room in a hostel",
      description: "Guests sleep in a shared room in a professionally managed hostel with staff on-site 24/7.",
      icon: <Users className="w-7 h-7" />,
      accent: "bg-amber-500"
    },
  ];

  const handleOptionClick = (id: string): void => {
    setSelected(id);
  };

  return (
    <div className="min-h-fit bg-zinc-50 flex items-center justify-center p-6 w-[100vw]">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(30px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
        
        .shimmer-line {
          position: relative;
          overflow: hidden;
        }
        
        .shimmer-line::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transform: translateX(-100%);
          animation: shimmer 2s infinite;
        }
      `}</style>
      
      <div className="w-full max-w-4xl relative top-30 pb-30">
        {/* Header Section */}
        <div className="text-center mb-16 animate-slide-up">
          
          <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 mb-6 tracking-tight">
            What type of place will
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900">
              guests have?
            </span>
          </h1>
          
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Choose the option that best describes your space
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid gap-6 mb-12">
          {options.map((option, index) => (
            <div
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              onMouseEnter={() => setHoveredCard(option.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`
                group relative cursor-pointer animate-slide-up
                transform transition-all duration-500 ease-out
                ${hoveredCard === option.id ? 'scale-[1.02] -translate-y-2' : ''}
                ${selected === option.id ? 'scale-[1.01]' : ''}
              `}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Main Card */}
              <div className={`
                relative bg-white rounded-3xl p-8 border-2 transition-all duration-500
                ${selected === option.id 
                  ? 'border-zinc-900 shadow-2xl' 
                  : 'border-zinc-200 shadow-lg hover:shadow-xl'
                }
                ${hoveredCard === option.id ? 'shadow-2xl' : ''}
              `}>
                
                {/* Accent Line */}
                <div className={`
                  absolute top-0 left-8 right-8 h-1 rounded-full transition-all duration-500
                  ${selected === option.id ? option.accent : 'bg-zinc-100'}
                  ${selected === option.id ? 'shimmer-line' : ''}
                `} />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-6 flex-1">
                    {/* Icon Container */}
                    <div className={`
                      relative flex items-center justify-center w-16 h-16 rounded-2xl
                      transition-all duration-500 transform
                      ${selected === option.id 
                        ? 'bg-zinc-900 text-white scale-110' 
                        : 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200'
                      }
                      ${hoveredCard === option.id ? 'rotate-12' : ''}
                    `}>
                      {option.icon}
                      
                      {/* Selection indicator dot */}
                      {selected === option.id && (
                        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${option.accent} flex items-center justify-center`}>
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <h3 className={`
                        text-2xl font-semibold mb-3 transition-colors duration-300
                        ${selected === option.id ? 'text-zinc-900' : 'text-zinc-800'}
                      `}>
                        {option.title}
                      </h3>
                      <p className={`
                        text-lg leading-relaxed transition-colors duration-300
                        ${selected === option.id ? 'text-zinc-700' : 'text-zinc-600'}
                      `}>
                        {option.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Selection Circle */}
                  <div className={`
                    relative w-6 h-6 rounded-full border-2 transition-all duration-300 ml-6
                    ${selected === option.id 
                      ? 'border-zinc-900 bg-zinc-900' 
                      : 'border-zinc-300 group-hover:border-zinc-400'
                    }
                  `}>
                    {selected === option.id && (
                      <>
                        <div className="absolute inset-1 bg-white rounded-full" />
                        <div className="absolute inset-0 rounded-full border-2 border-zinc-900 pulse-ring" />
                      </>
                    )}
                  </div>
                </div>
                
                {/* Hover Effect Line */}
                <div className={`
                  absolute bottom-0 left-0 h-1 bg-zinc-900 rounded-full transition-all duration-500
                  ${hoveredCard === option.id ? 'w-full' : 'w-0'}
                `} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PlaceTypeSelector;