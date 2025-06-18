import { useParams } from "react-router-dom";
import Show from "@/Components/Listings/showPage_Components/show";
import { useEffect, useState } from "react";
import { getListingData } from "@/Services/lisitngService";

export default function () {
  const { listingId } = useParams({});
  const [listingObj, setlistingObj] = useState(null);
  useEffect(() => {
    getListingData(listingId).then((data) => {
      setlistingObj(data.data);
    });
  }, []);

  return (
    <div>
      <Show {...(listingObj || {title:"loading"})} />
    </div>
  );
}
