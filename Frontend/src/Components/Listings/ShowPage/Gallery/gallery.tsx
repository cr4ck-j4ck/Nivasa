import { useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useListingStore } from "@/Store/ListingStore";
import PreviewGrid from "./components/PreviewGrid";
import PhotoViewer, { type GalleryMap } from "./components/PhotoViewer";
import CategorySection from "./components/CategorySection";

const Gallery = (): React.JSX.Element => {
  const listing = useListingStore((state) => state.listingObj);
  const gallery: GalleryMap | null = listing ? (listing.gallery as GalleryMap) : null;

  // Flat images for the preview grid
  const flatList = useMemo(() => {
    if (!gallery) return [] as { category: string; url: string }[];
    return Object.entries(gallery).flatMap(([category, urls]) =>
      (urls || []).map((url) => ({ category, url }))
    );
  }, [gallery]);
  // Map url -> category for quick reverse lookup
  const urlToCategory = useMemo(() => {
    const map: Record<string, string> = {};
    flatList.forEach(({ category, url }) => {
      map[url] = category;
    });
    return map;
  }, [flatList]);
  // Pick 5 random images for the landing gallery
  const [imgArr, setImgArr] = useState<string[] | null>(null);
  function getRandomURLs(urls: string[]) {
    const shuffled = [...urls].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }
  useEffect(() => {
    if (gallery) {
      setImgArr(getRandomURLs(Object.keys(urlToCategory)));
    }
  }, [gallery, urlToCategory]);

  // Viewer (full-screen overlay) state & animation control
  const [viewerOpen, setViewerOpen] = useState(false); // mounted/unmounted
  const [viewerVisible, setViewerVisible] = useState(false); // slide animation state
  const [initialCategory, setInitialCategory] = useState<string | null>(null);


  const openViewer = (targetUrl?: string) => {
    if (!gallery) return;
    // Set initial category based on clicked image
    if (targetUrl) setInitialCategory(urlToCategory[targetUrl] || null);
    setViewerOpen(true);
    // allow next frame for transition
    requestAnimationFrame(() => setViewerVisible(true));
  };

  const closeViewer = () => {
    setViewerVisible(false);
    // wait for transition to finish
    setTimeout(() => setViewerOpen(false), 300);
  };

  // Close on Esc
  useEffect(() => {
    if (!viewerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeViewer();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [viewerOpen]);

  // Prevent background scroll when viewer is open
  useEffect(() => {
    if (viewerOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [viewerOpen]);

  // After viewer becomes visible, PhotoViewer will handle scrolling via anchors

  // Skeleton while we compute preview images
  if (!imgArr) {
    return (
      <div className="flex lg:pr-10 sm:h-[20rem] md:h-[27rem] lg:h-[30rem] xl:h-[30rem] 2xl:h-[32rem] no-select">
        {/* Left big image skeleton */}
        <div className="w-[60%] lg:w-[50%] h-[90%] rounded-l-4xl">
          <Skeleton height="100%" width="100%" borderRadius="2rem 0 0 2rem" />
        </div>

        {/* Right 2x2 grid skeletons */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2 w-[40%] h-[90%] ml-2">
          {[0, 1, 2, 3].map((_, index) => (
            <div key={index} className="h-full w-full overflow-hidden">
              <Skeleton
                height="100%"
                width="100%"
                borderRadius={index === 1 ? "0 2rem 0 0" : index === 3 ? "0 0 2rem 0" : "0"}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Preview grid (landing) */}
      <PreviewGrid images={imgArr} onOpen={openViewer} />

      {/* Full-screen Photo Viewer */}
      {viewerOpen && (
        <PhotoViewer
          isOpen={viewerOpen}
          visible={viewerVisible}
          gallery={gallery}
          initialCategory={initialCategory}
          onClose={closeViewer}
          renderSection={(category) => {
            const urls = gallery![category] || [];
            return <CategorySection category={category} urls={urls} />;
          }}
        />
      )}
    </>
  );
};

export default Gallery;
