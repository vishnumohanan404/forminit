import axios from "axios";
import { logout } from "./auth";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
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
      logout();
      // Optionally, show a notification to the user
      alert("Your session has expired. Please log in again.");
    }
    
    return Promise.reject(error);
    // Reject the promise so that calling code can handle the error
  }
);

export default axiosClient;
