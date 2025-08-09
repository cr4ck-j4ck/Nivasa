import "./listingCard.css";
import { Heart } from "lucide-react";
import { useState } from "react";
import UserStore from "@/Store/UserStore";
import { useNavigate } from "react-router-dom";

interface IlistingCard {
  src: string;
  city: string;
  price: number;
  id: string;
}

export default function ListingCard({ src, city, price, id }: IlistingCard) {
  const [liked, setLiked] = useState(false); // ❤️ Track heart status
  const [animate, setAnimate] = useState(false); // 🎬 Track animation
  const user = UserStore((state) => state.user);
  const navigate = useNavigate();
  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    if (user) {
      setLiked((prev) => !prev);

      // Trigger animation
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300); // Reset after animation duration
    }else{
      navigate("/auth")
    }
  };

  return (
    <div className="card rounded-2xl relative">
      <a href={`/room/${id}`} target="_blank">
        <div>
          {src ? (
            <img
              src={src}
              alt="image"
              className="showImg rounded-2xl h-[11.3vw] w-full"
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <p className="text-m font-semibold">Home in {city}</p>
        <p className="text-xs text-[#6e6e6e]">₹{price} for 1 night</p>

        {/* ❤️ Heart Button */}
        <button
          onClick={toggleLike}
          className={`absolute right-3 top-2 transition-transform ${
            animate ? "scale-115" : "scale-100"
          }`}
        >
          <Heart
            color="white"
            fill={liked ? "red" : "transparent"}
            className="drop-shadow-lg"
          />
        </button>
      </a>
    </div>
  );
}
