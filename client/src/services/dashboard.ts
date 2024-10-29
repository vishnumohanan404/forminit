import axiosClient from ".";

export const fetchDashboard = async (data: {
  email: string;
  password: string;
}) => {
  const response = await axiosClient.post("/api/auth/login", data);
  return response.data;
};
