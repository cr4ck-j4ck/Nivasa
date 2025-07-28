import axios, { AxiosError } from "axios";
import { type TAuthForm } from "@/Forms/User Forms/loginSignup.schema";
import { type Iuser } from "@/@Types/interfaces";

const BackendAPI = import.meta.env.VITE_BACKEND_API;

export async function createUser(formData: TAuthForm) {
  const res = await axios.post(`${BackendAPI}/users/signup`, { formData });
  console.log("yeh dekh response aaya backend se :", res);
}

export const getUser = async (setUser: (user: Iuser) => void) => {
  try {
    const res = await axios.get(`${BackendAPI}/auth/status`, {
      withCredentials: true,
    });
    setUser(res.data);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data.message);
    }
  }
};
