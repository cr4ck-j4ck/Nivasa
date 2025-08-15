import React, { useState } from "react";
import { X } from "lucide-react";
import UploadIcon from "./UploadImageIcon";

interface PhotoModalProps {
  onClose: () => void;
}

interface UploadedImage {
  id: string;
  file: File;
  url: string;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ onClose }) => {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const newImages = files
      .filter(file => file.type.startsWith("image/"))
      .map(file => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
      }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleDelete = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-opacity-40 bg-black/40">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl p-6 absolute top-70 animate-slideUp shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close icon */}
        <div className="flex justify-between items-center mb-4 text-center">
          <h2 className="text-2xl font-semibold w-full">Upload photos</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload area */}
        {images.length === 0 ? (
          <div
            className="border border-dashed border-gray-400 rounded-xl p-6 text-center"
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
          >
            <div className="flex flex-col items-center justify-center gap-3">
              <UploadIcon className="h-20" />
              <h3 className="font-medium text-lg">Drag and drop</h3>
              <p className="text-sm text-gray-500">or browse for photos</p>
              <label className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 mt-2 cursor-pointer">
                Browse Saiyyaara tu toh rutha nahi hai.. mausam jara sa 
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleBrowse}
                  className="hidden"
                />
              </label>
            </div>
          </div>   
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {images.map((image) => (
              <div key={image.id} className="relative rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt="preview"
                  className="object-cover w-full h-48 rounded-lg"
                />
                <button
                  onClick={() => handleDelete(image.id)}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-75"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer buttons */}
        <div className="flex justify-between items-center mt-6">
          <span className="text-gray-500 text-sm">Done</span>
          <button
            className={`${
              images.length > 0
                ? "bg-black text-white hover:bg-gray-900"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            } px-4 py-2 rounded-lg`}
            disabled={images.length === 0}
          >
            Upload
          </button>
        </div>
      </div>

      {/* Slide up animation */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PhotoModal;
