import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
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
      location.replace("/"); // or handle with router
    }

    return Promise.reject(error);
    // Reject the promise so that calling code can handle the error
  },
);

export default axiosClient;
