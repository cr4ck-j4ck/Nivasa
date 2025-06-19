import { useEffect, useState } from "react";
import "./gallery.css";

export default function ({ gallery }) {
  const [imgArr, setImgArr] = useState(null);
  function getRandomURLs(urls) {
    const selected = [];

    while (selected.length < 5 && urls.length > 0) {
      const randomIndex = Math.floor(Math.random() * urls.length);
      selected.push(urls[randomIndex]);
      urls.splice(randomIndex, 1);
    }
    return selected;
  }
  useEffect(()=>{
    if (gallery) {
    setImgArr(getRandomURLs(Object.values(gallery).flat()));
  }
  },[gallery]);
  return (
    <div>
      <div className="gallery flex">
        <div>
          <img
            src={imgArr ? imgArr[0] : "Loading.."}
            alt="Loading..."
            className="w-[40rem] rounded-l-4xl h-[30.1rem]"
          />
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 w-[30rem] h-[29.8rem] ml-2">
          {/* Image 2 */}
          <div className="bg-gray-200 h-[14.7rem] w-[15rem]">
            <img
              src={imgArr ? imgArr[1] : "Loading.."}
              alt="Loading..."
              className="h-full w-full"
            />
          </div>
          {/* Image 3 */}
          <div className="h-[14.7rem] w-[15rem]">
            <img
              src={imgArr ? imgArr[2] : "Loading.."}
              alt="Loading..."
              className="h-full w-full rounded-tr-4xl"
            />
          </div>
          {/* Image 4 */}
          <div className="bg-gray-200 h-[14.7rem] w-[15rem]">
            <img
              src={imgArr ? imgArr[3] : "Loading.."}
              alt="Loading..."
              className="h-full w-full"
            />
          </div>
          {/* Image 5 */}
          <div className=" h-[14.7rem] w-[15rem]">
            <img
              src={imgArr ? imgArr[4] : "Loading.."}
              alt="Loading..."
              className="h-full w-full rounded-br-4xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
