import { useState, useRef, useEffect } from "react";
import "./searchBar.css";
import { Calendar02 } from "./Calendar02";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar() {
  const elementRef = useRef(null);
  const buttonRef = useRef(null);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRef4 = useRef(null);
  const buttonRef2 = useRef(null);
  const buttonRef3 = useRef(null);
  const buttonRef4 = useRef(null);

  // Focus state as an object
  const [focusStates, setFocusStates] = useState({
    input1: false,
    input2: false,
    input3: false,
    input4: false,
  });

  const ignoreNextBlur = useRef(false);
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

  // When clicking/focusing an input button
  const handleClick = (buttonRef, inputRef, inputKey) => {
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
      // Set focusStates: make all false except the clicked one true
      setFocusStates({
        input1: false,
        input2: false,
        input3: false,
        input4: false,
        [inputKey]: true,
      });
      inputRef.current?.focus();
    }, 300);
  };

  const handleInputBlur = (inputKey) => (e) => {
    setTimeout(() => {
      if (!elementRef.current.contains(document.activeElement)) {
        setFocusStates(prev => ({ ...prev, [inputKey]: false }));
      }
    }, 0);
  };

  const isAnyInputFocused =
    focusStates.input1 ||
    focusStates.input2 ||
    focusStates.input3 ||
    focusStates.input4;

  return (
    <>
      <div className="flex justify-center items-center h-24 ">
        <div
          id="myElement"
          ref={elementRef}
          className={`h-16 w-[54rem] rounded-4xl df relative ${
            isAnyInputFocused ? "bg-[#d6d6d6]" : "bg-white"
          } flex`}
        >
          <button
            ref={buttonRef}
            onClick={!focusStates.input1 ? () => handleClick(buttonRef, inputRef1, "input1") : () => {}}
            onFocus={!focusStates.input1 ? () => handleClick(buttonRef, inputRef1, "input1") : () => {}}
            className={`z-2 ripple-btn relative bottom-[1px] w-[16.5rem] h-[4.1rem] rounded-4xl overflow-hidden mr-2
            ${focusStates.input1 ? "bg-white" : "hover:bg-[#bebebe]"}`}
          >
            <p className="absolute z-20 top-3 text-[0.8em] font-medium left-[1.7rem]">
              Where
            </p>
            <input
              ref={inputRef1}
              type="text"
              onBlur={handleInputBlur("input1")}
              placeholder="Search Destinations"
              className="w-[80%] outline-none relative z-20 bg-transparent input1 mt-3"
            />
          </button>

          <div className="divide1 absolute h-[4.1rem] w-14 left-60 z-1 flex justify-center ">
            <div className="relative h-[70%] w-px top-[15%] bg-[#ababab]"></div>
          </div>

          <button
            className={`ripple-btn w-[9rem] h-[4rem] rounded-4xl relative z-2 mr-2 overflow-hidden ${
              focusStates.input2 ? "bg-white" : "hover:bg-[#bebebe]"
            }`}
            ref={buttonRef2}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={!focusStates.input2 ? () => handleClick(buttonRef2, inputRef2, "input2") : () => {}}
            onFocus={!focusStates.input2 ? () => handleClick(buttonRef2, inputRef2, "input2") : () => {}}
          >
            <p className="absolute text-[0.8em] font-medium top-3 left-6 ">
              Check in
            </p>
            <input
              type="text"
              placeholder="Add Dates"
              ref={inputRef2}
              onBlur={handleInputBlur("input2")}
              className="w-[80%] ml-4 relative outline-none top-2 cursor-pointer"
            />
          </button>

          <div className="divide absolute h-[4.1rem] w-14 left-[24.5rem] z-1 flex justify-center text-5xl">
            <div className="relative h-[70%] w-px top-[15%] bg-[#ababab]"></div>
          </div>

          <button
            className={`w-[9rem] ripple-btn overflow-hidden h-[4rem] rounded-4xl relative z-2 mr-2 ${
              focusStates.input3 ? "bg-white" : "hover:bg-[#bebebe]"
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={buttonRef3}
            onClick={!focusStates.input3 ? () => handleClick(buttonRef3, inputRef3, "input3") : () => {}}
            onFocus={!focusStates.input3 ? () => handleClick(buttonRef3, inputRef3, "input3") : () => {}}
          >
            <p className="absolute text-[0.8em] font-medium top-3 left-6 ">
              Check out
            </p>
            <input
              type="text"
              ref={inputRef3}
              placeholder="Add Dates"
              onBlur={handleInputBlur("input3")}
              className="w-[80%] ml-5 outline-none relative top-2 cursor-pointer"
            />
          </button>

          <div className="divide absolute  h-[4.1rem] w-14 left-[33.9rem] z-1 flex justify-center">
            <div className="relative h-[70%] w-px top-[15%] bg-[#ababab]"></div>
          </div>

          <button
            className={`input4 h-[4.1rem] ripple-btn overflow-hidden rounded-4xl relative z-2 flex-1 ${
              focusStates.input4 ? "bg-white" : "hover:bg-[#bebebe]"
            }`}
            ref={buttonRef4}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={!focusStates.input4 ? () => handleClick(buttonRef4, inputRef4, "input4") : () => {}}
            onFocus={!focusStates.input4 ? () => handleClick(buttonRef4, inputRef4, "input4") : () => {}}
          >
            <p className="absolute text-[0.8em] font-medium top-3 left-7 ">
              Who
            </p>
            <input
              type="text"
              placeholder="Add Guests"
              onBlur={handleInputBlur("input4")}
              className="relative -bottom-[8px] -left-2 outline-none"
              ref={inputRef4}
            />
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
