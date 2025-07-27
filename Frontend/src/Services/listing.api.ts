import axios from "axios";
const BackendAPI = import.meta.env.VITE_BACKEND_API;

export async function getListingData(id: string) {
  const getData = await axios.get(`${BackendAPI}/listing/${id}`, {
    withCredentials: true,
  });
  return getData;
}

export async function getListingByCity(city: string) {
  const jsonData = await axios.get(`${BackendAPI}/listingCard/${city}`, {
    withCredentials: true,
  });
  return jsonData.data;
}
