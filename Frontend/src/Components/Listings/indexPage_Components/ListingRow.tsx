import "./listingRow.css";
import ListingCard from "./ListingCard";
import React, { useState, useEffect, useRef } from "react";
const cityAPI = import.meta.env.VITE_CITY_API;
import axios from "axios";
import Option from "@/Components/Option";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ListingRow({ city }) {
  const [data, setData] = useState(null);
  const cardContainerRef = useRef(null);
  async function getData() {
    const jsonData = await axios.get(cityAPI + city);
    return jsonData.data;
  }
  useEffect(() => {
    getData().then((res) => {
      setData(res);
    });
  }, []);

  const skeletonCards = Array.from({ length: 7 }).map((_, i) => (
    <div key={i} className="card rounded-2xl mr-4 w-[16vw]">
      <Skeleton height="11.3vw" className="rounded-2xl" />
      <Skeleton height={20} width="80%" style={{ margin: "0.5rem 0" }} />
      <Skeleton height={14} width="60%" />
    </div>
  ));

  return (
    <div className="listingRow">
      <div className="text-xl font-bold listingHead mb-5 flex justify-between">
        <h1>Stay In {city} &gt;</h1>
        {cardContainerRef && <Option containerRef={cardContainerRef} />}
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
          : skeletonCards}
      </div>
    </div>
  );
}
