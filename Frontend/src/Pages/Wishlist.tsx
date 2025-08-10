import { useState, useEffect } from "react";
import type { IlistingObj } from "@/@Types/interfaces";
import { getWishlist } from "@/Services/user.api";
import ListingCard from "@/Components/Listings/IndexPage/ListingCard";
import WishlistLoading from "./WishlistLoading";

const EnhancedWishlist: React.FC = () => {
  const [data, setData] = useState<IlistingObj[] | null>(null);

  useEffect(() => {
    getWishlist().then((res) => setData(res));
  }, []);

  return (
    <>
    {data ? 
      <div className="min-h-screen p-10 w-full">
      <h1 className="text-4xl font-bold mb-6 text-center wishlistHead">Your Wishlist</h1>

      <div className=" w-[60vw] flex flex-wrap">
        {data?.map((el, i) => (
          <ListingCard
            key={el._id}
            id={el._id}
            index={i}
            city={el.location.city}
            price={el.price}
            hideLike={true}
            src={el.gallery["Bedroom 1"][0]}
            customClass="wishlistCard"
          />
        ))}
      </div>
    </div> : <WishlistLoading/>}
    </>
  );
};

export default EnhancedWishlist;
