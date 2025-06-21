import { useState } from "react";

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
    <div className="w-full p-4 bg-white m-5 ml-10 max-w-xl h-fit shadow-lg rounded-lg">
      {/* Check-in & Check-out */}
      <div className="flex gap-4 mb-4">
        <input
          type="date"
          className="flex-1 border p-3 rounded-md"
          placeholder="Check-in"
        />
        <input
          type="date"
          className="flex-1 border p-3 rounded-md"
          placeholder="Check-out"
        />
      </div>

      <div className="relative w-full mb-4">
        <div
          className="border p-3 rounded-md cursor-pointer bg-gray-100"
          onClick={() => setShowGuests(!showGuests)}
        >
          Guests: {guests.adults + guests.children + guests.infants}
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
