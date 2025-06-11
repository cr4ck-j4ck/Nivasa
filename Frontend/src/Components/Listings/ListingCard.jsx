import React, { useState, useEffect } from "react";
import "./listingCard.css";

export default function ListingCard() {
  const [data, setData] = useState(null);

  async function getData() {
    const rawData = await fetch("http://localhost:3000/listings");
    const jsonData = await rawData.json();
    return jsonData.gallery.bedroom[0];
  }

  // useEffect(() => {
  //   getData().then((res) => {
  //     setData(res); // Update state with fetched data
  //   });
  // }, []);

  return (
    <div className="w-63 h-69 bg-emerald-300 rounded-2xl">
      {data ? <img src={data} alt="image" /> : <p>Loading...</p>}
    </div>
  );
}
