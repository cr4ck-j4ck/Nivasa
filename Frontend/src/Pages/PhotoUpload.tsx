"use client";

import { useState } from "react";
import CameraPhoto from "@/assets/camera.avif";
import PhotoModal from "@/Components/HostingProcess/UploadPhotoModal";

export default function PhotoUpload() {
  const [clicked, setClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 400);
    setShowModal(true);
  };

  return (
    <div className="min-w-full h-full relative top-30">
      <style>{`
        @keyframes pump {
          0% { transform: scale(1); }
          25% { transform: scale(1.05); }
          50% { transform: scale(0.98); }
          75% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        .animate-pump {
          animation: pump 0.4s ease-in-out;
        }
      `}</style>

      <h1 className="showHead text-4xl mb-3 col-black">
        Add Some Photos of Your Property
      </h1>
      <h3 className="showHead text-lg max-w-[50rem]">
        You'll need 5 photos to get started. You can add more or make changes later.
      </h3>

      <div className="uploadDiv h-[30rem] w-[40rem] ml-5 rounded-2xl border-dashed border-black border-2 mt-20 bg-[#f7f7f7] flex items-center justify-center flex-col">
        <img src={CameraPhoto} className="h-60" alt="Camera Photo" />
        <button
          onClick={handleClick}
          className={`bg-white px-6 py-3 rounded-2xl border-2 showHead col-black hover:bg-gray-100 border-black transition-all duration-300 ${
            clicked ? "animate-pump" : ""
          }`}
        >
          Add Photos
        </button>
      </div>

      {/* Modal component */}
      {showModal && <PhotoModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
