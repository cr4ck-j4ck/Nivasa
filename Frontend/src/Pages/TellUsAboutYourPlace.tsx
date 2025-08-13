// src/pages/StepOne.tsx
import React from "react";
import firstVideo from "@/assets/first.mp4"

const StepOne: React.FC = () => {
  return (
    <div className="min-h-fit flex flex-col bg-white relative top-50">

      {/* Main Content */}
      <main className="flex flex-col-reverse md:flex-row flex-1 items-center justify-between px-6 md:px-20 gap-8  min-h-[643px]">
        {/* Left text */}
        <div className="max-w-lg becomeHostHeading min-w-80">
          <p className="text-lg font-bold ml-2 text-gray-800">Step 1</p>
          <h1 className="text-4xl font-bold mt-2">Tell us about your place</h1>
          <p className="text-gray-600 mt-4 leading-relaxed font-semibold ml-2 text-xl">
            In this step, we'll ask you which type of property you have and if
            guests will book the entire place or just a room. Then let us know
            the location and how many guests can stay.
          </p>
        </div>

        {/* Right image */}
        <video src={firstVideo} autoPlay muted className="sm:w-[50%] relative 2xl:bottom-20 z-5"></video>
      </main>
    </div>
  );
};

export default StepOne;
 