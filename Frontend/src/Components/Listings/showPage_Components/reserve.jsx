import { useState } from "react";
import downIcon from "@mui/icons-material/KeyboardArrowDown";
import upIcon from "@mui/icons-material/KeyboardArrowUp";

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
      className="p-4 bg-white m-5 h-fit rounded-2xl"
      style={{ boxShadow: "#b2b2b2 0px 0px 17px" }}
    >
      <h1 className="text-2xl ml-1 mt-2">Add dates for prices</h1>
      {/* Check-in & Check-out */}
      <div className="flex mt-5">
        <input
          type="date"
          className="flex-1 border p-3 rounded-tl-xl border-black "
          placeholder="Check-in"
        />
        <input
          type="date"
          className="flex-1 border p-3 rounded-tr-xl border-black border-l-0"
          placeholder="Check-out"
        />

      </div>

      <div className="relative w-full mb-4">
        <div
          className="border p-3 cursor-pointer rounded-bl-xl rounded-br-xl border-black border-t-0"
          onClick={() => setShowGuests(!showGuests)}
        >
          Guests: {guests.adults + guests.children + guests.infants}
          <div className="bg-red-400">
            <upIcon/>
          </div>
        </div>

        {showGuests && (
          <div className="absolute left-0 top-full mt-2 w-full bg-white border shadow-md rounded-md z-10 p-4">
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
      <button className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700">
        Reserve
      </button>
    </div>
  );
};

export default SeatReservationBox;
