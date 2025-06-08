import "./nav.css";
import homeImage from "../assets/home.avif";
import homeVideo from "../assets/house-twirl-selected.webm";
import { useState } from "react";
import SearchBar from "../Components/SearchBar";

function Nav() {
  const [showVideo, setShowVideo] = useState(true);
    const handleVideoEnd = () => {
      setShowVideo(false);
    };
  return (
    <nav className="h-55 bg-[#f1f1f1]">
      <div className="stickyPart justify-between flex">
        <div className="brand w-3xs">
          <img
            src="/nivasaLogo-removebg-preview.png"
            alt="nivasaImg"
            className="block mx-auto h-20 mt-3"
          />
        </div>
        <div className="w-sm relative flex -left-30 h-25">
          <div className="flex items-center">
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
            <p className="mt-2 font-bold">Homes</p>
          </div>
        </div>
        <div className="right-options">
          <h1 className="text-3xl font-bold ">Hello world!</h1>
        </div>
      </div>
      <SearchBar/>
    </nav>
  );
}

export default Nav;
