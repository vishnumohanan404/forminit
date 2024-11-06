import axiosClient from ".";

export const fetchDashboard = async () => {
  const response = await axiosClient.get("/api/dashboard");
  return response.data;
};

