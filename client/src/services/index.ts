import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Optionally, add interceptors for error handling, token management, etc.
axiosClient.interceptors.response.use(
  (response) => response, // If the response is fine, just return it
  (error) => {
    const { response } = error;
    // Check if the response indicates an expired token
    if (response && response.status === 401) {
      // Log out the user
      // Implement this function to clear user data and redirect
      // localStorage.setItem("user", "");
      localStorage.removeItem("user"); // <-- add your var
      location.replace("/");
    }

    return Promise.reject(error);
    // Reject the promise so that calling code can handle the error
  }
);

export default axiosClient;
