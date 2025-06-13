import "./nav.css";
import homeImage from "../assets/home.avif";
import ballon from "../assets/hot_air_balloon.avif";
import homeVideo from "../assets/house-twirl-selected.webm";
import { useState, useEffect } from "react";
import SearchBar from "../Components/SearchBar";

function Nav() {
  const [showVideo, setShowVideo] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const handleVideoEnd = () => {
    setShowVideo(false);
  };
  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      let currentScroll = window.scrollY;
      console.log(currentScroll);
      if (currentScroll > lastScrollTop) {
        setIsScrolled(true);
      } else {
        console.log("ho gaya false");
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`duration-500 ${isScrolled ? "h-25" : "h-48"} bg-[#fbfbfb] z-1 sticky w-full top-0 shadow-[0px_1px_8px_rgb(100,100,100)]`}>

      <div className="justify-between flex">
        <div className="brand w-3xs">
          <img
            src="/Nivasa-removebg-preview.png"
            alt="nivasaImg"
            className="block mx-auto h-20 mt-3"
          />
        </div>
        <div className="w-sm relative flex -left-30">
          <div className={`flex items-center ${isScrolled ? "mTop" : "mDown"}`}>
            <div className="flex items-center mr-5 cursor-pointer">
              {showVideo ? (
                <video
                  src={homeVideo}
                  autoPlay
                  onEnded={handleVideoEnd}
                  muted
                  className="h-17 mt-3 block mx-auto -mr-1"
                />
              ) : (
                <img
                  src={homeImage}
                  alt="Fallback"
                  className="h-17 mt-3 block mx-auto -mr-1"
                />
              )}
              <p className="mt-2 font-bold ">Homes</p>
            </div>
            <div className="flex items-center cursor-pointer">
              <img src={ballon} alt="hot Air Balloon" className="h-17" />
              <p className="mt-2 font-bold -ml-5">Experiences</p>
            </div>
          </div>
        </div>
        <div className="right-options">
          <h1 className="text-3xl font-bold ">Hello world!</h1>
        </div>
      </div>
      <SearchBar scroll={isScrolled} />
    </nav>
  );
}

export default Nav;
