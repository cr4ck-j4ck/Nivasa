import "./listingCard.css";

export default function ListingCard({src , city, price}) {

  return (
    <div className="w-63 h-72 rounded-2xl mr-3">
      <div className="showImg">{src ? <img src={src} alt="image" className="rounded-2xl h-60 w-full" /> : <p>Loading...</p>}</div>
      <p>Home in {city}</p>
      <p>₹{price} for 1night</p>
    </div>
  );
}
