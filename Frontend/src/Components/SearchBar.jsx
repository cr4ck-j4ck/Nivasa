import { useState, useRef, useEffect } from "react";
import "./searchBar.css";
import { Calendar02 } from "./Calendar02";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar() {
  const elementRef = useRef(null); // DOM element ref
  const buttonRef = useRef(null);
  const inputRef = useRef(null);
  const [isInput1Focused, setInput1Focus] = useState(false);
  const [isInput2Focused, setInput2Focus] = useState(false);
  const [isInput3Focused, setInput3Focus] = useState(false);
  const [isInput4Focused, setInput4Focus] = useState(false);
  const ignoreNextBlur = useRef(false);
  const [position, updatePosition] = useState(0);

  // Get position initially after DOM mounts
  useEffect(() => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      updatePosition(rect.x); // Or rect.left
    }
  }, []);

  // Update position on window resize
  useEffect(() => {
    const reportPosition = () => {
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

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        ignoreNextBlur.current = true;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  function handleMouseEnter(e) {
    e.currentTarget.previousElementSibling.style.visibility = "hidden";
  }
  function handleMouseLeave(e) {
    e.currentTarget.previousElementSibling.style.visibility = "";
  }
  const handleClick = () => {
    const button = buttonRef.current;
    const circle = document.createElement("span");
    circle.classList.add("ripple");

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    circle.style.width = circle.style.height = `${size}px`;
    circle.style.left = "50%";
    circle.style.top = "50%";
    circle.style.transform = `translate(-50%, -50%) scale(0)`;
    if (button.querySelector(".ripple")) return;
    button.appendChild(circle);

    setTimeout(() => {
      circle.remove();
      setInput1Focus(true);
      inputRef.current?.focus();
    }, 300);
  };

  const handleBlur = () => {
    if (ignoreNextBlur.current) {
      ignoreNextBlur.current = false;
      return;
    }
    setInput1Focus(false);
  };

  return (
    <>
      <div className="flex justify-center items-center h-24 ">
        <div
          id="myElement"
          ref={elementRef} // Ref added here ✅
          className={`h-16 w-[54rem] rounded-4xl df relative ${
            isInput1Focused ? "bg-[#d6d6d6]" : "bg-white"
          } flex`}
        >
          <button
            ref={buttonRef}
            onClick={!isInput1Focused ? handleClick : () => {}}
            onFocus={!isInput1Focused ? handleClick : () => {}}
            className={`z-2 ripple-btn relative bottom-[1px] w-[16.5rem] h-[4.1rem] rounded-4xl overflow-hidden mr-2
            ${isInput1Focused ? "bg-white" : "hover:bg-[#bebebe]"}`}
          >
            <p className="absolute z-20 top-3 text-[0.8em] font-medium left-[1.7rem]">
              Where
            </p>
            <input
              ref={inputRef}
              type="text" 
              onBlur={handleBlur}
              placeholder="Search Destinations"
              className="w-[80%] outline-none relative z-20 bg-transparent input1 mt-3"
            />
          </button>

          <div className="divide1 absolute h-[4.1rem] w-14 left-60 z-1 flex justify-center ">
            <div className="relative h-[70%] w-px top-[15%] bg-[#ababab]"></div>
          </div>

          <button
            className={`w-[9rem] h-[4rem] rounded-4xl relative z-2 mr-2 ${
              isInput2Focused ? "bg-white" : "hover:bg-[#bebebe]"
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <p className="absolute text-[0.8em] font-medium top-3 left-6 ">
              Check in
            </p>
            <input
              type="text"
              placeholder="Add Dates"
              className="w-[80%] ml-4 relative top-2 cursor-pointer"
            />
          </button>

          <div className="divide absolute h-[4.1rem] w-14 left-[24.5rem] z-1 flex justify-center text-5xl">
            <div className="relative h-[70%] w-px top-[15%] bg-[#ababab]"></div>
          </div>

          <button
            className={`w-[9rem] h-[4rem] rounded-4xl relative z-2 mr-2 ${
              isInput3Focused ? "bg-white" : "hover:bg-[#bebebe]"
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <p className="absolute text-[0.8em] font-medium top-3 left-6 ">
              Check out
            </p>
            <input
              type="text"
              placeholder="Add Dates"
              className="w-[80%] ml-5 relative top-2 cursor-pointer"
            />
          </button>

          <div className="divide absolute h-[4.1rem] w-14 left-[33.9rem] z-1 flex justify-center">
            <div className="relative h-[70%] w-px top-[15%] bg-[#ababab]"></div>
          </div>

          <button
            className={`input4 h-[4.1rem] rounded-4xl relative z-2 flex-1 ${
              isInput4Focused ? "bg-white" : "hover:bg-[#bebebe]"
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <p className="absolute text-[0.8em] font-medium top-3 left-7 ">
              Who
            </p>
            <input type="text" placeholder="Add Guests" className="relative -bottom-[8px] -left-2"/>
            <div className="rounded-full inline-block h-12 w-12 py-[0.6rem] bg-[#FF385C] text-white -mr-6 hover:bg-[#CC2C46]">
              <SearchIcon />
            </div>
          </button>
        </div>
      </div>

      <Calendar02 position={position} />
    </>
  );
}
