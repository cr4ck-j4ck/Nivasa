import "./listingRow.css";
import ListingCard from "./ListingCard";
import React, { useState, useEffect } from "react";

export default function ListingRow({ city }) {
  const [data, setData] = useState([]);

  async function getData() {
    const rawData = await fetch(`http://localhost:3000/listings/${city}`);
    const jsonData = await rawData.json();
    return jsonData;
  }

  useEffect(() => {
    getData().then((res) => {
      setData(res);
    });
  }, []);

  return (
    <>
      <h1 className="text-xl font-bold listingHead mb-5">
        Stay In {city} &gt;
      </h1>
      <div className="cardsContainer relative mb-10 flex ">
        {data
          ? data.map((el, i) => (
              <ListingCard
                src={el.gallery["Bedroom 1"][0]}
                key={i}
                city={city}
                price={el.price}
              />
            ))
          : ""}
      </div>
    </>
  );
}
