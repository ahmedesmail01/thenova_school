import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
  },
  withCredentials: true,
  withXSRFToken: true,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("XSRF-TOKEN");
  console.log("🔑 XSRF-TOKEN:", token);
  console.log("🍪 All cookies:", document.cookie);
  if (token) {
    config.headers["X-XSRF-TOKEN"] = token;
  }
  return config;
});

export default api;
