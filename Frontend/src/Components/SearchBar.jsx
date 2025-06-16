import { useState, useRef, useEffect } from "react";
import "./searchBar.css";
import { Calendar02 } from "./Calendar02";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "../assets/home.avif";
export default function SearchBar({ scroll: isScrolled }) {
  const elementRef = useRef(null);
  const inputReferences = useRef([]);
  const buttonReferences = useRef([]);
  let focInput = false;
  const [focusedInput, setFocusedInput] = useState(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [position, updatePosition] = useState(0);
  const calendarRef = useRef(null);

  const dynamicLeftClass = `${Math.floor(position)}`;
  useEffect(() => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      updatePosition(rect.x - 150);
    }
  }, []);

  useEffect(() => {
    if (!calendarRef.current) return;

    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        handleInputBlur("cal");
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

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
    input4: buttonReferences.current[3],
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
      if (button.contains(circle)) {
        circle.remove();
      }
      setFocusedInput(inputKey);
      inputRef?.focus();
    }, 300);
  };
  // understan this function
  // const handleInputBlur = (val) => (event) => {
  //   console.log("onCal ->");
  //   // if(val=="cal"){

  //   // }
  //     setTimeout(() => {
  //       if (!elementRef.current.contains(document.activeElement)) {
  //         setFocusedInput(null);
  //       }
  //     }, 0);
  // };

  function handleInputBlur(val) {
    const blurInputs = ["cal", "input1", "input4"];
    if (blurInputs.includes(val)) {
      setTimeout(() => {
        if (!elementRef.current.contains(document.activeElement)) {
          setFocusedInput(null);
        }
      }, 0);
    }
  }

  const handleMouseEnter = (e) => {
    e.currentTarget.previousElementSibling.style.visibility = "hidden";
  };
  const handleMouseLeave = (e) => {
    e.currentTarget.previousElementSibling.style.visibility = "";
  };
  if (focusedInput == "input2" || focusedInput == "input3") focInput = true;
  return (
    <>
      <div
        className={`flex justify-center items-center duration-500 ${
          isScrolled ? "h-0" : "h-24"
        }`}
      >
        <div
          ref={elementRef}
          className={`df h-16 w-[54rem] rounded-4xl relative flex ${
            focusedInput ? "bg-[#d6d6d6]" : "bg-white"
          } ${isScrolled ? "moveTop" : "moveDown"}`}
        >
          {/* Animated White Box */}
          {focusedInput && !isScrolled && (
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
            ref={(el) => {
              buttonReferences.current[0] = el;
            }}
            onClick={() =>
              handleClick(
                buttonReferences.current[0],
                inputReferences.current[0],
                "input1"
              )
            }
            className={`z-2 ripple-btn relative bottom-[1px] rounded-4xl overflow-hidden mr-2 ${
              focusedInput === "input1" ? "bg-white" : "hover:bg-[#bebebe]"
            } ${isScrolled ? "w-[10rem] h-12.5" : "w-[16.5rem] h-16.5"}`}
          >
            <p
              className={`absolute z-20 top-3 text-[0.8em] font-medium ${
                isScrolled ? "left-20 flex items-center" : "left-[1.7rem]"
              }`}
            >
              {isScrolled && (
                <img
                  src={HomeIcon}
                  alt="homeImage"
                  className="h-10 absolute -left-16 "
                />
              )}
              {isScrolled ? "AnyWhere" : "Where"}
            </p>
            <input
              ref={(el) => (inputReferences.current[0] = el)}
              type="text"
              onBlur={() => {
                handleInputBlur("input1");
              }}
              placeholder={`${!isScrolled ? "Where Destination" : ""}`}
              className={`w-[80%] outline-none relative z-20 bg-transparent input1 mt-3`}
            />
          </button>

          <div
            className={`${
              isScrolled ? "h-12 left-35" : "h-[4.1rem] left-60"
            } absolute w-14 z-1 flex justify-center`}
          >
            <div className="relative h-[70%] w-px top-[15%] bg-[#ababab]"></div>
          </div>

          {/* Button 2 */}
          <button
            className={`z-2 ripple-btn  rounded-4xl relative mr-2 overflow-hidden ${
              focusedInput === "input2" ? "bg-white" : "hover:bg-[#bebebe]"
            } ${isScrolled ? "w-[7rem]" : "w-[9rem]"}`}
            ref={(el) => {
              buttonReferences.current[1] = el;
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() =>
              handleClick(
                buttonReferences.current[1],
                inputReferences.current[1],
                "input2"
              )
            }
          >
            <p className="absolute text-[0.8em] font-medium top-3 left-6">
              {`${isScrolled ? "Anytime" : "Check in"}`}
            </p>
            <input
              type="text"
              placeholder={`${isScrolled ? "" : "Add Dates"}`}
              ref={(el) => (inputReferences.current[1] = el)}
              className="w-[80%] ml-4 relative outline-none top-2 cursor-pointer"
            />
          </button>

          <div
            className={`absolute ${
              isScrolled ? "left-[15rem] h-12" : "h-[4.1rem] left-[24.5rem]"
            } w-14 z-1 flex justify-center text-5xl bg-transparent`}
          >
            <div className="relative h-[70%] w-px top-[15%] bg-[#ababab]"></div>
          </div>

          {/* Button 3 */}
          {!isScrolled && (
            <>
              <button
                className={`w-[9rem] ripple-btn overflow-hidden rounded-4xl relative z-2  ${
                  focusedInput === "input3" ? "bg-white" : "hover:bg-[#bebebe]"
                } `}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                ref={(el) => {
                  buttonReferences.current[2] = el;
                }}
                onClick={() =>
                  handleClick(
                    buttonReferences.current[2],
                    inputReferences.current[2],
                    "input3"
                  )
                }
              >
                <p
                  className={`absolute text-[0.8em] font-medium top-3 left-5`}
                >
                  Check in
                </p>
                <input
                  type="text"
                  ref={(el) => (inputReferences.current[2] = el)}
                  placeholder="Add Dates"
                  className="w-[80%] ml-5 outline-none relative top-2 cursor-pointer"
                />
              </button>

              {/* Button 4 */}

              <div className="divide absolute h-[4.1rem] w-14 left-[33.9rem] z-1 flex justify-center">
                <div className="relative h-[70%] w-px top-[15%] bg-[#ababab]"></div>
              </div>
            </>
          )}
          <button
            className={`input4 ripple-btn overflow-hidden rounded-4xl relative z-2 flex-1 ${
              focusedInput === "input4" ? "bg-white" : "hover:bg-[#bebebe]"
            }`}
            ref={(el) => {
              buttonReferences.current[3] = el;
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() =>
              handleClick(
                buttonReferences.current[3],
                inputReferences.current[3],
                "input4"
              )
            }
          >
            <p className={`absolute text-[0.8em] font-medium top-3 ${isScrolled ? "" :"left-7"}`}>
              {isScrolled ? "Add Guests" : "Who"}
            </p>
            <input
              type="text"
              placeholder={`${isScrolled ? "" : "Add Guests"}`}
              onBlur={() => {
                handleInputBlur("input4");
              }}
              className={`relative -bottom-[8px] -left-2 outline-none `}
              ref={(el) => (inputReferences.current[3] = el)}
            />

            <div
              className={`rounded-full inline-block ${
                isScrolled ? "h-8 w-8 absolute right-2 bottom-2 pt-1" : "h-12 w-12 -mr-6 py-[0.6rem]"
              }  bg-[#FF385C] text-white  hover:bg-[#CC2C46]`}
            >
              <SearchIcon />
            </div>
          </button>
        </div>
      </div>
      {focInput ? (
        <div
          ref={calendarRef}
          className="relative w-fit"
          style={{ left: `${dynamicLeftClass}px` }}
        >
          <Calendar02 />
        </div>
      ) : (
        ""
      )}
    </>
  );
}
