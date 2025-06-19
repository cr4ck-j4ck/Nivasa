import { useParams } from "react-router-dom";
import Gallery from "@/Components/Listings/showPage_Components/gallery";
import Description from "@/Components/Listings/showPage_Components/listingDesc"
import { useEffect, useState } from "react";
import { getListingData } from "@/Services/lisitngService";
import "./showListing.css"

export default function () {
  const { listingId } = useParams({});
  const [listingObj, setlistingObj] = useState(null);
  useEffect(() => {
    getListingData(listingId).then((data) => {
      console.log(data.data.title);
      setlistingObj(data.data);
    });
  }, []);

  return (
    <div className="w-full sm:max-w-[85vw] md:max-w-[92vw] lg:max-w-[95vw] 3xl:max-w-[60vw] mx-auto pt-10">      
      <h1 className="text-3xl showHead mb-6">{listingObj ? listingObj.title : "Loading..."}</h1>
      <Gallery {...(listingObj || null)} />
      <Description listingObj={(listingObj || null)}/>
    </div>
  );
}
