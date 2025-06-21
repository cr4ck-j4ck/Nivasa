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
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import ElevatorIcon from "@mui/icons-material/Elevator";
import WashingMachine from "@mui/icons-material/LocalLaundryService";
import DeckIcon from "@mui/icons-material/Deck";
import WindowIcon from "@mui/icons-material/Window";
import DryCleaningIcon from "@mui/icons-material/DryCleaning";

export default function ({ listingObj }) {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [bedroomImgs, setBedroomImgs] = useState([]);
  const bedroomContainerRef = useRef(null);
  const shortDesc = listingObj.description?.slice(0, 250);
  console.log(listingObj.host.avatar);
  const amenityIcons = {
    parking: <LocalParkingIcon />,
    wifi: <WifiIcon />,
    "smart tv": <TvIcon />,
    dryer: <Dryer />,
    "coffee maker": <CoffeeMakerIcon />,
    dining: <DeskIcon />,
    "dining table": <DiningTable />,
    terrace: <BalconyIcon />,
    balcony: <BalconyIcon />,
    elevator: <ElevatorIcon />,
    laundry: <DryCleaningIcon />,
    windows: <WindowIcon />,
    closet: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="30px"
        viewBox="0 -960 960 960"
        fill="#000000"
      >
        <path d="M280-80v-246h-68.67Q174-326 147-351.67q-27-25.66-27-63 0-27.66 14.33-51.5Q148.67-490 174-501.33L448.67-620v-36.67q-36.67-11-59.67-41.5t-23-68.5Q366-814 399.67-847q33.66-33 81-33 47.33 0 81 33 33.66 33 33.66 80.33h-66.66q0-19.66-14.17-33.16-14.17-13.5-33.83-13.5-19.67 0-33.84 13.5-14.16 13.5-14.16 33.16 0 21 14.16 35.17Q461-717.33 482-717.33q13.67 0 23.5 9.5t9.83 23.16V-620L786-501.33q25.33 11.33 39.67 35.16Q840-442.33 840-414.67q0 37.34-27 63Q786-326 748.67-326H680v246H280Zm-68.67-312.67H280V-440h400v47.33h68.67q9.66 0 17.16-6.66 7.5-6.67 7.5-16.67 0-7.67-4.16-13.5-4.17-5.83-11.17-9.17l-276-124-280 124q-7 3.34-11.17 9.17-4.16 5.83-4.16 12.83 0 10 7.16 17 7.17 7 17.5 7Zm135.34 246h266.66v-226.66H346.67v226.66Zm0-226.66h266.66-266.66Z" />
      </svg>
    ),
    space: <span class="material-symbols-outlined relative top-1">home_and_garden</span>,
    washing: <WashingMachine />,
    patio: <DeckIcon />,
    "air conditioning": (
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
    heating: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="25px"
        viewBox="0 -960 960 960"
        fill="#000000"
      >
        <path d="M226.67-400q0 59.33 26 111.83t73 88.84q-3-9.67-4.34-19.34Q320-228.33 320-238q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60q0 9.67-1.33 19.33-1.34 9.67-4.34 19.34 47-36.34 73-88.84t26-111.83q0-52.67-21.5-101.83-21.5-49.17-61.83-89.5-20.67 14.33-43.33 22.16-22.67 7.84-45.67 7.84-61.33 0-103.17-41.34Q416-644 413.67-706v-13.33q-43.67 33-78.34 71.5-34.66 38.5-58.83 79.66-24.17 41.17-37 84.17-12.83 43-12.83 84ZM480-366.67l-66.33 65.34q-13 13-20 29t-7 34.33q0 38 27.16 64.67Q441-146.67 480-146.67t66.17-26.66Q573.33-200 573.33-238q0-18.67-7-34.5-7-15.83-20-28.83L480-366.67ZM480-840v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-128.33 86.17-246Q332.33-763.67 480-840Z" />
      </svg>
    ),
    cooking: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="30px"
        viewBox="0 -960 960 960"
        fill="#000000"
      >
        <path d="M177.67-560q8-37.33-.5-65T143-688q-28.33-38.67-37.17-72.17-8.83-33.5-3.16-79.83h64q-6 37.33 1.5 63.67 7.5 26.33 33.83 61.66 30 40 38.5 74.17t1.17 80.5h-64Zm166.66 0q8-37.33-.33-65t-34-63q-28.33-38.67-37.33-72.17T269.33-840h64q-6 37.33 1.17 63.67 7.17 26.33 33.5 61.66 30 40 38.83 74.17 8.84 34.17 1.5 80.5h-64ZM511-560q8-37.33-.33-65-8.34-27.67-34-63-28.34-38.67-37.34-72.17-9-33.5-3.33-79.83h64q-6 37.33 1.17 63.67 7.16 26.33 33.5 61.66 30 40 38.83 74.17 8.83 34.17 1.5 80.5h-64ZM200-160q-50.67 0-85.33-34.67Q80-229.33 80-280v-200h573.67q1.66-32.67 19.66-58.83 18-26.17 48-36.5L909-638.67l21 63.34-187.67 62.66q-11.33 4-16.83 15.17-5.5 11.17-5.5 23.5v194q0 50-34.67 85-34.66 35-85.33 35H200Zm0-66.67h400q23 0 38.17-15.5 15.16-15.5 15.16-37.83v-133.33H146.67V-280q0 23 15.16 38.17Q177-226.67 200-226.67ZM400-320Z" />
      </svg>
    ),
    geyser: (
      <span className="material-symbols-outlined pt-1">water_heater</span>
    ),
    "hot water": (
      <span className="material-symbols-outlined pt-1">water_heater</span>
    ),
    kitchen: <span className="material-symbols-outlined">flatware</span>,
    washer: <span className="material-symbols-outlined">laundry</span>,
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
  console.log(listingObj);
  return (
    <div className="w-full max-w-4xl mt-6 relative px-4 md:px-10 ">
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
          {listingObj.amenities.map((el, i) => {
            const iconKey = Object.keys(amenityIcons).find((key) =>
              el.toLowerCase().includes(key)
            );
            return (
              <p key={i} className="flex items-center gap-2">
                {iconKey && <span>{amenityIcons[iconKey]}</span>}
                {el}
              </p>
            );
          })}
        </div>
      </div>
      <div className="pb-10 border-b border-gray-300 w-full max-w-2xl h-auto">
        <div className="flex items-center justify-between flex-wrap mb-5">
          <h4 className="text-2xl font-semibold mt-5 mb-2">
            Select check-in date
          </h4>
        </div>
        <div>
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
