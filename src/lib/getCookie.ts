import axios from "axios";

export const getCookie = () =>
  axios.get(`${import.meta.env.VITE_API_BASE}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
