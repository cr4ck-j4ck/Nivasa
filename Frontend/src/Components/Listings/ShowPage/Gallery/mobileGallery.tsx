import React, { useState, useMemo } from 'react';
import { useListingStore } from '@/Store/ListingStore';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion, AnimatePresence } from 'framer-motion';

const SWIPE_THRESHOLD = 50;

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const MobileGallery: React.FC = () => {
  const listing = useListingStore((state) => state.listingObj);
  const gallery = listing?.gallery;

  const allImages = useMemo(() => {
    if (!gallery) return [];
    return Object.entries(gallery).flatMap(([category, urls]) =>
      (urls || []).map((url) => ({ category, url }))
    );
  }, [gallery]);

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    let newIndex = page + newDirection;
    if (newIndex < 0) {
      newIndex = allImages.length - 1;
    } else if (newIndex >= allImages.length) {
      newIndex = 0;
    }
    setPage([newIndex, newDirection]);
  };

  const goToImage = (index: number) => {
    const newDirection = index > page ? 1 : -1;
    setPage([index, newDirection]);
  };

  if (!allImages.length) {
    return (
      <div className="w-full h-64 sm:h-80 md:h-96 mb-4">
        <Skeleton height="100%" width="100%" borderRadius="1rem" />
      </div>
    );
  }

  const currentIndex = page;

  return (
    <div className="w-full mb-6">
      <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-gray-100 select-none">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={allImages[currentIndex].url}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute w-[97%] h-full object-cover"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -SWIPE_THRESHOLD) {
                paginate(1);
              } else if (swipe > SWIPE_THRESHOLD) {
                paginate(-1);
              }
            }}
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={() => paginate(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-lg transition-all duration-200 z-10"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => paginate(1)}
              className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-lg transition-all duration-200 z-10"
              aria-label="Next image"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
          {currentIndex + 1} / {allImages.length}
        </div>
      </div>

      {/* Pagination Dots */}
      {allImages.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {allImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-gray-800 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Category Label */}
      {allImages[currentIndex] && (
        <div className="text-center mt-3">
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {allImages[currentIndex].category}
          </span>
        </div>
      )}
    </div>
  );
};

export default MobileGallery;