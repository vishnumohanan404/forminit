import axios from "axios";
import { routes } from "../Routes";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Optionally, add interceptors for error handling, token management, etc.
axiosClient.interceptors.response.use(
  response => response, // If the response is fine, just return it
  error => {
    const { response, config } = error;
    // Check if the response indicates an expired token
    if (response && response.status === 401 && !config.url.includes("/login")) {
      localStorage.removeItem("user");
      window.dispatchEvent(new CustomEvent("auth:logout"));
      routes.navigate("/");
    }

    return Promise.reject(error);
    // Reject the promise so that calling code can handle the error
  },
);

export default axiosClient;
