import axios from "axios";
const listingDataAPI = import.meta.env.VITE_LISTING_API;
const listingCityAPI = import.meta.env.VITE_CITY_API;

export async function getListingData(id: string) {
  const getData = await axios.get(listingDataAPI + id);
  return getData;
}

export async function getListingByCity(city:string) {
  const jsonData = await axios.get(listingCityAPI + city);
  return jsonData.data;
}
