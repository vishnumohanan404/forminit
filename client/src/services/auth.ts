import axiosClient from ".";

export const signup = async (data: {
  fullName: string;
  email: string;
  password: string;
}) => {
  const response = await axiosClient.post("/api/auth/signup", data);
  return response?.data;
};

export const login = async (data: { email: string; password: string }) => {
  const response = await axiosClient.post("/api/auth/login", data);
  return response.data;
};

export const logout = async () => {
  try {
    return await axiosClient.post("/api/auth/logout"); // Adjust the URL based on your routing
    // Optionally, clear any local user state here
  } catch (error) {
    console.error("Error logging out", error);
    // Handle error if needed
  }
};

export const googleSignIn = async (data: { code: string }) => {
  const token = await axiosClient.post("/api/auth/google", { code: data.code });
  return token.data;
};
