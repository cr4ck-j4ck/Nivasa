import "./nav.css";
import homeImage from "../assets/home.avif";
import balloon from "../assets/hot_air_balloon.avif";
import homeVideo from "../assets/house-twirl-selected.webm";
import { User, Home } from "lucide-react";
import { useState, useEffect } from "react";
import SearchBar from "../Components/SearchBar";
import { useLocation } from "react-router-dom";
import UserStore from "@/Store/UserStore";
import { useNavigate } from "react-router-dom";
interface INavprops {
  position?: string;
}

const Nav: React.FC<INavprops> = ({ position }) => {
  const location = useLocation();
  const [showVideo, setShowVideo] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const isGettingUser = UserStore((state) => state.isGettingUser);
  const user = UserStore((state) => state.user);
  const navigate = useNavigate();
  const handleVideoEnd = (): void => {
    setShowVideo(false);
  };
  const handleClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const handleHostClick = () => {
  if (user) {
      navigate("/dashboard/host");
    } else {
      navigate("/auth");
    }
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

  return (
    <nav
      className={`navbar ${position} ${
        isScrolled ? "shrink" : ""
      } bg-[#fbfbfb]`}
    >
      <div className="justify-between flex ml-10 brandImg">
        <a href="/" target="_blank">
          <img
            src="/Nivasa-removebg-preview.png"
            alt="nivasaImg"
            className="block mx-auto h-20 min-w-20 relative ml-4 mt-3"
            style={{ background: "transparent" }}
          />
        </a>
        <div className="w-sm relative flex centerNavBox">
          <div className={`flex items-center ${isScrolled ? "mTop" : "mDown"}`}>
            <div className="flex items-center cursor-pointer">
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
        {isGettingUser === "fullfilled" || isGettingUser === "idle" ? (
          <div className="right-options AuthDiv ">
            {/* Host Your Listing Button - Desktop */}
            <div className="hidden md:block mr-4 bg-red-500">
              <button
                onClick={handleHostClick}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <Home className="w-4 h-4" />
                <span>{user ? "Host Dashboard" : "Host Your Listing"}</span>
              </button>
            </div>
            
            {/* Mobile Host Button */}
            <div className="md:hidden mr-2">
              <button
                onClick={handleHostClick}
                className="flex items-center justify-center w-10 h-10 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label={user ? "Host Dashboard" : "Host Your Listing"}
              >
                <Home className="w-5 h-5" />
              </button>
            </div>

            <div
              className={`login flex justify-evenly items-center ${user ? "w-45" : "w-50"}`}
              onClick={handleClick}
            >
            {(user ? "Dashboard" : "Login / Signup")}<User size={30}/>
            </div>
          </div>
        ) : (
          <div className="flex justify-center space-x-2 m-10 mr-20">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
        )}
      </div>
      <SearchBar scroll={isScrolled} setIsScrolled={setIsScrolled} />
    </nav>
  );
};

export default Nav;
