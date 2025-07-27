import { useParams } from "react-router-dom";
import Gallery from "@/Components/Listings/ShowPage/Gallery/gallery";
import Description from "@/Components/Listings/ShowPage/Description/listingDesc";
import React, { useEffect } from "react";
import { getListingData } from "@/Services/listing.api";
import "./showListing.css";
import Skeleton from "react-loading-skeleton";
import SeatReservationBox from "../Components/Listings/ShowPage/reserve";
import ShowReview from "@/Components/Listings/ShowPage/Reviews/review";
import Map from "@/Components/Listings/ShowPage/Map";
import { useListingStore, type IlistingState } from "@/Store/ListingStore";
import { useShallow } from "zustand/react/shallow";
import HostProfile from "@/Components/Listings/ShowPage/Description/HostProfile";

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
  },[]);

  return (
    <div className="w-full sm:max-w-[97vw] md:max-w-[92vw] lg:max-w-[95vw] 3xl:max-w-[80vw] pl-3 top-[3rem] relative">
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
          <div className="showMap flex flex-col text-center w-[90%] border-t border-b pb-15 mt-15 mb-5 border-gray-400 mx-auto">
            <h1 className="mt-10 mb-3 text-5xl showHead">Where you'll be</h1>
            <h4 className="my-2 text-2xl showHead">{listingObj.location.city}, {listingObj.location.country}</h4>
            <Map />
          </div>
          <div className="MeetYourHost text-center"> 
            <h1 className="mt-10 mb-8 text-4xl showHead">Meet Your Host</h1>
            <HostProfile/>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default ShowListing;
