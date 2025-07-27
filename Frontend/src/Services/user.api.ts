import axios from "axios";
import { type TAuthForm } from "@/Forms/Booking Forms/loginSignup.schema";

const BackendAPI = import.meta.env.VITE_BACKEND_API;

export async function createUser(formData: TAuthForm) {
  const res = await axios.post(`${BackendAPI}/users/signup`, { formData });
  console.log("yeh dekh response aaya backend se :",res);
}
