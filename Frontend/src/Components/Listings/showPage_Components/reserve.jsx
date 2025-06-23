import { useState } from "react";
import UpIcon from "@mui/icons-material/KeyboardArrowUp";
import DownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import "./reserve.css";

const SeatReservationBox = () => {
  const [showGuests, setShowGuests] = useState(false);
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });

  const updateGuest = (type, change) => {
    setGuests((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + change),
    }));
  };

  return (
    <div
      className="p-4 m-5 rounded-2xl no-select sticky overflow-hidden top-35  mb-10 h-fit"
      style={{ boxShadow: "#b2b2b2 0px 0px 17px" }}
    >
      <h1 className="text-xl ml-1 mt-2">Add dates for prices</h1>
      <div className="flex mt-5">
        <div className="border p-3 border-black rounded-tl-md cursor-pointer w-1/2">
          <p className="reservePara">CHECK-IN</p>
          <input
            type="text"
            placeholder="Add dates"
            className="cursor-pointer outline-none"
          />
        </div>
        <div className="border p-3 rounded-tr-md border-black border-l-0 cursor-pointer w-1/2">
          <p className="reservePara">CHECK-IN</p>
          <input
            type="text"
            placeholder="Add dates"
            className="cursor-pointer outline-none"
          />
        </div>
      </div>

      <div className="relative mb-4">
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
          <div className="absolute left-0 top-full mt-2 w-[18rem] bg-white border shadow-md rounded-md z-10 p-4">
            {["adults", "children", "infants"].map((type) => (
              <div
                key={type}
                className="flex items-center justify-between mb-6"
              >
                <span className="capitalize">{type}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateGuest(type, -1)}
                    className="w-7 h-7 border-1 border-[#aaa] rounded-full flex items-center justify-center mr-2"
                  >
                    <RemoveIcon fontSize="" />
                  </button>
                  <span>{guests[type]}</span>
                  <button
                    onClick={() => updateGuest(type, 1)}
                    className="ml-2 w-7 h-7 border-1 border-[#aaa] rounded-full flex items-center justify-center"
                  >
                    <AddIcon fontSize="" />
                  </button>
                </div>
              </div>
            ))}
            <div className="text-right mt-2">
              <button
                className="underline font-medium"
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
