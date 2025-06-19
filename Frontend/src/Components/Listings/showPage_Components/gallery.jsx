import { useEffect, useState,useRef} from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ({ gallery }) {
  const [imgArr, setImgArr] = useState(null);

  function getRandomURLs(urls) {
    const shuffled = [...urls].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }


  const hasSetImages = useRef(false);

  useEffect(() => {
    if (gallery && !hasSetImages.current) {
      const flatURLs = Object.values(gallery).flat();
      setImgArr(getRandomURLs(flatURLs));
      hasSetImages.current = true;
    }
  }, [gallery]);

  // 📦 Skeletons
  const skeletonMain = (
    <Skeleton height={482} width={640} borderRadius="2rem 0 0 2rem" />
  );
  const skeletonSmall = <Skeleton height={236} width={240} />;

  if (!imgArr) {
    return (
      <div className="flex">
        <div>{skeletonMain}</div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 w-[30rem] h-[29.8rem] ml-2">
          <div>{skeletonSmall}</div>
          <div>
            <Skeleton height={236} width={240} borderRadius="0 2rem 0 0" />
          </div>
          <div>{skeletonSmall}</div>
          <div>
            <Skeleton height={236} width={240} borderRadius="0 0 2rem 0"/>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
        <img
          src={imgArr[0]}
          alt="Gallery Image 1"
          className="w-[40rem] h-[30.1rem] rounded-l-4xl"
        />
      <div className="grid grid-cols-2 grid-rows-2 gap-4 w-[30rem] h-[29.8rem] ml-2">
        {imgArr.slice(1, 5).map((url, index) => (
          <div key={index} className="h-[14.7rem] w-[15rem]">
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
