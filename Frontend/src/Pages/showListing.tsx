import { useParams } from "react-router-dom";
import Gallery from "@/Components/Listings/showPage_Components/Gallery/gallery";
import Description from "@/Components/Listings/showPage_Components/Description/listingDesc";
import React, { useEffect } from "react";
import { getListingData } from "@/Services/lisitngService";
import "./showListing.css";
import Skeleton from "react-loading-skeleton";
import SeatReservationBox from "../Components/Listings/showPage_Components/reserve";
import ShowReview from "@/Components/Listings/showPage_Components/Reviews/review";
import Map from "@/Components/Listings/showPage_Components/Map";
import { useListingStore, type IlistingState } from "@/Store/Listing";
import { useShallow } from "zustand/react/shallow";

const ShowListing = (): React.JSX.Element => {
  const { listingId } = useParams();
  const { setListingObj, listingObj } = useListingStore(
    useShallow((state: IlistingState) => ({
      setListingObj: state.setListingObj,
      listingObj: state.listingObj,
    }))
  );
  useEffect(() => {
    if (listingId) {
      getListingData(listingId).then((data) => {
        setListingObj(data.data);
      });
    }
  });

  return (
    <div className="w-full sm:max-w-[97vw] md:max-w-[92vw] lg:max-w-[95vw] 3xl:max-w-[80vw] pl-3 top-[3rem] relative ">
      <h1 className="text-3xl showHead mb-6 pl-2 md:pl-10">
        {listingObj ? listingObj.title : <Skeleton />}
      </h1>
      <Gallery />
      {listingObj ? (
        <>
          <div className="flex bottomLine relative pb-5 xl:w-[90%] w-full xl:mx-auto">
            <Description />
            <SeatReservationBox />
          </div>
          <div className="showReviews">
            <ShowReview />
          </div>
          <div className="showMap flex flex-col w-[90%] border-t mt-15 mb-5 border-gray-400 mx-auto">
            <h1 className="mt-10 mb-5 text-4xl text-center">Where you'll be</h1>
            <Map />
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default ShowListing;
