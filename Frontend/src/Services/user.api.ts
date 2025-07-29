import axios, { AxiosError } from "axios";
import { type Iuser } from "@/@Types/interfaces";
const BackendAPI = import.meta.env.VITE_BACKEND_API;
import {type FormData } from "@/Components/Auth/AuthForm";

export async function createUser(
  formData: FormData
): Promise<Iuser | undefined> {
  try {
    const res = await axios.post(`${BackendAPI}/users/signup`, { formData },{withCredentials:true});
    return res.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response?.data.message) {
      throw new Error(err.response.data.message);
    }
  }
}

export async function loginUser(
  formData: FormData
): Promise<Iuser | undefined> {
  try {
    const res = await axios.post(
      `${BackendAPI}/users/login`,
      { formData },
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response?.data.message) {
      throw new Error(err.response.data.message);
    }
  }
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
