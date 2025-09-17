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

// Host-specific API functions
export async function getHostListings(status?: string) {
  const url = status ? `${BackendAPI}/host/listings?status=${status}` : `${BackendAPI}/host/listings`;
  const response = await axios.get(url, {
    withCredentials: true,
  });
  return response.data;
}

export async function getHostStats() {
  const response = await axios.get(`${BackendAPI}/host/stats`, {
    withCredentials: true,
  });
  return response.data;
}

export async function getHostBookings() {
  const response = await axios.get(`${BackendAPI}/booking/host`, {
    withCredentials: true,
  });
  return response.data;
}
