import axios, { AxiosError } from "axios";
import { type TAuthForm } from "@/Forms/User Forms/loginSignup.schema";

const BackendAPI = import.meta.env.VITE_BACKEND_API;

export async function createUser(formData: TAuthForm) {
  const res = await axios.post(`${BackendAPI}/users/signup`, { formData });
  console.log("yeh dekh response aaya backend se :", res);
}

export const getUser = async () => {
  try {
    const res = await axios.get(`${BackendAPI}/auth/status`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 401) {
      throw new Error(err.response.data.message); 
    }
    return null;
  }
};