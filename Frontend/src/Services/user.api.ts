import axios, { AxiosError } from "axios";
import type { Iuser, IlistingObj } from "@/@Types/interfaces";
const BackendAPI = import.meta.env.VITE_BACKEND_API;
import { type FormData } from "@/Components/Auth/AuthForm";

interface IcreateUser {
  uuid: string;
  sentMailResponse: string;
}

export async function createUser(
  formData: FormData
): Promise<IcreateUser | undefined> {
  try {
    const res = await axios.post(
      `${BackendAPI}/user/signup`,
      { formData },
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    if (err instanceof AxiosError && err.response?.data.message) {
      throw new Error(err.response.data.message);
    } else if (err instanceof AxiosError) {
      throw new Error(err.response?.data);
    } else {
      throw new Error("Some Error Occured on Backend.");
    }
  }
}

export async function loginUser(
  formData: FormData
): Promise<Iuser | undefined> {
  try {
    const res = await axios.post(
      `${BackendAPI}/user/login`,
      { formData },
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data);
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
      throw new Error(err.response.data);
    } else {
      throw new Error("Error Occurred ");
    }
  }
};

export const setupVerificationListener = (
  userId: string,
  onVerfied: () => void
) => {
  const eventSource = new EventSource(
    `${BackendAPI}/user/verification-stream/${userId}`
  );

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.verified) {
      onVerfied();
      eventSource.close();
    }
  };

  eventSource.onerror = () => {
    eventSource.close();
  };
};

export const addToWhislist = async (listingId: string) => {
  await axios.post(
    `${BackendAPI}/user/wishlist`,
    { listingId },
    { withCredentials: true }
  );
  return;
};

export const removeFromWishlist = async (listingId: string) => {
  await axios.delete(
    `${BackendAPI}/user/wishlist/${listingId}`,
    { withCredentials: true }
  );
  return;
};

export const getWishlist = async (): Promise<IlistingObj[]> => {
  const res = await axios.get(`${BackendAPI}/user/getWishlist`, {
    withCredentials: true,
  });
  return res.data;
};
