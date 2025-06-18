import "./listingRow.css";
import ListingCard from "./ListingCard";
import React, { useState, useEffect, useRef } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
const cityAPI = import.meta.env.VITE_CITY_API;
import axios from "axios";

export default function ListingRow({ city }) {
  const [data, setData] = useState(null);
  const [blurLeft, setBlurLeft] = useState(false);
  const [blurRight, setBlurRight] = useState(true);
  const cardContainerRef = useRef(null);
  async function getData() {
    const jsonData = await axios.get(cityAPI+city);
    return jsonData.data;
  }

  function scrollLeft() {
    const container = cardContainerRef.current;
    if (!container) return;

    const canScrollLeft = Math.ceil(container.scrollLeft);

    if (canScrollLeft > 0) {
      container.scrollTo({
        left: container.scrollLeft - canScrollLeft,
        behavior: "smooth",
      });
    }
  }

  function scrollRight() {
    const container = cardContainerRef.current;
    if (!container) return;
    const canScrollRight = Math.floor(
      container.scrollWidth - (container.clientWidth + container.scrollLeft)
    );

    if (canScrollRight > 0) {
      container.scrollTo({
        left: container.scrollLeft + canScrollRight,
        behavior: "smooth",
      });
    }
  }

  useEffect(() => {
    getData().then((res) => {
      setData(res);
    });
  }, []);

  useEffect(() => {
    const func = (e) => {
      const container = cardContainerRef.current;
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
    if (cardContainerRef.current) {
      cardContainerRef.current.addEventListener("scroll", func);
    }
    return () => {
      if (cardContainerRef.current) {
        cardContainerRef.current.removeEventListener("scroll", func);
      }
    };
  }, []);

  return (
    <div className="listingRow">
      <div className="text-xl font-bold listingHead mb-5 flex justify-between">
        <h1>Stay In {city} &gt;</h1>
        <div className="option">
          <span
            className={`leftArrow navArrow ${
              blurLeft
                ? "cursor-pointer bg-[#e8e8e8] opacity-100 hover:bg-[#d5d5d5] "
                : "cursor-not-allowed opacity-20 "
            }`}
            onClick={scrollLeft}
          >
            <KeyboardArrowLeftIcon />
          </span>
          <span
            className={`rightArrow navArrow ${
              blurRight
                ? "cursor-pointer bg-[#e8e8e8] hover:bg-[#d5d5d5] "
                : "cursor-not-allowed opacity-20"
            }`}
            onClick={scrollRight}
          >
            <KeyboardArrowRightIcon />
          </span>
        </div>
      </div>
      <div className="cardContainer relative mb-10 flex" ref={cardContainerRef}>
        {data
          ? data.map((el, i) => (
              <ListingCard
                src={el.gallery["Bedroom 1"][0]}
                // src={demoThumbnail}
                key={i}
                city={el.location.city}
                price={el.price}
                id={el._id}
              />
            ))
          : ""}
      </div>
    </div>
  );
}
