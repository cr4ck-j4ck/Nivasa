import "./listingRow.css";
import ListingCard from "./ListingCard";
import { useState, useEffect, useRef } from "react";
import { getListingByCity } from "@/Services/listing.api";
import Option from "@/Components/Option";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface IlistingData {
  location: {
    city: string
  };
  _id: string;
  title: string;
  price: number;
  gallery: Record<string, string[]>
}

const listingHeadLines =[
  `Fall in love, right here in`,
  `Check in, get swept away in`,
  `One night, or forever, in`,
  `Lose yourself in the charm of`,
  `The bed's waiting for you in`,
  `Stay here, catch feelings in`,
  `Love at first check-in in`,
  `We'll keep the lights low in`,
  `Your next obsession starts in`,

  `Once you enter, you're mine in`,
  `Where the nights never end in`,
  `Lose yourself completely in`,
  `The city holds its secrets in`,
  `A stay you'll never recover from in`,
  `Come in, don't look back in`,
  `Check in… and never leave`,
  `Dark nights, warm hearts in`,

  `Come for the bed, stay for the chemistry in`,
  `Stays you'll fall for… hard in`,
  `One night? Or forever, in`,
  `Your type, but in a house in`,
  `Rooms that make hearts race in`,
  `Stay here, catch feelings in`,
  `The longer you stay, the harder you fall in`,
  `We're totally your vibe in`,
  `Commitment issues? Not with these stays in`
];

export default function ListingRow({ city }: { city: string }) {
  const [data, setData] = useState<IlistingData[] | null>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    getListingByCity(city).then((res) => {
      setData(res);
    });
  }, [city]);

  const skeletonCards = Array.from({ length: 7 }).map((_, i) => (
    <div key={i} className="card rounded-2xl mr-4 w-[16vw]">
      <Skeleton height="11.3vw" className="rounded-2xl" />
      <Skeleton height={20} width="80%" style={{ margin: "0.5rem 0" }} />
      <Skeleton height={14} width="60%" />
    </div>
  ));

  return (
    <div className="listingRow">
    <div className="text-xl listingHead ml-1 mb-5 flex justify-between">
        <h1>{listingHeadLines[Math.floor(Math.random() * listingHeadLines.length)]} {city} &gt;</h1>
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
