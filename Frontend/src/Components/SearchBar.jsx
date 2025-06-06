import { useState, useRef } from "react";
import "./searchBar.css";

export default function SearchBar() {
  const buttonRef = useRef(null);
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleClick = (e) => {
    console.log("hello");
    if (!isFocused) {
      const button = buttonRef.current;
      const circle = document.createElement("span");
      circle.classList.add("ripple");

      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      circle.style.width = (circle.style.height) = `${(size)}px`;
      circle.style.left = "50%";
      circle.style.top = "50%";
      circle.style.transform = "translate(-50%, -50%) scale(0)";

      button.appendChild(circle);

      setTimeout(() => {
        circle.remove();
        setIsFocused(true);
        inputRef.current?.focus();
      }, 300);
    }
  };

  return (
    <div className="flex justify-center items-center h-24 bg-red-800">
      <div
        className={`h-16 w-[50rem] block rounded-4xl df ${
          isFocused ? "bg-[#c1c1c1]" : "bg-white"
        }`}
      >
        <button
          ref={buttonRef}
          onClick={handleClick}
          onFocus={handleClick}
          className={`ripple-btn input1 relative w-[15.5rem] h-16 rounded-4xl overflow-hidden transition-colors duration-200 z-0 
    ${isFocused ? "bg-white" : "hover:bg-[#c7c7c7]"}`}
        >
          <p className="z-20 relative right-20 top-1 text-[0.8em] font-medium">
            Where
          </p>
          <input
            ref={inputRef}
            type="text"
            onBlur={() => setIsFocused(false)}
            className="w-[80%] outline-none relative z-20 bg-transparent"
            placeholder="Search Destinations"
          />
        </button>
      </div>
    </div>
  );
}
