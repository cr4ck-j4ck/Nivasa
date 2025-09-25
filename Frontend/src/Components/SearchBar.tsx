import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./searchBar.css";
import { SearchCalendar } from "./SearchCalendar";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "../assets/home.avif";
import {Search } from "lucide-react";

interface SearchBarProps {
  scroll: boolean;
  setIsScrolled: (isScrolled: boolean) => void;
}

type InputKey = "input1" | "input2" | "input3" | "input4";

interface IndicatorStyle {
  left: number;
  width: number;
}

interface InputRefs {
  input1: HTMLInputElement | null;
  input2: HTMLInputElement | null;
  input3: HTMLInputElement | null;
  input4: HTMLInputElement | null;
}

interface ButtonRefs {
  input1: HTMLButtonElement | null;
  input2: HTMLButtonElement | null;
  input3: HTMLButtonElement | null;
  input4: HTMLButtonElement | null;
}

export default function SearchBar({
  scroll: isScrolled,
  setIsScrolled,
}: SearchBarProps) {
  const navigate = useNavigate();
  const elementRef = useRef<HTMLDivElement>(null);
  const inputReferences = useRef<(HTMLInputElement | null)[]>([]);
  const buttonReferences = useRef<(HTMLButtonElement | null)[]>([]);
  let focInput: boolean = false;

  const [focusedInput, setFocusedInput] = useState<InputKey | null>(null);
  const [activeButton, setActiveButton] = useState<InputKey | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    left: 0,
    width: 0,
  });
  const [position, updatePosition] = useState<number>(0);

  // Search form state with local calendar state
  const [searchData, setSearchData] = useState({
    city: "",
    checkIn: "",
    checkOut: "",
    guests: "",
  });
  
  // Local calendar state for SearchBar
  const [searchCalendarFocus, setSearchCalendarFocus] = useState<"checkIn" | "checkOut" | null>(null);
  const [searchBookingDates, setSearchBookingDates] = useState<{
    checkIn: Date | null;
    checkOut: Date | null;
  }>({
    checkIn: null,
    checkOut: null,
  });

  const calendarRef = useRef<HTMLDivElement>(null);

  // Synchronize search booking dates with display
  useEffect(() => {
    // Debug logging to help identify any future issues
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

  // Handle date selection from calendar
  const handleDateSelect = (date: Date, type: "checkIn" | "checkOut") => {
    // Ensure we have a valid Date object
    if (!date || !(date instanceof Date)) {
      console.error("Invalid date passed to handleDateSelect:", date);
      return;
    }

    if (type === "checkIn") {
      console.log("CheckIn selection:", date);
      setSearchBookingDates(prev => ({
        ...prev,
        checkIn: date, // Use the date directly from the calendar
        checkOut: null, // Reset checkout when changing checkin
      }));
      // Move to checkout input
      setSearchCalendarFocus("checkOut");
      setFocusedInput("input3");
      setActiveButton("input3");
      setTimeout(() => {
        inputReferences.current[2]?.focus();
      }, 100);
    } else if (type === "checkOut") {
      console.log("Checkout selection:", {
        selectedDate: date,
        checkInDate: searchBookingDates.checkIn,
        comparison: searchBookingDates.checkIn ? date >= searchBookingDates.checkIn : "no checkIn"
      });

      if (searchBookingDates.checkIn && date >= searchBookingDates.checkIn) {
        setSearchBookingDates(prev => ({
          ...prev,
          checkOut: date, // Use the date directly from the calendar
        }));
        // Close calendar and focus on guests
        setSearchCalendarFocus(null);
        setFocusedInput("input4");
        setActiveButton("input4");
        setTimeout(() => {
          inputReferences.current[3]?.focus();
        }, 100);
      } else if (searchBookingDates.checkIn) {
        // If selected date is before checkin, set it as new checkin
        setSearchBookingDates({
          checkIn: date, // Use the date directly from the calendar
          checkOut: null,
        });
        setSearchCalendarFocus("checkOut");
      }
    }
  };

  const buttonRefs: ButtonRefs = useMemo(
    () => ({
      input1: buttonReferences.current[0] || null,
      input2: buttonReferences.current[1] || null,
      input3: buttonReferences.current[2] || null,
      input4: buttonReferences.current[3] || null,
    }),
    [buttonReferences.current[0], buttonReferences.current[1], buttonReferences.current[2], buttonReferences.current[3]]
  );

  const inputRefs: InputRefs = useMemo(
    () => ({
      input1: inputReferences.current[0] || null,
      input2: inputReferences.current[1] || null,
      input3: inputReferences.current[2] || null,
      input4: inputReferences.current[3] || null,
    }),
    [inputReferences.current[0], inputReferences.current[1], inputReferences.current[2], inputReferences.current[3]]
  );
  const dynamicLeftClass: string = `${Math.floor(position)}`;
  useEffect(() => {
    if (focusedInput && isScrolled) {
      buttonRefs[focusedInput]?.blur();
      inputRefs[focusedInput]?.blur();
      setFocusedInput(null);
    }
  }, [isScrolled, buttonRefs, focusedInput, inputRefs]);

  useEffect(() => {
    if (!calendarRef.current) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        handleInputBlur("cal");
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  useEffect(() => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      updatePosition(rect.x + 80);
    }

    const reportPosition = (): void => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        updatePosition(rect.x);
      }
    };

    window.addEventListener("resize", reportPosition);
    return () => {
      window.removeEventListener("resize", reportPosition);
    };
  }, []);

  const updateIndicatorPosition = useCallback(
    (key: InputKey): void => {
      const button = buttonRefs[key];
      const container = elementRef.current;
      if (button && container) {
        const buttonRect = button.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        setIndicatorStyle({
          left: buttonRect.left - containerRect.left,
          width: buttonRect.width,
        });
      }
    },
    [buttonRefs]
  );

  useEffect(() => {
    if (focusedInput) {
      updateIndicatorPosition(focusedInput);
    }
  }, [focusedInput, updateIndicatorPosition]);

  const handleClick = (
    button: HTMLButtonElement,
    inputRef: HTMLInputElement | null,
    inputKey: InputKey
  ): void => {
    if (focusedInput !== inputKey) {
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

      setTimeout(() => {
        if (button.contains(circle)) {
          circle.remove();
        }
      }, 500);

      setFocusedInput(inputKey);
      setActiveButton(null);

      // Handle calendar for date inputs
      if (inputKey === "input2") {
        setSearchCalendarFocus("checkIn");
      } else if (inputKey === "input3") {
        setSearchCalendarFocus("checkOut");
      }

      setTimeout(() => {
        setActiveButton(inputKey);
        inputRef?.focus();
      }, 200);
    }
  };

  function handleInputBlur(val: "cal" | "input1" | "input4"): void {
    const blurInputs: ("cal" | "input1" | "input4")[] = [
      "cal",
      "input1",
      "input4",
    ];
    if (blurInputs.includes(val)) {
      setTimeout(() => {
        if (!elementRef.current?.contains(document.activeElement)) {
          setFocusedInput(null);
          setActiveButton(null);
          if (val === "cal") {
            setSearchCalendarFocus(null);
          }
        }
      }, 0);
    }
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const previousElement = e.currentTarget
      .previousElementSibling as HTMLElement;
    if (previousElement) {
      previousElement.style.visibility = "hidden";
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const previousElement = e.currentTarget
      .previousElementSibling as HTMLElement;
    if (previousElement) {
      previousElement.style.visibility = "";
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof typeof searchData, value: string) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  // Handle search submission
  const handleSearch = () => {
    if (!searchData.city.trim()) {
      // Focus on city input if empty
      inputReferences.current[0]?.focus();
      return;
    }

    // Build search params
    const params = new URLSearchParams();
    if (searchData.city.trim()) params.set("city", searchData.city.trim());
    if (searchData.checkIn) params.set("checkIn", searchData.checkIn);
    if (searchData.checkOut) params.set("checkOut", searchData.checkOut);
    if (searchData.guests) params.set("guests", searchData.guests);

    // Navigate to search results
    navigate(`/search?${params.toString()}`);
  };

  if (focusedInput === "input2" || focusedInput === "input3") focInput = true;

  return (
    <>
      <div
        className={`flex justify-center items-center duration-500 h-24  px-5`}
      >
        <div
          ref={elementRef}
          className={`df h-16 rounded-4xl absolute flex ${
            focusedInput ? "bg-[#d6d6d6]" : "bg-white"
          } ${isScrolled ? "moveTop" : "moveDown"}`}
          onClick={
            isScrolled
              ? () => {
                  if (isScrolled) {
                    setIsScrolled(false);
                  }
                }
              : () => {}
          }
        >
          {/* Animated White Box */}
          {focusedInput && !isScrolled && (
            <div
              className="animatedBox absolute h-[4.1rem] rounded-4xl bg-white z-1 transition-all duration-200 ease-in-out"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
              }}
            />
          )}

          {/* Button 1 */}
          <button
            ref={(el) => {
              buttonReferences.current[0] = el;
            }}
            onClick={() =>
              handleClick(
                buttonReferences.current[0]!,
                inputReferences.current[0],
                "input1"
              )
            }
            className={`z-2 ripple-btn relative bottom-[1px] rounded-4xl overflow-hidden mr-2 ${
              activeButton === "input1" ? "bg-white" : "hover:bg-[#bebebe]"
            } ${
              isScrolled ? "w-[10rem] h-12.5" : "w-[30%] min-w-[12rem] h-16.5"
            }`}
          >
            <p
              className={`absolute z-10 font-bold top-3 text-[0.8em] ${
                isScrolled ? "left-20 flex items-center" : "left-[1.7rem]"
              }`}
            >
              {isScrolled && (
                <img
                  src={HomeIcon}
                  alt="homeImage"
                  className="h-10 absolute z-20 -left-16"
                />
              )}
              {isScrolled ? "AnyWhere" : "Where"}
            </p>
            <input
              ref={(el) => {
                inputReferences.current[0] = el;
              }}
              type="text"
              value={searchData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              onBlur={() => {
                handleInputBlur("input1");
              }}
              placeholder={`${!isScrolled ? "Where Destination" : ""}`}
              className={`w-[80%] outline-none relative z-20 bg-transparent input1 mt-3 `}
            />
          </button>

          <div
            className={`${
              isScrolled ? "h-12 right-1" : "h-[4.1rem] right-1"
            } relative z-1 flex justify-center divider`}
          >
            <div className="relative h-[70%] w-px top-[15%] bg-[#ababab]"></div>
          </div>

          {/* Button 2 */}
          <button
            className={`z-2 ripple-btn rounded-4xl relative mr-2 overflow-hidden ${activeButton === "input2" ? "bg-white" : "hover:bg-[#bebebe]"}`}
            ref={(el) => {
              buttonReferences.current[1] = el;
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() =>
              handleClick(
                buttonReferences.current[1]!,
                inputReferences.current[1],
                "input2"
              )
            }
          >
            <p className="absolute text-[0.8em] font-bold z-50 top-3 left-6">
              {`${isScrolled ? "Anytime" : "Check in"}`}
            </p>
            <input
              type="text"
              value={searchData.checkIn}
              onChange={(e) => handleInputChange("checkIn", e.target.value)}
              placeholder={`${isScrolled ? "" : "Add Dates"}`}
              ref={(el) => {
                inputReferences.current[1] = el;
              }}
              className="w-[80%] ml-4 relative z-10 outline-none top-2 cursor-pointer"
            />
          </button>

          <div
            className={`relative ${
              isScrolled ? "h-12" : "h-[4.1rem] right-1"
            } z-1 flex justify-center text-5xl bg-transparent divider`}
          >
            <div className="relative h-[70%] w-px top-[15%] bg-[#ababab]"></div>
          </div>

          {/* Button 3 */}
          {!isScrolled && (
            <>
              <button
                className={`w-[15%] min-w-[8rem] ripple-btn overflow-hidden rounded-4xl relative z-2 ${
                  activeButton === "input3" ? "bg-white" : "hover:bg-[#bebebe]"
                }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                ref={(el) => {
                  buttonReferences.current[2] = el;
                }}
                onClick={() =>
                  handleClick(
                    buttonReferences.current[2]!,
                    inputReferences.current[2],
                    "input3"
                  )
                }
              >
                <p className="absolute z-50 text-[0.8em] font-bold top-3 left-5">
                  Check Out
                </p>
                <input
                  type="text"
                  value={searchData.checkOut}
                  onChange={(e) =>
                    handleInputChange("checkOut", e.target.value)
                  }
                  ref={(el) => {
                    inputReferences.current[2] = el;
                  }}
                  placeholder="Add Dates"
                  className="w-[80%] ml-2 outline-none z-10 relative top-2 cursor-pointer"
                />
              </button>

              <div className="divide relative h-[4.1rem] left-1 z-1 flex justify-center ">
                <div className="relative h-[70%] top-[15%] bg-[#a8a8a8] w-px divider"></div>
              </div>
            </>
          )}
          {/* Button 4 */}
          <button
            className={`input4 ripple-btn overflow-hidden ml-2 rounded-4xl relative z-50 flex-1 min-w-[8rem] ${activeButton === "input4" ? "bg-white" : "hover:bg-[#bebebe]"}`}
            ref={(el) => {
              buttonReferences.current[3] = el;
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() =>
              handleClick(
                buttonReferences.current[3]!,
                inputReferences.current[3],
                "input4"
              )
            }
          >
            <p
              className={`absolute text-[0.8em] font-bold z-50 top-3 ${
                isScrolled ? "" : "left-9"
              }`}
            >
              {isScrolled ? "Add Guests" : "Who"}
            </p>
            <input
              type="number"
              min="1"
              max="16"
              value={searchData.guests}
              onChange={(e) => handleInputChange("guests", e.target.value)}
              placeholder={`${isScrolled ? "" : "Add Guests"}`}
              onBlur={() => {
                handleInputBlur("input4");
              }}
              className={`relative z-10 -bottom-[8px] left-1 outline-none w-[80%]`}              ref={(el) => {
                inputReferences.current[3] = el;
              }}
            />

            <div
              onClick={handleSearch}
              className={`rounded-full flex cursor-pointer ${
                isScrolled
                  ? "h-8 w-8 absolute right-2 bottom-2 pt-1 px-1"
                  : "h-12 w-12 absolute right-2 bottom-2 py-3 px-3"
              } bg-[#d93553] z-20 text-white hover:bg-[#fe3b5f] ${
                focusedInput ? "searchIncrease" : ""
              } duration-300`}
            >
              <SearchIcon />
              {focusedInput && <p className="pb-1 font-bold">Search</p>}
            </div>
          </button>
        </div>
        <div className="searchPlaceholder">
          <Search></Search> Start your Search
        </div>
      </div>
      {focInput ? (
        <div
          ref={calendarRef}
          className="relative w-fit"
          style={{ left: `${dynamicLeftClass}px` }}
        >
          <SearchCalendar 
            className="bla rounded-4xl" 
            focusInput={searchCalendarFocus}
            bookingDates={searchBookingDates}
            onDateSelect={handleDateSelect}
          />
        </div>
      ) : null}
    </>
  );
}
