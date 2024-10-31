import { useState } from "react";
import axiosClient from "@/services"; // Import axios instance with interceptors

interface LoginData {
  email: string;
  password: string;
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosClient.post("/login", data, {
        withCredentials: true,
      });

      console.log("Login successful", response.data);
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
