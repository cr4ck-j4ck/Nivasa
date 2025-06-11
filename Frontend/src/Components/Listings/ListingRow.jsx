import "./listingRow.css";
import ListingCard from "./ListingCard";

export default function ListingRow({city}) {
  console.log("bhai idhar", city);
  return (
    <>
    <h1>Stay In {city} &gt;</h1>
      <ListingCard />
    </>
  );
}
