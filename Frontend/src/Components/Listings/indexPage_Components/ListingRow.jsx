import "./listingRow.css";
import ListingCard from "./ListingCard";
import React, { useState, useEffect, useRef } from "react";
const cityAPI = import.meta.env.VITE_CITY_API;
import axios from "axios";
import Option from "@/Components/Option";

export default function ListingRow({ city }) {
  const [data, setData] = useState(null);
  const cardContainerRef = useRef(null);
  async function getData() {
    const jsonData = await axios.get(cityAPI+city);
    return jsonData.data;
  }
  useEffect(() => {
    getData().then((res) => {
      setData(res);
    });
  }, []);

  return (
    <div className="listingRow">
      <div className="text-xl font-bold listingHead mb-5 flex justify-between">
        <h1>Stay In {city} &gt;</h1>
        {cardContainerRef && <Option containerRef={cardContainerRef}/>}
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
