import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import UploadIcon from "./UploadImageIcon";
import menPointingDown from "@/assets/men_pointing_down.png";
import { Plus } from "lucide-react";
import { useHostingProcessStore } from "@/Store/HostingProcessStore";
import { useShallow } from "zustand/react/shallow";
interface PhotoModalProps {
  onClose: () => void;
 nextFunc : React.Dispatch<React.SetStateAction<number>> ;
}


const PhotoModal: React.FC<PhotoModalProps> = ({ onClose ,nextFunc }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showMan, setShowMan] = useState(false);
  const dragCounter = useRef(0);
  const {images , setImages, removeImage} = useHostingProcessStore(useShallow(state => ({images : state.images, setImages: state.addImage, removeImage:state.removeImage}))) 

  // Global drag listeners for showing guide + preventing browser default
  useEffect(() => {
    const handleGlobalDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current++;
      setIsDragging(true);
      setShowMan(true);
    };

    const handleGlobalDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current--;
      if (dragCounter.current === 0) {
        setIsDragging(false);
        setShowMan(false);
      }
    };

    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault(); // Prevent browser from opening file
      dragCounter.current = 0;
      setIsDragging(false);
      setShowMan(false);
    };

    const preventDefaultAll = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener("dragover", preventDefaultAll);
    window.addEventListener("dragenter", handleGlobalDragEnter);
    window.addEventListener("dragleave", handleGlobalDragLeave);
    window.addEventListener("drop", handleGlobalDrop);

    return () => {
      window.removeEventListener("dragover", preventDefaultAll);
      window.removeEventListener("dragenter", handleGlobalDragEnter);
      window.removeEventListener("dragleave", handleGlobalDragLeave);
      window.removeEventListener("drop", handleGlobalDrop);
    };
  }, []);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files); // multiple supported
    handleFiles(files);
    dragCounter.current = 0;
    setIsDragging(false);
    setShowMan(false);
  };

  const handleFiles = (files: File[]) => {
    const newImages = files
      .filter((file) => file.type.startsWith("image/"))
      .map((file,i) => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        order:i
      }));
    setImages(newImages);
  };

  const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleDelete = (id: string) => {
    removeImage(id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-opacity-40 bg-black/40"
      onClick={onClose}
    >
      {showMan && (
        <img
          src={menPointingDown}
          alt="menPointingDown"
          className="absolute -top-3 h-[40rem] z-10 animate-bounceIn pointer-events-none"
        />
      )}

      <div
        className={`bg-white w-full max-w-xl rounded-3xl p-6 absolute animate-slideUp shadow-xl transition-all duration-300
    ${
      images.length <= 2
        ? "top-[20rem]"
        : images.length <= 4
        ? "top-[15rem]"
        : "top-[8rem]"
    }`}
        style={{
          maxHeight: "80vh",
        }}
        onClick={(e) => e.stopPropagation()}
        onDrop={handleDrop}
      >
        {/* Close icon */}
        <div className="flex justify-between items-center mb-4 text-center">
          <button
            onClick={onClose}
            className="hover:bg-gray-200 rounded-full p-2"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-semibold w-full">Upload photos</h2>
          <label
            htmlFor="fileUpload"
            className="hover:bg-gray-200 rounded-full p-2 cursor-pointer"
          >
            <Plus></Plus>
          </label>
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleBrowse}
          className="hidden"
          id="fileUpload"
        />
        {/* Upload area */}
        {images.length === 0 ? (
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 
              ${
                isDragging ? "border-blue-500 shadow-glow" : "border-gray-400"
              }`}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="flex flex-col items-center justify-center gap-3">
              <UploadIcon className="h-23" />
              <h3 className="font-bold text-xl">Drag and drop</h3>
              <p className="text-sm text-gray-500">or browse for photos</p>
              <label
                className="bg-black text-white px-6 text-lg py-3 rounded-lg hover:bg-gray-900 mt-2 cursor-pointer"
                htmlFor="fileUpload"
              >
                Browse
              </label>
            </div>
          </div>
        ) : (
          <div
            className={`grid grid-cols-2 gap-4 mb-4 transition-all duration-300 max-h-[50vh] overflow-y-auto pr-4`}
          >
            {images.map((image) => (
              <div
                key={image.id}
                className="relative rounded-lg overflow-hidden"
              >
                <img
                  src={image.url}
                  alt="preview"
                  className="object-cover w-full h-58 rounded-lg"
                />
                <div
                  className="bg-black absolute z-10 right-2 top-2 py-2 w-10 rounded-full cursor-pointer"
                  onClick={() => {
                    handleDelete(image.id);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="40px"
                    fill="#e3e3e3"
                  >
                    <path d="M267.33-120q-27.5 0-47.08-19.58-19.58-19.59-19.58-47.09V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-328 469.33h66.66v-386h-66.66v386Zm164 0h66.66v-386h-66.66v386ZM267.33-740v553.33V-740Z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer buttons */}
        <div className="flex justify-between items-center mt-6 ">
          <span className="text-gray-500 text-sm">Cancel</span>
          <button
            className={`${
              images.length > 4
                ? "bg-black text-white hover:bg-gray-900"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            } px-4 py-2 rounded-lg`}
            disabled={images.length <= 5}
            onClick={()=>{console.log("dekh toh hua hai kya call "); nextFunc(state => ++state)}}
          >
            Upload
          </button>
        </div>
      </div>

      {/* Animations */}
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
        .shadow-glow {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.7);
        }
        @keyframes bounceIn {
          0% {
            transform: translateY(-100%) scale(0.5);
            opacity: 0;
          }
          60% {
            transform: translateY(10%) scale(1.1);
            opacity: 1;
          }
          80% {
            transform: translateY(-5%) scale(0.95);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }
        .animate-bounceIn {
          animation: bounceIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PhotoModal;
