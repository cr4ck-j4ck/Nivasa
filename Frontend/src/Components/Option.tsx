import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useState, useEffect } from "react";

interface Ioptions {
  containerRef: React.RefObject<HTMLDivElement | null>,
  classNames?: string,
}

export default function Option({ containerRef, classNames }: Ioptions) {
  const [blurLeft, setBlurLeft] = useState(false);
  const [blurRight, setBlurRight] = useState(false);
  function scrollLeft() {
    const container = containerRef?.current;
    if (!container) return;

    const canScrollLeft = Math.ceil(container.scrollLeft);

    if (canScrollLeft > 0) {
      container.scrollTo({
        left: container.scrollLeft - container.clientWidth,
        behavior: "smooth",
      });
    }
  }

  function scrollRight() {
    const container = containerRef?.current;
    if (!container) return;
    const canScrollRight = Math.floor(
      container.scrollWidth - (container.clientWidth + container.scrollLeft)
    );
    if (canScrollRight > 0) {
      container.scrollTo({
        left: container.scrollLeft + container.clientWidth,
        behavior: "smooth",
      });
    }
  }
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setTimeout(() => {
        const canScrollRight = Math.floor(
          container.scrollWidth - (container.clientWidth + container.scrollLeft)
        );
        if (canScrollRight > 0) {
          setBlurRight(true);
        }
      }, 100);
    }
    const func = () => {
      if (!container) return;

      const canScrollRight = Math.floor(
        container.scrollWidth - (container.clientWidth + container.scrollLeft)
      );
      if (canScrollRight > 0) {
        setBlurRight(true);
      } else {
        setBlurRight(false);
      }
      if (container.scrollLeft > 0) {
        setBlurLeft(true);
      } else {
        setBlurLeft(false);
      }
    };

    const containerSecond = containerRef.current;
    containerSecond?.addEventListener("scroll", func);
    return () => {
      container?.removeEventListener("scroll", func);
    };
  }, [containerRef]);
  return (
    <div className={`${classNames} forMobile`}>
      <span
        className={`leftArrow navArrow ${blurLeft
          ? "cursor-pointer bg-[#e8e8e8] opacity-100 hover:bg-[#d5d5d5] "
          : "cursor-not-allowed opacity-20 "
          }`}
        onClick={scrollLeft}
      >
        <KeyboardArrowLeftIcon />
      </span>
      <span
        className={`rightArrow navArrow ${blurRight
          ? "cursor-pointer bg-[#e8e8e8] hover:bg-[#d5d5d5] "
          : "cursor-not-allowed opacity-20"
          }`}
        onClick={scrollRight}
      >
        <KeyboardArrowRightIcon />
      </span>
    </div>
  );
}
