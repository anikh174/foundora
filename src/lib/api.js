import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://foundora-server.vercel.app";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("fundora_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if ((status === 401 || status === 403) && typeof window !== "undefined") {
      const token = localStorage.getItem("fundora_token");
      if (token && status === 401) {
        localStorage.removeItem("fundora_token");
        localStorage.removeItem("fundora_user");
        window.dispatchEvent(new Event("fundora-auth-logout"));
      }
    }
    return Promise.reject(error);
  }
);

export const extractError = (error, fallback = "Something went wrong. Please try again.") => {
  return error?.response?.data?.message || error?.message || fallback;
};
