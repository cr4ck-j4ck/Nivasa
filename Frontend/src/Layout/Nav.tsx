import "./nav.css";
import homeImage from "../assets/home.avif";
import balloon from "../assets/hot_air_balloon.avif";
import homeVideo from "../assets/house-twirl-selected.webm";
import { useState, useEffect } from "react";
import SearchBar from "../Components/SearchBar";
import { useLocation } from "react-router-dom";
import { useGlobalStore } from "@/Store/Global";

interface INavprops {
  position: string;
}

const Nav: React.FC<INavprops> = ({ position }) => {
  const location = useLocation();
  const [showVideo, setShowVideo] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const setShowLogin = useGlobalStore((state) => state.setShowLogin);
  const showLogin = useGlobalStore((state) => state.showLogin);

  const handleVideoEnd = (): void => {
    setShowVideo(false);
  };

  useEffect(() => {
    const lastScrollTop = 0;
    const handleScroll = (): void => {
      const currentScroll = window.scrollY;
      setIsScrolled(currentScroll > lastScrollTop);
    };
    if (location.pathname === "/") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (showLogin) {
      document.body.style.overflowY = "hidden"; // Disable scroll
    } else {
      document.body.style.overflowY = "auto"; // Re-enable scroll
    }

    // Clean up in case component unmounts
    return () => {
      document.body.style.overflowY= "auto";
    };
  }, [showLogin]);

  return (
    <nav
      className={`navbar ${position} h-[12rem] ${
        isScrolled ? "shrink" : ""
      } bg-[#fbfbfb]`}
    >
      <div className="justify-between flex ml-10">
        <a href="/" target="_blank">
          <img
            src="/Nivasa-removebg-preview.png"
            alt="nivasaImg"
            className="block mx-auto h-20 mt-3"
          />
        </a>
        <div className="w-sm relative flex left-20">
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
              <img src={balloon} alt="hot Air Balloon" className="h-17" />
              <p className="mt-2 font-bold -ml-5">Experiences</p>
            </div>
          </div>
        </div>
        <div className="right-options">
          <div className="login text-xl" onClick={() => setShowLogin(true)}>
            Login
          </div>
        </div>
      </div>
      <SearchBar scroll={isScrolled} setIsScrolled={setIsScrolled} />
    </nav>
  );
};

export default Nav;
