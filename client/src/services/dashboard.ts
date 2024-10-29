import axiosClient from ".";

export const fetchDashboard = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosClient.post("/api/auth/login", data);
    return response.data;
  } catch (error) {
    console.error("Error ", error);
  }
};
