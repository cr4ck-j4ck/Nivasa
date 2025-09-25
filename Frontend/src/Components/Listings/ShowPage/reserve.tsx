// @ts-nocheck

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import UpIcon from "@mui/icons-material/KeyboardArrowUp";
import DownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Star, Shield } from "lucide-react";
import "./reserve.css";
import { Calendar02 } from "@/Components/Calendar02";
import reserveStore from "@/Store/Reserve";
import { useShallow } from "zustand/react/shallow";

import type { IlistingObj, IfullListing } from "@/@Types/interfaces";

interface SeatReservationBoxProps {
  listing?: IlistingObj | IfullListing;
  onReserveClick?: () => void;
}

const SeatReservationBox: React.FC<SeatReservationBoxProps> = ({
  listing,
  onReserveClick,
}) => {

  const [blurSecondInput, setBlurSecondInput] = useState(false);

  const {
    focusInput,
    bookingDates,
    showCalendar,
    setShowCalendar,
    setFocusInput,
    setBookingDates,
    setDate,
    guests,
    setGuests,
    showGuests,
    setShowGuests,
    date: selectedDate,
  } = reserveStore(
    useShallow((state) => ({
      setShowCalendar: state.setShowCalendar,
      setFocusInput: state.setFocusInput,
      showCalendar: state.showCalendar,
      focusInput: state.focusInput,
      bookingDates: state.bookingDates,
      setBookingDates: state.setBookingDates,
      date: state.date,
      setDate: state.setDate,
      guests: state.guests,
      setGuests: state.setGuests,
      showGuests: state.showGuests,
      setShowGuests: state.setShowGuests,
    }))
  );

  const inputRef = useRef<(HTMLDivElement | null)[]>([]);
  const calRef = useRef<HTMLDivElement | null>(null);
  const dateDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (focusInput && showCalendar) {
      setBlurSecondInput(bookingDates.checkIn ? false : true);
    }
  }, [focusInput, showCalendar, bookingDates.checkIn]);

  // Date selection is now handled directly in the calendar component

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
  }, [showCalendar, setFocusInput, setShowCalendar]);

  const updateGuest = (type: keyof typeof guests, change: number) => {
    const newCount = Math.max(0, guests[type] + change);
    // At least 1 adult required
    if (type === "adults" && newCount === 0) return;

    setGuests({ [type]: newCount });
  };

  const handleReserveClick = () => {
    if (!listing) {
      alert("Listing information not available");
      return;
    }

    if (onReserveClick) {
      onReserveClick();
    }
  };

  const guestCategories = [
    { id: "adults", title: "Adults", description: "Ages 13 or above" },
    { id: "children", title: "Children", description: "Ages 2–12" },
    { id: "infants", title: "Infants", description: "Under 2" },
    {
      id: "pets",
      title: "Pets",
      description: "Bringing a service animal?",
      isLink: true,
    },
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
      setFocusInput(bookingDates.checkIn ? "input2" : "input1");
    }
  }
  // TODO add Rating Field to the listing interface
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-6 m-5 ml-10 rounded-2xl no-select sticky w-1/2 max-w-[380px] top-10 mb-10 h-fit bg-white border border-gray-200"
        style={{ boxShadow: "rgba(0, 0, 0, 0.12) 0px 6px 16px" }}
      >
        {/* Header with pricing */}
        <div className="mb-6">
          <div className="flex items-baseline space-x-2 mb-2">
            <span className="text-2xl font-bold">
              ₹{listing?.pricing?.weekdayPrice || 150}
            </span>
            <span className="text-gray-600">night</span>
            {listing?.rating && (
              <div className="flex items-center ml-auto">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium ml-1">
                  {listing.rating}
                </span>
                {listing.reviewCount && (
                  <span className="text-sm text-gray-500 ml-1">
                    ({listing.reviewCount})
                  </span>
                )}
              </div>
            )}
          </div>

          <motion.div
            animate={{ opacity: 0.7 }}
            className="flex items-center text-sm text-gray-600"
          >
            <Shield className="w-4 h-4 mr-1 text-green-500" />
            <span>Instant booking available</span>
          </motion.div>
        </div>

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
            className={`${
              focusInput === "input1" ? "border-3" : "border"
            } p-3 border-black md:rounded-tl-md cursor-pointer md:w-1/2 ${
              showCalendar ? "rounded-bl-md" : ""
            }`}
            ref={(el) => {
              inputRef.current[0] = el!;
            }}
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
            className={`${
              focusInput === "input2" ? "border-3" : "border md:border-l-0"
            } p-3 md:rounded-tr-md border-black ${
              blurSecondInput ? "bg-black/20 opacity-55" : ""
            } cursor-pointer md:w-1/2 ${showCalendar ? "rounded-br-md" : ""}`}
            ref={(el) => {
              inputRef.current[1] = el!;
            }}
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
            className="absolute top-14 right-0 calRes z-8 w-[50rem]"
            ref={calRef}
          >
            <div className="ml-3 mb-4">
              <p className="font-semibold text-2xl">Select Dates</p>
              <p className="text-sm text-[#5b5b5b]">
                Add your travel dates for exact pricing
              </p>
            </div>

            <Calendar02 className="checkInCal" />

            <div className="flex w-full justify-end mt-5">
              <p
                className="mr-5 mt-2 underline text-black font-semibold cursor-pointer"
                onClick={() => {
                  setDate(undefined);
                  setBookingDates({
                    checkIn: null,
                    checkOut: null,
                  });
                  setFocusInput("input1");
                  setBlurSecondInput(true);
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
        <div className="relative mb-4 z-2">
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
            <div
              className="absolute right-0 top-full mt-2 w-[340px] bg-white border shadow-lg rounded-xl 
          z-10 p-6"
            >
              {guestCategories.map((category, index) => (
                <>
                  <div
                    key={category.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold">{category.title}</p>
                      <p
                        className={`text-sm ${
                          category.isLink ? "underline" : "text-gray-600"
                        }`}
                      >
                        {category.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          updateGuest(category.id as keyof typeof guests, -1)
                        }
                        disabled={
                          category.id === "adults"
                            ? guests.adults <= 1
                            : guests[category.id as keyof typeof guests] === 0
                        }
                        className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-black"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-lg">
                        {guests[category.id as keyof typeof guests]}
                      </span>
                      <button
                        onClick={() =>
                          updateGuest(category.id as keyof typeof guests, 1)
                        }
                        className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center text-gray-600 hover:border-black"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {index < guestCategories.length - 1 && (
                    <hr className="my-4" />
                  )}
                </>
              ))}
              <p className="text-sm text-gray-600 mt-6">
                This place has a maximum of {listing?.maxGuests || 4} guests,
                not including infants.
              </p>
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
        {/* ✅ Enhanced Reserve Button */}
        <motion.button
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 25px rgba(248, 49, 89, 0.3)",
          }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReserveClick}
          className="relative z-1 cursor-pointer w-full bg-gradient-to-r from-[#F83159] to-[#FF6B9D] text-white py-4 rounded-xl font-semibold text-lg overflow-hidden group transition-all duration-300 hover:from-[#cf2346] hover:to-[#e55a87]"
        >
          {/* Button text */}
          <span className="relative z-10 flex items-center justify-center">
            Reserve
          </span>

          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </motion.button>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-500"
        >
          <div className="flex items-center">
            <Shield className="w-3 h-3 mr-1 text-green-500" />
            <span>Secure payment</span>
          </div>
          <div className="flex items-center">
            <Shield className="w-3 h-3 mr-1 text-blue-500" />
            <span>Instant confirmation</span>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default SeatReservationBox;
