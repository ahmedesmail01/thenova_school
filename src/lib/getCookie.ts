import axios from "axios";

export const getCookie = () =>
  axios.get(`/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
