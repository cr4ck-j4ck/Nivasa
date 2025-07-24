import { useEffect, useRef, useState } from "react";
import "./listingDesc.css";
import Option from "@/Components/Option";
import Amenities from "./amenities";
import type { IfullListing } from "@/@Types/interfaces";
import { useListingStore } from "@/Store/ListingStore";


const ListingDesc = (): React.JSX.Element | null => {
  const listingObj = useListingStore(state => state.listingObj) as IfullListing | null;
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [bedroomImgs, setBedroomImgs] = useState<string[] | undefined[]>([]);
  const bedroomContainerRef = useRef<HTMLDivElement | null>(null);

  const shortDesc = listingObj?.description?.slice(0, 250);
  useEffect(() => {
    const filteredImgs: string[] = [];
    for (const el in listingObj?.gallery) {
      if (el.startsWith("Bedroom")) {
        listingObj?.gallery[el].forEach((element) => {
          filteredImgs.push(element);
        });
      }
    }
    setBedroomImgs(filteredImgs);
  }, [listingObj?.gallery]);
  if (!listingObj) return null;

  return (
    <div className="min-w-[450px] w-[100%] xl:w-[55vw] max-w-4xl relative shrink-1">
      <h3 className="text-2xl font-semibold">
        {" "}
        {listingObj.roomType} in{" "}
        {listingObj.location.city + ", " + listingObj.location.country}{" "}
      </h3>{" "}
      <p className="flex flex-wrap">
        {" "}
        {Object.entries(listingObj.capacity).map(([key, value]) => (
          <span key={key} className="mr-1">
            {" "}
            {`${value} ${key}`} &#x2022;{" "}
          </span>
        ))}{" "}
      </p>{" "}
      <div className="hostProfile flex mt-10 border-b border-gray-300 h-20 w-full">
        {" "}
        <img
          src={listingObj.host.avatar}
          alt="Host Avatar"
          className="h-15 rounded-full mr-5 w-15"
        />{" "}
        <h3 className="text-lg font-semibold mt-5">
          Hosted by {listingObj.host.fullName}
        </h3>{" "}
      </div>
      <div className="description pb-10 border-b border-gray-300 w-full">
        <h4 className="text-2xl font-semibold mt-5 mb-2">About this Place</h4>
        <p className="font-medium text-[#242424] w-full]">
          {shortDesc}...
          <button
            onClick={() => setShowFullDesc(true)}
            className="mt-5 block showMore"
          >
            Show More
          </button>
        </p>
      </div>
      <div className="pb-10 border-b border-gray-300 w-full max-w-2xl h-auto">
        <div className="flex items-center justify-between flex-wrap">
          <h4 className="text-2xl font-semibold mt-5 mb-2">
            Where you'll sleep
          </h4>

          {bedroomContainerRef && (
            <Option containerRef={bedroomContainerRef} classNames="pt-2" />
          )}
        </div>

        <div
          className="bedroomImgs flex overflow-x-auto py-3 box-border w-full "
          ref={bedroomContainerRef}
        >
          {bedroomImgs.map((el, i) => (
            <img
              src={el}
              alt={`Bedroom Image ${i}`}
              key={i}
              className="h-40 md:h-60 rounded-2xl pr-3 shrink-0 w-[calc(100%/2)] box-border object-cover"
            />
          ))}
        </div>
      </div>
      <div className="pb-10 w-full max-w-2xl h-auto">
        <div className="flex items-center justify-between flex-wrap mb-5">
          <h4 className="text-2xl font-semibold mt-5 mb-2">
            What This place offers
          </h4>
        </div>
        <div className="w-full grid grid-cols-2 grid-rows-4 gap-4 text-xl">
          <Amenities amenity={listingObj.amenities} />
        </div>
      </div>
      {showFullDesc && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
          onClick={() => setShowFullDesc(false)}
        >
          <div
            className="bg-white max-w-2xl w-full p-6 rounded-xl relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowFullDesc(false)}
              className="absolute pb-10 top-2 right-4 text-gray-600 text-2xl hover:bg-[#d9d9d9] h-8 w-10 rounded-full"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Full Description</h2>
            <p className="text-gray-800 leading-relaxed">
              {listingObj.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDesc;
