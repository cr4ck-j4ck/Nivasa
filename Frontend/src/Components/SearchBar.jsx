import { useState, useRef, useEffect } from "react";
import "./searchBar.css";
import { Calendar02 } from "./Calendar02";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar() {
  const elementRef = useRef(null);
  const inputReferences = useRef([]);
  const buttonReferences = useRef([]);
  let focInput = false;
  const [focusedInput, setFocusedInput] = useState(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [position, updatePosition] = useState(0);

  // Get position initially after DOM mounts
  useEffect(() => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      updatePosition(rect.x);
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

  const buttonRefs = {
    input1: buttonReferences.current[0],
    input2: buttonReferences.current[1],
    input3: buttonReferences.current[2],
    input4: buttonReferences.current[3]
  };

  // Update indicator position on focus
  const updateIndicatorPosition = (key) => {
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
  };

  useEffect(() => {
    if (focusedInput) {
      updateIndicatorPosition(focusedInput);
    }
  }, [focusedInput]);

  const handleClick = (button, inputRef, inputKey) => {
    // const button = buttonRef.current;
    const circle = document.createElement("span");
    circle.classList.add("ripple");

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    circle.style.width = circle.style.height = `${size}px`;
    circle.style.left = "50%";
    circle.style.top = "50%";
    circle.style.transform = `translate(-50%, -50%) scale(0)`;

    if (!button.querySelector(".ripple")) {
      button.appendChild(circle);
    }

    setTimeout(() => {
      circle.remove();
      setFocusedInput(inputKey);
      inputRef?.focus();
    }, 300);
  };

  const handleInputBlur = () => () => {
    setTimeout(() => {
      if (!elementRef.current.contains(document.activeElement)) {
        setFocusedInput(null);
      }
    }, 0);
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.previousElementSibling.style.visibility = "hidden";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.previousElementSibling.style.visibility = "";
  };
  if(focusedInput=="input2"|| focusedInput=="input3") focInput = true;
  return (
    <>
      <div className="flex justify-center items-center h-24">
        <div
          id="myElement"
          ref={elementRef}
          className={`h-16 w-[54rem] rounded-4xl relative flex ${focusedInput ? "bg-[#d6d6d6]" : "bg-white"}`}
        >
          {/* Animated White Box */}
          {focusedInput && (
            <div
              className="absolute h-[4.1rem] rounded-4xl bg-white z-1 transition-all duration-200 ease-in-out"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
              }}
            />
          )}

          {/* Button 1 */}
          <button
            ref={el =>{buttonReferences.current[0]=el}}
            onClick={() => handleClick(buttonReferences.current[0], inputReferences.current[0], "input1")}
            className={`z-2 ripple-btn relative bottom-[1px] w-[16.5rem] h-[4.1rem] rounded-4xl overflow-hidden mr-2 ${
              focusedInput === "input1" ? "bg-white" : "hover:bg-[#bebebe]"
            }`}
          >
            <p className="absolute z-20 top-3 text-[0.8em] font-medium left-[1.7rem]">
              Where
            </p>
            <input
              ref={el => inputReferences.current[0] = el}
              type="text"
              onBlur={handleInputBlur("input1")}
              placeholder="Search Destinations"
              className="w-[80%] outline-none relative z-20 bg-transparent input1 mt-3"
            />
          </button>

          <div className="divide1 absolute h-[4.1rem] w-14 left-60 z-1 flex justify-center">
            <div className="relative h-[70%] w-px top-[15%] bg-[#ababab]"></div>
          </div>

          {/* Button 2 */}
          <button
            className={`ripple-btn w-[9rem] h-[4rem] rounded-4xl relative z-2 mr-2 overflow-hidden ${
              focusedInput === "input2" ? "bg-white" : "hover:bg-[#bebebe]"
            }`}
            ref={el =>{buttonReferences.current[1]=el}}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(buttonReferences.current[1], inputReferences.current[1], "input2")}
          >
            <p className="absolute text-[0.8em] font-medium top-3 left-6">
              Check in
            </p>
            <input
              type="text"
              placeholder="Add Dates"
              ref={el => inputReferences.current[1] = el}
              onBlur={handleInputBlur("input2")}
              className="w-[80%] ml-4 relative outline-none top-2 cursor-pointer"
            />
          </button>

          <div className="divide absolute h-[4.1rem] w-14 left-[24.5rem] z-1 flex justify-center text-5xl">
            <div className="relative h-[70%] w-px top-[15%] bg-[#ababab]"></div>
          </div>

          {/* Button 3 */}
          <button
            className={`w-[9rem] ripple-btn overflow-hidden h-[4rem] rounded-4xl relative z-2 mr-2 ${
              focusedInput === "input3" ? "bg-white" : "hover:bg-[#bebebe]"
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={el =>{buttonReferences.current[2]=el}}
            onClick={() => handleClick(buttonReferences.current[2], inputReferences.current[2], "input3")}
          >
            <p className="absolute text-[0.8em] font-medium top-3 left-6">
              Check out
            </p>
            <input
              type="text"
              ref={el => inputReferences.current[2] = el}
              placeholder="Add Dates"
              onBlur={handleInputBlur("input3")}
              className="w-[80%] ml-5 outline-none relative top-2 cursor-pointer"
            />
          </button>

          <div className="divide absolute h-[4.1rem] w-14 left-[33.9rem] z-1 flex justify-center">
            <div className="relative h-[70%] w-px top-[15%] bg-[#ababab]"></div>
          </div>

          {/* Button 4 */}
          <button
            className={`input4 h-[4.1rem] ripple-btn overflow-hidden rounded-4xl relative z-2 flex-1 ${
              focusedInput === "input4" ? "bg-white" : "hover:bg-[#bebebe]"
            }`}
            ref={el =>{buttonReferences.current[3]=el}}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(buttonReferences.current[3], inputReferences.current[3], "input4")}
          >
            <p className="absolute text-[0.8em] font-medium top-3 left-7">
              Who
            </p>
            <input
              type="text"
              placeholder="Add Guests"
              onBlur={handleInputBlur("input4")}
              className="relative -bottom-[8px] -left-2 outline-none"
              ref={el => inputReferences.current[3] = el}
            />
            <div className="rounded-full inline-block h-12 w-12 py-[0.6rem] bg-[#FF385C] text-white -mr-6 hover:bg-[#CC2C46]">
              <SearchIcon />
            </div>
          </button>
        </div>
      </div>
           
      {focInput ?<Calendar02 position={position} />:""}
    </>
  );
}
