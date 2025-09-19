import { useState, useEffect } from "react";
import type { IlistingObj } from "@/@Types/interfaces";
import { getWishlist } from "@/Services/user.api";
import ListingCard from "@/Components/Listings/IndexPage/ListingCard";
import WishlistLoading from "./WishlistLoading";
import { EmptyWishlist } from "@/Components/EmptyWishlist";
const EnhancedWishlist: React.FC = () => {
  const [data, setData] = useState<IlistingObj[] | null | string>(null);

  useEffect(() => {
    getWishlist().then((res) => setData(res));
  }, []);
  if(typeof data === "string"){
    return <EmptyWishlist/>;
  }
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
            city={el.location.address.city}
            price={el.pricing.weekdayPrice}
            isLiked={true}
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
