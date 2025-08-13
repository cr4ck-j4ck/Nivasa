import React from "react";

interface StepProps {
  number: number;
  title: string;
  description: string;
  image: string;
}

const Step: React.FC<StepProps> = ({ number, title, description, image }) => {
  return (
    <div className="stepDiv">
      <div className="w-[70%]">
        <div className="flex">
          <h3 className="text-2xl">{number}</h3>
          <h3 className="font-semibold ml-5 text-2xl">{title}</h3>
        </div>
        <p className="text-gray-700 text-lg ml-9 w-[80%]">{description}</p>
      </div>
      <img src={image} alt={title} className="w-33 h-33 object-contain" />
    </div>
  );
};

const GetStarted: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-white h-[100vh] overflow-hidden">
      {/* Content */}
      <div className="flex flex-col md:flex-row flex-1 p-6">
        {/* Left text */}
        <div className="flex items-center justify-center w-[50vw] becomeHostDiv">
          <h1 className="font-bold relative text-6xl becomeHostHeading">
            It's easy to get <br /> started on{" "}
            <span className="font-extrabold">Nivasa</span>
          </h1>
        </div>

        {/* Right steps */}
        <div className="rightSideContent">
          <Step
            number={1}
            title="Tell us about your place"
            description="Share some basic info, such as where it is and how many guests can stay."
            image="https://a0.muscache.com/4ea/air/v2/pictures/da2e1a40-a92b-449e-8575-d8208cc5d409.jpg"
          />
          <Step
            number={2}
            title="Make it stand out"
            description="Add 5 or more photos plus a title and description - we'll help you out."
            image="https://a0.muscache.com/4ea/air/v2/pictures/bfc0bc89-58cb-4525-a26e-7b23b750ee00.jpg"
          />
          <Step
            number={3}
            title="Finish up and publish"
            description="Choose a starting price, verify a few details, then publish your listing."
            image="https://a0.muscache.com/4ea/air/v2/pictures/c0634c73-9109-4710-8968-3e927df1191c.jpg"
          />
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
