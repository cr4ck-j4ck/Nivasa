import './App.css'
import homeImage from './assets/home.avif';
import { useState } from 'react';
import homeVideo from './assets/house-twirl-selected.webm'
function App() {
  const [showVideo, setShowVideo] = useState(true); // initially video dikhana hai
  const handleVideoEnd = () => {
    setShowVideo(false); // video end hone par image dikhani hai
  };
  return (
    <nav className='h-50' >
      <div className="stickyPart justify-between flex">
        <div className='brand w-3xs'>
          <img src="/nivasaLogo-removebg-preview.png" alt="nivasaImg" className="block mx-auto h-20 mt-3" />
        </div>
        <div className='w-sm relative flex -left-30 h-25'>
          <div className="flex items-center">
            {showVideo ? (
              <video
                src={homeVideo} autoPlay onEnded={handleVideoEnd} muted className='h-17 mt-3 block mx-auto -mr-1'
              />
            ) : (
              <img
                src={homeImage} alt="Fallback" className='h-17 mt-3 block mx-auto -mr-1'
              />
            )}
            <p className='mt-2 font-bold'>Homes</p>
          </div>
        </div>
        <div className="right-options">
          <h1 className="text-3xl font-bold ">
            Hello world!
          </h1>
        </div>
      </div>
      <div className="belowOne flex justify-center items-center h-24">
        <div className='h-16 w-[53rem] block bg-blue-200 rounded-4xl'>
          <div className="input1 w-[17rem] h-16 rounded-l-4xl bg-amber-300 ripple-button">
            <input type="text" className='bg-pink-300 '/>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default App
