import { useState,useEffect,  } from "react";
import { Home,Star,Heart,MapPin, type LucideIcon } from "lucide-react";
// Floating Background Component


// TypeScript Interfaces
interface FloatingElement {
  id: number;
  icon: LucideIcon;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

const FloatingBackground: React.FC = () => {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const floatingElements: FloatingElement[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      icon: [Home, Star, Heart, MapPin][i % 4],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2
    }));
    setElements(floatingElements);
  }, []);

  return (
    <>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {elements.map((element) => {
          const IconComponent = element.icon;
          return (
            <div
              key={element.id}
              className="absolute opacity-10 animate-float"
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                animationDelay: `${element.delay}s`,
                animationDuration: `${element.duration}s`
              }}
            >
              <IconComponent className="w-8 h-8 text-rose-400" />
            </div>
          );
        })}
      </div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-rose-200 to-orange-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
    </>
  );
};

export default FloatingBackground;