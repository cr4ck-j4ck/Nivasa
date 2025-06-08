import { useState, useRef, useEffect } from "react";
import "./searchBar.css";
import { Calendar02 } from "./Calendar02";

export default function SearchBar() {
  const elementRef = useRef(null); // DOM element ref
  const buttonRef = useRef(null);
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
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

  const handleClick = () => {
    console.log("isFocues", isFocused)
    if (!isFocused) {
      const button = buttonRef.current;
      const circle = document.createElement("span");
      circle.classList.add("ripple");

      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = "50%";
      circle.style.top = "50%";
      circle.style.transform = `translate(-50%, -50%) scale(0)`;

      button.appendChild(circle);

      setTimeout(() => {
        circle.remove();
        setIsFocused(true);
        inputRef.current?.focus();
      }, 300);
    }
  };

  const handleBlur = () => {
    if (ignoreNextBlur.current) {
      ignoreNextBlur.current = false;
      return;
    }
    setIsFocused(false);
  };

  return (
    <>
      <div className="flex justify-center items-center h-24 ">
        <div
          id="myElement"
          ref={elementRef} // Ref added here ✅
          className={`h-16 w-[54rem] rounded-4xl df relative ${
            isFocused ? "bg-[#c1c1c1]" : "bg-white"
          } flex`}
        >
          <button
            ref={buttonRef}
            onClick={!isFocused ? handleClick : ()=>{}}
            onFocus={!isFocused ? handleClick : ()=>{}}
            className={`z-2 ripple-btn relative bottom-[1px] w-[16.5rem] h-[4.1rem] rounded-4xl overflow-hidden mr-2
            ${isFocused ? "bg-white" : "hover:bg-[#c7c7c7]"}`}
          >
            <p className="relative z-20 top-1 text-[0.8em] font-medium">
              Where
            </p>
            <input
              ref={inputRef}
              type="text"
              onFocus={handleClick}
              onBlur={handleBlur}
              placeholder="Search Destinations"
              className="w-[80%] outline-none relative z-20 bg-transparent input1"
            />
          </button>

          <div className="divide1 absolute h-[4.1rem] w-14 left-60 z-1 flex justify-center">
            <div className="relative h-[70%] w-px top-[15%] bg-[#ababab]"></div>
          </div>

          <button className="input2 w-[9rem] h-[4.1rem] rounded-4xl relative z-2 mr-2 bg-green-400">
            <p className="relative text-[0.8em] font-medium">Check in</p>
            <input type="number" placeholder="Add Dates" />
          </button>

          <div className="divide absolute h-[4.1rem] w-14 left-[24.5rem] z-1 flex justify-center text-5xl">
            <div className="relative h-[70%] w-px top-[15%] bg-[#ababab]"></div>
          </div>

          <button className="input3 w-[9rem] h-[4.1rem] rounded-4xl relative z-2 bg-red-400 mr-2">
            <input type="number" placeholder="Add Dates" />
          </button>

          <div className="divide absolute h-[4.1rem] w-14 left-[33.9rem] z-1 flex justify-center">
            <div className="relative h-[70%] w-px top-[15%] bg-[#ababab]"></div>
          </div>

          <button className="input4 h-[4.1rem] rounded-4xl relative z-2 bg-pink-300 flex-1">
            <input type="number" name="" id="" />
          </button>
        </div>
      </div>

      <Calendar02 position={position} />
    </>
  );
}
