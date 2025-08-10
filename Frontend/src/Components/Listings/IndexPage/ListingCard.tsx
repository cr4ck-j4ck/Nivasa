import { motion } from "framer-motion";
import "./listingCard.css";
import { Heart } from "lucide-react";
import { useState } from "react";
import UserStore from "@/Store/UserStore";
import { useNavigate } from "react-router-dom";
import { addToWhislist ,removeFromWishlist } from "@/Services/user.api";
import globalStore from "@/Store/Global";

interface IlistingCard {
  src: string;
  city: string;
  price: number;
  id: string;
  index?: number; // 🆕 Added index prop
  customClass:string,
  hideLike?:boolean
  isLiked?:boolean
}

const wishlistSavedMessages = [
  "Saved to your wishlist — looks like you've got a type",
  "That one? Smooth choice. It's all yours... waiting patiently in your wishlist",
  "A perfect match — added to your wishlist with love 💖",
  "Love at first click? It's all yours now 💌",
  "That craving? Yeah, we noticed. It's saved in your wishlist",
];

export default function ListingCard({ src, city, isLiked=false,price, id, index = 0 ,customClass,hideLike=false}: IlistingCard) {
  const [liked, setLiked] = useState(isLiked);
  const [animate, setAnimate] = useState(false);
  const user = UserStore((state) => state.user);
  const navigate = useNavigate();
  const setMainPageMsg = globalStore((state) => state.setMainPageMsg);

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      setLiked((prev) => !prev);
      if (!liked) {
        const response = await addToWhislist(id);
        console.log(response)
        setMainPageMsg(wishlistSavedMessages[Math.floor(Math.random() * wishlistSavedMessages.length)]);
      } else {
        const response = await removeFromWishlist(id);
        console.log(response)
        setMainPageMsg("Listing Removed from wishlist Succesfully!!")
      }
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
    } else {
      navigate(`/auth?errMsg=${"login for wishlist"}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: (index % 5) * 0.08 + Math.floor(index / 5) * 0.05 // 🌀 Wave delay
      }}
      className={`${customClass} rounded-2xl relative`}
    >
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

        {hideLike ? "" : <button
          onClick={toggleLike}
          className={`absolute z-1 right-3 top-2 transition-transform outline-none ${
            animate ? "scale-115" : "scale-100"
          }`}
        >
          <Heart
            color="white"
            fill={liked ? "red" : "transparent"}
            className="drop-shadow-lg"
          />
        </button>}
      </a>
    </motion.div>
  );
}
