import React, { useState, type ChangeEvent } from "react";
import { useHostingProcessStore } from "@/Store/HostingProcessStore";

interface IpropertyTitleInput {
  heading: string;
  midHeading: string;
  placeholder: string;
  textLimit: number;
}

export default function PropertyTitleInput({
  heading,
  midHeading,
  placeholder = "",
  textLimit,
}: IpropertyTitleInput): React.JSX.Element {
  const { listingInfo, setTitle: setStoreTitle, setDescription } = useHostingProcessStore();
  const [val, setVal] = useState<string>(listingInfo.title || "");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if(heading.includes("description")){
      const newDescription = e.target.value;
      setVal(newDescription);
      setDescription(newDescription);
    } else{
      const newTitle = e.target.value;
      setVal(newTitle);
      setStoreTitle(newTitle);
    }  
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative top-40">
      <h1 className="text-5xl font-bold mb-2">
        {heading}
      </h1>
      <p className="text-gray-500 my-4">
        {midHeading}
      </p>

      <textarea
        className="w-full border-2 border-gray-300 rounded-md p-4 text-lg resize-none h-59 focus:outline-none focus:ring-2 focus:ring-black"
        placeholder={placeholder}
        maxLength={textLimit}
        value={val}
        onChange={handleChange}
      />

      <div className="text-sm text-gray-500 mt-2 text-right">
        {val.length}/32
      </div>
    </div>
  );
}
