import axios from "axios";
const listingDataAPI = import.meta.env.VITE_LISTING_API
export async function  getListingData(id){
    const getData = await axios.get(listingDataAPI+id);
    return getData
}