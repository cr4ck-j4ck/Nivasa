import axios from "axios";
const BackendAPI = import.meta.env.VITE_BACKEND_API;
export default async function createUserAccount(form: Iform) {
  const res = axios.post(`${BackendAPI}/user`, {}, { withCredentials: true });
}
