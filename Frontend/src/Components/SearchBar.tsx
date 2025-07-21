import { useState, useRef, useEffect } from "react";
import "./searchBar.css";
import { Calendar02 } from "./Calendar02";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "../assets/home.avif";


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


export default function SearchBar({ scroll: isScrolled, setIsScrolled }: SearchBarProps) {

  const elementRef = useRef<HTMLDivElement>(null);
  const inputReferences = useRef<(HTMLInputElement | null)[]>([]);
  const buttonReferences = useRef<(HTMLButtonElement | null)[]>([]);
  
  let focInput: boolean = false; 
  

  const [focusedInput, setFocusedInput] = useState<InputKey | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({ left: 0, width: 0 });
  const [position, updatePosition] = useState<number>(0);
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRefs: ButtonRefs = {
    input1: buttonReferences.current[0] || null,
    input2: buttonReferences.current[1] || null,
    input3: buttonReferences.current[2] || null,
    input4: buttonReferences.current[3] || null,
  };  
  const inputRefs: InputRefs = {
    input1: inputReferences.current[0] || null,
    input2: inputReferences.current[1] || null,
    input3: inputReferences.current[2] || null,
    input4: inputReferences.current[3] || null,
  };  
  const dynamicLeftClass: string = `${Math.floor(position)}`;
  useEffect(() => {
    if (focusedInput && isScrolled) {
      buttonRefs[focusedInput]?.blur();
      inputRefs[focusedInput]?.blur();
      setFocusedInput(null);
    }
  }, [isScrolled]);

  useEffect(() => {
    if (!calendarRef.current) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
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
      updatePosition(rect.x + 50);
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


  const updateIndicatorPosition = (key: InputKey): void => {
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

  const handleClick = (
    button: HTMLButtonElement,
    inputRef: HTMLInputElement | null,
    inputKey: InputKey
  ): void => {
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

  function handleInputBlur(val: "cal" | "input1" | "input4"): void {
    const blurInputs: ("cal" | "input1" | "input4")[] = ["cal", "input1", "input4"];
    if (blurInputs.includes(val)) {
      setTimeout(() => {
        if (!elementRef.current?.contains(document.activeElement)) {
          setFocusedInput(null);
        }
      }, 0);
    }
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const previousElement = e.currentTarget.previousElementSibling as HTMLElement;
    if (previousElement) {
      previousElement.style.visibility = "hidden";
    }
  };
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const previousElement = e.currentTarget.previousElementSibling as HTMLElement;
    if (previousElement) {
      previousElement.style.visibility = "";
    }
  };
  
  if (focusedInput === "input2" || focusedInput === "input3") focInput = true;
  
  return (
    <>
      <div
        className={`flex justify-center items-center duration-500 ${
          isScrolled ? "h-0" : "h-24"
        } px-5`}
      >
        <div
          ref={elementRef}
          className={`df h-16 rounded-4xl relative flex ${
            focusedInput ? "bg-[#d6d6d6]" : "bg-white"
          } ${isScrolled ? "moveTop" : "moveDown"}`}
          onClick={isScrolled ? () => {
            if (isScrolled) {
              setIsScrolled(false);
            }
          } : () => {}}
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
                buttonReferences.current[0]!,
                inputReferences.current[0],
                "input1"
              )
            }
            className={`z-2 ripple-btn relative bottom-[1px] rounded-4xl overflow-hidden mr-2 ${
              focusedInput === "input1" ? "bg-white" : "hover:bg-[#bebebe]"
            } ${isScrolled ? "w-[10rem] h-12.5" : "w-[30%] min-w-[12rem] h-16.5"}`}
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
                  className="h-10 absolute -left-16"
                />
              )}
              {isScrolled ? "AnyWhere" : "Where"}
            </p>
            <input
              ref={(el) => {(inputReferences.current[0] = el)}}
              type="text"
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
            } relative z-1 flex justify-center`}
          >
            <div className="relative h-[70%] w-px top-[15%] bg-[#ababab]"></div>
          </div>

          {/* Button 2 */}
          <button
            className={`z-2 ripple-btn rounded-4xl relative mr-2 overflow-hidden ${
              focusedInput === "input2" ? "bg-white" : "hover:bg-[#bebebe]"
            } ${isScrolled ? "w-[7rem]" : "w-[15%] min-w-[8rem]"}`}
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
            <p className="absolute text-[0.8em] font-medium top-3 left-6">
              {`${isScrolled ? "Anytime" : "Check in"}`}
            </p>
            <input
              type="text"
              placeholder={`${isScrolled ? "" : "Add Dates"}`}
              ref={(el) => {(inputReferences.current[1] = el)}}
              className="w-[80%] ml-4 relative outline-none top-2 cursor-pointer"
            />
          </button>

          <div
            className={`relative ${
              isScrolled ? "h-12" : "h-[4.1rem] right-1"
            } z-1 flex justify-center text-5xl bg-transparent`}
          >
            <div className="relative h-[70%] w-px top-[15%] bg-[#ababab]"></div>
          </div>

          {/* Button 3 */}
          {!isScrolled && (
            <>
              <button
                className={`w-[15%] min-w-[8rem] ripple-btn overflow-hidden rounded-4xl relative z-2 ${
                  focusedInput === "input3" ? "bg-white" : "hover:bg-[#bebebe]"
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
                <p className="absolute text-[0.8em] font-medium top-3 left-5">
                  Check in
                </p>
                <input
                  type="text"
                  ref={(el) => {(inputReferences.current[2] = el)}}
                  placeholder="Add Dates"
                  className="w-[80%] ml-2 outline-none relative top-2 cursor-pointer"
                />
              </button>

              <div className="divide relative h-[4.1rem] left-1 z-1 flex justify-center ">
                <div className="relative h-[70%] top-[15%] bg-[#a8a8a8] w-px"></div>
              </div>
            </>
          )}

          <button
            className={`input4 ripple-btn overflow-hidden ml-2 rounded-4xl relative z-2 flex-1 min-w-[8rem] ${
              focusedInput === "input4" ? "bg-white" : "hover:bg-[#bebebe]"
            }`}
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
              className={`absolute text-[0.8em] font-medium top-3 ${
                isScrolled ? "" : "left-6.5"
              }`}
            >
              {isScrolled ? "Add Guests" : "Who"}
            </p>
            <input
              type="text"
              placeholder={`${isScrolled ? "" : "Add Guests"}`}
              onBlur={() => {
                handleInputBlur("input4");
              }}
              className={`relative -bottom-[8px] left-1 outline-none w-[80%]`}
              ref={(el) => {(inputReferences.current[3] = el)}}
            />

            <div
              className={`rounded-full flex ${
                isScrolled
                  ? "h-8 w-8 absolute right-2 bottom-2 pt-1 px-1"
                  : "h-12 w-12 absolute right-2 bottom-2 py-3 px-3"
              } bg-[#d93553] text-white hover:bg-[#fe3b5f] ${focusedInput ? "searchIncrease" : ""} duration-300`}
            >
              <SearchIcon />
              {focusedInput && <p className="pb-1 font-bold">Search</p>}
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
          <Calendar02 customClass="bla rounded-4xl"/>
        </div>
      ) : null}
    </>
  );
}