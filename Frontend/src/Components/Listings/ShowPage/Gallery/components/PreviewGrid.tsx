import React from "react";

interface PreviewGridProps {
  images: string[]; // expects at least 5 when available
  onOpen: (url?: string) => void;
}

// Landing preview grid: 1 large + 4 small
const PreviewGrid: React.FC<PreviewGridProps> = ({ images, onOpen }) => {
  if (!images || images.length === 0) return null;
  const main = images[0];
  const rest = images.slice(1, 5);

  return (
    <div className="flex lg:pr-10 justify-center sm:h-[20rem] md:h-[27rem] lg:h-[30rem] xl:h-[27rem] 2xl:h-[45rem] no-select w-full">
      <img
        src={main}
        alt="Gallery Image 1"
        className="w-[60%] lg:w-[50%] h-[90%] rounded-l-4xl object-cover cursor-pointer"
        onClick={() => onOpen(main)}
        loading="lazy"
      />

      <div className="grid grid-cols-2 grid-rows-2 gap-2 w-[40%] h-[90%] ml-2">
        {rest.map((url, index) => (
          <div key={index} className="h-[100%] w-[100%]">
            <img
              src={url}
              alt={`Gallery ${index + 2}`}
              className={`h-full w-full object-cover cursor-pointer ${index === 1 ? "rounded-tr-4xl" : ""} ${index === 3 ? "rounded-br-4xl" : ""}`}
              onClick={() => onOpen(url)}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviewGrid;