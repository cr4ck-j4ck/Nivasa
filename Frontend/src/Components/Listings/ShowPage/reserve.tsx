import { useEffect, useRef, useState } from "react";
import UpIcon from "@mui/icons-material/KeyboardArrowUp";
import DownIcon from "@mui/icons-material/KeyboardArrowDown";
import "./reserve.css";
import { Calendar02 } from "@/Components/Calendar02";
import reserveStore from "@/Store/Reserve";
import { useShallow } from "zustand/react/shallow";


const SeatReservationBox = () => {
  const [showGuests, setShowGuests] = useState<boolean>(false);
  const [blurSecondInput, setBlurSecondInput] = useState(false);
  const { focusInput, bookingDates, showCalendar, setShowCalendar, setFocusInput, setBookingDates, setDate } = reserveStore(useShallow(state => ({
    setShowCalendar: state.setShowCalendar,
    setFocusInput: state.setFocusInput,
    showCalendar: state.showCalendar,
    focusInput: state.focusInput,
    bookingDates: state.bookingDates,
    setBookingDates: state.setBookingDates,
    date: state.date,
    setDate: state.setDate
  })))


  const inputRef = useRef<(HTMLDivElement | null)[]>([]);
  const calRef = useRef<HTMLDivElement | null>(null);
  const dateDiv = useRef<HTMLDivElement | null>(null);

  const [guests, setGuests] = useState<{
    adults: number;
    children: number;
    infants: number;
    pets: number;
  }>({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  useEffect(() => {
    if (focusInput && showCalendar) {
      setBlurSecondInput(bookingDates.checkIn ? false : true)
    }
  }, [focusInput, showCalendar])

  useEffect(() => {
    const func1 = (e: KeyboardEvent) => {
      if (e.code === "Escape" && showCalendar) {
        setShowCalendar(false);
        setFocusInput(null);
      }
    };
    const func2 = (e: MouseEvent) => {
      if (
        calRef.current &&
        dateDiv.current &&
        showCalendar &&
        !dateDiv.current.contains(e.target as Node) &&
        !calRef.current.contains(e.target as Node)
      ) {
        setShowCalendar(false);
        setFocusInput(null);
      }
    };

    document.addEventListener("keydown", func1);
    document.addEventListener("click", func2);

    return () => {
      document.removeEventListener("keydown", func1);
      document.removeEventListener("click", func2);
    };
  }, [showCalendar]);

  const updateGuest = (type: keyof typeof guests, change: number) => {
    setGuests((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + change),
    }));
  };

  const guestCategories = [
    { id: 'adults', title: 'Adults', description: 'Ages 13 or above' },
    { id: 'children', title: 'Children', description: 'Ages 2–12' },
    { id: 'infants', title: 'Infants', description: 'Under 2' },
    { id: 'pets', title: 'Pets', description: 'Bringing a service animal?', isLink: true },
  ];

  function formatDate(date?: Date | null): string {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function handleRowClick(e: React.MouseEvent<HTMLDivElement>) {
    if (inputRef.current[0]?.contains(e.target as Node)) {
      setFocusInput("input1");
    } else {
      setFocusInput(bookingDates.checkIn ? "input2" : "input1")
    }
  }

  return (
    <div
      className="p-4 m-5 ml-10 rounded-2xl no-select sticky w-1/2 max-w-[355px] top-10  mb-10 h-fit"
      style={{ boxShadow: "#b2b2b2 0px 0px 17px" }}
    >
      <h1 className="text-xl ml-1 mt-2">Add dates for prices</h1>

      {/* 📅 Date Inputs */}
      <div
        className="md:flex mt-5 z-10 relative dateInputs"
        onClick={(e) => {
          setShowCalendar(true);
          handleRowClick(e);
        }}
        ref={dateDiv}
      >
        {/* Check-in */}
        <div
          className={`${focusInput === "input1" ? "border-3" : "border"
            } p-3 border-black md:rounded-tl-md cursor-pointer md:w-1/2 ${showCalendar ? "rounded-bl-md" : ""
            }`}
          ref={(el) => { (inputRef.current[0] = el!) }}
          id="input1"
        >
          <p className="reservePara">CHECK-IN</p>
          <input
            type="text"
            readOnly
            value={formatDate(bookingDates.checkIn)}
            placeholder={`${showCalendar ? "DD/MM/YYYY" : "Add Date"}`}
            className="cursor-pointer outline-none w-full min-w-[80px]"
          />
        </div>

        {/* Check-out */}
        <div
          className={`${focusInput === "input2" ? "border-3" : "border md:border-l-0"
            } p-3 md:rounded-tr-md border-black ${blurSecondInput ? "bg-black/20 opacity-55" : ""} cursor-pointer md:w-1/2 ${showCalendar ? "rounded-br-md" : ""
            }`}
          ref={(el) => { (inputRef.current[1] = el!) }}
          id="input2"
        >
          <p className="reservePara">CHECKOUT</p>
          <input
            type="text"
            placeholder={`${showCalendar ? "DD/MM/YYYY" : "Add Date"}`}
            className="cursor-pointer outline-none w-full min-w-[80px]"
            readOnly
            value={formatDate(bookingDates.checkOut)}
          />
        </div>
      </div>

      {/* 📆 Calendar */}
      {showCalendar && (
        <div
          className="absolute top-14 right-0 calRes z-2 w-[50rem]"
          ref={calRef}
        >
          <div className="ml-3 mb-4">
            <p className="font-semibold text-2xl">Select Dates</p>
            <p className="text-sm text-[#5b5b5b]">
              Add your travel dates for exact pricing
            </p>
          </div>

          <Calendar02
            className="checkInCal"
          />

          <div className="flex w-full justify-end mt-5">
            <p
              className="mr-5 mt-2 underline text-black font-semibold cursor-pointer"
              onClick={() => {
                setDate(undefined);
                setBookingDates({
                  checkIn: null,
                  checkOut: null
                })
                setFocusInput("input1");
                setBlurSecondInput(true)
              }}
            >
              Clear dates
            </p>
            <button
              className="mr-5 closeBtn font-semibold"
              onClick={() => {
                setShowCalendar(false);
                setFocusInput(null);
                setBlurSecondInput(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 👨‍👩‍👧‍👦 Guests Dropdown */}
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
          <div className="absolute right-0 top-full mt-2 w-[340px] bg-white border shadow-lg rounded-xl z-10 p-6">
            {guestCategories.map((category, index) => (
              <>
                <div
                  key={category.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{category.title}</p>
                    <p className={`text-sm ${category.isLink ? 'underline' : 'text-gray-600'}`}>{category.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => updateGuest(category.id as keyof typeof guests, -1)}
                      disabled={
                        category.id === 'adults'
                          ? guests.adults <= 1
                          : guests[category.id as keyof typeof guests] === 0
                      }
                      className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-black"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-lg">{guests[category.id as keyof typeof guests]}</span>
                    <button
                      onClick={() => updateGuest(category.id as keyof typeof guests, 1)}
                      className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center text-gray-600 hover:border-black"
                    >
                      +
                    </button>
                  </div>
                </div>
                {index < guestCategories.length - 1 && <hr className="my-4" />}
              </>
            ))}
            <p className="text-sm text-gray-600 mt-6">This place has a maximum of 4 guests, not including infants. Pets aren't allowed.</p>
            <div className="flex justify-end mt-4">
              <button
                className="font-semibold underline text-lg"
                onClick={() => setShowGuests(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Reserve Button */}
      <button className="w-full bg-[#F83159] text-white py-3 rounded-3xl hover:bg-[#cf2346]">
        Reserve
      </button>
    </div>
  );
};

export default SeatReservationBox;
