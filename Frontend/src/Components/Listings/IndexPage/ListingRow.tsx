import "./listingRow.css";
import ListingCard from "./ListingCard";
import { useRef } from "react";
import Option from "@/Components/Option";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { type CityWithListings } from "@/Services/listingService";

const listingHeadLines = [
  `Fall in love, right here in`,
  `Check in, get swept away in`,
  `One night, or forever, in`,
  `Lose yourself in the charm of`,
  `The bed's waiting for you in`,
  `Stay here, catch feelings in`,
  `Love at first check-in in`,
  `We'll keep the lights low in`,
  `Your next obsession starts in`,

  `Once you enter, you're mine in`,
  `Where the nights never end in`,
  `Lose yourself completely in`,
  `The city holds its secrets in`,
  `A stay you'll never recover from in`,
  `Come in, don't look back in`,
  `Check in… and never leave`,
  `Dark nights, warm hearts in`,

  `Come for the bed, stay for the chemistry in`,
  `Stays you'll fall for… hard in`,
  `One night? Or forever, in`,
  `Your type, but in a house in`,
  `Rooms that make hearts race in`,
  `Stay here, catch feelings in`,
  `The longer you stay, the harder you fall in`,
  `We're totally your vibe in`,
  `Commitment issues? Not with these stays in`,
];

function ListingRow({ cityData, isLoading }: { cityData: CityWithListings | null; isLoading: boolean }) {
  const cardContainerRef = useRef<HTMLDivElement>(null);

  const skeletonCards = Array.from({ length: 7 }).map((_, i) => (
    <div key={i} className="card rounded-2xl mr-4 w-full">
      <Skeleton height="11.3vw" className="rounded-2xl" />
      <Skeleton height={20} width="80%" style={{ margin: "0.5rem 0" }} />
      <Skeleton height={14} width="60%" />
    </div>
  ));

  if (!cityData && !isLoading) {
    return null;
  }

  return (
    <div className="listingRow">
      <div className="text-xl listingHead ml-1 mb-5 flex justify-between">
        {cityData ? (
          <h1>
            {listingHeadLines[Math.floor(Math.random() * listingHeadLines.length)]} {cityData.city} &gt;
          </h1>
        ) : (
          <Skeleton />
        )}
        {cardContainerRef && <Option containerRef={cardContainerRef} />}
      </div>
      <div className="cardContainer relative mb-10 flex" ref={cardContainerRef}>
        {cityData && cityData.listings.length > 0
          ? cityData.listings.map((listing, i) => {
              // Get the first image from gallery, prioritizing "Bedroom 1"
              const getFirstImage = () => {
                if (listing.gallery) {
                  // Try to get from "Bedroom 1" first
                  if (listing.gallery["Bedroom 1"] && listing.gallery["Bedroom 1"].length > 0) {
                    return listing.gallery["Bedroom 1"][0];
                  }
                  // If no "Bedroom 1", get the first image from any room
                  const firstRoomKey = Object.keys(listing.gallery)[0];
                  if (firstRoomKey && listing.gallery[firstRoomKey].length > 0) {
                    return listing.gallery[firstRoomKey][0];
                  }
                }
                // Fallback to images array or placeholder
                return listing.images?.[0] || "/placeholder-image.jpg";
              };

              return (
                <ListingCard
                  src={getFirstImage()}
                  key={listing._id}
                  city={listing.location.city}
                  price={listing.price}
                  id={listing._id}
                  index={i}
                  customClass="card"
                  isLiked={listing.isLiked || false}
                  title={listing.title}
                />
              );
            })
          : skeletonCards}
      </div>
    </div>
  );
}
export default ListingRow;
