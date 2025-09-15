import React, { createRef, useEffect, useMemo, useRef } from "react";

export type GalleryMap = Record<string, string[]>;

interface PhotoViewerProps {
  isOpen: boolean;
  visible: boolean;
  gallery: GalleryMap | null;
  initialCategory: string | null;
  onClose: () => void;
  renderSection: (category: string) => React.ReactNode; // render each category section
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({ isOpen, visible, gallery, initialCategory, onClose, renderSection }) => {
  const overlayBackgroundRef = useRef<HTMLDivElement>(null!);
  const categories = useMemo(() => (gallery ? Object.keys(gallery) : []), [gallery]);
  console.log(categories);
  const categoryRefs = useMemo(() => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {};
    categories.forEach((c) => (refs[c] = createRef<HTMLDivElement>()));
    return refs;
  }, [categories]);

  // Esc to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Body scroll lock6
  useEffect(() => {
    if (isOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);



  // Scroll to initial category when visible
  useEffect(() => {
    if (visible && initialCategory) {
      const id = setTimeout(() => {
        categoryRefs[initialCategory!]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 350);
      return () => clearTimeout(id);
    }
  }, [visible, initialCategory, categoryRefs]);

  const onBackgroundMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button !== 0) return; // left click only
    if (e.target === overlayBackgroundRef.current) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayBackgroundRef}
      className="fixed inset-0 z-50 bg-white/90 text-neutral-900 overflow-y-auto"
      onMouseDown={onBackgroundMouseDown}
      aria-modal
      role="dialog"
    >
      <div
        className={`min-h-full transform transition-transform duration-300 ease-out ${visible ? "translate-y-0" : "translate-y-full"}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close"
          className="absolute top-4 right-4 z-[60] text-neutral-700 hover:text-neutral-900 bg-black/5 hover:bg-black/10 rounded-full w-10 h-10 flex items-center justify-center text-2xl"
          onClick={onClose}
        >
          ×
        </button>

        {/* Top category bar */}
        <div className="w-full py-5 bg-white/80 backdrop-blur-md border-b border-neutral-200">
          <div className="mx-auto max-w-[100rem] px-4 py-3 custom-scroll-thin overflow-x-auto">
            <h1 className="text-neutral-900 text-sm font-extrabold weekdayPriceHead mb-4">Photo Tour</h1>
            <div className="flex gap-6">
              {categories.map((category) => {
                const coverUrl = gallery![category]?.[0];
                return (
                  <button
                    key={category}
                    className="flex-shrink-0 text-left group"
                    onClick={() => categoryRefs[category]?.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    title={category}
                  >
                    <div style={{ width: 220, height: 150 }} className="relative overflow-hidden rounded-lg ring-1 ring-neutral-200 group-hover:ring-neutral-400">
                      {coverUrl ? (
                        <img src={coverUrl} alt={category} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-neutral-100" />
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1">
                        <span className="text-xs text-white drop-shadow">{category}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-[100rem] px-6 md:px-8 pt-6 pb-16">
          {/* Render sections provided by parent, with scroll anchors */}
          {categories.map((category) => (
            <div key={category} ref={categoryRefs[category]}>
              {renderSection(category)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoViewer;