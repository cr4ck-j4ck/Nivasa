import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useListingStore } from "@/Store/ListingStore";

const Gallery=  () : React.JSX.Element => {
  const listing = useListingStore(state => state.listingObj)
  const [imgArr, setImgArr] = useState<string[] | null>(null);
  const gallery = listing ? listing.gallery : null;

  function getRandomURLs(urls:string[]) {
    const shuffled = [...urls].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }

  useEffect(() => {
    if (gallery) {
      const flatURLs = Object.values(gallery).flat();
      setImgArr(getRandomURLs(flatURLs));
    }
  }, [gallery]);

  if (!imgArr) {
    return (
      <div className="flex lg:pr-10 sm:h-[20rem] md:h-[27rem] lg:h-[30rem] xl:h-[30rem] 2xl:h-[32rem] no-select">
      {/* Left big image skeleton */}
      <div className="w-[60%] lg:w-[50%] h-[90%]  rounded-l-4xl">
        <Skeleton height="100%" width="100%" borderRadius="2rem 0 0 2rem" />
      </div>

      {/* Right 2x2 grid skeletons */}
      <div className="grid grid-cols-2 grid-rows-2 gap-2 w-[40%] h-[90%] ml-2">
        {[0, 1, 2, 3].map((_, index) => (
          <div key={index} className="h-full w-full overflow-hidden">
            <Skeleton
              height="100%"
              width="100%"
              borderRadius={
                index === 1
                  ? "0 2rem 0 0"
                  : index === 3
                  ? "0 0 2rem 0"
                  : "0"
              }
            />
          </div>
        ))}
      </div>
    </div>
    );
  }

  return (
    <div className="flex lg:pr-10 justify-center sm:h-[20rem] md:h-[27rem] lg:h-[30rem] xl:h-[27rem] 2xl:h-[45rem] no-select w-full">
      <img
        src={imgArr[0]}
        alt="Gallery Image 1"
        className="w-[60%] lg:w-[50%] h-[90%]  rounded-l-4xl"
      />
      <div className="grid grid-cols-2 grid-rows-2 gap-2 w-[40%] h-[90%] ml-2">
        {imgArr.slice(1, 5).map((url, index) => (
          <div key={index} className="h-[100%] w-[100%]">
            <img
              src={url}
              alt={`Gallery ${index + 2}`}
              className={`h-full w-full ${
                index === 1 ? "rounded-tr-4xl" : ""
              } ${index === 3 ? "rounded-br-4xl" : ""}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
export default Gallery;