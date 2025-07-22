import "./listingCard.css";

interface IlistingCard{
  src: string;
  city: string;
  price:number;
  id:string;
}

export default function ListingCard({ src, city, price, id }:IlistingCard) {
  return (
    <div className="card rounded-2xl">
      <a href={`/room/${id}`} target="_blank">
        <div>
          {src ? (
            <img
              src={src}
              alt="image"
              className="showImg rounded-2xl h-[11.3vw] w-full"
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>  
        <p className="text-m font-semibold">Home in {city}</p>
        <p className="text-xs text-[#6e6e6e]">₹{price} for 1 night</p>
      </a>
    </div>
  );
}
