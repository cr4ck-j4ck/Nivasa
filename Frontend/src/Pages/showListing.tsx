import { useParams } from "react-router-dom";
import Gallery from "@/Components/Listings/ShowPage/Gallery/gallery";
import Description from "@/Components/Listings/ShowPage/Description/listingDesc";
import React, { useEffect, useState } from "react";
import { getListingData } from "@/Services/listing.api";
import "./Pages.css";
import Skeleton from "react-loading-skeleton";
import { Heart } from "lucide-react";
import SeatReservationBox from "@/Components/Listings/ShowPage/reserve";
import ShowReview from "@/Components/Listings/ShowPage/Reviews/review";
import Map from "@/Components/Listings/ShowPage/Map";
import { useListingStore, type IlistingState } from "@/Store/ListingStore";
import { useShallow } from "zustand/react/shallow";
import HostProfile from "@/Components/Listings/ShowPage/Description/HostProfile";
import { addToWhislist, removeFromWishlist } from "@/Services/user.api";
import Nav from "@/Layout/Nav";
import BookingModal from "@/Components/BookingModal";
import MobileGallery from "@/Components/Listings/ShowPage/Gallery/mobileGallery";
import useMediaQuery from "@/hooks/useMediaQuery";

const ShowListing = (): React.JSX.Element => {
  const { listingId } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 46.25rem)");
  const toggleSave = () => {
    setAnimate(true);
    if (isSaved && listingObj) {
      removeFromWishlist(listingObj?._id);
      setIsSaved(false);
      setTimeout(() => {
        setAnimate(false);
      }, 300);
    } else if (listingObj) {
      setIsSaved(true);
      addToWhislist(listingObj?._id);
      setTimeout(() => {
        setAnimate(false);
      }, 300);
    }
  };
  const { setListingObj, listingObj } = useListingStore(
    useShallow((state: IlistingState) => ({
      setListingObj: state.setListingObj,
      listingObj: state.listingObj,
    }))
  );
  useEffect(() => {
    if (listingObj && listingObj.isLiked) {
      setIsSaved(true);
    }
  }, [listingObj]);
  useEffect(() => {
    if (listingId) {
      getListingData(listingId).then((data) => {
        setListingObj(data.data);
      });
    }
  }, [listingId, setListingObj]);

  return (
    <>
      <Nav></Nav>
      <title>{listingObj?.title ?? "Loading listing..."}</title>
      <div className="w-full sm:max-w-[97vw] md:max-w-[92vw] lg:max-w-[95vw] 3xl:max-w-[80vw] pl-3 top-[3rem] relative pb-20">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl showHead mb-6 pl-2 md:pl-10 z-50">
            {listingObj ? listingObj.title : <Skeleton />}
          </h1>
          <button
            onClick={toggleSave}
            className="saveListingButton mr-10 bg-gray-100 w-24 px-4 h-10 items-center mb-4 rounded-2xl flex justify-evenly hover:bg-gray-200 hover:scale-105 duration-300 relative  z-50"
          >
            <Heart
              className={`mr-2 cursor-pointer transition duration-300 ${
                animate ? "scale-115" : "scale-100"
              } ${
                isSaved
                  ? "fill-red-500 text-red-500"
                  : "fill-none text-gray-500"
              }`}
            />
            Save
          </button>
        </header>
        {isMobile ? <MobileGallery /> : <Gallery />}
        {listingObj ? (
          <>
            <div className="flex flex-col lg:flex-row gap-12 bottomLine relative pb-5 xl:w-[90%] w-full xl:mx-auto">
              <Description />
              <SeatReservationBox
                listing={listingObj}
                onReserveClick={() => setIsBookingModalOpen(true)}
              />
            </div>
            <div className="showReviews">
              <ShowReview listingId={listingObj._id} />
            </div>
            <div className="showMap flex flex-col text-center w-[90%] border-t border-b pb-15 mt-15 mb-5 border-gray-400 mx-auto">
              <h1 className="mt-10 mb-3 text-5xl showHead">Where you'll be</h1>
              <h4 className="my-2 text-2xl showHead">
                {listingObj.location.address.city}, {listingObj.location.address.state}, {listingObj.location.address.country}
              </h4>
              <Map />
            </div>
            <div className="MeetYourHost text-center">
              <h1 className="mt-10 mb-8 text-4xl showHead">Meet Your Host</h1>
              <HostProfile />
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      
      {/* Booking Modal */}
      {listingObj && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          listing={listingObj}
        />
      )}
    </>
  );
};

export default ShowListing;
