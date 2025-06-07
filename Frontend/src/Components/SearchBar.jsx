import { useState, useRef, useEffect } from "react";
import "./searchBar.css";

import { Calendar02 } from "./Calendar02";
export default function SearchBar() {
  const buttonRef = useRef(null);
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const ignoreNextBlur = useRef(false);

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
      <div className={`h-16 w-[50rem] block rounded-4xl df relative ${
          isFocused ? "bg-[#c1c1c1]" : "bg-white" } flex`}>
        <button
          ref={buttonRef}
          onClick={handleClick}
          onFocus={handleClick}
          className={`z-2 ripple-btn relative bottom-[1px] w-[15.5rem] h-[4.1rem] rounded-4xl overflow-hidden
            ${isFocused ? "bg-white" : "hover:bg-[#c7c7c7]"}`}>
          <p className="relative z-20 right-20 top-1 text-[0.8em] font-medium">
            Where
          </p>
          <input
            ref={inputRef}
            type="text"
            onFocus={() => handleClick}
            onBlur={handleBlur}
            placeholder="Search Destinations"
            className="w-[80%] outline-none relative z-20 bg-transparent input1"
          />
        </button>
        <div className="divide1 absolute h-[4.1rem] bg-[#aeadad] w-12 left-56 z-1">

        </div>
        <button className="input2 w-[8rem] h-[4.1rem] rounded-4xl relative z-2">
          <p className="relative text-[0.8em] font-medium">
            Check in
          </p>
          <input type="date" />
        </button>
        <button className="input3">
          <input type="date" name="" id="" />
        </button>
        <button className="input4">
          <input type="number" name="" id="" />
        </button>
      </div>
    </div>
      <Calendar02 /></>
  );
}