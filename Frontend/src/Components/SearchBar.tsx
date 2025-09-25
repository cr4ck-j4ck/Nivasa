import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./searchBar.css";
import { SearchCalendar } from "./SearchCalendar";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  scroll: boolean;
  setIsScrolled: (isScrolled: boolean) => void;
}

type InputKey = "input1" | "input2" | "input3" | "input4";

export default function SearchBar({
  scroll: isScrolled,
  setIsScrolled,
}: SearchBarProps) {
  const navigate = useNavigate();
  const elementRef = useRef<HTMLDivElement>(null);
  const inputReferences = useRef<(HTMLInputElement | null)[]>([]);
  const buttonReferences = useRef<(HTMLButtonElement | null)[]>([]);

  const [focusedInput, setFocusedInput] = useState<InputKey | null>(null);
  const [hasBeenInteracted, setHasBeenInteracted] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const [searchData, setSearchData] = useState({
    city: "",
    checkIn: "",
    checkOut: "",
    guests: "",
  });
  
  const [searchCalendarFocus, setSearchCalendarFocus] = useState<"checkIn" | "checkOut" | null>(null);
  const [searchBookingDates, setSearchBookingDates] = useState<{
    checkIn: Date | null;
    checkOut: Date | null;
  }>({
    checkIn: null,
    checkOut: null,
  });

  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchBookingDates.checkIn && !(searchBookingDates.checkIn instanceof Date)) {
      console.error("checkIn is not a Date object:", searchBookingDates.checkIn, typeof searchBookingDates.checkIn);
    }
    if (searchBookingDates.checkOut && !(searchBookingDates.checkOut instanceof Date)) {
      console.error("checkOut is not a Date object:", searchBookingDates.checkOut, typeof searchBookingDates.checkOut);
    }

    setSearchData(prev => ({
      ...prev,
      checkIn: searchBookingDates.checkIn && searchBookingDates.checkIn instanceof Date 
        ? searchBookingDates.checkIn.toLocaleDateString() 
        : "",
      checkOut: searchBookingDates.checkOut && searchBookingDates.checkOut instanceof Date 
        ? searchBookingDates.checkOut.toLocaleDateString() 
        : "",
    }));
  }, [searchBookingDates.checkIn, searchBookingDates.checkOut]);

  const handleDateSelect = (date: Date, type: "checkIn" | "checkOut") => {
    if (!date || !(date instanceof Date)) {
      console.error("Invalid date passed to handleDateSelect:", date);
      return;
    }

    if (type === "checkIn") {
      setSearchBookingDates(prev => ({ ...prev, checkIn: date, checkOut: null }));
      // Keep calendar visible and switch to checkout selection
      setTimeout(() => {
        setSearchCalendarFocus("checkOut");
        setFocusedInput("input3");
        setShowCalendar(true);
        inputReferences.current[2]?.focus();
      }, 50);
    } else if (type === "checkOut") {
      if (searchBookingDates.checkIn && date >= searchBookingDates.checkIn) {
        setSearchBookingDates(prev => ({ ...prev, checkOut: date }));
        // Hide calendar after both dates are selected
        setTimeout(() => {
          setSearchCalendarFocus(null);
          setShowCalendar(false);
          setFocusedInput("input4");
          inputReferences.current[3]?.focus();
        }, 100);
      } else if (searchBookingDates.checkIn) {
        setSearchBookingDates({ checkIn: date, checkOut: null });
        setSearchCalendarFocus("checkOut");
        setShowCalendar(true); // Keep calendar visible
      }
    }
  };

  useEffect(() => {
    if (focusedInput && isScrolled) {
      setFocusedInput(null);
      setShowCalendar(false);
      setSearchCalendarFocus(null);
    }
  }, [focusedInput, isScrolled]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (elementRef.current && !elementRef.current.contains(event.target as Node) &&
          calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setFocusedInput(null);
        setSearchCalendarFocus(null);
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = (inputKey: InputKey) => {
    if (!hasBeenInteracted) {
      const button = buttonReferences.current[parseInt(inputKey.slice(-1)) - 1];
      if (button) {
        const circle = document.createElement("span");
        circle.classList.add("ripple");
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        circle.style.width = circle.style.height = `${size}px`;
        circle.style.left = "50%";
        circle.style.top = "50%";
        circle.style.transform = `translate(-50%, -50%) scale(0)`;
        if (!button.querySelector(".ripple")) {
          button.prepend(circle);
        }
        setTimeout(() => circle.remove(), 500);
      }
      setHasBeenInteracted(true);
    }

    setFocusedInput(inputKey);
    if (inputKey === "input2") {
      setSearchCalendarFocus("checkIn");
      setShowCalendar(true);
    } else if (inputKey === "input3") {
      setSearchCalendarFocus("checkOut");
      setShowCalendar(true);
    } else {
      setSearchCalendarFocus(null);
      setShowCalendar(false);
    }

    setTimeout(() => inputReferences.current[parseInt(inputKey.slice(-1)) - 1]?.focus(), 50);
  };

  const handleInputChange = (field: keyof typeof searchData, value: string) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    if (!searchData.city.trim()) {
      inputReferences.current[0]?.focus();
      return;
    }
    const params = new URLSearchParams();
    if (searchData.city.trim()) params.set("city", searchData.city.trim());
    if (searchBookingDates.checkIn) params.set("checkIn", searchBookingDates.checkIn.toISOString().split('T')[0]);
    if (searchBookingDates.checkOut) params.set("checkOut", searchBookingDates.checkOut.toISOString().split('T')[0]);
    if (searchData.guests) params.set("guests", searchData.guests);
    navigate(`/search?${params.toString()}`);
  };

  const searchBarButtons = [
    { key: 'input1', label: 'Where', placeholder: 'Search destinations' },
    { key: 'input2', label: 'Check in', placeholder: 'Add dates' },
    { key: 'input3', label: 'Check out', placeholder: 'Add dates' },
    { key: 'input4', label: 'Who', placeholder: 'Add guests' },
  ];

  return (
    <>
      <div className={`flex justify-center items-center duration-500 h-24 px-5`}>
        <motion.div
          ref={elementRef}
          layout
          className={`df h-16 rounded-full absolute flex items-center shadow-lg transition-colors duration-300 ${
            focusedInput ? "bg-gray-200" : "bg-white"
          } ${isScrolled ? "moveTop" : "moveDown"}`}
          onClick={() => isScrolled && setIsScrolled(false)}
        >
          {searchBarButtons.map((item, index) => (
            <React.Fragment key={item.key}>
              <motion.button
                ref={(el) => { buttonReferences.current[index] = el; }}
                onClick={() => handleClick(item.key as InputKey)}
                className={`relative z-10 h-full flex-1 flex flex-col justify-center px-6 rounded-full outline-none ${
                  isScrolled && index > 0 && index < 3 ? 'hidden' : ''
                }`}
              >
                {focusedInput === item.key && (
                  <motion.div
                    layoutId="indicator"
                    className="absolute inset-0 bg-white rounded-full shadow-md"
                  />
                )}
                <span className="relative font-bold text-xs text-left">{item.label}</span>
                <input
                  ref={(el) => { inputReferences.current[index] = el; }}
                  type={item.key === 'input4' ? 'number' : 'text'}
                  value={searchData[item.key === 'input1' ? 'city' : item.key === 'input2' ? 'checkIn' : item.key === 'input3' ? 'checkOut' : 'guests']}
                  onChange={(e) => handleInputChange(item.key === 'input1' ? 'city' : 'guests', e.target.value)}
                  readOnly={item.key === 'input2' || item.key === 'input3'}
                  placeholder={item.placeholder}
                  className="relative bg-transparent outline-none w-full text-sm text-gray-600 truncate"
                />
              </motion.button>
              {index < searchBarButtons.length - 1 && !isScrolled && (
                <div className="h-8 w-px bg-gray-200" />
              )}
            </React.Fragment>
          ))}
          <div
            onClick={handleSearch}
            className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer bg-gradient-to-r from-[#F83159] to-[#FF6B9D] text-white hover:opacity-90 transition-all duration-300 ${
              focusedInput ? "w-24 h-12" : "w-12 h-12"
            }`}
          >
            <SearchIcon />
            {focusedInput && <span className="font-bold text-sm ml-1">Search</span>}
          </div>
        </motion.div>
        <div className="searchPlaceholder">
          <Search></Search> Start your Search
        </div>
      </div>
      {showCalendar && searchCalendarFocus && (
        <div
          ref={calendarRef}
          className="relative w-fit mx-auto"
        >
          <SearchCalendar 
            className="bla rounded-4xl"
            focusInput={searchCalendarFocus}
            bookingDates={searchBookingDates}
            onDateSelect={handleDateSelect}
          />
        </div>
      )}
    </>
  );
}
