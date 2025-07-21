import { useParams } from "react-router-dom";
import Gallery from "@/Components/Listings/showPage_Components/Gallery/gallery"
import Description from "@/Components/Listings/showPage_Components/Description/listingDesc";
import { useEffect, useState } from "react";
import { getListingData } from "@/Services/lisitngService";
import "./showListing.css";
import Skeleton from "react-loading-skeleton";
import SeatReservationBox from "../Components/Listings/showPage_Components/reserve";
import ShowReview from "@/Components/Listings/showPage_Components/Reviews/review";
import Map from "@/Components/Listings/showPage_Components/Map";
import { useListingStore, type IlistingState } from "@/Store/Listing";
import { useShallow } from 'zustand/react/shallow'

export default function () {
  const { listingId } = useParams();
  const { setListingObj, listingObj } = useListingStore(useShallow((state:IlistingState) => ({setListingObj : state.setListingObj,listingObj:state.listingObj})));
  useEffect(() => {
    if (listingId) {
      getListingData(listingId).then((data) => {
        setListingObj(data.data);
      });
    }
  }, [listingId]);


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
            <div className="showMap flex ">
              <Map />
            </div>
          </>
        ) : (
          ""
        )}
      </div>
  );
}
