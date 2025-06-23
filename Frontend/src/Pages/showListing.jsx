import { useParams } from "react-router-dom";
import Gallery from "@/Components/Listings/showPage_Components/gallery";
import Description from "@/Components/Listings/showPage_Components/listingDesc";
import { useEffect, useState } from "react";
import { getListingData } from "@/Services/lisitngService";
import "./showListing.css";
import Skeleton from "react-loading-skeleton";
import SeatReservationBox from "./../Components/Listings/showPage_Components/reserve";
import ListingContext from "@/Context/context";

export default function () {
  const { listingId } = useParams({});
  const [listingObj, setlistingObj] = useState(null);
  useEffect(() => {
    getListingData(listingId).then((data) => {
      setlistingObj(data.data);
    });
  }, []);

  return (
    <ListingContext.Provider value={listingObj}>
      <div className="w-full sm:max-w-[85vw] md:max-w-[92vw] lg:max-w-[95vw] 3xl:max-w-[80vw] pt-15 pl-3 bg-red-400 relative">
        <h1 className="text-3xl showHead mb-6 pl-2 md:pl-10">
          {listingObj ? listingObj.title : <Skeleton />}
        </h1>
        <Gallery />
        <div className="flex">
          {listingObj ? <Description /> : ""}
          {listingObj ? <SeatReservationBox /> : ""}          
        </div>
      </div>
    </ListingContext.Provider>
  );
}
