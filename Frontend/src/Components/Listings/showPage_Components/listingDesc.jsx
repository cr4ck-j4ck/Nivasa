import { useEffect, useRef, useState } from "react";
import "./listingDesc.css";
import Option from "@/Components/Option";
export default function ({ listingObj }) {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [bedroomImgs, setBedroomImgs] = useState([]);
  const bedroomContainerRef = useRef(null);
  const shortDesc = listingObj.description?.slice(0, 250);
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
    <div className="h-[50vw] mt-6 w-[60%] relative">
      {/* ...existing h3, capacity, and host section... */}
      {/* <h3 className="text-2xl font-semibold">
        {" "}
        {listingObj.roomType} in{" "}
        {listingObj.location.city + ", " + listingObj.location.country}{" "}
      </h3>{" "}
      <p className="flex">
        {" "}
        {Object.entries(listingObj.capacity).map(([key, value]) => (
          <span key={key} className="mr-1">
            {" "}
            {`${value} ${key}`} &#x2022;{" "}
          </span>
        ))}{" "}
      </p>{" "}
      <div className="hostProfile flex mt-10 border-b border-gray-300 h-20 w-[80%]">
        {" "}
        <img
          src={listingObj.host.avatar}
          alt=""
          className="h-15 rounded-full mr-5"
        />{" "}
        <h3 className="text-lg font-semibold mt-5">
          Hosted by {listingObj.host.fullName}
        </h3>{" "}
      </div>
      <div className="description pb-10 border-b border-gray-300">
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
      </div> */}
      <div className="pb-10 border-b border-gray-300 bg-red-400 w-fit">
        <div className="flex items-center justify-between">
          <h4 className="text-2xl font-semibold mt-5 mb-2">
            Where you'll sleep
          </h4>

          {bedroomContainerRef && (
            <Option containerRef={bedroomContainerRef} classNames="pt-2" />
          )}
        </div>

        <div
          className="bedroomImgs flex overflow-x-scroll py-3 box-border bg-red-400 w-[100%]"
          ref={bedroomContainerRef}
        >
          {bedroomImgs.map((el, i) => (
            <img
              src={el}
              alt={`Bedroom Image ${i}`}
              key={i}
              className="h-60  rounded-2xl pr-3 shrink-0 w-[calc(100%/2)] box-border"
            />
          ))}
        </div>
      </div>
      {showFullDesc && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
          onClick={() => setShowFullDesc(false)}
        >
          <div
            className="bg-white max-w-2xl w-full p-6 rounded-xl relative shadow-xl"
            onClick={(e) => e.stopPropagation()} // prevents closing when clicking inside modal
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
