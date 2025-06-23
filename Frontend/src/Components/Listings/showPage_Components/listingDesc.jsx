import { useEffect, useRef, useState, useContext } from "react";
import "./listingDesc.css";
import Option from "@/Components/Option";
import { Calendar02 } from "@/Components/Calendar02";
import Amenities from "./amenities";
import ListingContext from "@/Context/context";

export default function () {
  const listingObj = useContext(ListingContext);
  if (!listingObj) return;
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [bedroomImgs, setBedroomImgs] = useState([]);
  const bedroomContainerRef = useRef(null);
  const shortDesc = listingObj.description?.slice(0, 250);
  console.log(listingObj.host.avatar);

  useEffect(() => {
    const filteredImgs = [];
    for (let el in listingObj.gallery) {
      if (el.startsWith("Bedroom")) {
        listingObj.gallery[el].forEach((element) => {
          filteredImgs.push(element);
        });
      }
    }
    setBedroomImgs(filteredImgs);
  }, []);
  return (
    <div className="w-[60vw] max-w-4xl mt-6 relative px-4 md:px-10 bg-blue-500">
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
      <div className="hostProfile flex mt-10 border-b border-gray-300 h-20 w-full md:w-4/5">
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
      <div className="description pb-10 border-b border-gray-300 w-[80%]">
        <h4 className="text-2xl font-semibold mt-5 mb-2">About this Place</h4>
        <p className="font-medium text-[#242424]">
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
      <div className="pb-10 border-b border-gray-300 w-full max-w-2xl h-auto">
        <div className="flex items-center justify-between flex-wrap mb-5">
          <h4 className="text-2xl font-semibold mt-5 mb-2">
            What This place offers
          </h4>
        </div>
        <div className="w-full grid grid-cols-2 grid-rows-4 gap-4 text-xl">
          <Amenities amenity={listingObj.amenities}/>
        </div>
      </div>
      <div className="pb-10 border-b border-gray-300 w-full max-w-2xl h-auto">
        <div className="flex items-center justify-between flex-wrap mb-5">
          <h4 className="text-2xl font-semibold mt-5 mb-2">
            Select check-in date
          </h4>
        </div>
        <div className="relative -left-15 ">
          <Calendar02 />
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
}
