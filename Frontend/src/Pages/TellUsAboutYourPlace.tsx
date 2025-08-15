// src/pages/StepOne.tsx
import React from "react";

interface ITellUsAboutYourPlace{
  step : number;
  Heading:string;
  Description:string;
  video:string;
}

const StepOne: React.FC<ITellUsAboutYourPlace> = ({step,Heading,Description,video}) => {
  return (
    <div className="min-h-fit flex flex-col bg-white relative top-50">

      {/* Main Content */}
      <main className="flex flex-col-reverse md:flex-row flex-1 items-center justify-between px-6 md:px-20 gap-8  min-h-[643px]">
        {/* Left text */}
        <div className="max-w-lg becomeHostHeading min-w-80">
          <p className="text-lg font-bold ml-2 text-gray-800">Step {step}</p>
          <h1 className="text-4xl font-bold mt-2">{Heading}</h1>
          <p className="text-gray-600 mt-4 leading-relaxed font-semibold ml-2 text-xl">
            {Description}
          </p>
        </div>

        {/* Right image */}
        <video src={video} autoPlay muted className="sm:w-[50%] relative 2xl:bottom-20 z-5"></video>
      </main>
    </div>
  );
};

export default StepOne;
 