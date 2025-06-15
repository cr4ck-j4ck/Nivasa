import "./listingCard.css";

export default function ListingCard({src , city, price}) {

  return (
    <div className="card  rounded-2xl">
      <div className="showImg">{src ? <img src={src} alt="image" className="rounded-2xl h-[11.3vw] w-full" /> : <p>Loading...</p>}</div>
      <p className="text-m font-semibold">Home in {city}</p>
      <p>₹{price} for 1night</p>
    </div>
  );
}
