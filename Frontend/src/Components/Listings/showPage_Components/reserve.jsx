import { useEffect, useRef, useState } from "react";
import UpIcon from "@mui/icons-material/KeyboardArrowUp";
import DownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import "./reserve.css";
import { Calendar02 } from "@/Components/Calendar02";

const SeatReservationBox = () => {
  const [showGuests, setShowGuests] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const inputRef = useRef([]);
  const calRef = useRef(null);
  const dateDiv = useRef(null);
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  useEffect(() => {
    const func1 = (e) => {
      if (e.code == "Escape" && showCalendar) {
        setShowCalendar(false);
      }
    };
    const func2 = (e) => {
      if (calRef && showCalendar && !dateDiv.current.contains(e.target) && !calRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("keydown", func1);
    document.addEventListener("click", func2);
    return () => {
      document.removeEventListener("keydown", func1);
      document.removeEventListener("click", func2);
    };
  }, [showCalendar]);
  const updateGuest = (type, change) => {
    setGuests((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + change),
    }));
  };

  return (
    <div
      className="p-4 m-5 ml-10 rounded-2xl no-select sticky w-1/2 max-w-[355px]  top-35  mb-10 h-fit"
      style={{ boxShadow: "#b2b2b2 0px 0px 17px" }}
    >
      <h1 className="text-xl ml-1 mt-2">Add dates for prices</h1>
      <div
        className="md:flex mt-5 z-10 relative"
        onClick={() => {
          setShowCalendar(true);
        }}
        ref={dateDiv}
      >
        <div
          className={`border p-3 border-black md:rounded-tl-md cursor-pointer md:w-1/2 ${
            showCalendar ? "rounded-bl-md" : ""
          }`}
          ref={(el) => (inputRef.current[0] = el)}
        >
          <p className="reservePara">CHECK-IN</p>
          <input
            type="text"
            placeholder={`${showCalendar ? "DD/MM/YYYY" : "Add Date"}`}
            className="cursor-pointer outline-none w-full min-w-[80px]"
          />
        </div>
        <div
          className={`border p-3 md:rounded-tr-md border-black md:border-l-0 cursor-pointer md:w-1/2 ${
            showCalendar ? "rounded-br-md" : ""
          }`}
          ref={(el) => (inputRef.current[1] = el)}
        >
          <p className="reservePara">CHECK-IN</p>
          <input
            type="text"
            placeholder="Add dates"
            className="cursor-pointer outline-none w-full min-w-[80px]"
          />
        </div>
      </div>
      {showCalendar ? (
        <div
          className="absolute top-14 right-0 calRes z-2 w-[50rem] h-fit"
          ref={calRef}
        >
          <div className="ml-3 mb-4">
            <p className="font-semibold text-2xl">Select Dates</p>
            <p className="text-sm text-[#5b5b5b]">
              Add your travel dates for exact pricing
            </p>
          </div>
          {<Calendar02 customClass="checkInCal" />}
          <div className="flex w-full justify-end mt-5">
            <p className="mr-5 mt-2 underline text-black font-semibold">
              Clear dates
            </p>
            <button
              className="mr-5 closeBtn font-semibold"
              onClick={() => {
                setShowCalendar(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="relative mb-4 z-1">
        <div
          className="border p-3 cursor-pointer rounded-bl-md rounded-br-md border-black border-t-0 flex"
          onClick={() => setShowGuests(!showGuests)}
        >
          Guests: {guests.adults + guests.children + guests.infants}
          <div className="absolute right-4">
            {showGuests ? <UpIcon /> : <DownIcon />}
          </div>
        </div>

        {showGuests && (
          <div className="absolute right-0 top-full mt-2 w-full min-w-[220px] bg-white border shadow-md rounded-md z-10 p-4">
            {["adults", "children", "infants"].map((type) => (
              <div
                key={type}
                className="flex items-center justify-between mb-3"
              >
                <span className="capitalize">{type}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateGuest(type, -1)}
                    className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center"
                  >
                    −
                  </button>
                  <span>{guests[type]}</span>
                  <button
                    onClick={() => updateGuest(type, 1)}
                    className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <div className="text-right mt-2">
              <button
                className="text-blue-600 font-medium"
                onClick={() => setShowGuests(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reserve Button */}
      <button className="w-full bg-[#F83159] text-white py-3 rounded-3xl hover:bg-[#cf2346]">
        Reserve
      </button>
    </div>
  );
};

export default SeatReservationBox;
