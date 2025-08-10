import "./listingCard.css";
import { Heart } from "lucide-react";
import { useState } from "react";
import UserStore from "@/Store/UserStore";
import { useNavigate } from "react-router-dom";
import { addToWhislist } from "@/Services/user.api";
import globalStore from "@/Store/Global";

interface IlistingCard {
  src: string;
  city: string;
  price: number;
  id: string;
}
const wishlistSavedMessages = [
  "Saved to your wishlist — looks like you've got a type",
  "That one? Smooth choice. It's all yours... waiting patiently in your wishlist",
  "A perfect match — added to your wishlist with love 💖",
  "Love at first click? It's all yours now 💌",
  "That craving? Yeah, we noticed. It's saved in your wishlist",
];

export default function ListingCard({ src, city, price, id }: IlistingCard) {
  const [liked, setLiked] = useState(false); // ❤️ Track heart status
  const [animate, setAnimate] = useState(false); // 🎬 Track animation
  const user = UserStore((state) => state.user);
  const navigate = useNavigate();
  const setMainPageMsg = globalStore(state => state.setMainPageMsg);
  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    if (user) {
      setLiked((prev) => !prev);
      if(!liked){
        const response = await addToWhislist(id);
        console.log(response);
        setMainPageMsg(wishlistSavedMessages[Math.floor(Math.random() * wishlistSavedMessages.length)])
      }else{
        console.log("Ha iska bhi dekhta hu ")
      }
      // Trigger animation
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300); // Reset after animation duration
    }else{
      navigate(`/auth?errMsg=${"login for wishlist"}`);
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
          className={`absolute right-3 top-2 transition-transform outline ${
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
