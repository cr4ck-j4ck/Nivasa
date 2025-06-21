import { useEffect, useRef, useState } from "react";
import "./listingDesc.css";
import Option from "@/Components/Option";
import { Calendar02 } from "@/Components/Calendar02";
import WifiIcon from "@mui/icons-material/Wifi";
import Dryer from "@mui/icons-material/LocalLaundryService";
import TvIcon from "@mui/icons-material/Tv";
import CoffeeMakerIcon from "@mui/icons-material/CoffeeMaker";
import DeskIcon from "@mui/icons-material/Desk";
import DiningTable from "@mui/icons-material/TableRestaurant";
import BalconyIcon from "@mui/icons-material/Balcony";

export default function ({ listingObj }) {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [bedroomImgs, setBedroomImgs] = useState([]);
  const bedroomContainerRef = useRef(null);
  const shortDesc = listingObj.description?.slice(0, 250);
  console.log(listingObj.host._id);
  const amenityIcons = {
    WiFi: <WifiIcon />,
    "Smart TV": <TvIcon />,
    Dryer: <Dryer />,
    "Coffee maker": <CoffeeMakerIcon />,
    Desk: <DeskIcon />,
    "Dining Table": <DiningTable />,
    Balcony: <BalconyIcon />,
    "Air conditioning": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="30px"
        viewBox="0 -960 960 960"
        fill="#000000"
        className="relative top-1"
      >
        <path d="M820-480H140q-24.75 0-42.37-17.63Q80-515.25 80-540v-280q0-24.75 17.63-42.38Q115.25-880 140-880h680q24.75 0 42.38 17.62Q880-844.75 880-820v280q0 24.75-17.62 42.37Q844.75-480 820-480ZM170-201v-60q50 0 85-34.71T290-380h60q0 75-52.65 127T170-201Zm620 0q-75 0-127-52t-52-127h60q0 50 34.71 84.5T790-261v60Zm-340 41v-220h60v220h-60Zm370-380H140h680Zm-570 0v-110q0-24.75 17.63-42.38Q285.25-710 310-710h340q24.75 0 42.38 17.62Q710-674.75 710-650v110h-60v-110H310v110h-60Zm-110 0h680v-280H140v280Z" />
      </svg>
    ),
    Kitchen: <span className="material-symbols-outlined">flatware</span>,
    Washer: <span className="material-symbols-outlined">laundry</span>,
  };
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
  console.log(listingObj.amenities);
  return (
    <div className="w-full max-w-4xl mt-6 relative px-4 md:px-10">
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
          {listingObj.amenities.map((el, i) => (
            <p key={i} className="flex items-center gap-2">
              {amenityIcons[el] && <span>{amenityIcons[el]}</span>}
              {el}
            </p>
          ))}
        </div>
      </div>
      <div className="pb-10 border-b border-gray-300 w-full max-w-2xl h-auto">
        <div className="flex items-center justify-between flex-wrap mb-5">
          <h4 className="text-2xl font-semibold mt-5 mb-2">
            Select check-in date
          </h4>
        </div>
        <div>
          <Calendar02/>
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
