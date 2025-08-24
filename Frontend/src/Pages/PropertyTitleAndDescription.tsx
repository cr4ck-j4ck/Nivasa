import React, { useState, type ChangeEvent } from "react";

interface IpropertyTitleInput {
  heading: string;
  midHeading: string;
  textLimit: number;
}

export default function PropertyTitleInput({
  heading,
  midHeading,
  textLimit,
}: IpropertyTitleInput): React.JSX.Element {
  const [title, setTitle] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
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
        placeholder="Enter a catchy title..."
        maxLength={textLimit}
        value={title}
        onChange={handleChange}
      />

      <div className="text-sm text-gray-500 mt-2 text-right">
        {title.length}/32
      </div>
    </div>
  );
}
